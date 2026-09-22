import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PublicLayout } from '@/app/layout/PublicLayout';
import { HomePage } from '@/app/pages/HomePage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';

/**
 * Découpage par route.
 *
 * L'accueil est chargé d'emblée : c'est l'écran d'action, celui dont dépend le
 * délai avant le premier geste utile. Les autres écrans, plus lourds et
 * atteints plus tard, sont chargés à la demande — la page de présentation de
 * l'offre comprise, la plus lourde et la moins visitée.
 */
const ReportPage = lazy(() => import('@/app/pages/ReportPage').then((m) => ({ default: m.ReportPage })));
const TrackingPage = lazy(() => import('@/app/pages/TrackingPage').then((m) => ({ default: m.TrackingPage })));
const MapPage = lazy(() => import('@/app/pages/MapPage').then((m) => ({ default: m.MapPage })));
const ConsolePage = lazy(() => import('@/app/pages/ConsolePage').then((m) => ({ default: m.ConsolePage })));
const SolutionPage = lazy(() => import('@/app/pages/SolutionPage').then((m) => ({ default: m.SolutionPage })));

function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <span className="flex items-center gap-2 text-[13px] text-muted">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Chargement…
      </span>
    </div>
  );
}

const deferred = (element: React.ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'signaler', element: deferred(<ReportPage />) },
      { path: 'suivi', element: deferred(<TrackingPage />) },
      { path: 'carte', element: deferred(<MapPage />) },
      { path: 'console', element: deferred(<ConsolePage />) },
      { path: 'solution', element: deferred(<SolutionPage />) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
