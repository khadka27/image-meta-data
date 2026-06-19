"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

const NAV_LINKS = [
  { href: "/exif-viewer",      label: "View EXIF"       },
  { href: "/exif-editor",      label: "Edit Metadata"   },
  { href: "/remove-exif-data", label: "Remove Metadata" },
  { href: "/bulk-exif-editor", label: "Bulk Editor"     },
  { href: "/compare-metadata", label: "Compare"         },
  { href: "/gps-map-viewer",   label: "GPS Map"         },
  { href: "/api-docs",         label: "API"             },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 border-b transition-all duration-300"
      style={{
        background: "rgba(5, 8, 24, 0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderColor: "rgba(139, 92, 246, 0.2)",
        boxShadow: "0 1px 0 rgba(139,92,246,0.1), 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-16 md:h-18 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #22d3ee 100%)",
              boxShadow: "0 0 16px rgba(124,58,237,0.5)",
            }}
          >
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
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

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                )}
                style={
                  isActive
                    ? {
                        background: "rgba(124, 58, 237, 0.2)",
                        border: "1px solid rgba(167, 139, 250, 0.3)",
                        boxShadow: "0 0 12px rgba(124, 58, 237, 0.2)",
                        color: "#c4b5fd",
                      }
                    : undefined
                }
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full"
                    style={{ background: "linear-gradient(90deg, #a78bfa, #22d3ee)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/exif-viewer"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300 shrink-0 hover:-translate-y-px hover:shadow-[0_0_32px_rgba(124,58,237,0.7),_0_8px_24px_rgba(0,0,0,0.4)]"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
            boxShadow: "0 0 20px rgba(124,58,237,0.4), 0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <Zap className="h-3.5 w-3.5" />
          Try Free Tools
        </Link>
      </div>
    </nav>
  );
}
