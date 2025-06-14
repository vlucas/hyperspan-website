import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Hyperspan Documentation</h1>
      <p>
        Hyperspan is a modern server-oriented TypeScript framework for building web sites and
        applications. Hyperspan is positioned somewhere between a more traditional server-side
        framework like Express and a newer frontend framework like Next.js. Hyperspan keeps most of
        the work and state on the server, but also supports using embedded React and Preact
        components with dynamic islands to add rich client-side interactivity to your application
        right where you need it, while shipping minimal JavaScript to the client.
      </p>
      <p>
        Hyperspan is built on top of <a href="https://hono.dev">Hono</a> and gives you full access
        to it, so it feels a lot <em>&quot;closer to the metal&quot;</em> than most modern frontend
        frameworks do today. It's also built using <a href="https://bun.sh">Bun</a> as the runtime,
        so there is <strong>no build or compile step</strong> required to run your code.
      </p>
      <p>
        Some key features that Hyperspan adds to the mix are fast, lightweight streaming
        <a href="/docs/html">HTML Templates</a>,
        <a href="/docs/routes">file-based &amp; flexible routes</a>, and an
        <a href="/docs/islands-architecture">Islands Architecture</a> that ensures you only ship
        JavaScript to the client when you really need to.
      </p>
      <p>
        Hyperspan is still under active development, but the core functionality is stable and
        production ready. Check out the <a href="/docs/install">Installation</a> page to get
        started!
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Get Started',
    content,
  });
});
