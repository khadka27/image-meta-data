import { ExifCompare } from "@/components/exif/exif-compare";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Metadata | EXIFForge",
  description: "Upload two images to compare their EXIF metadata side-by-side.",
};

export default function CompareExifPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Metadata Compare</h1>
        <p className="text-muted-foreground mb-8">
          Upload two images to instantly compare their hidden EXIF data side-by-side. Useful for verifying metadata edits or finding differences.
        </p>
        <ExifCompare />
      </div>
    </div>
  );
}
