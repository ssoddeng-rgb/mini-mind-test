# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

**마음 테스트** — 한국 사용자를 위한 귀엽고 게임 같은 미니 심리 테스트 웹앱.
MBTI, 애착 이론, 사랑의 언어, 빅파이브, 에니어그램 등 학술 연구 기반 테스트 제공.
문항당 타이머 적용, 결과 SNS 공유, 닉네임 + 3줄 리뷰 기능. 로그인 없이 사용 가능.

## 기술 스택

- **Next.js 14+ (App Router)** + TypeScript
- **Supabase** — 댓글, 결과 저장, 공유 추적
- **Tailwind CSS** + **Framer Motion** — 애니메이션
- **`@vercel/og`** — 동적 OG 이미지 생성

## 핵심 설계 원칙

테스트 정의(문항, 채점, 결과 유형)는 `/data/tests/` 의 정적 JSON 파일에 보관.
사용자 생성 콘텐츠(댓글, 결과 저장)만 Supabase에 저장. 인증 불필요.

## 페이지 구조

```
/ (랜딩)                              → 히어로 + 카테고리 필터 + 테스트 카드 그리드
/tests/[testId]                       → 테스트 소개 (설명, 타이머 안내, 시작 버튼)
/tests/[testId]/quiz                  → 클라이언트 퀴즈 플로우 (전체 문항, 타이머, 전환 애니메이션)
/tests/[testId]/results/[resultId]    → 결과 페이지 (OG 메타데이터) + 공유/댓글 섹션
```

## 테스트 목록 (6종)

| 슬러그 | 카테고리 | 출처 | 문항 수 | 결과 수 |
|--------|----------|------|---------|---------|
| `mbti-classic` | 자아 | Myers & Briggs (1962) / Jung (1921) | 20문항 | 16종 |
| `attachment-style` | 연애 | Hazan & Shaver (1987) / Bartholomew (1991) | 16문항 | 4종 |
| `love-languages` | 연애 | Chapman (1992) | 10문항 | 5종 |
| `big-five` | 자아 | Mini-IPIP: Donnellan et al. (2006) | 10문항 | 5종 |
| `enneagram` | 자아 | Riso & Hudson (1999) | 9문항 | 9종 |
| `friendship-style` | 우정 | Bukowski et al. (1994) / Fehr (1996) | 8문항 | 4종 |

## 채점 방식

- **mbti-dichotomy**: 4축(EI, SN, TF, JP) → 16가지 유형 조합
- **accumulation**: 유형별 점수 합산, 최고점 유형 선택
- **scale**: 5개 연속 차원, 프로파일 도출
- **weighted-multi**: 정규화된 누산

## 주요 파일

### 타입 & 핵심 로직
- `types/test.ts` — 핵심 인터페이스 (TestMeta, Test, Question, AnswerOption, ResultType, UserAnswer, TestSession, ScoringConfig)
- `lib/scoring/engine.ts` — 범용 채점 엔진 (computeResult, tallyScores, resolveMBTI, resolveAccumulation, resolveScale)
- `lib/tests.ts` — 테스트 JSON 정적 임포트 맵 (Turbopack 호환)
- `hooks/useTestProgress.ts` — 퀴즈 상태 머신 (phase: intro→question→computing→done)
- `hooks/useQuestionTimer.ts` — 카운트다운 훅, 10초 이하 경고 상태 + onExpire 콜백

### Supabase 스키마 (3개 테이블)
```sql
test_results  (id uuid, test_id, result_type_id, score_data jsonb, session_data jsonb, share_count, created_at)
test_comments (id uuid, test_id, nickname, review, result_type_id, likes, created_at)
share_events  (id uuid, result_id→test_results, platform, created_at)
```
RLS: 전체 공개 읽기 + 삽입. 인증 없음.

### API 라우트
- `POST /api/results` → 결과 저장, UUID 반환 (공유 URL에 사용)
- `GET/POST /api/comments` → 페이지네이션 조회 / 기본 속도 제한이 있는 삽입
- `GET /api/og/[resultId]` → `@vercel/og` ImageResponse로 동적 OG 이미지 (1200×630)

### 주요 컴포넌트
- `components/test/QuestionTimer.tsx` — SVG 아크 카운트다운, 10초 이하 빨간색 펄스
- `components/test/QuestionCard.tsx` — AnimatePresence x축 슬라이드 전환
- `components/results/ShareButtons.tsx` — 카카오톡 SDK / 트위터 intent / 링크 복사 / 인스타그램 다운로드
- `components/comments/CommentSection.tsx` — 닉네임(20자) + 텍스트(300자), 낙관적 업데이트
- `components/landing/TestCard.tsx` — 그라디언트 카드, whileHover scale(1.03)

## 환경 변수

`.env.local` 파일에 설정:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_KAKAO_JS_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3033
```

> Supabase 없이도 동작함 — API 라우트가 graceful degradation 처리. 댓글은 빈 상태, 결과는 resultTypeId를 URL에 직접 사용.

## UI 디자인 시스템

- **다크 테마**: `bg-slate-900/950` + 보라색 계열 강조
- **카테고리별 그라디언트**: 연애=pink→rose, 우정=violet→purple, 자아=cyan→blue
- **Framer Motion**: 페이지 fade-up 입장, 문항 x축 슬라이드 (AnimatePresence), 답변 옵션 stagger (0.08s)
- **타이머 경고**: 10초 이하 → 빨간색 전환 + scale 펄스
- **모바일 우선** 반응형 디자인

## 개발 서버

```bash
npm run dev   # http://localhost:3033
```

## 기술적 결정 사항

1. **정적 JSON 임포트** — Turbopack은 템플릿 리터럴이 있는 동적 `require()`를 지원하지 않아 `/lib/tests.ts`에 정적 임포트 맵 사용
2. **resultTypeId 직접 URL 사용** — Supabase 없이도 퀴즈 완료 후 결과 페이지로 이동 가능
3. **퀴즈 타임아웃** — 시간 초과 시 첫 번째 옵션 자동 선택
4. **접근성** — WCAG 2.1 AA 준수: `role="progressbar"`, `role="timer"`, `aria-live`, `prefers-reduced-motion` 지원
