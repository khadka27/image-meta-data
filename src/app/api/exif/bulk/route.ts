import { NextRequest, NextResponse } from "next/server";
import { exiftool } from "exiftool-vendored";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";
import JSZip from "jszip";

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
    const results: Array<{ name: string; status: "ok" | "error"; message?: string }> = [];

    // Build write options based on operation
    let writeOptions: Record<string, any> = {};

    if (operation === "remove_all") {
      writeOptions = { all: "" };
    } else if (operation === "remove_gps") {
      writeOptions = { GPSLatitude: "", GPSLongitude: "", GPSAltitude: "", GPSLatitudeRef: "", GPSLongitudeRef: "", GPSAltitudeRef: "" };
    } else if (operation === "edit" && metadataStr) {
      const newMetadata: Record<string, string> = JSON.parse(metadataStr);
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
        if (value && value.trim() !== "") {
          const mappedKey = FIELD_MAP[key] || key;
          writeOptions[mappedKey] = value.trim();
        }
      }
      // Handle GPS as floats
      if (newMetadata.GPSLatitude && newMetadata.GPSLongitude) {
        writeOptions.GPSLatitude = parseFloat(newMetadata.GPSLatitude);
        writeOptions.GPSLongitude = parseFloat(newMetadata.GPSLongitude);
      }
    }

    // Process files sequentially
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const tempId = `${Date.now()}_${i}`;
      // Sanitize filename
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const inputPath = join(os.tmpdir(), `bulk_${tempId}_${safeName}`);

      await writeFile(inputPath, buffer);

      try {
        await exiftool.write(inputPath, writeOptions, ["-overwrite_original"]);
        const modifiedBuffer = await readFile(inputPath);
        zip.file(file.name, modifiedBuffer);
        results.push({ name: file.name, status: "ok" });
      } catch (err) {
        console.error(`Failed to process ${file.name}`, err);
        // Still add the original so download doesn't lose files
        zip.file(file.name, buffer);
        results.push({ name: file.name, status: "error", message: "Processing failed, original included." });
      } finally {
        await unlink(inputPath).catch(() => {});
        await unlink(`${inputPath}_original`).catch(() => {});
      }
    }

    // Attach results manifest
    zip.file("_processing_log.json", JSON.stringify(results, null, 2));

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } });

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="exifforge_bulk_${files.length}_images.zip"`,
        "X-Results": JSON.stringify(results),
      },
    });
  } catch (error) {
    console.error("Bulk API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
