# Deploy to Node

Node is Hyperspan's default runtime. Omit `deployAdapter` (or pass `nodeAdapter()`) and `hyperspan start` serves your production build with `@hyperspan/adapter-node`.

Requires [Node.js 24+](https://nodejs.org/).

## Config

No adapter package is required for the default Node path:

```typescript
import { createConfig } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';

export default createConfig({
  appDir: './app',
  publicDir: './public',
  plugins: [preactPlugin()],
});
```

To set the adapter explicitly:

```typescript
import { createConfig } from '@hyperspan/framework';
import { nodeAdapter } from '@hyperspan/adapter-node';
import { preactPlugin } from '@hyperspan/plugin-preact';

export default createConfig({
  deployAdapter: nodeAdapter(),
  plugins: [preactPlugin()],
});
```

Use `beforeServerCreate({ env })` to read `process.env` before the server starts:

```typescript
export default createConfig({
  beforeServerCreate({ env }) {
    // env is process.env
  },
  plugins: [preactPlugin()],
});
```

## Build and start

```shell
npm run build
npm start
```

`hyperspan start` loads `dist/server.ts` and calls `start()`. The Node adapter listens on `PORT` (default `3000`) and serves static files from `dist/`.

```shell
PORT=8080 npm start
# or
hyperspan start --port 8080
```

## Docker

The starter template ships a Node 24 image:

```dockerfile
FROM node:24-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "npm", "start" ]
```

Set environment variables on the host (or with `docker run -e`). See [Environment Variables](/docs/env).
