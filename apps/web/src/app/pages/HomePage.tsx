import { Benchmark } from '@/features/marketing/Benchmark';
import { CategoryGrid } from '@/features/marketing/CategoryGrid';
import { FinalCta } from '@/features/marketing/FinalCta';
import { Hero } from '@/features/marketing/Hero';
import { LiveTicker } from '@/features/marketing/LiveTicker';
import { NoiseShowcase } from '@/features/marketing/NoiseShowcase';
import { Pricing } from '@/features/marketing/Pricing';
import { Segments } from '@/features/marketing/Segments';
import { TrustSection } from '@/features/marketing/TrustSection';
import { ValueChain } from '@/features/marketing/ValueChain';

/**
 * Page d'accueil.
 *
 * Simple assemblage ordonné : la narration commerciale est portée par l'ordre
 * des sections, chacune restant autonome et réutilisable.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <LiveTicker />
      <CategoryGrid />
      <ValueChain />
      <NoiseShowcase />
      <Segments />
      <Benchmark />
      <TrustSection />
      <Pricing />
      <FinalCta />
    </>
  );
}
