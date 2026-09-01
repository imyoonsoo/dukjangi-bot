# 코드 스타일

겉모양(따옴표, 세미콜론, 들여쓰기 등)은 Prettier, 코드 품질 규칙은 ESLint 담당
커밋 시 `lint-staged`가 `eslint --fix` + `prettier --write` 자동 실행

## 포맷 (`.prettierrc.json`)

| 항목      | 값           |
| --------- | ------------ |
| 세미콜론  | 사용         |
| 따옴표    | 큰따옴표     |
| 후행 쉼표 | 전부(`all`)  |
| 줄 길이   | 80자         |
| 들여쓰기  | 스페이스 2칸 |

- 줄 끝 공백 없음
- 손으로 맞추지 말고 저장 시 포맷 / 커밋 훅에 맡기기

## 네이밍

### 폴더 이름

- 소문자 + kebab-case: `components`, `api`, `user-profile`
- 약속된 이름은 그대로: `node_modules`, `app`, `lib`

### 파일 이름

| 종류           | 규칙              | 예시                                 |
| -------------- | ----------------- | ------------------------------------ |
| React 컴포넌트 | PascalCase        | `Button.tsx`, `MessageList.tsx`      |
| 그 외 모듈     | kebab-case        | `api-client.ts`, `date-utils.ts`     |
| Next 예약 파일 | 소문자 고정       | `page.tsx`, `layout.tsx`, `route.ts` |
| 커스텀 훅      | `use` + camelCase | `useChat.ts`                         |

- 단어 하나면 소문자, 두 단어 이상이면 kebab-case (`api-client.ts`)

### 정적 파일

| 용도      | 포맷   | 이름                      | 이유                            |
| --------- | ------ | ------------------------- | ------------------------------- |
| 아이콘    | `.svg` | `ic-` 접두사, kebab-case  | 확대해도 안 깨짐, CSS로 색 변경 |
| 사진      | `.jpg` | `img-` 접두사, kebab-case | 압축률 좋음                     |
| 투명 배경 | `.png` | `img-` 접두사, kebab-case | 투명도 지원                     |

- 예: `ic-arrow.svg`, `img-hero.jpg`
- 최적화는 Next `next/image`가 WebP로 자동 변환, 원본은 PNG/JPG로 둠
- 위치: `public/`, import해서 쓸 게 생기면 `assets/` 검토

### 변수 / 함수 / 타입

| 종류                       | 규칙                 | 예시                          |
| -------------------------- | -------------------- | ----------------------------- |
| 변수 / 함수 / props        | camelCase            | `userName`, `fetchData`       |
| React 컴포넌트 / 함수      | PascalCase           | `Button`                      |
| 상수 (모듈 레벨 고정값)    | SCREAMING_SNAKE_CASE | `MAX_RETRY`, `DEFAULT_LOCALE` |
| 타입 / 인터페이스          | PascalCase           | `User`                        |
| 불리언 변수                | `is` / `has` 접두사  | `isLoading`, `hasError`       |
| 이벤트 핸들러 (정의)       | `handle` 접두사      | `handleSubmit`                |
| 이벤트 핸들러 (props 전달) | `on` 접두사          | `onSubmit`                    |

### 함수 이름

- 변수는 명사, 함수는 동사로 시작. 이름만으로 값인지 동작인지 구분됨 (`getUsers`, `formatDate`, `sendRequest`)
- 데이터를 만들어 반환하는 함수는 `build` / `format` / `to` 접두사

## 함수 선언

- 모듈 최상위 함수, React 컴포넌트 ➝ 함수 선언식(`function`)
  ```ts
  function toJson() { ... }
  export async function fetchUser(id: string): Promise<User> { ... }
  export default function Page() { ... }
  ```
- 함수 내부(콜백, 핸들러) ➝ 화살표 함수
  ```ts
  items.map((item) => item.name);
  const handleSubmit = () => { ... };
  ```

## export

- Next 예약 파일(`page`, `layout`, `route` 핸들러 등)은 강제되는 형태를 따름
  - `page` / `layout`: `export default`
- 그 외는 named export

## 타입

- Props/객체 모양은 `interface` 기본, 유니언/별칭이 필요하면 `type`
- `any` 금지 (ESLint `no-explicit-any`로 강제), `unknown`은 잡은 에러(`catch (err)`) 등 불가피한 곳에서만 쓰고 즉시 좁히기
- 유니언은 타입 가드(`x is T`)로 좁히기 우선, `as` 단언은 최소화
- SDK가 제공하는 타입 사용, 같은 모양을 다시 정의하지 않기 (`Anthropic.MessageParam`, `Anthropic.TextBlock` 등)
- 고정 값 목록은 `as const` 객체 우선, 이유 있으면 `enum`도 허용
  ```ts
  const ROLE = { user: "user", bot: "bot" } as const;
  ```

## import

- 확장자(`.ts`, `.tsx`) 안 붙임
- alias `@/*` 사용 가능, 가까운 경로는 상대경로(`./utils`)도 허용
- 순서: 외부 패키지 ➝ 내부 모듈(alias) ➝ 상대경로

## 에러 처리

- 사용자에게 보일 문구는 상수로 분리: 서버 전용 문구(시스템 프롬프트 등)는 server-only `lib/` 모듈, 클라이언트에서도 쓰는 문구(`ERROR_MESSAGE` 등)는 server-only가 아닌 `lib/` 모듈
- 서버 로직은 `try/catch`로 감싸고 실패 시 사용자 문구 반환
- 원인 로깅은 `console.error` (추후 구조화 로거 / 에러 트래커 도입 여지)
- 기술적 상세(스택 등)를 사용자 응답에 노출하지 않기

## JSX

- `.tsx` / `.jsx` 파일에서만 작성, `.ts`에 JSX 금지
- 조건부 렌더링은 간단할 때만 `조건 && <JSX>`, 길어지면 컴포넌트/함수로 분리

## 접근성

- 인터랙티브 요소는 시맨틱 태그 우선 (`<button>`, `<label>`)
- 이미지에 `alt`, placeholder로 라벨 대신하지 않기
- 실시간 갱신 영역(채팅 등)은 `aria-live`, 로딩 상태는 `role="status"`
