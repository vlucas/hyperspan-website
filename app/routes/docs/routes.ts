import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';
import { highlightTS } from '@/src/lib/syntax-highlighter';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Routes</h1>
      <p>
        Routes are the entry point for all requests to your application. They map a specific URL
        pattern to a specific file or route handler function.
      </p>
      <p>In Hyperspan, routes can live in two main places:</p>
      <ol>
        <li><code>app/routes</code> directory (file-based routes)</li>
        <li><code>app/server.ts</code> file (custom route handlers)</li>
      </ol>

      <h2>File-Based Routing</h2>
      <p>
        To make things easier, Hyperspan uses file-based routing. This means that you can create a
        file in the <code>app/routes</code> directory and it will be automatically picked up by the
        framework and added to your routing table.
      </p>
      <p>
        Here are some examples of how files in the <code>app/routes</code> directory map to URL
        patterns:
      </p>
      <table class="table">
        <thead>
          <tr>
            <th class="w-1/2">File Path</th>
            <th class="w-1/2">URL Pattern</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>app/routes/index.ts</code></td>
            <td><code>/</code></td>
          </tr>
          <tr>
            <td><code>app/routes/about.ts</code></td>
            <td><code>/about</code></td>
          </tr>
          <tr>
            <td><code>app/routes/posts/index.ts</code></td>
            <td><code>/posts</code></td>
          </tr>
          <tr>
            <td><code>app/routes/posts/[id].ts</code></td>
            <td><code>/posts/:id</code></td>
          </tr>
          <tr>
            <td><code>app/routes/auth/[...authPath].ts</code></td>
            <td><code>/auth/*</code></td>
          </tr>
        </tbody>
      </table>
      <p>
        Route and query params can be accessed from the
        <a href="https://hono.dev/docs/api/request">Hono Request</a> object by name.
      </p>
      ${highlightTS(`// File: app/routes/posts/[id].ts
import { createRoute } from '@hyperspan/framework';
import { fetchPostById } from '@/src/entities/posts'; // whatever your data layer is

export default createRoute(async (c) => {
  const id = c.req.param('id');
  const post = await fetchPostById(id);

  return html\`<main>
    <h1>\${post.title}</h1>
    <div>\${post.content}</div>
  </main>\`;
});`)}

      <h3>The <code>createRoute</code> Function</h3>
      <p>
        File-based routes are created by default exporting the results of calling the
        <code>createRoute</code> function.
      </p>
      <p>The most basic route is a function that returns a string of HTML.</p>

      ${highlightTS(`import { createRoute } from '@hyperspan/framework';

export default createRoute(() => html\`<div>Hello, world!</div>\`);`)}

      <h3>Using Plain Functions</h3>
      <p>
        You <em>can</em> define a route with a plain function, but you won't have the proper types
        included by default, or other helpful APIs like limiting the route to a specific HTTP
        method, adding route-specific middleware, etc.
      </p>

      ${highlightTS(`import { Context } from 'hono';
        
export default function (c: Context) {
  return html\`<div>Hello, \${c.req.param('name')}!</div>\`;
}`)}
      <div class="alert">
        <span
          >Plain functions for routes can be useful for migrating over from another framework, but
          they are not recommended for new projects due to the lack of type safety and other helpful
          APIs that come with <code>createRoute</code>.</span
        >
      </div>

      <h2>Route Parameters</h2>
      <p>
        The <code>createRoute</code> function has a
        <a href="https://hono.dev/docs/api/context">Hono Context</a> parameter that can be used to
        access information from the <a href="https://hono.dev/docs/api/request">request</a>, like
        parameters from the route path, query string parameters, headers, cookies, etc.
      </p>

      ${highlightTS(`import { createRoute } from '@hyperspan/framework';

export default createRoute((c) => {
  return html\`<div>Hello, \${c.req.param('name')}!</div>\`;
});`)}

      <h2>Custom Route Handlers</h2>
      <p>
        If you need more control over routing or need to do something does doesn't fit within
        file-based routing, you can create a custom route handler function in
        <code>app/server.ts</code>. The <code>createServer</code> function will return a
        <a href="https://hono.dev">Hono</a> instance that you can use to add custom
        <a href="https://hono.dev/docs/api/routing">Hono Routes</a> or
        <a href="https://hono.dev/docs/concepts/middleware">Hono Middleware</a>.
      </p>

      ${highlightTS(`import { createServer } from '@hyperspan/framework';

const app = await createServer({
  appDir: './app',
  staticFileRoot: './public',
});

// Custom Hono Route
app.get('/my-custom-route', (c) => c.html('<div>Hello, world!</div>'));

export default app;`)}

      <p>
        If you need to add routes <em>before</em> the file-based routes are processed, you can do so
        by using the <code>beforeRoutesAdded</code> hook in <code>createServer</code>.
      </p>

      ${highlightTS(`import { createServer } from '@hyperspan/framework';

const app = await createServer({
  appDir: './app',
  staticFileRoot: './public',
  beforeRoutesAdded: (app) => {
    app.get('/custom-route-before-file-routes', (c) => c.html('<div>Hello, world!</div>'));
  },
});

export default app;`)}

      <h2>Custom Middleware</h2>
      <p>
        You can also add custom middleware to the Hono server in <code>app/server.ts</code>. This is
        useful for things like authentication, logging, etc.
      </p>

      ${highlightTS(`import { createServer } from '@hyperspan/framework';
import { trimTrailingSlash } from 'hono/trailing-slash';

const app = await createServer({
  appDir: './app',
  staticFileRoot: './public',
});

// Custom Hono Middleware
app.use(trimTrailingSlash());

export default app;`)}
      <p>
        If you are unfamiliar with middleware, you can read more about it in the
        <a href="https://hono.dev/docs/concepts/middleware">Hono Middleware</a> documentation.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Routes',
    content,
  });
});
