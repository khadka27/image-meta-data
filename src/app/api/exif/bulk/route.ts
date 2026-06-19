/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ExifTool } from "exiftool-vendored";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";
import JSZip from "jszip";
import { getDeviceDefaultFileName } from "@/lib/metadata-utils";

// ─── Allowed output formats ───────────────────────────────────────────────────
type OutputFormat = "default" | "jpg" | "png" | "webp" | "avif" | "tiff";
const VALID_FORMATS: OutputFormat[] = ["default", "jpg", "png", "webp", "avif", "tiff"];

// Longest this route should run (Vercel limit is 300s on Pro)
export const maxDuration = 300;

// ─── Sharp conversion helper ──────────────────────────────────────────────────
async function convertBuffer(
  inputBuffer: Buffer,
  format: OutputFormat,
  quality: number,
): Promise<{ buffer: Buffer; ext: string }> {
  if (format === "default") {
    return { buffer: inputBuffer, ext: "" };
  }

  // Dynamically import sharp to avoid bundling issues
  const sharpMod = (await import("sharp")).default;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pipeline: any;

  switch (format) {
    case "jpg": {
      pipeline = sharpMod(inputBuffer).jpeg({ quality, mozjpeg: true });
      return { buffer: Buffer.from(await pipeline.toBuffer()), ext: "jpg" };
    }
    case "png": {
      pipeline = sharpMod(inputBuffer).png({ compressionLevel: 7, adaptiveFiltering: true });
      return { buffer: Buffer.from(await pipeline.toBuffer()), ext: "png" };
    }
    case "webp": {
      pipeline = sharpMod(inputBuffer).webp({ quality, effort: 4 });
      return { buffer: Buffer.from(await pipeline.toBuffer()), ext: "webp" };
    }
    case "avif": {
      pipeline = sharpMod(inputBuffer).avif({ quality, effort: 4 });
      return { buffer: Buffer.from(await pipeline.toBuffer()), ext: "avif" };
    }
    case "tiff": {
      pipeline = sharpMod(inputBuffer).tiff({ compression: "lzw" });
      return { buffer: Buffer.from(await pipeline.toBuffer()), ext: "tiff" };
    }
    default:
      return { buffer: inputBuffer, ext: "" };
  }
}

