import { ExifEditor } from "@/components/exif/exif-editor";
import { Metadata } from "next";
import Link from "next/link";
import { Edit3, Shield, Zap, FileImage } from "lucide-react";

export const metadata: Metadata = {
  title: "Photo & Image Metadata Editor – Edit EXIF Data Online Free | EXIFForge",
  description:
    "Edit all EXIF, IPTC and XMP metadata in any image online. Change author, copyright, GPS location, camera info, date taken, keywords, and more. Free photo metadata editor — no signup, no upload to server. Supports JPEG, JPG, PNG, WebP, TIFF.",
  keywords: [
    "exif metadata editor",
    "photo exif editor metadata editor",
    "photo metadata editor",
    "image meta data editor",
    "exif metadata from photos",
    "picture metadata editor",
    "image metadata editor",
    "edit photo metadata",
    "edit image metadata online",
    "edit exif data online",
    "metadata picture editor",
    "photo metadata edit",
    "change image metadata",
    "modify exif data",
    "update photo metadata",
  ].join(", "),
};

export default function EditExifPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-3 flex items-center gap-2 text-sm text-accent font-medium">
          <Edit3 className="h-4 w-4" />
          <span>Free Online EXIF Editor</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-primary leading-tight">
          Photo & Image Metadata Editor
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-3xl leading-relaxed">
          Edit every EXIF, IPTC, and XMP field in your photos — author, copyright, GPS coordinates, camera make and model, lens, date taken, keywords, and more. All edits happen in your browser. Download the updated image instantly.
        </p>

        <ExifEditor />
      </div>

      {/* Editable Fields */}
      <section className="py-20 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-center">What Metadata Can You Edit?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            EXIFForge gives you full control over all standard metadata fields. Edit any tag individually or in bulk.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Author / Artist",
              "Copyright",
              "Image Description",
              "Keywords / Tags",
              "GPS Latitude",
              "GPS Longitude",
              "Camera Make",
              "Camera Model",
              "Lens Model",
              "Date Taken",
              "Date Digitized",
              "ISO Speed",
              "Aperture (FNumber)",
              "Exposure Time",
              "Focal Length",
              "Software",
              "Color Space",
              "White Balance",
              "Flash Mode",
              "Orientation",
              "X Resolution",
              "Y Resolution",
              "City / Country",
              "Credit / Source",
            ].map((field) => (
              <div key={field} className="flex items-center gap-2 bg-card border border-border/40 rounded-xl px-4 py-3 text-sm font-medium hover:border-accent/40 transition-colors">
                <span className="h-2 w-2 rounded-full bg-accent shrink-0"></span>
                {field}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-12 text-center">How to Edit Image Metadata Online</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: <FileImage className="h-6 w-6" />, title: "Upload Your Photo", desc: "Drag and drop a JPEG, PNG, WebP, or TIFF image. The tool instantly reads all existing metadata and populates the editor." },
              { step: "2", icon: <Edit3 className="h-6 w-6" />, title: "Edit Any Field", desc: "Modify existing tags, delete unwanted metadata, or add completely new EXIF fields. You have full control over every tag." },
              { step: "3", icon: <Zap className="h-6 w-6" />, title: "Save & Download", desc: "Click 'Save & Download' to get your updated image with all the new metadata embedded — ready to share or archive." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center p-6">
                <div className="h-14 w-14 rounded-2xl bg-accent text-white flex items-center justify-center mb-4 text-xl font-extrabold">{s.step}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-12 bg-accent/5 border-y border-accent/20">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row items-center gap-6">
          <Shield className="h-12 w-12 text-accent shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-1">Your Photos Stay Private</h3>
            <p className="text-muted-foreground">All metadata editing is done client-side in your browser using ExifTool running on our secure server for write operations. Your original image bytes are never stored after processing.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-10 text-center">FAQ – Photo Metadata Editor</h2>
          <div className="space-y-6">
            {[
              {
                q: "How do I edit EXIF metadata in a photo online?",
                a: "Upload your photo to EXIFForge's metadata editor. The tool reads all existing tags and displays them in an editable table. Change any value, delete tags you don't need, or add new ones. Click 'Save & Download' to get your edited image.",
              },
              {
                q: "Can I change the date taken in a photo?",
                a: "Yes. Upload your image, find the 'DateTimeOriginal' or 'CreateDate' field, and enter the new date in the format YYYY:MM:DD HH:MM:SS. Save and download to apply the change permanently to the file.",
              },
              {
                q: "Can I add copyright information to my photos?",
                a: "Absolutely. EXIFForge lets you set the Copyright, Artist, and Rights fields. This is important for protecting your work when sharing images online. You can also use the Bulk Editor to apply copyright metadata to hundreds of photos at once.",
              },
              {
                q: "Can I change the GPS location in a photo?",
                a: "Yes. Find the GPSLatitude and GPSLongitude fields in the editor, and enter new decimal degree coordinates. This lets you correct inaccurate location data or set a location for photos taken without GPS.",
              },
              {
                q: "What is the difference between EXIF, IPTC, and XMP metadata?",
                a: "EXIF stores technical camera data (ISO, aperture, GPS). IPTC stores editorial information (caption, keywords, author). XMP is a newer, extensible format that can store both. EXIFForge reads and writes all three formats.",
              },
            ].map((faq) => (
              <details key={faq.q} className="group border border-border/40 rounded-2xl p-6 bg-card hover:border-accent/30 transition-colors cursor-pointer">
                <summary className="font-semibold text-foreground list-none flex items-center justify-between gap-4">
                  {faq.q}
                  <span className="text-accent text-xl group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-16 bg-muted/30 border-t border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center">Related Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "View Metadata", desc: "Read all EXIF tags", href: "/exif-viewer" },
              { title: "Remove Metadata", desc: "Strip GPS & privacy data", href: "/remove-exif-data" },
              { title: "Bulk Editor", desc: "Process 100+ photos", href: "/bulk-exif-editor" },
              { title: "Copy Metadata", desc: "Clone tags between images", href: "/copy-metadata" },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="bg-card border border-border/40 rounded-2xl p-5 hover:border-accent/50 hover:shadow-lg transition-all text-center group">
                <p className="font-bold text-sm mb-1 group-hover:text-accent transition-colors">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
