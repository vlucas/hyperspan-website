import { render } from '@hyperspan/html';
import { highlightCode, highlightShell, highlightTS } from '~/src/lib/syntax-highlighter';

const parserOptions: Bun.markdown.Options = {
  autolinks: true,
  hardSoftBreaks: true,
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Bun.markdown already escapes text nodes that compose fenced code; undo that before hljs. */
function unescapeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function renderHighlightedCodeBlock(code: string, language?: string): string {
  // Fenced code children are HTML-escaped via the `text` callback; highlight.js escapes again.
  const source = unescapeHtml(code);
  const lang = language?.toLowerCase();
  // Default to TypeScript — most docs examples are framework / TS usage.
  if (!lang || lang === 'typescript' || lang === 'ts' || lang === 'tsx') {
    return render(highlightTS(source));
  }
  if (lang === 'javascript' || lang === 'js') {
    return render(highlightCode(source, 'javascript'));
  }
  if (lang === 'shell' || lang === 'bash' || lang === 'sh') {
    return render(highlightShell(source));
  }
  return render(highlightCode(source, lang));
}

const markdownRenderCallbacks: Bun.markdown.RenderCallbacks = {
  heading: (children, { level, id }) =>
    id
      ? `<h${level} id="${escapeHtml(id)}">${children}</h${level}>\n`
      : `<h${level}>${children}</h${level}>\n`,
  paragraph: (children) => `<p>${children}</p>\n`,
  blockquote: (children) => `<blockquote>\n${children}</blockquote>\n`,
  code: (children, meta) => renderHighlightedCodeBlock(children, meta?.language),
  list: (children, { ordered, start }) => {
    if (ordered) {
      const startAttr = start !== undefined && start !== 1 ? ` start="${start}"` : '';
      return `<ol${startAttr}>\n${children}</ol>\n`;
    }
    return `<ul>\n${children}</ul>\n`;
  },
  listItem: (children, meta) => {
    if (meta.checked === true) {
      return `<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" disabled checked>${children}</li>\n`;
    }
    if (meta.checked === false) {
      return `<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" disabled>${children}</li>\n`;
    }
    return `<li>${children}</li>\n`;
  },
  hr: () => `<hr />\n`,
  table: (children) => `<table>\n${children}</table>\n`,
  thead: (children) => `<thead>\n${children}</thead>\n`,
  tbody: (children) => `<tbody>\n${children}</tbody>\n`,
  tr: (children) => `<tr>\n${children}</tr>\n`,
  th: (children, meta) =>
    `<th${meta?.align ? ` align="${escapeHtml(meta.align)}"` : ''}>${children}</th>\n`,
  td: (children, meta) =>
    `<td${meta?.align ? ` align="${escapeHtml(meta.align)}"` : ''}>${children}</td>\n`,
  html: (children) => children,
  strong: (children) => `<strong>${children}</strong>`,
  emphasis: (children) => `<em>${children}</em>`,
  link: (children, meta) =>
    `<a href="${escapeHtml(meta.href)}"${meta.title ? ` title="${escapeHtml(meta.title)}"` : ''}>${children}</a>`,
  image: (alt, meta) =>
    `<img src="${escapeHtml(meta.src)}" alt="${alt}"${meta.title ? ` title="${escapeHtml(meta.title)}"` : ''} />`,
  codespan: (children) => `<code>${children}</code>`,
  strikethrough: (children) => `<del>${children}</del>`,
  text: (text) => escapeHtml(text),
};

/**
 * Render markdown to HTML via `Bun.markdown.render` with GFM-style defaults, `autolinks: true`,
 * `hardSoftBreaks: true` (like marked `breaks: true`), and syntax-highlighted fenced code blocks.
 */
export function renderMarkdownToHtml(markdown: string): string {
  return Bun.markdown.render(markdown, markdownRenderCallbacks, parserOptions);
}
