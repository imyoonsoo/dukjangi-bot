import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Shortcuts } from "./Shortcuts";

afterEach(() => {
  cleanup();
});

describe("Shortcuts", () => {
  it("바로가기 4개", () => {
    render(<Shortcuts />);
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  it("문의하기 전화번호 연결", () => {
    render(<Shortcuts />);
    const contact = screen.getByRole("link", { name: /문의하기/ });
    expect(contact).not.toHaveAttribute("target");
    expect(contact).toHaveAttribute("href", "tel:02-901-8053");
  });

  it("외부 링크는 새 창 적용", () => {
    render(<Shortcuts />);
    const portal = screen.getByRole("link", { name: /포털에서 신청/ });
    expect(portal).toHaveAttribute("target", "_blank");
    expect(portal).toHaveAttribute("rel", "noopener noreferrer");
    expect(portal).toHaveAccessibleName(/새 창 열림/);
  });
});
