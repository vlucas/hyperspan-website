import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import MarketingLayout from '@/app/layouts/MarketingLayout';

export default createRoute(() => {
  const content = html`
    <main>
      <div class="hero bg-base-200 min-h-96 py-12">
        <div class="hero-content text-center">
          <div class="max-w-3xl">
            <h1 class="my-6 text-5xl/14">
              Ditch The Complexity.<br />
              Keep the Power.
            </h1>
            <h2 class="my-10 text-2xl">Web Framework for High-Performance Sites and Apps.</h2>
            <p class="mt-10 my-6">
              Opinionated server-oriented framework built with TypeScript,
              <a href="https://hono.dev">Hono</a> and <a href="https://bun.sh">Bun</a>.
            </p>
            <p class="my-6">
              Tailwind, file-based routes, streaming templates, dynamic islands, and more.
            </p>
            <a class="my-6 btn btn-primary" href="/docs">Read The Docs</a>
          </div>
        </div>
      </div>
    </main>
  `;

  return MarketingLayout({
    title: 'Hyperspan - Simple. Server. Streaming.',
    content,
  });
});
