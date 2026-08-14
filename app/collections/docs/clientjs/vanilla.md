# Vanilla JS in Hyperspan

Modern JavaScript has come a _long way_ in the past decade or so. There is often no need to use a client-side framework to add small bits of interactivity to your site or app. Luckily, Hyperspan makes it easy to ship your own vanilla client-side JavaScript code to the browser using import maps and `<script type="module">` tags (widely supported by all modern browsers).

## Bring Your Own JavaScript (BYOJS)

To use your own JavaScript code in the browser, register it with the `buildClientJS` method in `@hyperspan/framework/client/js`.

Call `buildClientJS()` once at **module scope** (top-level await). It registers the path for Vite to bundle — do not call it inside a route handler on every request.

Use an app-relative path (e.g. `app/client/datadog.client.ts`) so the asset hash stays stable across Node, Cloudflare Workers, and other runtimes.

For example, if you want to track RUM data with Datadog, create `app/client/datadog.client.ts`:

```typescript
import { datadogRum } from '@datadog/browser-rum';

export function initDatadog() {
  datadogRum.init({
    applicationId: import.meta.env.APP_PUBLIC_DATADOG_APPLICATION_ID,
    clientToken: import.meta.env.APP_PUBLIC_DATADOG_CLIENT_TOKEN,
    site: 'datadoghq.com',
  });
}
```

Variables prefixed with `APP_PUBLIC_` are inlined as strings. See the [Environment Variables](/docs/env) docs for details.

## Using Your Own Client-Side Code

Once the file is registered, import it and use it in any template, layout, or route with the `renderScriptTag` function like this:

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';
import { buildClientJS } from '@hyperspan/framework/client/js';

const datadogClientJS = await buildClientJS('app/client/datadog.client.ts');

export default createRoute().get(() => {
  return html`
    <main>
      <h1>Some Page Route</h1>
      <p>Example content for a page route.</p>

      ${datadogClientJS.renderScriptTag((module) => {
        module.initDatadog();
      })}
    </main>
  `;
});
```

The code above will:

1. Register your client-side TypeScript for Vite to bundle
2. Add a reference to the compiled file to an `importmap` on the page
3. Render a `<script type="module">` tag on the page that imports your module and runs the optional callback to initialize the module. Any exports from the module will be available to your callback function.

## `buildClientJS` returns an object with:

- `renderScriptTag` method with optional callback or string (shown above)
- `publicPath` property with the full path to the compiled client JS. You can use this to add your own normal `<script src="${yourClientJS.publicPath}">` tag if you need to do this instead of using `renderScriptTag`.
- `esmName` property with just the name of the file
- `assetHash` property with the asset hash of the file

`renderScriptTag()` with no argument emits a module script that imports the bundle via the import map. Pass a function or string to inline bootstrap code that receives the module exports.

## You Can Always Use a `<script>` Tag

For less complex use cases, you can always use a `script` tag directly in your template. Hyperspan templates are just HTML!

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute().get(() => {
  return html`
    <main>
      <h1>Some Page Route</h1>
      <p>Example content for a page route.</p>

      <script>
        alert('Hello, world!');
      </script>
    </main>
  `;
});
```

If you want to write the script using TypeScript instead of inside a template string, you can define the function in the file and then render it as a string in the template before calling it. The compiler will transpile your code into JavaScript that will work in the browser before the template is rendered.

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute().get(() => {
  return html`
    <main>
      <h1>Some Page Route</h1>
      <p>Example content for a page route.</p>

      <script>
        // Use an IIFE because the name might change when minified!
        (${showGreeting.toString()})('John');
      </script>
    </main>
  `;
});

function showGreeting(name: string) {
  alert(`Hello, ${name}!`);
}
```

Note: The major caveat to stringifying functions is that you can't use any dependencies or references to any other symbols in the file outside of the function itself. It's like copying the function and pasting it somewhere else.

This approach works surprisingly well for simple things, but if you need to use dependencies, you should use the `buildClientJS` function instead (see above).
