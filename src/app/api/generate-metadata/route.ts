/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { model, make, existingTags } = await req.json();
    const isDetect = existingTags && Object.keys(existingTags).length > 0;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.warn("DEEPSEEK_API_KEY is missing. Using local fallback generator.");
      const fallback = isDetect ? generateLocalFallbackDetect(existingTags) : generateLocalFallbackFabricate(model);
      return NextResponse.json(fallback);
    }

    let prompt = "";
    if (isDetect) {
      // "Detect" mode: use existing metadata to infer context
      let context = "";
      for (const [key, val] of Object.entries(existingTags)) {
        if (typeof val === "string" && val.trim() !== "") {
          context += `- ${key}: ${val}\n`;
        }
      }
      prompt = `You are a helpful assistant that analyzes technical EXIF metadata from an uploaded image to infer and detect its context.
Given the following existing metadata:
${context}

Generate a believable, cohesive set of additional metadata based on these technical clues (e.g. fast shutter implies sports/action, wide aperture implies portrait, GPS implies location).
Respond ONLY with a valid JSON object containing exactly these fields:
- Description: A vivid, one-sentence description of what this photo likely depicts based on the technical clues.
- Keywords: A comma-separated list of 5-8 relevant tags.
- Copyright: A standard copyright string (e.g., "© 2024 Artist Name" - if Artist is known, use it).
- City: Detect or guess a realistic city name based on the context.
- Country: Detect or guess a realistic country based on the context.`;
    } else {
      // "Fabricate" mode: generate random data based on model
      const cameraContext = model ? `Target Camera Model: ${model}` : "Target Camera Model: A random popular smartphone or DSLR";
      prompt = `You are a helpful assistant that generates realistic EXIF metadata for images.
Given the target camera model, generate a believable, cohesive set of metadata for a photograph taken somewhere in the USA.
${cameraContext}

Respond ONLY with a valid JSON object containing the following fields:
- Make: The manufacturer of the camera (e.g., "Apple", "Samsung")
- Model: The exact camera model (must match the target model if provided, e.g., "iPhone 15 Pro Max").
- LensModel: A realistic and accurate lens specification string for this exact camera model.
- Software: The typical operating system or software version for this device (e.g., "iOS 17.1", "Android 14").
- Author: A believable photographer name
- Copyright: A standard copyright string (e.g., "© 2024 John Doe")
- Description: A vivid, one-sentence description of what the photo depicts at the location.
- DateTimeOriginal: A random past date and time for when the photo was taken, formatted strictly as "YYYY:MM:DD HH:MM:SS" (e.g., "2023:05:14 14:30:00").
- GPSLatitude: A realistic float representing latitude in the USA.
- GPSLongitude: A realistic float representing longitude in the USA.
- City: The name of the corresponding city/town.
- Country: "USA"`;
    }

    let response;
    try {
      response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You strictly output JSON objects without any surrounding markdown or code blocks. Never include \`\`\`json." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        }),
      });
    } catch (fetchError: any) {
      console.warn("DeepSeek API connection failed. Using local fallback generator. Error:", fetchError.message);
      const fallback = isDetect ? generateLocalFallbackDetect(existingTags) : generateLocalFallbackFabricate(model);
      return NextResponse.json(fallback);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("DeepSeek API error. Using local fallback generator. Error:", errorText);
      const fallback = isDetect ? generateLocalFallbackDetect(existingTags) : generateLocalFallbackFabricate(model);
      return NextResponse.json(fallback);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      console.warn("DeepSeek API returned empty content. Using local fallback generator.");
      const fallback = isDetect ? generateLocalFallbackDetect(existingTags) : generateLocalFallbackFabricate(model);
      return NextResponse.json(fallback);
    }
    
    // Fallback: Strip markdown code blocks just in case
    if (content.startsWith("```json")) {
      content = content.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (content.startsWith("```")) {
      content = content.replace(/^```/, "").replace(/```$/, "").trim();
    }

    let jsonResult;
    try {
      jsonResult = JSON.parse(content);
    } catch (parseError) {
      console.warn("DeepSeek API returned invalid JSON. Using local fallback generator. Content:", content);
      jsonResult = isDetect ? generateLocalFallbackDetect(existingTags) : generateLocalFallbackFabricate(model);
    }

    return NextResponse.json(jsonResult);

  } catch (error) {
    console.error("Metadata generation error:", error);
    return NextResponse.json({ error: "Internal server error during metadata generation" }, { status: 500 });
  }
}

