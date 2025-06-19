import './styles/build';
import { createServer } from '@hyperspan/framework';
import { cacheTime } from '@hyperspan/framework/middleware';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { preactPlugin } from '@hyperspan/plugin-preact';

const app = await createServer({
  appDir: './app',
  staticFileRoot: './public',
  islandPlugins: [preactPlugin()],
});

app.use(trimTrailingSlash());
app.use('/docs/*', cacheTime('1w'));

export default app;
