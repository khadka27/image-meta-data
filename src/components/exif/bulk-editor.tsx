/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  UploadCloud, Trash2, MapPin, Edit3, X, Download,
  CheckCircle2, AlertCircle, Loader2, Plus, Image as ImageIcon,
  FileDown, Settings, ChevronDown, ChevronUp, Sparkles,
  Zap, FileImage, Gauge
} from "lucide-react";
import Image from "next/image";
import { CAMERA_MAKES, CAMERA_MODELS } from "@/lib/camera-models";

type Operation = "remove_all" | "remove_gps" | "edit";
type OutputFormat = "default" | "jpg" | "png" | "webp" | "avif" | "tiff";

interface FileEntry {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "processing" | "done" | "error";
}

interface MetadataFields {
  Author: string;
  Copyright: string;
  Description: string;
  Keywords: string;
  Make: string;
  Model: string;
  LensModel: string;
  Software: string;
  DateTimeOriginal: string;
  GPSLatitude: string;
  GPSLongitude: string;
  City: string;
  Country: string;
  Credit: string;
  Source: string;
}

const DEFAULT_FIELDS: MetadataFields = {
  Author: "", Copyright: "", Description: "", Keywords: "",
  Make: "", Model: "", LensModel: "", Software: "",
  DateTimeOriginal: "", GPSLatitude: "", GPSLongitude: "",
  City: "", Country: "", Credit: "", Source: "",
};

const FIELD_LABELS: Record<keyof MetadataFields, string> = {
  Author: "Author / Artist",
  Copyright: "Copyright",
  Description: "Description / Caption",
  Keywords: "Keywords (comma-separated)",
  Make: "Camera Make",
  Model: "Camera Model",
  LensModel: "Lens Model",
  Software: "Software",
  DateTimeOriginal: "Date Taken (YYYY:MM:DD HH:MM:SS)",
  GPSLatitude: "GPS Latitude (decimal)",
  GPSLongitude: "GPS Longitude (decimal)",
  City: "City",
  Country: "Country",
  Credit: "Credit",
  Source: "Source",
};

const FORMAT_OPTIONS: { value: OutputFormat; label: string; ext: string; desc: string; color: string }[] = [
  { value: "default", label: "Default",  ext: "-",    desc: "Keep original format", color: "#94a3b8" },
  { value: "jpg",     label: "JPEG",     ext: ".jpg", desc: "Best for photos, small file size", color: "#fb923c" },
  { value: "png",     label: "PNG",      ext: ".png", desc: "Lossless, great for screenshots", color: "#22d3ee" },
  { value: "webp",    label: "WebP",     ext: ".webp",desc: "Modern format, smallest size",    color: "#34d399" },
  { value: "avif",    label: "AVIF",     ext: ".avif",desc: "Next-gen, ultra compressed",      color: "#a78bfa" },
  { value: "tiff",    label: "TIFF",     ext: ".tiff",desc: "Lossless, for print & archiving", color: "#f472b6" },
];

// Formats that support quality setting (lossy)
const LOSSY_FORMATS: OutputFormat[] = ["jpg", "webp", "avif"];

const glass = {
  background: "rgba(13,18,55,0.5)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(139,92,246,0.18)",
} as const;

