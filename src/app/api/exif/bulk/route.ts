/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ExifTool } from "exiftool-vendored";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";
import JSZip from "jszip";
import { getDeviceDefaultFileName } from "@/lib/metadata-utils";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const operation = formData.get("operation") as string;
    const metadataStr = formData.get("metadata") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const zip = new JSZip();
    const results: Array<{ name: string; originalName: string; status: "ok" | "error"; message?: string }> = [];

    // Build write options based on operation
    let writeOptions: Record<string, any> = {};

    if (operation === "remove_all") {
      writeOptions = { all: "" };
    } else if (operation === "remove_gps") {
      writeOptions = { GPSLatitude: "", GPSLongitude: "", GPSAltitude: "", GPSLatitudeRef: "", GPSLongitudeRef: "", GPSAltitudeRef: "" };
    } else if (operation === "edit" && metadataStr) {
      const newMetadata: Record<string, any> = JSON.parse(metadataStr);
      // Map human-readable field names to exiftool tag names
      const FIELD_MAP: Record<string, string> = {
        Author: "Artist",
        Description: "ImageDescription",
        CameraMake: "Make",
        CameraModel: "Model",
        LensModel: "LensModel",
        Software: "Software",
        City: "City",
        Country: "Country",
      };
      for (const [key, value] of Object.entries(newMetadata)) {
        if (value !== undefined && value !== null) {
          const stringVal = String(value).trim();
          if (stringVal !== "") {
            const mappedKey = FIELD_MAP[key] || key;
            writeOptions[mappedKey] = stringVal;
          }
        }
      }
      // Handle GPS as floats
      if (newMetadata.GPSLatitude && newMetadata.GPSLongitude) {
        writeOptions.GPSLatitude = parseFloat(String(newMetadata.GPSLatitude));
        writeOptions.GPSLongitude = parseFloat(String(newMetadata.GPSLongitude));
      }
    }

    const et = new ExifTool();
    try {
      console.log(`Bulk API: Starting processing of ${files.length} files...`);
      // Process files sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const tempId = `${Date.now()}_${i}`;
        // Sanitize filename
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const inputPath = join(os.tmpdir(), `bulk_${tempId}_${safeName}`);

        console.log(`Bulk API: Writing file ${i+1}/${files.length} to temp path: ${inputPath}`);
        await writeFile(inputPath, buffer);

        let finalName = file.name;
        if (operation === "edit") {
          const ext = file.name.split('.').pop() || "jpg";
          finalName = getDeviceDefaultFileName(
            writeOptions.Make,
            writeOptions.Model,
            writeOptions.DateTimeOriginal,
            i,
            ext
          );
        }

        try {
          console.log(`Bulk API: Running exiftool write on ${inputPath} with options:`, writeOptions);
          await et.write(inputPath, writeOptions, ["-overwrite_original"]);
          console.log(`Bulk API: Exiftool write completed for ${file.name}`);
          const modifiedBuffer = await readFile(inputPath);
          zip.file(finalName, modifiedBuffer);
          results.push({ name: finalName, originalName: file.name, status: "ok" });
        } catch (err) {
          console.error(`Failed to process ${file.name}`, err);
          // Still add the original so download doesn't lose files
          zip.file(finalName, buffer);
          results.push({ name: finalName, originalName: file.name, status: "error", message: "Processing failed, original included." });
        } finally {
          await unlink(inputPath).catch(() => {});
          await unlink(`${inputPath}_original`).catch(() => {});
        }
      }

      // Attach results manifest
      zip.file("_processing_log.json", JSON.stringify(results, null, 2));

      const zipData = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } });

      const okCount = results.filter(r => r.status === "ok").length;
      const errCount = results.length - okCount;

      return new NextResponse(zipData as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="exifforge_bulk_${files.length}_images.zip"`,
          "X-Results-Ok": okCount.toString(),
          "X-Results-Error": errCount.toString(),
        },
      });
    } finally {
      console.log("Bulk API: Ending ExifTool process...");
      await et.end().catch(console.error);
      console.log("Bulk API: ExifTool process ended.");
    }
  } catch (error: any) {
    console.error("Bulk API error:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
