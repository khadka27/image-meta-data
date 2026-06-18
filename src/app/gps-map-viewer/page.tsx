import { GpsViewer } from "@/components/exif/gps-viewer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPS Map Viewer | EXIFForge",
  description: "View the exact GPS coordinates and map location of where a photo was taken.",
};

export default function GpsMapPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">GPS Map Viewer</h1>
        <p className="text-muted-foreground mb-8">
          Many modern smartphones and cameras embed the exact GPS coordinates where a photo was taken. Upload an image to visualize its location on an interactive map.
        </p>
        <GpsViewer />
      </div>
    </div>
  );
}
