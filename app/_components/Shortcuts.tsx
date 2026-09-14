import { Phone, Megaphone, MessageCircle, LogIn } from "lucide-react";
import { SCHOLARSHIP_BOARD_URL } from "@/features/chat/chat";

const PORTAL_URL =
  "https://sso.duksung.ac.kr/svc/tk/Auth.do?ac=Y&ifa=N&id=portal&";

const SHORTCUT_CATEGORY = [
  { label: "포털에서 신청하기", href: PORTAL_URL, Icon: LogIn },
  { label: "문의하기", href: "tel:02-901-8053", Icon: Phone },
  { label: "장학공지 게시판", href: SCHOLARSHIP_BOARD_URL, Icon: Megaphone },
  {
    label: "카카오톡 채널",
    href: "http://pf.kakao.com/_axkfxaX/chat",
    Icon: MessageCircle,
  },
];

export function Shortcuts() {
  return (
    <div className="border-t border-line px-5 py-2.5">
      <p className="mb-2 text-base font-semibold text-navy">바로가기</p>
      <div className="grid grid-cols-2 gap-2">
        {SHORTCUT_CATEGORY.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("tel:") ? undefined : "_blank"}
            rel={href.startsWith("tel:") ? undefined : "noopener noreferrer"}
            className="flex items-center justify-center gap-1.5 rounded-full border border-line bg-canvas px-3.5 py-2 text-sm text-navy transition hover:border-sky hover:bg-white hover:shadow-sm"
          >
            <Icon size={15} aria-hidden />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
