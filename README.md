# <img src="app/icon.png" width="50" height="50" align="top"/> 덕장이

> 웹과 카카오톡에서 동작하는 교내 장학금 안내 챗봇입니다.<br>
> 사용자의 자연어 질문을 LLM으로 처리해 답변합니다.

<br>

## 📍 목차

- [개요](#overview)
- [기술 스택](#stack)
- [시스템 아키텍처](#architecture)
- [프로젝트 구조](#structure)
- [코드 품질](#quality)
- [시작하기](#getting-started)
- [컨벤션](#convention)

---

<div id="overview"></div>

## 📋 개요

| 구분          | 개발기간            | 내용                                                   |
| :------------ | :------------------ | :----------------------------------------------------- |
| 개인 프로젝트 | 2026.07.29 ~ 진행중 | 2022년 개설한 카카오톡 채널 챗봇을 LLM 기반으로 재구축 |

[**웹 배포**](https://dukjangi.vercel.app)<br>
[**카카오톡**](http://pf.kakao.com/_axkfxaX/chat)

<br>

<div id="stack"></div>

## 🔧 기술 스택

| Category         | Tech                                    |
| :--------------- | :-------------------------------------- |
| **Framework**    | Next.js 16 (App Router)                 |
| **Language**     | TypeScript                              |
| **Web UI**       | React 19, Tailwind CSS 4                |
| **LLM**          | LLM API (`@anthropic-ai/sdk`)           |
| **Kakao**        | Kakao i OpenBuilder (Skill + Callback)  |
| **Testing**      | Vitest, React Testing Library           |
| **Code Quality** | ESLint, Husky (lint-staged), commitlint |

<br>

<div id="architecture"></div>

## 🏗️ 시스템 아키텍처

LLM 호출 로직은 한 곳(`lib/llm`)에 모으고, 웹과 카카오톡은 엔드포인트만 다르게 둡니다. 두 채널이 동일한 응답 로직을 공유하는 구조입니다.

```
[웹 사용자]   → 웹채팅 UI    → /api/chat         ┐
                                                ├→ lib/llm → 답변
[카카오 사용자] → 카카오 채널 → /api/kakao/skill ┘
```

오픈빌더의 폴백 블록을 스킬(웹훅)에 연결해, 등록되지 않은 질문까지 모두 서버를 거쳐 LLM으로 전달합니다.

<br>

<div id="structure"></div>

## 🗂️ 프로젝트 구조

```
app/
├─ page.tsx          # 웹채팅 UI
├─ layout.tsx        # 메타데이터
├─ _components/      # Header, CopyButton
└─ api/              # 엔드포인트: 웹(/chat), 카카오(/kakao/skill)
lib/
├─ llm.ts            # 웹/카카오 LLM 로직
├─ persona.ts        # 페르소나
├─ scholarship.ts    # 장학금 데이터
├─ kakao.ts          # 카카오 요청/응답 처리
├─ chat-storage.ts   # 웹채팅 기록 localStorage 저장
└─ useChat.ts        # 웹채팅 훅
```

<br>

<div id="quality"></div>

## ⚡ 코드 품질

Husky + lint-staged + commitlint로 커밋 전 검사를 자동화했습니다.

- `*.{ts,tsx,js,jsx}`: ESLint(`--fix`)
- 커밋 메시지: commitlint (Conventional Commits)
- `npm run test`: Vitest, CI에서 자동 실행

<br>

<div id="getting-started"></div>

## 🚀 시작하기

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
```

프로젝트 루트에 `.env.local`을 만들고 아래 값을 채워주세요.

```bash
ANTHROPIC_API_KEY=   # Claude API 키 (필수)
CLAUDE_MODEL=         # 모델 지정 (선택)
KAKAO_SKILL_TOKEN=    # 카카오 스킬 요청 검증 토큰 (선택)
```

<br>

<div id="convention"></div>

## 🗞 컨벤션

프로젝트 컨벤션은 [`conventions/`](conventions) 폴더의 문서를 참고하세요.

- [코드 스타일](conventions/code-style.md)
- [디렉터리 구조](conventions/directory.md)
- [git 규칙](conventions/git.md)
