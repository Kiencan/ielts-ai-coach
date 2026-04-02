import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { getServerUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimiter";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });

    const rl = checkRateLimit(`speaking-${user.id}`);
    if (!rl.allowed) {
      const retryMin = Math.ceil(rl.retryAfterMs / 60000);
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: `Bạn đã đạt giới hạn. Vui lòng thử lại sau ${retryMin} phút.` } },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      );
    }

    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const part = formData.get("part") as string;
    const topic = formData.get("topic") as string;

    if (!audio) return NextResponse.json({ success: false, error: { code: "VALIDATION", message: "Không có file audio." } }, { status: 400 });

    // Step 1: Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      language: "en",
    });

    const transcript = transcription.text;

    // Step 2: Grade with Claude
    const gradePrompt = `You are an IELTS Speaking examiner. Grade this Part ${part} response about: "${topic}"

TRANSCRIPT:
"${transcript}"

Return ONLY this JSON:
{
  "transcript": "${transcript.replace(/"/g, '\\"')}",
  "fluencyScore": <0-9>,
  "lexicalScore": <0-9>,
  "grammarScore": <0-9>,
  "pronunciationNote": "<brief note about pronunciation based on text>",
  "overallBand": <average>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "suggestions": [{"original": "<phrase>", "suggested": "<better phrase>"}]
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: gradePrompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response");

    // BUG-05b fix: strip markdown fences before parsing
    const rawText = content.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    let feedback: unknown;
    try {
      feedback = JSON.parse(rawText);
    } catch {
      throw new Error("AI returned invalid JSON for speaking analysis.");
    }
    return NextResponse.json({ success: true, data: feedback });
  } catch (e: any) {
    console.error("Speaking grading error:", e);
    return NextResponse.json({ success: false, error: { code: "AI_ERROR", message: "Không thể phân tích bài nói." } }, { status: 500 });
  }
}
