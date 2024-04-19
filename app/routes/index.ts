import { html, HSTemplate } from '@hyperspan/html';
import MarketingLayout from '@app/layouts/MarketingLayout';
import ClientButton from '@app/components/Counter';

export default function IndexPage(req: Request): Promise<HSTemplate> {
  return MarketingLayout({
    title: 'Hyperspan Demo',
    children: html`
      <main>
        <div class="hero min-h-96 bg-base-200">
          <div class="hero-content text-center">
            <div class="max-w-md">
              <h1 class="text-4xl font-bold">Simple. Server. Streaming.</h1>
              <p class="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
                exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
              </p>
              <button class="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>

        <div class="mt-12 card lg:card-side bg-base-300 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Client Components</h2>
            <p>Just use a special syntax for client components...</p>
          </div>
          <figure class="p-10">${ClientButton({ count: 1 })}</figure>
        </div>
      </main>
    `,
  });
}
