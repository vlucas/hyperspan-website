import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';
import MarketingLayout from '~/app/layouts/marketing-layout';
import { Icon } from '~/src/ui/icon';
import '~/app/styles/layout.css';
import { highlightTS } from '~/src/lib/syntax-highlighter';

export default createRoute().get((c) => {
  const title = 'Hyperspan - High-Performance TypeScript Framework';
  const content = html`
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-6 mb-32 mt-24">
      <div class="flex flex-col items-center text-center">

        <h1
          class="text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight mb-8 max-w-5xl leading-[0.9]"
        >
          Web Framework for <br />
          <span class="gradient-text">Dynamic High-Performance</span> Sites and Apps.
        </h1>

        <p class="text-zinc-300 text-lg md:text-xl max-w-3xl mb-12 font-mono">
          Server-first framework built with TypeScript and Bun. <br class="hidden md:block" />
          Zero JavaScript to the client by default.
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="/docs/install"
            id="hero-primary-cta"
            class="w-full sm:w-auto px-8 py-4 rounded bg-brand-orange text-brand-dark font-bold flex items-center justify-center gap-2 hover:bg-white transition-all transform hover:-translate-y-1"
          >
            Install Hyperspan
            ${Icon('arrow_forward')}
          </a>
          <a
            href="/docs"
            id="hero-secondary-cta"
            class="w-full sm:w-auto px-8 py-4 rounded bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            Read The Docs
          </a>
        </div>

        <div class="mt-16 flex items-center gap-12 text-sm font-mono text-zinc-400">
          <div class="flex flex-col items-center gap-2">
            <span class="text-brand-blue font-bold text-2xl">0kb</span>
            <span>Client-Side JS</span>
          </div>
          <div class="w-px h-10 bg-brand-border"></div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-brand-orange font-bold text-2xl">Zero</span>
            <span>Magic</span>
          </div>
          <div class="w-px h-10 bg-brand-border"></div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-brand-purple font-bold text-2xl">90+</span>
            <span>Lighthouse Core</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TypeScript Section -->
    <section class="max-w-7xl mx-auto px-6 mb-32">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div class="space-y-8">
          <h2 class="text-4xl font-bold tracking-tight">
            <span class="text-brand-orange">All TypeScript</span>. <br />
            Zero Magic.
          </h2>
          <p class="text-zinc-400 text-lg leading-relaxed">
            No special syntax to learn. No custom file extensions or weird semantics. All
            TypeScript, all the way down. Hyperspan leverages Bun for incredible speed without the
            need for a complex compiler.
          </p>
          <ul class="space-y-4 font-mono">
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-orange')}
              <span>File-based and custom routing included</span>
            </li>
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-purple')}
              <span>Simple HTML templates with <code>async</code>/<code>await</code></span>
            </li>
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-blue')}
              <span>Built-in Server Actions with Zod schema validation</span>
            </li>
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-orange')}
              <span>Dynamic Islands for rich client-side interactivity</span>
            </li>
          </ul>
        </div>

        <div class="relative">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-purple rounded-xl blur-2xl opacity-20"
          ></div>
          <div
            class="relative bg-brand-dark rounded-xl border border-brand-border overflow-hidden glow-orange shadow-2xl"
          >
            <div
              class="terminal-header h-10 flex items-center px-4 gap-2 border-b border-brand-border"
            >
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-500/30"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/30"></div>
              </div>
              <div class="flex-1 text-center">
                <span class="text-[11px] text-zinc-500 font-mono">app/routes/posts.ts</span>
              </div>
            </div>
            <div class="p-6 font-mono text-[14px] leading-relaxed">
              ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute().get(async (c) => {
  const posts = await fetchPosts();

  return html\`
    <div>
      <h1>Posts</h1>
      <ul>
        \${posts.map((post) => html\`<li>\${post.title}</li>\`)}
      </ul>
    </div>
  \`;
});
`)}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="max-w-7xl mx-auto px-6 mb-32">
      <div class="grid md:grid-cols-3 border border-brand-border rounded-2xl overflow-hidden">
        <!-- Feature 1 -->
        <div
          class="p-10 border-b md:border-b-0 md:border-r border-brand-border hover:bg-white/[0.02] transition-colors"
        >
          <div
            class="w-12 h-12 rounded bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6"
          >
            ${Icon('bolt', 'text-2xl')}
          </div>
          <h3 class="text-xl font-bold mb-3">Zero JS Runtime</h3>
          <p class="text-zinc-400 leading-relaxed font-mono text-sm">
            Most pages don't need hydration. Hyperspan only ships client-side JavaScript for dynamic islands and other client-side scripts you
            explicitly define.
          </p>
        </div>

        <!-- Feature 2 -->
        <div
          class="p-10 border-b md:border-b-0 md:border-r border-brand-border hover:bg-white/[0.02] transition-colors"
        >
          <div
            class="w-12 h-12 rounded bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-6"
          >
            ${Icon('dashboard', 'text-2xl')}
          </div>
          <h3 class="text-xl font-bold mb-3">File &amp; Custom Routing</h3>
          <p class="text-zinc-400 leading-relaxed font-mono text-sm">
            Built-in file-based and custom routing, full access to the Request context, real middleware with data passing, and full support for streaming HTML content.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="p-10 hover:bg-white/[0.02] transition-colors">
          <div
            class="w-12 h-12 rounded bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6"
          >
            ${Icon('storage', 'text-2xl')}
          </div>
          <h3 class="text-xl font-bold mb-3">Server Actions</h3>
          <p class="text-zinc-400 leading-relaxed font-mono text-sm">
            Form submissions and data mutations with built-in Zod schema validation, error handling, and responses that update in-place, HTMX-style. Keep all the code and logic on the server where it belongs.
          </p>
        </div>
      </div>
    </section>

    <!-- Streaming Section -->
    <section class="max-w-7xl mx-auto px-6 mb-32">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div class="relative">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-purple rounded-xl blur-2xl opacity-20"
          ></div>
          <div
            class="relative bg-brand-dark rounded-xl border border-brand-border overflow-hidden glow-orange shadow-2xl"
          >
            <div
              class="terminal-header h-10 flex items-center px-4 gap-2 border-b border-brand-border"
            >
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-500/30"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/30"></div>
              </div>
              <div class="flex-1 text-center">
                <span class="text-[11px] text-zinc-500 font-mono">app/routes/streaming.ts</span>
              </div>
            </div>
            <div class="p-6 font-mono text-[14px] leading-relaxed">
              ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute().get(() => {
  return html\`
    <div>
      <h1>Async Content Blocks:</h1>
      \${AsyncBlock(1000, "Resolves after 1 second")}
      \${AsyncBlock(2000, "Resolves after 2 seconds")}
    </div>
  \`;
});

async function AsyncBlock(waitMs: number, msg: string) {
  await sleep(waitMs);
  return html\`<div>\${msg}</div>\`;
}`)}
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <h2 class="text-4xl font-bold tracking-tight">
            <span class="text-brand-orange">Streaming Content</span>. <br />
            Zero Effort.
          </h2>
          <p class="text-zinc-400 text-lg leading-relaxed">
            Streaming responses by default for any template that contains unresolved promises. Send all
              your static content immediately for better
              <abbr title="Time To First Byte">TTFB</abbr>, then stream in each piece of dynamic
              content as it's ready.
          </p>
          <ul class="space-y-4 font-mono">
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-orange')}
              <span>Promise values in templates automatically enable streaming (<code>await</code> all content to disable)</span>
            </li>
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-purple')}
              <span>No special &quot;flight&quot; syntax - just streaming HTML</span>
            </li>
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-blue')}
              <span>Automatic opt-outs for bots, crawlers, and AI</span>
            </li>
          </ul>
          <div class="flex gap-4">
            <a
            href="/docs/streaming"
            class="w-full sm:w-auto px-8 py-4 rounded bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            title="Learn more about streaming content in Hyperspan"
            >
              Learn More
            </a>
            <a
            href="/examples/streaming"
            class="w-full sm:w-auto px-8 py-4 rounded bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              See Streaming Example ${Icon('arrow_forward')}
            </a>
          </div>
        </div>
      </div>
    </section>

    <hr class="my-32 border-brand-border" />

    <!-- Islands Section -->
    <section class="max-w-7xl mx-auto px-6 mb-32">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div class="space-y-8">
          <h2 class="text-4xl font-bold tracking-tight">
            <span class="text-brand-orange">Full Interactivity</span>. <br />
            Zero Penalty.
          </h2>
          <p class="text-zinc-400 text-lg leading-relaxed">
            Rich client-side interactivity without full-page hydration.
          </p>
          <ul class="space-y-4 font-mono">
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-purple')}
              <span>Preact/React Islands for rich client-side interactivity</span>
            </li>
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-blue')}
              <span>Server-side rendering (SSR) on by default for SEO</span>
            </li>
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-orange')}
              <span>Lazy loading &amp; hydration options per island</span>
            </li>
          </ul>
          <div class="flex gap-4">
            <a
            href="/docs/clientjs/islands"
            class="w-full sm:w-auto px-8 py-4 rounded bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            title="Learn more about dynamic islands in Hyperspan"
            >
              Learn More
            </a>
            <a
            href="/examples/dynamic-islands"
            class="w-full sm:w-auto px-8 py-4 rounded bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              See Islands Example ${Icon('arrow_forward')}
            </a>
          </div>
        </div>

        <div class="relative">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-purple rounded-xl blur-2xl opacity-20"
          ></div>
          <div
            class="relative bg-brand-dark rounded-xl border border-brand-border overflow-hidden glow-orange shadow-2xl"
          >
            <div
              class="terminal-header h-10 flex items-center px-4 gap-2 border-b border-brand-border"
            >
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-500/30"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/30"></div>
              </div>
              <div class="flex-1 text-center">
                <span class="text-[11px] text-zinc-500 font-mono">app/routes/islands.ts</span>
              </div>
            </div>
            <div class="p-6 font-mono text-[14px] leading-relaxed">
              ${highlightTS(`import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import { renderPreactIsland } from '@hyperspan/plugin-preact';
import ExampleCounter from '~/src/components/example-counter.tsx';

export default createRoute().get(() => {
  return html\`
    <div>
      \${renderPreactIsland(ExampleCounter, { count: 5 })}
    </div>
  \`;
});`)}
            </div>
          </div>
        </div>
      </div>
    </section>

    <hr class="my-32 border-brand-border" />

    <!-- Server Actions Section -->
    <section class="max-w-7xl mx-auto px-6 mb-32">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div class="relative">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-purple rounded-xl blur-2xl opacity-20"
          ></div>
          <div
            class="relative bg-brand-dark rounded-xl border border-brand-border overflow-hidden glow-orange shadow-2xl"
          >
            <div
              class="terminal-header h-10 flex items-center px-4 gap-2 border-b border-brand-border"
            >
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-500/30"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/30"></div>
              </div>
              <div class="flex-1 text-center">
                <span class="text-[11px] text-zinc-500 font-mono">app/actions/example-action.ts</span>
              </div>
            </div>
            <div class="p-6 font-mono text-[14px] leading-relaxed">
              ${highlightTS(`import { createAction } from '@hyperspan/framework/actions';
import { html } from '@hyperspan/html';
import { z } from 'zod/v4';

export default createAction({
  name: 'example-action',
  schema: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
})
  .form((c, { data, error }) => {
    return html\`<form method="post">
      \${error && html\`<div class="alert">\${error.message}</div>\`}
      <input type="text" name="name" value="\${data?.name}" />
      <button type="submit">Submit</button>
    </form>\`;
  })
  .post(async (c, { data }) => {
    return html\`<p>Hello, \${data.name}!</p>\`;
  });
`)}
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <h2 class="text-4xl font-bold tracking-tight">
            <span class="text-brand-orange">Server Actions</span>. <br />
            Zero Client Logic.
          </h2>
          <p class="text-zinc-400 text-lg leading-relaxed">
            Actions render forms that submit their data back to the server and update the view
              in-place automatically. Keep all your validation and logic on the
              server where it belongs.
          </p>
          <ul class="space-y-4 font-mono">
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-orange')}
              <span>Built-in Zod schema validation</span>
            </li>
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-purple')}
              <span>Type-safe data and field-specific error messages</span>
            </li>
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-blue')}
              <span>Automatic error handling and responses</span>
            </li>
            <li class="flex items-start gap-3">
              ${Icon('check', 'mt-1 text-brand-orange')}
              <span>Full route middleware support for auth, etc.</span>
            </li>
          </ul>
          <div class="flex gap-4">
            <a
            href="/docs/actions"
            class="w-full sm:w-auto px-8 py-4 rounded bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            title="Learn more about server actions in Hyperspan"
            >
              Learn More
            </a>
            <a
            href="/examples/actions"
            class="w-full sm:w-auto px-8 py-4 rounded bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              See Actions Example ${Icon('arrow_forward')}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Bottom -->
    <section class="max-w-7xl mx-auto px-6 mb-32">
      <div
        class="bg-brand-gray/50 border border-brand-border rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-brand-purple to-brand-blue"
        ></div>
        <h2 class="text-4xl md:text-5xl font-bold mb-8">Ready to build faster?</h2>
        <p class="text-zinc-400 text-lg mb-12 font-mono">
          Start your next project with Hyperspan in seconds.
        </p>

        <div class="flex flex-col md:flex-row items-center justify-center gap-6">
          <div
            class="bg-brand-dark border border-brand-border px-6 py-4 rounded-xl font-mono text-brand-orange text-lg flex items-center gap-4"
          >
            <span class="text-zinc-600">$</span>
            <span>bunx hyperspan create MyApp</span>
            <button id="copy-btn" class="text-zinc-500 hover:text-white transition-colors">
              ${Icon('content_copy')}
            </button>
          </div>
          <a
            href="/docs/install"
            id="cta-bottom-btn"
            class="px-8 py-4 rounded bg-white text-brand-dark font-bold hover:bg-brand-orange hover:text-brand-dark transition-all"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </section>
    `;

  return MarketingLayout(c, {
    title,
    content,
    meta: {
      description: 'Hyperspan Web Framework for Dynamic High-Performance Sites and Apps. Zero JavaScript to the client by default.',
    },
  });
});
