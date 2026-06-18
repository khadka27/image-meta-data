"use client";

import { useState } from "react";
import exifr from "exifr";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExifCompare() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [metaA, setMetaA] = useState<any>(null);
  const [metaB, setMetaB] = useState<any>(null);

  const processImage = async (file: File, isA: boolean) => {
    try {
      const data = await exifr.parse(file, true);
      if (isA) {
        setFileA(file);
        setMetaA(data || {});
      } else {
        setFileB(file);
        setMetaB(data || {});
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadA = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processImage(e.target.files[0], true);
  };

  const handleUploadB = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processImage(e.target.files[0], false);
  };

  const allKeys = Array.from(new Set([...Object.keys(metaA || {}), ...Object.keys(metaB || {})]))
    .filter(k => typeof (metaA?.[k] || metaB?.[k]) !== "object" || (metaA?.[k] || metaB?.[k]) instanceof Date)
    .sort();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload A */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Image A</h3>
          {!fileA ? (
             <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/50 cursor-pointer" onClick={() => document.getElementById('compare-upload-a')?.click()}>
               <input id="compare-upload-a" type="file" accept="image/*" className="hidden" onChange={handleUploadA} />
               <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
               <p className="text-sm font-medium">Upload Image A</p>
             </div>
          ) : (
             <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
               <span className="truncate flex items-center text-sm font-medium"><ImageIcon className="h-4 w-4 mr-2" />{fileA.name}</span>
               <Button variant="ghost" size="sm" onClick={() => { setFileA(null); setMetaA(null); }}>Clear</Button>
             </div>
          )}
        </div>

        {/* Upload B */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Image B</h3>
          {!fileB ? (
             <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/50 cursor-pointer" onClick={() => document.getElementById('compare-upload-b')?.click()}>
               <input id="compare-upload-b" type="file" accept="image/*" className="hidden" onChange={handleUploadB} />
               <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
               <p className="text-sm font-medium">Upload Image B</p>
             </div>
          ) : (
             <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
               <span className="truncate flex items-center text-sm font-medium"><ImageIcon className="h-4 w-4 mr-2" />{fileB.name}</span>
               <Button variant="ghost" size="sm" onClick={() => { setFileB(null); setMetaB(null); }}>Clear</Button>
             </div>
          )}
        </div>
      </div>

      {(metaA || metaB) && (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Metadata Field</th>
                <th className="px-6 py-3 font-semibold border-l">Image A</th>
                <th className="px-6 py-3 font-semibold border-l">Image B</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {allKeys.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-4 text-center text-muted-foreground">No comparable data found.</td></tr>
              )}
              {allKeys.map(key => {
                const valA = metaA?.[key]?.toString() || "-";
                const valB = metaB?.[key]?.toString() || "-";
                const isDifferent = metaA && metaB && valA !== valB;
                
                return (
                  <tr key={key} className={isDifferent ? "bg-accent/5" : ""}>
                    <td className="px-6 py-3 font-medium text-foreground">{key}</td>
                    <td className="px-6 py-3 border-l text-muted-foreground max-w-[200px] truncate" title={valA}>{valA}</td>
                    <td className="px-6 py-3 border-l text-muted-foreground max-w-[200px] truncate" title={valB}>{valB}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
