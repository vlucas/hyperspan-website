import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';
import { highlightTS } from '@/src/lib/syntax-highlighter';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Page Routes</h1>
      <p>
        Page routes are used to serve HTML pages and typically return
        <a href="/docs/html">HTML templates</a>.
      </p>

      <h3>The <code>createRoute</code> Function</h3>
      <p>
        Page routes are created by calling the
        <code>createRoute</code> function.
      </p>
      <p>The most basic route is a function that returns a string of HTML.</p>

      ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute(() => html\`<div>Hello, world!</div>\`);`)}

      <h3>Using Plain Functions</h3>
      <p>
        You <em>can</em> define a route with a plain function, but you won't have the proper types
        included by default, or other helpful APIs like limiting the route to a specific HTTP
        method, adding route-specific middleware, etc.
      </p>

      ${highlightTS(`import { Context } from 'hono';
import { html } from '@hyperspan/html';

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

      <h2>Handling POST Requests</h2>
      <p>
        Sometimes, you may also want your page route to handle POST requests. This can be useful for
        things like handling form submissions and logins without having to create a separate API
        endpoint for it or hookup custom client-side JavaScript. You can do this by adding a
        <code>post()</code> handler to the route.
      </p>

      ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute((c) => {
  return html\`
    <p>Enter your name for a personalized greeting:</p>
    <form method="post">
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  \`;
}).post(async (c) => {
  const formData = await c.req.formData();
  const name = formData.get('name');

  return html\`<div>Hello, \${name}! Nice to meet you.</div>\`;
});`)}

      <h2>Handling Other HTTP Methods</h2>
      <p>
        Because page routes emulate standard HTML pages with form handling, they only support GET
        and POST HTTP request methods. If you need to handle other HTTP methods like
        <code>PUT</code>, <code>PATCH</code> or <code>DELETE</code>, you can use
        <a href="/docs/api-routes">API Routes</a> instead.
      </p>

      <h2>Full Page Route API</h2>
      <p>
        The <code>createRoute</code> function returns a fluent API - an object with a few methods
        that can be used to define handlers for other HTTP methods and add optional route-specific
        middleware.
      </p>
      <table class="table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>get()</code></td>
            <td>
              Defines the handler function for GET requests to this route. This is the default
              handler that renders the page. You usually do not need to call this method directly,
              since it is the same as providing a function to <code>createRoute(fn)</code>.
            </td>
          </tr>
          <tr>
            <td><code>post()</code></td>
            <td>
              Defines the handler function for POST requests to this route. Useful for handling form
              submissions.
            </td>
          </tr>
          <tr>
            <td><code>middleware()</code></td>
            <td>
              Defines middleware functions that will be executed before the route handler. Accepts
              an array of middleware functions.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Full Functionality</h2>
      <p>
        Page routes can do a lot more than what is shown here! For a full list of functionality
        available to page routes, including custom route paths, accessing route params, adding
        global middleware, and more, see the <a href="/docs/routes">Routing Basics</a> page.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Page Routes',
    content,
  });
});
