# Deployment

Hyperspan runs as a portable `fetch(Request) → Response` app. A **deployment adapter** maps that handler onto a platform: Node, Bun, Cloudflare Workers, and other runtimes that speak web-standard Request/Response.

Island plugins go in `plugins`. The deploy adapter goes in `deployAdapter`. Omit `deployAdapter` to deploy to Node.

```typescript
import { createConfig } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';

export default createConfig({
  plugins: [preactPlugin()],
  // deployAdapter omitted → Node
});
```

`hyperspan build` writes a production entry to `dist/server.ts` from the adapter's `createEntry()`.

| Platform | Package | Config | Guide |
| -------- | ------- | ------ | ----- |
| [Node](/docs/deploy/node) (default) | `@hyperspan/adapter-node` | omit, or `nodeAdapter()` | HTTP server via `hyperspan start` |
| [Bun](/docs/deploy/bun) | `@hyperspan/adapter-bun` | `bunAdapter()` | `Bun.serve` for a native-speed HTTP layer |
| [Cloudflare](/docs/deploy/cloudflare) | `@hyperspan/adapter-cloudflare` | `cloudflareAdapter()` | Workers `fetch()` + assets |

Development always uses Vite (`hyperspan dev`), regardless of which adapter you deploy with.

## Production build

Every production deploy starts with a build:

```shell
npm run build
```

That runs `hyperspan build` (Vite) and emits:

- `dist/server.ts` — adapter entry (`start()` and/or `fetch()`)
- `dist/manifest.json` — hashed client JS, islands, and CSS
- `dist/assets/` — compiled styles and client bundles

Then start or deploy with the platform-specific steps in the guides above.
