import { html } from '@hyperspan/html';
import { createDocsRoute } from '~/src/routes/create-docs-route';
import DocsLayout from '~/app/layouts/docs-layout';
import { renderMarkdownToHtml } from '~/src/lib/render-markdown';
import { memoryCacheTime, isKnownAIBot } from '~/app/middleware';

export default createDocsRoute().get(async (c) => {
  let page = c.req.url.pathname.replace('/docs/', '') || 'index';

  if (page.endsWith('/')) {
    return c.res.redirect(`/docs/${page.slice(0, -1)}`);
  }

  // Convert URL path to file path
  // e.g., "routes/pages" -> "routes/pages.md"
  // e.g., "clientjs/islands" -> "clientjs/islands.md"
  try {
    let file = Bun.file(`app/collections/docs/${page}.md`);
    const fileExists = await file.exists();

    if (!fileExists) {
      file = Bun.file(`app/collections/docs/${page}/index.md`);
    }

    const markdown = await file.text();

    if (!markdown) {
      return c.res.notFound();
    }

    // If the user agent is a known AI bot, return the markdown file content directly
    if (c.vars.isKnownAIBot) {
      return new Response(file);
    }

    const htmlContent = renderMarkdownToHtml(markdown);

    // Extract title from first h1
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'Documentation';

    const content = html` <main class="prose">${html.raw(htmlContent)}</main> `;

    return DocsLayout(c, {
      title,
      content,
    });
  } catch (error) {
    console.error('Error loading markdown file:', error);
    return c.res.notFound();
  }
})
  .use(isKnownAIBot())
  .use(memoryCacheTime('1w'));
