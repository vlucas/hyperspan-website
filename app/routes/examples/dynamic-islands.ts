import { html } from '@hyperspan/html';
import { createRoute, renderIsland } from '@hyperspan/framework';
import ContentLayout from '~/app/layouts/content-layout';
import { highlightTS } from '~/src/lib/syntax-highlighter';
import ReactCounter from '~/app/components/client-counter.tsx' with { island: 'preact' };
import VueCounter from '~/app/components/client-counter-vue.vue' with { island: 'vue' };
import SvelteCounter from '~/app/components/client-counter-svelte.svelte' with { island: 'svelte' };

export default createRoute().get(async (c) => {
  const content = html`
    <main class="prose">
      <h1>Dynamic Islands Example</h1>
      <p>
        This example shows how to embed dynamic client islands using
        <a class="link" href="https://preactjs.com">React/Preact</a>,
        <a class="link" href="https://vuejs.org">Vue</a>, and
        <a class="link" href="https://svelte.dev">Svelte</a> components in otherwise static HTML content.
      </p>

      <h2>Embedded Client Counters:</h2>
      <div class="grid gap-6">
        ${renderIsland(ReactCounter, { count: 5 })}
        ${await renderIsland(VueCounter, { count: 10 })}
        ${await renderIsland(SvelteCounter, { count: 15 })}
      </div>

      <h2>Code Example:</h2>
      <p>
        Import each component with an island attribute, then render it with
        <code>renderIsland</code> from <code>@hyperspan/framework</code>.
      </p>
      ${highlightTS(`import { html } from '@hyperspan/html';
import { createRoute, renderIsland } from '@hyperspan/framework';
import ReactCounter from '~/app/components/client-counter.tsx' with { island: 'preact' };
import VueCounter from '~/app/components/client-counter-vue.vue' with { island: 'vue' };
import SvelteCounter from '~/app/components/client-counter-svelte.svelte' with { island: 'svelte' };

export default createRoute().get(async () => {
  return html\`
    <div>
      \${renderIsland(ReactCounter, { count: 5 })}
      \${await renderIsland(VueCounter, { count: 10 })}
      \${await renderIsland(SvelteCounter, { count: 15 })}
    </div>
  \`;
});`)}
      <p>
        Read more about dynamic islands in the
        <a href="/docs/clientjs/islands">Islands Architecture</a> docs.
      </p>
    </main>
  `;

  return ContentLayout(c, {
    title: 'Dynamic Islands Example',
    content,
  });
});
