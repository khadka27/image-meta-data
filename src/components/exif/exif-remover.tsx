"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Image as ImageIcon, Download, Trash2, MapPin, Camera } from "lucide-react";

export function ExifRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setSuccess(false);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setSuccess(false);
    }
  };

  const handleRemove = async (type: "all" | "gps" | "camera") => {
    if (!file) return;
    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/exif/remove", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process");

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cleaned_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("An error occurred while removing metadata.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed border-destructive/40 bg-destructive/5 rounded-3xl p-16 text-center hover:bg-destructive/10 hover:border-destructive transition-all duration-300 cursor-pointer shadow-inner group relative overflow-hidden"
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
          <UploadCloud className="h-16 w-16 mx-auto text-destructive mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10" />
          <h3 className="text-2xl font-bold mb-2 tracking-tight relative z-10 text-destructive">Upload Image to Strip Metadata</h3>
          <p className="text-muted-foreground relative z-10">Drag and drop or click to browse</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 p-6 border rounded-xl bg-card">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-accent" />
              {file.name}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setSuccess(false); }}>
              Change File
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              disabled={loading}
              onClick={() => handleRemove("all")}
              className="h-auto flex flex-col items-center justify-center gap-3 p-6 bg-destructive hover:bg-destructive/90 text-white"
            >
              <Trash2 className="h-8 w-8" />
              <div className="text-center">
                <span className="block font-semibold">Remove All Metadata</span>
                <span className="block text-xs opacity-80 mt-1">Strip EXIF, IPTC, XMP completely</span>
              </div>
            </Button>
            
            <Button 
              disabled={loading}
              variant="outline"
              onClick={() => handleRemove("gps")}
              className="h-auto flex flex-col items-center justify-center gap-3 p-6 hover:bg-accent/10 border-accent/20"
            >
              <MapPin className="h-8 w-8 text-accent" />
              <div className="text-center">
                <span className="block font-semibold">Remove GPS Only</span>
                <span className="block text-xs text-muted-foreground mt-1">Keep camera info, hide location</span>
              </div>
            </Button>
            
            <Button 
              disabled={loading}
              variant="outline"
              onClick={() => handleRemove("camera")}
              className="h-auto flex flex-col items-center justify-center gap-3 p-6 hover:bg-accent/10 border-accent/20"
            >
              <Camera className="h-8 w-8 text-accent" />
              <div className="text-center">
                <span className="block font-semibold">Remove Camera Info</span>
                <span className="block text-xs text-muted-foreground mt-1">Hide make, model, lens details</span>
              </div>
            </Button>
          </div>
          
          {loading && (
            <p className="text-center text-sm text-muted-foreground animate-pulse">Processing and downloading...</p>
          )}
          
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg flex items-center justify-center gap-2">
              <Download className="h-5 w-5" />
              <p className="font-medium">File successfully cleaned and downloaded!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
