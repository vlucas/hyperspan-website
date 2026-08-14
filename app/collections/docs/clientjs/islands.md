# Islands Architecture

Hyperspan is a server-oriented framework, which means that **all JavaScript code that is sent to the client is explicitly opt-in**. Hyperspan uses [Islands Architecture](https://jasonformat.com/islands-architecture/) to make specific areas of the page interactive, while leaving the rest of the page static and server-rendered.

If you need an area on your page to have client interactivity, use one (or more) island plugins to render and hydrate framework components on the client.

## Available Island Plugins

Choose whichever framework fits your app:

- [React / Preact Islands](/docs/clientjs/react) with `@hyperspan/plugin-preact`
- [Vue Islands](/docs/clientjs/vue) with `@hyperspan/plugin-vue`
- [Svelte Islands](/docs/clientjs/svelte) with `@hyperspan/plugin-svelte`

You can use one plugin, or all three in the same project.

## Install and Register Plugins

Install the plugin(s) you want:

```shell
npm install @hyperspan/plugin-preact @hyperspan/plugin-vue @hyperspan/plugin-svelte
```

Then add them to your `hyperspan.config.ts` file:

```typescript
import { createConfig } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';
import { vuePlugin } from '@hyperspan/plugin-vue';
import { sveltePlugin } from '@hyperspan/plugin-svelte';

export default createConfig({
  appDir: './app',
  publicDir: './public',
  plugins: [preactPlugin(), vuePlugin(), sveltePlugin()],
});
```

The matching plugin must be installed and listed in `plugins` for that framework's island imports to work.

## Import Islands with Import Attributes

Mark a component as an island at import time with an import attribute. Then render it with `renderIsland` from `@hyperspan/framework`:

```typescript
import { html } from '@hyperspan/html';
import { createRoute, renderIsland } from '@hyperspan/framework';
import ReactCounter from '~/app/components/client-counter.tsx' with { island: 'preact' };
import VueCounter from '~/app/components/client-counter-vue.vue' with { island: 'vue' };
import SvelteCounter from '~/app/components/client-counter-svelte.svelte' with { island: 'svelte' };

export default createRoute().get(async () => {
  return html`
    <div>
      ${renderIsland(ReactCounter, { count: 5 })}
      ${await renderIsland(VueCounter, { count: 10 })}
      ${await renderIsland(SvelteCounter, { count: 15 })}
    </div>
  `;
});
```

Use `with { island: 'preact' }`, `with { island: 'vue' }`, or `with { island: 'svelte' }` to match the plugin listed in `hyperspan.config.ts`. Preact islands can be rendered synchronously. Vue and Svelte islands are async, so `await` them in an async route handler.

## SSR and Lazy Hydration

`renderIsland` accepts a third `options` argument:

| Option    | Type      | Default  | Description                                   |
| --------- | --------- | -------- | --------------------------------------------- |
| `ssr`     | `boolean` | `true`   | Disable with `false` to skip initial SSR HTML |
| `loading` | `string`  | `inline` | Use `'lazy'` to delay hydration until near viewport |

Examples:

- `renderIsland(Component, props, { ssr: false })`
- `await renderIsland(Component, props, { ssr: true, loading: 'lazy' })`

## Framework-Specific Guides

Use these pages for framework-specific setup and examples:

- [React / Preact Islands](/docs/clientjs/react)
- [Vue Islands](/docs/clientjs/vue)
- [Svelte Islands](/docs/clientjs/svelte)
