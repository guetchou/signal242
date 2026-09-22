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
 * Présentation de l'offre, destinée aux décideurs publics et privés.
 *
 * Séparée de l'accueil : ce discours s'adresse à quelques dizaines de
 * visiteurs par an, quand l'accueil en sert plusieurs milliers qui viennent
 * agir. C'est ici, et seulement ici, que l'application assume un registre
 * visuel de démonstration commerciale.
 */
export function SolutionPage() {
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
