import { createServer } from '@/src/hyperspan/server';
import { trimTrailingSlash } from 'hono/trailing-slash';

const app = await createServer({
  appDir: './app',
  staticFileRoot: './public',
});

// Any normal Hono middleware you want to use here...
app.use(trimTrailingSlash());

export default app;
