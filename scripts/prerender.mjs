/**
 * Prerender the home shell into dist/index.html.
 *
 * The app is a client-rendered React SPA. Without server markup, the largest
 * contentful paint can only happen after React has been downloaded, parsed and
 * executed, which pushes LCP far past the "good" threshold on mobile. This
 * script renders the same component tree at build time and injects it into the
 * HTML so the hero text paints with the document itself. `createRoot` replaces
 * the markup on the client, so interactivity is unchanged.
 *
 * Usage: node scripts/prerender.mjs (after `vite build` and the SSR build).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = resolve(projectRoot, 'dist/index.html');
const ssrEntryPath = resolve(projectRoot, 'dist-ssr/entry-server.js');

const { render } = await import(pathToFileURL(ssrEntryPath).href);

const markup = render()
  // React 19 hoists image preloads into the rendered tree; the document head
  // already preloads the hero logo, so drop the body-level duplicates.
  .replace(/<link rel="preload"[^>]*>/g, '');

const html = await readFile(htmlPath, 'utf8');
const marker = '<div id="root"></div>';

if (!html.includes(marker)) {
  console.error('[prerender] Could not find the empty #root marker in dist/index.html.');
  process.exit(1);
}

await writeFile(htmlPath, html.replace(marker, () => `<div id="root">${markup}</div>`), 'utf8');
console.log(`[prerender] Injected ${markup.length} characters of markup into dist/index.html.`);
