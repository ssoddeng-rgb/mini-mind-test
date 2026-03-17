import { getAllTests } from '@/lib/tests';
import LandingClient from '@/components/landing/LandingClient';

export default function HomePage() {
  const tests = getAllTests();
  return <LandingClient tests={tests} />;
}
