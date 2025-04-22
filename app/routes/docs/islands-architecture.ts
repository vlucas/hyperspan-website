import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/DocsLayout';
import { highlightTS } from '@/src/lib/syntax-highlighter';

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
        render and hydrate a <a href="https://preactjs.com">Preact</a> component on the client.
      </p>
      <div class="alert alert-info alert-outline">
        <span
          >To keep things fast and lightweight, Hyperspan uses
          <a href="https://preactjs.com">Preact</a> by default for client interactivity. The
          framework uses <code>preact/compat</code> and provides aliases for React, so you can embed
          your existing React components as-is without any changes.</span
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
    </main>
  `;

  return DocsLayout({
    title: 'Islands Architecture',
    content,
  });
});
