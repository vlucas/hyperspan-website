---
title: Hyperspan v2.0, powered by Vite
date: 2026-08-13
description: Hyperspan 2.0.0 uses Vite for development and production builds, so the same app can run on Node, Bun, and Cloudflare Workers.
---

# Hyperspan v2.0, powered by Vite

Today I’m shipping **Hyperspan 2.0.0**. The headline is simple: Hyperspan is powered by **Vite**, and that unlocks running your app **wherever you need it** — including **Cloudflare Workers**.

The framework you already know is the same: server-oriented TypeScript, streaming HTML, file-based routes, server actions, and islands that ship JavaScript only where you ask for it. Vite takes over development and production builds so that stack can travel.

## Vite in development and production

`hyperspan dev` is a Vite dev server. Routes, islands, CSS, and client JavaScript hot-reload as you edit. Production is an explicit build:

```shell
npx hyperspan create MyApp
cd MyApp
npm run dev      # Vite, full hot reloading
npm run build    # production bundle → dist/
npm start        # Node by default
```

Islands, route-split CSS, and streaming HTML stay first-class. Vite is the toolchain; Hyperspan is still the server.

## One app, many runtimes

Under the hood, a Hyperspan app is a portable `fetch(Request) → Response` handler. A **deployment adapter** maps that handler onto a platform.

**Node is the default.** Omit `deployAdapter` and `hyperspan start` serves your build with `@hyperspan/adapter-node`.

Want Bun’s native HTTP server in production? Pass `bunAdapter()`. Want the edge? Pass `cloudflareAdapter()`.

```typescript
import { createConfig } from '@hyperspan/framework';
import { cloudflareAdapter } from '@hyperspan/adapter-cloudflare';

export default createConfig({
  deployAdapter: cloudflareAdapter(),
  beforeServerCreate({ env }) {
    // KV, D1, secrets — Worker bindings in production,
    // Wrangler’s platform proxy during hyperspan dev
  },
});
```

`hyperspan build` writes `dist/server.ts` from the adapter: `start()` on Node and Bun, `fetch()` on Cloudflare. Development is always Vite, no matter where you deploy.

## Cloudflare Workers

This is the runtime I wanted Hyperspan to reach. Workers are a natural home for a server-first HTML framework: a `fetch` handler, static assets from the build, and bindings for KV, D1, and secrets.

Point Wrangler at the generated entry:

```jsonc
{
  "name": "my-hyperspan-app",
  "main": "./dist/server.ts",
  "compatibility_date": "2026-08-13",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  }
}
```

Then:

```shell
npm run build
npx wrangler deploy
```

Your routes, actions, islands, and CSS go with you. Bindings show up in `beforeServerCreate({ env })` locally (via Wrangler) and in production (as the Worker `env`).

See the **[Cloudflare deploy guide](/docs/deploy/cloudflare)** for the full setup, and **[Deployment](/docs/deploy)** for Node and Bun.

## Try 2.0.0

```shell
npx hyperspan create MyApp
```

Then read the **[installation guide](/docs/install)** and pick a runtime. Upgrading from v1? See **[Migrating to v2](/docs/migration-v2)**. Hyperspan still ships **zero JavaScript to the client by default**. Vite just means you can run that same app on Node, on Bun, or at the edge on Cloudflare.

*Hyperspan: Web Framework for Dynamic High-Performance Sites and Apps.*
