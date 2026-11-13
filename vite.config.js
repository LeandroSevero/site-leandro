import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

const SITE_URL = 'https://leandrosevero.com.br/';

// Versão (package.json) e dados do deploy (variáveis de sistema da Vercel no build).
// Em build local, sem VERCEL_GIT_COMMIT_SHA, o rodapé mostra "dev".
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || '';
const repo = process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
  ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
  : '';
const buildInfo = {
  __APP_VERSION__: JSON.stringify(pkg.version),
  __BUILD_COMMIT__: JSON.stringify(commitSha),
  __BUILD_DATE__: JSON.stringify(commitSha ? new Date().toISOString() : ''),
  __BUILD_REPO__: JSON.stringify(repo),
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
