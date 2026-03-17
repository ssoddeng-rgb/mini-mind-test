import type { TestMeta, Test } from '@/types/test';

// Static imports — Turbopack requires explicit import paths
import mbtiClassic from '@/data/tests/mbti-classic.json';
import attachmentStyle from '@/data/tests/attachment-style.json';
import loveLanguages from '@/data/tests/love-languages.json';
import bigFive from '@/data/tests/big-five.json';
import enneagram from '@/data/tests/enneagram.json';
import friendshipStyle from '@/data/tests/friendship-style.json';
import emotionalIntelligence from '@/data/tests/emotional-intelligence.json';
import stressStyle from '@/data/tests/stress-style.json';
import conflictStyle from '@/data/tests/conflict-style.json';
import communicationStyle from '@/data/tests/communication-style.json';
import selfEsteem from '@/data/tests/self-esteem.json';
import introvertSpectrum from '@/data/tests/introvert-spectrum.json';
import valuesTest from '@/data/tests/values-test.json';
import angerStyle from '@/data/tests/anger-style.json';
import empathyStyle from '@/data/tests/empathy-style.json';
import relationshipReadiness from '@/data/tests/relationship-readiness.json';

const testMap: Record<string, Test> = {
  'mbti-classic': mbtiClassic as unknown as Test,
  'attachment-style': attachmentStyle as unknown as Test,
  'love-languages': loveLanguages as unknown as Test,
  'big-five': bigFive as unknown as Test,
  'enneagram': enneagram as unknown as Test,
  'friendship-style': friendshipStyle as unknown as Test,
  'emotional-intelligence': emotionalIntelligence as unknown as Test,
  'stress-style': stressStyle as unknown as Test,
  'conflict-style': conflictStyle as unknown as Test,
  'communication-style': communicationStyle as unknown as Test,
  'self-esteem': selfEsteem as unknown as Test,
  'introvert-spectrum': introvertSpectrum as unknown as Test,
  'values-test': valuesTest as unknown as Test,
  'anger-style': angerStyle as unknown as Test,
  'empathy-style': empathyStyle as unknown as Test,
  'relationship-readiness': relationshipReadiness as unknown as Test,
};

const testOrder = [
  'mbti-classic',
  'attachment-style',
  'love-languages',
  'big-five',
  'enneagram',
  'friendship-style',
  'emotional-intelligence',
  'stress-style',
  'conflict-style',
  'communication-style',
  'self-esteem',
  'introvert-spectrum',
  'values-test',
  'anger-style',
  'empathy-style',
  'relationship-readiness',
];

export function getAllTests(): TestMeta[] {
  return testOrder.map(id => testMap[id].meta);
}

export function getTest(id: string): Test {
  const test = testMap[id];
  if (!test) throw new Error(`Test not found: ${id}`);
  return test;
}
