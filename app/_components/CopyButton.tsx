"use client";

import { Copy, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  text: string;
}

type Status = "idle" | "copied" | "failed";

const ICON = { idle: Copy, copied: Check, failed: X } as const;
const COPY_LABEL = {
  idle: "복사하기",
  copied: "복사됨",
  failed: "복사 실패",
} as const;

export function CopyButton({ text }: CopyButtonProps) {
  const [copyStatus, setCopyStatus] = useState<Status>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const Icon = ICON[copyStatus];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
    } catch {
      // 클립보드 복사 실패 시
      setCopyStatus("failed");
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopyStatus("idle"), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={COPY_LABEL[copyStatus]}
      className="group/copy mt-1.5 flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-sub transition hover:bg-canvas hover:text-navy focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:outline-none"
    >
      <Icon size={14} aria-hidden />
      <span
        className={
          copyStatus === "idle"
            ? "hidden group-hover/copy:inline group-focus-visible/copy:inline"
            : "inline"
        }
      >
        {COPY_LABEL[copyStatus]}
      </span>
    </button>
  );
}
