'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonsProps {
  title: string;
  resultTitle: string;
  url?: string;
}

export default function ShareButtons({ title, resultTitle, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `나의 ${title} 결과는 "${resultTitle}"! 너도 해봐 👀`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareKakao = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://story.kakao.com/s/share?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank', 'width=600,height=400');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=600,height=400');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `마음 테스트 - ${title}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="w-full">
      <p className="text-center text-sm text-white/40 mb-4">결과를 친구에게 공유해 보세요</p>

      <div className="flex flex-wrap gap-3 justify-center">
        {/* Copy link */}
        <button
          onClick={copyLink}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 border border-white/10 text-white/70 hover:bg-white/12 hover:text-white transition-all duration-200 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          aria-label="링크 복사"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-green-400"
                aria-hidden="true"
              >
                ✓
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} aria-hidden="true">
                🔗
              </motion.span>
            )}
          </AnimatePresence>
          <span>{copied ? '복사됨!' : '링크 복사'}</span>
        </button>

        {/* Twitter/X */}
        <button
          onClick={shareTwitter}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 transition-all duration-200 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="트위터에 공유"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>트위터</span>
        </button>

        {/* Kakao */}
        <button
          onClick={shareKakao}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/20 transition-all duration-200 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          aria-label="카카오에 공유"
        >
          <span aria-hidden="true">💬</span>
          <span>카카오</span>
        </button>

        {/* Native share (mobile) */}
        {hasNativeShare && (
          <button
            onClick={shareNative}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all duration-200 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-label="더 많은 공유 옵션"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>공유</span>
          </button>
        )}
      </div>
    </div>
  );
}
