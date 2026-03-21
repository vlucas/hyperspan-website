# Svelte Islands

Use `@hyperspan/plugin-svelte` to render and hydrate Svelte components as client islands.

## Install

```shell
bun add @hyperspan/plugin-svelte svelte
```

## Configure

Add the plugin to `hyperspan.config.ts`:

```typescript
import { createConfig } from '@hyperspan/framework';
import { sveltePlugin } from '@hyperspan/plugin-svelte';

export default createConfig({
  appDir: './app',
  publicDir: './public',
  plugins: [sveltePlugin()],
});
```

## Render a Svelte Island

`renderSvelteIsland` is async, so use an async route handler:

```typescript
import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import { renderSvelteIsland } from '@hyperspan/plugin-svelte';
import ClientCounterSvelte from '~/app/components/client-counter-svelte.svelte';

export default createRoute().get(async () => {
  return html` <div>${await renderSvelteIsland(ClientCounterSvelte, { count: 15 })}</div> `;
});
```

## Example Counter Component

Create `app/components/client-counter-svelte.svelte`:

```svelte
<script lang="ts">
  let { count = 0 } = $props<{ count?: number }>();
</script>

<div class="card bg-base-100 w-96 shadow-sm">
  <div class="card-body">
    <h2 class="card-title">Svelte Counter: {count}</h2>
    <p>A simple Svelte client island with an interactive counter.</p>
    <div class="card-actions">
      <button class="btn btn-outline" onclick={() => count--}>Decrement</button>
      <button class="btn btn-outline" onclick={() => count++}>Increment</button>
    </div>
  </div>
</div>
```

## Options

`await renderSvelteIsland(Component, props, options)`

`options` accepts:

- `ssr` (default `true`) to control server-side rendering
- `loading: 'lazy'` to hydrate when the island nears the viewport

Examples:

- `await renderSvelteIsland(ClientCounterSvelte, { count: 15 }, { ssr: false })`
- `await renderSvelteIsland(ClientCounterSvelte, { count: 15 }, { ssr: true, loading: 'lazy' })`
