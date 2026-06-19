/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ExifTool } from "exiftool-vendored";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";
import { getDeviceDefaultFileName } from "@/lib/metadata-utils";

type OutputFormat = "default" | "jpg" | "png" | "webp" | "avif" | "tiff";

export const maxDuration = 300;

function getImageMimeType(filename: string, fallback: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || "";
  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    webp: "image/webp", tiff: "image/tiff", tif: "image/tiff",
    gif: "image/gif", bmp: "image/bmp", ico: "image/x-icon",
    heic: "image/heic", heif: "image/heif", avif: "image/avif",
    svg: "image/svg+xml",
    cr2: "image/x-canon-cr2", cr3: "image/x-canon-cr3",
    nef: "image/x-nikon-nef", arw: "image/x-sony-arw",
    dng: "image/x-adobe-dng", orf: "image/x-olympus-orf",
    rw2: "image/x-panasonic-rw2", raf: "image/x-fuji-raf",
    pef: "image/x-pentax-pef",
  };
  return mimeMap[ext] || fallback || "application/octet-stream";
}

// ─── Sharp conversion helper ──────────────────────────────────────────────────
async function convertBuffer(
  inputBuffer: Buffer,
  format: OutputFormat,
  quality: number,
): Promise<{ buffer: Buffer; ext: string }> {
  if (format === "default") {
    return { buffer: inputBuffer, ext: "" };
  }

  const sharpMod = (await import("sharp")).default;
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

function swapExt(filename: string, newExt: string): string {
  if (!newExt) return filename;
  const base = filename.replace(/\.[^.]+$/, "");
  return `${base}.${newExt}`;
}

export async function POST(req: NextRequest) {
  let et: ExifTool | null = null;
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const metadataStr = formData.get("metadata") as string;
    
    const rawFmt = (formData.get("outputFormat") as string | null) ?? "default";
    const outputFormat: OutputFormat = ["default", "jpg", "png", "webp", "avif", "tiff"].includes(rawFmt)
      ? (rawFmt as OutputFormat)
      : "default";
    const quality = Math.min(100, Math.max(10, parseInt(formData.get("quality") as string || "85", 10)));

    if (!file || !metadataStr) {
      return NextResponse.json({ error: "File and metadata are required" }, { status: 400 });
    }

    const newMetadata = JSON.parse(metadataStr);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const tempId = Math.random().toString(36).substring(7);
    const inputPath = join(os.tmpdir(), `input_${tempId}_${file.name}`);
    await writeFile(inputPath, buffer);

    const writeOptions: Record<string, any> = { ...newMetadata };
    
    if (newMetadata.Author) { writeOptions.Artist = newMetadata.Author; delete writeOptions.Author; }
    if (newMetadata.Description) { writeOptions.ImageDescription = newMetadata.Description; delete writeOptions.Description; }
    if (newMetadata.Keywords && typeof newMetadata.Keywords === 'string') {
      writeOptions.Keywords = newMetadata.Keywords.split(',').map((k:string) => k.trim());
    }
    if (newMetadata.CameraMake) { writeOptions.Make = newMetadata.CameraMake; delete writeOptions.CameraMake; }
    if (newMetadata.CameraModel) { writeOptions.Model = newMetadata.CameraModel; delete writeOptions.CameraModel; }

    if (newMetadata.GPSLatitude !== undefined && newMetadata.GPSLongitude !== undefined && newMetadata.GPSLatitude !== "" && newMetadata.GPSLongitude !== "") {
      writeOptions.GPSLatitude = parseFloat(newMetadata.GPSLatitude);
      writeOptions.GPSLongitude = parseFloat(newMetadata.GPSLongitude);
    }

    et = new ExifTool();
    try {
      await et.write(inputPath, writeOptions, ["-overwrite_original"]);
      
      let finalBuffer: Buffer = await readFile(inputPath);
      let finalExt = "";

      // ── Sharp conversion pass ────────────────────────────
      try {
        const converted = await convertBuffer(finalBuffer, outputFormat, quality);
        finalBuffer = converted.buffer;
        finalExt    = converted.ext;
      } catch (sharpErr) {
        console.warn(`Sharp conversion failed for ${file.name}:`, sharpErr);
      }

      await unlink(inputPath).catch(() => {});
      await unlink(`${inputPath}_original`).catch(() => {});

      const ext = file.name.split('.').pop() || "jpg";
      let finalName = getDeviceDefaultFileName(
        writeOptions.Make,
        writeOptions.Model,
        writeOptions.DateTimeOriginal || newMetadata.DateTimeOriginal,
        0,
        ext
      );

      if (finalExt) {
        finalName = swapExt(finalName, finalExt);
      }

      return new NextResponse(finalBuffer as unknown as BodyInit, {
        headers: {
          "Content-Type": finalExt ? getImageMimeType(finalName, file.type) : getImageMimeType(file.name, file.type),
          "Content-Disposition": `attachment; filename="${finalName}"`,
        },
      });
    } catch (err) {
      console.error("Exiftool error:", err);
      await unlink(inputPath).catch(() => {});
      
      // Try fallback format conversion
      try {
        let fallbackBuffer: Buffer = buffer;
        let fallbackName = file.name;
        if (outputFormat !== "default") {
           const converted = await convertBuffer(buffer, outputFormat, quality);
           fallbackBuffer = converted.buffer;
           if (converted.ext) fallbackName = swapExt(file.name, converted.ext);
        }
        return new NextResponse(fallbackBuffer as unknown as BodyInit, {
          headers: {
            "Content-Type": getImageMimeType(fallbackName, file.type),
            "Content-Disposition": `attachment; filename="${fallbackName}"`,
          },
        });
      } catch (fallbackErr) {
        return NextResponse.json({ error: "Failed to edit image" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (et) {
      await et.end().catch(console.error);
    }
  }
}
