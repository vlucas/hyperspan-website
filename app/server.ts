import { createServer } from '@hyperspan/server';

const app = await createServer({
  appDir: './app',
  staticFileRoot: './public',
});

Bun.serve({
  fetch(req: Request): Promise<Response> {
    return app.run(req);
  },
});
