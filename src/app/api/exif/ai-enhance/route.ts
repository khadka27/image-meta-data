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
      return NextResponse.json({ error: "DEEPSEEK_API_KEY is not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
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

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI Enhance error:", error);
    return NextResponse.json({ error: "Failed to enhance metadata" }, { status: 500 });
  }
}
