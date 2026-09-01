# 디렉터리 구조

`src/` 없이 프로젝트 루트에 Next App Router

```
dukjangi-bot/
├── app/                          # 페이지/레이아웃/API 라우트
│   ├── layout.tsx                # RootLayout
│   ├── page.tsx                  # 웹채팅 UI
│   ├── globals.css               # Tailwind 전역 스타일
│   └── api/
│       ├── chat/route.ts         # 웹채팅 API
│       └── kakao/skill/route.ts  # 카카오 스킬 웹훅
│
├── lib/                          # 컴포넌트·라우트가 아닌 모듈 (LLM 호출, 공용 문구·타입, 데이터, 헬퍼)
│
├── components/                   # 재사용 UI 컴포넌트
├── conventions/                  # 프로젝트 컨벤션
└── public/                       # 정적 파일
```

## 폴더별 역할

- `app/`: 페이지/레이아웃만 담당, `page.tsx`는 얇게 유지하고 로직은 `lib/`에서 가져와 조립
- `lib/`: API 키 쓰는 코드는 반드시 여기, 웹/카톡 라우트가 공통 로직을 여기서 가져다 씀
- `components/`: 특정 화면에 종속 안 되고 2곳 이상에서 재사용하는 UI만, 한 화면 전용은 해당 `app/` 폴더 안 `_components/`로 co-location

## import 경계

- 흐름: `page.tsx`(클라이언트) ➝ `fetch("/api/chat")` ➝ `route.ts`(서버) ➝ `lib/`의 LLM 모듈
- 클라이언트는 API 키 쓰는 `lib/` 모듈을 직접 import 안 함, HTTP 경계를 거쳐 API 키를 서버에 가둠

## 확장 시

- 도메인이 3개 이상으로 늘면 `features/<domain>/` 도입 검토
- import해서 쓰는 이미지가 생기면 `assets/` 도입 검토
- 테스트 도입 시 순수 로직은 co-location (`<모듈>.test.ts`), Vitest 검토
