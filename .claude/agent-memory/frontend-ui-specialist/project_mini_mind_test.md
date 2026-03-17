---
name: Mini Mind Test — project architecture
description: Architecture, file structure, and key patterns for the Mini Psychology Test web app
type: project
---

Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind + Framer Motion + Supabase (optional).

**Why:** Full-stack psychology quiz app with Korean-primary UI, dark theme, animated components.

**How to apply:** When extending the app, follow these patterns and file locations.

## Key File Paths
- `/types/test.ts` — all shared TypeScript types (Test, Question, ResultType, etc.)
- `/lib/tests.ts` — static test registry using explicit JSON imports (NOT dynamic require)
- `/lib/scoring/engine.ts` — scoring logic (mbti-dichotomy, accumulation, scale, weighted-multi)
- `/data/tests/*.json` — 6 test data files
- `/hooks/useTestProgress.ts` — quiz session state management
- `/hooks/useQuestionTimer.ts` — countdown timer with expire callback
- `/app/tests/[testId]/quiz/page.tsx` — main quiz flow (client component)
- `/app/tests/[testId]/results/[resultId]/page.tsx` — results page (server component)
- `/components/test/` — QuestionCard, QuestionTimer, ProgressBar
- `/components/results/` — ResultCard, ShareButtons
- `/components/comments/CommentSection.tsx` — Supabase-backed comments with graceful degradation

## Supabase Tables (when configured)
- `test_results`: id, test_id, result_type_id, answers (jsonb), created_at
- `comments`: id, test_id, result_type_id, nickname, content, emoji, created_at

## Scoring Methods
- `mbti-dichotomy` — compares axis pairs (EI, SN, TF, JP)
- `accumulation` — highest total score wins
- `scale` — highest dimension wins
- `weighted-multi` — same as accumulation

## Design System
- Dark bg: `#0f0f1a` to `#1a0a2e` gradient
- Cards: `bg-white/5`, `border-white/10`, `rounded-2xl`
- Primary accent: `violet-600` / `purple-500`
- Each test has its own `gradient` field used for accent colors
- Font: Inter

## Dev Server
- Run: `node node_modules/next/dist/bin/next dev --port 3033`
- Build: `node node_modules/next/dist/bin/next build`
