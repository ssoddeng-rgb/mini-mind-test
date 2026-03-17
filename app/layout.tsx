import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GlobalNav from '@/components/GlobalNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '마음 테스트 | 나를 알아가는 심리 테스트',
  description: '재미있는 심리 테스트로 나 자신을 더 잘 알아보세요. MBTI, 애착 유형, 사랑의 언어 등 다양한 테스트를 즐겨보세요.',
  openGraph: {
    title: '마음 테스트',
    description: '나를 알아가는 심리 테스트',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body
        className={`${inter.className} min-h-screen text-white`}
        style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0f0f1a 100%)' }}
      >
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}
