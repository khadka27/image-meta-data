import { NextRequest, NextResponse } from "next/server";
import { ExifTool } from "exiftool-vendored";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";
import { getDeviceDefaultFileName } from "@/lib/metadata-utils";

// Map file extensions to MIME types for formats the browser may not recognize
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

export async function POST(req: NextRequest) {
  try {
    console.log("Edit API: Parsing form data...");
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const metadataStr = formData.get("metadata") as string;

    if (!file || !metadataStr) {
      console.log("Edit API: Missing file or metadata");
      return NextResponse.json({ error: "File and metadata are required" }, { status: 400 });
    }

    const newMetadata = JSON.parse(metadataStr);
    console.log("Edit API: Received metadata:", newMetadata);

    // Convert file to Buffer and save temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique temp file paths
    const tempId = Math.random().toString(36).substring(7);
    const inputPath = join(os.tmpdir(), `input_${tempId}_${file.name}`);
    
    console.log("Edit API: Writing temp file to:", inputPath);
    await writeFile(inputPath, buffer);

    // Prepare tags for exiftool
    const writeOptions: Record<string, any> = { ...newMetadata };
    
    // Handle specific mappings if the frontend sent legacy mapped names
    if (newMetadata.Author) { writeOptions.Artist = newMetadata.Author; delete writeOptions.Author; }
    if (newMetadata.Description) { writeOptions.ImageDescription = newMetadata.Description; delete writeOptions.Description; }
    if (newMetadata.Keywords && typeof newMetadata.Keywords === 'string') {
      writeOptions.Keywords = newMetadata.Keywords.split(',').map((k:string) => k.trim());
    }
    if (newMetadata.CameraMake) { writeOptions.Make = newMetadata.CameraMake; delete writeOptions.CameraMake; }
    if (newMetadata.CameraModel) { writeOptions.Model = newMetadata.CameraModel; delete writeOptions.CameraModel; }

    // Ensure GPS formatting
    if (newMetadata.GPSLatitude !== undefined && newMetadata.GPSLongitude !== undefined && newMetadata.GPSLatitude !== "" && newMetadata.GPSLongitude !== "") {
      writeOptions.GPSLatitude = parseFloat(newMetadata.GPSLatitude);
      writeOptions.GPSLongitude = parseFloat(newMetadata.GPSLongitude);
    }

    const et = new ExifTool();
    try {
      console.log("Edit API: Running exiftool write with options:", writeOptions);
      // Process with exiftool
      await et.write(inputPath, writeOptions);
      console.log("Edit API: exiftool write completed successfully.");
      
      const modifiedBuffer = await readFile(inputPath);
      
      // Cleanup
      await unlink(inputPath).catch(console.error);
      await unlink(`${inputPath}_original`).catch(console.error);

      console.log("Edit API: Returning modified buffer");
      const ext = file.name.split('.').pop() || "jpg";
      const finalName = getDeviceDefaultFileName(
        writeOptions.Make,
        writeOptions.Model,
        writeOptions.DateTimeOriginal || newMetadata.DateTimeOriginal,
        0,
        ext
      );
      // Return the file
      return new NextResponse(modifiedBuffer, {
        headers: {
          "Content-Type": getImageMimeType(file.name, file.type),
          "Content-Disposition": `attachment; filename="${finalName}"`,
        },
      });
    } catch (err) {
      console.error("Exiftool error:", err);
      await unlink(inputPath).catch(console.error);
      return NextResponse.json({ error: "Failed to edit image" }, { status: 500 });
    } finally {
      console.log("Edit API: Ending ExifTool process...");
      await et.end().catch(console.error);
      console.log("Edit API: ExifTool process ended.");
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
