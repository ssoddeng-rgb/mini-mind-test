'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TestMeta, TestCategory } from '@/types/test';
import TestCard from './TestCard';

interface LandingClientProps {
  tests: TestMeta[];
}

type FilterCategory = 'all' | TestCategory;

const categoryFilters: { id: FilterCategory; label: string; emoji: string }[] = [
  { id: 'all', label: '전체', emoji: '✨' },
  { id: 'self', label: '자아', emoji: '🧠' },
  { id: 'romance', label: '연애', emoji: '💕' },
  { id: 'friendship', label: '우정', emoji: '🤗' },
];

export default function LandingClient({ tests }: LandingClientProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  const filteredTests = activeCategory === 'all'
    ? tests
    : tests.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-900/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-indigo-900/10 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          {/* Floating emojis */}
          <div className="flex justify-center gap-6 mb-6" aria-hidden="true">
            <span className="text-3xl animate-float">🧠</span>
            <span className="text-3xl animate-float-slow" style={{ animationDelay: '0.5s' }}>💫</span>
            <span className="text-3xl animate-float-delay">✨</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black mb-4 leading-tight">
            <span
              className="bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
            >
              마음 테스트
            </span>
          </h1>

          <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed">
            나를 더 깊이 이해하는 첫걸음
            <br />
            <span className="text-sm text-white/40">
              심리학 기반 테스트로 진짜 나를 발견하세요
            </span>
          </p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex justify-center gap-8 mt-8"
          >
            {[
              { value: `${tests.length}개`, label: '테스트' },
              { value: '무료', label: '모두' },
              { value: '2–5분', label: '소요 시간' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-white/90">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.header>

        {/* Category filter */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          aria-label="테스트 카테고리 필터"
          className="flex justify-center gap-2 mb-8 flex-wrap"
        >
          {categoryFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveCategory(filter.id)}
              aria-pressed={activeCategory === filter.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeCategory === filter.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                  : 'bg-white/8 text-white/60 border border-white/10 hover:bg-white/12 hover:text-white/80'
              }`}
            >
              <span aria-hidden="true">{filter.emoji}</span>
              {filter.label}
            </button>
          ))}
        </motion.nav>

        {/* Test grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {filteredTests.length === 0 ? (
              <div className="text-center py-20 text-white/40">
                <div className="text-5xl mb-4">🔍</div>
                <p>해당 카테고리의 테스트가 없습니다.</p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                role="list"
                aria-label="테스트 목록"
              >
                {filteredTests.map((test, idx) => (
                  <div key={test.id} role="listitem">
                    <TestCard test={test} index={idx} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-sm text-white/25 pb-8"
        >
          <p>마음 테스트 &mdash; 학술 심리학 연구 기반</p>
          <p className="mt-1">재미와 자기 이해를 위한 테스트이며, 전문 심리 진단을 대체하지 않습니다.</p>
        </motion.footer>
      </div>
    </div>
  );
}
