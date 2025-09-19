import { createConfig } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';
import { memoryCacheTime } from './app/middleware';

export default createConfig({
  appDir: './app',
  staticFileRoot: './public',
  islandPlugins: [preactPlugin()],
  beforeRoutesAdded(app) {
    // Redirect non-www to www
    app.use('*', (c, next) => {
      const host = c.req.header('host');
      const isWww = host && host.startsWith('www.');
      const isApp = host && host.startsWith('app.');
      const isLocal = host && host.includes('localhost');

      if (!isLocal && !isWww && !isApp) {
        const url = new URL(c.req.url);
        const newUrl = `https://www.${host}${url.pathname}${url.search}`;
        return c.redirect(newUrl, 301);
      }

      return next();
    });

    // Cache docs pages
    app.use('/docs/*', memoryCacheTime('1w'));
  },
});
