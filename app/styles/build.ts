import { $ } from 'bun';
import './globals.css';
import { buildClientCSS } from '@hyperspan/framework/assets';

/**
 * Build styles here while also importing the globals.css file so it will be re-run on file changes in --watch or --hot mode.
 *
 * This is a bit of a hack and is OS specific. This is only in place until a proper solution is made for building and hot reloading styles.
 */
async function buildStyles() {
  // Clean up old styles
  await $`rm ./public/styles.css 2> /dev/null || true && rm ./public/_hs/css/styles.css 2> /dev/null || true`;

  // Tailwind build
  await $`bunx @tailwindcss/cli -i ./app/styles/globals.css -o ./public/_hs/css/styles.css --minify`;

  // Now make Hyperspan aware of the new styles file
  await buildClientCSS();
}

buildStyles();
