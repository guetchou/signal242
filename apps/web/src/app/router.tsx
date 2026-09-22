import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/app/layout/PublicLayout';
import { HomePage } from '@/app/pages/HomePage';
import { ReportPage } from '@/app/pages/ReportPage';
import { TrackingPage } from '@/app/pages/TrackingPage';
import { MapPage } from '@/app/pages/MapPage';
import { ConsolePage } from '@/app/pages/ConsolePage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'signaler', element: <ReportPage /> },
      { path: 'suivi', element: <TrackingPage /> },
      { path: 'carte', element: <MapPage /> },
      { path: 'console', element: <ConsolePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
