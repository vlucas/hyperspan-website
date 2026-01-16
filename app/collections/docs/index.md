# Hyperspan Documentation

Hyperspan is a modern server-oriented TypeScript framework for building web sites and applications. Hyperspan is positioned somewhere between a more traditional server-side framework like Express and a newer frontend framework like Next.js. Hyperspan keeps most of the work and state on the server, but also supports using embedded React and Preact components with dynamic islands to add rich client-side interactivity to your application right where you need it, while shipping minimal JavaScript to the client.

Hyperspan is built using TypeScript and modern web standards. If you are coming from other popular JavaScript frameworks, Hyperspan will feel a lot _"closer to the metal"_ than those other frameworks do. You get full access to the `Request` context and can use middleware functions on any route, anywhere you like. You can even do things like compose your own route type with middleware already attached for more advanced cases.

With [Bun](https://bun.sh) as the runtime, there is **no build or compile step** required to run your code. You can just write TypeScript and run it directly. Any client-side code that needs to be bundled is done on server startup via Bun plugins that run on `import`. You can import CSS files with Tailwind directives to load them in the current route or layout. Everything is seamless and automatic.

Some key features that Hyperspan adds to the mix are fast, lightweight streaming [HTML Templates](/docs/html), [file-based & flexible routes](/docs/routes), and an [Islands Architecture](/docs/clientjs/islands) that ensures you only ship JavaScript to the client when you really need to.

Hyperspan is still under active development, but the core functionality is stable and production ready. Check out the [Installation](/docs/install) page to get started!
