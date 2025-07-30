import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import MarketingLayout from '@/app/layouts/marketing-layout';
import { highlightTS } from '@/src/lib/syntax-highlighter';
import { cacheTime } from '@hyperspan/framework/middleware';

export default createRoute(() => {
  const content = html`
    <main>
      <div class="hero bg-base-200 min-h-96 py-12">
        <div class="hero-content text-center">
          <div class="max-w-3xl">
            <h1 class="my-6 text-5xl/14">
              Less Complexity.<br />
              More Power.
            </h1>
            <h2 class="my-10 text-2xl">Web Framework for High-Performance Sites and Apps.</h2>
            <p class="mt-10 my-6">
              Opinionated server-oriented framework built with TypeScript,
              <a href="https://hono.dev">Hono</a> and <a href="https://bun.sh">Bun</a>.
            </p>
            <p class="my-6">File-based routes, streaming templates, dynamic islands, and more.</p>
            <a class="my-6 btn btn-outline" href="/docs">Read The Docs</a>
            <a class="my-6 btn btn-primary" href="/docs/install">Install Hyperspan</a>
          </div>
        </div>
      </div>

      <section>
        <div class="my-32 card lg:card-side bg-base-200 shadow-sm">
          <div class="card-body text-lg">
            <h2 class="card-title text-2xl mb-6">All TypeScript.</h2>
            <p>
              No special syntax to learn. No custom file extensions or formats. No special rules or
              weird semantics. No magic. No compiler (thanks Bun!). All TypeScript, all the way
              down.
            </p>
          </div>
          <div class="md:w-2/3 p-4 bg-base-300">
            ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute(async (context) => {
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

        <div class="my-32 card lg:card-side bg-base-200 shadow-sm">
          <div class="md:w-2/3 p-4 bg-base-300">
            ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute(() => {
  return html\`
    <div>
      <h1>Async Content Blocks:</h1>
      \${AsyncBlock(1000, "Content Block 1")}
      \${AsyncBlock(2000, "Content Block 2")}
    </div>
  \`;
});

async function AsyncBlock(waitMs: number, msg: string) {
  await sleep(waitMs);
  return html\`<div>\${msg}</div>\`;
}

`)}
          </div>
          <div class="card-body text-lg">
            <h2 class="card-title text-2xl mb-6">Streaming Templates.</h2>
            <p>
              Streaming responses by default for any template that contains async content. Send all
              your static content immediately for better
              <abbr title="Time To First Byte">TTFB</abbr>, then stream in each piece of dynamic
              content as it's ready. Automatic opt-outs for bots, crawlers, and AI.
            </p>
            <div class="card-actions">
              <a class="btn btn-outline" href="/examples/streaming">See Streaming Example</a>
            </div>
          </div>
        </div>

        <div class="my-32 card lg:card-side bg-base-200 shadow-sm">
          <div class="card-body text-lg">
            <h2 class="card-title text-2xl mb-6">Dynamic Islands.</h2>
            <p>
              Rich client-side interactivity with server-first performance. Only ship the JavaScript
              you need, when you need it.
            </p>
            <div class="card-actions">
              <a class="btn btn-outline" href="/docs/clientjs/islands">Islands Architecture Docs</a>
            </div>
          </div>
          <div class="md:w-2/3 p-4 bg-base-300">
            ${highlightTS(`import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import { renderIsland } from '@hyperspan/framework/assets';
import ExampleCounter from '@/src/components/example-counter.tsx';

export default createRoute(() => {
  return html\`
    <div>
      <!-- Call the renderIsland() function and pass any props you need! -->
      \${renderIsland(ExampleCounter, { count: 5 })}
    </div>
  \`;
});`)}
          </div>
        </div>
      </section>
    </main>
  `;

  return MarketingLayout({
    title: 'Hyperspan - Simple. Server. Streaming.',
    content,
  });
}).middleware([cacheTime('1w')]);
