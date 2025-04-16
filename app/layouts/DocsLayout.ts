import { html } from '@hyperspan/html';
import MarketingLayout from './MarketingLayout';

export default function DocsLayout({ title, content }: { title: string; content: any }) {
  const docLayout = html`
    <div class="flex gap-2">
      <div>${content}</div>
      <nav>
        <ul class="menu bg-base-200 rounded-box w-56">
          <li><a href="/docs">Get Started</a></li>
          <li><a href="/docs/html">HTML Templates</a></li>
        </ul>
      </nav>
    </div>
  `;

  return MarketingLayout({ title: title + ' - Hyperspan Documentation', content: docLayout });
}
