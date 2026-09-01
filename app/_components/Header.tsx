"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

interface HeaderProps {
  hasHistory: boolean;
  disabled: boolean;
  onNewChat: () => void;
}

export function Header({ hasHistory, disabled, onNewChat }: HeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-line px-5 py-4">
      <Image
        src="/assets/img-profile-web.png"
        alt="프로필"
        width={60}
        height={60}
        className="rounded-full"
        priority
      />
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-navy">
          덕장이
        </h1>
        <p className="text-sm text-sub">
          LLM 기반 덕성여자대학교 교내장학금 안내 챗봇
        </p>
      </div>
      {hasHistory && (
        <button
          type="button"
          onClick={onNewChat}
          disabled={disabled}
          className="ml-auto flex shrink-0 items-center gap-1 rounded-lg bg-canvas/40 px-2.5 py-1.5 text-sm font-medium text-sub transition hover:bg-canvas/70 active:bg-canvas focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:outline-none disabled:opacity-50"
        >
          <Plus size={18} aria-hidden />새 대화
        </button>
      )}
    </header>
  );
}
