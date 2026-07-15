import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import BlogLayout from '~/app/layouts/blog-layout';
import { parseBlogPostFile } from '~/src/lib/blog-posts';
import { renderMarkdownToHtml } from '~/src/lib/render-markdown';
import { memoryCacheTime, isKnownAIBot } from '~/app/middleware';

function formatLongDateUtc(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(d);
}

export default createRoute().get(async (c) => {
  let page = c.req.url.pathname.replace(/^\/blog\/?/, '');

  if (page.endsWith('/')) {
    return c.res.redirect(`/blog/${page.slice(0, -1)}`);
  }

  if (page === 'index') {
    return c.res.redirect('/blog');
  }

  if (!page) {
    return c.res.notFound();
  }

  try {
    let file = Bun.file(`app/collections/blog/${page}.md`);
    const fileExists = await file.exists();

    if (!fileExists) {
      file = Bun.file(`app/collections/blog/${page}/index.md`);
    }

    const markdown = await file.text();

    if (!markdown) {
      return c.res.notFound();
    }

    if (c.vars.isKnownAIBot) {
      return new Response(file);
    }

    const post = parseBlogPostFile(page, markdown);
    const htmlContent = renderMarkdownToHtml(post.body);

    const dateLine =
      post.publishedAt && post.dateISO
        ? html`
            <p class="text-sm font-mono text-brand-orange not-prose mb-6">
              Published
              <time datetime="${post.dateISO}">${formatLongDateUtc(post.publishedAt)}</time>
            </p>
          `
        : '';

    const content = html`
      <main class="prose max-w-none">
        ${dateLine}
        ${html.raw(htmlContent)}
      </main>
    `;

    return BlogLayout(c, {
      title: post.title,
      content,
    });
  } catch (error) {
    console.error('Error loading markdown file:', error);
    return c.res.notFound();
  }
})
  .use(isKnownAIBot())
  .use(memoryCacheTime('1w'));
