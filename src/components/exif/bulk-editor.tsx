/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  UploadCloud, Trash2, MapPin, Edit3, X, Download,
  CheckCircle2, AlertCircle, Loader2, Plus, Image as ImageIcon,
  FileDown, Settings, ChevronDown, ChevronUp, Sparkles
} from "lucide-react";
import Image from "next/image";
import { CAMERA_MAKES, CAMERA_MODELS } from "@/lib/camera-models";

type Operation = "remove_all" | "remove_gps" | "edit";

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

export function BulkEditor() {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [operation, setOperation] = useState<Operation>("remove_all");
  const [fields, setFields] = useState<MetadataFields>(DEFAULT_FIELDS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState<{ ok: number; error: number } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [aiTargetModel, setAiTargetModel] = useState<string>("");
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
    setDownloadUrl(null);
    setResultCount(null);

    // Mark all as pending
    setEntries(prev => prev.map(e => ({ ...e, status: "pending" })));

    // Simulate per-file progress by estimating
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + (90 / entries.length / 3), 88));
    }, 400);

    try {
      const data = new FormData();
      entries.forEach(e => data.append("files", e.file));
      data.append("operation", operation);
      if (operation === "edit") {
        data.append("metadata", JSON.stringify(fields));
      }

      const response = await fetch("/api/exif/bulk", {
        method: "POST",
        body: data,
      });

      clearInterval(progressInterval);

      if (!response.ok) throw new Error("Server error");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(100);

      const okCount = parseInt(response.headers.get("X-Results-Ok") || "0", 10);
      const errCount = parseInt(response.headers.get("X-Results-Error") || "0", 10);
      
      if (okCount > 0 || errCount > 0) {
        setResultCount({ ok: okCount, error: errCount });
        // Individual file status is saved in _processing_log.json in the zip
        setEntries(prev => prev.map(e => ({ ...e, status: "done" })));
      } else {
        setEntries(prev => prev.map(e => ({ ...e, status: "done" })));
        setResultCount({ ok: entries.length, error: 0 });
      }

      // Auto download
      const zipFileName = fields.Model 
        ? `${fields.Model.replace(/[^a-zA-Z0-9]/g, "_")}_images.zip` 
        : `exifforge_bulk_${entries.length}_images.zip`;
        
      const a = document.createElement("a");
      a.href = url;
      a.download = zipFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      setProgress(0);
      setEntries(prev => prev.map(e => ({ ...e, status: "error" })));
      alert("An error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          model: aiTargetModel || "",
        })
      });

      if (!response.ok) throw new Error("Failed to generate metadata");

      const generatedData = await response.json();
      
      // Wipe old metadata and strictly apply new generated data
      setFields({
        ...DEFAULT_FIELDS,
        ...generatedData
      });
      
      // Auto-expand advanced options
      setShowAdvanced(true);
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating metadata.");
    } finally {
      setGenerating(false);
    }
  };

  const inputClass = "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 transition-all";

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="group border-2 border-dashed border-accent/40 bg-accent/5 rounded-3xl p-14 text-center hover:bg-accent/10 hover:border-accent transition-all duration-300 cursor-pointer relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
        <UploadCloud className="h-14 w-14 mx-auto text-accent mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10" />
        <h3 className="text-2xl font-extrabold mb-2 tracking-tight relative z-10">Drop images here</h3>
        <p className="text-muted-foreground relative z-10 text-sm">
          Or click to browse &bull; JPEG, PNG, WebP, TIFF, HEIC, AVIF, RAW &amp; more &bull; Up to 100 images
        </p>
      </div>

      {entries.length > 0 && (
        <div className="space-y-6">
          {/* File Grid */}
          <div className="bg-card border border-border/40 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-accent" />
                {entries.length} image{entries.length !== 1 ? "s" : ""} selected
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} className="rounded-full text-xs gap-1">
                  <Plus className="h-3 w-3" /> Add more
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEntries([])} className="rounded-full text-xs gap-1 text-destructive hover:text-destructive">
                  <X className="h-3 w-3" /> Clear all
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-64 overflow-y-auto pr-1">
              {entries.map(entry => (
                <div key={entry.id} className="relative group/thumb aspect-square rounded-xl overflow-hidden border border-border/40 bg-muted">
                  <Image
                    src={entry.preview}
                    alt={entry.file.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = (e.target as HTMLImageElement).nextElementSibling;
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                  <div className="hidden items-center justify-center absolute inset-0 bg-muted">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {/* Status overlay */}
                  {entry.status === "processing" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    </div>
                  )}
                  {entry.status === "done" && (
                    <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {entry.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {/* Remove button */}
                  {!processing && (
                    <button
                      onClick={e => { e.stopPropagation(); removeEntry(entry.id); }}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center hover:bg-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  {/* Tooltip */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                    <p className="text-white text-[9px] truncate leading-tight">{entry.file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operation Picker */}
          <div className="bg-card border border-border/40 rounded-3xl p-6">
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
              <Settings className="h-5 w-5 text-accent" /> Choose Operation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {([
                {
                  value: "remove_all" as Operation,
                  icon: <Trash2 className="h-7 w-7" />,
                  label: "Strip All Metadata",
                  desc: "Remove every EXIF, IPTC, XMP tag for maximum privacy",
                  color: "text-destructive",
                  bg: "bg-destructive/10 group-hover:bg-destructive/20",
                  border: "border-destructive/30",
                },
                {
                  value: "remove_gps" as Operation,
                  icon: <MapPin className="h-7 w-7" />,
                  label: "Remove GPS Only",
                  desc: "Strip location data only - keep camera & copyright info",
                  color: "text-accent",
                  bg: "bg-accent/10 group-hover:bg-accent/20",
                  border: "border-accent/30",
                },
                {
                  value: "edit" as Operation,
                  icon: <Edit3 className="h-7 w-7" />,
                  label: "Edit Metadata Fields",
                  desc: "Apply custom Author, Copyright, GPS and more to all images",
                  color: "text-primary",
                  bg: "bg-primary/10 group-hover:bg-primary/20",
                  border: "border-primary/30",
                },
              ] as const).map(op => (
                <button
                  key={op.value}
                  onClick={() => setOperation(op.value)}
                  className={`group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 text-center
                    ${operation === op.value
                      ? `${op.border} ${op.bg} shadow-md`
                      : "border-border/40 hover:border-border bg-card"
                    }`}
                >
                  <div className={`${op.color} ${operation === op.value ? op.color : "text-muted-foreground group-hover:" + op.color} transition-colors`}>
                    {op.icon}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${operation === op.value ? op.color : ""}`}>{op.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{op.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Edit Fields Form */}
            {operation === "edit" && (
              <div className="mt-4 border border-border/40 rounded-2xl overflow-hidden">
                <div className="bg-muted/40 px-5 py-3 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm text-foreground">Metadata to apply to all images</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Leave fields blank to keep existing values</p>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select 
                      className="flex h-8 flex-1 md:w-48 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      value={aiTargetModel}
                      onChange={e => setAiTargetModel(e.target.value)}
                    >
                      <option value="">Random Target Device</option>
                      {Object.entries(CAMERA_MODELS).map(([group, models]) => (
                        <optgroup key={group} label={group}>
                          {models.map(model => <option key={model} value={model}>{model}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} className="gap-2 text-purple-500 hover:text-purple-600 border-purple-200 hover:bg-purple-50 h-8 text-xs shrink-0">
                      {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} Generate
                    </Button>
                  </div>
                </div>

                {/* Common fields */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["Author", "Copyright", "Description", "Keywords"] as const).map(key => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{FIELD_LABELS[key]}</label>
                      {key === "Description" ? (
                        <textarea
                          rows={2}
                          className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 transition-all resize-none"
                          placeholder={`Enter ${FIELD_LABELS[key]}`}
                          value={fields[key]}
                          onChange={e => setFields(prev => ({ ...prev, [key]: e.target.value }))}
                        />
                      ) : (
                        <input
                          className={inputClass}
                          placeholder={`Enter ${FIELD_LABELS[key]}`}
                          value={fields[key]}
                          onChange={e => setFields(prev => ({ ...prev, [key]: e.target.value }))}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Advanced Toggle */}
                <div className="px-5 pb-2">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-xs font-semibold text-accent hover:opacity-80 transition-opacity"
                  >
                    {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {showAdvanced ? "Hide" : "Show"} advanced fields
                  </button>
                </div>

                {showAdvanced && (
                  <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/40 pt-4">
                    {(["Make", "Model", "LensModel", "Software", "DateTimeOriginal", "GPSLatitude", "GPSLongitude", "City", "Country", "Credit", "Source"] as const).map(key => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{FIELD_LABELS[key]}</label>
                        <input
                          className={inputClass}
                          placeholder={`Enter ${FIELD_LABELS[key]}`}
                          value={fields[key]}
                          onChange={e => setFields(prev => ({ ...prev, [key]: e.target.value }))}
                          list={key === "Make" || key === "Model" ? `${key}-list` : undefined}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Datalists for Autocomplete */}
                <datalist id="Make-list">
                  {CAMERA_MAKES.map(make => <option key={make} value={make} />)}
                </datalist>
                <datalist id="Model-list">
                  {Object.entries(CAMERA_MODELS).map(([group, models]) => (
                    models.map(model => <option key={model} value={model}>{group}</option>)
                  ))}
                </datalist>
              </div>
            )}
          </div>

          {/* Progress & Process Button */}
          <div className="bg-card border border-border/40 rounded-3xl p-6">
            {processing && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Processing {entries.length} images...</span>
                  <span className="text-sm font-bold text-accent">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {resultCount && !processing && (
              <div className="mb-5 flex items-center gap-4 p-4 rounded-2xl bg-muted/50">
                <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  {resultCount.ok} processed successfully
                </div>
                {resultCount.error > 0 && (
                  <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                    <AlertCircle className="h-5 w-5" />
                    {resultCount.error} failed (originals included in ZIP)
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleProcess}
                disabled={processing || entries.length === 0}
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-2xl text-base gap-2 shadow-md hover:shadow-lg transition-all"
              >
                {processing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                  <><FileDown className="h-5 w-5" /> Process {entries.length} image{entries.length !== 1 ? "s" : ""} & Download ZIP</>
                )}
              </Button>

              {downloadUrl && !processing && (
                <Button
                  nativeButton={false}
                  render={<a href={downloadUrl} download={fields.Model ? `${fields.Model.replace(/[^a-zA-Z0-9]/g, "_")}_images.zip` : `exifforge_bulk_${entries.length}_images.zip`} />}
                  size="lg"
                  variant="outline"
                  className="gap-2 h-14 rounded-2xl font-bold border-accent text-accent hover:bg-accent/10"
                >
                  <Download className="h-5 w-5" /> Re-download ZIP
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              All processing happens on our secure server. Files are deleted immediately after download.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
