// 카카오 스킬 웹훅
import { after } from "next/server";
import { ask } from "@/lib/llm";
import { THINKING_MESSAGE } from "@/lib/chat";
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

  // 카카오 5초 제한으로 콜백 미설정 시 LLM 응답을 못 주어 안내문구 반환
  console.warn("카카오 스킬 콜백 미설정");
  return Response.json(
    simpleText("일시적으로 답변이 어려워요. 잠시 후 다시 시도해 주세요."),
  );
}
