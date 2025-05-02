import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';
import { highlightShell } from '@/src/lib/syntax-highlighter';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Installation</h1>
      <p>
        To install Hyperspan, you first need to
        <a href="https://bun.sh/docs/installation">install Bun</a> &mdash; a new fast JavaScript
        runtime with TypeScript support (and a lot more!) built in.
      </p>

      <p>
        Once Bun is installed on your system, you can create a new Hyperspan app from the starter
        template:
      </p>
      ${highlightShell(`bunx degit vlucas/hyperspan/packages/starter-template my-app
cd my-app
bun install
bun run dev`)}

      <p>
        From there, you can add <a href="/docs/routes">custom routes</a>,
        <a href="/docs/layouts">layouts</a>, and
        <a href="/docs/islands-architecture">client components</a> to your app. The sky is the
        limit!
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Installation',
    content,
  });
});
