import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Hyperspan Documentation</h1>
      <p>
        The full Hyperspan web framework is still in progress and is not fully released yet, but you
        can use the very fast and lightweight streaming <a href="/docs/html">HTML Templates</a> in
        any JavaScript or TypeScript project. No build step required.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Get Started',
    content,
  });
});
