'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  nickname: string;
  content: string;
  resultTypeId: string;
  createdAt: string;
  emoji: string;
}

interface CommentSectionProps {
  testId: string;
  resultTypeId: string;
  resultEmoji: string;
}

const NICKNAME_EMOJIS = ['🐱', '🐶', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🦄', '🐸'];

function getRandomEmoji() {
  return NICKNAME_EMOJIS[Math.floor(Math.random() * NICKNAME_EMOJIS.length)];
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function CommentSection({ testId, resultTypeId, resultEmoji }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?testId=${testId}&resultTypeId=${resultTypeId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments ?? []);
      }
    } catch {
      // Supabase not configured - show empty state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [testId, resultTypeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname.trim() || !content.trim()) {
      setError('닉네임과 내용을 모두 입력해주세요.');
      return;
    }
    if (content.trim().length < 5) {
      setError('댓글은 최소 5자 이상 입력해주세요.');
      return;
    }
    if (content.trim().length > 300) {
      setError('댓글은 300자를 넘을 수 없습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          resultTypeId,
          nickname: nickname.trim(),
          content: content.trim(),
          emoji: getRandomEmoji(),
        }),
      });

      if (res.ok) {
        setNickname('');
        setContent('');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
        await fetchComments();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? '댓글 등록에 실패했습니다.');
      }
    } catch {
      setError('댓글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="comments-heading" className="w-full">
      <h2 id="comments-heading" className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span aria-hidden="true">💬</span>
        같은 결과의 사람들
        {comments.length > 0 && (
          <span className="text-sm font-normal text-white/40">({comments.length}개)</span>
        )}
      </h2>

      {/* Comment form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 mb-6"
        aria-label="댓글 작성"
        noValidate
      >
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label htmlFor="comment-nickname" className="sr-only">닉네임</label>
            <input
              id="comment-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 (최대 10자)"
              maxLength={10}
              className="w-full px-4 py-2.5 rounded-xl bg-white/8 border border-white/10 text-white placeholder-white/30 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent"
              aria-required="true"
            />
          </div>
          <div className="w-12 flex items-center justify-center text-2xl" aria-hidden="true">
            {resultEmoji}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="comment-content" className="sr-only">댓글 내용</label>
          <textarea
            id="comment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이 결과에 대한 생각을 공유해 보세요..."
            rows={3}
            maxLength={300}
            className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white placeholder-white/30 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent"
            aria-required="true"
            aria-describedby={error ? 'comment-error' : undefined}
          />
          <div className="flex justify-between mt-1">
            <AnimatePresence>
              {error && (
                <motion.p
                  id="comment-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-400"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <span className="text-xs text-white/30 ml-auto">{content.length}/300</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          {isSubmitting ? '등록 중...' : submitSuccess ? '등록됨!' : '댓글 남기기'}
        </button>
      </form>

      {/* Comments list */}
      {isLoading ? (
        <div className="text-center py-8 text-white/30 text-sm">불러오는 중...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2" aria-hidden="true">💭</div>
          <p className="text-white/40 text-sm">아직 댓글이 없어요. 첫 번째 댓글을 남겨보세요!</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="댓글 목록">
          <AnimatePresence>
            {comments.map((comment, idx) => (
              <motion.li
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-white/8 bg-white/3 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl" aria-hidden="true">{comment.emoji}</span>
                  <span className="font-semibold text-white/80 text-sm">{comment.nickname}</span>
                  <span className="text-xs text-white/30 ml-auto" aria-label={`작성 시간: ${comment.createdAt}`}>
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{comment.content}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
