import { html } from '@/src/hyperspan/html';
import { hyperspanScriptTags, hyperspanStyleTags } from '@/src/hyperspan/assets';

export default function MarketingLayout({ title, content }: { title: string; content: any }) {
  return html`
    <!doctype html>
    <html class="w-full h-full" lang="en" data-theme="sunset">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />

        <title>${title}</title>
        ${hyperspanStyleTags()}
      </head>
      <body class="">
        ${hyperspanScriptTags()}
        <nav class="navbar bg-base-100 border-b border-base-300">
          <div class="flex-1">
            <ul class="menu menu-horizontal px-1">
              <li><a href="/">Hyperspan</a></li>
            </ul>
          </div>
          <div class="flex-1">
            <ul class="menu menu-horizontal px-1">
              <li><a href="/docs">Documentation</a></li>
            </ul>
          </div>
          <div class="flex-none">
            <ul class="menu menu-horizontal px-1">
              <li><a href="https://github.com/vlucas/hyperspan">GitHub</a></li>
            </ul>
          </div>
        </nav>
        <div class="h-full w-screen-lg m-auto" id="root">${content}</div>
        <footer class="p-8 mt-20">
          <p class="block my-20 text-sm">
            Created by <a href="https://www.vancelucas.com">Vance Lucas</a> &copy;
            ${new Date().getFullYear()}.
          </p>
        </footer>
      </body>
    </html>
  `;
}
