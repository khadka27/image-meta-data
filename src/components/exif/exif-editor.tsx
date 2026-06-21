/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useRef } from "react";
import exifr from "exifr";
import { Button } from "@/components/ui/button";
import {
  UploadCloud, Trash2, Image as ImageIcon, Save, Plus,
  FileImage, Settings, ChevronDown, ChevronUp, Gauge, Loader2,
  CheckCircle2, AlertCircle, Zap, Sparkles
} from "lucide-react";
import Image from "next/image";
import { CAMERA_MAKES, CAMERA_MODELS } from "@/lib/camera-models";

type OutputFormat = "default" | "jpg" | "png" | "webp" | "avif" | "tiff";

interface ExifTag {
  id: string;
  key: string;
  value: string;
}

const FORMAT_OPTIONS: { value: OutputFormat; label: string; ext: string; desc: string; color: string }[] = [
  { value: "default", label: "Default",  ext: "-",    desc: "Keep original format", color: "#94a3b8" },
  { value: "jpg",     label: "JPEG",     ext: ".jpg", desc: "Best for photos", color: "#fb923c" },
  { value: "png",     label: "PNG",      ext: ".png", desc: "Lossless, screenshots", color: "#22d3ee" },
  { value: "webp",    label: "WebP",     ext: ".webp",desc: "Modern format",    color: "#34d399" },
  { value: "avif",    label: "AVIF",     ext: ".avif",desc: "Next-gen, ultra compressed",      color: "#a78bfa" },
  { value: "tiff",    label: "TIFF",     ext: ".tiff",desc: "Lossless, archiving", color: "#f472b6" },
];
const LOSSY_FORMATS: OutputFormat[] = ["jpg", "webp", "avif"];

const glass = {
  background: "rgba(13,18,55,0.5)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(139,92,246,0.18)",
} as const;

