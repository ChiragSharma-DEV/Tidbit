import StitchApp from '@/components/stitch/StitchApp';

export const metadata = {
  title: 'Library · Tidbit',
  description: 'Your saved essays, highlighted passages, and reading progress.',
};

export default function LibraryPage() {
  return <StitchApp initialTab="library" />;
}

