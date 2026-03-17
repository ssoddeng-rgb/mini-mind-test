import type { Test, UserAnswer, ScoringConfig } from '@/types/test';

export function computeResult(test: Test, answers: UserAnswer[]): string {
  const { scoring } = test;
  switch (scoring.method) {
    case 'mbti-dichotomy':
      return resolveMBTI(scoring, answers);
    case 'accumulation':
    case 'weighted-multi':
      return resolveAccumulation(test, answers);
    case 'scale':
      return resolveScale(test, answers);
    default:
      return resolveAccumulation(test, answers);
  }
}

export function tallyScores(answers: UserAnswer[]): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const answer of answers) {
    for (const [key, val] of Object.entries(answer.scores)) {
      tally[key] = (tally[key] ?? 0) + val;
    }
  }
  return tally;
}

function resolveMBTI(scoring: ScoringConfig, answers: UserAnswer[]): string {
  const tally = tallyScores(answers);
  const axes = scoring.axes ?? ['EI', 'SN', 'TF', 'JP'];
  let mbtiType = '';
  for (const axis of axes) {
    const [a, b] = axis.split('');
    const scoreA = tally[a] ?? 0;
    const scoreB = tally[b] ?? 0;
    mbtiType += scoreA >= scoreB ? a : b;
  }
  return mbtiType;
}

function resolveAccumulation(test: Test, answers: UserAnswer[]): string {
  const tally = tallyScores(answers);
  let topId = test.results[0].id;
  let topScore = -Infinity;
  for (const result of test.results) {
    const score = tally[result.id] ?? 0;
    if (score > topScore) {
      topScore = score;
      topId = result.id;
    }
  }
  return topId;
}

function resolveScale(test: Test, answers: UserAnswer[]): string {
  const tally = tallyScores(answers);
  const dims = test.scoring.dimensions ?? [];
  const maxDim = dims.reduce((best, dim) => {
    return (tally[dim] ?? 0) > (tally[best] ?? 0) ? dim : best;
  }, dims[0] ?? test.results[0].id);

  // Find result that matches this dominant dimension
  const match = test.results.find(r => r.id === maxDim || r.id.includes(maxDim));
  return match?.id ?? test.results[0].id;
}
