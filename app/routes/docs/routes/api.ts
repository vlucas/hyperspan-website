import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/docs-layout';
import { highlightTS } from '@/src/lib/syntax-highlighter';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>API Routes</h1>
      <p>
        In addition to page routes, Hyperspan also supports API routes. API routes are defined in a
        similar way as page routes, but using the <code>createAPIRoute</code> function instead of
        <code>createRoute</code>.
      </p>
      <p>
        API routes <strong>do not</strong> have to be in a specific directory - they can be in
        <em>any directory</em> within the <code>app/routes</code> directory, though
        <code>app/routes/api</code> is a common convention you may want to use. This provides a lot
        of flexibility to co-mingle page routes and API routes, and allows you to handle
        normal-looking URLs with API routes for things like tracking pixels, etc.
      </p>

      <p>
        For convenience for the most common use cases, API routes are assumed to be JSON routes
        unless you specify otherwise.
      </p>

      <h2>The <code>createAPIRoute</code> Function</h2>
      <p>The most basic API route is a function that returns a JSON object.</p>
      <p>
        Unlike page routes, you <em>must</em> call the <code>get()</code> method specifically to
        define the handler function for GET requests to this route (because API routes may not
        always be accessed via GET requests).
      </p>

      ${highlightTS(`import { createAPIRoute } from '@hyperspan/framework';

export default createAPIRoute().get(() => ({ message: 'Hello, world!' }));`)}
      <p>
        By default, API routes will return the object you provided, with some additonal structure:
      </p>
      ${highlightTS(
        `{
  meta: {
    success: true,
    dtResponse: '2025-07-29T12:00:00.000Z',
  },
  data: {
    message: 'Hello, world!',
  },
}`
      )}

      <h2>Custom Response Format or Structure</h2>
      <p>
        If you do not want or like this response structure, you can also return a
        <code>Response</code> object from the handler function. When a <code>Response</code> object
        is returned, it will be returned as-is, and the <code>meta</code> and
        <code>data</code> properties will not be added to the response.
      </p>
      ${highlightTS(`import { createAPIRoute } from '@hyperspan/framework';

export default createAPIRoute().get(() => Response.json({ message: 'Hello, world!' }));`)}
      <p>This route will return:</p>
      ${highlightTS(
        `{
  message: 'Hello, world!',
}`
      )}

      <h2>Returning XML or Other Formats</h2>
      <p>
        If you want to return a different format, return a <code>Response</code> object with the
        desired content type.
      </p>
      ${highlightTS(`import { createAPIRoute } from '@hyperspan/framework';

export default createAPIRoute().get(() => {
  return new Response('<?xml version="1.0" encoding="UTF-8"?><message>Hello, world!</message>', {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
});`)}
      <p>This route will return:</p>
      ${highlightTS(
        `<?xml version="1.0" encoding="UTF-8"?>
<message>Hello, world!</message>`
      )}
      <div class="alert alert-info alert-outline">
        <span>
          Note that API routes can return literally anything with a <code>Response</code> object -
          GraphQL responses, images, videos, streams, etc. - whatever your application needs.
        </span>
      </div>

      <h2>Error Handling</h2>
      <p>
        API routes have some special error handling built-in. If an error is thrown, it will be
        caught and returned as a JSON object with a <code>meta</code> object and a
        <code>data</code> object. The idea is that you can always check the
        <code>meta.success</code> property to see if the request was successful, and if not, you can
        check the <code>error</code> property to see what the error was.
      </p>
      ${highlightTS(`import { createAPIRoute } from '@hyperspan/framework';

export default createAPIRoute().get(() => {
  throw new Error('This is an error');
});`)}
      <p>
        By default, routes that throw an <code>Error</code> object will return a 500 status code and
        the following JSON object:
      </p>
      ${highlightTS(
        `{
  meta: {
    success: false,
    dtResponse: '2025-07-29T12:00:00.000Z',
  },
  data: {},
  error: {
    message: 'This is an error',
    stack: [], // Will have error stack trace in DEV, will not exist in PROD
  },
}`
      )}
      <p>
        If you do not want this default error handling behavior, put a <code>try/catch</code> around
        your code and return a <code>Response</code> object made to your liking.
      </p>
      ${highlightTS(`import { createAPIRoute } from '@hyperspan/framework';

export default createAPIRoute().get(async () => {
  try {
    const data = await fetchSomeData();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});`)}
      <p>Hyperspan will always return a <code>Response</code> object as-is:</p>
      ${highlightTS(
        `{
  error: 'This is an error',
}`
      )}

      <h2>Full API Route API</h2>
      <p>
        The <code>createAPIRoute</code> function returns a fluent API - an object with a several
        methods that can be used to define handlers for other HTTP methods and add optional
        route-specific middleware.
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
            <td>Defines the handler function for GET requests to this route.</td>
          </tr>
          <tr>
            <td><code>post()</code></td>
            <td>Defines the handler function for POST requests to this route.</td>
          </tr>
          <tr>
            <td><code>put()</code></td>
            <td>Defines the handler function for PUT requests to this route.</td>
          </tr>
          <tr>
            <td><code>patch()</code></td>
            <td>Defines the handler function for PATCH requests to this route.</td>
          </tr>
          <tr>
            <td><code>delete()</code></td>
            <td>Defines the handler function for DELETE requests to this route.</td>
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
        API routes can do a lot more than what is shown here! For a full list of functionality
        available to API routes, including custom route paths, accessing route params, adding global
        middleware, and more, see the <a href="/docs/routes">Routing Basics</a> page.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'API Routes',
    content,
  });
});
