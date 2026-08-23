import StitchApp from '@/components/stitch/StitchApp';

export const metadata = {
  title: 'Tidbit · Attention Trainer & Calibrated Reader',
  description: 'Reclaim your attention span through calibrated, distraction-free reading, interactive learning paths, and stamina metrics.',
};

export default function HomePage() {
  return <StitchApp initialTab="feed" />;
}
