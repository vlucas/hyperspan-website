import { html } from '@hyperspan/html';
import MarketingLayout from '@app/layouts/MarketingLayout';
import ClientButton from '@app/components/Counter';

export default function IndexPage(req: Request) {
  return MarketingLayout({
    title: 'Counter Client Component',
    children: html`
      <main>
        <h1 class="text-4xl font-bold">Simple. Server. Streaming.</h1>

        <div class="mt-12 card lg:card-side bg-base-300 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Client Components</h2>
            <p>Just use a special syntax for client components...</p>
          </div>
          <figure class="p-10">${ClientButton()}</figure>
        </div>
      </main>
    `,
  });
}
