import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useChat } from "./useChat";
import { ERROR_MESSAGE, GREETING_MESSAGE } from "./chat";
import * as chatStorage from "./chat-storage";

vi.mock("./chat-storage");

function mockFetchOk(reply: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply }),
    }),
  );
}

beforeEach(() => {
  vi.mocked(chatStorage.loadChat).mockReturnValue(null);
  vi.mocked(chatStorage.saveChat).mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("초기 상태", () => {
  it("인사말 하나만 있고 기록 없음", () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toEqual([
      { role: "bot", text: GREETING_MESSAGE },
    ]);
    expect(result.current.hasHistory).toBe(false);
  });

  it("저장된 기록 있으면 그걸로 시작", async () => {
    const saved = [
      { role: "bot" as const, text: GREETING_MESSAGE },
      { role: "user" as const, text: "장학금 알려줘" },
    ];
    vi.mocked(chatStorage.loadChat).mockReturnValue(saved);

    const { result } = renderHook(() => useChat());

    await waitFor(() => expect(result.current.messages).toEqual(saved));
  });
});

describe("sendChat", () => {
  it("빈 문자열 무시", async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendChat("   ");
    });

    expect(result.current.messages).toHaveLength(1);
  });

  it("정상 흐름: user 메시지 후 bot 응답 추가", async () => {
    mockFetchOk("성적장학금은 자동 지급이에요");
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendChat("성적장학금 알려줘");
    });

    expect(result.current.messages).toEqual([
      { role: "bot", text: GREETING_MESSAGE },
      { role: "user", text: "성적장학금 알려줘" },
      { role: "bot", text: "성적장학금은 자동 지급이에요" },
    ]);
    expect(result.current.loading).toBe(false);
  });

  it("응답 실패 시 에러 메시지", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      }),
    );
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendChat("질문");
    });

    expect(result.current.messages.at(-1)).toEqual({
      role: "bot",
      text: ERROR_MESSAGE,
    });
  });

  it("fetch 자체 실패 시 에러 메시지", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendChat("질문");
    });

    expect(result.current.messages.at(-1)).toEqual({
      role: "bot",
      text: ERROR_MESSAGE,
    });
  });

  it("로딩 중이면 재호출 무시", async () => {
    let resolveFetch!: (value: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
      ),
    );
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendChat("첫 질문");
    });
    await waitFor(() => expect(result.current.loading).toBe(true));

    await act(async () => {
      await result.current.sendChat("두 번째 질문");
    });

    expect(
      result.current.messages.filter((m) => m.role === "user"),
    ).toHaveLength(1);

    await act(async () => {
      resolveFetch({ ok: true, json: () => Promise.resolve({ reply: "답" }) });
    });
  });
});

describe("startChat", () => {
  it("인사말만 남기고 초기화", async () => {
    mockFetchOk("답변");
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendChat("질문");
    });
    expect(result.current.hasHistory).toBe(true);

    act(() => {
      result.current.startChat();
    });

    expect(result.current.messages).toEqual([
      { role: "bot", text: GREETING_MESSAGE },
    ]);
    expect(result.current.hasHistory).toBe(false);
  });
});

describe("saveChat 연동", () => {
  it("메시지 바뀌면 저장, 첫 렌더는 저장 X", async () => {
    mockFetchOk("답변");
    const { result } = renderHook(() => useChat());

    expect(chatStorage.saveChat).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.sendChat("질문");
    });

    expect(chatStorage.saveChat).toHaveBeenCalledWith(result.current.messages);
  });
});
