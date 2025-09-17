import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Actions</h1>
      <p>Something about actions...</p>
    </main>
  `;

  return DocsLayout({
    title: 'Actions',
    content,
  });
});
