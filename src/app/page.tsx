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
      <section className="relative grid-bg overflow-hidden -mt-16 md:-mt-18 pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-32">

        {/* Large purple orb top-right */}
        <div
          className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
            animation: "float-orb 12s ease-in-out infinite alternate",
          }}
          aria-hidden="true"
        />
        {/* Cyan orb bottom-left */}
        <div
          className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)",
            animation: "float-orb 16s ease-in-out 3s infinite alternate",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Details */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
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
                100% Free &amp; Secure - Browser Powered
              </div>

              {/* Headline */}
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
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

              <p className="text-base md:text-lg max-w-2xl mb-10 leading-relaxed" style={{ color: "#94a3c8" }}>
                View, edit, and sanitize EXIF, IPTC, and XMP data instantly. 
                Keep your camera details precise, add copyrights, or strip private tracking variables-all with 100% client-side security.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/exif-viewer"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-bold text-white transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                    boxShadow: "0 0 30px rgba(124,58,237,0.5), 0 8px 24px rgba(0,0,0,0.3)",
                  }}
                >
                  <Zap className="h-5 w-5 animate-pulse" />
                  Analyze Image
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/bulk-exif-editor"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all duration-300"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    color: "#c4b5fd",
                    boxShadow: "0 0 20px rgba(139,92,246,0.15)",
                  }}
                >
                  <Layers className="h-4 w-4" />
                  Bulk Edit
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-violet-500/15 w-full">
                {[
                  { value: "100+", label: "Formats" },
                  { value: "0ms", label: "Upload Time" },
                  { value: "0", label: "Files Retained" },
                  { value: "100%", label: "Privacy Guard" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-start gap-1">
                    <span
                      className="text-2xl font-extrabold"
                      style={{
                        background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: "#64748b" }}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Premium EXIF HUD Mockup */}
            <div className="lg:col-span-5 relative mt-10 lg:mt-0 flex justify-center">
              
              {/* Decorative radial lighting behind the simulator */}
              <div 
                className="absolute w-[350px] h-[350px] rounded-full blur-[90px] opacity-35 pointer-events-none"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)" }}
              />

              {/* HUD Container */}
              <div 
                className="w-full max-w-sm rounded-3xl p-6 relative overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background: "rgba(13, 18, 55, 0.65)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
                }}
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-violet-500/15 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Live Analyzer</span>
                  </div>
                  <span className="text-[10px] bg-violet-500/15 border border-violet-500/30 px-2.5 py-0.5 rounded-full text-violet-300 font-mono">
                    DSC_0942.NEF
                  </span>
                </div>

                {/* Viewfinder Area */}
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-slate-950/40 flex items-center justify-center mb-6">
                  {/* Camera Grid lines HUD */}
                  <div className="absolute inset-0 border border-white/[0.02]" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/[0.04] -translate-y-1/2" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.04] -translate-x-1/2" />
                  
                  {/* Viewfinder Corners */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-400/40" />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-400/40" />
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-400/40" />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-400/40" />

                  {/* Lens Icon in Center */}
                  <Camera className="h-10 w-10 text-cyan-400/30 animate-pulse" />
                  
                  <div className="absolute bottom-2 left-3 text-[9px] font-mono text-cyan-400/70">
                    REC [1080P]
                  </div>
                </div>

                {/* Floating parameters */}
                <div className="space-y-3.5">
                  {[
                    { label: "Camera Make / Model", val: "SONY ILCE-7RM5", icon: "📷", accent: "#a78bfa" },
                    { label: "Lens Settings", val: "FE 24-70mm F2.8 GM II", sub: "f/2.8 · 1/250s · ISO 100", icon: "⚙️", accent: "#22d3ee" },
                    { label: "Geotag GPS Location", val: "Shibuya, Tokyo, JP", sub: "35.6762° N, 139.6503° E", icon: "📍", accent: "#f472b6" },
                  ].map((p, i) => (
                    <div 
                      key={p.label}
                      className="p-3.5 rounded-xl border transition-all duration-300 hover:bg-violet-500/5 group/hud flex items-start gap-3.5"
                      style={{
                        background: "rgba(8,12,35,0.4)",
                        borderColor: "rgba(139,92,246,0.12)",
                      }}
                    >
                      <span className="text-base select-none mt-0.5">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{p.label}</div>
                        <div className="text-xs font-bold text-slate-300 mt-0.5 truncate">{p.val}</div>
                        {p.sub && <div className="text-[10px] text-slate-400/80 mt-0.5 font-mono">{p.sub}</div>}
                      </div>
                      <span 
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded border opacity-60 group-hover/hud:opacity-100 transition-opacity"
                        style={{
                          color: p.accent,
                          borderColor: `${p.accent}30`,
                          background: `${p.accent}10`
                        }}
                      >
                        EXIF
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section
        className="py-8 md:py-12 border-y overflow-hidden"
        style={{
          background: "rgba(13,18,55,0.4)",
          borderColor: "rgba(139,92,246,0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
      <section className="py-16 md:py-24 lg:py-32 relative">
        {/* Section orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
        className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
        style={{
          background: "rgba(8,12,35,0.6)",
          borderTop: "1px solid rgba(139,92,246,0.1)",
          borderBottom: "1px solid rgba(139,92,246,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: "#e2e8f8" }}>
              How it works
            </h2>
            <p style={{ color: "#64748b" }}>Three steps, zero friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", icon: <Globe className="h-7 w-7" />, title: "Upload Your Image", desc: "Drag & drop or browse any image - JPEG, PNG, RAW, HEIC, TIFF, WebP and more." },
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
      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="relative h-80 lg:h-96 hidden lg:flex items-center justify-center">
              {/* Background glowing orb for the cards */}
              <div 
                className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-40 pointer-events-none"
                style={{ background: "linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)" }}
              />
              
              <div className="relative w-full h-full max-w-sm mx-auto">
                {[
                  { top: "15%", left: "0%", label: "GPS Removed", color: "#22d3ee", delay: "0s", icon: "📍" },
                  { top: "45%", left: "15%", label: "Copyright Embedded", color: "#a78bfa", delay: "0.7s", icon: "©️" },
                  { top: "75%", left: "5%", label: "Metadata Stripped", color: "#f472b6", delay: "1.4s", icon: "🛡️" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="absolute px-6 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300"
                    style={{
                      top: card.top,
                      left: card.left,
                      background: "rgba(13,18,55,0.75)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      border: `1px solid ${card.color}50`,
                      boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${card.color}20`,
                      animation: `float 5s ease-in-out ${card.delay} infinite`,
                    }}
                  >
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-lg"
                      style={{ 
                        background: `${card.color}15`, 
                        border: `1px solid ${card.color}40`,
                        boxShadow: `inset 0 0 10px ${card.color}20`
                      }}
                    >
                      {card.icon}
                    </div>
                    <div>
                      <span className="block text-sm font-bold tracking-wide" style={{ color: card.color }}>
                        {card.label}
                      </span>
                      <span className="block text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                        Verified Secure
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section
        className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
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
            Get Started Now - It&apos;s Free
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
