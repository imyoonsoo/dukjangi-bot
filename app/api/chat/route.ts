// 웹채팅 API
import { ask } from "@/lib/llm";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const msg = typeof body?.message === "string" ? body.message.trim() : "";

  // 빈 값이나 1000자 초과 입력 반려
  if (!msg || msg.length > 1000) {
    return Response.json(
      { error: "message는 1-1000자 이내여야 합니다" },
      { status: 400 },
    );
  }

  const reply = await ask(msg);
  return Response.json({ reply });
}
