import { html } from '@/src/hyperspan/html';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';

// Then register the languages you need
hljs.registerLanguage('typescript', typescript);

export function highlightTS(code: string) {
  const codeHighlighted = hljs.highlight(code, { language: 'typescript' }).value;
  return html`<pre><code class="language-typescript">${html.raw(codeHighlighted)}</code></pre>`;
}
