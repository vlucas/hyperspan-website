import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>App Structure</h1>
      <p>
        Everything needed to build a Hyperspan app is contained in the <code>app</code> directory.
        This lets you maintain your own <code>src</code> directory structure for things that are
        specific to your app.
      </p>

      <h2>App Directory</h2>
      <p>The app directory structure is as follows:</p>
      <pre><code>app/
├── actions/     [coming soon!]
│   └── create-user.ts
├── layouts/     [not managed by Hyperspan, but recommended]
│   └── main-layout.ts
├── styles/      [global styles & Tailwind setup]
│   └── global.css
└── routes/      [all your routes go here]
    └── index.ts
    └── about.ts
    └── contact.ts
      </code></pre>
    </main>
  `;

  return DocsLayout({
    title: 'App Structure',
    content,
  });
});
