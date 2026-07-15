import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export type BlogFrontmatter = {
  title?: string;
  date?: string;
  description?: string;
};

export type BlogPostSummary = {
  slug: string;
  title: string;
  date: Date;
  dateISO: string;
  description?: string;
};

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function blogDir(): string {
  return join(process.cwd(), 'app/collections/blog');
}

function parseFrontmatterBlock(block: string): BlogFrontmatter {
  const fm: BlogFrontmatter = {};
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key === 'title') fm.title = value;
    else if (key === 'date') fm.date = value;
    else if (key === 'description') fm.description = value;
  }
  return fm;
}

/** Split raw markdown into frontmatter and body (body is trimmed). */
export function splitBlogMarkdown(raw: string): { frontmatter: BlogFrontmatter; body: string } {
  const m = raw.match(FRONT_MATTER_RE);
  if (!m) {
    return { frontmatter: {}, body: raw.trim() };
  }
  return {
    frontmatter: parseFrontmatterBlock(m[1]),
    body: raw.slice(m[0].length).trim(),
  };
}

function titleFromBody(body: string): string | undefined {
  const h1 = body.match(/^#\s+(.+)$/m);
  return h1 ? h1[1].trim() : undefined;
}

function parsePostDate(iso: string | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso.length === 10 && !iso.includes('T') ? `${iso}T12:00:00Z` : iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function readPostSummaryFromFile(slug: string, raw: string): BlogPostSummary | null {
  const { frontmatter, body } = splitBlogMarkdown(raw);
  const date = parsePostDate(frontmatter.date);
  if (!date) return null;
  const title = frontmatter.title?.trim() || titleFromBody(body) || slug;
  const rawDate = frontmatter.date!;
  const dateISO = rawDate.length >= 10 ? rawDate.slice(0, 10) : date.toISOString().slice(0, 10);
  return {
    slug,
    title,
    date,
    dateISO,
    description: frontmatter.description?.trim(),
  };
}

function buildBlogPostSummaries(): BlogPostSummary[] {
  const dir = blogDir();
  if (!existsSync(dir)) return [];

  const names = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'index.md');
  const summaries: BlogPostSummary[] = [];

  for (const name of names) {
    const slug = name.replace(/\.md$/, '');
    const raw = readFileSync(join(dir, name), 'utf8');
    const summary = readPostSummaryFromFile(slug, raw);
    if (summary) summaries.push(summary);
  }

  summaries.sort((a, b) => b.date.getTime() - a.date.getTime());
  return summaries;
}

/**
 * All posts with a valid `date` in frontmatter, newest first. Built once when this module loads
 * (content is static on disk after deployment).
 */
export const blogPostSummaries: readonly BlogPostSummary[] = Object.freeze(buildBlogPostSummaries());

export type ParsedBlogPost = {
  slug: string;
  raw: string;
  frontmatter: BlogFrontmatter;
  body: string;
  title: string;
  publishedAt: Date | null;
  dateISO: string | null;
};

export function parseBlogPostFile(slug: string, raw: string): ParsedBlogPost {
  const { frontmatter, body } = splitBlogMarkdown(raw);
  const publishedAt = parsePostDate(frontmatter.date);
  const dateISO = publishedAt
    ? frontmatter.date && frontmatter.date.length >= 10
      ? frontmatter.date.slice(0, 10)
      : publishedAt.toISOString().slice(0, 10)
    : null;
  const title = frontmatter.title?.trim() || titleFromBody(body) || slug;
  return {
    slug,
    raw,
    frontmatter,
    body,
    title,
    publishedAt,
    dateISO,
  };
}

export function readBlogPostRawSync(slug: string): string | null {
  const path = join(blogDir(), `${slug}.md`);
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8');
}
