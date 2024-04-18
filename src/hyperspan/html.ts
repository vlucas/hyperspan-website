import escapeHTML from 'escape-html';
// @ts-ignore
import mixin from 'mixin-deep';

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
async function* _render(
  obj: any,
  promises: Array<TRenderPromise> = [],
  { js }: { js: string[] }
): AsyncGenerator<string> {
  if (!obj) {
    return '';
  }

  let { kind, value } = obj;
  let id = randomId();

  if (!kind || !value) {
    kind = _typeOf(obj);
    value = obj;
  }

  if (value instanceof HSTemplate) {
    yield* renderToStream(value);
  } else if (value instanceof HSClientTemplate) {
    value.id = id;
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
          return _render(v, promises, { js });
        });
        const pid = 'async_' + id;
        promises.push({ id: pid, pending: true, promise });
        yield* renderToStream(
          html`<div id="${pid}" class="loading loading-spinner loading-sm">Loading...</div>`
        );
        break;
      case 'function':
        js.push(`window.__hs.fn('${id}', ${value.toString()})`);
        yield `"javascript:window.__hs.fnc('${id}')"`;
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
export async function* renderToStream(template: HSTemplate | string): AsyncGenerator<string> {
  let promises: Array<TRenderPromise> = [];
  let js: string[] = [];

  if (typeof template === 'string') {
    return template;
  }

  for (let i = 0; i < template.content.length; i++) {
    yield* _render(template.content[i], promises, { js });
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

  if (js.length !== 0) {
    yield '<script>' + js.join('\n') + '</script>';
  }
}

/**
 * Render HSTemplate to string (awaits/buffers entire response)
 */
export async function renderToString(template: HSTemplate | string): Promise<string> {
  let result = '';

  for await (const chunk of renderToStream(template)) {
    result += chunk;
  }

  return result;
}

export type THSUserState = {
  [key: string]: any;
};
export type THSClientComponent = {
  id?: string;
  args?: any;
  state?: any;
  initialState?: ({ args }: { args: any[] }) => THSUserState;
  mount?: () => void;
  render: () => HSTemplate;
};

/**
 * Client component - Runs BOTH on ther sever (initial render), AND on the client. Results in JavaScript being sent to
 * the client and extra work done in the browser
 */
export function clientComponent<T>(clientTmpl: THSClientComponent) {
  return (...args: any[]) => {
    const c = new HSClientTemplate(clientTmpl, args);

    return c;
  };
}

export class HSClientTemplate {
  __hsTemplate = true;
  id: string;
  comp;
  args;
  state: any = {};
  __updateFn: any;
  constructor(comp: THSClientComponent, args: any[]) {
    this.id = comp.id || randomId();
    this.comp = comp;
    this.args = args;
    this.state = comp.state || {};
  }
  mount() {
    return this.comp.mount && this.comp.mount.call(this);
  }
  setState<T>(newState: THSUserState): T {
    this.state = newState;
    this.__updateFn && this.__updateFn(this);
    return this.state;
  }
  mergeState<T>(newState: Partial<THSUserState>): T {
    this.state = mixin(this.state, newState);
    this.__updateFn && this.__updateFn(this);
    return this.state;
  }
  _onUpdate(fn: any) {
    this.__updateFn = fn;
  }
  componentToString() {
    return `{
      id: '${this.id}',
      args: ${JSON.stringify(this.args)},
      state: ${JSON.stringify(this.comp.initialState ? this.comp.initialState({ args: this.args }) : {})},
      ${this.comp.mount ? this.comp.mount : ''},
      ${this.comp.render},
    }`;
  }
  async render(): Promise<string | HSTemplate> {
    const content = await renderToString(this.comp.render.call(this));
    return [
      `<script data-hscs-id="${this.id}">window.__hsc = window.__hsc || []; window.__hsc.push(${this.componentToString()})</script>`,
      `<div data-hsc-id="${this.id}">`,
      content,
      '</div>',
    ].join('\n');
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
