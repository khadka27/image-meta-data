import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-all shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-extrabold text-2xl text-primary tracking-tighter hover:opacity-80 transition-opacity">
            EXIFForge
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link href="/exif-viewer" className="hover:text-primary transition-colors">View EXIF</Link>
            <Link href="/exif-editor" className="hover:text-primary transition-colors">Edit Metadata</Link>
            <Link href="/remove-exif-data" className="hover:text-primary transition-colors">Remove Metadata</Link>
            <Link href="/bulk-exif-editor" className="hover:text-primary transition-colors">Bulk Editor</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/exif-viewer" className={cn(buttonVariants(), "bg-accent hover:bg-accent/90 text-white shadow-md hover:shadow-lg transition-all px-6 rounded-full")}>
            Try Tools for Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
