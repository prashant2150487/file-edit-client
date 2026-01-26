import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://doxius.com";
const lastmod = new Date().toISOString().split('T')[0];

const pages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/jpg-to-png", priority: "0.9", changefreq: "monthly" },
  { loc: "/png-to-jpg", priority: "0.9", changefreq: "monthly" },
  { loc: "/compress-image", priority: "0.8", changefreq: "monthly" },
  { loc: "/resize-image", priority: "0.8", changefreq: "monthly" },
  { loc: "/jpg-to-pdf", priority: "0.9", changefreq: "monthly" },
  { loc: "/word-to-pdf", priority: "0.9", changefreq: "monthly" },
  { loc: "/pdf-to-word", priority: "0.9", changefreq: "monthly" },
  { loc: "/pdf-to-jpg", priority: "0.9", changefreq: "monthly" },
  { loc: "/merge-pdf", priority: "0.9", changefreq: "monthly" },
  { loc: "/split-pdf", priority: "0.9", changefreq: "monthly" },
  { loc: "/compress-pdf", priority: "0.8", changefreq: "monthly" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (page) => `  <url>
    <loc>${DOMAIN}${page.loc === "/" ? "" : page.loc}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);
console.log(`Sitemap updated successfully in ${sitemapPath} with lastmod: ${lastmod}`);
