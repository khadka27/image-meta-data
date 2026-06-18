import { ExifReplacer } from "@/components/exif/exif-replacer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copy & Replace EXIF Data | EXIFForge",
  description: "Copy EXIF metadata from one image and inject it seamlessly into another.",
};

export default function ReplaceExifPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Replace Metadata</h1>
        <p className="text-muted-foreground mb-8">
          Need to restore lost metadata or sync tags across images? Upload a source image and target image, and we will clone the EXIF data over.
        </p>
        <ExifReplacer />
      </div>
    </div>
  );
}
