# 🦡 덕장이

웹과 카카오톡에서 동작하는 교내 장학금 안내 챗봇입니다. 사용자의 자연어 질문을 Claude(LLM)로 처리해 답변합니다.

🚧 현재 구현 초기 단계입니다. (구조 설계 완료, 핵심 로직 구현 중)

> 📖 프로젝트 배경과 실제 운영 이력(스크린샷 포함)은 [프로젝트 소개 (Notion)](https://chatbot-dukjangi.notion.site/) 에 정리되어 있습니다.

## 소개

2022년에 카카오톡 채널로 운영했던 장학금 안내 챗봇을, 지금은 LLM 기반으로 다시 만들고 있습니다. 웹과 카카오톡 두 입구가 하나의 답변 로직(`lib/llm.ts`)을 공유하는 구조입니다.

## 아키텍처

핵심 아이디어는 "뇌 하나, 입구 둘"입니다. LLM 호출 로직은 한 곳에 두고, 웹과 카카오톡은 입구만 다르게 둡니다.

```
[웹 사용자]   → 웹 채팅 UI   → /api/chat         ┐
                                                ├→ lib/llm (Claude) → 답변
[카톡 사용자] → 카카오톡 채널 → /api/kakao/skill ┘
```

- 뇌(LLM 호출)는 `lib/llm.ts` 한 곳에서 처리해, 웹이든 카톡이든 같은 로직을 공유합니다.
- 입구는 둘로 나뉩니다. 웹은 `/api/chat`, 카톡은 `/api/kakao/skill`로 들어옵니다.
- 카카오톡은 응답이 5초를 넘기므로 콜백으로 최종 답변을 이어 보냅니다. (웹은 스트리밍)

## 핵심 설계 결정

- 모든 발화를 LLM으로: 오픈빌더의 폴백 블록 응답을 스킬(웹훅)에 연결해, 등록되지 않은 질문까지 모두 서버를 거쳐 Claude로 전달합니다.
- 콜백 기반 비동기 응답: LLM 응답은 카카오의 5초 제한을 넘기기 때문에, "생각 중…"을 먼저 보낸 뒤 실제 답변을 `callbackUrl`로 이어서 전송합니다.
- 페르소나 분리: 성격과 말투, 역할을 `lib/persona.ts` 한 곳에 모아, 로직을 건드리지 않고도 캐릭터만 손볼 수 있게 했습니다.

## Tech Stack

| Area | Tech |
|------|------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Web UI | React · Tailwind CSS |
| LLM | Claude API (`@anthropic-ai/sdk`) |
| Kakao | Kakao i OpenBuilder (Skill + Callback) |

## 실행

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY 입력
npm run dev                  # http://localhost:3000
```

| 환경변수 | 필수 | 설명 |
|----------|------|------|
| `ANTHROPIC_API_KEY` | ✅ | Claude API 키 |
| `CLAUDE_MODEL` | | 모델 (기본 `claude-opus-4-8`) |
| `KAKAO_SKILL_TOKEN` | | 카톡 스킬 요청 검증 토큰 (선택) |

## 폴더 구조

```
app/
├─ page.tsx              # 웹 채팅 화면
└─ api/
   ├─ chat/route.ts      # 웹 채팅 API
   └─ kakao/skill/route.ts   # 카톡 웹훅 + 콜백
lib/
├─ llm.ts                # Claude 호출 (웹·카톡 공용)
├─ persona.ts            # 덕장이 성격/말투
└─ kakao.ts              # 카카오 요청 파싱 & 응답 포맷
```

## 진행 상황

- [x] 프로젝트 구조 설계
- [ ] `lib/llm.ts` : Claude 호출 · 페르소나 연결
- [ ] `/api/chat` : 웹 채팅 엔드포인트
- [ ] `/api/kakao/skill` : 카톡 웹훅 + 콜백
- [ ] 웹 채팅 UI (React + Tailwind)
- [ ] 배포

## 문서

📖 [덕장이 프로젝트 소개 (Notion)](https://chatbot-dukjangi.notion.site/)
