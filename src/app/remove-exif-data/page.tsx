import { ExifRemover } from "@/components/exif/exif-remover";
import { Metadata } from "next";
import Link from "next/link";
import { Shield, Trash2, MapPin, Lock, Eye, FileImage } from "lucide-react";

export const metadata: Metadata = {
  title: "Remove Image Metadata & EXIF Data Online Free | EXIFForge",
  description:
    "Remove all hidden EXIF, GPS location, and metadata from your photos instantly. Protect your privacy before sharing images online. Free tool — strip metadata from JPEG, PNG, WebP. No signup required.",
  keywords: [
    "remove exif data",
    "remove image metadata",
    "remove gps from photo",
    "remove metadata from photo",
    "strip exif data",
    "delete image metadata",
    "clear photo metadata",
    "remove location from photo",
    "remove gps data from image",
    "strip metadata from image",
    "remove exif data online",
    "remove exif from jpeg",
    "remove metadata from jpeg online",
    "erase photo metadata",
    "photo privacy metadata",
    "metadata remover online",
    "remove metadata from picture",
  ].join(", "),
};

export default function RemoveExifPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-3 flex items-center gap-2 text-sm text-destructive font-medium">
          <Trash2 className="h-4 w-4" />
          <span>Free Privacy Tool</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-primary leading-tight">
          Remove Image Metadata & GPS Data
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-3xl leading-relaxed">
          Instantly strip all hidden EXIF metadata, GPS location coordinates, camera information, and personal data from your photos before sharing them online. Protect your privacy in one click. Supports JPEG, JPG, PNG, WebP, and TIFF.
        </p>

        <ExifRemover />
      </div>

      {/* What Gets Removed */}
      <section className="py-20 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-center">What Metadata Gets Removed?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            When you upload a photo, our tool can strip any or all of these data types:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <MapPin className="h-6 w-6 text-destructive" />,
                title: "GPS Location Data",
                desc: "Removes precise GPS coordinates (latitude, longitude, altitude) that reveal exactly where a photo was taken — protecting your home address, workplace, and travel patterns.",
              },
              {
                icon: <Lock className="h-6 w-6 text-destructive" />,
                title: "Personal Information",
                desc: "Strips author name, email addresses, copyright notices, and any personally identifiable information embedded by your camera or editing software.",
              },
              {
                icon: <Eye className="h-6 w-6 text-destructive" />,
                title: "Camera & Device Info",
                desc: "Removes camera make, model, serial number, and firmware version — preventing device fingerprinting and revealing which equipment you use.",
              },
              {
                icon: <FileImage className="h-6 w-6 text-destructive" />,
                title: "All Technical EXIF Data",
                desc: "Clears ISO, aperture, shutter speed, lens info, focal length, flash mode, white balance, and hundreds of other technical shooting parameters.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-5 bg-card border border-border/40 rounded-2xl p-6 hover:border-destructive/20 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Remove Metadata */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-10 text-center">Why Should You Remove Photo Metadata?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Social Media Sharing", desc: "When posting photos on social media, Instagram, Twitter or Reddit, your GPS coordinates can be exposed. Remove location data before posting to protect your privacy." },
              { title: "Selling Stock Photos", desc: "When selling photos on stock sites, you may not want to reveal your camera equipment or shooting locations to competitors. Strip metadata before submission." },
              { title: "General Privacy", desc: "Photos taken at home, a private event, or a secure location should have location data removed before being sent via email or messaging apps." },
            ].map((reason) => (
              <div key={reason.title} className="bg-card border border-border/40 rounded-2xl p-6 hover:border-accent/30 transition-colors">
                <h3 className="font-bold text-base mb-2">{reason.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
            <Shield className="h-16 w-16 text-accent shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Does Facebook remove metadata from photos?</h3>
              <p className="text-muted-foreground leading-relaxed">Yes, Facebook, Instagram, and most social media platforms automatically strip EXIF metadata when photos are uploaded. However, it&apos;s still best practice to remove it yourself before uploading — especially for platforms that may not strip all data, like some messaging apps (WhatsApp, Telegram in some modes).</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30 border-t border-border/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight mb-10 text-center">FAQ – Removing Image Metadata</h2>
          <div className="space-y-6">
            {[
              {
                q: "How do I remove GPS data from a photo?",
                a: "Upload your photo to EXIFForge and select 'Remove GPS Only'. This will strip just the location coordinates while keeping the rest of your metadata (camera settings, date taken, author) intact. Download the cleaned image instantly.",
              },
              {
                q: "Does removing metadata change the image quality?",
                a: "No. Removing EXIF metadata has absolutely no effect on image quality, resolution, or file content. The pixel data remains completely unchanged. In fact, the file size may slightly decrease after stripping metadata.",
              },
              {
                q: "Can I remove metadata from multiple photos at once?",
                a: "Yes! Use our Bulk Metadata Processor to upload and process up to 100 images simultaneously. All processed images are returned in a single ZIP file for easy download.",
              },
              {
                q: "Does WhatsApp remove metadata from photos?",
                a: "WhatsApp compresses images by default and removes metadata in the process. However, if you send photos as 'Documents' in WhatsApp, the original file with full metadata may be preserved. It's safer to remove metadata manually before sending.",
              },
              {
                q: "How do I check if metadata was successfully removed?",
                a: "After removing metadata, re-upload the cleaned image to our EXIF Viewer tool. If the removal was successful, the viewer will show no or very minimal metadata for the file.",
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
      <section className="py-16 bg-background border-t border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center">Related Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "View Metadata", desc: "Check what data is in your photo", href: "/exif-viewer" },
              { title: "Edit Metadata", desc: "Modify EXIF fields", href: "/exif-editor" },
              { title: "GPS Map Viewer", desc: "See photo location on map", href: "/gps-map-viewer" },
              { title: "Bulk Remover", desc: "Strip 100+ photos at once", href: "/bulk-exif-editor" },
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
