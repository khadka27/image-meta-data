import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="font-extrabold text-2xl text-primary tracking-tighter">
            EXIFForge
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            The complete suite for managing, viewing, and editing image metadata. Built for privacy and control.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Tools</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/exif-viewer" className="hover:text-primary">EXIF Viewer</Link></li>
            <li><Link href="/exif-editor" className="hover:text-primary">EXIF Editor</Link></li>
            <li><Link href="/remove-exif-data" className="hover:text-primary">Remove EXIF</Link></li>
            <li><Link href="/bulk-exif-editor" className="hover:text-primary">Bulk Editor</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/api-docs" className="hover:text-primary">API Documentation</Link></li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} EXIFForge. All rights reserved.</p>
        <p className="mt-2 md:mt-0 opacity-60">Built for privacy and control.</p>
      </div>
    </footer>
  );
}
