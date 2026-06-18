import { NextRequest, NextResponse } from "next/server";
import { exiftool } from "exiftool-vendored";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const sourceFile = formData.get("source") as File | null;
    const targetFile = formData.get("target") as File | null;

    if (!sourceFile || !targetFile) {
      return NextResponse.json({ error: "Both source and target files are required" }, { status: 400 });
    }

    const sourceBytes = await sourceFile.arrayBuffer();
    const targetBytes = await targetFile.arrayBuffer();
    
    const tempId = Math.random().toString(36).substring(7);
    const sourcePath = join(os.tmpdir(), `source_${tempId}_${sourceFile.name}`);
    const targetPath = join(os.tmpdir(), `target_${tempId}_${targetFile.name}`);
    
    await writeFile(sourcePath, Buffer.from(sourceBytes));
    await writeFile(targetPath, Buffer.from(targetBytes));

    try {
      // exiftool -TagsFromFile sourcePath targetPath
      await exiftool.write(targetPath, {}, {
        writeArgs: ["-TagsFromFile", sourcePath, "-all:all>all:all"]
      });
      
      const modifiedBuffer = await readFile(targetPath);
      
      // Cleanup
      await unlink(sourcePath).catch(console.error);
      await unlink(targetPath).catch(console.error);
      await unlink(`${targetPath}_original`).catch(console.error);

      // Return the file
      return new NextResponse(modifiedBuffer, {
        headers: {
          "Content-Type": targetFile.type,
          "Content-Disposition": `attachment; filename="replaced_${targetFile.name}"`,
        },
      });
    } catch (err) {
      console.error("Exiftool error:", err);
      await unlink(sourcePath).catch(console.error);
      await unlink(targetPath).catch(console.error);
      return NextResponse.json({ error: "Failed to replace metadata" }, { status: 500 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
