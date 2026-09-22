import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/**
 * Marquage du mode démonstration dans le document servi.
 *
 * Tant que les signalements ne parviennent à personne, le site ne doit pas
 * être référencé : une recherche « signaler un nid-de-poule Brazzaville »
 * conduisant à un guichet fictif ferait plus de mal que l'absence de service.
 * La directive d'indexation et le titre de l'onglet suivent donc la même
 * variable que le bandeau d'avertissement — un seul réglage, aucun oubli
 * possible d'un côté ou de l'autre.
 */
function demoModePlugin(isDemo: boolean): Plugin {
  return {
    name: 'signal242-demo-mode',
    transformIndexHtml(html) {
      if (!isDemo) return html;
      return html
        .replace(
          '<meta charset="UTF-8" />',
          '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex, nofollow" />',
        )
        .replace(
          /<title>(.*?)<\/title>/,
          '<title>Démonstration · $1</title>',
        );
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: isDemo
          ? [
              '# Version de démonstration : les signalements ne sont transmis à aucun',
              '# service. Le référencement est refusé tant que ce site ne constitue pas',
              '# un guichet réel.',
              'User-agent: *',
              'Disallow: /',
              '',
            ].join('\n')
          : ['User-agent: *', 'Allow: /', ''].join('\n'),
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Le mode démonstration est actif par défaut : l'oubli doit pencher du côté
  // sûr, celui où le site s'annonce comme une démonstration.
  const isDemo = process.env['VITE_DEMO_MODE'] !== 'false';

  return {
    plugins: [react(), tailwindcss(), demoModePlugin(isDemo)],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    define: {
      // Rend la valeur disponible au code client, y compris lorsque la
      // variable n'est pas déclarée dans un fichier .env.
      'import.meta.env.VITE_DEMO_MODE': JSON.stringify(isDemo ? 'true' : 'false'),
    },
    build: {
      // MapLibre dépasse à lui seul le seuil par défaut et ne peut être réduit.
      // Il est isolé dans son propre lot, chargé uniquement par les écrans
      // cartographiques : l'alerte n'apporterait plus d'information ici.
      chunkSizeWarningLimit: 1200,
      sourcemap: mode !== 'production',
    },
    server: { host: true, port: 5173 },
  };
});
