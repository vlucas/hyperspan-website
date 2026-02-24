import { html } from '@hyperspan/html';
import MarketingLayout from '~/app/layouts/marketing-layout';
import { Icon } from '~/src/ui/icon';

import type { BaseLayoutProps } from './base-layout';
import type { Hyperspan as HS } from '@hyperspan/framework';

function DocsNavMenu(activePath: string) {
  const renderActiveClass = (path: string) => path === activePath ? 'menu-active' : '';

  return html`
  <ul class="menu bg-base-200 rounded-box w-full">
    <li>
      <h2 class="menu-title">Hyperspan</h2>
      <ul>
        <li class="${renderActiveClass('')}"><a href="/docs" class="link">Get Started</a></li>
        <li class="${renderActiveClass('philosophy')}"><a href="/docs/philosophy" class="link">Philosophy</a></li>
        <li class="${renderActiveClass('install')}"><a href="/docs/install" class="link">Installation</a></li>
        <li class="${renderActiveClass('config')}"><a href="/docs/config" class="link">Config</a></li>
      </ul>
    </li>

    <li>
      <h2 class="menu-title">Basics</h2>
      <ul>
        <li class="${renderActiveClass('routes')}"><a href="/docs/routes" class="link">Routes</a></li>
        <li class="${renderActiveClass('routes/composition')}"><a href="/docs/routes/composition" class="link">Route Composition</a></li>
        <li class="${renderActiveClass('actions')}"><a href="/docs/actions" class="link">Actions</a></li>
        <li class="${renderActiveClass('request-context')}"><a href="/docs/request-context" class="link">Request Context</a></li>
        <li class="${renderActiveClass('middleware')}"><a href="/docs/middleware" class="link">Middleware</a></li>
        <li class="${renderActiveClass('server')}"><a href="/docs/server" class="link">Server</a></li>
        <li class="${renderActiveClass('streaming')}"><a href="/docs/streaming" class="link">Streaming</a></li>
        <li class="${renderActiveClass('styles')}"><a href="/docs/styles" class="link">Styles &amp; CSS</a></li>
      </ul>
    </li>

    <li>
      <h2 class="menu-title">Client-Side JS</h2>
      <ul>
        <li class="${renderActiveClass('clientjs/islands')}"><a href="/docs/clientjs/islands" class="link">Islands Architecture</a></li>
        <li class="${renderActiveClass('clientjs/vanilla')}"><a href="/docs/clientjs/vanilla" class="link">Vanilla JS</a></li>
      </ul>
    </li>

    <li>
      <h2 class="menu-title">Structure</h2>
      <ul>
        <li class="${renderActiveClass('layouts')}"><a href="/docs/layouts" class="link">Layouts</a></li>
        <li class="${renderActiveClass('structure')}"><a href="/docs/structure" class="link">App Structure</a></li>
        <li class="${renderActiveClass('html')}"><a href="/docs/html" class="link">HTML Templates</a></li>
        <li class="${renderActiveClass('env')}"><a href="/docs/env" class="link">Environment Vars</a></li>
      </ul>
    </li>
  </ul>
`;
}

export default function DocsLayout(
  c: HS.Context,
  props: BaseLayoutProps
) {
  const { title, content } = props;
  const activePath = c.req.url.pathname.replace('/docs/', '');
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
          <nav class="hidden w-64 shrink-0 lg:block lg:sticky lg:top-0 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            ${DocsNavMenu(activePath)}
          </nav>
          <div class="flex-1 min-w-0">
            <div class="max-w-3xl mx-auto my-8 px-4 lg:px-8" id="root">${content}</div>
          </div>
        </div>
      </div>
      <div class="drawer-side z-30 lg:hidden">
        <label for="docs-drawer" aria-label="Close sidebar" class="drawer-overlay"></label>
        <aside class="bg-base-200 w-64 min-h-full p-4">
          ${DocsNavMenu(activePath)}
        </aside>
      </div>
    </div>
  `;

  return MarketingLayout(c, { ...props, title: title + ' - Hyperspan Documentation', content: docLayout });
}
