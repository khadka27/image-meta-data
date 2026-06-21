import { Metadata } from "next";
import { ApiDocs } from "@/components/api-docs";

export const metadata: Metadata = {
  title: "ExifForge Developer API Documentation – Image Metadata API online | EXIFForge",
  description:
    "Developer API documentation for ExifForge. Integrate EXIF, IPTC and XMP metadata reading, editing, and removal engines into your own applications, WordPress plugins, python scripts, or JS fetch configurations.",
  keywords: [
    "EXIF API",
    "image metadata API",
    "edit EXIF programmatically",
    "remove GPS API",
    "REST API EXIF",
    "photo metadata endpoint",
    "DeepSeek EXIF API",
    "ExifForge API documentation"
  ].join(", "),
};

export default function ApiDocsPage() {
  return <ApiDocs />;
}
