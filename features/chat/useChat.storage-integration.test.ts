import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useChat } from "./useChat";
import { GREETING_MESSAGE } from "./chat";
import { loadChat } from "./chat-storage";

const STORAGE_KEY = "dukjangi:chat";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useChat, 실제 chat-storage 연동", () => {
  it("메시지 보내면 실제 localStorage에서 loadChat으로 읽힘", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ reply: "답변" }),
      }),
    );
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendChat("장학금 알려줘");
    });

    expect(loadChat()).toEqual(result.current.messages);
  });

  it("localStorage에 저장된 실제 형식 그대로 다음 마운트에 반영", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { role: "bot", text: GREETING_MESSAGE },
        { role: "user", text: "ICAN마일리지 알려줘" },
      ]),
    );

    const { result } = renderHook(() => useChat());

    await waitFor(() =>
      expect(result.current.messages).toEqual([
        { role: "bot", text: GREETING_MESSAGE },
        { role: "user", text: "ICAN마일리지 알려줘" },
      ]),
    );
    expect(result.current.hasHistory).toBe(true);
  });
});
