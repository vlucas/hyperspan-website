import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';
import { highlightTS } from '@/src/lib/syntax-highlighter';
import { renderIsland } from '@hyperspan/framework/assets';
import ClientCounter from '@/app/components/client-counter.tsx';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Dynamic Islands Example</h1>
      <p>
        This example shows how to embed dynamic Preact components in otherwise static HTML content.
      </p>

      <h2>Embedded Client Counter:</h2>
      ${renderIsland(ClientCounter, { count: 5 })}

      <h2>Code Example:</h2>
      <p>
        Once your frontend framework plugin of choice is loaded, You can use the
        <code>renderIsland</code> function from the <code>assets</code> path to render and hydrate
        your client component.
      </p>
      ${highlightTS(`import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import { renderIsland } from '@hyperspan/framework/assets';
// Import your Preact component like normal once the island plugin is loaded
import ExampleCounter from '@/src/components/ExampleCounter.tsx';

export default createRoute(() => {
  return html\`
    <div>
      <!-- Call the component with renderIsland() and pass any props you need! -->
      \${renderIsland(ExampleCounter, { count: 5 })}
    </div>
  \`;
});`)}
      <p>
        Read more about dynamic islands in the
        <a href="/docs/clientjs/islands">Islands Architecture</a> docs.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Dynamic Islands Example',
    content,
  });
});
