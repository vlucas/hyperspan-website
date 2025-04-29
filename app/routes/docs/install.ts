import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Installation</h1>
      <p>
        To install Hyperspan, you first need to
        <a href="https://bun.sh/docs/installation">install Bun</a> &mdash; a new fast JavaScript
        runtime with TypeScript support built in.
      </p>

      <p>
        Since Hyperspan is still in development, there is no template setup yet to install from. If
        you are <em>really itching to try it out</em> though, you can clone the
        <a href="https://github.com/vlucas/hyperspan-website">hyperspan-website</a> repo (the one
        that powers this very site!) and use it as a starting point.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Installation',
    content,
  });
});
