import { $ } from 'bun';
import './globals.css';
import { buildClientCSS } from '@hyperspan/framework/assets';
import { compile } from 'tailwindcss';
import { Scanner } from '@tailwindcss/oxide';

/**
 * Build styles here while also importing the globals.css file so it will be re-run on file changes in --watch or --hot mode.
 *
 * This is a bit of a hack and is OS specific. This is only in place until a proper solution is made for building and hot reloading styles.
 */
async function buildStyles() {
  await $`bunx @tailwindcss/cli -i ./app/styles/globals.css -o ./public/_hs/css/styles.css --minify`;

  // Now make Hyperspan aware of the new styles file
  await buildClientCSS();
}

/**
 * Build styles here while also importing the globals.css file so it will be re-run on file changes in --watch or --hot mode.
 *
 * This is a bit of a hack and is OS specific. This is only in place until a proper solution is made for building and hot reloading styles.
 */
export async function buildStyles2() {
  const base = './';
  const inputCSS = await Bun.file('./app/styles/globals.css').text();
  let compiler = await compile(inputCSS, {
    //from: 'stdin.css',
    base,
    async loadStylesheet(id, base) {
      console.log('LOAD STYLESHEET', id, base);
      return {
        path: id,
        base,
        content: await Bun.file(id).text(),
      };
    },
  });

  let sources = (() => {
    // Disable auto source detection
    if (compiler.root === 'none') {
      return [];
    }

    // No root specified, use the base directory
    if (compiler.root === null) {
      return [{ base, pattern: '**/*', negated: false }];
    }

    // Use the specified root
    return [{ ...compiler.root, negated: false }];
  })().concat(compiler.sources);

  let scanner = new Scanner({ sources });

  // Tailwind build
  const outputCSS = compiler.build(scanner.scan());
  console.log('OUTPUT CSS\n===========================================\n', outputCSS);
  await Bun.write('./public/_hs/css/styles.css', outputCSS);

  // Now make Hyperspan aware of the new styles file
  await buildClientCSS();
}

buildStyles();