export function BulkEditor() {
  const [entries, setEntries]           = useState<FileEntry[]>([]);
  const [operation, setOperation]       = useState<Operation>("remove_all");
  const [fields, setFields]             = useState<MetadataFields>(DEFAULT_FIELDS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [processing, setProcessing]     = useState(false);
  const [progress, setProgress]         = useState(0);
  const [progressMsg, setProgressMsg]   = useState("");
  const [downloadUrl, setDownloadUrl]   = useState<string | null>(null);
  const [resultCount, setResultCount]   = useState<{ ok: number; error: number } | null>(null);
  const [targetDeviceModel, setTargetDeviceModel] = useState<string>("");

  // ── New: Output options ──────────────────────────────────────────────────
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("default");
  const [quality, setQuality]           = useState<number>(85);
  const [showOutputOptions, setShowOutputOptions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter(f => f.type.startsWith("image/"));
    const mapped: FileEntry[] = arr.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      preview: URL.createObjectURL(f),
      status: "pending",
    }));
    setEntries(prev => [...prev, ...mapped].slice(0, 100));
    setDownloadUrl(null);
    setResultCount(null);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeEntry = (id: string) => {
    setEntries(prev => {
      const entry = prev.find(e => e.id === id);
      if (entry) URL.revokeObjectURL(entry.preview);
      return prev.filter(e => e.id !== id);
    });
  };

  const handleProcess = async () => {
    if (entries.length === 0) return;
    setProcessing(true);
    setProgress(0);
    setProgressMsg("Preparing files…");
    setDownloadUrl(null);
    setResultCount(null);
    setEntries(prev => prev.map(e => ({ ...e, status: "pending" })));

    const progressInterval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + (88 / entries.length / 3), 88);
        if (next > 20)  setProgressMsg("Processing metadata…");
        if (next > 55)  setProgressMsg("Converting & compressing…");
        if (next > 80)  setProgressMsg("Building ZIP archive…");
        return next;
      });
    }, 400);

    try {
      const data = new FormData();
      entries.forEach(e => data.append("files", e.file));
      data.append("operation", operation);
      if (operation === "edit") {
        data.append("metadata", JSON.stringify(fields));
      }
      // ── send output options ──
      data.append("outputFormat", outputFormat);
      data.append("quality", quality.toString());

      const response = await fetch("/api/exif/bulk", {
        method: "POST",
        body: data,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Server error" }));
        throw new Error(err.error || "Server error");
      }

      const blob = await response.blob();
      const url  = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(100);
      setProgressMsg("Done!");

      const okCount  = parseInt(response.headers.get("X-Results-Ok")    || "0", 10);
      const errCount = parseInt(response.headers.get("X-Results-Error")  || "0", 10);

      if (okCount > 0 || errCount > 0) {
        setResultCount({ ok: okCount, error: errCount });
      } else {
        setResultCount({ ok: entries.length, error: 0 });
      }
      setEntries(prev => prev.map(e => ({ ...e, status: "done" })));

      // Auto-download
      const fmtLabel = outputFormat === "default" ? "orig" : outputFormat;
      const zipName = `exifforge_bulk_${entries.length}_${fmtLabel}.zip`;
      const a = document.createElement("a");
      a.href = url;
      a.download = zipName;
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      setProgress(0);
      setProgressMsg("");
      setEntries(prev => prev.map(e => ({ ...e, status: "error" })));
      alert(`Error: ${err.message || "An error occurred. Please try again."}`);
    } finally {
      setProcessing(false);
    }
  };


  const selectedFmt = FORMAT_OPTIONS.find(f => f.value === outputFormat)!;
  const showQuality = LOSSY_FORMATS.includes(outputFormat);
  const inputClass = "flex h-10 w-full rounded-xl border px-3 py-2 text-sm placeholder:opacity-50 focus-visible:outline-none transition-all";

  return (
    <div className="space-y-6">

      {/* ── Upload Zone ── */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="group rounded-3xl p-14 text-center cursor-pointer relative overflow-hidden transition-all duration-300"
        style={{
          border: "2px dashed rgba(139,92,246,0.35)",
          background: "rgba(124,58,237,0.05)",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.1)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(167,139,250,0.6)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.05)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.35)";
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
        <div
          className="h-16 w-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}
        >
          <UploadCloud className="h-8 w-8" style={{ color: "#a78bfa" }} />
        </div>
        <h3 className="text-2xl font-extrabold mb-2 tracking-tight" style={{ color: "#e2e8f8" }}>
          Drop images here
        </h3>
        <p className="text-sm" style={{ color: "#64748b" }}>
          Or click to browse · JPEG, PNG, WebP, TIFF, HEIC, AVIF, RAW & more · Up to 100 images
        </p>
      </div>

      {entries.length > 0 && (
        <div className="space-y-5">

          {/* ── File Grid ── */}
          <div className="rounded-3xl p-6" style={glass}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "#e2e8f8" }}>
                <ImageIcon className="h-4 w-4" style={{ color: "#a78bfa" }} />
                {entries.length} image{entries.length !== 1 ? "s" : ""} selected
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}
                >
                  <Plus className="h-3 w-3" /> Add more
                </button>
                <button
                  onClick={() => setEntries([])}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}
                >
                  <X className="h-3 w-3" /> Clear all
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-64 overflow-y-auto pr-1">
              {entries.map(entry => (
                <div key={entry.id} className="relative group/thumb aspect-square rounded-xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.2)", background: "rgba(13,18,55,0.6)" }}>
                  <Image src={entry.preview} alt={entry.file.name} fill className="object-cover" sizes="80px"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const fb = (e.target as HTMLImageElement).nextElementSibling;
                      if (fb) (fb as HTMLElement).style.display = "flex";
                    }}
                  />
                  <div className="hidden items-center justify-center absolute inset-0" style={{ background: "rgba(13,18,55,0.8)" }}>
                    <ImageIcon className="h-5 w-5" style={{ color: "#475569" }} />
                  </div>
                  {entry.status === "done" && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(52,211,153,0.35)" }}>
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {entry.status === "error" && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(248,113,113,0.35)" }}>
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {!processing && (
                    <button
                      onClick={e => { e.stopPropagation(); removeEntry(entry.id); }}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.7)", color: "#fff" }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                    <p className="text-white text-[9px] truncate">{entry.file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Operation Picker ── */}
          <div className="rounded-3xl p-6" style={glass}>
            <h3 className="font-bold text-base mb-5 flex items-center gap-2" style={{ color: "#e2e8f8" }}>
              <Settings className="h-4 w-4" style={{ color: "#22d3ee" }} /> Choose Operation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {([
                {
                  value: "remove_all" as Operation,
                  icon: <Trash2 className="h-6 w-6" />,
                  label: "Strip All Metadata",
                  desc: "Remove every EXIF, IPTC, XMP tag for maximum privacy",
                  accent: "#f87171",
                },
                {
                  value: "remove_gps" as Operation,
                  icon: <MapPin className="h-6 w-6" />,
                  label: "Remove GPS Only",
                  desc: "Strip location data only - keep camera & copyright info",
                  accent: "#22d3ee",
                },
                {
                  value: "edit" as Operation,
                  icon: <Edit3 className="h-6 w-6" />,
                  label: "Edit Metadata Fields",
                  desc: "Apply custom Author, Copyright, GPS and more to all images",
                  accent: "#a78bfa",
                },
              ] as const).map(op => {
                const isActive = operation === op.value;
                return (
                  <button
                    key={op.value}
                    onClick={() => setOperation(op.value)}
                    className="flex flex-col items-center gap-3 p-5 rounded-2xl text-center transition-all duration-200"
                    style={{
                      background: isActive ? `${op.accent}12` : "rgba(13,18,55,0.4)",
                      border: `2px solid ${isActive ? `${op.accent}50` : "rgba(139,92,246,0.15)"}`,
                      boxShadow: isActive ? `0 0 20px ${op.accent}20` : "none",
                    }}
                  >
                    <div style={{ color: isActive ? op.accent : "#475569" }}>{op.icon}</div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: isActive ? op.accent : "#94a3b8" }}>{op.label}</p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "#475569" }}>{op.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Edit Fields Form */}
            {operation === "edit" && (
              <div className="mt-2 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.2)" }}>
                <div className="px-5 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3" style={{ background: "rgba(13,18,55,0.7)", borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#e2e8f8" }}>Metadata to apply to all images</p>
                    <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Leave fields blank to keep existing values</p>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                      className="flex h-8 flex-1 md:w-48 rounded-lg px-2 text-xs"
                      style={{ background: "rgba(13,18,55,0.8)", border: "1px solid rgba(139,92,246,0.25)", color: "#94a3c8" }}
                      value={targetDeviceModel}
                      onChange={e => {
                        setTargetDeviceModel(e.target.value);
                        // Auto-fill Make and Model fields based on selection
                        const selectedModel = e.target.value;
                        if (!selectedModel) return;
                        let targetMake = "";
                        Object.entries(CAMERA_MODELS).forEach(([make, models]) => {
                          if (models.includes(selectedModel)) targetMake = make;
                        });
                        setFields(prev => ({
                          ...prev,
                          Make: targetMake || selectedModel,
                          Model: selectedModel,
                          Software: `${selectedModel} OS`
                        }));
                      }}
                    >
                      <option value="">Set Device Make/Model...</option>
                      {Object.entries(CAMERA_MODELS).map(([group, models]) => (
                        <optgroup key={group} label={group}>
                          {models.map(model => <option key={model} value={model}>{model}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["Author", "Copyright", "Description", "Keywords"] as const).map(key => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>{FIELD_LABELS[key]}</label>
                      {key === "Description" ? (
                        <textarea rows={2} className={`${inputClass} resize-none`} style={{ background: "rgba(13,18,55,0.6)", border: "1px solid rgba(139,92,246,0.2)", color: "#e2e8f8" }}
                          placeholder={`Enter ${FIELD_LABELS[key]}`} value={fields[key]}
                          onChange={e => setFields(prev => ({ ...prev, [key]: e.target.value }))} />
                      ) : (
                        <input className={inputClass} style={{ background: "rgba(13,18,55,0.6)", border: "1px solid rgba(139,92,246,0.2)", color: "#e2e8f8" }}
                          placeholder={`Enter ${FIELD_LABELS[key]}`} value={fields[key]}
                          onChange={e => setFields(prev => ({ ...prev, [key]: e.target.value }))} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-2">
                  <button onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: "#22d3ee" }}>
                    {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {showAdvanced ? "Hide" : "Show"} advanced fields
                  </button>
                </div>
                {showAdvanced && (
                  <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4" style={{ borderTop: "1px solid rgba(139,92,246,0.15)" }}>
                    {(["Make", "Model", "LensModel", "Software", "DateTimeOriginal", "GPSLatitude", "GPSLongitude", "City", "Country", "Credit", "Source"] as const).map(key => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>{FIELD_LABELS[key]}</label>
                        <input className={inputClass} style={{ background: "rgba(13,18,55,0.6)", border: "1px solid rgba(139,92,246,0.2)", color: "#e2e8f8" }}
                          placeholder={`Enter ${FIELD_LABELS[key]}`} value={fields[key]}
                          onChange={e => setFields(prev => ({ ...prev, [key]: e.target.value }))}
                          list={key === "Make" || key === "Model" ? `${key}-list` : undefined} />
                      </div>
                    ))}
                  </div>
                )}
                <datalist id="Make-list">{CAMERA_MAKES.map(make => <option key={make} value={make} />)}</datalist>
                <datalist id="Model-list">
                  {Object.entries(CAMERA_MODELS).map(([group, models]) =>
                    models.map(model => <option key={model} value={model}>{group}</option>)
                  )}
                </datalist>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════
              OUTPUT OPTIONS - Format & Compression
          ══════════════════════════════════════════════════════ */}
          <div className="rounded-3xl overflow-hidden" style={glass}>
            <button
              onClick={() => setShowOutputOptions(v => !v)}
              className="w-full flex items-center justify-between p-6 text-left transition-colors"
              style={{ background: showOutputOptions ? "rgba(34,211,238,0.06)" : "transparent" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)" }}>
                  <FileImage className="h-4 w-4" style={{ color: "#22d3ee" }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#e2e8f8" }}>Output Format & Compression</p>
                  <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                    {outputFormat === "default"
                      ? "Keeping original format · No extra compression"
                      : `Converting to ${selectedFmt.label} (.${outputFormat})${showQuality ? ` · Quality ${quality}%` : " · Lossless"}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Current format badge */}
                <span
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${selectedFmt.color}15`, border: `1px solid ${selectedFmt.color}40`, color: selectedFmt.color }}
                >
                  {selectedFmt.label} {selectedFmt.ext !== "-" && selectedFmt.ext}
                </span>
                {showOutputOptions
                  ? <ChevronUp className="h-4 w-4" style={{ color: "#475569" }} />
                  : <ChevronDown className="h-4 w-4" style={{ color: "#475569" }} />
                }
              </div>
            </button>

            {showOutputOptions && (
              <div className="px-6 pb-6 space-y-5" style={{ borderTop: "1px solid rgba(139,92,246,0.12)" }}>
                {/* Format grid */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3 mt-4" style={{ color: "#475569" }}>
                    <FileImage className="h-3 w-3 inline mr-1.5" />
                    Output Format
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {FORMAT_OPTIONS.map(fmt => {
                      const isActive = outputFormat === fmt.value;
                      return (
                        <button
                          key={fmt.value}
                          onClick={() => setOutputFormat(fmt.value)}
                          className="flex flex-col items-center gap-2 p-3 rounded-2xl text-center transition-all duration-200"
                          style={{
                            background: isActive ? `${fmt.color}12` : "rgba(13,18,55,0.4)",
                            border: `2px solid ${isActive ? `${fmt.color}60` : "rgba(139,92,246,0.12)"}`,
                            boxShadow: isActive ? `0 0 16px ${fmt.color}25` : "none",
                          }}
                        >
                          {/* Format icon circle */}
                          <div
                            className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black"
                            style={{
                              background: isActive ? `${fmt.color}20` : "rgba(13,18,55,0.6)",
                              color: isActive ? fmt.color : "#475569",
                              border: `1px solid ${isActive ? `${fmt.color}40` : "rgba(139,92,246,0.1)"}`,
                            }}
                          >
                            {fmt.value === "default" ? "DEF" : fmt.label}
                          </div>
                          <div>
                            <p className="text-xs font-bold" style={{ color: isActive ? fmt.color : "#64748b" }}>
                              {fmt.label}
                            </p>
                            {fmt.ext !== "-" && (
                              <p className="text-[9px]" style={{ color: "#334155" }}>{fmt.ext}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {/* Format description */}
                  <p className="text-xs mt-3 px-1" style={{ color: "#475569" }}>
                    {selectedFmt.desc}
                    {outputFormat === "default" && " - ExifTool writes metadata in-place without re-encoding."}
                  </p>
                </div>

                {/* Quality slider - only for lossy formats */}
                {showQuality && (
                  <div
                    className="rounded-2xl p-4"
                    style={{ background: "rgba(13,18,55,0.5)", border: "1px solid rgba(34,211,238,0.15)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4" style={{ color: "#22d3ee" }} />
                        <p className="text-sm font-bold" style={{ color: "#e2e8f8" }}>Compression Quality</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-black px-2.5 py-0.5 rounded-lg"
                          style={{
                            background: quality >= 80 ? "rgba(52,211,153,0.15)" : quality >= 50 ? "rgba(251,146,60,0.15)" : "rgba(248,113,113,0.15)",
                            color: quality >= 80 ? "#34d399" : quality >= 50 ? "#fb923c" : "#f87171",
                            border: `1px solid ${quality >= 80 ? "rgba(52,211,153,0.3)" : quality >= 50 ? "rgba(251,146,60,0.3)" : "rgba(248,113,113,0.3)"}`,
                          }}
                        >
                          {quality}%
                        </span>
                        <span className="text-xs" style={{ color: "#475569" }}>
                          {quality >= 85 ? "High" : quality >= 60 ? "Medium" : "Low"}
                        </span>
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="relative">
                      <input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={quality}
                        onChange={e => setQuality(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #22d3ee ${quality}%, rgba(139,92,246,0.2) ${quality}%)`,
                          accentColor: "#22d3ee",
                        }}
                      />
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-[10px] mt-1.5" style={{ color: "#334155" }}>
                      <span>10% · Smallest</span>
                      <span>55% · Balanced</span>
                      <span>100% · Best Quality</span>
                    </div>

                    {/* Size estimate hint */}
                    <div className="mt-3 flex items-start gap-2 p-3 rounded-xl" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                      <Zap className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "#22d3ee" }} />
                      <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
                        {quality >= 85
                          ? "Near-lossless. File sizes will be similar to the originals."
                          : quality >= 60
                          ? "Good quality with moderate compression. Great for web use."
                          : "Aggressive compression. Best for thumbnails or bandwidth-limited use cases."}
                      </p>
                    </div>
                  </div>
                )}

                {/* PNG / TIFF note */}
                {(outputFormat === "png" || outputFormat === "tiff") && (
                  <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.15)" }}>
                    <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "#a78bfa" }} />
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      {outputFormat === "png"
                        ? "PNG uses lossless compression - quality is always 100%. File size depends on image content."
                        : "TIFF is a lossless archival format. Files will be larger but with zero quality loss."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Progress & Process Button ── */}
          <div className="rounded-3xl p-6" style={glass}>
            {processing && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: "#64748b" }}>{progressMsg || `Processing ${entries.length} images…`}</span>
                  <span className="text-sm font-black" style={{ color: "#22d3ee" }}>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(139,92,246,0.15)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #7c3aed, #22d3ee)",
                      boxShadow: "0 0 12px rgba(34,211,238,0.5)",
                    }}
                  />
                </div>
              </div>
            )}

            {resultCount && !processing && (
              <div className="mb-5 flex flex-wrap items-center gap-4 p-4 rounded-2xl" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}>
                <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: "#34d399" }}>
                  <CheckCircle2 className="h-5 w-5" />
                  {resultCount.ok} processed successfully
                </div>
                {resultCount.error > 0 && (
                  <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: "#f87171" }}>
                    <AlertCircle className="h-5 w-5" />
                    {resultCount.error} failed (originals included in ZIP)
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleProcess}
                disabled={processing || entries.length === 0}
                className="flex-1 flex items-center justify-center gap-2.5 h-14 rounded-2xl text-base font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                  boxShadow: processing ? "none" : "0 0 24px rgba(124,58,237,0.4), 0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {processing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing…</>
                ) : (
                  <><FileDown className="h-5 w-5" /> Process {entries.length} image{entries.length !== 1 ? "s" : ""} & Download ZIP</>
                )}
              </button>

              {downloadUrl && !processing && (
                <a
                  href={downloadUrl}
                  download={`exifforge_bulk_${entries.length}_${outputFormat === "default" ? "orig" : outputFormat}.zip`}
                  className="flex items-center justify-center gap-2 h-14 px-6 rounded-2xl font-bold transition-all duration-300"
                  style={{
                    background: "rgba(34,211,238,0.08)",
                    border: "1px solid rgba(34,211,238,0.3)",
                    color: "#22d3ee",
                    boxShadow: "0 0 16px rgba(34,211,238,0.15)",
                  }}
                >
                  <Download className="h-5 w-5" /> Re-download ZIP
                </a>
              )}
            </div>

            <p className="text-xs mt-3 text-center" style={{ color: "#334155" }}>
              All processing happens on our secure server. Files are deleted immediately after download.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
