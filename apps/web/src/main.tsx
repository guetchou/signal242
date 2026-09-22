import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ServicesProvider } from '@/app/providers/ServicesProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { router } from '@/app/router';
import './styles/global.css';

const container = document.getElementById('root');
if (!container) throw new Error('Élément racine introuvable.');

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <ServicesProvider>
        <RouterProvider router={router} />
      </ServicesProvider>
    </ThemeProvider>
  </StrictMode>,
);
