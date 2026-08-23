import StitchApp from '@/components/stitch/StitchApp';

export const metadata = {
  title: 'Learning Path · Tidbit',
  description: 'AI & Tech attention progression track.',
};

export default function PathPage() {
  return <StitchApp initialTab="path" />;
}

