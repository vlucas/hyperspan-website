import { html } from '@hyperspan/html';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import shell from 'highlight.js/lib/languages/shell';
import htmlLanguage from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';

import './syntax-highlighter-themes/tomorrow-night-bright.min.css';

// Then register the languages you need
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('bash', shell);
hljs.registerLanguage('sh', shell);
hljs.registerLanguage('html', htmlLanguage);
hljs.registerLanguage('xml', htmlLanguage);
hljs.registerLanguage('svelte', htmlLanguage);
hljs.registerLanguage('vue', htmlLanguage);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);

export function highlightShell(code: string) {
  const codeHighlighted = hljs.highlight(code, { language: 'shell' }).value;
  return html`<pre
    class="max-w-full overflow-x-auto"
  ><code class="language-shell">${html.raw(codeHighlighted)}</code></pre>`;
}

export function highlightTS(code: string) {
  const codeHighlighted = hljs.highlight(code, { language: 'typescript' }).value;
  return html`<pre
    class="max-w-full overflow-x-auto"
  ><code class="language-typescript">${html.raw(codeHighlighted)}</code></pre>`;
}

export function highlightCode(code: string, language: string = 'typescript') {
  language = language || 'typescript';
  const lang = hljs.getLanguage(language) ? language : 'typescript';
  const codeHighlighted = hljs.highlight(code, { language: lang }).value;
  return html`<pre
    class="max-w-full overflow-x-auto"
  ><code class="language-${language}">${html.raw(codeHighlighted)}</code></pre>`;
}
