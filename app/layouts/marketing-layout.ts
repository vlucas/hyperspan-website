import { html } from '@hyperspan/html';
import BaseLayout, { type BaseLayoutProps } from './base-layout';
import '~/app/styles/globals.css';

import type { Hyperspan as HS } from '@hyperspan/framework';

export default function MarketingLayout(
  c: HS.Context,
  { title, content, meta }: BaseLayoutProps
) {
  title = title + ' - Hyperspan Framework';
  const marketingContent = html`
    <!-- Main Content -->
    <main class="relative z-10">${content}</main>
  `;

  return BaseLayout(c, { title, content: marketingContent });
}
