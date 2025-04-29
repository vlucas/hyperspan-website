import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';
import { highlightTS } from '@/src/lib/syntax-highlighter';
import { createPreactIsland } from '@hyperspan/framework/assets';

const ClientCounter = await createPreactIsland(
  import.meta.resolve('@/app/components/client-counter')
);

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Dynamic Islands Example</h1>
      <p>
        This example shows how to use the <code>createPreactIsland</code> function to create a
        dynamic island for a Preact component.
      </p>

      <h2>Embedded Client Counter:</h2>
      ${ClientCounter({ count: 5 })}

      <h2>Code Example:</h2>
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
        Read more about dynamic islands in the
        <a href="/docs/islands-architecture">Islands Architecture</a> docs.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Dynamic Islands Example',
    content,
  });
});
