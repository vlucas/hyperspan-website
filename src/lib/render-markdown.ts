import { marked, type Tokens } from 'marked';
import { render } from '@hyperspan/html';
import { highlightCode, highlightShell, highlightTS } from '~/src/lib/syntax-highlighter';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function renderHighlightedCodeBlock(code: string, language?: string): string {
  const lang = language?.toLowerCase();
  if (!lang || lang === 'typescript' || lang === 'ts' || lang === 'tsx') {
    return render(highlightTS(code));
  }
  if (lang === 'javascript' || lang === 'js') {
    return render(highlightCode(code, 'javascript'));
  }
  if (lang === 'shell' || lang === 'bash' || lang === 'sh') {
    return render(highlightShell(code));
  }
  return render(highlightCode(code, lang));
}

const renderer = {
  heading({ tokens, depth, text }: Tokens.Heading) {
    const inner = this.parser.parseInline(tokens);
    const id = slugify(text);
    return `<h${depth} id="${escapeHtml(id)}">${inner}</h${depth}>\n`;
  },
  code({ text, lang }: Tokens.Code) {
    return renderHighlightedCodeBlock(text, lang);
  },
};

marked.use({
  gfm: true,
  breaks: true,
  renderer,
});

/**
 * Render markdown to HTML with GFM, autolinks, hard line breaks, and syntax-highlighted fenced code.
 */
export function renderMarkdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}
