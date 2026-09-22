import { CategoryGrid } from '@/features/marketing/CategoryGrid';
import { Hero } from '@/features/marketing/Hero';
import { LiveTicker } from '@/features/marketing/LiveTicker';

/** Page d'accueil : assemblage ordonné des sections marketing. */
export function HomePage() {
  return (
    <>
      <Hero />
      <LiveTicker />
      <CategoryGrid />
    </>
  );
}
