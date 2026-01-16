# Layouts

The Hyperspan framework **does not have a built-in layout system** where layouts get automatically applied to routes. However, the recommended way to use layouts is to place them in the `app/layouts` directory and export default a function to define them.

For example, you can create a `app/layouts/main-layout.ts` file like this:

```typescript
import { html } from '@hyperspan/html';
import { hyperspanScriptTags, hyperspanStyleTags } from '@hyperspan/framework/layout';
import type { Hyperspan as HS } from '@hyperspan/framework';

export type MainLayoutProps = { content: any; title: string };
export default function MainLayout(c: HS.Context, { content, title }: MainLayoutProps) {
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        ${hyperspanStyleTags(c)}
      </head>
      <body>
        ${hyperspanScriptTags()}
        <main>${content}</main>
      </body>
    </html>`;
}
```

> **Note:** The `hyperspanStyleTags(c)` and `hyperspanScriptTags()` functions are used to inject the Hyperspan styles and scripts into the page. Don't forget to use them in your layouts to ensure that the styles and scripts are loaded properly!

Then, you can use the layout in your `app/routes/index.ts` file like this:

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';
import MainLayout from '@/app/layouts/main-layout';

export default createRoute().get((c) => {
  const content = html`
    <h1>Hello, world!</h1>
    <p>Some page content here</p>
  `;

  return MainLayout(c, {
    title: 'Home',
    content,
  });
});
```

In this example, layouts are just normal functions that return HTML. You can use them in any route you like, and you can pass any data you want to the layout. All of it is rendered on the server, so you don't have to worry about data serialization either.

## Why No Built-In Layout System?

Simply put, Hyperspan aims to be as simple as possible, and intentionally avoids adding any additional complexity or conceptual overhead to the framework. Calling a layout function and passing whatever data you want to is as simple as it gets, and does not introduce any new conceptual overhead.

Since routes often require the same data in both the layout and the page itself — meta tags, titles, and page headings — any built-in layout system needs to be able to handle data passing well. If your layouts and routes are in separate files, this can be tricky, and necessitates the creation of novel solutions to a problem the framework itself creates. In a React framework like Next.js, having to use React [\`cache()\`](https://nextjs.org/docs/app/getting-started/metadata-and-og-images#generated-metadata) to avoid duplicate data fetching in both your route and layout is a good example of this.

Note: There _may_ be some kind of built-in layout system in the future — it is not completely off the table — but if it happens, it will be very simple and straightforward.
