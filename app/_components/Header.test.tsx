import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Header } from "./Header";

afterEach(() => {
  cleanup();
});

describe("Header", () => {
  it("덕장이 타이틀과 소개문구 렌더링", () => {
    render(<Header hasHistory={false} disabled={false} onNewChat={vi.fn()} />);
    expect(screen.getByText("덕장이")).toBeInTheDocument();
    expect(screen.getByText(/교내\s*장학금/)).toBeInTheDocument();
  });

  it("기록 없으면 새 대화 버튼 미표시", () => {
    render(<Header hasHistory={false} disabled={false} onNewChat={vi.fn()} />);
    expect(
      screen.queryByRole("button", { name: /새 대화/ }),
    ).not.toBeInTheDocument();
  });

  it("기록 있으면 새 대화 버튼 표시", () => {
    render(<Header hasHistory={true} disabled={false} onNewChat={vi.fn()} />);
    expect(screen.getByRole("button", { name: /새 대화/ })).toBeInTheDocument();
  });

  it("새 대화 버튼 클릭하면 onNewChat 실행", () => {
    const onNewChat = vi.fn();
    render(<Header hasHistory={true} disabled={false} onNewChat={onNewChat} />);
    fireEvent.click(screen.getByRole("button", { name: /새 대화/ }));
    expect(onNewChat).toHaveBeenCalledOnce();
  });

  it("로딩 중엔 새 대화 버튼 클릭 불가", () => {
    render(<Header hasHistory={true} disabled={true} onNewChat={vi.fn()} />);
    expect(screen.getByRole("button", { name: /새 대화/ })).toBeDisabled();
  });
});
