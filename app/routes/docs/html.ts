import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';
import { highlightTS, highlightShell } from '@/src/lib/syntax-highlighter';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Hyperspan HTML Templates</h1>
      <p>
        HTML templates are the backbone of Hyperspan. They are the preferred way to render HTML
        content to the screen. They support streaming and aysnc content, and escape HTML by default
        in variables.
      </p>

      <p>Hyperspan HTML Templates...</p>
      <ol>
        <li>
          Are <strong>pure JavaScript</strong>. No special syntax to learn. No compile step
          required.
        </li>
        <li>
          Are <strong>extrememly lightweight</strong>. Source code with types is less than 300
          lines.
        </li>
        <li>
          Work in all JavaScript runtimes that support
          <a href="https://caniuse.com/template-literals">Template Literals</a>
          and
          <a href="https://caniuse.com/mdn-javascript_builtins_asyncgenerator">AsyncGenerator</a>
          (for streaming) (all major browsers, Bun, Deno, Node.js, Workers, Edge, etc.).
        </li>
        <li>Instantly separate <em>static content</em> from <em>async content</em>.</li>
        <li>
          Can render static template content immediately, with placeholders for async content with
          <code>render</code>.
        </li>
        <li>
          Can resolve async content <em>out of order</em> and then render it into the correct
          placeholders when it resolves.
        </li>
        <li>Run all async work in the same template concurrently, not one by one or blocking.</li>
        <li>Support unlimited levels of nested templates and nested async content.</li>
        <li>
          Can stream render with <code>renderStream</code> (returns <code>AsyncGenerator</code>)
        </li>
        <li>
          Can wait for all async work to finish before rendering with
          <code>renderAsync</code> (returns <code>string</code>)
        </li>
      </ol>

      <h2>Installation</h2>
      <p>Install the <code>@hyperspan/html</code> package to get started.</p>
      ${highlightShell(`npm install @hyperspan/html`)} ${highlightShell(`bun add @hyperspan/html`)}
      <div class="alert alert-info alert-outline">
        <p>
          <strong>Note:</strong> The Hyperspan <em>framework</em> requires Bun to use, but the HTML
          templates package is separate, and can be used in any JavaScript runtime that supports
          Template Literals and Async Generators.
        </p>
      </div>

      <h2>Example Template</h2>
      <p>
        A Hyperspan template is a
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates"
          >Tagged Template Literal</a
        >
        that starts with <code>html\`...\`</code>. It's just JavaScript. Nothing to compile!
      </p>
      ${HTMLTemplateExample()}
      <p class="text-sm">
        Templates can include any HTML markup you want. Your markup does <em>not</em> have to start
        with a root node or a fragment.
      </p>

      <h2>Async Work in Templates</h2>
      <p>
        Got some data to fetch before you can render your template? Just make your template function
        <code>async</code> and <code>await</code> any data you need. No special knowledge, edge
        cases, or new syntax to learn.
      </p>
      ${HTMLTemplateExampleAsync()}
      <p class="text-sm">
        When stream rendering is used, async work at the top level template will hold up the initial
        page response. Any subsequent async work in nested templates will render a loading
        placeholder and the content will be replaced later when it is done streaming in.
      </p>

      <h2>Custom Loading Placeholders</h2>
      <p>
        By default, Hyperspan will render <code>&lt;span&gt;Loading...&lt;/span&gt;</code> as a
        placeholder for all async values rendered in templates. If you want to customize this with
        loading skeletons, spinners, or other custom content, you can do so with the
        <code>placeholder(tmpl, promise)</code> function in the
        <code>@hyperspan/html</code> package.
      </p>
      ${highlightTS(`import { html, placeholder } from '@hyperspan/html';

