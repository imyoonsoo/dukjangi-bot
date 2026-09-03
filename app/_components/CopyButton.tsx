"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [isCopy, setIsCopy] = useState(false);
  const Icon = isCopy ? Check : Copy;
  const label = isCopy ? "복사됨" : "복사하기";

  // 복사하기 핸들러함수
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopy(true);
      setTimeout(() => setIsCopy(false), 1500);
    } catch {
      // 클립보드 복사 실패 시
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className="group/copy mt-1.5 flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-sub transition hover:bg-canvas hover:text-navy focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:outline-none"
    >
      <Icon size={14} aria-hidden />
      <span
        className={
          isCopy
            ? "inline"
            : "hidden group-hover/copy:inline group-focus-visible/copy:inline"
        }
      >
        {label}
      </span>
    </button>
  );
}
