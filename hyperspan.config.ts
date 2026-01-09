import { createConfig } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';

export default createConfig({
  appDir: './app',
  publicDir: './public',
  plugins: [preactPlugin()],

  beforeRoutesAdded(server) {
    // Redirect non-www to www
    server._middleware.push((c, next) => {
      const host = c.req.headers.get('host');
      const isWww = host && host.startsWith('www.');
      const isApp = host && host.startsWith('app.');
      const isLocal = host && host.includes('localhost');

      if (!isLocal && !isWww && !isApp) {
        const url = new URL(c.req.url);
        const newUrl = `https://www.${host}${url.pathname}${url.search}`;
        return c.res.redirect(newUrl, { status: 301 });
      }

      return next();
    });
  },

});
