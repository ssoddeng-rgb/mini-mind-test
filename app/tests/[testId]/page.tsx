import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTest, getAllTests } from '@/lib/tests';

export const dynamicParams = false;

export async function generateStaticParams() {
  const tests = getAllTests();
  return tests.map(t => ({ testId: t.id }));
}

interface PageProps {
  params: Promise<{ testId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { testId } = await params;
  try {
    const test = getTest(testId);
    return {
      title: `${test.meta.titleKo} | 마음 테스트`,
      description: test.meta.descriptionKo,
    };
  } catch {
    return { title: '테스트를 찾을 수 없습니다' };
  }
}

export default async function TestIntroPage({ params }: PageProps) {
  const { testId } = await params;

  let test;
  try {
    test = getTest(testId);
  } catch {
    notFound();
  }

  const { meta } = test;

  const categoryLabels: Record<string, string> = {
    self: '자아 탐구',
    romance: '연애 심리',
    friendship: '우정 유형',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className={`absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br ${meta.gradient} opacity-10 blur-[100px]`} />
        <div className="absolute bottom-[-10%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-purple-900/20 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg px-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로
        </Link>

        {/* Main card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
          {/* Gradient header */}
          <div className={`relative bg-gradient-to-br ${meta.gradient} p-8 pb-10`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4 backdrop-blur-sm">
                <span aria-hidden="true">
                  {meta.category === 'self' ? '🧠' : meta.category === 'romance' ? '💕' : '🤗'}
                </span>
                {categoryLabels[meta.category]}
              </div>
              <div className="text-6xl mb-3" role="img" aria-label={meta.titleKo}>
                {meta.emoji}
              </div>
              <h1 className="text-3xl font-black text-white mb-1">{meta.titleKo}</h1>
              <p className="text-white/70 text-sm">{meta.title}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            <p className="text-white/70 leading-relaxed mb-6">
              {meta.descriptionKo}
            </p>

            {/* Info grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: '❓', label: '문항 수', value: `${meta.questionCount}개` },
                { icon: '⏱', label: '소요 시간', value: `약 ${meta.estimatedMinutes}분` },
                { icon: '📚', label: '출처', value: meta.academicSource.split('/')[0].trim() },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/8">
                  <div className="text-xl mb-1" aria-hidden="true">{item.icon}</div>
                  <div className="text-white/90 text-sm font-semibold">{item.value}</div>
                  <div className="text-white/40 text-xs mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Academic source */}
            <p className="text-xs text-white/30 mb-6 text-center">
              출처: {meta.academicSource}
            </p>

            {/* Start button */}
            <Link
              href={`/tests/${meta.id}/quiz`}
              className={`block w-full text-center py-4 rounded-2xl bg-gradient-to-r ${meta.gradient} text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50`}
            >
              테스트 시작하기 ✨
            </Link>

            <p className="text-center text-xs text-white/25 mt-3">
              언제든지 중단할 수 있어요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