// ───── Local Fallback Generators ─────

function generateLocalFallbackDetect(existingTags: any) {
  const make = existingTags?.Make || existingTags?.make || "Sony";
  const model = existingTags?.Model || existingTags?.model || "ILCE-7RM5";
  const author = existingTags?.Author || existingTags?.Artist || "Alex Mercer";
  const gpsLat = existingTags?.GPSLatitude || existingTags?.latitude;
  const gpsLng = existingTags?.GPSLongitude || existingTags?.longitude;
  
  let city = "New York";
  let country = "USA";
  if (gpsLat && gpsLng) {
    city = "Shibuya, Tokyo";
    country = "Japan";
  }

  return {
    Description: `A beautifully detailed photograph captured with a ${make} ${model} camera, emphasizing rich colors and technical precision.`,
    Keywords: "photography, technical metadata, high resolution, exif, outdoor, scenery",
    Copyright: `© 2026 ${author}`,
    City: city,
    Country: country
  };
}

function generateLocalFallbackFabricate(modelName: string) {
  const model = modelName || "iPhone 15 Pro";
  let make = "Apple";
  if (model.toLowerCase().includes("sony")) make = "Sony";
  else if (model.toLowerCase().includes("canon")) make = "Canon";
  else if (model.toLowerCase().includes("nikon")) make = "Nikon";
  else if (model.toLowerCase().includes("fujifilm")) make = "Fujifilm";
  else if (model.toLowerCase().includes("galaxy") || model.toLowerCase().includes("samsung")) make = "Samsung";
  else if (model.toLowerCase().includes("pixel") || model.toLowerCase().includes("google")) make = "Google";
  
  const cities = [
    { city: "New York", lat: 40.7128, lng: -74.0060 },
    { city: "Los Angeles", lat: 34.0522, lng: -118.2437 },
    { city: "Chicago", lat: 41.8781, lng: -87.6298 },
    { city: "San Francisco", lat: 37.7749, lng: -122.4194 },
    { city: "Seattle", lat: 47.6062, lng: -122.3321 },
    { city: "Miami", lat: 25.7617, lng: -80.1918 },
    { city: "Tokyo", lat: 35.6762, lng: 139.6503, country: "Japan" },
    { city: "London", lat: 51.5074, lng: -0.1278, country: "UK" },
    { city: "Paris", lat: 48.8566, lng: 2.3522, country: "France" }
  ];
  
  const location = cities[Math.floor(Math.random() * cities.length)];
  const country = location.country || "USA";

  const randomDate = new Date(Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000);
  const YYYY = randomDate.getFullYear();
  const MM = String(randomDate.getMonth() + 1).padStart(2, '0');
  const DD = String(randomDate.getDate()).padStart(2, '0');
  const hh = String(randomDate.getHours()).padStart(2, '0');
  const mm = String(randomDate.getMinutes()).padStart(2, '0');
  const ss = String(randomDate.getSeconds()).padStart(2, '0');

  const lens = make === "Apple" ? "iPhone 15 Pro back triple camera 6.86mm f/1.78" : 
               make === "Sony" ? "FE 24-70mm F2.8 GM II" :
               make === "Canon" ? "RF 24-70mm F2.8 L IS USM" :
               make === "Nikon" ? "NIKKOR Z 24-70mm f/2.8 S" :
               "24-70mm f/2.8 Zoom Lens";

  return {
    Make: make,
    Model: model,
    LensModel: lens,
    Software: make === "Apple" ? "iOS 17.5" : make === "Samsung" ? "Android 14" : `${make} Firmware v1.50`,
    Author: "Alex Mercer",
    Copyright: `© ${YYYY} Alex Mercer`,
    Description: `A stunning landscape photo captured at ${location.city} showcasing architectural details and soft ambient lighting.`,
    DateTimeOriginal: `${YYYY}:${MM}:${DD} ${hh}:${mm}:${ss}`,
    GPSLatitude: location.lat,
    GPSLongitude: location.lng,
    City: location.city,
    Country: country
  };
}
