import { ExifViewer } from "@/components/exif/exif-viewer";
import { Metadata } from "next";
import Link from "next/link";
import { Camera, Shield, Zap, Globe, FileImage, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Image Metadata Viewer – View EXIF, IPTC & XMP Data Online | EXIFForge",
  description:
    "Free online image metadata viewer. Check image metadata, view EXIF data from JPEG, PNG, WebP & TIFF files. Instantly see camera info, GPS location, date taken, ISO, aperture and more. No upload required - processed in your browser.",
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

const glassCard = {
  background: "rgba(13,18,55,0.5)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(139,92,246,0.15)",
} as const;

export default function ExifViewerPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-5 w-fit px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(34,211,238,0.1)",
            border: "1px solid rgba(34,211,238,0.25)",
            color: "#22d3ee",
          }}
        >
          <FileImage className="h-3.5 w-3.5" />
          Free Online Tool
        </div>
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight"
          style={{ color: "#e2e8f8" }}
        >
          Image Metadata Viewer &amp;{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            EXIF Extractor
          </span>
        </h1>
        <p className="text-base mb-10 max-w-3xl leading-relaxed" style={{ color: "#64748b" }}>
          Instantly view all hidden metadata in any image — camera make, model, lens, GPS location, ISO, aperture,
          date taken, copyright, and more. Supports JPEG, PNG, WebP, and TIFF. Your file stays in your browser.
        </p>

        <ExifViewer />
      </div>

      {/* Feature Highlights */}
      <section
        className="py-24 border-y"
        style={{ background: "rgba(8,12,35,0.7)", borderColor: "rgba(139,92,246,0.1)" }}
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-center" style={{ color: "#e2e8f8" }}>
            What Metadata Can You Read?
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: "#475569" }}>
            Our EXIF extractor reads all standard metadata formats: EXIF, IPTC, XMP, and more.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { label: "Camera Make & Model", example: "Canon EOS R5, Sony A7 IV", accent: "#22d3ee" },
              { label: "Lens Information", example: "EF 24-70mm f/2.8L", accent: "#a78bfa" },
              { label: "Date & Time Taken", example: "2024-03-15 14:32:00", accent: "#34d399" },
              { label: "GPS Coordinates", example: "40.7128° N, 74.0060° W", accent: "#f472b6" },
              { label: "ISO, Aperture & Shutter", example: "ISO 400, f/2.8, 1/500s", accent: "#fb923c" },
              { label: "Author & Copyright", example: "© 2024 John Doe", accent: "#22d3ee" },
              { label: "Image Dimensions", example: "6000 × 4000 px", accent: "#a78bfa" },
              { label: "Color Space & Profile", example: "sRGB, Adobe RGB", accent: "#34d399" },
              { label: "Software Used", example: "Adobe Lightroom 7.0", accent: "#f472b6" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-5 transition-all duration-200"
                style={glassCard}
              >
                <p className="font-semibold text-xs mb-1.5" style={{ color: item.accent }}>{item.label}</p>
                <p className="text-xs font-mono" style={{ color: "#475569" }}>{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-12 text-center" style={{ color: "#e2e8f8" }}>
            How to Check Image Metadata Online
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: <Camera className="h-6 w-6" />, title: "Upload Your Image", desc: "Drag & drop or click to select any JPEG, PNG, WebP, or TIFF file. Up to 50MB supported." },
              { step: "02", icon: <Zap className="h-6 w-6" />, title: "Instant Extraction", desc: "Our engine instantly reads all EXIF, IPTC, and XMP metadata directly in your browser." },
              { step: "03", icon: <Globe className="h-6 w-6" />, title: "View All Details", desc: "See every field in a clean table — including GPS map, camera settings, and copyright info." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center p-8 rounded-2xl transition-all" style={glassCard}>
                <div
                  className="text-xs font-black px-3 py-1 rounded-full mb-5"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "#fff", letterSpacing: "0.1em" }}
                >
                  {s.step}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#e2e8f8" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section
        className="py-12 border-y"
        style={{
          background: "rgba(34,211,238,0.05)",
          borderColor: "rgba(34,211,238,0.15)",
        }}
      >
        <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row items-center gap-6">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)" }}
          >
            <Shield className="h-8 w-8" style={{ color: "#22d3ee" }} />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1" style={{ color: "#e2e8f8" }}>100% Private — Your Images Never Leave Your Device</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
              All metadata extraction happens in your browser. We never upload, store, or process your images on any server.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ / SEO content */}
      <section
        className="py-24 border-t"
        style={{ background: "rgba(8,12,35,0.7)", borderColor: "rgba(139,92,246,0.1)" }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-10 text-center" style={{ color: "#e2e8f8" }}>Frequently Asked Questions</h2>
          <div className="space-y-4">
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
                a: "You can use EXIFForge directly in your browser on Mac - just upload the file. Alternatively, macOS Preview app lets you view basic EXIF data under Tools → Show Inspector. For advanced metadata, EXIFForge is a more comprehensive online solution.",
              },
              {
                q: "Can I check metadata from a Facebook photo?",
                a: "Facebook strips most EXIF metadata when photos are uploaded to protect user privacy. However, if you downloaded the original photo before it was uploaded, you can use EXIFForge to read its original metadata.",
              },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-2xl p-6 cursor-pointer transition-all duration-200" style={glassCard}>
                <summary className="font-semibold list-none flex items-center justify-between gap-4 select-none" style={{ color: "#e2e8f8" }}>
                  {faq.q}
                  <span className="text-xl group-open:rotate-45 transition-transform duration-200 shrink-0" style={{ color: "#a78bfa" }}>+</span>
                </summary>
                <p className="mt-4 leading-relaxed text-sm" style={{ color: "#64748b" }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-16 border-t" style={{ borderColor: "rgba(139,92,246,0.1)" }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center" style={{ color: "#e2e8f8" }}>Related Metadata Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "EXIF Editor", desc: "Edit all metadata fields", href: "/exif-editor", accent: "#a78bfa" },
              { title: "Remove Metadata", desc: "Strip GPS & EXIF data", href: "/remove-exif-data", accent: "#f472b6" },
              { title: "GPS Map Viewer", desc: "See photo location on map", href: "/gps-map-viewer", accent: "#22d3ee" },
              { title: "Metadata Compare", desc: "Compare two images", href: "/compare-metadata", accent: "#34d399" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/30"
                style={glassCard}
              >
                <p className="font-bold text-sm mb-1" style={{ color: "#e2e8f8" }}>{t.title}</p>
                <p className="text-xs" style={{ color: "#475569" }}>{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
