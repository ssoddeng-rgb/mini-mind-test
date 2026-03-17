import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getTest } from '@/lib/tests';

export const runtime = 'edge';

interface PageProps {
  params: Promise<{ resultId: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: PageProps
) {
  const { resultId } = await params;
  const { searchParams } = new URL(request.url);
  const testId = searchParams.get('testId') ?? 'mbti-classic';

  let result;
  let meta;
  try {
    const test = getTest(testId);
    result = test.results.find(r => r.id === resultId);
    meta = test.meta;
  } catch {
    // fallback
  }

  const titleKo = result?.titleKo ?? '마음 테스트 결과';
  const desc = result?.descriptionKo?.slice(0, 80) ?? '당신의 심리 유형을 알아보세요';
  const emoji = result?.emoji ?? '✨';
  const testTitle = meta?.titleKo ?? '마음 테스트';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0f0f1a 100%)',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
        }}
      >
        {/* Background orb */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Brand */}
        <div
          style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '24px',
            letterSpacing: '0.1em',
            display: 'flex',
          }}
        >
          마음 테스트 · {testTitle}
        </div>

        {/* Result emoji */}
        <div style={{ fontSize: '100px', marginBottom: '24px', display: 'flex' }}>
          {emoji}
        </div>

        {/* Result label */}
        <div
          style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '12px',
            display: 'flex',
          }}
        >
          당신의 결과
        </div>

        {/* Result title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: '20px',
            textAlign: 'center',
            lineHeight: 1.1,
            display: 'flex',
          }}
        >
          {titleKo}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
            display: 'flex',
          }}
        >
          {desc}...
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: '40px',
            padding: '14px 32px',
            borderRadius: '100px',
            background: 'linear-gradient(90deg, #7c3aed, #db2777)',
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
            display: 'flex',
          }}
        >
          나도 테스트 해보기 →
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
