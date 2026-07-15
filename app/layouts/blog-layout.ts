import { html } from '@hyperspan/html';
import MarketingLayout from '~/app/layouts/marketing-layout';

import type { BaseLayoutProps } from './base-layout';
import type { Hyperspan as HS } from '@hyperspan/framework';

export default function BlogLayout(c: HS.Context, props: BaseLayoutProps) {
  const { title, content } = props;
  const blogLayout = html`
    <div class="max-w-3xl mx-auto my-8 px-4 lg:px-8" id="root">${content}</div>
  `;

  return MarketingLayout(c, { ...props, title: title + ' - Hyperspan Blog', content: blogLayout });
}
