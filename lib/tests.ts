import type { TestMeta, Test } from '@/types/test';

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
import sleepChronotype from '@/data/tests/sleep-chronotype.json';
import moneyPersonality from '@/data/tests/money-personality.json';
import creativityStyle from '@/data/tests/creativity-style.json';
import leadershipStyle from '@/data/tests/leadership-style.json';
import learningStyle from '@/data/tests/learning-style.json';
import perfectionismType from '@/data/tests/perfectionism-type.json';
import optimismStyle from '@/data/tests/optimism-style.json';
import decisionMaking from '@/data/tests/decision-making.json';
import boundaryStyle from '@/data/tests/boundary-style.json';
import humorStyle from '@/data/tests/humor-style.json';
import workValues from '@/data/tests/work-values.json';
import resilienceType from '@/data/tests/resilience-type.json';
import emotionalExpression from '@/data/tests/emotional-expression.json';
import socialEnergy from '@/data/tests/social-energy.json';
import trustStyle from '@/data/tests/trust-style.json';
import changeAdaptation from '@/data/tests/change-adaptation.json';
import praiseReception from '@/data/tests/praise-reception.json';
import goalOrientation from '@/data/tests/goal-orientation.json';
import selfCareStyle from '@/data/tests/self-care-style.json';
import relationshipDependency from '@/data/tests/relationship-dependency.json';

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
  'sleep-chronotype': sleepChronotype as unknown as Test,
  'money-personality': moneyPersonality as unknown as Test,
  'creativity-style': creativityStyle as unknown as Test,
  'leadership-style': leadershipStyle as unknown as Test,
  'learning-style': learningStyle as unknown as Test,
  'perfectionism-type': perfectionismType as unknown as Test,
  'optimism-style': optimismStyle as unknown as Test,
  'decision-making': decisionMaking as unknown as Test,
  'boundary-style': boundaryStyle as unknown as Test,
  'humor-style': humorStyle as unknown as Test,
  'work-values': workValues as unknown as Test,
  'resilience-type': resilienceType as unknown as Test,
  'emotional-expression': emotionalExpression as unknown as Test,
  'social-energy': socialEnergy as unknown as Test,
  'trust-style': trustStyle as unknown as Test,
  'change-adaptation': changeAdaptation as unknown as Test,
  'praise-reception': praiseReception as unknown as Test,
  'goal-orientation': goalOrientation as unknown as Test,
  'self-care-style': selfCareStyle as unknown as Test,
  'relationship-dependency': relationshipDependency as unknown as Test,
};

const testOrder = [
  'mbti-classic','attachment-style','love-languages','big-five','enneagram','friendship-style',
  'emotional-intelligence','stress-style','conflict-style','communication-style',
  'self-esteem','introvert-spectrum','values-test','anger-style','empathy-style','relationship-readiness',
  'sleep-chronotype','money-personality','creativity-style','leadership-style','learning-style',
  'perfectionism-type','optimism-style','decision-making','boundary-style','humor-style',
  'work-values','resilience-type','emotional-expression','social-energy','trust-style',
  'change-adaptation','praise-reception','goal-orientation','self-care-style','relationship-dependency',
];

export function getAllTests(): TestMeta[] {
  return testOrder.map(id => testMap[id].meta);
}

export function getTest(id: string): Test {
  const test = testMap[id];
  if (!test) throw new Error(`Test not found: ${id}`);
  return test;
}
