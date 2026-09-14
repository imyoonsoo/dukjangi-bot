"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { THINKING_MESSAGE } from "@/features/chat/chat";
import { useChat } from "@/features/chat/useChat";
import { Header } from "./_components/Header";
import { CopyButton } from "./_components/CopyButton";

const EXAMPLES = ["교내장학금 뭐 있나요", "ICAN마일리지", "성적우수, 향상"];

const CATEGORIES = ["가계", "성적", "참여", "기타"] as const;

export default function Home() {
  const { messages, loading, sendChat, startChat, hasHistory } = useChat();
  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  // 대화를 따라가는 중인지 기록
  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    stickToBottom.current = distanceFromBottom < 120;
  }

  // 따라가는 중이면 새 메시지로 스크롤
  useEffect(() => {
    if (stickToBottom.current) {
      bottomRef.current?.scrollIntoView();
    }
  }, [messages, loading]);

  return (
    <main className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center p-4 sm:p-6">
      <div className="flex max-h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-line bg-white">
        <Header
          hasHistory={hasHistory}
          disabled={loading}
          onNewChat={startChat}
        />

        <div className="border-b border-line px-5 py-2.5">
          <p className="mb-2 text-sm font-medium text-sub">카테고리 훑어보기</p>
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => sendChat(`${cat} 장학금 알려줘`)}
                disabled={loading}
                className="flex-1 rounded-full bg-navy px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-sky focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:outline-none disabled:opacity-50"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          className="flex-1 space-y-4 overflow-y-auto px-5 py-6 scrollbar-gutter-stable"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`animate-rise flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="group max-w-[85%]">
                {m.role === "user" ? (
                  <div className="whitespace-pre-wrap rounded-2xl rounded-br-md bg-navy px-4 py-3 text-base leading-relaxed text-white">
                    {m.text}
                  </div>
                ) : (
                  <div className="prose max-w-none rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3 text-navy shadow-sm prose-strong:text-navy prose-a:text-sky">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.text}
                    </ReactMarkdown>
                  </div>
                )}
                {/* 인덱스 0은 항상 초기 인사말이라 복사 버튼 제외 */}
                {i > 0 && (
                  <div
                    className={`opacity-0 transition group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100 ${
                      m.role === "user" ? "flex justify-end" : ""
                    }`}
                  >
                    <CopyButton text={m.text} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {messages.length === 1 && !loading && (
            <div className="pt-1">
              <p className="mb-2 text-center text-sm font-medium text-sub">
                이렇게 질문할 수 있어요!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => sendChat(ex)}
                    className="rounded-full border border-line bg-canvas px-3.5 py-2 text-sm text-navy transition hover:border-sky hover:bg-white hover:shadow-sm"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div
              role="status"
              className="flex items-center gap-2 text-base text-sky"
            >
              <span className="flex gap-1">
                <span className="dot h-1.5 w-1.5 rounded-full bg-sky" />
                <span className="dot h-1.5 w-1.5 rounded-full bg-sky" />
                <span className="dot h-1.5 w-1.5 rounded-full bg-sky" />
              </span>
              {THINKING_MESSAGE}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form
          className="flex gap-2 border-t border-line px-4 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            sendChat(input);
            setInput("");
          }}
        >
          <input
            className="flex-1 rounded-xl border border-line bg-canvas px-4 py-3 text-base outline-none transition placeholder:text-sub/70 focus:border-sky-deep focus:bg-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="무엇이 궁금하신가요?"
            aria-label="질문 입력"
            disabled={loading}
          />
          <button
            type="submit"
            className="rounded-xl bg-sky-deep px-5 py-3 text-base font-medium text-white transition hover:bg-navy active:scale-95 disabled:bg-sky-deep/25 disabled:text-white"
            disabled={loading || !input.trim()}
          >
            전송
          </button>
        </form>
      </div>
    </main>
  );
}
