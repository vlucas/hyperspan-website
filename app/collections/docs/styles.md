# Adding Styles & CSS

To add styles for a route, just import the CSS file directly into the route. Hyperspan will automatically split styles for each route and will add all imported styles in a route to the route's [layout](/docs/layouts) via the `hyperspanStyleTags` function. Additoinally, any other file that is imported by route that imports CSS (like layouts that import their own CSS) will also be added for that route.

## Example

Any .css file imported directly in TypeScript will be minified and sent to the browser when a user visits that route:

```typescript
import { createRoute } from '@hyperspan/framework';
import { MarketingLayout } from '~/app/layouts/marketing-layout';
import '~/app/styles/hello-route.css';

export default createRoute().get((c) => {
  const content = html`<p>Hello from my route!</p>`;

  return MarketingLayout(c, { title: 'Hello Route' });
});
```

## Automatic Route-Split CSS

**Each Hyperspan file-based route is processed independently**, so you can safely `import '~/my/styles.css'` in one route, and it will not be automatically added to any other route.

This also means you can co-locate styles with their own features, and import them from their own files, like a `lib/syntax-highligher.ts` that imports `lib/syntax-highligher.css`. Only routes that use and import the syntax highlighing file will also bundle the syntax highlighting CSS.

## Supported CSS Features

Hyperspan uses [Bun CSS](https://bun.com/docs/bundler/css) for the runtime, which means all CSS imports in Hyperspan have full support for:

- Nested CSS
- [Tailwind CSS](https://tailwindcss.com) (via a plugin that Hyperspan manages)
- Color mixing functions
- Math functions
- Media Query ranges
- CSS Modules & Composition
- and more - see [Bun CSS](https://bun.com/docs/bundler/css) docs
