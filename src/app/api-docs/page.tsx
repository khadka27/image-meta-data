"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Terminal, 
  Check, 
  Copy, 
  Cpu, 
  Layers, 
  FileCode, 
  Globe, 
  ArrowLeft,
  ChevronRight,
  Database,
  Info
} from "lucide-react";

type EndpointId = "single-edit" | "bulk-process" | "ai-generate";
type LanguageId = "curl" | "javascript" | "wordpress" | "python";

export default function ApiDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointId>("single-edit");
  const [activeLang, setActiveLang] = useState<LanguageId>("curl");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets: Record<EndpointId, Record<LanguageId, string>> = {
    "single-edit": {
      curl: `curl -X POST \\
  -F "file=@photo.jpg" \\
  -F 'metadata={"Author":"John Doe","CameraModel":"iPhone 15 Pro Max","GPSLatitude":37.7749,"GPSLongitude":-122.4194}' \\
  -o edited_photo.jpg \\
  http://localhost:3000/api/exif/edit`,
      javascript: `// JavaScript / React / Next.js Client Side Fetch Example
const formData = new FormData();
formData.append("file", fileObject); // File object from input type="file"
formData.append("metadata", JSON.stringify({
  Author: "John Doe",
  CameraMake: "Apple",
  CameraModel: "iPhone 15 Pro Max",
  GPSLatitude: 37.7749,
  GPSLongitude: -122.4194
}));

const response = await fetch("http://localhost:3000/api/exif/edit", {
  method: "POST",
  body: formData
});

if (response.ok) {
  // Read Content-Disposition to get the device-default filename
  const disposition = response.headers.get("Content-Disposition");
  let filename = "edited_image.jpg";
  if (disposition) {
    const filenameMatch = disposition.match(/filename="(.+)"/);
    if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
  }

  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  
  // Download file in browser
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}`,
      wordpress: `// WordPress (PHP) wp_remote_post() Integration Example
$boundary = wp_generate_password(24);
$headers = array(
    'content-type' => 'multipart/form-data; boundary=' . $boundary
);

$body = '';

// Append Image File
$body .= '--' . $boundary . "\r\n";
$body .= 'Content-Disposition: form-data; name="file"; filename="photo.jpg"' . "\r\n";
$body .= 'Content-Type: image/jpeg' . "\r\n\r\n";
$body .= file_get_contents('/path/to/local/photo.jpg') . "\r\n";

// Append Metadata JSON
$body .= '--' . $boundary . "\r\n";
$body .= 'Content-Disposition: form-data; name="metadata"' . "\r\n\r\n";
$body .= json_encode([
    'Author' => 'John Doe',
    'CameraMake' => 'Apple',
    'CameraModel' => 'iPhone 15 Pro Max',
    'GPSLatitude' => 37.7749,
    'GPSLongitude' => -122.4194
]) . "\r\n";

$body .= '--' . $boundary . '--';

$response = wp_remote_post('http://localhost:3000/api/exif/edit', [
    'headers' => $headers,
    'body'    => $body,
    'timeout' => 30
]);

if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
    $image_binary = wp_remote_retrieve_body($response);
    
    // Grab original disposition filename (like IMG_0001.jpg)
    $headers_resp = wp_remote_retrieve_headers($response);
    $filename = 'edited_photo.jpg';
    if (isset($headers_resp['content-disposition'])) {
        preg_match('/filename="(.+)"/', $headers_resp['content-disposition'], $matches);
        if (isset($matches[1])) $filename = $matches[1];
    }
    
    file_put_contents('/path/to/save/' . $filename, $image_binary);
}`,
      python: `import requests
import json

url = "http://localhost:3000/api/exif/edit"
files = {
    "file": ("photo.jpg", open("photo.jpg", "rb"), "image/jpeg")
}
data = {
    "metadata": json.dumps({
        "Author": "John Doe",
        "CameraMake": "Apple",
        "CameraModel": "iPhone 15 Pro Max",
        "GPSLatitude": 37.7749,
        "GPSLongitude": -122.4194
    })
}

response = requests.post(url, files=files, data=data)
if response.status_code == 200:
    # Save the file under device-default filename from header
    disposition = response.headers.get("Content-Disposition", "")
    filename = "edited_photo.jpg"
    if 'filename="' in disposition:
        filename = disposition.split('filename="')[1].split('"')[0]
        
    with open(filename, "wb") as f:
        f.write(response.content)
    print(f"Saved to {filename}")`
    },
    "bulk-process": {
      curl: `curl -X POST \\
  -F "files=@photo1.jpg" \\
  -F "files=@photo2.jpg" \\
  -F "operation=edit" \\
  -F 'metadata={"Author":"Sarah Carter","CameraModel":"Galaxy S24 Ultra"}' \\
  -o processed_photos.zip \\
  http://localhost:3000/api/exif/bulk`,
      javascript: `// Batch Process multiple files via JavaScript
const formData = new FormData();
formData.append("files", file1);
formData.append("files", file2);
formData.append("operation", "edit"); // Options: "edit", "remove_all", "remove_gps"
formData.append("metadata", JSON.stringify({
  Author: "Sarah Carter",
  CameraMake: "Samsung",
  CameraModel: "Galaxy S24 Ultra"
}));

const response = await fetch("http://localhost:3000/api/exif/bulk", {
  method: "POST",
  body: formData
});

if (response.ok) {
  // Read custom result count headers
  const okCount = response.headers.get("X-Results-Ok");
  const errCount = response.headers.get("X-Results-Error");
  console.log(\`Successfully processed: \${okCount}, Failed: \${errCount}\`);

  const zipBlob = await response.blob();
  const downloadUrl = URL.createObjectURL(zipBlob);
  // Download zip package
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = "exifforge_processed_images.zip";
  a.click();
}`,
      wordpress: `// WordPress (PHP) wp_remote_post() Batch Example
$boundary = wp_generate_password(24);
$headers = array('content-type' => 'multipart/form-data; boundary=' . $boundary);
$body = '';

// Append Photo 1
$body .= '--' . $boundary . "\r\n";
$body .= 'Content-Disposition: form-data; name="files"; filename="image1.jpg"' . "\r\n\r\n";
$body .= file_get_contents('/path/to/image1.jpg') . "\r\n";

// Append Photo 2
$body .= '--' . $boundary . "\r\n";
$body .= 'Content-Disposition: form-data; name="files"; filename="image2.jpg"' . "\r\n\r\n";
$body .= file_get_contents('/path/to/image2.jpg') . "\r\n";

// Operation: "edit", "remove_all", or "remove_gps"
$body .= '--' . $boundary . "\r\n";
$body .= 'Content-Disposition: form-data; name="operation"' . "\r\n\r\n" . 'edit' . "\r\n";

// Metadata parameters (for "edit" only)
$body .= '--' . $boundary . "\r\n";
$body .= 'Content-Disposition: form-data; name="metadata"' . "\r\n\r\n";
$body .= json_encode([
    'Author' => 'Sarah Carter',
    'CameraMake' => 'Samsung',
    'CameraModel' => 'Galaxy S24 Ultra'
]) . "\r\n";

$body .= '--' . $boundary . '--';

$response = wp_remote_post('http://localhost:3000/api/exif/bulk', [
    'headers' => $headers,
    'body'    => $body,
    'timeout' => 60
]);

if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
    $zip_binary = wp_remote_retrieve_body($response);
    file_put_contents('/path/to/save/processed_archive.zip', $zip_binary);
}`,
      python: `import requests
import json

url = "http://localhost:3000/api/exif/bulk"
files = [
    ("files", ("image1.jpg", open("image1.jpg", "rb"), "image/jpeg")),
    ("files", ("image2.jpg", open("image2.jpg", "rb"), "image/jpeg"))
]
data = {
    "operation": "edit",
    "metadata": json.dumps({
        "Author": "Sarah Carter",
        "CameraMake": "Samsung",
        "CameraModel": "Galaxy S24 Ultra"
    })
}

response = requests.post(url, files=files, data=data)
if response.status_code == 200:
    ok_count = response.headers.get("X-Results-Ok")
    err_count = response.headers.get("X-Results-Error")
    print(f"Success: {ok_count}, Failed: {err_count}")
    
    with open("processed_photos.zip", "wb") as f:
        f.write(response.content)
    print("Archive saved successfully.")`
    },
    "ai-generate": {
      curl: `curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"model":"Pixel 8 Pro"}' \\
  http://localhost:3000/api/generate-metadata`,
      javascript: `// Query DeepSeek via ExifForge AI backend
const response = await fetch("http://localhost:3000/api/generate-metadata", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "Pixel 8 Pro" // Optional target camera model
  })
});

if (response.ok) {
  const metadata = await response.json();
  console.log("AI Generated Metadata:", metadata);
  /* Output contains Make, Model, LensModel, Software, Author,
     Copyright, Description, DateTimeOriginal, GPSLatitude, GPSLongitude, City, Country */
}`,
      wordpress: `// WordPress PHP Integration for AI Details Generation
$response = wp_remote_post('http://localhost:3000/api/generate-metadata', [
    'headers' => array(
        'Content-Type' => 'application/json'
    ),
    'body'    => json_encode([
        'model' => 'Pixel 8 Pro'
    ]),
    'timeout' => 15
]);

if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
    $metadata = json_decode(wp_remote_retrieve_body($response), true);
    print_r($metadata);
}`,
      python: `import requests

url = "http://localhost:3000/api/generate-metadata"
payload = {
    "model": "Pixel 8 Pro"
}

response = requests.post(url, json=payload)
if response.status_code == 200:
    metadata_fields = response.json()
    print("AI Generated metadata fields:")
    for key, val in metadata_fields.items():
        print(f"  {key}: {val}")`
    }
  };

  const endpointDetails = {
    "single-edit": {
      title: "Single EXIF Edit",
      method: "POST",
      path: "/api/exif/edit",
      desc: "Injects, rewrites, or cleans EXIF tags on a single image file. Automatically applies default device-specific naming conventions based on the Make/Model.",
      contentType: "multipart/form-data",
      params: [
        { name: "file", type: "File", req: "Yes", desc: "The image binary file (JPEG, PNG, WebP, TIFF)." },
        { name: "metadata", type: "JSON string", req: "Yes", desc: "A JSON string of tag names and values (e.g. Author, CameraModel, GPSLatitude)." }
      ],
      response: "Binary file stream with the same Content-Type as the input image. File name is sent in Content-Disposition header."
    },
    "bulk-process": {
      title: "Bulk EXIF Processing",
      method: "POST",
      path: "/api/exif/bulk",
      desc: "Processes multiple image files in batch. Can strip all data, remove GPS coordinates only, or bulk edit values for all files.",
      contentType: "multipart/form-data",
      params: [
        { name: "files", type: "File[]", req: "Yes", desc: "One or more image files. Append multiple 'files' fields to the FormData request." },
        { name: "operation", type: "string", req: "Yes", desc: "The batch operation: 'remove_all', 'remove_gps', or 'edit'." },
        { name: "metadata", type: "JSON string", req: "No", desc: "Required only for 'edit' operation. Dynamic EXIF tags to apply." }
      ],
      response: "A ZIP file binary stream containing the processed images renamed according to target device convention, alongside a '_processing_log.json' manifest log."
    },
    "ai-generate": {
      title: "AI Metadata Generator",
      method: "POST",
      path: "/api/generate-metadata",
      desc: "Requests DeepSeek AI to fabricate high-quality, realistic, location-specific EXIF metadata tags matching the given device make/model.",
      contentType: "application/json",
      params: [
        { name: "model", type: "string", req: "No", desc: "Specific target camera model name (e.g., 'iPhone 15 Pro Max', 'Galaxy S24'). If omitted, a random popular device is selected." }
      ],
      response: "JSON object containing simulated fields including Make, Model, LensModel, Software, Author, Copyright, Description, DateTimeOriginal, GPSLatitude, GPSLongitude, City, and Country."
    }
  };

  const activeDetails = endpointDetails[activeEndpoint];
  const activeCode = codeSnippets[activeEndpoint][activeLang];

  return (
    <div className="flex-1 w-full bg-background text-primary">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-[5%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
          <span className="text-xs font-semibold text-muted-foreground">Developer Hub</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
          <span className="text-xs font-semibold text-accent">API Docs</span>
        </div>

        {/* Hero Section */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-400 mb-4 tracking-wide">
            <Globe className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} /> REST API v1.0 Exponent
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
            Integrate <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">ExifForge APIs</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Build custom photography, privacy, or media workflow features into your WordPress plugins, Next.js setups, React apps, or python scripts. Includes full CORS support.
          </p>
        </div>

        {/* API Docs Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation & Endpoint Details (7 columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Endpoint Selector Tabs */}
            <div className="bg-card border border-border/40 p-2.5 rounded-2xl flex flex-wrap gap-1 shadow-sm">
              {(Object.keys(endpointDetails) as EndpointId[]).map(id => (
                <button
                  key={id}
                  onClick={() => setActiveEndpoint(id)}
                  className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all
                    ${activeEndpoint === id
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                >
                  {id === "single-edit" && <Code className="h-4 w-4" />}
                  {id === "bulk-process" && <Layers className="h-4 w-4" />}
                  {id === "ai-generate" && <Cpu className="h-4 w-4" />}
                  {endpointDetails[id].title}
                </button>
              ))}
            </div>

            {/* Endpoint Spec Card */}
            <div className="bg-card border border-border/40 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-accent to-orange-400" />
              
              {/* Method badge and Path */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center justify-center font-extrabold text-xs tracking-wider uppercase px-3 py-1.5 rounded-lg border bg-green-500/10 text-green-400 border-green-500/20">
                  {activeDetails.method}
                </span>
                <code className="text-sm md:text-base font-mono font-bold bg-muted px-3 py-1.5 rounded-xl border border-border/50 select-all">
                  {activeDetails.path}
                </code>
              </div>

              <h2 className="text-2xl font-extrabold mb-3">{activeDetails.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {activeDetails.desc}
              </p>

              {/* Specs List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/20 mb-8 text-xs">
                <div>
                  <span className="font-bold text-muted-foreground uppercase tracking-wider block mb-1">Base URL</span>
                  <span className="font-mono text-primary select-all">http://localhost:3000</span>
                </div>
                <div>
                  <span className="font-bold text-muted-foreground uppercase tracking-wider block mb-1">Request Content-Type</span>
                  <span className="font-mono text-primary">{activeDetails.contentType}</span>
                </div>
              </div>

              {/* Request Parameters */}
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Database className="h-4.5 w-4.5 text-accent" /> Request Parameters
              </h3>
              
              <div className="border border-border/40 rounded-2xl overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/40 font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="p-4">Parameter</th>
                        <th className="p-4">Type</th>
                        <th className="p-4 text-center">Required</th>
                        <th className="p-4">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {activeDetails.params.map(param => (
                        <tr key={param.name} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 font-mono font-bold text-accent">{param.name}</td>
                          <td className="p-4 font-mono text-primary/80">{param.type}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${param.req === "Yes" ? "bg-red-500/10 text-red-400" : "bg-muted text-muted-foreground"}`}>
                              {param.req}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground leading-relaxed">{param.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Response Spec */}
              <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                <FileCode className="h-4.5 w-4.5 text-accent" /> Response Body
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {activeDetails.response}
              </p>

              {/* CORS Note */}
              <div className="mt-8 flex gap-3 p-4 rounded-2xl bg-accent/5 border border-accent/20">
                <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-accent">CORS Enabled:</strong> You can invoke this endpoint directly inside your client-side React code. Preflight <code className="font-mono text-primary font-bold bg-muted/60 px-1 py-0.5 rounded">OPTIONS</code> queries are automatically cached for 24 hours to reduce latency.
                </p>
              </div>

            </div>

          </div>

          {/* Right Code Display (5 columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px] relative">
              
              {/* Header Tabs */}
              <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Terminal className="h-4 w-4 text-zinc-400 mr-2" />
                  {(["curl", "javascript", "wordpress", "python"] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors
                        ${activeLang === lang
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                      {lang === "curl" && "cURL"}
                      {lang === "javascript" && "JS Fetch"}
                      {lang === "wordpress" && "WordPress"}
                      {lang === "python" && "Python"}
                    </button>
                  ))}
                </div>

                {/* Copy button */}
                <button
                  onClick={() => handleCopy(activeCode)}
                  className="h-8 w-8 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors relative"
                  title="Copy code snippet"
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* Code Editor Body */}
              <div className="flex-1 overflow-auto p-5 font-mono text-xs text-zinc-300 leading-relaxed bg-zinc-950 select-all">
                <pre className="whitespace-pre">{activeCode}</pre>
              </div>

              {/* Footer Indicator */}
              <div className="bg-zinc-900 border-t border-zinc-800 px-5 py-3 text-[10px] text-zinc-500 flex justify-between items-center">
                <span>Endpoint: {activeDetails.path}</span>
                <span>Language: {activeLang.toUpperCase()}</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
