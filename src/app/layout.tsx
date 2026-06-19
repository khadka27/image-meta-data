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
  title: "EXIFForge — Image Metadata Studio",
  description:
    "The complete suite for managing, viewing, and editing image metadata. Built for privacy and control.",
  keywords: ["EXIF editor", "image metadata", "remove GPS", "privacy", "bulk EXIF"],
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
    >
      <body className="min-h-full flex flex-col relative">
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
