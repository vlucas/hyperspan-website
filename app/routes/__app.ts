import { html } from '@hyperspan/html';

export default async function App(req: Request, children: any) {
  return html`
    <!doctype html>
    <html class="w-full h-full" lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>"
        />

        <title>Just JS. Streaming By Default.</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="w-full h-full bg-gray-200">
        <script>
          // Hypermill - Async content loader
          // Puts streamed content in its place immediately after it is added to the DOM
          const asyncContentObserver = new MutationObserver((list) => {
            const asyncContent = list
              .map((mutation) =>
                Array.from(mutation.addedNodes).find((node) => {
                  return node.id?.startsWith('async_') && node.id?.endsWith('_content');
                })
              )
              .filter((node) => node);

            asyncContent.forEach((el) => {
              try {
                // Also observe child nodes for nested async content
                asyncContentObserver.observe(el.content, { childList: true, subtree: true });

                const slotId = el.id.replace('_content', '');
                const slotEl = document.getElementById(slotId);

                if (slotEl) {
                  slotEl.replaceWith(el.content.cloneNode(true));
                  el.parentNode.removeChild(el);
                }
              } catch (e) {
                console.error(e);
              }
            });
          });
          asyncContentObserver.observe(document.body, { childList: true, subtree: true });
        </script>
        <div class="w-screen-lg m-auto p-10 bg-white" id="root">${children}</div>
      </body>
    </html>
  `;
}
