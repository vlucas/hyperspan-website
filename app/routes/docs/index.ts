import { createDocsRoute } from '~/src/routes/create-docs-route';
import { renderDocsPage } from '~/src/routes/render-docs-page';
import { memoryCacheTime, isKnownAIBot } from '~/app/middleware';

export default createDocsRoute()
  .get((c) => renderDocsPage(c, 'index'))
  .use(isKnownAIBot())
  .use(memoryCacheTime('1w'));