const content = html\`<div>
  \${placeholder(
    html\`<div class="blog-posts-skeleton">Loading blog posts...</div>\`,
    sleep(600, (resolve) => resolve("Blog posts HTML chunk here..."))
  )}
</div>\`;`)}

      <h2>Custom Async Values</h2>
      <p>
        If you want a more structured way to wrap up custom async logic with custom loading
        placeholders, you can do so by creating an object that has both <code>render</code> and
        <code>renderAsync</code> methods that return an HTML template.
      </p>
      <p>
        The <code>render</code> method will be called immediately for the loading placeholder, and
        the
        <code>renderAsync</code>
        method will be the content that will replace the loading placeholder once resolved.
      </p>
      ${highlightTS(`import { html } from '@hyperspan/html';

// Custom value class
class RemoteCMSContentBlock {
  id: number;

  constructor(id: number) {
    this.id = id;
  }

  // Loading placeholder (rendered immediately)
  render() {
    return html\`<div>CMS Content Loading...</div>\`;
  }

  // Actual content - replaces the loading placeholder when Promise is resolved
  async renderAsync() {
    const response = await fetch(\`https://api.mycompanycms.com/contentblocks/\${this.id}\`);
    return html.raw(await response.text());
  }
}

// Use it in a template
const content = html\`<h1>Remote CMS Content:</h1>\${new RemoteCMSContentBlock(123)}\`;`)}

      <h2>HTML Escaping</h2>
      <p>
        Hyperspan HTML templates escape HTML by default. This means that any variables you pass into
        the template will be sanitized to prevent XSS attacks.
      </p>
      ${highlightTS(`import { html } from '@hyperspan/html';

const userName = '<script>alert("XSS")</script>';
const content = html\`<div>\${userName}</div>\`;
// content is now: <div>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>`)}

      <h2>Rendering Raw HTML</h2>
      <p>
        Sometimes chunks of content are already formatted with HTML &mdash; like if they are coming
        from an internal or headless CMS &mdash; and you need to render them as-is.
      </p>
      <p>
        When you need to render HTML inside your template, you can use the
        <code>html.raw()</code> function. Just make sure it is <em>trusted</em> content, because it
        could be a potential security risk if not.
      </p>
      ${highlightTS(`import { html } from '@hyperspan/html';

const userName = '<script>alert("XSS")</script>';
const content = html\`<div>\${html.raw(userName)}</div>\`; // html.raw() around userName
// content is now: <div><script>alert("XSS")</script></div>`)}

      <h2>Rendering Options</h2>
      <p>
        The main options you have to render Hyperspan templates are streaming or async. Which one
        you use depends on your needs. The Hyperspan framework defaults to stream rendering for
        users, and async rendering for bots and crawlers.
      </p>
      <p>
        Regardless of which rendering method you use, the template syntax and semantics are always
        the same.
      </p>

      <h3><code>render(tmpl): string</code></h3>
      <p>
        The <code>render</code> method only renders static content and will render placeholders for
        all async content. This is useful when you need to get some initial content to the screen
        immediately.
      </p>
      ${highlightTS(`import { render } from '@hyperspan/html';

const content = render(tmpl);`)}

      <h3><code>renderAsync(tmpl): Promise&lt;string&gt;</code></h3>
      <p>
        The <code>renderAsync</code> method renders the whole template
        <strong>and all nested templates</strong> as a single Promise. This rendering method is
        useful if you need the full complete page response as a single chunk without streaming.
        Recommended for bots and crawlers.
      </p>
      ${highlightTS(`import { renderAsync } from '@hyperspan/html';

const content = await renderAsync(tmpl);`)}

      <h3><code>renderStream(tmpl): AsyncGenerator&lt;string&gt;</code></h3>
      <p>
        The <code>renderStream</code> method renders initial content immediately with placeholders,
        and then continues to stream in async chunks of content as they resolve, one by one. Loading
        placeholders are rendered as a
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/slot"
          ><code>&lt;slot&gt;</code> element</a
        >. Async content chunks are appended as a
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template"
          ><code>&lt;template&gt;</code> element</a
        >
        with a matching slot name.
      </p>
      <p class="text-sm">
        Note: This rendering method requires a small JavaScript shim on the client for maximum
        cross-browser compatability. This is automatically added when used in the Hyperspan
        framework.
      </p>
      ${highlightTS(`import { renderStream } from '@hyperspan/html';

const root = document.getElementById('root');
for await (const chunk of renderStream(tmpl)) {
  root.insertAdjacentHTML("beforeend", chunk);
}`)}
    </main>
  `;

  return DocsLayout({
    title: 'HTML Templates',
    content,
  });
});

/**
 * Example markup
 */
function HTMLTemplateExample() {
  const code = `import { html } from '@hyperspan/html';

// Template syntax
// Values can be any scalar value, Promise, nested template, or object with a 'render' method
function getContent() {
  return html\`<div>
    <p>Some static content here first</p>
    <p>\${sleep(600, (resolve) => resolve("Resolves second"))}</p>
    <p>A bit more static content here as well</p>
    <p>
      \${Promise.resolve(
        html\`Resolves first... (Nested:
        \${sleep(800, (resolve) => resolve(html\`Resolves third\`))})\`
      )}
    </p>
    <hr />
    \${new AsyncValue()}
  </div>\`;
}
  `;

  return highlightTS(code);
}

function HTMLTemplateExampleAsync() {
  const code = `import { html } from '@hyperspan/html';

async function MyTemplate() {
  const posts = await fetchBlogPosts({ page: 1 });

  return html\`
    <main>
      <h1>Blog Posts</h1>
      <ul>
        \${posts.map(post => html\`<li><a href="/blog/\${post.id}">\${post.title}</a></li>\`)}
      </ul>
    </main>
  \`;
}
  `;

  return highlightTS(code);
}
