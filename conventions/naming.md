# 네이밍 규칙

## 폴더 이름

- 소문자 + kebab-case: `components`, `api`, `kakao-skill`
- 약속된 이름은 그대로: `node_modules`, `app`, `lib`

## 파일 이름

| 종류           | 규칙              | 예시                                 |
| -------------- | ----------------- | ------------------------------------ |
| React 컴포넌트 | PascalCase        | `ChatBox.tsx`, `MessageList.tsx`     |
| 그 외 모듈     | kebab-case        | `kakao.ts`, `scholarship.ts`         |
| Next 예약 파일 | 소문자 고정       | `page.tsx`, `layout.tsx`, `route.ts` |
| 커스텀 훅      | `use` + camelCase | `useChat.ts`                         |

- 현재 `lib/` 파일은 단어 하나라 소문자, 두 단어 이상이면 kebab-case (`kakao-client.ts`)

## 정적 파일 (이미지 / 아이콘)

| 용도      | 포맷   | 이름                      | 이유                            |
| --------- | ------ | ------------------------- | ------------------------------- |
| 아이콘    | `.svg` | `ic-` 접두사, kebab-case  | 확대해도 안 깨짐, CSS로 색 변경 |
| 사진      | `.jpg` | `img-` 접두사, kebab-case | 압축률 좋음                     |
| 투명 배경 | `.png` | `img-` 접두사, kebab-case | 투명도 지원                     |

- 예: `ic-arrow.svg`, `img-hero.jpg`
- 최적화는 Next `next/image`가 WebP로 자동 변환, 원본은 PNG/JPG로 둠
- 위치: `public/` (정적 서빙) 또는 `assets/` (import용)

## 코드 심볼

| 종류                       | 규칙                 | 예시                             |
| -------------------------- | -------------------- | -------------------------------- |
| 변수 / 함수 / props        | camelCase            | `userText`, `generateReply`      |
| React 컴포넌트 / 함수      | PascalCase           | `ChatBox`                        |
| 상수 (모듈 레벨 고정값)    | SCREAMING_SNAKE_CASE | `SYSTEM_PROMPT`, `ERROR_MESSAGE` |
| 타입 / 인터페이스          | PascalCase           | `Scholarship`                    |
| 불리언 변수                | `is` / `has` 접두사  | `isLoading`, `hasError`          |
| 이벤트 핸들러 (정의)       | `handle` 접두사      | `handleSubmit`                   |
| 이벤트 핸들러 (props 전달) | `on` 접두사          | `onSubmit`                       |

## 상수 값 집합

`as const`로 관리

```ts
const ROLE = {
  user: "user",
  bot: "bot",
} as const;
```

## 함수 이름

- 동사로 시작: `getScholarships`, `formatText`, `sendCallback`
- 데이터를 만들어 반환하는 함수는 `build` / `format` / `to` 접두사

## 배열 vs 단수

- 여러 개를 담는 값은 복수형: `scholarships`, `messages`
- 현재 `scholarShip`은 의도적으로 둔 이름, 새 코드는 복수형 권장
