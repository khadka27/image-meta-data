import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { model, make, existingTags } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "DeepSeek API key is missing" }, { status: 500 });
    }

    let prompt = "";
    if (existingTags && Object.keys(existingTags).length > 0) {
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

    const response = await fetch("https://api.deepseek.com/chat/completions", {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", errorText);
      return NextResponse.json({ error: "Failed to communicate with DeepSeek API" }, { status: response.status });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim();
    
    // Fallback: Strip markdown code blocks just in case
    if (content.startsWith("\`\`\`json")) {
      content = content.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    } else if (content.startsWith("\`\`\`")) {
      content = content.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
    }

    const jsonResult = JSON.parse(content);
    return NextResponse.json(jsonResult);

  } catch (error) {
    console.error("Metadata generation error:", error);
    return NextResponse.json({ error: "Internal server error during metadata generation" }, { status: 500 });
  }
}
