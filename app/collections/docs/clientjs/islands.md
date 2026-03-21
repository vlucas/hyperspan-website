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
bun add @hyperspan/plugin-preact @hyperspan/plugin-vue @hyperspan/plugin-svelte
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

After installing a plugin, imports for that framework's component files are prepared for island rendering.

## Island Render Functions

Each plugin provides its own island render function:

- `renderPreactIsland` from `@hyperspan/plugin-preact`
- `renderVueIsland` from `@hyperspan/plugin-vue`
- `renderSvelteIsland` from `@hyperspan/plugin-svelte`

`renderPreactIsland` is synchronous. `renderVueIsland` and `renderSvelteIsland` are async, so use an async route when rendering Vue/Svelte islands.

```typescript
import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import { renderPreactIsland } from '@hyperspan/plugin-preact';
import { renderVueIsland } from '@hyperspan/plugin-vue';
import { renderSvelteIsland } from '@hyperspan/plugin-svelte';
import ReactCounter from '~/app/components/client-counter.tsx';
import VueCounter from '~/app/components/client-counter-vue.vue';
import SvelteCounter from '~/app/components/client-counter-svelte.svelte';

export default createRoute().get(async () => {
  return html`
    <div>
      ${renderPreactIsland(ReactCounter, { count: 5 })}
      ${await renderVueIsland(VueCounter, { count: 10 })}
      ${await renderSvelteIsland(SvelteCounter, { count: 15 })}
    </div>
  `;
});
```

## SSR and Lazy Hydration

All island render functions support the same third `options` argument:

| Option    | Type      | Default  | Description                                  |
| --------- | --------- | -------- | -------------------------------------------- |
| `ssr`     | `boolean` | `true`   | Disable with `false` to skip initial SSR HTML |
| `loading` | `string`  | `inline` | Use `'lazy'` to delay hydration until near viewport |

Examples:

- `renderPreactIsland(Component, props, { ssr: false })`
- `await renderVueIsland(Component, props, { ssr: true, loading: 'lazy' })`
- `await renderSvelteIsland(Component, props, { ssr: true, loading: 'lazy' })`

## Framework-Specific Guides

Use these pages for framework-specific setup and examples:

- [React / Preact Islands](/docs/clientjs/react)
- [Vue Islands](/docs/clientjs/vue)
- [Svelte Islands](/docs/clientjs/svelte)

