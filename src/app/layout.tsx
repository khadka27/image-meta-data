import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://exifforge.com"),
  title: {
    default: "EXIFForge - Free Online Image Metadata Studio (EXIF, IPTC, XMP)",
    template: "%s",
  },
  description:
    "View, edit, and remove image metadata online for free. Strip GPS location tracking, inject copyrights, and batch edit EXIF tags. 100% secure client-side editor.",
  keywords: [
    "EXIF editor online",
    "image metadata viewer",
    "remove GPS photo",
    "edit EXIF data free",
    "bulk metadata editor",
    "exif tool online",
    "exifforge",
    "view photo tags",
    "photo privacy editor"
  ],
  authors: [{ name: "EXIFForge" }],
  creator: "EXIFForge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "EXIFForge - Free Online Image Metadata Studio (EXIF, IPTC, XMP)",
    description: "View, edit, and remove image metadata online for free. Strip GPS location tracking, inject copyrights, and batch edit EXIF tags.",
    siteName: "EXIFForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "EXIFForge - Free Online Image Metadata Studio (EXIF, IPTC, XMP)",
    description: "View, edit, and remove image metadata online for free. Strip GPS location tracking, inject copyrights, and batch edit EXIF tags.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative" suppressHydrationWarning>
        {/* Ambient scan line */}
        <div className="scan-line" aria-hidden="true" />
        {/* Animated background orb bottom-left */}
        <div
          className="fixed bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
            animation: "float-orb 15s ease-in-out 2s infinite alternate",
            zIndex: -1,
          }}
          aria-hidden="true"
        />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
