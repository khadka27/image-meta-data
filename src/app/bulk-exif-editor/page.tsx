import { BulkEditor } from "@/components/exif/bulk-editor";
import { Metadata } from "next";
import Link from "next/link";
import { Layers, Zap, Archive, Shield, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Bulk Image Metadata Editor – Edit EXIF on 100 Photos at Once | EXIFForge",
  description:
    "Batch edit, remove, or apply metadata to hundreds of images at once. Strip GPS from 100 photos, apply copyright to an entire photoshoot, or bulk-clean metadata for privacy. Free online bulk EXIF editor - download results as ZIP.",
  keywords: [
    "bulk exif editor",
    "bulk image metadata editor",
    "batch edit photo metadata",
    "batch remove exif data",
    "bulk metadata remover",
    "bulk exif remover",
    "mass edit image metadata",
    "edit metadata multiple photos",
    "batch photo metadata editor",
    "bulk image exif editor",
    "remove metadata from multiple images",
    "batch exif editor online",
    "bulk copyright photo",
    "apply metadata to multiple images",
  ].join(", "),
};

export default function BulkExifEditorPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-3 flex items-center gap-2 text-sm text-accent font-medium">
          <Layers className="h-4 w-4" />
          <span>Bulk Processing - Up to 100 Images</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-primary leading-tight">
          Bulk Image Metadata Editor
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-3xl leading-relaxed">
          Edit, remove, or apply metadata to up to 100 images in a single batch. Strip GPS location, apply your copyright template to an entire shoot, or bulk-clean photos for privacy - all in one operation. Download results as a ZIP file instantly.
        </p>

        <BulkEditor />
      </div>

      {/* What You Can Do */}
      <section className="py-20 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-center">What Can You Do in Bulk?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Three powerful batch operations let you process a whole photoshoot in seconds.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-destructive" />,
                bg: "bg-destructive/10",
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
                icon: <Zap className="h-8 w-8 text-accent" />,
                bg: "bg-accent/10",
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
                icon: <Layers className="h-8 w-8 text-primary" />,
                bg: "bg-primary/10",
                title: "Apply Metadata Template",
                features: [
                  "Apply Author / Artist name",
                  "Set copyright across all images",
                  "Add keywords & descriptions",
                  "Set camera make & model",
                  "Update GPS coordinates",
                ],
              },
            ].map(op => (
              <div key={op.title} className="bg-card border border-border/40 rounded-3xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`h-14 w-14 rounded-2xl ${op.bg} flex items-center justify-center mb-5`}>
                  {op.icon}
                </div>
                <h3 className="font-extrabold text-lg mb-4 tracking-tight">{op.title}</h3>
                <ul className="space-y-2">
                  {op.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-12 text-center">How Bulk Processing Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Upload Images", desc: "Drag and drop up to 100 JPEG, PNG, WebP, or TIFF files. Thumbnail previews appear instantly." },
              { step: "2", title: "Choose Operation", desc: "Select Strip All, Remove GPS Only, or Apply Template. For templates, fill in the fields you want to embed." },
              { step: "3", title: "Process Batch", desc: "Our server processes each image using ExifTool. A progress bar tracks completion in real time." },
              { step: "4", title: "Download ZIP", desc: "All processed images are packaged into a single ZIP file that downloads automatically." },
            ].map(s => (
              <div key={s.step} className="flex flex-col items-center text-center p-6">
                <div className="h-12 w-12 rounded-2xl bg-accent text-white flex items-center justify-center mb-4 text-lg font-extrabold">{s.step}</div>
                <h3 className="font-bold text-base mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30 border-t border-border/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-10 text-center">FAQ – Bulk Metadata Editor</h2>
          <div className="space-y-5">
            {[
              {
                q: "How many images can I process at once?",
                a: "You can upload and process up to 100 images in a single batch. For photographers dealing with large volumes, we recommend batching in groups of 100 for best performance.",
              },
              {
                q: "What formats are supported in bulk processing?",
                a: "JPEG, JPG, PNG, WebP, and TIFF files are supported. All images are processed using ExifTool, which supports the widest range of metadata formats.",
              },
              {
                q: "How do I apply copyright to all my photos at once?",
                a: "Select the 'Edit Metadata Fields' operation, enter your name in Author and your copyright statement in Copyright (e.g. © 2026 Your Name), then click Process. All images will have your copyright embedded.",
              },
              {
                q: "Are my images stored on the server?",
                a: "No. Images are processed temporarily and deleted immediately after the ZIP is generated. We never store, analyze, or retain your photos.",
              },
              {
                q: "What happens if one image fails processing?",
                a: "Failed images are included in the ZIP as originals so you never lose a file. The processing log inside the ZIP tells you exactly which files succeeded and which failed.",
              },
            ].map(faq => (
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
      <section className="py-16 bg-background border-t border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center">Related Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Single Image Editor", desc: "Edit all EXIF fields", href: "/exif-editor" },
              { title: "EXIF Viewer", desc: "View all metadata", href: "/exif-viewer" },
              { title: "Copy Metadata", desc: "Clone tags between images", href: "/copy-metadata" },
              { title: "Compare Metadata", desc: "Side-by-side comparison", href: "/compare-metadata" },
            ].map(t => (
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
