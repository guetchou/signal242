import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    // MapLibre dépasse à lui seul le seuil par défaut et ne peut être réduit.
    // Il est isolé dans son propre lot, chargé uniquement par les écrans
    // cartographiques : l'alerte n'apporterait plus d'information ici.
    chunkSizeWarningLimit: 1200,
  },
  server: { host: true, port: 5173 },
});
