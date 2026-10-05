import { createDocsRoute } from '~/src/routes/create-docs-route';
import { renderDocsPage } from '~/src/routes/render-docs-page';
import { memoryCacheTime, isKnownAIBot } from '~/app/middleware';

export default createDocsRoute()
  .get(async (c) => {
    let page = c.req.url.pathname.replace(/^\/docs\/?/, '') || 'index';

    if (page.endsWith('/')) {
      return c.res.redirect(`/docs/${page.slice(0, -1)}`);
    }

    if (page === 'index') {
      return c.res.redirect('/docs');
    }

    return renderDocsPage(c, page);
  })
  .use(isKnownAIBot())
  .use(memoryCacheTime('1w'));
