import { NextRequest, NextResponse } from "next/server";
import { analyzeText } from "@/lib/analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = body.text ?? "";

    if (!text.trim()) {
      return NextResponse.json({ error: "Text cannot be empty" }, { status: 400 });
    }

    if (text.length > 50000) {
      return NextResponse.json({ error: "Text too long (max 50,000 characters)" }, { status: 400 });
    }

    // Simulate pipeline delay for realistic UX
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const result = await analyzeText(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
