# React / Preact Islands

Use `@hyperspan/plugin-preact` to render and hydrate React or Preact components as client islands.

> Hyperspan uses `preact/compat` aliases so you can often use existing React components without changing component code.

## Install

```shell
bun add @hyperspan/plugin-preact
```

## Configure

Add the plugin to `hyperspan.config.ts`:

```typescript
import { createConfig } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';

export default createConfig({
  appDir: './app',
  publicDir: './public',
  plugins: [preactPlugin()],
});
```

## Update TypeScript JSX Settings

For React/Preact islands, ensure `tsconfig.json` includes JSX compiler settings for Preact:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  }
}
```

Without these settings, `.tsx` components may fail to compile correctly for client islands.

## Render a React/Preact Island

Use `renderPreactIsland` to render and hydrate your component in a route:

```typescript
import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import { renderPreactIsland } from '@hyperspan/plugin-preact';
import ClientCounter from '~/app/components/client-counter.tsx';

export default createRoute().get(() => {
  return html` <div>${renderPreactIsland(ClientCounter, { count: 5 })}</div> `;
});
```

## Example Counter Component

Create `app/components/client-counter.tsx`:

```typescript
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function ClientCounter({ count: initialCount = 0 }: { count?: number }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div class="card bg-base-100 w-96 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Counter: {count}</h2>
        <p>A simple Preact/React client component with an interactive counter.</p>
        <div class="card-actions">
          <button className="btn btn-outline" onClick={() => setCount(count - 1)}>
            Decrement
          </button>
          <button className="btn btn-outline" onClick={() => setCount(count + 1)}>
            Increment
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Options

`renderPreactIsland(Component, props, options)`

`options` accepts:

- `ssr` (default `true`) to control server-side rendering
- `loading: 'lazy'` to hydrate when the island nears the viewport

Examples:

- `renderPreactIsland(ClientCounter, { count: 5 }, { ssr: false })`
- `renderPreactIsland(ClientCounter, { count: 5 }, { ssr: true, loading: 'lazy' })`
