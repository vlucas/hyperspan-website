import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';
import { highlightTS } from '@/src/lib/syntax-highlighter';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Vanilla JS in Hyperspan</h1>
      <p>
        Modern JavaScript has come a <em>long way</em> in the past decade or so. There is often no
        need to use a client-side framework to add small bits of interactivity to your site or app.
        Luckily, Hyperspan makes it easy to ship your own vanilla client-side JavaScript code to the
        browser using import maps and <code>&lt;script type=&quot;module&quot;&gt;</code> tags
        (widely supported by all modern browsers).
      </p>

      <h2>Bring Your Own JavaScript (BYOJS)</h2>
      <p>
        To use your own JavaScript code in the browser, you first need to create a file that ends
        with
        <code>.client.ts</code>. This tells Hyperspan to treat this file as a client-side module on
        import. All examples in the docs assume you are using a <code>app/clientjs</code> directory,
        but you can put this file in any other directory and organize your code however you like as
        long as it ends in <code>.client.ts</code>.
      </p>
      <p>
        For example, if you want to track RUM data with Datadog, you can create a file called
        <code>app/clientjs/datadog.client.ts</code> and add the following code:
      </p>
      ${highlightTS(`import { datadogRum } from '@datadog/browser-rum'

export function initDatadog() {
  datadogRum.init({
    applicationId: process.env.APP_PUBLIC_DATADOG_APPLICATION_ID,
    clientToken: process.env.APP_PUBLIC_DATADOG_CLIENT_TOKEN,
    site: 'datadoghq.com',
  });
}
      `)}
      <p>
        Note: Variables prefixed with <code>APP_PUBLIC_</code> will be replaced with their literal
        string values. See the <a href="/docs/env">Environment Variables</a> docs for details.
      </p>

      <h2>Using Your Own Client-Side Code</h2>
      <p>
        Once the file is created, you can import it and use it in any template, layout, or route
        with the <code>renderScriptTag</code> function like this:
      </p>
      ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';
import datadog from 'app/clientjs/datadog.client'; // Import the whole module
import { renderScriptTag } from '@hyperspan/framework/assets'; // Render the script tag

export default createRoute(() => {
  return html\`
    <main>
      <h1>Some Page Route</h1>
      <p>Example content for a page route.</p>

      \${renderScriptTag(datadog, (module) => {
        module.initDatadog();
      })}
    </main>
  \`;
});
`)}

      <p>The code above will:</p>
      <ol class="ml-4">
        <li>Compile your client-side TypeScript on <code>import</code> into an external JS file</li>
        <li>
          Add a reference to the compiled external file to an <code>importmap</code> on the page
        </li>
        <li>
          Render a <code>&lt;script type=&quot;module&quot;&gt;</code> tag on the page that imports
          your module and runs the optional callback to initialize the module. Any exports from the
          module will be available to your callback function.
        </li>
      </ol>

      <h2>You Can Always Use a <code>&lt;script&gt;</code> Tag</h2>
      <p>
        For less complex use cases, you can always use a <code>script</code> tag directly in your
        template. Hyperspan templates are just HTML!
      </p>
      ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute(() => {
  return html\`
    <main>
      <h1>Some Page Route</h1>
      <p>Example content for a page route.</p>

      <script>alert('Hello, world!');</script>
    </main>
  \`;
});
`)}

      <p>
        If you want to write the script using TypeScript instead of inside a template string, you
        can define the function in the file and then render it as a string in the template before
        calling it. The compiler will transpile your code into JavaScript that will work in the
        browser before the template is rendered.
      </p>
      ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute(() => {
  return html\`
    <main>
      <h1>Some Page Route</h1>
      <p>Example content for a page route.</p>

      <script>
        // Use an IIFE because the name might change when minified!
        (\${showGreeting.toString()})('John');
      </script>
    </main>
  \`;
});

function showGreeting(name: string) {
  alert(\`Hello, \${name}!\`);
}
`)}
      <p>
        Note: The major caveat to stringifying functions is that you can't use any dependencies or
        references to any other symbols in the file outside of the function itself. It's like
        copying the function and pasting it somewhere else.
      </p>
      <p>
        This approach works suprisingly well for simple things, but if you need to use dependencies,
        you should use the <code>renderScriptTag</code> function instead (see above).
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Vanilla Client-Side JavaScript',
    content,
  });
});
