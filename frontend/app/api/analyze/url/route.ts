import { NextRequest, NextResponse } from "next/server";
import { analyzeText } from "@/lib/analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url: string = body.url ?? "";

    if (!url.trim()) {
      return NextResponse.json({ error: "URL cannot be empty" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "Only HTTP/HTTPS URLs are supported" }, { status: 400 });
    }

    // Fetch the page content
    const response = await fetch(url, {
      headers: { "User-Agent": "MindSense-AI/2.0 (Mental Health Research Bot)" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${response.status}` }, { status: 400 });
    }

    const html = await response.text();

    // Strip HTML tags and extract meaningful text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 10000); // Limit to 10k chars

    if (text.length < 20) {
      return NextResponse.json({ error: "Could not extract meaningful text from URL" }, { status: 400 });
    }

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));

    const result = await analyzeText(text);
    return NextResponse.json({ ...result, sourceUrl: url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "URL analysis failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
