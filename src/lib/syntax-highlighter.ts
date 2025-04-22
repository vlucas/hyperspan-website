import { html } from '@hyperspan/html';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import shell from 'highlight.js/lib/languages/shell';

// Then register the languages you need
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('shell', shell);

export function highlightShell(code: string) {
  const codeHighlighted = hljs.highlight(code, { language: 'shell' }).value;
  return html`<pre><code class="language-typescript">${html.raw(codeHighlighted)}</code></pre>`;
}

export function highlightTS(code: string) {
  const codeHighlighted = hljs.highlight(code, { language: 'typescript' }).value;
  return html`<pre><code class="language-typescript">${html.raw(codeHighlighted)}</code></pre>`;
}
