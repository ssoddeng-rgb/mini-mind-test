'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ResultType, TestMeta } from '@/types/test';

interface ResultCardProps {
  result: ResultType;
  meta: TestMeta;
}

type Tab = 'overview' | 'analysis' | 'growth';

export default function ResultCard({ result, meta }: ResultCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'overview', label: '특성', emoji: '✨' },
    { id: 'analysis', label: '상세 분석', emoji: '🔍' },
    { id: 'growth', label: '성장 가이드', emoji: '🌱' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Gradient header */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${result.gradient} p-8 mb-4 shadow-2xl`}>
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-4 right-4 text-8xl rotate-12 opacity-30">{result.emoji}</div>
          <div className="absolute bottom-4 left-4 text-6xl -rotate-12 opacity-20">{meta.emoji}</div>
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4">
            <span aria-hidden="true">{meta.emoji}</span>{meta.titleKo}
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="text-6xl mb-4"
          >
            {result.emoji}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <p className="text-white/70 text-sm font-medium mb-1 uppercase tracking-wider">당신의 결과</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-1 leading-tight">{result.titleKo}</h1>
            <p className="text-white/60 text-base font-medium">{result.title}</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/8 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${result.gradient} text-white shadow-md`
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <span className="text-base" aria-hidden="true">{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }} className="space-y-4"
          >
            {/* Description */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">💡 당신에 대해</h2>
              <p className="text-white/80 leading-relaxed">{result.descriptionKo}</p>
            </div>

            {/* Traits */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">⭐ 핵심 특성</h2>
              <div className="flex flex-wrap gap-2">
                {result.traitsKo.map((trait) => (
                  <span key={trait} className={`px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${result.gradient} text-white shadow-md`}>
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Relationship tip */}
            {result.relationshipTipKo && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">💬 관계 팁</h2>
                <p className="text-white/70 leading-relaxed italic">"{result.relationshipTipKo}"</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'analysis' && (
          <motion.div key="analysis"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }} className="space-y-4"
          >
            {/* Strengths */}
            {result.strengthsKo?.length ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">💪 강점</h2>
                <ul className="space-y-2">
                  {result.strengthsKo.map((s, i) => (
                    <motion.li key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-2.5 text-white/75"
                    >
                      <span className={`mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${result.gradient} flex items-center justify-center flex-shrink-0 text-xs text-white font-bold`}>{i + 1}</span>
                      <span className="leading-relaxed">{s}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">💪 강점</h2>
                <div className="flex flex-wrap gap-2">
                  {result.traitsKo.map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-full text-sm bg-white/10 text-white/70">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Career fits */}
            {result.careerFitsKo?.length ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">🎯 어울리는 환경 & 직업</h2>
                <div className="flex flex-wrap gap-2">
                  {result.careerFitsKo.map((c) => (
                    <span key={c} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 border border-white/10 text-sm text-white/70">
                      <span className="text-xs">✦</span>{c}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* No data fallback */}
            {!result.strengthsKo?.length && !result.careerFitsKo?.length && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-white/40 text-sm">상세 분석 데이터가 준비 중이에요 ✨</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'growth' && (
          <motion.div key="growth"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }} className="space-y-4"
          >
            {/* Weaknesses / Growth areas */}
            {result.weaknessesKo?.length ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">🌱 성장 영역</h2>
                <ul className="space-y-3">
                  {result.weaknessesKo.map((w, i) => (
                    <motion.li key={w} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8"
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">🔆</span>
                      <span className="text-white/70 leading-relaxed text-sm">{w}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-white/40 text-sm">성장 가이드가 준비 중이에요 🌱</p>
              </div>
            )}

            {/* Growth tip */}
            <div className={`rounded-2xl bg-gradient-to-br ${result.gradient} p-5 opacity-90`}>
              <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">💫 오늘의 성장 메시지</h2>
              <p className="text-white leading-relaxed text-sm">
                {result.relationshipTipKo
                  ? result.relationshipTipKo
                  : `${result.titleKo}인 당신은 이미 충분히 훌륭합니다. 자신의 강점을 믿고 꾸준히 성장해 나가세요.`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
