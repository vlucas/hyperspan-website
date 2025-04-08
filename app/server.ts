import { createServer } from '@/src/hyperspan/server';

const app = await createServer({
  appDir: './app',
  staticFileRoot: './public',
});

export default app;
