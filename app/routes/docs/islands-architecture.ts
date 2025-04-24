import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/DocsLayout';
import { highlightTS } from '@/src/lib/syntax-highlighter';
import { createPreactIsland } from '@hyperspan/framework/assets';

const ClientCounter = await createPreactIsland(
  import.meta.resolve('@/app/components/ClientCounter.tsx')
);

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
        If you need an area with client interactivity, you can use a <em>Dynamic Island</em> to
        render and hydrate a <a href="https://preactjs.com">Preact</a> (or React) component on the
        client.
      </p>
      <div class="alert alert-info alert-outline">
        <span
          >To keep things fast and lightweight, Hyperspan uses
          <a href="https://preactjs.com"><code>preact/compat</code></a> and provides aliases for
          React, so you can embed your existing React components as-is without any changes.</span
        >
      </div>

      <h2>Using Dynamic Islands</h2>
      <p>
        You can use the <code>createPreactIsland</code> function from the <code>assets</code> path
        to create a dynamic island for your Preact components.
      </p>
      ${highlightTS(`import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import { createPreactIsland } from '@hyperspan/framework/assets';

// Bun supports top-level await, so this compiles at build/server start time
const ExampleCounter = await createPreactIsland(import.meta.resolve('@/src/components/ExampleCounter.tsx'));

export default createRoute(() => {
  return html\`
    <div>
      <!-- Call the component as a function and pass any props you need! -->
      \${ExampleCounter({ count: 5 })}
    </div>
  \`;
});`)}

      <p>
        This will render a <code>&lt;script type=&quot;module&quot;&gt;</code> tag with the
        component contents in it and a <code>&lt;div&gt;</code> tag that the component will mount
        and render into.
      </p>

      <h2>Example Client Counter Component</h2>
      ${ClientCounter({ count: 5 })}

      <h2>Using Other Frontend Frameworks</h2>
      <p>
        If you want to use a different frontend framework like Vue, Svelete, etc., feel free to do
        so! There is no magic here &mdash; Hyperspan is just using <code>Bun.build()</code> to get
        the JavaScript output of your component file, putting that in a
        <code>&lt;script&gt;</code> tag, and then adding a bit of extra code to render it as a
        component into a corresponding <code>&lt;div&gt;</code> tag.
      </p>
      <p>
        Although Hyperspan only provides support for Preact/React components out of the box, you can
        use the same approach to create islands for other frameworks as well. Just look at the
        implementation of
        <a href="https://github.com/search?q=repo%3Avlucas/hyperspan%20createPreactIsland&type=code"
          ><code>createPreactIsland</code> on GitHub</a
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
