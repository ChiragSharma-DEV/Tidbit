import StitchApp from '@/components/stitch/StitchApp';

export const metadata = {
  title: 'Your Feed · Tidbit',
  description: 'Calibrated daily reading stream with progressive attention rulers.',
};

export default function FeedPage() {
  return <StitchApp initialTab="feed" />;
}

