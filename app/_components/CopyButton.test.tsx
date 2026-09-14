import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import { CopyButton } from "./CopyButton";

function mockClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
  // clipboard는 jsdom에 없어서 테스트 끝나면 삭제
  // @ts-expect-error clipboard 타입이 필수라 삭제 시 타입 에러
  delete navigator.clipboard;
});

describe("CopyButton", () => {
  it("초기 상태는 복사하기", () => {
    render(<CopyButton text="안녕" />);
    expect(screen.getByRole("button")).toHaveAccessibleName("복사하기");
  });

  it("클릭 시 클립보드에 복사", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    render(<CopyButton text="장학금 안내" />);
    fireEvent.click(screen.getByRole("button"));

    expect(writeText).toHaveBeenCalledWith("장학금 안내");
  });

  it("복사 성공 시 복사됨 표시", async () => {
    mockClipboard(vi.fn().mockResolvedValue(undefined));

    render(<CopyButton text="안녕" />);
    fireEvent.click(screen.getByRole("button"));

    expect(
      await screen.findByRole("button", { name: "복사됨" }),
    ).toBeInTheDocument();
  });

  it("복사 실패 시 복사 실패 표시", async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error("denied")));

    render(<CopyButton text="안녕" />);
    fireEvent.click(screen.getByRole("button"));

    expect(
      await screen.findByRole("button", { name: "복사 실패" }),
    ).toBeInTheDocument();
  });

  it("1.5초 후 복사하기로 초기화", async () => {
    vi.useFakeTimers();
    mockClipboard(vi.fn().mockResolvedValue(undefined));

    render(<CopyButton text="안녕" />);

    fireEvent.click(screen.getByRole("button"));
    // 복사 처리 끝날 때까지 대기
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole("button")).toHaveAccessibleName("복사됨");

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByRole("button")).toHaveAccessibleName("복사하기");
  });
});
