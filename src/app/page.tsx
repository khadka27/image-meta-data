"use client";
import Link from "next/link";
import {
  Camera,
  MapPin,
  Edit3,
  Trash2,
  Copy,
  Database,
  Layers,
  Code,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Lock,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center justify-center grid-bg overflow-hidden py-24">

        {/* Large purple orb top-right */}
        <div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
            animation: "float-orb 10s ease-in-out infinite alternate",
          }}
          aria-hidden="true"
        />
        {/* Cyan orb bottom-left */}
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
            animation: "float-orb 14s ease-in-out 3s infinite alternate",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-10"
            style={{
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.3)",
              color: "#22d3ee",
              boxShadow: "0 0 20px rgba(34,211,238,0.15)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#22d3ee", boxShadow: "0 0 6px #22d3ee", animation: "pulse 2s infinite" }}
            />
            100% Free &amp; Secure — No Sign-up
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight max-w-5xl mb-8 leading-[1.05]"
            style={{ color: "#e2e8f8" }}
          >
            The Ultimate{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #22d3ee 50%, #f472b6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Image Metadata
            </span>
            <br />Studio
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mb-12 leading-relaxed" style={{ color: "#94a3c8" }}>
            View, edit, remove, and manage EXIF data with professional-grade tools.
            Protect your privacy or craft your photography workflow — all in your browser.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/exif-viewer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                boxShadow: "0 0 30px rgba(124,58,237,0.5), 0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              <Zap className="h-5 w-5" />
              Start For Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/bulk-exif-editor"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all duration-300"
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#c4b5fd",
                boxShadow: "0 0 20px rgba(139,92,246,0.15)",
              }}
            >
              <Layers className="h-4 w-4" />
              Bulk Processing
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 mt-20">
            {[
              { value: "100+", label: "Supported Formats" },
              { value: "∞", label: "Free Uploads" },
              { value: "0", label: "Data Stored" },
              { value: "100%", label: "Browser-Safe" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span
                  className="text-3xl font-extrabold"
                  style={{
                    background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-xs font-medium" style={{ color: "#64748b" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section
        className="py-10 border-y overflow-hidden"
        style={{
          background: "rgba(13,18,55,0.4)",
          borderColor: "rgba(139,92,246,0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-8" style={{ color: "#475569" }}>
            Trusted by photographers &amp; agencies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {["SONY PRO", "CANON NET", "PRIVACY+", "MEDIA CORP", "PHOTOG.IO"].map((brand) => (
              <span
                key={brand}
                className="font-extrabold text-lg tracking-tighter transition-all duration-500"
                style={{ color: "rgba(148,163,200,0.3)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#a78bfa";
                  (e.currentTarget as HTMLElement).style.textShadow = "0 0 20px rgba(167,139,250,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(148,163,200,0.3)";
                  (e.currentTarget as HTMLElement).style.textShadow = "none";
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-32 relative">
        {/* Section orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.25)",
                color: "#a78bfa",
              }}
            >
              <Database className="h-3 w-3" /> Full Feature Suite
            </div>
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
              style={{ color: "#e2e8f8" }}
            >
              Everything you need to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                master metadata
              </span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "#64748b" }}>
              Whether protecting your privacy or embedding professional copyrights, EXIFForge has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section
        className="py-32 relative overflow-hidden"
        style={{
          background: "rgba(8,12,35,0.6)",
          borderTop: "1px solid rgba(139,92,246,0.1)",
          borderBottom: "1px solid rgba(139,92,246,0.1)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: "#e2e8f8" }}>
              How it works
            </h2>
            <p style={{ color: "#64748b" }}>Three steps, zero friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", icon: <Globe className="h-7 w-7" />, title: "Upload Your Image", desc: "Drag & drop or browse any image — JPEG, PNG, RAW, HEIC, TIFF, WebP and more." },
              { step: "02", icon: <Edit3 className="h-7 w-7" />, title: "Choose Your Operation", desc: "View, edit, strip GPS, remove all metadata, or batch process hundreds at once." },
              { step: "03", icon: <Lock className="h-7 w-7" />, title: "Download & Done", desc: "Your processed image is ready instantly. Nothing is stored on our servers." },
            ].map((item) => (
              <div
                key={item.step}
                className="relative flex flex-col items-center text-center p-8 rounded-3xl transition-all duration-300 group"
                style={{
                  background: "rgba(13,18,55,0.5)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(139,92,246,0.15)",
                }}
              >
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-extrabold px-3 py-1 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    color: "#fff",
                    letterSpacing: "0.1em",
                  }}
                >
                  {item.step}
                </div>
                <div
                  className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5 mt-4 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(167,139,250,0.25)",
                    color: "#a78bfa",
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#e2e8f8" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY US / PRIVACY ═══ */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                style={{
                  background: "rgba(34,211,238,0.1)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  color: "#22d3ee",
                }}
              >
                <Shield className="h-3 w-3" /> Privacy First
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6" style={{ color: "#e2e8f8" }}>
                Your files never leave{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  your control
                </span>
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: "#64748b" }}>
                All processing happens in a secure server environment that immediately deletes your files
                after delivery. No accounts, no tracking, no data retention. Ever.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  "End-to-end encrypted upload",
                  "Files deleted after processing",
                  "No account or login required",
                  "Open source & auditable",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <div
                      className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)" }}
                    >
                      <svg className="h-2.5 w-2.5" fill="#22d3ee" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="#22d3ee" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#94a3c8" }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual card stack */}
            <div className="relative h-80 lg:h-96 hidden lg:block">
              {[
                { top: "0%",  left: "10%", label: "GPS Removed", color: "#22d3ee" },
                { top: "25%", left: "35%", label: "Copyright Embedded", color: "#a78bfa" },
                { top: "50%", left: "15%", label: "Metadata Stripped", color: "#f472b6" },
              ].map((card, i) => (
                <div
                  key={card.label}
                  className="absolute px-5 py-3 rounded-2xl flex items-center gap-3"
                  style={{
                    top: card.top,
                    left: card.left,
                    background: "rgba(13,18,55,0.7)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${card.color}40`,
                    boxShadow: `0 0 20px ${card.color}20`,
                    animation: `float 4s ease-in-out ${i * 0.7}s infinite`,
                  }}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: card.color, boxShadow: `0 0 8px ${card.color}` }}
                  />
                  <span className="text-sm font-semibold" style={{ color: card.color }}>{card.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section
        className="py-32 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.1) 100%)",
          borderTop: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        {/* Decorative orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
            style={{ color: "#e2e8f8" }}
          >
            Ready to take{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #22d3ee 50%, #f472b6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              control of your images?
            </span>
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed" style={{ color: "#64748b" }}>
            Unlimited access to the entire suite of professional metadata tools.
            Free forever. No signup required.
          </p>
          <Link
            href="/exif-viewer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-bold text-white transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
              boxShadow: "0 0 40px rgba(124,58,237,0.6), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <Zap className="h-5 w-5" />
            Get Started Now — It&apos;s Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ───── Feature Data ───── */
const FEATURES = [
  {
    icon: <Camera className="h-6 w-6" />,
    title: "EXIF Viewer",
    description: "Instantly view Camera Make, Model, Lens, ISO, Aperture, and Date Taken for any image.",
    link: "/exif-viewer",
    accent: "#22d3ee",
  },
  {
    icon: <Edit3 className="h-6 w-6" />,
    title: "Metadata Editor",
    description: "Edit Author, Copyright, Description, Keywords, and Date Taken effortlessly.",
    link: "/exif-editor",
    accent: "#a78bfa",
  },
  {
    icon: <Trash2 className="h-6 w-6" />,
    title: "Remove Metadata",
    description: "One-click privacy protection. Strip GPS, Camera Info, IPTC, and XMP entirely.",
    link: "/remove-exif-data",
    accent: "#f472b6",
  },
  {
    icon: <Copy className="h-6 w-6" />,
    title: "Replace EXIF",
    description: "Copy metadata from one source image and inject it into another.",
    link: "/copy-metadata",
    accent: "#34d399",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Bulk Processing",
    description: "Upload 100+ images to batch edit, add copyrights, or strip data at once.",
    link: "/bulk-exif-editor",
    accent: "#fb923c",
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Compare Metadata",
    description: "Side-by-side comparison of metadata from two different images.",
    link: "/compare-metadata",
    accent: "#22d3ee",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "GPS Map Viewer",
    description: "Visualize the exact location where a photo was taken on an interactive map.",
    link: "/gps-map-viewer",
    accent: "#a78bfa",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Developer API",
    description: "Integrate EXIF extraction, editing, and removal engines into your own app.",
    link: "/api-docs",
    accent: "#f472b6",
  },
];

/* ───── Feature Card Component ───── */
function FeatureCard({
  icon, title, description, link, accent, index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  accent: string;
  index: number;
}) {
  return (
    <Link
      href={link}
      className="group relative flex flex-col p-6 rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(13,18,55,0.5)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(139,92,246,0.15)",
        animationDelay: `${index * 0.05}s`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${accent}50`;
        el.style.boxShadow = `0 0 30px ${accent}15, 0 8px 32px rgba(0,0,0,0.3)`;
        el.style.transform = "translateY(-4px)";
        el.style.background = "rgba(18,24,68,0.7)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(139,92,246,0.15)";
        el.style.boxShadow = "none";
        el.style.transform = "translateY(0)";
        el.style.background = "rgba(13,18,55,0.5)";
      }}
    >
      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: `radial-gradient(circle at top right, ${accent}, transparent)` }}
      />

      {/* Icon */}
      <div
        className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
        style={{
          background: `${accent}15`,
          border: `1px solid ${accent}30`,
          color: accent,
          boxShadow: `0 0 12px ${accent}20`,
        }}
      >
        {icon}
      </div>

      <h3 className="text-base font-bold mb-2" style={{ color: "#e2e8f8" }}>{title}</h3>
      <p className="text-sm leading-relaxed flex-1" style={{ color: "#64748b" }}>{description}</p>

      <div
        className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color: accent }}
      >
        Open tool <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  );
}
