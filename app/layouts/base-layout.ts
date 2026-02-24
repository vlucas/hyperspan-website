import { html } from '@hyperspan/html';
import { hyperspanScriptTags, hyperspanStyleTags } from '@hyperspan/framework/layout';
import { Icon, usedIcons } from '~/src/ui/icon';
import '~/app/styles/globals.css';

import type { Hyperspan as HS } from '@hyperspan/framework';

export type BaseLayoutProps = { title: string; content: any, meta?: { description?: string } };
export default async function BaseLayout(c: HS.Context, { title, content, meta }: BaseLayoutProps) {
  const fontIconsUrl =
    usedIcons.length > 0
      ? `https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=${usedIcons.join(
        ','
      )}`
      : null;

  // Send preload headers for Google Fonts
  c.req.headers.set(
    'Link',
    [
      '<https://fonts.googleapis.com>; rel=preconnect; crossorigin',
      '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
      `<${fontIconsUrl}>; rel=preload; as=style`,
    ].join(', ')
  );

  return html`
    <!doctype html>
    <html class="w-full h-full" lang="en" data-theme="hyperspan">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${meta?.description && html`<meta name="description" content="${meta.description}" />`}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⬇️</text></svg>"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        ${fontIconsUrl ? html`<link rel="stylesheet" href="${fontIconsUrl}" />` : ''}

        <title>${title}</title>
        <script type="speculationrules">
          {
            "prerender": [{ "where": { "href_matches": "/*" }, "eagerness": "moderate" }],
            "prefetch": [{ "where": { "href_matches": "/*" }, "eagerness": "moderate" }]
          }
        </script>
        ${hyperspanStyleTags(c)}
        <script defer data-domain="hyperspan.dev" src="https://plausible.io/js/script.js"></script>
      </head>
      <body class="w-full h-full antialiased">
        <div class="min-h-screen font-sans selection:bg-brand-orange selection:text-brand-dark">

        <!-- Background Texture -->
        <div class="fixed inset-0 bg-grid pointer-events-none opacity-40"></div>
        <div class="fixed inset-0 bg-gradient-to-b from-transparent via-brand-dark to-brand-dark pointer-events-none"></div>
        ${hyperspanScriptTags()}
        
        ${Navbar()}  
        ${content}
        ${Footer()}
      </body>
    </html>
  `;
}

/**
 * Navigation bar
 */
function Navbar() {
  return html`
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 border-b border-brand-border bg-brand-dark/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" id="nav-logo" class="">
          <span class="font-mono font-bold tracking-tighter text-xl text-white"
            >&lt;Hyperspan /&gt;</span
          >
        </a>

        <div class="hidden md:flex items-center gap-8">
          <a
            href="/docs"
            id="nav-link-docs"
            class="text-sm link"
            >Documentation</a
          >
          <a
            href="/examples"
            id="nav-link-examples"
            class="text-sm link"
            >Examples</a
          >
        </div>

        <a
          href="https://github.com/vlucas/hyperspan"
          id="nav-cta"
          class="hidden sm:inline-flex items-center h-9 px-4 rounded border border-white/20 hover:border-brand-orange hover:text-brand-orange transition-all text-sm font-medium"
        >
          ${Icon('code', 'text-lg')}
            GitHub
        </a>
      </div>
    </nav>
  `;
}

/**
 * Footer
 */
function Footer() {
  return html`
    <!-- Footer -->
    <footer class="border-t border-brand-border py-20 bg-brand-dark relative z-10">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-4 gap-12 mb-16">
          <div class="col-span-2">
            <span class="font-mono font-bold text-lg">&lt;Hyperspan /&gt;</span>
            <p class="text-zinc-400 max-w-sm mb-6">
              Web Framework for Dynamic High-Performance Sites and Apps
            </p>
            <div class="flex gap-4">
              <a
                href="#"
                id="footer-social-github"
                class="text-zinc-400 hover:text-white transition-colors"
              >
                ${Icon('code', 'text-2xl')}
              </a>
              <a
                href="#"
                id="footer-social-twitter"
                class="text-zinc-400 hover:text-white transition-colors"
              >
                ${Icon('share', 'text-2xl')}
              </a>
            </div>
          </div>
          <div>
            <h3 class="font-bold mb-6 uppercase tracking-wider text-xs text-zinc-300 font-mono">
              Documentation
            </h3>
            <ul class="space-y-4 text-sm">
              <li><a href="/docs" class="link">Get Started</a></li>
              <li>
                <a href="/docs/philosophy" class="link">Philosophy</a>
              </li>
              <li>
                <a href="/docs/install" class="link">Installation</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold mb-6 uppercase tracking-wider text-xs text-zinc-300 font-mono">
              Examples
            </h3>
            <ul class="space-y-4 text-sm">
              <li>
                <a href="/examples/streaming" class="link"
                  >Streaming Example</a
                >
              </li>
              <li>
                <a href="/examples/dynamic-islands" class="link"
                  >Dynamic Islands Example</a
                >
              </li>
              <li>
                <a href="/examples/actions" class="link"
                  >Actions Example</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-brand-border text-sm text-zinc-400 font-mono"
        >
          <p>© ${new Date().getFullYear()} Hyperspan Open Source Project. All rights reserved.</p>
          <p>
            Created by <a class="link" href="https://www.vancelucas.com">Vance Lucas</a> of
            <a class="link" href="https://www.infiniterectangles.com">Infinite Rectangles</a>
          </p>
        </div>
      </div>
    </footer>
  `;
}
