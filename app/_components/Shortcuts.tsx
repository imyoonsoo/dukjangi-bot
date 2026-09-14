import { Phone, Megaphone, MessageCircle, LogIn } from "lucide-react";
import { SCHOLARSHIP_BOARD_URL } from "@/features/chat/chat";

const PORTAL_URL =
  "https://sso.duksung.ac.kr/svc/tk/Auth.do?ac=Y&ifa=N&id=portal&";

const SHORTCUTS = [
  { label: "포털에서 신청", href: PORTAL_URL, Icon: LogIn },
  { label: "문의하기", href: "tel:02-901-8053", Icon: Phone },
  { label: "장학공지", href: SCHOLARSHIP_BOARD_URL, Icon: Megaphone },
  {
    label: "카카오톡 채널",
    href: "https://pf.kakao.com/_axkfxaX/chat",
    Icon: MessageCircle,
  },
] as const;

export function Shortcuts() {
  return (
    <nav className="border-t border-line px-5 py-2.5">
      <p className="mb-2 text-base font-semibold text-navy">바로가기</p>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SHORTCUTS.map(({ label, href, Icon }) => {
          const isExternal = !href.startsWith("tel:");
          return (
            <li key={label}>
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="flex min-w-0 items-center justify-center gap-1.5 rounded-full border border-line bg-canvas px-3.5 py-2 text-sm text-navy transition hover:border-sky hover:bg-white hover:shadow-sm"
              >
                <Icon size={15} className="shrink-0" aria-hidden />
                <span className="truncate">{label}</span>
                {isExternal && <span className="sr-only">(새 창 열림)</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
