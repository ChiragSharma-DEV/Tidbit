import StitchApp from '@/components/stitch/StitchApp';

export const metadata = {
  title: 'Duolingo Skill Tree Roadmap · Tidbit',
  description: 'Interactive visual skill tree and topic roadmaps across your curated niches.',
};

export default function PathPage() {
  return <StitchApp initialTab="path" />;
}