// ─── Swap file extension ──────────────────────────────────────────────────────
function swapExt(filename: string, newExt: string): string {
  if (!newExt) return filename;
  const base = filename.replace(/\.[^.]+$/, "");
  return `${base}.${newExt}`;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let et: ExifTool | null = null;
  try {
    const formData   = await req.formData();
    const files      = formData.getAll("files") as File[];
    const operation  = formData.get("operation") as string;
    const metadataStr= formData.get("metadata") as string | null;

    // New params
    const rawFmt    = (formData.get("outputFormat") as string | null) ?? "default";
    const outputFormat: OutputFormat = VALID_FORMATS.includes(rawFmt as OutputFormat)
      ? (rawFmt as OutputFormat)
      : "default";
    const quality   = Math.min(100, Math.max(10, parseInt(formData.get("quality") as string || "85", 10)));

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // ── Build ExifTool write-options ──────────────────────────────────────────
    let writeOptions: Record<string, any> = {};

    if (operation === "remove_all") {
      // "-all=" removes every tag; pass as extra args
      writeOptions = {};  // handled via extraArgs below
    } else if (operation === "remove_gps") {
      writeOptions = {
        GPSLatitude: "", GPSLongitude: "", GPSAltitude: "",
        GPSLatitudeRef: "", GPSLongitudeRef: "", GPSAltitudeRef: "",
        GPSPosition: "",
      };
    } else if (operation === "edit" && metadataStr) {
      const newMetadata: Record<string, any> = JSON.parse(metadataStr);
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
            writeOptions[FIELD_MAP[key] || key] = stringVal;
          }
        }
      }
      if (newMetadata.GPSLatitude && newMetadata.GPSLongitude) {
        writeOptions.GPSLatitude  = parseFloat(String(newMetadata.GPSLatitude));
        writeOptions.GPSLongitude = parseFloat(String(newMetadata.GPSLongitude));
      }
    }

    // ── Start ExifTool ────────────────────────────────────────────────────────
    et = new ExifTool({ taskTimeoutMillis: 60_000 });

    const zip = new JSZip();
    const results: Array<{
      name: string; originalName: string;
      status: "ok" | "error"; message?: string;
    }> = [];

    console.log(`Bulk API: ${files.length} files | op=${operation} | fmt=${outputFormat} | q=${quality}`);

    for (let i = 0; i < files.length; i++) {
      const file   = files[i];
      const bytes  = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const tempId   = `${Date.now()}_${i}`;
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const inputPath= join(os.tmpdir(), `bulk_${tempId}_${safeName}`);

      await writeFile(inputPath, buffer);

      // Decide final filename base
      let finalName = file.name;
      if (operation === "edit") {
        const ext = file.name.split(".").pop() || "jpg";
        finalName = getDeviceDefaultFileName(
          writeOptions.Make,
          writeOptions.Model,
          writeOptions.DateTimeOriginal,
          i,
          ext,
        );
      }

      try {
        // ── ExifTool pass ───────────────────────────────────────────────────
        const extraArgs = ["-overwrite_original"];
        if (operation === "remove_all") {
          // The proper way: write with tag "-all=" as an extra arg
          await et.write(inputPath, {}, ["-all=", "-overwrite_original"]);
        } else {
          await et.write(inputPath, writeOptions, extraArgs);
        }

        let finalBuffer: Uint8Array = await readFile(inputPath);

        // ── Sharp conversion + compression pass ────────────────────────────
        let finalExt = "";
        try {
          const converted = await convertBuffer(Buffer.from(finalBuffer), outputFormat, quality);
          finalBuffer = converted.buffer;
          finalExt    = converted.ext;
          console.log(`Bulk API [${i+1}/${files.length}]: converted ${file.name} → ${outputFormat || "default"} (${Math.round(finalBuffer.byteLength/1024)}KB)`);
        } catch (sharpErr) {
          // If Sharp fails (e.g. unsupported RAW), keep the ExifTool-processed buffer
          console.warn(`Sharp conversion failed for ${file.name}, keeping original format:`, sharpErr);
        }

        // Update extension in filename if converted
        if (finalExt) {
          finalName = swapExt(finalName, finalExt);
        }

        zip.file(finalName, finalBuffer);
        results.push({ name: finalName, originalName: file.name, status: "ok" });

      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);

        // Try to at least run format conversion on the original
        let fallbackBuffer: Uint8Array = buffer;
        let fallbackName   = finalName;
        try {
          if (outputFormat !== "default") {
            const converted  = await convertBuffer(buffer, outputFormat, quality);
            fallbackBuffer   = converted.buffer;
            if (converted.ext) fallbackName = swapExt(finalName, converted.ext);
          }
        } catch { /* keep raw original */ }

        zip.file(fallbackName, fallbackBuffer);
        results.push({
          name: fallbackName, originalName: file.name,
          status: "error", message: "Metadata processing failed; original/converted included.",
        });
      } finally {
        // Cleanup temp files
        await unlink(inputPath).catch(() => {});
        await unlink(`${inputPath}_original`).catch(() => {});
      }
    }

    // ── Build ZIP ─────────────────────────────────────────────────────────────
    zip.file("_processing_log.json", JSON.stringify(results, null, 2));

    const zipData  = await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: { level: outputFormat === "default" ? 6 : 4 }, // already compressed → lighter zip
    });

    const okCount  = results.filter(r => r.status === "ok").length;
    const errCount = results.length - okCount;

    const fmtLabel = outputFormat === "default" ? "orig" : outputFormat;
    return new NextResponse(zipData as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="exifforge_bulk_${files.length}_${fmtLabel}.zip"`,
        "X-Results-Ok":    okCount.toString(),
        "X-Results-Error": errCount.toString(),
      },
    });

  } catch (error: any) {
    console.error("Bulk API error:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  } finally {
    if (et) {
      await et.end().catch(console.error);
    }
  }
}
