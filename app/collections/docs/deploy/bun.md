# Deploy to Bun

Use the Bun adapter when you want production to run on Bun’s built-in HTTP server and router (`Bun.serve`) — a lighter, faster path than a Node HTTP stack. Development still uses Vite (`hyperspan dev`).

Install [Bun](https://bun.sh) for production, and `@hyperspan/adapter-bun` in your project.

## Install

```shell
npm install @hyperspan/adapter-bun
```

## Config

Pass `bunAdapter()` to `deployAdapter`:

```typescript
import { createConfig } from '@hyperspan/framework';
import { bunAdapter } from '@hyperspan/adapter-bun';
import { preactPlugin } from '@hyperspan/plugin-preact';

export default createConfig({
  deployAdapter: bunAdapter(),
  plugins: [preactPlugin()],
});
```

Use `beforeServerCreate({ env })` to read `process.env` before the server starts:

```typescript
export default createConfig({
  deployAdapter: bunAdapter(),
  beforeServerCreate({ env }) {
    // env is process.env
  },
  plugins: [preactPlugin()],
});
```

## Build and start

```shell
npm run build
bun --bun hyperspan start
```

`hyperspan build` writes `dist/server.ts`. Running start under Bun calls the adapter's `start()`, which serves requests with `Bun.serve`.

Set the port with `PORT` or `--port`:

```shell
PORT=3000 bun --bun hyperspan start
# or
bun --bun hyperspan start --port 3000
```

You can also call the generated entry from a small Bun script:

```typescript
import { start } from './dist/server.ts';

await start({ port: Number(process.env.PORT) || 3000 });
```

```shell
bun start.ts
```

## Docker

```dockerfile
FROM oven/bun:1
WORKDIR /usr/src/app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "bun", "dist/server.ts" ]
```

Set environment variables on the host (or with `docker run -e`). See [Environment Variables](/docs/env).
