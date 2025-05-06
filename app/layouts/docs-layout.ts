import { html } from '@hyperspan/html';
import MarketingLayout from '@/app/layouts/marketing-layout';

export default function DocsLayout({ title, content }: { title: string; content: any }) {
  const docLayout = html`
    <div class="flex gap-2 pl-6">
      <div class="flex-1">${content}</div>
      <nav class="w-64">
        <ul class="menu bg-base-200 rounded-box">
          <li><a href="/docs">Get Started</a></li>
          <li><a href="/docs/philosophy">Philosophy</a></li>
          <li><a href="/docs/install">Installation</a></li>
          <li><a href="/docs/islands-architecture">Islands Architecture</a></li>
          <li><a href="/docs/html">HTML Templates</a></li>
          <li><a href="/docs/structure">App Structure</a></li>
          <li><a href="/docs/env">Environment</a></li>
          <li><a href="/docs/layouts">Layouts</a></li>
          <li><a href="/docs/routes">Routes</a></li>
        </ul>
      </nav>
    </div>
  `;

  return MarketingLayout({ title: title + ' - Hyperspan Documentation', content: docLayout });
}
