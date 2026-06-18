/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import exifr from "exifr";
import { Button } from "@/components/ui/button";
import { UploadCloud, Image as ImageIcon, MapPin } from "lucide-react";
import Image from "next/image";

export function ExifViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const processImage = async (file: File) => {
    setLoading(true);
    setFile(file);
    setPreview(URL.createObjectURL(file));
    
    try {
      // Parse full metadata
      const data = await exifr.parse(file, true);
      setMetadata(data);
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
            accept="image/*" 
            className="hidden" 
            onChange={onFileChange}
          />
          <UploadCloud className="h-16 w-16 mx-auto text-accent mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10" />
          <h3 className="text-2xl font-bold mb-2 tracking-tight relative z-10">Upload Image to Analyze</h3>
          <p className="text-muted-foreground relative z-10">Drag and drop or click to browse</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-accent" />
              {file.name}
            </h2>
            <Button variant="outline" onClick={() => { setFile(null); setMetadata(null); setPreview(null); }}>
              Upload Another
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 border rounded-xl overflow-hidden bg-muted flex items-center justify-center p-4">
              {preview && (
                <Image 
                  src={preview} 
                  alt="Preview" 
                  width={400} 
                  height={400} 
                  className="w-full h-auto object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = (e.target as HTMLImageElement).nextElementSibling;
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />
              )}
              <div className="hidden flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <ImageIcon className="h-16 w-16" />
                <p className="text-sm font-medium">Preview not available</p>
                <p className="text-xs">{file?.name.split('.').pop()?.toUpperCase()} format</p>
              </div>
            </div>
            
            <div className="md:col-span-2">
              {loading ? (
                <div className="h-full flex items-center justify-center min-h-[200px]">
                  <p className="text-muted-foreground animate-pulse">Reading metadata...</p>
                </div>
              ) : metadata ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MetadataItem label="Camera Make" value={metadata.Make} />
                  <MetadataItem label="Camera Model" value={metadata.Model} />
                  <MetadataItem label="Lens" value={metadata.LensModel} />
                  <MetadataItem label="Date Taken" value={metadata.DateTimeOriginal?.toString() || metadata.CreateDate?.toString()} />
                  <MetadataItem label="ISO" value={metadata.ISO} />
                  <MetadataItem label="Aperture" value={metadata.FNumber ? `f/${metadata.FNumber}` : undefined} />
                  <MetadataItem label="Exposure Time" value={metadata.ExposureTime ? `${1 / metadata.ExposureTime}s` : undefined} />
                  <MetadataItem label="Focal Length" value={metadata.FocalLength ? `${metadata.FocalLength}mm` : undefined} />
                  <MetadataItem label="Copyright" value={metadata.Copyright} />
                  <MetadataItem label="Author / Artist" value={metadata.Artist} />
                  
                  {metadata.latitude && metadata.longitude && (
                    <div className="col-span-1 sm:col-span-2 mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20 flex items-start gap-3">
                      <MapPin className="text-accent h-5 w-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-foreground">GPS Location Found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Lat: {metadata.latitude.toFixed(6)}, Lng: {metadata.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center min-h-[200px] border rounded-xl border-dashed">
                  <p className="text-muted-foreground">No metadata found in this image.</p>
                </div>
              )}
            </div>
          </div>
          
          {metadata && (
             <div className="mt-8">
               <h3 className="font-semibold text-lg mb-4">Raw Metadata Data</h3>
               <pre className="bg-muted p-4 rounded-xl text-xs overflow-x-auto border">
                 {JSON.stringify(metadata, (key, value) => 
                   value instanceof Uint8Array ? '[Binary Data]' : value
                 , 2)}
               </pre>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetadataItem({ label, value }: { label: string; value: any }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="border rounded-lg p-3 bg-card shadow-sm">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium truncate" title={String(value)}>{String(value)}</p>
    </div>
  );
}
