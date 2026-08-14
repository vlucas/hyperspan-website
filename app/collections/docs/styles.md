# Adding Styles & CSS

To add styles for a route, just import the CSS file directly into the route. Hyperspan will automatically split styles for each route and will add all imported styles in a route to the route's [layout](/docs/layouts) via the `hyperspanStyleTags` function. Additionally, any other file that is imported by a route that imports CSS (like layouts that import their own CSS) will also be added for that route.

Vite handles CSS during development and production builds, including Tailwind via `@tailwindcss/vite`.

## Example

Any `.css` file imported directly in TypeScript will be sent to the browser when a user visits that route:

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';
import { MarketingLayout } from '~/app/layouts/marketing-layout';
import '~/app/styles/hello-route.css';

export default createRoute().get((c) => {
  const content = html`<p>Hello from my route!</p>`;

  return MarketingLayout(c, { title: 'Hello Route', content });
});
```

## Automatic Route-Split CSS

**Each Hyperspan file-based route is processed independently**, so you can safely `import '~/my/styles.css'` in one route, and it will not be automatically added to any other route.

This also means you can co-locate styles with their own features, and import them from their own files, like a `lib/syntax-highlighter.ts` that imports `lib/syntax-highlighter.css`. Only routes that use and import the syntax highlighting file will also bundle the syntax highlighting CSS.

## Tailwind

Add the official Tailwind Vite plugin next to Hyperspan in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { hyperspan } from '@hyperspan/vite-plugin';

export default defineConfig({
  plugins: [tailwindcss(), ...hyperspan()],
});
```

Then import your CSS (with `@import 'tailwindcss'` or your Tailwind setup) from a layout or route. Vite compiles it; `hyperspanStyleTags()` injects the route's CSS into the page.

## Supported CSS Features

Because CSS goes through Vite, imports support:

- Nested CSS
- [Tailwind CSS](https://tailwindcss.com) via `@tailwindcss/vite`
- CSS Modules
- PostCSS plugins configured in Vite
- and other [Vite CSS](https://vite.dev/guide/features.html#css) features
