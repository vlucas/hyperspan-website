# Hyperspan Routes

Routes are the entry point for all requests to your application. They map a specific URL pattern to a specific file or route handler function.

In Hyperspan, there are 2 main ways of defining routes:

1. `app/routes` directory (file-based routes)
2. `hyperspan.config.ts` file (for adding custom routes)

## File-Based Routing

Hyperspan uses file-based routing. This means that you can create a file in the `app/routes` directory and it will be automatically picked up by the framework and added to your routing table.

Here are some examples of how files in the `app/routes` directory map to URL patterns:

| File Path                          | URL Pattern  |
| ---------------------------------- | ------------ |
| `app/routes/index.ts`              | `/`          |
| `app/routes/about.ts`              | `/about`     |
| `app/routes/posts/index.ts`        | `/posts`     |
| `app/routes/posts/[id].ts`         | `/posts/:id` |
| `app/routes/auth/[...authPath].ts` | `/auth/*`    |

Route and query params can be accessed from the [request context](/docs/request-context) object by name.

```typescript
// File: app/routes/posts/[id].ts
import { createRoute } from '@hyperspan/framework';
import { fetchPostById } from '~/src/entities/posts'; // whatever your data layer is

export default createRoute().get(async (c) => {
  const id = c.route.params.id; // 'id' will be set on the 'c.route.params' object
  const post = await fetchPostById(id);

  return html`<main>
    <h1>${post.title}</h1>
    <div>${post.content}</div>
  </main>`;
});
```

## Route Parameters

The `createRoute` function has a [request context](/docs/request-context), like parameters from the route path, query string parameters, headers, cookies, etc.

```typescript
import { createRoute } from '@hyperspan/framework';

export default createRoute().get((c) => {
  return html`<div>Hello, ${c.route.params.name}!</div>`;
});
```

## Custom Route Handlers

If you need more control over routing or need to do something that doesn't fit within file-based routing, you can create custom route handlers in `hyperspan.config.ts`. The `beforeRoutesAdded` and `afterRoutesAdded` configuration options accept a function that [server instance](/docs/server) that you can use to add custom routes to.

```typescript
import { createConfig } from '@hyperspan/framework';

export default createConfig({
  appDir: './app',
  publicDir: './public',
  beforeRoutesAdded: (server) => {
    server.get('/custom-route-before-file-routes', (c) => c.res.html('<div>Hello, custom!</div>'));
  },
  afterRoutesAdded: (server) => {
    server.get('/custom-route-after-file-routes', (c) => c.res.html('<div>Goodbye, custom!</div>'));
  },
});
```

## Handling POST Requests

Sometimes, you may also want your page route to handle POST requests. This can be useful for things like handling form submissions and logins without having to create a separate API endpoint for it or hookup custom client-side JavaScript. You can do this by adding a `post()` handler to the route.

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute()
  .get((c) => {
    return html`
      <p>Enter your name for a personalized greeting:</p>
      <form method="post">
        <input type="text" name="name" />
        <button type="submit">Submit</button>
      </form>
    `;
  })
  .post(async (c) => {
    const formData = await c.req.formData();
    const name = formData.get('name');

    return html`<div>Hello, ${name}! Nice to meet you.</div>`;
  });
```

## Handling Other HTTP Methods

Routes support all standard HTTP request methods with `.put()`, `.patch()`, `.delete()`, etc. Just chain them together, exactly like the example above.

## Route-Specific Middleware

The `createRoute` function returns an object with a `middleware()` method to define middleware for one specific route. This is useful for things like caching that are highly contextual and should only be applied to specific routes.

The middleware is applied in the order it is defined, and is applied to the route before the route handler is called.

```typescript
import { createRoute } from '@hyperspan/framework';
import { logger } from '~/src/middleware/logger';
import { csrf } from '~/src/middleware/csrf';

export default createRoute()
  .get((c) => {
    return html`<div>Hello, ${c.route.params.name}!</div>`;
  })
  .middleware([csrf(), logger()]);
```

## Route Method-Specific Middleware

Even within a route, sometimes you want certain middleware to apply only to a specific HTTP method, like a `POST` request. This is easy with the Hyperspan route object:

```typescript
import { createRoute } from '@hyperspan/framework';
import { logger } from '~/src/middleware/logger';
import { csrf } from '~/src/middleware/csrf';

export default createRoute()
  .get((c) => {
    return html`<div>Hello, ${c.route.params.name}!</div>`;
  })
  .post(
    (c) => {
      return html`<div>The POST method can only be reached by logged in users!</div>`;
    },
    { middleware: [userAuth()] } // POST-specific middleware
  )
  .middleware([csrf(), logger()]); // Middleware for any HTTP method on this route
```

## Global Middleware

You can add custom global middleware in `hyperspan.config.ts`. This is useful for things like logging and authentication.

```typescript
import { createConfig } from '@hyperspan/framework';
import { logger } from '~/src/middleware/logger';

export default createConfig({
  appDir: './app',
  publicDir: './public',
  beforeRoutesAdded: (server) => {
    // Add global logger middleware for ALL routes
    server.use(logger());
  },
});
```

If you are unfamiliar with middleware, you can read more about it in the [middleware documentation](/docs/middleware).

## Route API

The `createRoute()` function returns a `Route` object with the following methods:

| Method                             | Type                                                              | Description                              |
| ---------------------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| `route.get(handler, options?)`     | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register a GET request handler           |
| `route.post(handler, options?)`    | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register a POST request handler          |
| `route.put(handler, options?)`     | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register a PUT request handler           |
| `route.patch(handler, options?)`   | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register a PATCH request handler         |
| `route.delete(handler, options?)`  | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register a DELETE request handler        |
| `route.options(handler, options?)` | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register an OPTIONS request handler      |
| `route.all(handler, options?)`     | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Request handler for any HTTP method      |
| `route.errorHandler(handler)`      | `(handler: RouteHandler) => Route`                                | Register an error handler for this route |
| `route.use(middleware)`            | `(middleware: MiddlewareFunction) => Route`                       | Add middleware to this route             |
| `route.middleware([middleware])`   | `(middleware: Array<MiddlewareFunction>) => Route`                | Set middleware stack for this route      |

The object is a fluent API so you can chain methods together to handle multiple HTTP methods for a single route path, like so:

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute()
  .get((c) => {
    return html`<p>GET request!</p>`;
  })
  .post((c) => {
    return html`<p>POST request!</p>`;
  })
  .delete((c) => {
    return html`<p>DELETE request!</p>`;
  });
```

### RouteHandler

A `RouteHandler` is a function that receives the context and returns a response:

```typescript
type RouteHandler = (context: Hyperspan.Context) => Response | Promise<Response> | unknown;
```

The handler can return:

- HTML template (from `@hyperspan/html`)
- A `Response` object
- Any value that can be converted to a response

## Automatic Request Handling

For some request types, Hyperspan will return a response for you.

### `OPTIONS` Pre-Flight Requests

To be in-line with the pre-flight request specification, Hyperspan will find a matching route, and return an response with the allowed HTTP methods that can be called on that route for any matching `OPTIONS` requests.

For example, if you define a route at `/example` with `GET` and `POST` handlers, an `OPTIONS /example` request will respond with `Access-Control-Allow-Methods: GET, POST`.

### Method Not Allowed

Any HTTP methods that are not handled for a given route path will automatically return a `405: Method Not Allowed` response.

### Not Found

Any request to a route path that with no match will return a `404: File Not Found` response.
