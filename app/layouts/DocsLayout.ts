import { html } from '@/src/hyperspan/html';
import MarketingLayout from './MarketingLayout';

export default function DocsLayout({ title, content }: { title: string; content: any }) {
  const docLayout = html`
    <div class="flex">
      <nav class="p-6">
        <ul class="menu bg-base-200 rounded-box w-56">
          <li><a href="/docs">Get Started</a></li>
          <li><a href="/docs/html">HTML Templates</a></li>
        </ul>
      </nav>

      <!-- for code highlighting in docs... -->
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tomorrow-night-bright.min.css"
      />
      <div class="p-6">${content}</div>
    </div>
  `;

  return MarketingLayout({ title: title + ' - Hyperspan Documentation', content: docLayout });
}
