# git 규칙

## 커밋 메시지

Conventional Commits + commitlint(`@commitlint/config-conventional`) 검사

### 형식

```
<type>: <제목>

<본문(선택)>
```

- 제목: 한글, 명령형/개조식, 마침표 없음 (`subject-case` 규칙 꺼둠)
- 본문: 무엇을/왜 위주, "어떻게"는 코드가 설명

### type

| 태그       | 설명                                 |
| ---------- | ------------------------------------ |
| `feat`     | 새로운 기능 추가                     |
| `fix`      | 버그 수정                            |
| `docs`     | 문서만 변경                          |
| `style`    | 포맷팅 등 코드 동작에 영향 없는 변경 |
| `refactor` | 동작 변화 없는 코드 구조 개선        |
| `perf`     | 성능 개선                            |
| `test`     | 테스트 코드                          |
| `ci`       | CI 설정 (GitHub Actions, husky 등)   |
| `chore`    | 패키지/설정 등 그 외 작업            |

## 브랜치 전략 (git flow 변형)

| 브랜치     | 역할                                          |
| ---------- | --------------------------------------------- |
| `main`     | 배포 가능한 프로덕션 코드                     |
| `develop`  | 다음 배포용 통합 브랜치, 작업 반영 대상       |
| `<type>/*` | 작업 브랜치, `develop`에서 따서 `develop`으로 |

- prefix는 커밋 type을 따름 (`feature/`, `fix/`, `docs/`, `chore/` …), 정통 git flow의 `feature` 단일 prefix 아님
- 이름: `<type>/<작업-내용-kebab-case>` (예: `feature/llm-integration`, `docs/conventions`)
- `develop`: PR 권장, 작거나 급한 변경은 로컬에서 직접 push 허용
- `main`: `develop` 머지로만 갱신, 직접 커밋/push 안 함

## PR 규칙

PR 열 때 (필수는 아님, `develop` 직접 push도 허용)

- 제목: `<type>: <요약>` (커밋 제목과 동일)
- 본문은 템플릿(`.github/pull_request_template.md`) 따름
- 모든 머지는 `--no-ff` merge commit (브랜치 기록 보존)
- `develop` ➝ `main` 머지에 버전 태그 추가 (`v<semver>`, `package.json` version과 동일)

## 커밋 단위

- 커밋 하나 = 논리적 변경 하나
- 성격 다른 변경 섞지 않기 (문서 + 기능을 한 커밋에 X)
