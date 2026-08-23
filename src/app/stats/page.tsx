import StitchApp from '@/components/stitch/StitchApp';

export const metadata = {
  title: 'Stamina Stats · Tidbit',
  description: 'Track your attention depth, unbroken reading streaks, and mastered contexts.',
};

export default function StatsPage() {
  return <StitchApp initialTab="stats" />;
}

