import escapeHTML from 'escape-html';

/**
 * Template object - used so it will be possible to (eventually) pass down context
 */
export class HSTemplate {
  __hsTemplate = true;
  content: any[];
  constructor(content: any[]) {
    this.content = content;
  }
}

/**
 * HTML template
 */
export function html(strings: TemplateStringsArray, ...values: any[]): HSTemplate {
  const content: any[] = [];

  // String templates only?
  if (values.length === 0) {
    content.push({ kind: 'string_safe', value: strings.join('\n') });
    return new HSTemplate(content);
  }

  let i = 0;
  for (i = 0; i < values.length; i++) {
    content.push({ kind: 'string_safe', value: strings[i] });

    let tValue = values[i] === undefined || values[i] === null || values[i] === '' ? '' : values[i];

    if (!Array.isArray(tValue)) {
      tValue = [tValue];
    }

    for (let j = 0; j < tValue.length; j++) {
      content.push({ kind: _typeOf(tValue[j]), value: tValue[j] });
    }
  }
  content.push({ kind: 'string_safe', value: strings[i] });

  return new HSTemplate(content);
}

type TRenderPromise = {
  id: string;
  pending: boolean;
  value?: any;
  promise: Promise<any>;
};
async function* _render(obj: any, promises: Array<TRenderPromise> = []): AsyncGenerator<string> {
  let { kind, value } = obj;

  if (!kind || !value) {
    kind = _typeOf(obj);
    value = obj;
  }

  if (value instanceof HSTemplate) {
    yield* renderToStream(value);
  } else if (value instanceof HSClientTemplate) {
    yield await value.render();
  } else if (value === undefined || value === null) {
    yield '';
  } else {
    switch (kind) {
      case 'string':
        yield escapeHTML(value);
        break;
      case 'string_safe':
        yield value;
        break;
      case 'array':
        yield* value;
        break;
      case 'promise':
        const promise = value.then((v: unknown) => {
          return _render(v, promises);
        });
        const id = 'async_' + randomId();
        promises.push({ id, pending: true, promise });
        yield* renderToStream(html`<div id="${id}">Loading...</div>`);
        break;
      case 'function':
        // @TODO: Render inline function in a way that will work...
        yield `javascript:${String(value)}`;
        break;
      case 'json':
        yield ''; //JSON.stringify(value);
        break;
      case 'object':
        if (typeof value.render === 'function') {
          yield value.render();
        } else if (typeof value.toString === 'function') {
          yield value.toString();
        } else {
          yield value;
        }
        break;
      case 'generator':
        yield* value;
        break;
      case 'date':
        yield value.toISOString();
        break;
      default:
        yield String(value);
    }
  }
}

/**
 * Render HSTemplate to async generator that streams output to a string
 */
export async function* renderToStream(template: HSTemplate): AsyncGenerator<string> {
  let promises: Array<TRenderPromise> = [];

  for (let i = 0; i < template.content.length; i++) {
    yield* _render(template.content[i], promises);
  }

  while (promises.length > 0) {
    const promisesToRun = promises.map((p) =>
      p.promise.then((v) => {
        return { id: p.id, pending: false, value: v, promise: null };
      })
    );
    const result = await Promise.race(promisesToRun);

    yield* renderToStream(html`<template id="${result.id}_content">${result.value}</template>`);

    promises = promises.filter((p) => {
      return p.id !== result.id;
    });
  }
}

/**
 * Render HSTemplate to string (awaits/buffers entire response)
 */
export async function renderToString(template: HSTemplate): Promise<string> {
  let result = '';

  for await (const chunk of renderToStream(template)) {
    result += chunk;
  }

  return result;
}

/**
 * Client component - Runs BOTH on ther sever (initial render), AND on the client. Results in JavaScript being sent to
 * the client and extra work done in the browser
 */
export function clientComponent(fn: (...args: any[]) => any) {
  return async function (...args: Parameters<typeof fn>) {
    return new HSClientTemplate(fn, await fn(...args), args);
  };
}

class HSClientTemplate {
  __hsTemplate = true;
  fn;
  content;
  args;
  constructor(fn: any, content: string | AsyncGenerator, args: any[]) {
    this.fn = fn;
    this.content = content;
    this.args = args;
  }

  async render() {
    console.log('fn content =', this.content);
    const content = await (typeof this.content === 'string'
      ? this.content
      : renderToString(this.content));
    return [content, '<script>' + this.fn + '</script>'].join('\n');
  }
}

/**
 * Strip extra spacing between HTML tags (used for tests)
 */
export function compressHTMLString(str: string) {
  return str.replace(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, '$1$3');
}

/**
 * Generate random ID (used for promise/async resolver)
 */
function randomId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * LOL JavaScript...
 */
export function _typeOf(obj: any): string {
  if (obj instanceof Promise) return 'promise';
  if (obj instanceof Date) return 'date';
  if (obj instanceof String) return 'string';
  if (obj instanceof Number) return 'number';
  if (obj instanceof Boolean) return 'boolean';
  if (obj instanceof Function) return 'function';
  if (Array.isArray(obj)) return 'array';
  if (Number.isNaN(obj)) return 'nan';
  if (obj === undefined) return 'undefined';
  if (obj === null) return 'null';
  if (isGenerator(obj)) return 'generator';
  if (isPlainObject(obj)) return 'json';
  return typeof obj;
}

function isGenerator(obj: any): boolean {
  return obj && 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

function isPlainObject(val: any) {
  return Object == val.constructor;
}
