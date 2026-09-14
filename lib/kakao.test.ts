import { describe, it, expect, vi, afterEach } from "vitest";
import {
  extractUtterance,
  extractCallbackUrl,
  simpleText,
  callbackResponse,
  sendCallback,
  stripMarkdown,
} from "./kakao";

describe("extractUtterance", () => {
  it("utterance 추출", () => {
    expect(extractUtterance({ userRequest: { utterance: "안녕" } })).toBe(
      "안녕",
    );
  });

  it("앞뒤 공백 제거", () => {
    expect(extractUtterance({ userRequest: { utterance: "  안녕  " } })).toBe(
      "안녕",
    );
  });

  it("1000자 초과 시 자르기", () => {
    const long = "가".repeat(1200);
    expect(extractUtterance({ userRequest: { utterance: long } })).toHaveLength(
      1000,
    );
  });

  it("utterance 없으면 빈 문자열", () => {
    expect(extractUtterance({})).toBe("");
    expect(extractUtterance({ userRequest: {} })).toBe("");
  });

  it("utterance가 문자열 아니면 빈 문자열", () => {
    expect(extractUtterance({ userRequest: { utterance: 123 } })).toBe("");
  });

  it("null/undefined 방어", () => {
    expect(extractUtterance(null)).toBe("");
    expect(extractUtterance(undefined)).toBe("");
  });
});

describe("extractCallbackUrl", () => {
  it("kakao.com 도메인은 허용", () => {
    const url = "https://kakao.com/callback";
    expect(extractCallbackUrl({ userRequest: { callbackUrl: url } })).toBe(url);
  });

  it("kakao.com 서브도메인도 허용", () => {
    const url = "https://bot-api.kakao.com/callback";
    expect(extractCallbackUrl({ userRequest: { callbackUrl: url } })).toBe(url);
  });

  it("kakao 아닌 도메인 거부", () => {
    const url = "https://evil.com/callback";
    expect(
      extractCallbackUrl({ userRequest: { callbackUrl: url } }),
    ).toBeNull();
  });

  it("kakao.com 포함해도 다른 도메인이면 거부", () => {
    const url = "https://kakao.com.evil.com/callback";
    expect(
      extractCallbackUrl({ userRequest: { callbackUrl: url } }),
    ).toBeNull();
  });

  it("http 거부", () => {
    const url = "http://kakao.com/callback";
    expect(
      extractCallbackUrl({ userRequest: { callbackUrl: url } }),
    ).toBeNull();
  });

  it("잘못된 URL 형식 거부", () => {
    expect(
      extractCallbackUrl({ userRequest: { callbackUrl: "not-a-url" } }),
    ).toBeNull();
  });

  it("callbackUrl이 없으면 null", () => {
    expect(extractCallbackUrl({})).toBeNull();
  });
});

describe("simpleText / callbackResponse", () => {
  it("카카오 스킬 응답 형식 생성", () => {
    expect(simpleText("안녕")).toEqual({
      version: "2.0",
      template: { outputs: [{ simpleText: { text: "안녕" } }] },
    });
  });

  it("useCallback 응답 생성", () => {
    expect(callbackResponse("잠시만요")).toEqual({
      version: "2.0",
      useCallback: true,
      data: { text: "잠시만요" },
    });
  });
});

describe("sendCallback", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("정상 응답 시 에러표시 X", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue({ ok: true } as Response);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await sendCallback("https://kakao.com/callback", "답변");

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://kakao.com/callback",
      expect.objectContaining({ method: "POST" }),
    );
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("4xx/5xx 응답 시 에러표시 O", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await sendCallback("https://kakao.com/callback", "답변");

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("500"));
  });

  it("fetch 실패해도 예외 X", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      sendCallback("https://kakao.com/callback", "답변"),
    ).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });
});

describe("stripMarkdown", () => {
  it("헤더 제거", () => {
    expect(stripMarkdown("# 성적장학금\n## 지원 기준")).toBe(
      "성적장학금\n지원 기준",
    );
  });

  it("bold/italic 제거", () => {
    // 실제 응답 일부
    expect(
      stripMarkdown(
        "**운현장학금**: 수시 수석합격자(고교추천·논술·미술실기·덕성인재전형Ⅰ·Ⅱ 최초합격)",
      ),
    ).toBe(
      "운현장학금: 수시 수석합격자(고교추천·논술·미술실기·덕성인재전형Ⅰ·Ⅱ 최초합격)",
    );
  });

  it("인라인 코드 제거", () => {
    expect(stripMarkdown("`applyPeriod`는 5월입니다")).toBe(
      "applyPeriod는 5월입니다",
    );
  });

  it("링크를 텍스트와 URL로 변환", () => {
    // 실제 응답 일부
    const link =
      "[학교 공식 장학 공지](https://www.duksung.ac.kr/bbs/board.do?bsIdx=36&menuId=1059)";
    expect(stripMarkdown(link)).toBe(
      "학교 공식 장학 공지 (https://www.duksung.ac.kr/bbs/board.do?bsIdx=36&menuId=1059)",
    );
  });

  it("불릿 변환", () => {
    // 실제 응답 일부
    const input =
      "- **운현장학금**: 수시 수석합격자\n- **덕성누리장학금**: 정시 4등급 이내";
    const expected =
      "• 운현장학금: 수시 수석합격자\n• 덕성누리장학금: 정시 4등급 이내";
    expect(stripMarkdown(input)).toBe(expected);
  });

  it("인용문 마커 제거", () => {
    expect(stripMarkdown("> 자격요건: 평점 3.5 이상")).toBe(
      "자격요건: 평점 3.5 이상",
    );
  });

  it("구분선 제거", () => {
    expect(stripMarkdown("본문\n---\n다음")).toBe("본문\n\n다음");
  });

  it("연속 빈 줄 축소", () => {
    expect(stripMarkdown("첫줄\n\n\n\n둘째줄")).toBe("첫줄\n\n둘째줄");
  });
});