export function ExifEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [wipeOriginal, setWipeOriginal] = useState(false);
  
  const [tags, setTags] = useState<ExifTag[]>([]);
  
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("default");
  const [quality, setQuality]           = useState<number>(85);
  const [showOutputOptions, setShowOutputOptions] = useState(false);
  const [targetDeviceModel, setTargetDeviceModel] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const processImage = async (newFile: File) => {
    setLoading(true);
    setFile(newFile);
    setPreview(URL.createObjectURL(newFile));
    
    try {
      const data = await exifr.parse(newFile, true);
      const initialTags: ExifTag[] = [];
      
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
            let mappedKey = key;
            if (key === "latitude") mappedKey = "GPSLatitude";
            if (key === "longitude") mappedKey = "GPSLongitude";
            if (key === "Artist") mappedKey = "Author";
            
            initialTags.push({
              id: Math.random().toString(36).substr(2, 9),
              key: mappedKey,
              value: value instanceof Date ? value.toISOString() : String(value)
            });
          }
        });
      }
      
      if (initialTags.length === 0) {
        initialTags.push({ id: "1", key: "Author", value: "" });
        initialTags.push({ id: "2", key: "Make", value: "" });
        initialTags.push({ id: "3", key: "Model", value: "" });
      }
      
      initialTags.sort((a, b) => a.key.localeCompare(b.key));
      setTags(initialTags);
    } catch (error) {
      console.error("Error parsing EXIF:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImage(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImage(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    setTags([{ id: Math.random().toString(), key: "", value: "" }, ...tags]);
  };

  const handleRemoveTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  const handleChange = (id: string, field: "key" | "value", newValue: string) => {
    setTags(tags.map(t => t.id === id ? { ...t, [field]: newValue } : t));
  };

  const applyDeviceDefaults = () => {
    if (!targetDeviceModel) return;
    
    // Find make based on model
    let targetMake = "";
    Object.entries(CAMERA_MODELS).forEach(([make, models]) => {
      if (models.includes(targetDeviceModel)) {
        targetMake = make;
      }
    });

    if (!targetMake) targetMake = targetDeviceModel; // Fallback

    const newTags = [...tags];
    const updateOrAdd = (key: string, value: string) => {
      const existing = newTags.find(t => t.key === key);
      if (existing) existing.value = value;
      else newTags.push({ id: Math.random().toString(36).substr(2, 9), key, value });
    };

    updateOrAdd("Make", targetMake);
    updateOrAdd("Model", targetDeviceModel);
    updateOrAdd("Software", `${targetDeviceModel} OS`);
    
    setTags(newTags);
  };

  const handleDetect = async () => {
    setDetecting(true);
    try {
      const existingObj: Record<string, string> = {};
      tags.forEach(t => {
        if (t.key.trim() !== "") existingObj[t.key] = t.value;
      });

      const response = await fetch("/api/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ existingTags: existingObj }),
      });

      if (!response.ok) throw new Error("Failed to detect metadata");

      const generatedData = await response.json();
      
      const newTags = [...tags];
      const updateOrAdd = (key: string, value: string) => {
        const existing = newTags.find(t => t.key === key);
        if (existing) {
          existing.value = String(value);
        } else {
          newTags.push({ id: Math.random().toString(36).substr(2, 9), key, value: String(value) });
        }
      };

      Object.entries(generatedData).forEach(([k, v]) => {
        if (v && String(v).trim() !== "") {
          updateOrAdd(k, String(v));
        }
      });
      
      setTags(newTags);
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating AI metadata.");
    } finally {
      setDetecting(false);
    }
  };

  const handleReplaceAll = async () => {
    setReplacing(true);
    setWipeOriginal(true); // Automatically set wipe flag to true
    try {
      const response = await fetch("/api/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: targetDeviceModel || "" }),
      });

      if (!response.ok) throw new Error("Failed to fabricate metadata");

      const generatedData = await response.json();
      
      const newTags: ExifTag[] = [];
      Object.entries(generatedData).forEach(([k, v]) => {
        if (v && String(v).trim() !== "") {
          newTags.push({ id: Math.random().toString(36).substr(2, 9), key: k, value: String(v) });
        }
      });
      
      setTags(newTags);
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating new AI metadata.");
    } finally {
      setReplacing(false);
    }
  };

  const handleSave = async () => {
    if (!file) return;
    setSaving(true);

    try {
      const data = new FormData();
      data.append("file", file);
      
      const metadataObj: Record<string, string> = {};
      tags.forEach(t => {
        if (t.key.trim() !== "") {
          metadataObj[t.key.trim()] = t.value;
        }
      });
      
      data.append("metadata", JSON.stringify(metadataObj));
      data.append("outputFormat", outputFormat);
      data.append("quality", quality.toString());
      if (wipeOriginal) data.append("wipeOriginal", "true");

      const response = await fetch("/api/exif/edit", {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Failed to save metadata");

      let downloadName = `edited_${file.name}`;
      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          downloadName = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving metadata.");
    } finally {
      setSaving(false);
    }
  };

  const selectedFmt = FORMAT_OPTIONS.find(f => f.value === outputFormat)!;
  const showQuality = LOSSY_FORMATS.includes(outputFormat);
  const inputClass = "flex h-10 w-full rounded-xl border px-3 py-2 text-sm placeholder:opacity-50 focus-visible:outline-none transition-all";

  return (
    <div className="space-y-6">
      {!file ? (
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
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          <div
            className="h-16 w-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}
          >
            <UploadCloud className="h-8 w-8" style={{ color: "#a78bfa" }} />
          </div>
          <h3 className="text-2xl font-extrabold mb-2 tracking-tight" style={{ color: "#e2e8f8" }}>
            Upload Image to Edit
          </h3>
          <p className="text-sm" style={{ color: "#64748b" }}>
            JPEG, PNG, WebP, TIFF, HEIC, AVIF, RAW & more
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl p-6 flex flex-col md:flex-row gap-6" style={glass}>
            {/* Left Preview */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.2)", background: "rgba(13,18,55,0.6)" }}>
                {preview ? (
                  <Image src={preview} alt="Preview" fill className="object-contain" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
                  </div>
                )}
              </div>
              <Button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="w-full rounded-xl transition-colors"
                style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
              >
                Change Image
              </Button>
            </div>

            {/* Right Editor */}
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl" style={{ background: "rgba(13,18,55,0.7)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: "#e2e8f8" }}>Dynamic Tags</h3>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>Edit individual metadata tags</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <select
                    className="flex h-9 flex-1 sm:w-48 rounded-xl px-2 text-xs transition-colors focus-visible:outline-none"
                    style={{ background: "rgba(13,18,55,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#e2e8f8" }}
                    value={targetDeviceModel}
                    onChange={e => {
                      setTargetDeviceModel(e.target.value);
                    }}
                  >
                    <option value="">Set Device Make/Model...</option>
                    {Object.entries(CAMERA_MODELS).map(([group, models]) => (
                      <optgroup key={group} label={group}>
                        {models.map(model => <option key={model} value={model}>{model}</option>)}
                      </optgroup>
                    ))}
                  </select>
                  <Button 
                    size="sm" 
                    onClick={applyDeviceDefaults} 
                    className="h-9 px-3 rounded-xl transition-colors text-xs"
                    style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}
                  >
                    Apply
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleDetect}
                    disabled={detecting || replacing}
                    className="h-9 px-3 rounded-xl transition-colors text-xs gap-1"
                    style={{ background: "rgba(244,114,182,0.15)", color: "#f472b6", border: "1px solid rgba(244,114,182,0.3)" }}
                  >
                    {detecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />} AI Detect
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleReplaceAll}
                    disabled={detecting || replacing}
                    className="h-9 px-3 rounded-xl transition-colors text-xs gap-1"
                    style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)" }}
                  >
                    {replacing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} AI Replace All
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleAddTag} 
                    className="h-9 px-3 rounded-xl transition-colors text-xs gap-1"
                    style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.3)" }}
                  >
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#a78bfa" }} />
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex flex-col sm:flex-row gap-2">
                      <input 
                        value={tag.key} 
                        onChange={(e) => handleChange(tag.id, "key", e.target.value)} 
                        className={inputClass} 
                        style={{ background: "rgba(13,18,55,0.6)", border: "1px solid rgba(139,92,246,0.2)", color: "#e2e8f8", flex: "1" }}
                        placeholder="Tag Name (e.g. Artist)" 
                      />
                      <div className="relative flex-[2]">
                        <input 
                          value={tag.value} 
                          onChange={(e) => handleChange(tag.id, "value", e.target.value)} 
                          className={inputClass}
                          style={{ background: "rgba(13,18,55,0.6)", border: "1px solid rgba(139,92,246,0.2)", color: "#e2e8f8" }}
                          placeholder="Value" 
                          list={`${tag.key}-list-${tag.id}`}
                        />
                        {tag.key === "Make" && (
                          <datalist id={`Make-list-${tag.id}`}>
                            {CAMERA_MAKES.map(make => <option key={make} value={make} />)}
                          </datalist>
                        )}
                        {(tag.key === "Model" || tag.key === "CameraModel") && (
                          <datalist id={`Model-list-${tag.id}`}>
                            {Object.entries(CAMERA_MODELS).map(([group, models]) => (
                              models.map(model => <option key={model} value={model}>{group}</option>)
                            ))}
                          </datalist>
                        )}
                      </div>
                      <Button 
                        size="icon" 
                        className="h-10 w-10 shrink-0 rounded-xl self-end sm:self-auto"
                        style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
                        onClick={() => handleRemoveTag(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {tags.length === 0 && (
                    <div className="p-8 text-center text-xs" style={{ color: "#64748b" }}>
                      No tags found. Click &quot;Add&quot; to inject new tags.
                    </div>
                  )}
                </div>
              )}

              {/* Wipe Original Checkbox */}
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={wipeOriginal} 
                  onChange={(e) => setWipeOriginal(e.target.checked)} 
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-accent focus:ring-accent focus:ring-offset-gray-900" 
                />
                <span className="text-sm font-semibold" style={{ color: wipeOriginal ? "#fb923c" : "#94a3b8" }}>
                  Wipe Original EXIF (Save ONLY these tags)
                </span>
              </label>

            </div>
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
                  <p className="text-xs mt-3 px-1" style={{ color: "#475569" }}>
                    {selectedFmt.desc}
                  </p>
                </div>

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

                    <div className="flex justify-between text-[10px] mt-1.5" style={{ color: "#334155" }}>
                      <span>10% · Smallest</span>
                      <span>55% · Balanced</span>
                      <span>100% · Best Quality</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2.5 h-14 rounded-2xl text-base font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
              boxShadow: saving ? "none" : "0 0 24px rgba(124,58,237,0.4), 0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {saving ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Saving & Processing…</>
            ) : (
              <><Save className="h-5 w-5" /> Save Tags & Download File</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
