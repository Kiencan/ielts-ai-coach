import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServerUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimiter";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Chưa đăng nhập." } }, { status: 401 });

    // BUG-06 fix: rate limiting (TC-WRI-06, TC-API-06)
    const rl = checkRateLimit(user.id);
    if (!rl.allowed) {
      const retryMin = Math.ceil(rl.retryAfterMs / 60000);
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: `Bạn đã đạt giới hạn chấm bài. Vui lòng thử lại sau ${retryMin} phút.` } },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      );
    }

    const { essay, taskType, prompt: taskPrompt } = await req.json();
    if (!essay || !taskType) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION", message: "Thiếu thông tin bài viết." } }, { status: 400 });
    }

    const systemPrompt = `You are an expert IELTS examiner. Grade the essay strictly following official IELTS band descriptors. Return ONLY valid JSON, no markdown.`;

    const userPrompt = `Grade this IELTS Writing Task ${taskType} essay.

TASK PROMPT:
${taskPrompt}

STUDENT ESSAY:
${essay}

Return this exact JSON structure:
{
  "taskAchievement": {
    "score": <number 0-9 in 0.5 increments>,
    "strengths": ["<strength 1>", "<strength 2>"],
    "improvements": ["<improvement 1>", "<improvement 2>"]
  },
  "coherence": {
    "score": <number 0-9>,
    "strengths": ["..."],
    "improvements": ["..."]
  },
  "lexical": {
    "score": <number 0-9>,
    "strengths": ["..."],
    "improvements": ["..."]
  },
  "grammar": {
    "score": <number 0-9>,
    "strengths": ["..."],
    "improvements": ["..."]
  },
  "overallBand": <average rounded to nearest 0.5>,
  "suggestions": [
    {"original": "<word/phrase from essay>", "suggested": "<academic alternative>", "explanation": "<why this is better>"}
  ]
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected AI response type");

    // BUG-05 fix: strip markdown code fences that Claude occasionally wraps JSON in
    const rawText = content.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    let feedback: unknown;
    try {
      feedback = JSON.parse(rawText);
    } catch {
      throw new Error("AI returned invalid JSON. Please retry.");
    }
    return NextResponse.json({ success: true, data: feedback });
  } catch (e: any) {
    console.error("Writing grading error:", e);
    return NextResponse.json({ success: false, error: { code: "AI_ERROR", message: "Không thể chấm bài. Vui lòng thử lại." } }, { status: 500 });
  }
}
