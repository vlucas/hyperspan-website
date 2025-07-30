import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Environment Variables</h1>

      <p>
        Since Hyperspan uses Bun, loading environment variables from a <code>.env</code> file or the
        command line into <code>process.env</code> is automatic and built-in.
      </p>
      <p>
        Read the
        <a href="https://bun.sh/guides/runtime/set-env">Bun Environment Variables</a> documentation
        to get familiar with exactly how it works.
      </p>

      <h2>Using Environment Variables in Client-Side Code</h2>
      <p>
        If you need to use environment variables in client-side code like Preact components, you
        need to prefix them with
        <code>APP_PUBLIC_</code>.
      </p>
      <p>
        For example, if you have an environment variable called <code>API_URL</code> that you need
        to use in a client component, you should name the variable
        <code>APP_PUBLIC_API_URL</code> in your <code>.env</code> file.
      </p>
      <p>
        When you access it in your client component, you can use
        <code>process.env.APP_PUBLIC_API_URL</code>. Any environment variables used in client
        components that start with <code>APP_PUBLIC_</code> will be automatically inlined into the
        component on build as strings (when they are imported with an
        <a href="/docs/clientjs/islands">island plugin</a>) so that the
        <code>process.env</code> object is removed from the end result.
      </p>
      <p>
        This ensures that sensitive environment variables are not inadvertenly exposed or leaked to
        the client.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Environment Variables',
    content,
  });
});
