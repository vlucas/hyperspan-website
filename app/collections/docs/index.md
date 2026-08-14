# Hyperspan Documentation

Hyperspan is a modern server-oriented TypeScript framework for building web sites and applications. Hyperspan is positioned somewhere between a more traditional server-side framework like Express and a newer frontend framework like Next.js. Hyperspan keeps most of the work and state on the server, but also supports using embedded React/Preact, Vue, and Svelte components with dynamic islands to add rich client-side interactivity to your application right where you need it, while shipping minimal JavaScript to the client.

Hyperspan is built using TypeScript and modern web standards. If you are coming from other popular JavaScript frameworks, Hyperspan will feel a lot _"closer to the metal"_ than those other frameworks do. You get full access to the `Request` context and can use middleware functions on any route, anywhere you like. You can even do things like compose your own route type with middleware already attached for more advanced cases.

[Vite](https://vite.dev) powers development and production builds. In development you get full hot reloading for routes, islands, CSS, and client JavaScript. Features like [islands](/docs/clientjs/islands), [route-split CSS](/docs/styles), and [streaming HTML](/docs/streaming) stay first-class. Production uses an explicit build step (`hyperspan build`) that emits a server entry and hashed assets to `dist/`.

Hyperspan runs anywhere you need it through [deployment adapters](/docs/deploy). Node is the default runtime. Official adapters also cover [Bun](/docs/deploy/bun) and [Cloudflare Workers](/docs/deploy/cloudflare).

Some key features that Hyperspan adds to the mix are fast, lightweight streaming [HTML Templates](/docs/html), [file-based & flexible routes](/docs/routes), dynamic [Server Actions](/docs/actions) that use minimal JavaScript, and an [Islands Architecture](/docs/clientjs/islands) that ensures you only ship JavaScript to the client when you really need to (Hyperspan does not ship any JavaScript to the client by default).

Hyperspan is stable and production ready. Check out the [Installation](/docs/install) page to get started!
