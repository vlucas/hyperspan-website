import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import ContentLayout from '~/app/layouts/content-layout';
import { highlightTS } from '~/src/lib/syntax-highlighter';
import { renderPreactIsland } from '@hyperspan/plugin-preact';
import { renderVueIsland } from '@hyperspan/plugin-vue';
import { renderSvelteIsland } from '@hyperspan/plugin-svelte';
import ReactCounter from '~/app/components/client-counter.tsx';
import VueCounter from '~/app/components/client-counter-vue.vue';
import SvelteCounter from '~/app/components/client-counter-svelte.svelte';

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
        ${renderPreactIsland(ReactCounter, { count: 5 })}
        ${await renderVueIsland(VueCounter, { count: 10 })}
        ${await renderSvelteIsland(SvelteCounter, { count: 15 })}
      </div>

      <h2>Code Example:</h2>
      <p>
        Once your island plugins are loaded, use each plugin's render function to render and hydrate
        your component.
      </p>
      ${highlightTS(`import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import { renderPreactIsland } from '@hyperspan/plugin-preact';
import { renderVueIsland } from '@hyperspan/plugin-vue';
import { renderSvelteIsland } from '@hyperspan/plugin-svelte';
import ReactCounter from '~/app/components/client-counter.tsx';
import VueCounter from '~/app/components/client-counter-vue.vue';
import SvelteCounter from '~/app/components/client-counter-svelte.svelte';

export default createRoute().get(async () => {
  return html\`
    <div>
      \${renderPreactIsland(ReactCounter, { count: 5 })}
      \${await renderVueIsland(VueCounter, { count: 10 })}
      \${await renderSvelteIsland(SvelteCounter, { count: 15 })}
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
