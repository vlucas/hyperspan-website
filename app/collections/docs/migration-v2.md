# Migrating to Hyperspan v2

Hyperspan **2.0.0** uses a **Vite build pipeline** and **portable `fetch(Request) → Response` handlers** deployable to Node, Cloudflare Workers, Bun, and other platforms.

## Runtime

- **Node 24+** is the default runtime.
- Install dependencies with `npm install` (or pnpm/yarn). Bun works as an optional runtime via [`@hyperspan/adapter-bun`](/docs/deploy/bun).
- CLI shebangs use Node (`#!/usr/bin/env node`).

## Build pipeline

- **Vite** handles dev, build, CSS, client JS, and islands.
- Add `vite.config.ts` to your project (see the [starter template](/docs/install)).
- Run `npm run build` before `npm run start` in production.
- Assets emit to `dist/` (including `dist/manifest.json`).

## Island plugins

Configure island plugins in `hyperspan.config.ts`. The Vite integration loads that config automatically:

```ts
// hyperspan.config.ts
import { createConfig } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';
import { sveltePlugin } from '@hyperspan/plugin-svelte';
import { vuePlugin } from '@hyperspan/plugin-vue';

export default createConfig({
  plugins: [preactPlugin(), sveltePlugin(), vuePlugin()],
});
```

Pass `deployAdapter: cloudflareAdapter()` or `bunAdapter()` to deploy to Cloudflare or Bun. Island plugins go in `plugins`; the deploy adapter goes in `deployAdapter`.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { hyperspan } from '@hyperspan/vite-plugin';

export default defineConfig({
  plugins: [...hyperspan()],
});
```

Mark a component as an island at import time:

```ts
import { renderIsland } from '@hyperspan/framework';
import Counter from '../widgets/counter.tsx' with { island: 'preact' };

html`${renderIsland(Counter, { count: 0 })}`;
```

Use `with { island: 'svelte' }` or `with { island: 'vue' }` for other frameworks. See [Islands](/docs/clientjs/islands).

## Custom client JS

Register arbitrary client modules with `buildClientJS()` at **module scope** (top-level await). Prefer a tsconfig alias, a project-root path, or `import.meta.resolve('./file.ts')` at the call site. See [Vanilla JS](/docs/clientjs/vanilla).

## Scripts

| Command         | What it does                                           |
| --------------- | ------------------------------------------------------ |
| `npm run dev`   | `hyperspan dev` — Vite dev server                      |
| `npm run build` | `hyperspan build` — production bundle                  |
| `npm run start` | `hyperspan start` — Node via `@hyperspan/adapter-node` |

## Setup checklist

1. **Install v2 packages**:
   ```bash
   npm install hyperspan @hyperspan/framework @hyperspan/vite-plugin
   ```
   Or pin a specific version: `^2.0.0`
2. **Add `vite.config.ts`** (copy from the starter template).
3. **Update `package.json` scripts** to use `npm run dev/build/start`.
4. **Run `npm run build`** before deploying.
5. **Use a `node:24` base image** in Docker.

## Deployment adapters

| Package                         | Purpose                        |
| ------------------------------- | ------------------------------ |
| `@hyperspan/adapter-node`       | Node.js HTTP server (default)  |
| `@hyperspan/adapter-cloudflare` | Cloudflare Workers             |
| `@hyperspan/adapter-bun`        | Optional Bun runtime           |

See [Deployment](/docs/deploy) for Node, Bun, and Cloudflare details.

## Application structure

- File-based `app/routes` and `app/actions`
- `createRoute()`, `createAction()`, `html` templates, layouts
- Streaming HTML and island component APIs
- `hyperspanScriptTags()` / `hyperspanStyleTags()`

## SSG

`hyperspan build:ssg` is not implemented yet. Routes compile to a manifest at build time, which makes SSG straightforward to add later.
