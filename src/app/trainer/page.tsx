import StitchApp from '@/components/stitch/StitchApp';

export const metadata = {
  title: 'Tidbit Attention Trainer',
  description: 'Reclaim your attention span through calibrated, distraction-free reading.',
};

export default function TrainerPage() {
  return <StitchApp initialTab="feed" />;
}

