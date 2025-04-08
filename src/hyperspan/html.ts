import escapeHtml from './escape-html';

export class TmplHtml {
  content = '';
  asyncContent: Array<{
    id: string;
    promise: Promise<{ id: string; value: unknown }>;
  }>;

  constructor(props: TmplHtml) {
    this.content = props.content;
    this.asyncContent = props.asyncContent;
  }
}

let htmlId = 0;
export function html(strings: TemplateStringsArray, ...values: any[]): TmplHtml {
  const asyncContent: TmplHtml['asyncContent'] = [];

  let content = '';
  for (let i = 0; i < strings.length; i++) {
    let value = values[i];
    let renderValue: string | undefined;

    // Any scalar value
    if (value !== null && value !== undefined) {
      let id = `async_loading_${htmlId++}`;
      let kind = _typeOf(value);

      if (!renderValue) {
        renderValue = _renderValue(value, { id, kind, asyncContent }) || '';
      }
    }

    content += strings[i] + (renderValue ? renderValue : '');
  }
  return new TmplHtml({ content, asyncContent });
}
// Insert raw HTML as string (do not escape HTML characters)
html.raw = (content: string) => ({ _kind: 'html_safe', content });

// Render unknown value based on type
// Will always render a string for every value (possibly empty)
// MAY also push new items into 'asyncContent' option to resolve in the future
function _renderValue(
  value: unknown,
  opts: { kind?: string; id?: string; asyncContent: any[] } = {
    kind: undefined,
    id: undefined,
    asyncContent: [],
  }
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '';
  }
  const kind = opts.kind || _typeOf(value);
  const id = opts.id || '';

  switch (kind) {
    case 'array':
      return (value as any[])
        .map((v) => _renderValue(v, { id, asyncContent: opts.asyncContent }))
        .join('');
    case 'object':
      // THtmlReturn (HTML template)
      if (value instanceof TmplHtml) {
        opts.asyncContent.push(...value.asyncContent);
        return value.content;
      }
      // @ts-ignore - this is "raw HTML" object - do not escape
      if (value?._kind === 'html_safe') {
        // @ts-ignore
        return value?.content || '';
      }
      // renderAsync() method
      // @ts-ignore
      if (typeof value.renderAsync === 'function') {
        opts.asyncContent.push({
          id,
          // @ts-ignore
          promise: value.renderAsync().then((result: unknown) => ({
            id,
            value: result,
            asyncContent: opts.asyncContent,
          })),
        });
      }
      // render() method
      // @ts-ignore
      if (typeof value.render === 'function') {
        // @ts-ignore
        return render(_htmlPlaceholder(id, value.render()));
      }
      return JSON.stringify(value);
    case 'promise':
      opts.asyncContent.push({
        id,
        promise: (value as Promise<any>).then((result: unknown) => ({
          id,
          value: result,
          asyncContent: opts.asyncContent,
        })),
      });
      return render(_htmlPlaceholder(id));
    case 'generator':
      throw new Error('Generators are not supported as a template value at this time. Sorry :(');
  }

  return escapeHtml(String(value));
}

/**
 * Placeholder for async content.
 * This will be replaced with the actual content when the async content is resolved.
 */
function _htmlPlaceholder(id: string | number, content: any = 'Loading...') {
  // prettier-ignore
  return html`<!--hs:loading:${id}--><slot id="${id}">${content}</slot><!--/hs:loading:${id}-->`
}

/**
 * Renders all static markup and non-async content for provided template.
 * This will NOT render any async content. For that, use renderAsync or renderStream.
 */
export function render(tmpl: TmplHtml): string {
  return tmpl.content;
}

/**
 * Render HTML and async content as one block and return string output
 * This will wait for ALL async chunks in the template to resolve before rendering.
 * If you want streaming rendering, use 'renderStream' instead.
 */
export async function renderAsync(tmpl: TmplHtml): Promise<string> {
  let { content, asyncContent } = tmpl;

  while (asyncContent.length !== 0) {
    // @TODO: Use Promise.allSettled() instead with error handling
    const resolvedHtml = await Promise.all(asyncContent.map((p) => p.promise));
    asyncContent = [];
    resolvedHtml.map((obj) => {
      const r = new RegExp(
        `<\!\-\-hs:loading:${obj.id}\-\->(.*?)<\!\-\-/hs:loading:${obj.id}\-\->`
      );
      const found = content.match(r);

      if (found) {
        content = content.replace(found[0], _renderValue(obj.value, { asyncContent }));
      }
    });
  }

  return content;
}

/**
 * Render HTML as a stream (async generator)
 * Uses Promise.race() to output new resolved chunks of HTML as soon as each promise resolves.
 * Primary render method for streaming HTML from server
 */
export async function* renderStream(tmpl: TmplHtml): AsyncGenerator<string> {
  yield render(tmpl);
  let asyncContent = tmpl.asyncContent;

  while (asyncContent.length > 0) {
    // Resolve the next async content as soon as it is ready
    const nextContent = await Promise.race(asyncContent.map((p) => p.promise));

    // Remove current promise from list (resolved now)
    asyncContent = asyncContent.filter((p) => p.id !== nextContent.id);

    const id = nextContent.id;
    const content = _renderValue(nextContent.value, {
      asyncContent,
    });
    const script = html`<template id="${id}_content">${html.raw(content)}</template>`;

    yield render(script);
  }
}

/**
 * LOL JavaScript typeof...
 */
function _typeOf(obj: any): string {
  if (obj instanceof Promise) return 'promise';
  if (obj instanceof Date) return 'date';
  if (obj instanceof String) return 'string';
  if (obj instanceof Number) return 'number';
  if (obj instanceof Boolean) return 'boolean';
  if (obj instanceof Function) return 'function';
  if (Array.isArray(obj)) return 'array';
  if (Number.isNaN(obj)) return 'NaN';
  if (obj === undefined) return 'undefined';
  if (obj === null) return 'null';
  if (isGenerator(obj)) return 'generator';
  return typeof obj;
}

function isGenerator(obj: any): boolean {
  return obj && 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

/**
 * Strip extra spacing between HTML tags (used for tests)
 */
export function compressHTMLString(str: string) {
  return str.replace(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, '$1$3');
}
