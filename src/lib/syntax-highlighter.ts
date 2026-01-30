import { html } from '@hyperspan/html';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import shell from 'highlight.js/lib/languages/shell';
import htmlLanguage from 'highlight.js/lib/languages/xml';

// Then register the languages you need
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('html', htmlLanguage);

export function highlightShell(code: string) {
  const codeHighlighted = hljs.highlight(code, { language: 'shell' }).value;
  return html`<pre><code class="language-typescript">${html.raw(codeHighlighted)}</code></pre>`;
}

export function highlightTS(code: string) {
  const codeHighlighted = hljs.highlight(code, { language: 'typescript' }).value;
  return html`<pre><code class="language-shell">${html.raw(codeHighlighted)}</code></pre>`;
}

export function highlightCode(code: string, language: string = 'html') {
  language = language || 'html';
  const codeHighlighted = hljs.highlight(code, { language: language }).value;
  return html`<pre><code class="language-${language}">${html.raw(codeHighlighted)}</code></pre>`;
}
