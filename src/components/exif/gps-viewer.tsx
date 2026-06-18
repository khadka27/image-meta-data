/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import exifr from "exifr";
import { Button } from "@/components/ui/button";
import { UploadCloud, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

import "leaflet/dist/leaflet.css";

// Dynamic imports to prevent SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export function GpsViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fix for leaflet default markers in Next.js
  useEffect(() => {
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    });
  }, []);

  const processImage = async (file: File) => {
    setLoading(true);
    setFile(file);
    setLocation(null);
    setError(null);
    
    try {
      const data = await exifr.gps(file);
      if (data && data.latitude && data.longitude) {
        setLocation({ lat: data.latitude, lng: data.longitude });
      } else {
        setError("No GPS coordinates found in this image.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to parse image.");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processImage(e.target.files[0]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
           <div className="flex-1 w-full">
             <input id="gps-upload" type="file" accept="image/jpeg, image/png, image/webp, image/heic" className="hidden" onChange={onFileChange} />
             <div onClick={() => document.getElementById('gps-upload')?.click()} className="w-full p-8 rounded-xl border-2 border-dashed border-border text-center hover:bg-muted/50 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
               <UploadCloud className="h-8 w-8 text-muted-foreground" />
               <span className="font-medium">Select Image to Find Location</span>
             </div>
           </div>
           
           {file && (
             <div className="flex-1 text-center md:text-left w-full p-4 border rounded-xl bg-muted/30">
               <p className="font-semibold truncate">{file.name}</p>
               {loading && <p className="text-sm text-muted-foreground animate-pulse mt-2">Extracting GPS...</p>}
               {error && <p className="text-sm text-destructive mt-2">{error}</p>}
               {location && (
                 <div className="text-sm text-muted-foreground mt-3">
                   <p className="flex items-center justify-center md:justify-start gap-1 font-medium text-foreground">
                     <MapPin className="h-4 w-4 text-accent" /> Location Detected
                   </p>
                   <p className="font-mono mt-1 opacity-80">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                 </div>
               )}
             </div>
           )}
        </div>
      </div>

      {location && (
        <div className="border rounded-xl overflow-hidden h-[500px] bg-muted relative z-0 shadow-sm">
          <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                Photo taken here. <br /> 
                <span className="text-xs text-muted-foreground">
                  Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                </span>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}
