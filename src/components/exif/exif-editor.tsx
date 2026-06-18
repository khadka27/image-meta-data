"use client";

import { useState, useCallback } from "react";
import exifr from "exifr";
import { Button } from "@/components/ui/button";
import { UploadCloud, Image as ImageIcon, Save, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { CAMERA_MAKES, CAMERA_MODELS } from "@/lib/camera-models";

interface ExifTag {
  id: string;
  key: string;
  value: string;
}

export function ExifEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [tags, setTags] = useState<ExifTag[]>([]);

  const processImage = async (file: File) => {
    setLoading(true);
    setFile(file);
    setPreview(URL.createObjectURL(file));
    
    try {
      const data = await exifr.parse(file, true);
      const initialTags: ExifTag[] = [];
      
      if (data) {
        // Filter out complex objects like buffers or arrays that aren't strings
        Object.entries(data).forEach(([key, value]) => {
          if (
            typeof value === "string" || 
            typeof value === "number" || 
            value instanceof Date
          ) {
            // exifr normalizes latitude/longitude, let's map them to EXIF standard names for the UI
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
      
      // If empty, add some default empty fields to help the user
      if (initialTags.length === 0) {
        initialTags.push({ id: "1", key: "Author", value: "" });
        initialTags.push({ id: "2", key: "Copyright", value: "" });
        initialTags.push({ id: "3", key: "Make", value: "" });
      }
      
      // Sort alphabetically by key
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

  const handleSave = async () => {
    if (!file) return;
    setSaving(true);

    try {
      const data = new FormData();
      data.append("file", file);
      
      // Convert array back to object
      const metadataObj: Record<string, string> = {};
      tags.forEach(t => {
        if (t.key.trim() !== "") {
          metadataObj[t.key.trim()] = t.value;
        }
      });
      
      data.append("metadata", JSON.stringify(metadataObj));

      const response = await fetch("/api/exif/edit", {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Failed to save metadata");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited_${file.name}`;
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

  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className="space-y-8">
      {!file ? (
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed border-accent/40 bg-accent/5 rounded-3xl p-16 text-center hover:bg-accent/10 hover:border-accent transition-all duration-300 cursor-pointer shadow-inner group relative overflow-hidden"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <input 
            id="file-upload" 
            type="file" 
            accept="image/jpeg, image/png, image/webp, image/tiff" 
            className="hidden" 
            onChange={onFileChange}
          />
          <UploadCloud className="h-16 w-16 mx-auto text-accent mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10" />
          <h3 className="text-2xl font-bold mb-2 tracking-tight relative z-10">Upload Image to Edit Metadata</h3>
          <p className="text-muted-foreground relative z-10">Drag and drop or click to browse</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-accent" />
              {file.name}
            </h2>
            <Button variant="outline" onClick={() => { setFile(null); setPreview(null); }}>
              Upload Another
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 border rounded-xl overflow-hidden bg-muted flex items-center justify-center p-4 h-max sticky top-24">
              {preview && (
                <Image src={preview} alt="Preview" width={400} height={400} className="w-full h-auto object-contain rounded" />
              )}
            </div>
            
            <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Dynamic Metadata Editor</h3>
                <Button variant="outline" size="sm" onClick={handleAddTag} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Field
                </Button>
              </div>
              
              {loading ? (
                <p className="text-muted-foreground animate-pulse">Reading current metadata...</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-[1fr_2fr_auto] gap-3 text-sm font-medium text-muted-foreground mb-2 px-1">
                    <div>EXIF Tag Name</div>
                    <div>Value</div>
                    <div className="w-8"></div>
                  </div>
                  
                  <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="grid grid-cols-[1fr_2fr_auto] gap-3 items-start">
                        <input 
                          value={tag.key} 
                          onChange={(e) => handleChange(tag.id, "key", e.target.value)} 
                          className={inputClass} 
                          placeholder="e.g. Make, Artist, ISO" 
                        />
                        {tag.key === "Model" || tag.key === "CameraModel" || tag.key === "Make" ? (
                          <div className="relative">
                            <input 
                              value={tag.value} 
                              onChange={(e) => handleChange(tag.id, "value", e.target.value)} 
                              className={inputClass} 
                              placeholder={tag.key === "Make" ? "Camera Make" : "Camera Model"} 
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
                        ) : (
                          <input 
                            value={tag.value} 
                            onChange={(e) => handleChange(tag.id, "value", e.target.value)} 
                            className={inputClass} 
                            placeholder="Value" 
                          />
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive h-10 w-10 shrink-0"
                          onClick={() => handleRemoveTag(tag.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {tags.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No metadata fields. Click &apos;Add Field&apos; to start.</p>
                    )}
                  </div>
                  
                  <div className="pt-6 border-t flex justify-end mt-4">
                    <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                      {saving ? <span className="animate-pulse">Saving...</span> : <><Save className="h-4 w-4" /> Save & Download</>}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
