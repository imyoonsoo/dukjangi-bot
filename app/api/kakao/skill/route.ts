// 카카오 스킬 웹훅
import { after } from "next/server";
import { ask } from "@/lib/llm";
import { THINKING_MESSAGE } from "@/lib/persona";
import {
  extractUtterance,
  extractCallbackUrl,
  simpleText,
  callbackResponse,
  sendCallback,
  stripMarkdown,
} from "@/lib/kakao";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const utterance = extractUtterance(body);
  const callbackUrl = extractCallbackUrl(body);

  if (!utterance) {
    return Response.json(simpleText("무엇이 궁금하신가요?"));
  }

  // callbackUrl 있으면: 접수만 알리고, 답은 백그라운드에서 만들어 따로 전송
  if (callbackUrl) {
    after(async () => {
      const reply = await ask(utterance);
      await sendCallback(callbackUrl, stripMarkdown(reply));
    });
    return Response.json(callbackResponse(THINKING_MESSAGE));
  }

  // callbackUrl 없으면: 그냥 기다렸다가 바로 응답
  const reply = await ask(utterance);
  return Response.json(simpleText(stripMarkdown(reply)));
}
