import { NextRequest, NextResponse } from "next/server";
import { exiftool } from "exiftool-vendored";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const metadataStr = formData.get("metadata") as string;

    if (!file || !metadataStr) {
      return NextResponse.json({ error: "File and metadata are required" }, { status: 400 });
    }

    const newMetadata = JSON.parse(metadataStr);

    // Convert file to Buffer and save temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique temp file paths
    const tempId = Math.random().toString(36).substring(7);
    const inputPath = join(os.tmpdir(), `input_${tempId}_${file.name}`);
    
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

    try {
      // Process with exiftool
      await exiftool.write(inputPath, writeOptions);
      
      const modifiedBuffer = await readFile(inputPath);
      
      // Cleanup
      await unlink(inputPath).catch(console.error);
      await unlink(`${inputPath}_original`).catch(console.error);

      // Return the file
      return new NextResponse(modifiedBuffer, {
        headers: {
          "Content-Type": file.type,
          "Content-Disposition": `attachment; filename="edited_${file.name}"`,
        },
      });
    } catch (err) {
      console.error("Exiftool error:", err);
      await unlink(inputPath).catch(console.error);
      return NextResponse.json({ error: "Failed to edit image" }, { status: 500 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
