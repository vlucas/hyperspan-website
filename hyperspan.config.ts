import { createConfig } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';
import { memoryCacheTime } from './app/middleware';

export default createConfig({
  appDir: './app',
  staticFileRoot: './public',
  islandPlugins: [preactPlugin()],
  beforeRoutesAdded(app) {
    app.use('/docs/*', memoryCacheTime('1w'));
  },
});
