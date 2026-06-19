import Link from "next/link";
import Image from "next/image";
import { Zap, GitBranch } from "lucide-react";

const TOOLS = [
  { href: "/exif-viewer",      label: "EXIF Viewer"       },
  { href: "/exif-editor",      label: "EXIF Editor"       },
  { href: "/remove-exif-data", label: "Remove EXIF"       },
  { href: "/bulk-exif-editor", label: "Bulk Editor"       },
  { href: "/compare-metadata", label: "Compare Metadata"  },
  { href: "/gps-map-viewer",   label: "GPS Map Viewer"    },
];

const RESOURCES = [
  { href: "/api-docs", label: "API Documentation" },
  { href: "/blog",     label: "Blog"              },
  { href: "/faq",      label: "FAQ"               },
];

const LEGAL = [
  { href: "/privacy", label: "Privacy Policy"   },
  { href: "/terms",   label: "Terms of Service" },
];

export function Footer() {
  return (
    <footer
      className="mt-auto border-t pt-20 pb-10"
      style={{
        background: "rgba(5,8,24,0.95)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(139,92,246,0.15)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <Image 
                src="/logo.png" 
                alt="EXIFForge Logo" 
                width={32} 
                height={32} 
                className="transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(124,58,237,0.5)]" 
              />
              <span
                className="font-extrabold text-xl tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                EXIFForge
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#475569" }}>
              The complete suite for managing, viewing, and editing image metadata.
              Built for privacy and control.
            </p>
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300"
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "#a78bfa",
              }}
            >
              <GitBranch className="h-3.5 w-3.5" />
              Open Source
            </a>
          </div>

          {/* Tools */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "#22d3ee" }}
            >
              Tools
            </h3>
            <ul className="space-y-3">
              {TOOLS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-all duration-200 flex items-center gap-1.5 group hover:text-[#e2e8f8]"
                    style={{ color: "#475569" }}
                  >
                    <span
                      className="h-1 w-1 rounded-full transition-all duration-200 group-hover:w-3"
                      style={{ background: "#7c3aed", minWidth: "4px" }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "#a78bfa" }}
            >
              Resources
            </h3>
            <ul className="space-y-3">
              {RESOURCES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[#e2e8f8]"
                    style={{ color: "#475569" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "#f472b6" }}
            >
              Legal
            </h3>
            <ul className="space-y-3">
              {LEGAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[#e2e8f8]"
                    style={{ color: "#475569" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Privacy badge */}
            <div
              className="mt-8 px-3 py-2 rounded-xl text-xs"
              style={{
                background: "rgba(34,211,238,0.08)",
                border: "1px solid rgba(34,211,238,0.15)",
                color: "#22d3ee",
              }}
            >
              🔒 Zero data retention policy
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4"
          style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}
        >
          <p className="text-xs" style={{ color: "#334155" }}>
            © {new Date().getFullYear()} EXIFForge. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#334155" }}>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#22d3ee", boxShadow: "0 0 6px #22d3ee", animation: "pulse 2s infinite" }}
            />
            All systems operational
          </div>
          <p className="text-xs" style={{ color: "#334155" }}>Built for privacy and control.</p>
        </div>
      </div>
    </footer>
  );
}
