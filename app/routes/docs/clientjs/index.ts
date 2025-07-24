import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Client-Side JavaScript</h1>
      <p>
        Hyperspan is a server-oriented framework, which means that
        <strong>all JavaScript code that is sent to the client is explicitly opt-in</strong>.
      </p>
      <p>There are a few different ways to use client-side JavaScript in Hyperspan:</p>
      <ul>
        <li>
          <a href="/docs/clientjs/islands">Islands</a> - A great way to use React or Preact
          components in your app.
        </li>
        <li>
          <a href="/docs/clientjs/vanilla">Vanilla JavaScript</a> - A built-in way to use
          <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"
            >ES Modules</a
          >
          to ship your own JavaScript code to the browser.
        </li>
      </ul>
    </main>
  `;

  return DocsLayout({
    title: 'Client-Side JavaScript',
    content,
  });
});
