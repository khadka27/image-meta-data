import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Camera, 
  MapPin, 
  Edit3, 
  Trash2, 
  Copy, 
  Database,
  Layers,
  Code
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-36 lg:pb-48">
        {/* Animated background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-accent/10 blur-[120px] animate-pulse"></div>
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-8">
            <span className="flex h-2 w-2 rounded-full bg-accent mr-2 animate-pulse"></span>
            100% Free & Secure
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-5xl mb-8 leading-tight text-primary">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Image Metadata</span> Studio
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed">
            View, edit, remove, and generate EXIF data with ease. Protect your privacy or manage your photography workflow with professional-grade tools running directly in your browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-14 px-8 text-lg bg-accent hover:bg-accent/90 text-white font-semibold rounded-full shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5 transition-all" render={<Link href="/exif-viewer" />}>
              Try the EXIF Viewer
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-background text-primary border-primary/20 hover:bg-primary/5 rounded-full shadow-sm hover:shadow-md transition-all" render={<Link href="/bulk-exif-editor" />}>
              Bulk Processing
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted By (Placeholder) */}
      <section className="py-16 border-y border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">Trusted by photographers and agencies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Logos would go here */}
            <span className="font-extrabold text-2xl tracking-tighter">SONY PRO</span>
            <span className="font-extrabold text-2xl tracking-tighter">CANON NET</span>
            <span className="font-extrabold text-2xl tracking-tighter">PRIVACY+</span>
            <span className="font-extrabold text-2xl tracking-tighter">MEDIA CORP</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-background relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">Everything you need to manage metadata</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Whether you want to protect your privacy by removing GPS data or ensure your copyrights are properly embedded, EXIFForge has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Camera className="h-6 w-6 text-accent" />}
              title="EXIF Viewer"
              description="Instantly view Camera Make, Model, Lens, ISO, Aperture, and Date Taken for any image."
              link="/exif-viewer"
            />
            <FeatureCard 
              icon={<Edit3 className="h-6 w-6 text-accent" />}
              title="Metadata Editor"
              description="Edit Author, Copyright, Description, Keywords, and Date Taken effortlessly."
              link="/exif-editor"
            />
            <FeatureCard 
              icon={<Trash2 className="h-6 w-6 text-accent" />}
              title="Remove Metadata"
              description="One-click privacy protection. Remove GPS, Camera Info, IPTC, and XMP data entirely."
              link="/remove-exif-data"
            />
            <FeatureCard 
              icon={<Copy className="h-6 w-6 text-accent" />}
              title="Replace EXIF Data"
              description="Copy metadata from one source image and inject it into another."
              link="/copy-metadata"
            />
            <FeatureCard 
              icon={<Layers className="h-6 w-6 text-accent" />}
              title="Bulk Processing"
              description="Upload 100+ images to batch edit, add copyrights, or strip data at once."
              link="/bulk-exif-editor"
            />
            <FeatureCard 
              icon={<Database className="h-6 w-6 text-accent" />}
              title="Metadata Templates"
              description="Apply standard copyright and author info to hundreds of images at once."
              link="/bulk-exif-editor"
            />
            <FeatureCard 
              icon={<MapPin className="h-6 w-6 text-accent" />}
              title="GPS Map Viewer"
              description="Visualize the exact location where a photo was taken on an interactive map."
              link="/gps-remover"
            />
            <FeatureCard 
              icon={<Code className="h-6 w-6 text-accent" />}
              title="Developer API"
              description="Integrate our EXIF extraction, editing, and removal engines into your own app."
              link="/api-docs"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 text-primary-foreground">Ready to take control of your images?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Enjoy unlimited access to our entire suite of metadata tools. 100% free forever, no signup required.
          </p>
          <Button size="lg" className="h-14 px-10 text-lg bg-accent hover:bg-accent/90 text-white font-bold rounded-full shadow-xl hover:-translate-y-1 transition-all" render={<Link href="/exif-viewer" />}>
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) {
  return (
    <Link href={link} className="flex flex-col p-8 bg-card border border-border/40 rounded-3xl hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150"></div>
      <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300 relative z-10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight relative z-10">{title}</h3>
      <p className="text-muted-foreground leading-relaxed flex-1 relative z-10">{description}</p>
    </Link>
  );
}
