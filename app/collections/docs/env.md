# Environment Variables

During `hyperspan dev` and `hyperspan build`, Vite loads environment variables from `.env` files in the project root. See the [Vite env docs](https://vite.dev/guide/env-and-mode.html) for file priority (`.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`).

On the server, read values from `process.env`. In production, set variables in your host environment (Node process, Bun process, or Cloudflare Worker bindings).

## Platform Bindings

Use `beforeServerCreate({ env })` in `hyperspan.config.ts` to receive platform-specific bindings:

- **Node / Bun:** `env` is `process.env`
- **Cloudflare (dev):** Wrangler platform proxy bindings
- **Cloudflare (production):** the Worker `env` object

```typescript
export default createConfig({
  beforeServerCreate({ env }) {
    // Node/Bun: process.env
    // Cloudflare: Worker bindings (KV, D1, secrets, …)
  },
});
```

See [Cloudflare deployment](/docs/deploy/cloudflare) for a full example.

## Using Environment Variables in Client-Side Code

If you need to use environment variables in client-side code like Preact components, prefix them with `APP_PUBLIC_`.

For example, if you have an environment variable called `API_URL` that you need to use in a client component, name it `APP_PUBLIC_API_URL` in your `.env` file.

When you access it in your client component, use `import.meta.env.APP_PUBLIC_API_URL`. Any environment variables used in client components that start with `APP_PUBLIC_` will be automatically inlined into the component on build as strings (when they are imported with an [island plugin](/docs/clientjs/islands)) so that `import.meta.env` does not leak other values to the client.

This ensures that sensitive environment variables are not inadvertently exposed or leaked to the client.
