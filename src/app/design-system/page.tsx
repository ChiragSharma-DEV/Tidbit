import StitchApp from '@/components/stitch/StitchApp';

export const metadata = {
  title: 'Quiet Print Design System · Tidbit',
  description: 'Design guidelines, tokens, typography specimens, and component anatomy.',
};

export default function DesignSystemPage() {
  return <StitchApp initialTab="design-system" />;
}

