import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'

/**
 * Inline Critical CSS Plugin
 *
 * In production builds:
 * 1. Reads src/critical.css and minifies whitespace.
 * 2. Injects it as an inline <style> block in <head> BEFORE any JS.
 * 3. Converts the emitted Vite CSS <link rel="stylesheet"> tags to
 *    async non-blocking loaders: media="print" onload="this.media='all'"
 *    with a <noscript> fallback — eliminating render-blocking CSS.
 *
 * Result: First paint uses only the inlined critical tokens.
 *         Full styles load after paint without blocking LCP/FCP.
 */
function inlineCriticalCssPlugin(): Plugin {
  const criticalCssPath = resolve(import.meta.dirname, 'src/critical.css')

  return {
    name: 'festiya-inline-critical-css',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html: string): string {
        // 1. Read and minify critical CSS
        let criticalCss = ''
        try {
          const raw = readFileSync(criticalCssPath, 'utf-8')
          // Minify: strip comments, collapse whitespace
          criticalCss = raw
            .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
            .replace(/\s*\n\s*/g, '\n')        // collapse blank lines
            .replace(/\s{2,}/g, ' ')           // collapse multiple spaces
            .replace(/\n/g, ' ')               // flatten to single line
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*:\s*/g, ':')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*,\s*/g, ',')
            .trim()
        } catch {
          // gracefully skip if file is missing
        }

        // 2. Make all Vite-emitted CSS links non-blocking
        //    Pattern: <link rel="stylesheet" crossorigin href="/assets/index-XXX.css">
        let transformed = html.replace(
          /<link rel="stylesheet"([^>]*?)href="([^"]+\.css)"([^>]*)>/g,
          (_match, before, href, after) => {
            const allAttrs = (before + after).trim()
            return [
              `<link rel="preload" as="style" href="${href}"${allAttrs ? ' ' + allAttrs : ''}>`,
              `<link rel="stylesheet" href="${href}"${allAttrs ? ' ' + allAttrs : ''} media="print" onload="this.media='all'">`,
              `<noscript><link rel="stylesheet" href="${href}"${allAttrs ? ' ' + allAttrs : ''}></noscript>`,
            ].join('\n    ')
          }
        )

        // 3. Inject inline critical CSS right after the charset declaration so
        //    the charset still appears within the first 1024 bytes of the document.
        if (criticalCss) {
          const styleTag = `<style id="festiya-critical">${criticalCss}</style>`
          transformed = transformed.replace(
            /(<meta charset="[^"]+"\s*\/?>)/i,
            `$1\n  ${styleTag}`
          )
          // Fallback for documents that declare the charset elsewhere.
          if (!transformed.includes('id="festiya-critical"')) {
            transformed = transformed.replace('<head>', `<head>\n  ${styleTag}`)
          }
        }

        return transformed
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), inlineCriticalCssPlugin()],
  build: {
    // Minify CSS aggressively
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three')) {
            return 'vendor-three'
          }
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
