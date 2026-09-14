import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { loadChat, saveChat } from "./chat-storage";
import type { Message } from "./chat";

const STORAGE_KEY = "dukjangi:chat";

beforeEach(() => {
  localStorage.clear();
});

describe("loadChat", () => {
  it("저장된 게 없으면 null", () => {
    expect(loadChat()).toBeNull();
  });

  it("정상 데이터 로드", () => {
    const messages: Message[] = [
      { role: "bot", text: "안녕" },
      { role: "user", text: "장학금 알려줘" },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    expect(loadChat()).toEqual(messages);
  });

  it("깨진 JSON이면 null", () => {
    localStorage.setItem(STORAGE_KEY, "{이건 JSON 아님");
    expect(loadChat()).toBeNull();
  });

  it("배열 아니면 null", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: "bot" }));
    expect(loadChat()).toBeNull();
  });

  it("빈 배열이면 null", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    expect(loadChat()).toBeNull();
  });

  it("role/text 형식 어긋나면 null", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ role: "admin", text: "안녕" }]),
    );
    expect(loadChat()).toBeNull();
  });
});

describe("saveChat", () => {
  it("메시지 여러 개면 저장", () => {
    const messages: Message[] = [
      { role: "bot", text: "안녕" },
      { role: "user", text: "장학금 알려줘" },
    ];
    saveChat(messages);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(messages));
  });

  it("인사말만 있으면 저장소 비움", () => {
    localStorage.setItem(STORAGE_KEY, "기존 데이터");
    saveChat([{ role: "bot", text: "안녕" }]);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  describe("localStorage 접근 실패 시", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("저장 실패해도 예외 X", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("quota exceeded");
      });
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() =>
        saveChat([
          { role: "bot", text: "안녕" },
          { role: "user", text: "질문" },
        ]),
      ).not.toThrow();
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
