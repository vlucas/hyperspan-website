import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function readCollectionMarkdown(
  collection: 'docs' | 'blog',
  page: string
): Promise<string | null> {
  const base = join(process.cwd(), 'app/collections', collection);
  const candidates = [join(base, `${page}.md`), join(base, page, 'index.md')];

  for (const path of candidates) {
    try {
      return await readFile(path, 'utf8');
    } catch {
      // try the next candidate
    }
  }

  return null;
}
