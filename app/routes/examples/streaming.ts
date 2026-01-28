import { html, placeholder } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import MarketingLayout from '@/app/layouts/marketing-layout';
import { sleep } from '@/src/lib/sleep';
import { highlightTS } from '@/src/lib/syntax-highlighter';

export default createRoute().get((c) => {
  const content = html`
    <main class="prose pl-6">
      <h1>Streaming Content Example</h1>
      <p>
        Each content chunk will stream render in and render in-place whenever it is done loading.
        This is built into <a href="/docs/html">Hyperspan HTML Templates</a> and doesn't require any
        special syntax to enable &mdash; it is just calling an async function as a template
        variable.
      </p>

      <section class="flex gap-4">
        <div class="card bg-base-300 w-96 shadow-sm">
          <div class="card-body">
            <h2>Content Block 1</h2>
            <p>Waits 1000ms to render</p>
            ${AsyncRenderBlock(1000, 'Rendered after 1000ms!')}
          </div>
        </div>

        <div class="card bg-base-300 w-96 shadow-sm">
          <div class="card-body">
            <h2>Content Block 2</h2>
            <p>Waits 5000ms to render</p>
            ${placeholder(
    html`<div class="bg-base-200"><span class="loading loading-infinity loading-md"></span> Custom Loading...</div>`,
    AsyncRenderBlock(5000, 'Rendered after 5000ms!')
  )}
          </div>
        </div>

        <div class="card bg-base-300 w-96 shadow-sm">
          <div class="card-body">
            <h2>Content Block 3</h2>
            <p>Waits 3000ms to render</p>
            ${AsyncRenderBlock(3000, 'Rendered after 3000ms!')}
          </div>
        </div>
      </section>

      <h2>Example Streaming Code</h2>
      <p>The code to enable this streaming behavior is a simple <code>html</code> template:</p>
      ${highlightTS(`import { html, placeholder } from '@hyperspan/html';

const tmpl = html\`
  <section class="flex gap-4">
    <div class="card">
      <h2>Content Block 1</h2>
      <p>Waits 1000ms to render</p>
      \${AsyncRenderBlock(1000, 'Rendered after 1000ms!')}
    </div>

    <div class="card">
      <h2>Content Block 2</h2>
      <p>Waits 5000ms to render</p>
      \${placeholder(
        html\`<div class="bg-base-200"><span class="loading loading-infinity loading-md"></span> Custom Loading...</div>\`,
        AsyncRenderBlock(5000, 'Rendered after 5000ms!')
      )}
    </div>

    <div class="card">
      <h2>Content Block 3</h2>
      <p>Waits 3000ms to render</p>
      \${AsyncRenderBlock(3000, 'Rendered after 3000ms!')}
    </div>
  </section>
  \`;`)}

      <p><code>AsyncRenderBlock</code> is just a standard <code>async</code> function:</p>
      ${highlightTS(`async function AsyncRenderBlock(waitMs: number, msg: string) {
  await sleep(waitMs);

  return html\`<div>\${msg}</div>\`;
}`)}

      <p>There is no special &quot;flight&quot; syntax or anything else weird going on here. Just regular old streaming HTML with <code>slot</code> placeholders and <code>template</code> elements, plus a small JavaScript shim to replace the loading placeholders with the actual content when it streams in for wide browser compatibility. Hyperspan takes care of all of this for you. It just works.</p>
      <p>If you want to learn more about streaming in Hyperspan, check out the <a href="/docs/streaming">Streaming Documentation</a>.</p>
    </main>
  `;

  return MarketingLayout(c, {
    title: 'Streaming Content Example',
    content,
  });
});

async function AsyncRenderBlock(waitMs: number, msg: string) {
  await sleep(waitMs);

  return html`<div>${msg}</div>`;
}
