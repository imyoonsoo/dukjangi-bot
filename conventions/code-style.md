# 컨벤션: 코드스타일

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

## 함수 선언방식

- 모듈 최상위 함수, React 컴포넌트 ➝ 함수 선언식(`function`)
  ```ts
  function toText() { ... }
  export async function generateReply(userText: string): Promise<string> { ... }
  export default function Home() { ... }
  ```
- 함수 내부(콜백, 핸들러) ➝ 화살표 함수
  ```ts
  scholarShip.map((s) => s.title);
  const handleSubmit = () => { ... };
  ```

## export 방식

- Next 예약 파일(`page`, `layout`, `route` 핸들러 등)은 강제되는 형태를 따름
  - `page` / `layout`: `export default`
- 그 외는 named export

## 타입

- Props/객체 모양은 `interface` 기본, 유니언/별칭이 필요하면 `type`
- `any` 금지, `unknown`은 잡은 에러(`catch (err)`) 등 불가피한 곳에서만 쓰고 즉시 좁히기
- SDK가 제공하는 타입 사용, 같은 모양을 다시 정의하지 않기 (`Anthropic.MessageParam`, `Anthropic.TextBlock` 등)

## import

- 확장자(`.ts`, `.tsx`) 안 붙임
- alias `@/*` 사용 가능, 가까운 경로는 상대경로(`./persona`)도 허용
- 순서: 외부 패키지 ➝ 내부 모듈(alias) ➝ 상대경로

## 에러 처리

- 사용자에게 보일 문구는 `lib/persona.ts` 상수(`ERROR_MESSAGE` 등)
- 서버 로직은 `try/catch`로 감싸고 실패 시 사용자 문구 반환
- 원인 로깅은 `console.error` (추후 구조화 로거 / 에러 트래커 도입 여지)
- 기술적 상세(스택 등)를 사용자 응답에 노출하지 않기

## 조건부 렌더링 (React)

- 간단한 경우만 `조건 && <JSX>`
- 분기가 길어지면 별도 컴포넌트/함수로 분리

## JSX

- `.tsx` / `.jsx` 파일에서만 작성, `.ts`에 JSX 금지
