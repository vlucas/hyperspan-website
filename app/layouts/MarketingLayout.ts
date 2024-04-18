import { html } from '@hyperspan/html';
import { HyperspanScripts, HyperspanStyles } from '@hyperspan/document';

export default async function MarketingLayout({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  return html`
    <!doctype html>
    <html class="w-full h-full" lang="en" data-theme="dark">
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
          href="https://fonts.googleapis.com/css2?Inconsolata:wght@200..900&display=swap"
          rel="stylesheet"
        />

        <title>${title}</title>
        ${HyperspanStyles()}
      </head>
      <body class="w-full h-full">
        ${HyperspanScripts()}
        <div class="navbar bg-base-100">
          <div class="flex-1">
            <a class="btn btn-ghost text-xl" href="/">Hyperspan Demo</a>
          </div>
          <div class="flex-none">
            <ul class="menu menu-horizontal px-1">
              <li><a href="/components">Components</a></li>
              <li><a href="/srp">SRP + Map Example</a></li>
              <li>
                <details>
                  <summary>User Menu</summary>
                  <ul class="p-2 bg-base-100 rounded-t-none">
                    <li><a>Link 1</a></li>
                    <li><a>Link 2</a></li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        </div>
        <div class="h-full w-screen-lg m-auto p-10" id="root">${children}</div>
      </body>
    </html>
  `;
}
