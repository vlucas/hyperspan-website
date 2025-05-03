import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Hyperspan Documentation</h1>
      <p>
        Hyperspan is an amazing framework for building web sites and applications with. If you have
        been stuck building websites and apps using only frontend frameworks for a few years,
        Hyperspan will feel much simpler and easier to work with.
      </p>
      <p>
        Some key features are very fast and lightweight streaming
        <a href="/docs/html">HTML Templates</a>, super <a href="/docs/routes">flexible routing</a>,
        and an <a href="/docs/islands-architecture">Islands Architecture</a> that ensures you only
        ship JavaScript to the client when you really want to.
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
