# Islands Architecture

Hyperspan is a server-oriented framework, which means that **all JavaScript code that is sent to the client is explicitly opt-in**. Hyperspan uses [Islands Architecture](https://jasonformat.com/islands-architecture/) to make specific areas of the page interactive, while leaving the rest of the page static and server-rendered.

If you need an area on your page to have client interactivity, you can use the `@hyperspan/plugin-preact` package to render and hydrate a [Preact](https://preactjs.com) (or React) component on the client.

> To keep things fast and lightweight, Hyperspan uses [\`preact/compat\`](https://preactjs.com) and provides aliases for React, so you can embed your existing React components as-is without any changes.

## Install an Island Plugin

To use islands, you need to install a plugin that will handle the rendering and hydration of the component.

To use Preact islands, you can install the `@hyperspan/plugin-preact` package:

\`\`\`shell
bun add @hyperspan/plugin-preact
\`\`\`

Then add the plugin to your `app/server.ts` file:

\`\`\`typescript
import { createServer } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';

const app = await createServer({
appDir: './app',
staticFileRoot: './public',
islandPlugins: [preactPlugin()], // Add the island plugin here
});

export default app;
\`\`\`

After installing the plugin, any `import` of a `.tsx` file will be handled by the plugin and will be prepared to be rendered as a dynamic island.

> The `renderIsland` function will not work unless you add the plugin here, so don't forget this step!

## Using Dynamic Islands

Now that you have added the plugin you want, you can import your component like normal and use the `renderIsland` function from the `assets` path to create a dynamic island for your Preact components.

\`\`\`typescript
import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import { renderIsland } from '@hyperspan/framework/assets';
// Import your Preact component like normal once the island plugin is loaded
import ExampleCounter from '@/src/components/example-counter.tsx';

export default createRoute(() => {
return html\`
<div>
<!-- Call the component with renderIsland() and pass any props you need! -->
\${renderIsland(ExampleCounter, { count: 5 })}
</div>
\`;
});
\`\`\`

This will render a `<script type="module">` tag with the component contents in it and a `<div>` tag that the component will mount and render into.

> For better performance and user experience, `renderIsland` will server-side render (SSR) the Preact component by default.

## renderIsland() Arguments

The `renderIsland` function takes 1-3 arguments:

| Argument    | Description                                                                           | Required                        |
| ----------- | ------------------------------------------------------------------------------------- | ------------------------------- | --- |
| `component` | The client component to render                                                        | Yes                             |
| `props`     | Props to pass to the component (object)                                               | No                              |
| `options`   | An options object with:<br>- `ssr`: boolean (default: `true`)<br>- `loading`: `'lazy' | undefined`(default:`undefined`) | No  |

## Server-Side Rendering (SSR) with Islands

By default, `renderIsland` will server-side render (SSR) the Preact component. This means that the initial HTML from the component will be rendered on the server and sent to the client. This results in better web vitals scores, because it eliminates [layout shift](https://web.dev/articles/cls).

If you do NOT want your component to be server-side rendered, you can pass `{ ssr: false }` as the third argument to `renderIsland`. That call might look like this: `renderIsland(ExampleCounter, { count: 5 }, { ssr: false })`. The component will still mount and hydrate on the client, but the initial HTML sent from the server will be empty.

## Lazy Loading/Hydrating Islands

You can wait to hydrate your client island until the element scrolls into view by passing `{ loading: 'lazy' }` as the third argument to `renderIsland`.

Example code for dynamic island with lazy loading/hydration and SSR:

`renderIsland(ExampleCounter, { count: 42 }, { ssr: true, loading: 'lazy' })`.

This will render the initial `<script>` tag inside a `<template>` tag so the script will not evaluate or run for the current user until the element scrolls into view (within 200px of the viewport).

This can provide some significant performance benefits, but it is not on by default since it can lead to some unexpected behaviors, like timers not running and data not being fetched until the component is nearly in view.

## Example Client Counter Component

This example is lazy loaded/hydrated. Check the Elements tab in your browser's developer tools to watch how it loads in.

<!-- ISLAND: ClientCounter { count: 5 } { ssr: true, loading: 'lazy' } -->

## Using Other Frontend Frameworks

If you want to use a different frontend framework like Vue, Svelete, etc., feel free to do so! There is no magic here — Hyperspan is just using `Bun.build()` to get the JavaScript output of your component file, adding some SSR code to it, putting the output in a `<script>` tag, and then adding a bit of extra code to render and hydrate it as a component into a corresponding `<div>` tag.

Although Hyperspan only provides a plugin for Preact/React components out of the box (for now!), you can use the same approach to create islands for other frameworks as well. Just look at the implementation of [\`@hyperspan/plugin-preact\`](https://github.com/vlucas/hyperspan/tree/main/packages/plugin-preact) to get an idea of how to do it.
