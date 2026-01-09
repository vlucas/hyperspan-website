import { html } from '@hyperspan/html';
import MarketingLayout from '@/app/layouts/marketing-layout';

import type { Hyperspan as HS } from '@hyperspan/framework';

export default function DocsLayout(c: HS.Context, { title, content }: { title: string; content: any }) {
  const docLayout = html`
    <div class="flex gap-2 pl-6">
      <div class="flex-1">${content}</div>
      <nav class="w-64">
        <ul class="menu bg-base-200 rounded-box">
          <li class="menu-title">Hyperspan</li>
          <li><a href="/docs">Get Started</a></li>
          <li><a href="/docs/philosophy">Philosophy</a></li>
          <li><a href="/docs/install">Installation</a></li>

          <li class="menu-title">Client-Side JS</li>
          <li><a href="/docs/clientjs/islands">Islands Architecture</a></li>
          <li><a href="/docs/clientjs/vanilla">Vanilla JS</a></li>

          <li class="menu-title">Routes</li>
          <li><a href="/docs/routes">Routing Basics</a></li>
          <li><a href="/docs/routes/pages">Page Routes</a></li>
          <li><a href="/docs/routes/api">API Routes</a></li>

          <li class="menu-title">Structure</li>
          <li><a href="/docs/layouts">Layouts</a></li>
          <li><a href="/docs/structure">App Structure</a></li>
          <li><a href="/docs/html">HTML Templates</a></li>
          <li><a href="/docs/env">Environment Vars</a></li>
        </ul>
      </nav>
    </div>
  `;

  return MarketingLayout(c, { title: title + ' - Hyperspan Documentation', content: docLayout });
}
