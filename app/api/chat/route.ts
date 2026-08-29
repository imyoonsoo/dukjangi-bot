// 웹채팅 API: POST
import { ask } from "@/lib/llm";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const msg = body?.message;

  if (typeof msg !== "string" || !msg.trim()) {
    return Response.json(
      { error: "유효한 message가 필요합니다" },
      { status: 400 },
    );
  }

  const reply = await ask(msg);
  return Response.json({ reply });
}
