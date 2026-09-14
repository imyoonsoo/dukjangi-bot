// LLM(Claude): 웹/카카오톡 공용

import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/features/chat/persona";
import { ERROR_MESSAGE } from "@/features/chat/chat";
import { scholarship } from "@/features/chat/scholarship";

const client = new Anthropic();

// 함수 toContext 역할: LLM은 프롬프트에 담긴 글자만 보고, 답할 수 있기에 scholarship 데이터 텍스트화
function toContext() {
  return scholarship
    .map((s) => {
      // 출력형식 및 필수 파라미터: 자격요건, 혜택
      const output = [
        `## 장학금명: ${s.title}`,
        `분류: ${s.category}`,
        `대상: ${s.target}`,
        `자격요건: ${s.eligibility}`,
        `혜택: ${s.benefit}`,
      ];

      // 나머지 5개: 옵셔널 파라미터
      if (s.selectionType) output.push(`신청방식: ${s.selectionType}`);
      if (s.applicationPeriod) output.push(`신청시기: ${s.applicationPeriod}`);
      if (s.documents) output.push(`제출서류: ${s.documents}`);
      if (s.supportPeriod) output.push(`지급기간: ${s.supportPeriod}`);
      if (s.note) output.push(`비고: ${s.note}`);
      return output.join("\n");
    })
    .join("\n\n");
}
// LLM에 전달할 프롬프트: 페르소나 + 장학금데이터 전체
const SYSTEM = `${SYSTEM_PROMPT}\n\n${toContext()}`;

// 로직: 질문 ➝ LLM ➝ 답변
export async function ask(question: string): Promise<string> {
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      system: [
        { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
      ],
      messages: [{ role: "user", content: question }],
    });

    const answer = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return answer || ERROR_MESSAGE;
  } catch (error) {
    console.error("LLM 호출 실패:", error);
    return ERROR_MESSAGE;
  }
}
