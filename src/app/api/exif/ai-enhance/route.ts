/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { existingTags } = await req.json();
    
    // Format existing tags for the prompt
    let context = "Existing metadata:\\n";
    for (const [key, val] of Object.entries(existingTags)) {
      context += `- ${key}: ${val}\\n`;
    }

    const prompt = `
You are an expert photography metadata assistant.
I will give you the existing technical EXIF metadata from a photograph.
Your task is to analyze this data and generate a realistic, descriptive "Title", "Description", and "Keywords" that match the technical profile.
Do NOT hallucinate GPS locations if none exist.
Focus on inferring the *type* of photo (e.g., a fast shutter speed might mean sports/action, a wide aperture might mean portrait).

${context}

Respond ONLY with a valid JSON object containing exactly these fields: Title, Description, Keywords.
Keywords should be a comma-separated string.
`;

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekKey) {
      console.warn("DEEPSEEK_API_KEY is not configured. Using local fallback generator.");
      const fallback = generateLocalFallbackEnhance(existingTags);
      return NextResponse.json(fallback);
    }

    let response;
    try {
      response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${deepseekKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        })
      });
    } catch (fetchError: any) {
      console.warn("DeepSeek API connection failed. Using local fallback generator. Error:", fetchError.message);
      const fallback = generateLocalFallbackEnhance(existingTags);
      return NextResponse.json(fallback);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("DeepSeek API error. Using local fallback generator. Error:", errorText);
      const fallback = generateLocalFallbackEnhance(existingTags);
      return NextResponse.json(fallback);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.warn("DeepSeek API returned empty content. Using local fallback generator.");
      const fallback = generateLocalFallbackEnhance(existingTags);
      return NextResponse.json(fallback);
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.warn("DeepSeek API returned invalid JSON. Using local fallback generator. Content:", content);
      parsed = generateLocalFallbackEnhance(existingTags);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI Enhance error:", error);
    return NextResponse.json({ error: "Failed to enhance metadata" }, { status: 500 });
  }
}

// ───── Local Fallback Generator ─────

function generateLocalFallbackEnhance(existingTags: any) {
  const make = existingTags?.Make || existingTags?.make || "";
  const model = existingTags?.Model || existingTags?.model || "";
  const title = make && model ? `Photograph taken with ${make} ${model}` : "Scenic Landscape View";
  return {
    Title: title,
    Description: `A high-quality photograph showcasing clean details, rich textures, and standard focus, captured on ${make || 'a professional camera'} ${model || ''}.`,
    Keywords: "photography, raw photo, technical metadata, high resolution, exif, outdoor"
  };
}
