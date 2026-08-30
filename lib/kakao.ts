// 카카오 스킬 연동 헬퍼

import "server-only";

// 카카오가 보내는 요청 본문
type KakaoRequest = {
  userRequest?: {
    utterance?: string;
    callbackUrl?: string;
  };
};

// 요청 본문에서 사용자가 입력한 말(utterance)만 꺼냄
export function extractUtterance(body: unknown): string {
  const request = body as KakaoRequest;
  const utterance = request?.userRequest?.utterance;
  if (typeof utterance !== "string") return "";
  return utterance.trim().slice(0, 1000);
}

function isKakaoHost(hostname: string): boolean {
  return hostname === "kakao.com" || hostname.endsWith(".kakao.com");
}

// 요청 바디의 URL을 그대로 fetch하면 SSRF 위험이라 카카오 도메인만 허용
export function extractCallbackUrl(body: unknown): string | null {
  const request = body as KakaoRequest;
  const callbackUrl = request?.userRequest?.callbackUrl;
  if (typeof callbackUrl !== "string") return null;

  try {
    const { protocol, hostname } = new URL(callbackUrl);
    if (protocol !== "https:") return null;
    if (!isKakaoHost(hostname)) return null;
    return callbackUrl;
  } catch {
    return null;
  }
}

// 답을 바로 줄 때
export function simpleText(text: string) {
  return { version: "2.0", template: { outputs: [{ simpleText: { text } }] } };
}

// 접수만 먼저 알림 (진짜 답은 나중에 따로)
export function callbackResponse(text: string) {
  return { version: "2.0", useCallback: true, data: { text } };
}

// 미뤄둔 진짜 답을 완성 후 따로 전송
export async function sendCallback(url: string, text: string): Promise<void> {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(simpleText(text)),
    });
  } catch (error) {
    console.error("카카오 콜백 전송 실패:", error);
  }
}

// LLM 답변의 마크다운을 카톡용 평문으로 변환
export function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1 ($2)")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^-{3,}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
