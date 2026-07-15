import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import BlogLayout from '~/app/layouts/blog-layout';
import { blogPostSummaries } from '~/src/lib/blog-posts';
import { memoryCacheTime, isKnownAIBot } from '~/app/middleware';

const PAGE_SIZE = 20;

function formatLongDate(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(d);
}

export default createRoute().get((c) => {
  const url = new URL(c.req.url);
  const all = blogPostSummaries;

  if (c.vars.isKnownAIBot) {
    const lines = [
      '# Hyperspan Blog',
      '',
      'Post index (newest first). Each article is available as markdown at `/blog/{slug}` for known AI/LLM user agents.',
      '',
      ...all.map((p) => `- [${p.title}](https://www.hyperspan.dev/blog/${p.slug}) — ${p.dateISO}`),
      '',
    ];
    return new Response(lines.join('\n'), {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
  let page = parseInt(url.searchParams.get('page') || '1', 10);
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * PAGE_SIZE;
  const slice = all.slice(start, start + PAGE_SIZE);

  const pagination = html`
    <nav
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-12 pt-8 border-t border-brand-border not-prose"
      aria-label="Blog pagination"
    >
      <p class="text-sm font-mono text-base-content/70">
        Page ${page} of ${totalPages}
        ${total > 0 ? html` — ${total} post${total === 1 ? '' : 's'}` : ''}
      </p>
      <div class="flex flex-wrap gap-3">
        ${page > 1
          ? html`
              <a href="${page === 2 ? '/blog' : `/blog?page=${page - 1}`}" class="btn btn-outline btn-sm"
                >Newer posts</a
              >
            `
          : ''}
        ${page < totalPages
          ? html` <a href="/blog?page=${page + 1}" class="btn btn-outline btn-sm">Older posts</a> `
          : ''}
      </div>
    </nav>
  `;

  const list =
    slice.length === 0
      ? html`<p class="text-base-content/70 font-mono text-sm">No posts yet.</p>`
      : html`
          <ul class="space-y-10 list-none pl-0">
            ${slice.map(
              (p) => html`
                <li class="border-b border-brand-border pb-10 last:border-0">
                  <p class="text-sm font-mono text-brand-orange mb-2">${formatLongDate(p.date)}</p>
                  <h2 class="text-2xl font-bold mt-0 mb-2">
                    <a href="/blog/${p.slug}" class="link link-hover">${p.title}</a>
                  </h2>
                  ${p.description
                    ? html`<p class="text-base-content/80 mt-2 mb-0">${p.description}</p>`
                    : ''}
                </li>
              `
            )}
          </ul>
        `;

  const content = html`
    <main class="prose max-w-none">
      <h1 class="text-4xl font-bold tracking-tight">Hyperspan Blog</h1>
      <p class="text-lg text-base-content/80 font-mono">
        News, updates, and deep dives from the Hyperspan project.
      </p>
      ${list}
      ${totalPages > 1 ? pagination : ''}
    </main>
  `;

  return BlogLayout(c, {
    title: 'Blog',
    content,
    meta: {
      description: 'News, updates, and articles from the Hyperspan TypeScript web framework project.',
    },
  });
})
  .use(isKnownAIBot())
  .use(memoryCacheTime('1w'));
