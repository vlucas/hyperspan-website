import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';
import { highlightTS } from '@/src/lib/syntax-highlighter';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Layouts</h1>
      <p>
        The Hyperspan framework
        <strong>does not have a built-in layout system</strong> where layouts get automatically
        applied to routes. However, the recommended way to use layouts is to place them in the
        <code>app/layouts</code> directory and export default a function to define them.
      </p>

      <p>For example, you can create a <code>app/layouts/main-layout.ts</code> file like this:</p>
      ${highlightTS(`import { html } from '@hyperspan/html';
import { hyperspanScriptTags, hyperspanStyleTags } from '@hyperspan/framework/assets';

export type MainLayoutProps = { content: any, title: string };
export default function MainLayout({ content, title }: MainLayoutProps) {
  return html\`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>\${title}</title>
        \${hyperspanStyleTags()}
      </head>
      <body>
        \${hyperspanScriptTags()}
        <main>
          \${content}
        </main>
      </body>
    </html>
  \`;
}`)}

      <div class="alert alert-info alert-outline">
        <span
          >Note: The <code>hyperspanStyleTags()</code> and
          <code>hyperspanScriptTags()</code> functions are used to inject the Hyperspan styles and
          scripts into the page. Don't forget to use them in your layouts to ensure that the styles
          and scripts are loaded properly!
        </span>
      </div>

      <p>Then, you can use the layout in your <code>app/routes/index.ts</code> file like this:</p>
      ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';
import MainLayout from '@/app/layouts/main-layout';

export default createRoute(() => {
  const content = html\`
    <h1>Hello, world!</h1>
    <p>Some page content here</p>
  \`;

  return MainLayout({
    title: 'Home',
    content,
  });
});`)}

      <p>
        In this example, layouts are just normal functions that return HTML. You can use them in any
        route you like, and you can pass any data you want to the layout. All of it is rendered on
        the server, so you don't have to worry about data serialization either.
      </p>

      <h2>Why No Built-In Layout System?</h2>
      <p>
        Simply put, Hyperspan aims to be as simple as possible, and intentionally avoids adding any
        additional complexity or conceptual overhead to the framework. Calling a layout function and
        passing whatever data you want to is as simple as it gets, and does not introduce any new
        conceptual overhead.
      </p>
      <p>
        Since routes often require the same data in both the layout and the page itself &mdash; meta
        tags, titles, and page headings &mdash; any built-in layout system needs to be able to
        handle data passing well. If your layouts and routes are in separate files, this can be
        tricky, and necessitates the creation of novel solutions to a problem the framework itself
        creates. In a React framework like Next.js, having to use React
        <a
          href="https://nextjs.org/docs/app/getting-started/metadata-and-og-images#generated-metadata"
          rel="nofollow noopener noreferrer"
          ><code>cache()</code></a
        >
        to avoid duplicate data fetching in both your route and layout is a good example of this.
      </p>

      <p>
        Note: There <em>may</em> be some kind of built-in layout system in the future &mdash; it is
        not completely off the table &mdash; but if it happens, it will be very simple and
        straightforward.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Layouts',
    content,
  });
});
