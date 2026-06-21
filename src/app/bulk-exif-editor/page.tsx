import { BulkEditor } from "@/components/exif/bulk-editor";
import { Metadata } from "next";
import Link from "next/link";
import { Layers, Zap, Shield, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Bulk Image Metadata Editor – Edit EXIF on 100 Photos at Once | EXIFForge",
  description:
    "Batch edit, remove, or apply metadata to hundreds of images at once. Strip GPS from 100 photos, apply copyright to an entire photoshoot, or bulk-clean metadata for privacy. Free online bulk EXIF editor - download results as ZIP.",
  keywords: [
    "bulk exif editor", "bulk image metadata editor", "batch edit photo metadata",
    "batch remove exif data", "bulk metadata remover", "bulk exif remover",
    "mass edit image metadata", "edit metadata multiple photos",
  ].join(", "),
};

const glassCard = {
  background: "rgba(13,18,55,0.5)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(139,92,246,0.15)",
} as const;

const OPERATIONS = [
  {
    icon: <Shield className="h-7 w-7" />,
    accent: "#f472b6",
    title: "Strip All Metadata",
    features: [
      "Remove GPS coordinates",
      "Remove camera serial number",
      "Remove author & copyright",
      "Remove all EXIF, IPTC, XMP",
      "Perfect for privacy before sharing",
    ],
  },
  {
    icon: <Zap className="h-7 w-7" />,
    accent: "#22d3ee",
    title: "Remove GPS Only",
    features: [
      "Strip latitude & longitude only",
      "Keep camera & lens info",
      "Keep copyright data",
      "Keep date taken",
      "Safe for social sharing",
    ],
  },
  {
    icon: <Layers className="h-7 w-7" />,
    accent: "#a78bfa",
    title: "Apply Metadata Template",
    features: [
      "Apply Author / Artist name",
      "Set copyright across all images",
      "Add keywords & descriptions",
      "Set camera make & model",
      "Update GPS coordinates",
    ],
  },
];

export default function BulkExifEditorPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-5 w-fit px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(167,139,250,0.1)",
            border: "1px solid rgba(167,139,250,0.25)",
            color: "#a78bfa",
          }}
        >
          <Layers className="h-3.5 w-3.5" />
          Bulk Processing - Up to 100 Images
        </div>

        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight"
          style={{ color: "#e2e8f8" }}
        >
          Bulk Image{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Metadata Editor
          </span>
        </h1>

        <p className="text-base mb-12 max-w-3xl leading-relaxed" style={{ color: "#64748b" }}>
          Edit, remove, or apply metadata to up to 100 images in a single batch. Strip GPS location, apply your
          copyright template to an entire shoot, or bulk-clean photos for privacy. Download results as a ZIP instantly.
        </p>

        <BulkEditor />
      </div>

      {/* What You Can Do */}
      <section
        className="py-24 border-y"
        style={{ background: "rgba(8,12,35,0.7)", borderColor: "rgba(139,92,246,0.1)" }}
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-center" style={{ color: "#e2e8f8" }}>
            What Can You Do in Bulk?
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: "#475569" }}>
            Three powerful batch operations let you process a whole photoshoot in seconds.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OPERATIONS.map((op) => (
              <div
                key={op.title}
                className="rounded-3xl p-7 transition-all duration-300 group"
                style={{
                  ...glassCard,
                  border: `1px solid ${op.accent}20`,
                }}
              >
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${op.accent}15`, color: op.accent, border: `1px solid ${op.accent}30` }}
                >
                  {op.icon}
                </div>
                <h3 className="font-extrabold text-base mb-4" style={{ color: "#e2e8f8" }}>{op.title}</h3>
                <ul className="space-y-2.5">
                  {op.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "#64748b" }}>
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: op.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-12 text-center" style={{ color: "#e2e8f8" }}>
            How Bulk Processing Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Upload Images", desc: "Drag & drop up to 100 JPEG, PNG, WebP, or TIFF files." },
              { step: "02", title: "Choose Operation", desc: "Select Strip All, Remove GPS, or Apply Template." },
              { step: "03", title: "Process Batch", desc: "Server processes each image. Progress bar tracks completion." },
              { step: "04", title: "Download ZIP", desc: "All processed images packaged and downloaded automatically." },
            ].map((s) => (
              <div
                key={s.step}
                className="flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300"
                style={glassCard}
              >
                <div
                  className="text-xs font-black px-3 py-1 rounded-full mb-5"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    color: "#fff",
                    letterSpacing: "0.1em",
                  }}
                >
                  {s.step}
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "#e2e8f8" }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="py-24 border-t"
        style={{ background: "rgba(8,12,35,0.7)", borderColor: "rgba(139,92,246,0.1)" }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-10 text-center" style={{ color: "#e2e8f8" }}>
            FAQ – Bulk Metadata Editor
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How many images can I process at once?",
                a: "You can upload and process up to 100 images in a single batch. For larger volumes, we recommend batching in groups of 100 for best performance.",
              },
              {
                q: "What formats are supported?",
                a: "JPEG, JPG, PNG, WebP, and TIFF files are all supported using ExifTool - the most widely-used metadata engine in the world.",
              },
              {
                q: "How do I apply copyright to all my photos at once?",
                a: "Select 'Edit Metadata Fields', enter your name in Author and copyright statement in Copyright (e.g. © 2026 Your Name), then click Process.",
              },
              {
                q: "Are my images stored on the server?",
                a: "No. Images are processed temporarily and deleted immediately after the ZIP is generated. We never store, analyze, or retain your photos.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl p-6 cursor-pointer transition-all duration-200"
                style={glassCard}
              >
                <summary
                  className="font-semibold list-none flex items-center justify-between gap-4 select-none"
                  style={{ color: "#e2e8f8" }}
                >
                  {faq.q}
                  <span
                    className="text-xl group-open:rotate-45 transition-transform duration-200 shrink-0"
                    style={{ color: "#a78bfa" }}
                  >
                    +
                  </span>
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
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center" style={{ color: "#e2e8f8" }}>
            Related Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Single Image Editor", desc: "Edit all EXIF fields", href: "/exif-editor", accent: "#22d3ee" },
              { title: "EXIF Viewer", desc: "View all metadata", href: "/exif-viewer", accent: "#a78bfa" },
              { title: "Copy Metadata", desc: "Clone tags between images", href: "/copy-metadata", accent: "#f472b6" },
              { title: "Compare Metadata", desc: "Side-by-side comparison", href: "/compare-metadata", accent: "#34d399" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/30 group"
                style={glassCard}
              >
                <p className="font-bold text-sm mb-1 transition-colors" style={{ color: "#e2e8f8" }}>{t.title}</p>
                <p className="text-xs" style={{ color: "#475569" }}>{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
