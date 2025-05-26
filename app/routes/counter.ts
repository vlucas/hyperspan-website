import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import { renderIsland } from '@hyperspan/framework/assets';
import ClientCounter from '@/app/components/client-counter.tsx';
import MarketingLayout from '@/app/layouts/marketing-layout';

export default createRoute(() => {
  const content = html`
    <main>
      <h1 class="text-4xl font-bold">Simple. Server. Streaming.</h1>

      <div class="mt-12 card lg:card-side bg-base-300 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Client Components</h2>
          <p>You can embed React/Preact components into otherwise server-rendered static HTML!</p>
        </div>
        <figure class="p-10">${renderIsland(ClientCounter, { count: 5 })}</figure>
      </div>
    </main>
  `;

  return MarketingLayout({
    title: 'Counter Client Component',
    content,
  });
});
