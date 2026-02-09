import { html } from '@hyperspan/html';
import { hyperspanScriptTags, hyperspanStyleTags } from '@hyperspan/framework/layout';
import { usedIcons } from '~/src/ui/icon';
import '~/app/styles/globals.css';

import type { Hyperspan as HS } from '@hyperspan/framework';

export default async function BaseLayout(c: HS.Context, { title, content }: { title: string; content: any }) {
  const fontIconsUrl = usedIcons.length > 0 ? `https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=${usedIcons.join(
    ','
  )}` : null;

  // Send preload headers for Google Fonts
  c.req.headers.set(
    'Link',
    [
      '<https://fonts.googleapis.com>; rel=preconnect; crossorigin',
      '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
      fontIconsUrl + '; rel=preload; as=style',
    ].join(', ')
  );

  return html`
    <!doctype html>
    <html class="w-full h-full" lang="en" data-theme="hyperspan">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⬇️</text></svg>"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
        ${fontIconsUrl ? html`<link rel="stylesheet" href="${fontIconsUrl}" />` : ''}

        <title>${title} | Importism</title>
        <script type="speculationrules">
          {
            "prerender": [{ "where": { "href_matches": "/*" }, "eagerness": "moderate" }],
            "prefetch": [{ "where": { "href_matches": "/*" }, "eagerness": "moderate" }]
          }
        </script>
        ${hyperspanStyleTags(c)}
        <script defer data-domain="importism.com" src="https://plausible.io/js/script.js"></script>
      </head>
      <body class="w-full h-full antialiased min-h-screen flex flex-col overflow-x-hidden">
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
    <header class="mb-8 bg-base-200 border-b border-base-300">
      <nav class="navbar">
        <div class="flex-1">
          <ul class="menu menu-horizontal px-1">
            <li><a class="brand" href="/">&lt;<span>Hyperspan</span>&gt;</a></li>
          </ul>
        </div>
        <div class="flex-1">
          <ul class="menu menu-horizontal px-1">
            <li><a href="/docs">Documentation</a></li>
            <li>
              <details>
                <summary>Examples</summary>
                <ul class="p-2 w-64">
                  <li><a href="/examples/streaming">Streaming Example</a></li>
                  <li><a href="/examples/dynamic-islands">Dynamic Islands Example</a></li>
                  <li><a href="/examples/actions">Actions Example</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        <div class="flex-none">
          <ul class="menu menu-horizontal px-1">
            <li><a href="https://github.com/vlucas/hyperspan">GitHub</a></li>
          </ul>
        </div>
      </nav>
    </header>
  `;
}

/**
 * Footer
 */
function Footer() {
  return html`
    <!-- Footer -->
    <footer class="mt-8 w-full bg-base-200 border-t border-base-300 py-12">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-8">
            <div class="max-w-xl">
                <h4 class="text-xl font-bold mb-4">Hyperspan</h4>
                <p class="">Web Framework for Dynamic High-Performance Sites and Apps.</p>
            </div>
            <div class="flex gap-12 text-md">
                <div class="flex flex-col gap-3">
                    <span class="font-semibold">Documentation</span>
                    <a href="/docs">Get Started</a>
                    <a href="/docs/philosophy">Philosophy</a>
                    <a href="/docs/install">Installation</a>
                </div>
                <div class="flex flex-col gap-3">
                    <span class="font-semibold">Examples</span>
                    <a href="/examples/streaming">Streaming Example</a>
                    <a href="/examples/dynamic-islands">Dynamic Islands Example</a>
                    <a href="/examples/actions">Actions Example</a>
                </div>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-6 mt-12 text-center text-base-content text-sm">
            Created by <a href="https://www.vancelucas.com">Vance Lucas</a> of <a href="https://www.infiniterectangles.com">Infinite Rectangles</a> &copy;
              ${new Date().getFullYear()}.
        </div>
    </footer>
  `;
}