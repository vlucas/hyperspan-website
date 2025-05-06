import {html} from '@hyperspan/html';
import {createRoute} from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Environment Variables</h1>

      <p>
        Since Hyperspan uses Bun, loading environment variables from a <code>.env</code> file or the
        command line into <code>process.env</code> is automatic.
      </p>
      <p>
        Read the
        <a href="https://bun.sh/guides/runtime/set-env">Bun Environment Variables</a> documentation
        to get familiar with exactly how it works.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Environment Variables',
    content,
  });
});
