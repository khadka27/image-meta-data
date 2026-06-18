"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Image as ImageIcon, Download, Copy, ArrowRight } from "lucide-react";
import Image from "next/image";

export function ExifReplacer() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  
  const [targetFile, setTargetFile] = useState<File | null>(null);
  const [targetPreview, setTargetPreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSourceFile(e.target.files[0]);
      setSourcePreview(URL.createObjectURL(e.target.files[0]));
      setSuccess(false);
    }
  };

  const handleTargetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTargetFile(e.target.files[0]);
      setTargetPreview(URL.createObjectURL(e.target.files[0]));
      setSuccess(false);
    }
  };

  const handleProcess = async () => {
    if (!sourceFile || !targetFile) return;
    setLoading(true);
    setSuccess(false);

    try {
      const data = new FormData();
      data.append("source", sourceFile);
      data.append("target", targetFile);

      const response = await fetch("/api/exif/replace", {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Failed to process metadata");

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `replaced_${targetFile.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("An error occurred while replacing metadata.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Source File */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Source Image</h3>
          <p className="text-sm text-muted-foreground mb-4">Extract metadata from this image.</p>
          
          {!sourceFile ? (
             <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/50 cursor-pointer" onClick={() => document.getElementById('source-upload')?.click()}>
               <input id="source-upload" type="file" accept="image/*" className="hidden" onChange={handleSourceUpload} />
               <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
               <p className="text-sm font-medium">Upload Source</p>
             </div>
          ) : (
             <div className="flex flex-col items-center">
               <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center overflow-hidden mb-4 border">
                 {sourcePreview && <Image src={sourcePreview} alt="Source" width={200} height={200} className="object-contain h-full w-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
               </div>
               <p className="text-sm font-medium truncate w-full text-center">{sourceFile.name}</p>
               <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSourceFile(null)}>Change</Button>
             </div>
          )}
        </div>

        {/* Target File */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Target Image</h3>
          <p className="text-sm text-muted-foreground mb-4">Inject metadata into this image.</p>
          
          {!targetFile ? (
             <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/50 cursor-pointer" onClick={() => document.getElementById('target-upload')?.click()}>
               <input id="target-upload" type="file" accept="image/*" className="hidden" onChange={handleTargetUpload} />
               <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
               <p className="text-sm font-medium">Upload Target</p>
             </div>
          ) : (
             <div className="flex flex-col items-center">
               <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center overflow-hidden mb-4 border">
                 {targetPreview && <Image src={targetPreview} alt="Target" width={200} height={200} className="object-contain h-full w-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
               </div>
               <p className="text-sm font-medium truncate w-full text-center">{targetFile.name}</p>
               <Button variant="ghost" size="sm" className="mt-2" onClick={() => setTargetFile(null)}>Change</Button>
             </div>
          )}
        </div>

        {/* Arrow Indicator (Desktop) */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border rounded-full p-4 shadow-sm z-10">
          <ArrowRight className="h-6 w-6 text-accent" />
        </div>
      </div>

      <div className="flex flex-col items-center pt-4">
        <Button 
          size="lg" 
          disabled={!sourceFile || !targetFile || loading} 
          onClick={handleProcess}
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px]"
        >
          {loading ? "Processing..." : (
            <span className="flex items-center gap-2"><Copy className="h-5 w-5" /> Copy Metadata & Download</span>
          )}
        </Button>
        
        {success && (
          <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 text-sm">
            <Download className="h-4 w-4" />
            <span>Success! The target image has been updated.</span>
          </div>
        )}
      </div>
    </div>
  );
}
