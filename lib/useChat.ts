import { useEffect, useRef, useState } from "react";
import { type Message, ERROR_MESSAGE, GREETING_MESSAGE } from "@/lib/chat";
import { loadChat, saveChat } from "@/lib/chat-storage";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: GREETING_MESSAGE },
  ]);
  const [loading, setLoading] = useState(false);
  const isFirst = useRef(true);

  // 채팅기록 로드
  useEffect(() => {
    const saved = loadChat();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages(saved);
    }
  }, []);

  // 기록 저장
  useEffect(() => {
    // 첫 실행이면 saveChat 실행 X
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    saveChat(messages);
  }, [messages]);

  // 채팅 보내기
  const sendChat = async (text: string) => {
    const trimmedChat = text.trim();
    if (!trimmedChat || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmedChat }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedChat }),
      });
      const data = await response.json();
      const reply = response.ok ? data.reply : ERROR_MESSAGE;
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: ERROR_MESSAGE }]);
    } finally {
      setLoading(false);
    }
  };

  // 새 대화 생성 시
  const startChat = () => {
    setMessages([{ role: "bot", text: GREETING_MESSAGE }]);
  };

  return {
    messages,
    loading,
    sendChat,
    startChat,
    hasHistory: messages.length > 1,
  };
}
