# 디렉터리 구조

`src/` 없이 프로젝트 루트에 Next App Router

```
dukjangi-bot/
├── app/                          # 페이지·레이아웃·API 라우트
│   ├── layout.tsx
│   ├── page.tsx
│   ├── error.tsx                 # 렌더 예외 폴백 (에러 바운더리)
│   ├── globals.css
│   ├── _components/              # 이 화면 전용 컴포넌트
│   └── api/
│       ├── chat/route.ts
│       └── kakao/skill/route.ts
│
├── features/<domain>/            # 한 도메인 로직 묶음 (훅·상태·저장·타입·문구)
├── lib/                          # 외부 SDK 연동, API 키 쓰는 코드, 도메인 없는 범용 유틸
├── components/                   # 2곳 이상에서 재사용하는 순수 UI
├── conventions/
└── public/                       # 정적 파일
```

## 폴더별 역할

- `app/`: 페이지·레이아웃·라우트만. `page.tsx`는 얇게 유지하고 로직은 훅·도메인 모듈에서 가져와 조립
- `features/<domain>/`: 한 도메인의 로직. 여러 화면·라우트가 공유하는 훅·상태·저장·타입·상수. 예: `features/chat/`
- `lib/`: 외부 SDK 래퍼, API 키 쓰는 코드, 도메인 없는 범용 유틸. 도메인 로직은 여기 두지 않음
- `components/`: 화면에 종속 안 되고 2곳 이상에서 재사용하는 순수 UI. 한 화면 전용은 `app/_components/`

## import 경계

- 흐름: `page.tsx`(클라이언트) ➝ `fetch("/api/chat")` ➝ `route.ts`(서버) ➝ `lib/`의 LLM 모듈
- 클라이언트는 API 키 쓰는 `lib/` 모듈을 직접 import 안 함, HTTP 경계를 거쳐 API 키를 서버에 가둠

## 확장 시

- 도메인 로직이 생기면 `features/<domain>/`, 파일 2~3개 넘어가면 폴더로 분리
- 테스트 도입 시 순수 로직은 대상 모듈 옆에 (`<모듈>.test.ts`), Vitest 검토
