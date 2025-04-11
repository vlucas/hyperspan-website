import { html } from '@/src/hyperspan/html';
import { createRoute } from '@/src/hyperspan/server';
import MarketingLayout from '@/app/layouts/MarketingLayout';
import { sleep } from '@/src/lib/sleep';

export default createRoute(() => {
  const content = html`
    <main class="prose m-8">
      <h1>Streaming Content Example</h1>
      <p>
        Each content chunk will stream render in and render in-place whenever it is done loading.
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
            ${AsyncRenderBlock(5000, 'Rendered after 5000ms!')}
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
    </main>
  `;

  return MarketingLayout({
    title: 'Hyperspan - Simple. Server. Streaming.',
    content,
  });
});

async function AsyncRenderBlock(waitMs: number, msg: string) {
  await sleep(waitMs);

  return html`<div>${msg}</div>`;
}
