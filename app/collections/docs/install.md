# Installation

Hyperspan requires [Node.js 24+](https://nodejs.org/). npm, pnpm, yarn, and bun all work as package managers.

Use the `hyperspan` package to create a new app from the starter template:

```shell
npx hyperspan create MyApp
```

Then step into your new project and start the Vite dev server:

```shell
cd MyApp
npm run dev
```

The starter includes `vite.config.ts`, `hyperspan.config.ts`, and these scripts:

| Script | Command | What it does |
| ------ | ------- | ------------ |
| `npm run dev` | `hyperspan dev` | Vite dev server with full hot reloading |
| `npm run build` | `hyperspan build` | Production bundle to `dist/` |
| `npm run start` | `hyperspan start` | Production server (Node by default) |

From there, you can add [custom routes](/docs/routes), [server actions](/docs/actions), [layouts](/docs/layouts), [vanilla JS](/docs/clientjs/vanilla), and client islands with [React/Preact](/docs/clientjs/react), [Vue](/docs/clientjs/vue), or [Svelte](/docs/clientjs/svelte).

When you are ready to ship, see [Deployment](/docs/deploy) for Node, Bun, and Cloudflare.

## Development

`hyperspan dev` starts Vite. Edits to routes, layouts, islands, CSS, and client JavaScript hot-reload in the browser. Islands, [route-split CSS](/docs/styles), and [streaming HTML](/docs/streaming) all work in development the same way they do in production.
