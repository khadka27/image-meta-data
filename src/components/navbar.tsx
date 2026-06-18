import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-all shadow-sm">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8 md:gap-10">
          <Link href="/" className="font-extrabold text-xl md:text-2xl text-primary tracking-tighter hover:opacity-80 transition-opacity shrink-0">
            EXIFForge
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/exif-viewer" className="hover:text-primary transition-colors whitespace-nowrap">View EXIF</Link>
            <Link href="/exif-editor" className="hover:text-primary transition-colors whitespace-nowrap">Edit Metadata</Link>
            <Link href="/remove-exif-data" className="hover:text-primary transition-colors whitespace-nowrap">Remove Metadata</Link>
            <Link href="/bulk-exif-editor" className="hover:text-primary transition-colors whitespace-nowrap">Bulk Editor</Link>
            <Link href="/api-docs" className="hover:text-primary transition-colors whitespace-nowrap">API Docs</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/exif-viewer" className={cn(buttonVariants(), "bg-accent hover:bg-accent/90 text-white shadow-md hover:shadow-lg transition-all px-5 md:px-6 rounded-full text-sm")}>
            Try Tools for Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
