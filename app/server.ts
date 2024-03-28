import { createServer, useFilesystemRouter } from '@hyperspan/server';

createServer({
  appDir: './app',
  staticFileRoot: './public',
  onRequest(req: Request) {
    return useFilesystemRouter(req);
  },
});
