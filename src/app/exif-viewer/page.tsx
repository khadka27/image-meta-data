import { ExifViewer } from "@/components/exif/exif-viewer";
import { Metadata } from "next";
import Link from "next/link";
import { Camera, Shield, Zap, Globe, FileImage, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Image Metadata Viewer – View EXIF, IPTC & XMP Data Online | EXIFForge",
  description:
    "Free online image metadata viewer. Check image metadata, view EXIF data from JPEG, PNG, WebP & TIFF files. Instantly see camera info, GPS location, date taken, ISO, aperture and more. No upload required — processed in your browser.",
  keywords: [
    "image meta data",
    "image metadata extractor",
    "view image meta data",
    "check image meta data",
    "check image metadata",
    "check jpeg metadata",
    "find image metadata",
    "find meta data of image",
    "find metadata of image",
    "find picture metadata",
    "get image meta data",
    "get jpeg metadata",
    "get meta data from picture",
    "get meta info from image",
    "get metadata from image online",
    "get metadata image",
    "get photo metadata",
    "get picture metadata",
    "image exif metadata",
    "image meta info",
    "image metadata exif",
    "jpeg metadata",
    "jpg meta data",
    "jpg metadata online",
    "metadata of image online",
    "metadata online image",
    "read meta data from image",
    "read metadata of image",
    "reading metadata from photos",
    "see image metadata",
    "see metadata of image",
    "show image metadata",
    "show image metadata online",
    "show metadata of image",
    "view jpeg metadata",
    "view picture metadata",
    "exif metadata from photos",
    "exif metadata online",
    "foto metadata",
    "meta data jpg",
    "metadata jpg online",
    "pictures with metadata",
    "search image metadata",
    "search metadata photo",
  ].join(", "),
};

export default function ExifViewerPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="mb-3 flex items-center gap-2 text-sm text-accent font-medium">
          <FileImage className="h-4 w-4" />
          <span>Free Online Tool</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-primary leading-tight">
          Image Metadata Viewer & EXIF Extractor
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-3xl leading-relaxed">
          Instantly view all hidden metadata in any image — camera make, model, lens, GPS location, ISO, aperture, date taken, copyright, and more. Supports JPEG, JPG, PNG, WebP, and TIFF. Your file stays in your browser; nothing is uploaded to our servers.
        </p>

        <ExifViewer />
      </div>

      {/* Feature Highlights */}
      <section className="py-20 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-center">What Metadata Can You Read?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our EXIF extractor reads all standard metadata formats: EXIF, IPTC, XMP, and more.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: "Camera Make & Model", example: "Canon EOS R5, Sony A7 IV" },
              { label: "Lens Information", example: "EF 24-70mm f/2.8L" },
              { label: "Date & Time Taken", example: "2024-03-15 14:32:00" },
              { label: "GPS Coordinates", example: "40.7128° N, 74.0060° W" },
              { label: "ISO, Aperture & Shutter", example: "ISO 400, f/2.8, 1/500s" },
              { label: "Author & Copyright", example: "© 2024 John Doe" },
              { label: "Image Dimensions", example: "6000 × 4000 px" },
              { label: "Color Space & Profile", example: "sRGB, Adobe RGB" },
              { label: "Software Used", example: "Adobe Lightroom 7.0" },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border/40 rounded-2xl p-5 hover:border-accent/40 transition-colors">
                <p className="font-semibold text-sm text-foreground mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground font-mono">{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-12 text-center">How to Check Image Metadata Online</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: <Camera className="h-6 w-6" />, title: "Upload Your Image", desc: "Drag and drop or click to select any JPEG, JPG, PNG, WebP, or TIFF file. Files up to 50MB are supported." },
              { step: "2", icon: <Zap className="h-6 w-6" />, title: "Instant Extraction", desc: "Our engine instantly reads all embedded EXIF, IPTC, and XMP metadata directly in your browser." },
              { step: "3", icon: <Globe className="h-6 w-6" />, title: "View All Details", desc: "See every field in a clean, searchable table — including GPS map location, camera settings, and copyright info." },
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

      {/* Privacy Note */}
      <section className="py-12 bg-accent/5 border-y border-accent/20">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row items-center gap-6">
          <Shield className="h-12 w-12 text-accent shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-1">100% Private — Your Images Never Leave Your Device</h3>
            <p className="text-muted-foreground">All metadata extraction happens entirely in your browser using JavaScript. We never upload, store, or process your images on any server. This tool works even offline once the page is loaded.</p>
          </div>
        </div>
      </section>

      {/* FAQ / SEO content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "How do I check image metadata online?",
                a: "Simply upload your image to EXIFForge above. Our tool will instantly display all embedded metadata including camera info, GPS coordinates, date taken, and copyright information. No signup required.",
              },
              {
                q: "What is EXIF metadata in a photo?",
                a: "EXIF (Exchangeable Image File Format) data is hidden information stored inside digital photos by your camera or smartphone. It includes technical details like ISO, aperture, shutter speed, lens model, and often the GPS location where the photo was taken.",
              },
              {
                q: "Can I find GPS location from photo metadata?",
                a: "Yes! If your camera or phone had location services enabled when the photo was taken, the GPS coordinates are stored in the EXIF data. EXIFForge displays these coordinates and shows the exact location on an interactive map.",
              },
              {
                q: "How do I view JPEG metadata online?",
                a: "Upload your JPEG or JPG file to EXIFForge. Our image metadata extractor reads all EXIF tags including shooting parameters, GPS data, and copyright information in seconds.",
              },
              {
                q: "What image formats support metadata?",
                a: "JPEG/JPG files carry the richest EXIF data. PNG files can carry XMP and some EXIF data. WebP, TIFF, and HEIC also support metadata. RAW camera files (CR2, NEF, ARW) contain the most detailed EXIF information.",
              },
              {
                q: "How can I read metadata from a photo on a Mac?",
                a: "You can use EXIFForge directly in your browser on Mac — just upload the file. Alternatively, macOS Preview app lets you view basic EXIF data under Tools → Show Inspector. For advanced metadata, EXIFForge is a more comprehensive online solution.",
              },
              {
                q: "Can I check metadata from a Facebook photo?",
                a: "Facebook strips most EXIF metadata when photos are uploaded to protect user privacy. However, if you downloaded the original photo before it was uploaded, you can use EXIFForge to read its original metadata.",
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
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center">Related Metadata Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "EXIF Editor", desc: "Edit all metadata fields", href: "/exif-editor" },
              { title: "Remove Metadata", desc: "Strip GPS & EXIF data", href: "/remove-exif-data" },
              { title: "GPS Map Viewer", desc: "See photo location on map", href: "/gps-map-viewer" },
              { title: "Metadata Compare", desc: "Compare two images", href: "/compare-metadata" },
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
