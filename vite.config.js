import { defineConfig } from 'vite';

const SITE_URL = 'https://leandrosevero.com.br/';

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
