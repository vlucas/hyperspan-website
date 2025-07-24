import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';
import { highlightShell, highlightTS } from '@/src/lib/syntax-highlighter';
import { renderIsland } from '@hyperspan/framework/assets';
import ClientCounter from '@/app/components/client-counter.tsx';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Islands Architecture</h1>
      <p>
        Hyperspan is a server-oriented framework, which means that
        <strong>all JavaScript code that is sent to the client is explicitly opt-in</strong>.
        Hyperspan uses
        <a href="https://jasonformat.com/islands-architecture/">Islands Architecture</a> to make
        specific areas of the page interactive, while leaving the rest of the page static and
        server-rendered.
      </p>
      <p>
        If you need an area on your page to have client interactivity, you can use the
        <code>@hyperspan/plugin-preact</code> package to render and hydrate a
        <a href="https://preactjs.com">Preact</a> (or React) component on the client.
      </p>
      <div class="alert alert-info alert-outline">
        <span
          >To keep things fast and lightweight, Hyperspan uses
          <a href="https://preactjs.com"><code>preact/compat</code></a> and provides aliases for
          React, so you can embed your existing React components as-is without any changes.</span
        >
      </div>

      <h2>Install an Island Plugin</h2>
      <p>
        To use islands, you need to install a plugin that will handle the rendering and hydration of
        the component.
      </p>
      <p>
        To use Preact islands, you can install the
        <code>@hyperspan/plugin-preact</code> package:
      </p>
      ${highlightShell(`bun add @hyperspan/plugin-preact`)}
      <p>Then add the plugin to your <code>app/server.ts</code> file:</p>
      ${highlightTS(`import { createServer } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';

const app = await createServer({
  appDir: './app',
  staticFileRoot: './public',
  islandPlugins: [preactPlugin()], // Add the island plugin here
});

export default app;`)}

      <p>
        After installing the plugin, any <code>import</code> of a <code>.tsx</code> file will be
        handled by the plugin and will be prepared to be rendered as a dynamic island.
      </p>

      <div class="alert alert-info alert-outline">
        <span
          >The <code>renderIsland</code> function will not work unless you add the plugin here, so
          don't forget this step!</span
        >
      </div>

      <h2>Using Dynamic Islands</h2>
      <p>
        Now that you have added the plugin you want, you can import your component like normal and
        use the <code>renderIsland</code> function from the <code>assets</code> path to create a
        dynamic island for your Preact components.
      </p>
      ${highlightTS(`import { html } from '@hyperspan/html';
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
});`)}

      <p>
        This will render a <code>&lt;script type=&quot;module&quot;&gt;</code> tag with the
        component contents in it and a <code>&lt;div&gt;</code> tag that the component will mount
        and render into.
      </p>

      <div class="alert alert-info alert-outline">
        <span
          >For better performance and user experience, <code>renderIsland</code> will server-side
          render (SSR) the Preact component by default.
        </span>
      </div>

      <h2>renderIsland() Arguments</h2>
      <p>The <code>renderIsland</code> function takes 1-3 arguments:</p>
      <table>
        <thead>
          <tr>
            <th>Argument</th>
            <th>Description</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>component</code></td>
            <td>The client component to render</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td><code>props</code></td>
            <td>Props to pass to the component (object)</td>
            <td>No</td>
          </tr>
          <tr>
            <td><code>options</code></td>
            <td>
              An options object with:
              <ul>
                <li><code>ssr</code>: boolean (default: <code>true</code>)</li>
                <li>
                  <code>loading</code>: <code>'lazy' | undefined</code> (default:
                  <code>undefined</code>)
                </li>
              </ul>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Server-Side Rendering (SSR) with Islands</h2>
      <p>
        By default, <code>renderIsland</code> will server-side render (SSR) the Preact component.
        This means that the initial HTML from the component will be rendered on the server and sent
        to the client. This results in better web vitals scores, because it eliminates
        <a href="https://web.dev/articles/cls">layout shift</a>.
      </p>
      <p>
        If you do NOT want your component to be server-side rendered, you can pass
        <code>{ ssr: false }</code> as the third argument to <code>renderIsland</code>. That call
        might look like this:
        <code>renderIsland(ExampleCounter, { count: 5 }, { ssr: false })</code>. The component will
        still mount and hydrate on the client, but the initial HTML sent from the server will be
        empty.
      </p>

      <h2>Lazy Loading/Hydrating Islands</h2>
      <p>
        You can wait to hydrate your client island until the element scrolls into view by passing
        <code>{ loading: 'lazy' }</code> as the third argument to <code>renderIsland</code>.
      </p>
      <p>Example code for dynamic island with lazy loading/hydration and SSR:</p>
      <p>
        <code>renderIsland(ExampleCounter, { count: 42 }, { ssr: true, loading: 'lazy' })</code>.
      </p>
      <p>
        This will render the initial <code>&lt;script&gt;</code> tag inside a
        <code>&lt;template&gt;</code> tag so the script will not evaluate or run for the current
        user until the element scrolls into view (within 200px of the viewport).
      </p>
      <p>
        This can provide some significant performance benefits, but it is not on by default since it
        can lead to some unexpected behaviors, like timers not running and data not being fetched
        until the component is nearly in view.
      </p>

      <h2>Example Client Counter Component</h2>
      <p>
        This example is lazy loaded/hydrated. Check the Elements tab in your browser's developer
        tools to watch how it loads in.
      </p>
      ${renderIsland(ClientCounter, { count: 5 }, { ssr: true, loading: 'lazy' })}

      <h2>Using Other Frontend Frameworks</h2>
      <p>
        If you want to use a different frontend framework like Vue, Svelete, etc., feel free to do
        so! There is no magic here &mdash; Hyperspan is just using <code>Bun.build()</code> to get
        the JavaScript output of your component file, adding some SSR code to it, putting the output
        in a <code>&lt;script&gt;</code> tag, and then adding a bit of extra code to render and
        hydrate it as a component into a corresponding <code>&lt;div&gt;</code> tag.
      </p>
      <p>
        Although Hyperspan only provides a plugin for Preact/React components out of the box (for
        now!), you can use the same approach to create islands for other frameworks as well. Just
        look at the implementation of
        <a href="https://github.com/vlucas/hyperspan/tree/main/packages/plugin-preact"
          ><code>@hyperspan/plugin-preact</code></a
        >
        to get an idea of how to do it.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Islands Architecture',
    content,
  });
});
