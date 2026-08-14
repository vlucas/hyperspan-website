# Deploy to Cloudflare

The Cloudflare adapter runs Hyperspan on [Cloudflare Workers](https://developers.cloudflare.com/workers/). The adapter supplies the Worker `fetch()` entry, Wrangler bindings during `hyperspan dev`, and CSS-alias sync after `hyperspan build`.

Requires Node.js 24+, a [Cloudflare account](https://dash.cloudflare.com/sign-up), and Wrangler (`npx wrangler login`).

## Install

```shell
npm install @hyperspan/adapter-cloudflare
npm install -D wrangler
```

## Config

Pass `cloudflareAdapter()` to `deployAdapter`. Wire KV, D1, secrets, and other bindings in `beforeServerCreate({ env })`:

```typescript
import { createConfig } from '@hyperspan/framework';
import { cloudflareAdapter } from '@hyperspan/adapter-cloudflare';
import { preactPlugin } from '@hyperspan/plugin-preact';

export default createConfig({
  deployAdapter: cloudflareAdapter(),
  beforeServerCreate({ env }) {
    // Vite / hyperspan dev: Wrangler platform proxy
    // Production: Worker env bindings
  },
  appDir: './app',
  publicDir: './public',
  plugins: [preactPlugin()],
});
```

Island plugins stay in `plugins`. The deploy adapter stays in `deployAdapter`.

## wrangler.toml

Point Wrangler at the generated server entry and serve built assets:

```toml
name = "my-hyperspan-app"
main = "./dist/server.ts"
compatibility_date = "2026-08-11"
compatibility_flags = ["nodejs_compat"]

[build]
command = "npm run build"

[assets]
directory = "./dist"
binding = "ASSETS"
```

Add KV, D1, or other bindings as needed:

```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-namespace-id"
```

`hyperspan build` runs the adapter's `afterBuild` hook, which syncs Wrangler CSS aliases so layout CSS imports resolve at Worker runtime. Styles are compiled into `dist/assets/` and injected with `hyperspanStyleTags()`.

## Local development

```shell
npm run dev
```

`hyperspan dev` uses Vite. `cloudflareAdapter()` loads Wrangler bindings through `getPlatformProxy` (prefers `wrangler.dev.jsonc` / `wrangler.dev.toml` when present).

To exercise the production Worker bundle locally:

```shell
npm run build
npx wrangler dev
```

## Deploy

```shell
npm run build
npx wrangler deploy
```

Or combine them in `package.json`:

```json
{
  "scripts": {
    "dev": "hyperspan dev",
    "build": "hyperspan build",
    "deploy": "hyperspan build && wrangler deploy"
  }
}
```

Wrangler uses `dist/server.ts` as the Worker entry. The default export's `fetch(request, env)` handles requests; the `ASSETS` binding serves files from `dist/`.

## Client JS paths

Register vanilla client modules with an app-relative path so asset hashes stay stable on Workers:

```typescript
import { buildClientJS } from '@hyperspan/framework/client/js';

const picker = await buildClientJS('app/client/picker.ts');
```

See [Vanilla JS](/docs/clientjs/vanilla) for details.
