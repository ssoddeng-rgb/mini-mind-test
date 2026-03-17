---
name: Turbopack requires static JSON imports
description: Dynamic require() for JSON files fails with Turbopack/Next.js 16 — must use explicit static imports
type: feedback
---

Do NOT use dynamic `require(`@/data/tests/${id}.json`)` in Next.js 16 with Turbopack. It fails at build time with "Cannot find module".

**Why:** Turbopack resolves modules statically at compile time, not at runtime.

**How to apply:** Always create a static import map in lib/tests.ts like:
```ts
import mbtiClassic from '@/data/tests/mbti-classic.json';
const testMap = { 'mbti-classic': mbtiClassic, ... };
```
