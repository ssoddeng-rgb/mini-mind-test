import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTest } from '@/lib/tests';
import ResultCard from '@/components/results/ResultCard';
import ShareButtons from '@/components/results/ShareButtons';
import CommentSection from '@/components/comments/CommentSection';

interface PageProps {
  params: Promise<{ testId: string; resultId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { testId, resultId } = await params;
  try {
    const test = getTest(testId);
    const result = test.results.find(r => r.id === resultId);
    if (!result) return { title: '결과를 찾을 수 없습니다' };
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://maum-test.vercel.app';
    const ogImageUrl = `${appUrl}/api/og/${resultId}?testId=${testId}`;
    return {
      title: `${result.titleKo} - ${test.meta.titleKo} | 마음 테스트`,
      description: result.descriptionKo.slice(0, 150),
      openGraph: {
        title: `나의 ${test.meta.titleKo} 결과: ${result.titleKo} ${result.emoji}`,
        description: result.descriptionKo.slice(0, 150),
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: result.titleKo }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `나의 ${test.meta.titleKo} 결과: ${result.titleKo} ${result.emoji}`,
        description: result.descriptionKo.slice(0, 150),
        images: [ogImageUrl],
      },
    };
  } catch {
    return { title: '결과를 찾을 수 없습니다' };
  }
}

export default async function ResultsPage({ params }: PageProps) {
  const { testId, resultId } = await params;

  let test;
  try {
    test = getTest(testId);
  } catch {
    notFound();
  }

  const result = test.results.find(r => r.id === resultId);
  if (!result) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className={`absolute top-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br ${result.gradient} opacity-10 blur-[120px]`} />
        <div className="absolute bottom-[-15%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-purple-900/15 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto w-full px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/tests/${testId}`}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg px-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            테스트 소개
          </Link>

          <Link
            href={`/tests/${testId}/quiz`}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg px-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            다시 하기
          </Link>
        </div>

        {/* Confetti-style celebration */}
        <div className="text-center mb-4 text-3xl" aria-hidden="true">
          🎉 ✨ 🎊
        </div>

        {/* Result card */}
        <ResultCard result={result} meta={test.meta} />

        {/* Other results teaser */}
        <div className="mt-6 rounded-2xl border border-white/8 bg-white/3 p-5">
          <h2 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
            <span aria-hidden="true">🔍</span>
            다른 결과 유형 ({test.results.length}가지)
          </h2>
          <div className="flex flex-wrap gap-2">
            {test.results.map((r) => (
              <Link
                key={r.id}
                href={`/tests/${testId}/results/${r.id}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                  r.id === resultId
                    ? `bg-gradient-to-r ${r.gradient} text-white font-semibold shadow-md`
                    : 'bg-white/8 text-white/50 border border-white/10 hover:bg-white/12 hover:text-white/70'
                }`}
              >
                <span aria-hidden="true">{r.emoji}</span>
                <span>{r.titleKo}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Share buttons */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
          <ShareButtons
            title={test.meta.titleKo}
            resultTitle={result.titleKo}
          />
        </div>

        {/* Retry / other tests */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href={`/tests/${testId}/quiz`}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r ${test.meta.gradient} text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            다시 하기
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/8 border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/12 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            다른 테스트
          </Link>
        </div>

        {/* Comments */}
        <div className="mt-8">
          <CommentSection
            testId={testId}
            resultTypeId={resultId}
            resultEmoji={result.emoji}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-white/20 pb-8">
          <p>마음 테스트 — 재미와 자기 이해를 위한 테스트입니다.</p>
          <p className="mt-1">전문 심리 진단을 대체하지 않습니다.</p>
        </div>
      </div>
    </div>
  );
}
