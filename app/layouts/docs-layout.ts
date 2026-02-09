import { html } from '@hyperspan/html';
import MarketingLayout from '@/app/layouts/marketing-layout';

import type { Hyperspan as HS } from '@hyperspan/framework';

export default function DocsLayout(c: HS.Context, { title, content }: { title: string; content: any }) {
  const docLayout = html`
    <div class="flex gap-2 pl-6">
      <div class="flex-1">
        <div class="w-screen-lg m-auto my-8" id="root">${content}</div>
      </div>
      <nav class="w-64">
        <ul class="menu bg-base-200 rounded-box">
          <li class="menu-title">Hyperspan</li>
          <li><a href="/docs">Get Started</a></li>
          <li><a href="/docs/philosophy">Philosophy</a></li>
          <li><a href="/docs/install">Installation</a></li>
          <li><a href="/docs/config">Config</a></li>

          <li class="menu-title">Basics</li>
          <li><a href="/docs/routes">Routes</a></li>
          <li><a href="/docs/routes/composition">Route Composition</a></li>
          <li><a href="/docs/actions">Actions</a></li>
          <li><a href="/docs/request-context">Request Context</a></li>
          <li><a href="/docs/middleware">Middleware</a></li>
          <li><a href="/docs/server">Server</a></li>
          <li><a href="/docs/streaming">Streaming</a></li>
          <li><a href="/docs/styles">Styles &amp; CSS</a></li>
          

          <li class="menu-title">Client-Side JS</li>
          <li><a href="/docs/clientjs/islands">Islands Architecture</a></li>
          <li><a href="/docs/clientjs/vanilla">Vanilla JS</a></li>

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
