import { html } from '@hyperspan/html';
import DocsLayout from '~/app/layouts/docs-layout';
import { renderMarkdownToHtml } from '~/src/lib/render-markdown';
import { readCollectionMarkdown } from '~/src/lib/read-collection-file';
import type { Hyperspan as HS } from '@hyperspan/framework';

export async function renderDocsPage(c: HS.Context, page: string) {
  const markdown = await readCollectionMarkdown('docs', page);

  if (!markdown) {
    return c.res.notFound();
  }

  if (c.vars.isKnownAIBot) {
    return new Response(markdown, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  const htmlContent = renderMarkdownToHtml(markdown);
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Documentation';
  const content = html` <main class="prose">${html.raw(htmlContent)}</main> `;

  return DocsLayout(c, {
    title,
    content,
  });
}
