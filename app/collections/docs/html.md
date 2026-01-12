# Hyperspan HTML Templates

HTML templates are the backbone of Hyperspan. They are the preferred way to render HTML content to the screen. They support streaming and aysnc content, and escape HTML by default in variables.

Hyperspan HTML Templates...

1. Are **pure JavaScript**. No special syntax to learn. No compile step required.
2. Are **extrememly lightweight**. Source code with types is less than 300 lines.
3. Work in all JavaScript runtimes that support [Template Literals](https://caniuse.com/template-literals) and [AsyncGenerator](https://caniuse.com/mdn-javascript_builtins_asyncgenerator) (for streaming) (all major browsers, Bun, Deno, Node.js, Workers, Edge, etc.).
4. Instantly separate _static content_ from _async content_.
5. Can render static template content immediately, with placeholders for async content with `render`.
6. Can resolve async content _out of order_ and then render it into the correct placeholders when it resolves.
7. Run all async work in the same template concurrently, not one by one or blocking.
8. Support unlimited levels of nested templates and nested async content.
9. Can stream render with `renderStream` (returns `AsyncGenerator`)
10. Can wait for all async work to finish before rendering with `renderAsync` (returns `string`)

## Installation

Install the `@hyperspan/html` package to get started.

```shell
npm install @hyperspan/html
```

```shell
bun add @hyperspan/html
```

> **Note:** The Hyperspan _framework_ requires Bun to use, but the HTML templates package is separate, and can be used in any JavaScript runtime that supports Template Literals and Async Generators.

## Example Template

A Hyperspan template is a [Tagged Template Literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) that starts with ``html`..```. It's just JavaScript. Nothing to compile!

```typescript
import { html } from '@hyperspan/html';

// Template syntax
// Values can be any scalar value, Promise, nested template, or object with a 'render' method
function getContent() {
  return html`<div>
    <p>Some static content here first</p>
    <p>${sleep(600, (resolve) => resolve('Resolves second'))}</p>
    <p>A bit more static content here as well</p>
    <p>
      ${Promise.resolve(
        html`Resolves first... (Nested: ${sleep(800, (resolve) => resolve(html`Resolves third`))})`
      )}
    </p>
    <hr />
    ${new AsyncValue()}
  </div>`;
}
```

Templates can include any HTML markup you want. Your markup does _not_ have to start with a root node or a fragment.

## Async Work in Templates

Got some data to fetch before you can render your template? Just make your template function `async` and `await` any data you need. No special knowledge, edge cases, or new syntax to learn.

```typescript
import { html } from '@hyperspan/html';

async function MyTemplate() {
  const posts = await fetchBlogPosts({ page: 1 });

  return html`
    <main>
      <h1>Blog Posts</h1>
      <ul>
        ${posts.map((post) => html`<li><a href="/blog/${post.id}">${post.title}</a></li>`)}
      </ul>
    </main>
  `;
}
```

When stream rendering is used, async work at the top level template will hold up the initial page response. Any subsequent async work in nested templates will render a loading placeholder and the content will be replaced later when it is done streaming in.

## Custom Loading Placeholders

By default, Hyperspan will render `<span>Loading...</span>` as a placeholder for all async values rendered in templates. If you want to customize this with loading skeletons, spinners, or other custom content, you can do so with the `placeholder(tmpl, promise)` function in the `@hyperspan/html` package.

```typescript
import { html, placeholder } from '@hyperspan/html';

const content = html`<div>
  ${placeholder(
    html`<div class="blog-posts-skeleton">Loading blog posts...</div>`,
    sleep(600, (resolve) => resolve('Blog posts HTML chunk here...'))
  )}
</div>`;
```

## Custom Async Values

If you want a more structured way to wrap up custom async logic with custom loading placeholders, you can do so by creating an object that has both `render` and `renderAsync` methods that return an HTML template.

The `render` method will be called immediately for the loading placeholder, and the `renderAsync` method will be the content that will replace the loading placeholder once resolved.

```typescript
import { html } from '@hyperspan/html';

// Custom value class
class RemoteCMSContentBlock {
  id: number;

  constructor(id: number) {
    this.id = id;
  }

  // Loading placeholder (rendered immediately)
  render() {
    return html`<div>CMS Content Loading...</div>`;
  }

  // Actual content - replaces the loading placeholder when Promise is resolved
  async renderAsync() {
    const response = await fetch(`https://api.mycompanycms.com/contentblocks/${this.id}`);
    return html.raw(await response.text());
  }
}

// Use it in a template
const content = html`<h1>Remote CMS Content:</h1>
  ${new RemoteCMSContentBlock(123)}`;
```

## HTML Escaping

Hyperspan HTML templates escape HTML by default. This means that any variables you pass into the template will be sanitized to prevent XSS attacks.

```typescript
import { html } from '@hyperspan/html';

const userName = '<script>alert("XSS")</script>';
const content = html`<div>${userName}</div>`;
// content is now: <div>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>
```

## Rendering Raw HTML

Sometimes chunks of content are already formatted with HTML — like if they are coming from an internal or headless CMS — and you need to render them as-is.

When you need to render HTML inside your template, you can use the `html.raw()` function. Just make sure it is _trusted_ content, because it could be a potential security risk if not.

```typescript
import { html } from '@hyperspan/html';

const userName = '<script>alert("XSS")</script>';
const content = html`<div>${html.raw(userName)}</div>`; // html.raw() around userName
// content is now: <div><script>alert("XSS")</script></div>
```

## Rendering Options

The main options you have to render Hyperspan templates are streaming or async. Which one you use depends on your needs. The Hyperspan framework defaults to stream rendering for users, and async rendering for bots and crawlers.

Regardless of which rendering method you use, the template syntax and semantics are always the same.

### `render(tmpl): string`

The `render` method only renders static content and will render placeholders for all async content. This is useful when you need to get some initial content to the screen immediately.

```typescript
import { render } from '@hyperspan/html';

const content = render(tmpl);
```

### `renderAsync(tmpl): Promise<string>`

The `renderAsync` method renders the whole template **and all nested templates** as a single Promise. This rendering method is useful if you need the full complete page response as a single chunk without streaming. Recommended for bots and crawlers.

```typescript
import { renderAsync } from '@hyperspan/html';

const content = await renderAsync(tmpl);
```

### `renderStream(tmpl): AsyncGenerator<string>`

The `renderStream` method renders initial content immediately with placeholders, and then continues to stream in async chunks of content as they resolve, one by one. Loading placeholders are rendered as a [`<slot>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/slot). Async content chunks are appended as a [`<template>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template) with a matching slot name.

> Note: This rendering method requires a small JavaScript shim on the client for maximum cross-browser compatability. This is automatically added when used in the Hyperspan framework.

```typescript
import { renderStream } from '@hyperspan/html';

const root = document.getElementById('root');
for await (const chunk of renderStream(tmpl)) {
  root.insertAdjacentHTML('beforeend', chunk);
}
```
