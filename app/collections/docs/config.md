# Hyperspan Config

Hyperspan expects a config file named `hyperspan.config.ts` in the root of your project.

If you just created a new project from the [starter template](/docs/install), the contents might look like this:

```typescript
import { createConfig } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';

export default createConfig({
  appDir: './app',
  publicDir: './public',
  plugins: [preactPlugin()],
});
```

Omit `deployAdapter` to deploy to Node. Pass `bunAdapter()` or `cloudflareAdapter()` to target those platforms. See [Deployment](/docs/deploy).

Projects also include a `vite.config.ts` that loads Hyperspan's Vite plugin:

```typescript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { hyperspan } from '@hyperspan/vite-plugin';

export default defineConfig({
  plugins: [tailwindcss(), ...hyperspan()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
```

Island plugins registered in `hyperspan.config.ts` are picked up automatically by the Vite plugin.

## Config API

The `createConfig` function accepts a configuration object with the following options:

| Property            | Type                       | Required | Description                                                                                          |
| ------------------- | -------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `appDir`            | `string`                   | Yes      | Path to the application directory containing routes, layouts, etc.                                   |
| `publicDir`         | `string`                   | Yes      | Path to the public directory for static assets                                                       |
| `plugins`           | `Array<Plugin>`            | Yes      | Island plugins (e.g. Preact, Vue, Svelte)                                                            |
| `deployAdapter`     | `Adapter`                  | No       | Deployment adapter. Omit (or pass `nodeAdapter()`) for Node.                                         |
| `beforeServerCreate`| `(ctx) => void`            | No       | Hook called before the server is created, with platform bindings in `ctx.env`                        |
| `beforeRoutesAdded` | `(server: Server) => void` | No       | Hook called before file-based routes are added to the server                                         |
| `afterRoutesAdded`  | `(server: Server) => void` | No       | Hook called after file-based routes are added to the server                                          |
| `responseOptions`   | `ResponseOptions`          | No       | Options for controlling response behavior (e.g., streaming)                                          |

### Plugin Type

A `Plugin` is a function that receives the config and can perform setup or initialization:

```typescript
type Plugin = (config: Hyperspan.Config) => Promise<void> | void;
```

Plugins are typically used to set up [client-side island rendering](/docs/clientjs/islands) (e.g., `preactPlugin()` from `@hyperspan/plugin-preact`).

### Deploy Adapter

`deployAdapter` selects the production runtime.

```typescript
import { createConfig } from '@hyperspan/framework';
import { cloudflareAdapter } from '@hyperspan/adapter-cloudflare';

export default createConfig({
  deployAdapter: cloudflareAdapter(),
});
```

| Adapter | Package | `deployAdapter` |
| ------- | ------- | --------------- |
| Node (default) | `@hyperspan/adapter-node` | omit, or `nodeAdapter()` |
| Bun | `@hyperspan/adapter-bun` | `bunAdapter()` |
| Cloudflare Workers | `@hyperspan/adapter-cloudflare` | `cloudflareAdapter()` |

See [Deployment](/docs/deploy) for full setup examples.

### beforeServerCreate

Use `beforeServerCreate({ env })` to wire platform bindings before the server starts. On Node and Bun, `env` is `process.env`. On Cloudflare, `env` is Wrangler bindings during `hyperspan dev` and the Worker `env` in production.

```typescript
export default createConfig({
  deployAdapter: cloudflareAdapter(),
  beforeServerCreate({ env }) {
    // bind KV, D1, secrets, etc.
  },
  plugins: [preactPlugin()],
});
```

### ResponseOptions

The `responseOptions` object allows you to control response behavior:

```typescript
type ResponseOptions = {
  disableStreaming?: (context: Hyperspan.Context) => boolean;
};
```

- `disableStreaming` - A function that receives the request context and returns `true` to disable streaming for that request. This allows you to conditionally disable streaming based on route path, route name, or any other context property. See the [streaming documentation](/docs/streaming) for more details.
