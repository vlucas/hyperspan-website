# Vue Islands

Use `@hyperspan/plugin-vue` to render and hydrate Vue components as client islands.

## Install

```shell
npm install @hyperspan/plugin-vue vue
```

## Configure

Add the plugin to `hyperspan.config.ts`:

```typescript
import { createConfig } from '@hyperspan/framework';
import { vuePlugin } from '@hyperspan/plugin-vue';

export default createConfig({
  appDir: './app',
  publicDir: './public',
  plugins: [vuePlugin()],
});
```

## Render a Vue Island

Import the `.vue` file with `{ island: 'vue' }` and `await renderIsland` in an async route handler:

```typescript
import { html } from '@hyperspan/html';
import { createRoute, renderIsland } from '@hyperspan/framework';
import ClientCounterVue from '~/app/components/client-counter-vue.vue' with { island: 'vue' };

export default createRoute().get(async () => {
  return html` <div>${await renderIsland(ClientCounterVue, { count: 10 })}</div> `;
});
```

## Example Counter Component

Create `app/components/client-counter-vue.vue`:

```vue
<script setup>
import { ref } from 'vue';

const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
});
const count = ref(props.count ?? 0);
</script>

<template>
  <div class="card bg-base-100 w-96 shadow-sm">
    <div class="card-body">
      <h2 class="card-title">Vue Counter: {{ count }}</h2>
      <p>A simple Vue client island with an interactive counter.</p>
      <div class="card-actions">
        <button class="btn btn-outline" @click="count--">Decrement</button>
        <button class="btn btn-outline" @click="count++">Increment</button>
      </div>
    </div>
  </div>
</template>
```

## Options

`await renderIsland(Component, props, options)`

`options` accepts:

- `ssr` (default `true`) to control server-side rendering
- `loading: 'lazy'` to hydrate when the island nears the viewport

Examples:

- `await renderIsland(ClientCounterVue, { count: 10 }, { ssr: false })`
- `await renderIsland(ClientCounterVue, { count: 10 }, { ssr: true, loading: 'lazy' })`
