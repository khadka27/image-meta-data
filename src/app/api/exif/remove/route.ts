import { NextRequest, NextResponse } from "next/server";
import { exiftool } from "exiftool-vendored";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string || "all";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to Buffer and save temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique temp file paths
    const tempId = Math.random().toString(36).substring(7);
    const inputPath = join(os.tmpdir(), `input_${tempId}_${file.name}`);
    
    await writeFile(inputPath, buffer);

    // Determine what to remove based on type
    const writeOptions: Record<string, string> = {};
    if (type === "all") {
      writeOptions.all = ""; // Removes all metadata
    } else if (type === "gps") {
      writeOptions.gps = ""; // Removes GPS group
    } else if (type === "camera") {
      writeOptions.Make = "";
      writeOptions.Model = "";
      writeOptions.Lens = "";
      writeOptions.LensModel = "";
    }

    try {
      // Process with exiftool
      await exiftool.write(inputPath, writeOptions);
      
      // exiftool creates a "_original" backup by default, but we can just read the modified inputPath
      const modifiedBuffer = await readFile(inputPath);
      
      // Cleanup
      await unlink(inputPath).catch(console.error);
      await unlink(`${inputPath}_original`).catch(console.error);

      // Return the file
      return new NextResponse(modifiedBuffer, {
        headers: {
          "Content-Type": file.type,
          "Content-Disposition": `attachment; filename="cleaned_${file.name}"`,
        },
      });
    } catch (err) {
      console.error("Exiftool error:", err);
      // Cleanup on error
      await unlink(inputPath).catch(console.error);
      return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
