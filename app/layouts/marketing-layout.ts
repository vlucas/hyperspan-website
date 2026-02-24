import { html } from '@hyperspan/html';
import BaseLayout, { type BaseLayoutProps } from './base-layout';
import '~/app/styles/globals.css';

import type { Hyperspan as HS } from '@hyperspan/framework';

export default function MarketingLayout(
  c: HS.Context,
  props: BaseLayoutProps
) {
  const title = props.title + ' - Hyperspan Framework';
  const marketingContent = html`
    <!-- Main Content -->
    <main class="relative z-10">${props.content}</main>
  `;

  return BaseLayout(c, { ...props, title, content: marketingContent });
}
