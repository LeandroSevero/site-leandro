import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

const SITE_URL = 'https://leandrosevero.com.br/';

// Versão (package.json) e data do deploy. A data só é gravada em builds da plataforma de deploy
// (variável VERCEL presente); em build local o rodapé mostra "dev".
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const isDeployBuild = Boolean(process.env.VERCEL);
const buildInfo = {
  __APP_VERSION__: JSON.stringify(pkg.version),
  __BUILD_DATE__: JSON.stringify(isDeployBuild ? new Date().toISOString() : ''),
};

// Gera dist/sitemap.xml a cada build, com <lastmod> = data do build (fuso de Brasília).
const sitemapPlugin = () => ({
  name: 'sitemap-lastmod',
  apply: 'build',
  generateBundle() {
    const lastmod = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date()); // AAAA-MM-DD
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml });
  },
});

export default defineConfig({
  plugins: [sitemapPlugin()],
  define: buildInfo,
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
});
