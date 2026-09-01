// 웹채팅 메시지문구

export type Message = { role: "user" | "bot"; text: string };

export const THINKING_MESSAGE = "답변 생각 중...";

export const ERROR_MESSAGE =
  "앗, 답변을 불러오다가 문제가 발생했어요. 잠시 후 다시 시도해주세요.";

export const GREETING_MESSAGE =
  "반가워요, 덕장이예요🙌 받을 수 있는 교내장학금, 놓치지 않게 도와드릴게요.";
