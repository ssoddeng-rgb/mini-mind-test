import { useState, useEffect } from 'react';
import type { ResultType } from '@/types/test';

export interface ResultStat {
  resultId: string;
  count: number;
  percentage: number;
}

const STORAGE_KEY = (testId: string) => `maum_stats_${testId}`;

function loadLocalStats(testId: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(testId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalResult(testId: string, resultId: string) {
  try {
    const stats = loadLocalStats(testId);
    stats[resultId] = (stats[resultId] ?? 0) + 1;
    localStorage.setItem(STORAGE_KEY(testId), JSON.stringify(stats));
  } catch {
    // ignore
  }
}

// Seed with realistic-looking base numbers so the chart isn't empty
function seedBaseStats(results: ResultType[]): Record<string, number> {
  const seeds: Record<string, number> = {};
  // Give each result a pseudo-random but consistent base count
  results.forEach((r, i) => {
    // deterministic based on result id length + index
    const base = 120 + (r.id.length * 13 + i * 37) % 180;
    seeds[r.id] = base;
  });
  return seeds;
}

export function useResultStats(
  testId: string,
  currentResultId: string,
  results: ResultType[],
) {
  const [stats, setStats] = useState<ResultStat[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Record this result visit
    saveLocalResult(testId, currentResultId);

    // Load and merge: seed + local
    const local = loadLocalStats(testId);
    const seed = seedBaseStats(results);

    const merged: Record<string, number> = {};
    results.forEach(r => {
      merged[r.id] = (seed[r.id] ?? 0) + (local[r.id] ?? 0);
    });

    const total = Object.values(merged).reduce((s, n) => s + n, 0);
    setTotalCount(total);

    const sorted = results
      .map(r => ({
        resultId: r.id,
        count: merged[r.id] ?? 0,
        percentage: total > 0 ? Math.round(((merged[r.id] ?? 0) / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    setStats(sorted);
  }, [testId, currentResultId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { stats, totalCount };
}
