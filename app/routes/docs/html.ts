import { html } from '@/src/hyperspan/html';
import { createRoute } from '@/src/hyperspan/server';
import DocsLayout from '@/app/layouts/DocsLayout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Hyperspan HTML Templates</h1>
      <p>
        HTML templates are the backbone of Hyperspan. They are the preferred way to render HTML
        content to the screen. They support streaming and aysnc content, and escape HTML by default
        in variables.
      </p>

      <p>Hyperspan HTML Templates...</p>
      <ol>
        <li>
          Are <strong>pure JavaScript</strong>. No special syntax to learn. No compile step
          required.
        </li>
        <li>
          Are <strong>extrememly lightweight</strong>. Source code with types is less than 300
          lines.
        </li>
        <li>
          Work in all JavaScript runtimes that support
          <a href="https://caniuse.com/template-literals">Template Literals</a>
          and
          <a href="https://caniuse.com/mdn-javascript_builtins_asyncgenerator">AsyncGenerator</a>
          (all major browsers, Bun, Deno, Node.js, Workers, Edge, etc.).
        </li>
        <li>Instantly separate <em>static content</em> from <em>async content</em>.</li>
        <li>
          Can render static template content immediately, with placeholders for async content with
          <code>render</code>.
        </li>
        <li>
          Can resolve async content <em>out of order</em> and then render it into the correct
          placeholders when it resolves.
        </li>
        <li>Run all async work in the same template concurrently, not one by one or blocking.</li>
        <li>Support unlimited levels of nested templates and nested async content.</li>
        <li>
          Can stream render with <code>renderStream</code> (returns <code>AsyncGenerator</code>)
        </li>
        <li>
          Can wait for all async work to finish before rendering with
          <code>renderAsync</code> (returns <code>string</code>)
        </li>
      </ol>
    </main>
  `;

  return DocsLayout({
    title: 'HTML Templates',
    content,
  });
});
