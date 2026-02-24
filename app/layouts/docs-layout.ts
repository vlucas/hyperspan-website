import { html } from '@hyperspan/html';
import MarketingLayout from '~/app/layouts/marketing-layout';
import { Icon } from '~/src/ui/icon';

import type { BaseLayoutProps } from './base-layout';
import type { Hyperspan as HS } from '@hyperspan/framework';

const docsNavMenu = () => html`
  <ul class="menu bg-base-200 rounded-box w-full">
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
`;

export default function DocsLayout(
  c: HS.Context,
  props: BaseLayoutProps
) {
  const { title, content } = props;
  const docLayout = html`
    <div class="drawer">
      <input id="docs-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col min-h-0">
        <div class="flex items-center gap-2 pl-4 pt-2 lg:hidden">
          <label for="docs-drawer" class="btn btn-ghost btn-square" aria-label="Open documentation menu">
            ${Icon('menu')}
          </label>
          <span class="text-sm text-base-content/80">Docs</span>
        </div>
        <div class="flex flex-1 gap-2 pl-2 lg:pl-0 lg:gap-12">
          <nav class="hidden w-64 shrink-0 lg:block">
            ${docsNavMenu()}
          </nav>
          <div class="flex-1 min-w-0">
            <div class="max-w-3xl mx-auto my-8 px-4 lg:px-8" id="root">${content}</div>
          </div>
        </div>
      </div>
      <div class="drawer-side z-30 lg:hidden">
        <label for="docs-drawer" aria-label="Close sidebar" class="drawer-overlay"></label>
        <aside class="bg-base-200 w-64 min-h-full p-4">
          ${docsNavMenu()}
        </aside>
      </div>
    </div>
  `;

  return MarketingLayout(c, { ...props, title: title + ' - Hyperspan Documentation', content: docLayout });
}
