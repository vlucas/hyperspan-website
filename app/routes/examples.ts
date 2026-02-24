import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import ContentLayout from '~/app/layouts/content-layout';
import { memoryCacheTime } from '~/app/middleware';

export default createRoute().get((c) => {
  const content = html`
    <section class="max-w-7xl mx-auto px-6 mb-32 mt-24">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">Examples</h1>
        <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
          Explore Hyperspan features with these interactive examples.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <a
          href="/examples/actions"
          class="block p-6 rounded-lg border border-brand-border bg-brand-gray/50 hover:bg-brand-gray hover:border-brand-orange/50 transition-all group"
        >
          <h2 class="text-xl font-bold mb-2 group-hover:text-brand-orange transition-colors">
            Actions
          </h2>
          <p class="text-zinc-400 text-sm leading-relaxed">
            Progressively enhanced forms with validation, pending states, and server-rendered
            responses. Built with Zod and minimal JavaScript.
          </p>
          <span class="inline-block mt-4 text-brand-orange text-sm font-medium group-hover:underline">
            View example →
          </span>
        </a>

        <a
          href="/examples/streaming"
          class="block p-6 rounded-lg border border-brand-border bg-brand-gray/50 hover:bg-brand-gray hover:border-brand-orange/50 transition-all group"
        >
          <h2 class="text-xl font-bold mb-2 group-hover:text-brand-orange transition-colors">
            Streaming
          </h2>
          <p class="text-zinc-400 text-sm leading-relaxed">
            Content chunks that stream in and render in-place as they load. No special syntax
            required — just async template variables.
          </p>
          <span class="inline-block mt-4 text-brand-orange text-sm font-medium group-hover:underline">
            View example →
          </span>
        </a>

        <a
          href="/examples/dynamic-islands"
          class="block p-6 rounded-lg border border-brand-border bg-brand-gray/50 hover:bg-brand-gray hover:border-brand-orange/50 transition-all group"
        >
          <h2 class="text-xl font-bold mb-2 group-hover:text-brand-orange transition-colors">
            Dynamic Islands
          </h2>
          <p class="text-zinc-400 text-sm leading-relaxed">
            Embed dynamic Preact components in static HTML. Islands architecture with
            <code class="text-xs bg-base-300 px-1 rounded">renderPreactIsland</code>.
          </p>
          <span class="inline-block mt-4 text-brand-orange text-sm font-medium group-hover:underline">
            View example →
          </span>
        </a>
      </div>
    </section>
  `;

  return ContentLayout(c, { title: 'Examples', content });
}).use(memoryCacheTime('1w'));
