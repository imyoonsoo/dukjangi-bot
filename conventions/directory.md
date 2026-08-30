# 디렉터리 구조

`src/` 없이 프로젝트 루트에 Next App Router

```
dukjangi-bot/
├── app/                          # 라우팅/레이아웃/API 라우트 (로직은 lib/로 위임)
│   ├── layout.tsx                # RootLayout: <html>, <body>
│   ├── page.tsx                  # 웹 채팅 화면
│   ├── globals.css               # Tailwind 전역 스타일
│   └── api/
│       ├── chat/route.ts         # 웹 채팅 API (POST 발화 ➝ generateReply)
│       └── kakao/skill/route.ts  # 카카오 오픈빌더 폴백 스킬 웹훅
│
├── lib/                          # ★ 서버 로직/데이터 (화면과 무관, 서버에서만 실행)
│   ├── llm.ts                    # LLM 호출, 웹/카톡 공용 (generateReply)
│   ├── persona.ts                # 시스템 프롬프트, 안내 문구 상수
│   ├── scholarship.ts            # 교내장학금 데이터 + Scholarship 타입
│   └── kakao.ts                  # 카카오 요청 파싱, 응답 포맷 헬퍼
│
├── components/                   # 여러 화면에서 재사용하는 순수 UI 컴포넌트
├── conventions/                  # 프로젝트 규칙 문서
└── public/                       # 정적 파일
```

## 폴더별 역할

- `app/`: 라우팅/레이아웃만 담당, `page.tsx`는 얇게 유지하고 로직은 `lib/`에서 가져와 조립
- `lib/`: 화면과 무관한 서버 코드, API 키 쓰는 코드(LLM 호출 등)는 반드시 여기, 웹/카톡 라우트가 공통으로 `lib/llm.ts` 호출
- `components/`: 특정 화면에 종속 안 되고 2곳 이상에서 재사용하는 UI만, 한 화면 전용은 해당 `app/` 폴더 안 `_components/`로 co-location

## import 경계

- 흐름: `page.tsx`(클라이언트) ➝ `fetch("/api/chat")` ➝ `route.ts`(서버) ➝ `lib/llm.ts`
- 클라이언트는 `lib/llm.ts`를 직접 import 안 함, HTTP 경계를 거쳐 API 키를 서버에 가둠

## 확장 시

- 도메인이 3개 이상으로 늘면 `features/<domain>/` 도입 검토
- import해서 쓰는 이미지가 생기면 `assets/` 도입 검토
