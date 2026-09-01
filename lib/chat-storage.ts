// 웹채팅 기록 저장

import type { Message } from "@/lib/chat";

const STORAGE_KEY = "dukjangi:chat";

export function loadChat(): Message[] | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const data = JSON.parse(saved) as Message[];
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

export function saveChat(messages: Message[]): void {
  try {
    // 대화 없으면 저장 X
    if (messages.length <= 1) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  } catch (error) {
    console.error("채팅기록 저장 실패:", error);
  }
}
