import { html } from '@hyperspan/html';
import BaseLayout from './base-layout';
import '@/app/styles/globals.css';

import type { Hyperspan as HS } from '@hyperspan/framework';

export default function MarketingLayout(c: HS.Context, { title, content, meta }: { title: string; content: any; meta?: { description?: string } }) {
  title = title + ' - Hyperspan';
  const marketingContent = html`
    <div class="max-w-5xl m-auto">
      ${content}
    </div>
  `;

  return BaseLayout(c, { title, content: marketingContent });
}
