import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import MarketingLayout from '@/app/layouts/MarketingLayout';

export default createRoute(() => {
  const content = html`
    <main class="prose pl-6">
      <h1>Actions Example</h1>
      <p>
        Actions in Hyperspan are progressively enhanced <code>&lt;form&gt;</code> elements that can
        be used to perform data mutations.
      </p>
      <p>
        Hyperspan Actions feature data validation with <a href="https://zod.dev">Zod v4.x</a> and
        can automatically update the UI with pending states, errors, and server-rendered responses
        in place.
      </p>
      <p>Docs and examples on this coming soon...</p>
    </main>
  `;

  return MarketingLayout({
    title: 'Actions Example',
    content,
  });
});
