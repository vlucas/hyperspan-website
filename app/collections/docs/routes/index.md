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
import { html } from '@hyperspan/html';
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
import { html } from '@hyperspan/html';

export default createRoute().get((c) => {
  return html`<div>Hello, ${c.route.params.name}!</div>`;
});
```

## Custom Routes With Config

If you need routes that are not tied to a file under `app/routes`, register them on the [server](/docs/server) from `hyperspan.config.ts` using `createConfig()`.

Pass a callback to **`beforeRoutesAdded`** to add routes **before** file-based routes are registered, or **`afterRoutesAdded`** to add them **after**. Use `beforeRoutesAdded` when a custom path should take precedence over a would-be file route, or when a handler must run early (for example health checks or webhooks).

```typescript
// hyperspan.config.ts
import { createConfig } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createConfig({
  appDir: './app',
  publicDir: './public',

  beforeRoutesAdded(server) {
    // JSON — same request context as file routes (`c.req`, `c.res`, etc.)
    server.get('/healthz', (c) => c.res.json({ ok: true }));

    // HTML - use @hyperspan/html, just like routes
    server.get('/custom/welcome', (c) => {
      return html`<main>
        <h1>Welcome</h1>
        <p>Registered from config.</p>
      </main>`;
    });

    // Another HTTP method on a custom path
    server.post('/custom/echo', async (c) => {
      const body = await c.req.json();
      return c.res.json({ youSent: body });
    });
  },

  afterRoutesAdded(server) {
    // Runs after `app/routes` are mounted — use for catch-alls or fallbacks
    server.get('/legacy-redirect', (c) => c.res.redirect('/docs', { status: 302 }));
  },
});
```

The `server` object supports the same style of routing helpers as elsewhere in Hyperspan (`get`, `post`, `put`, `patch`, `delete`, etc.). For JSON-only APIs you can often use [file-based API routes](/docs/routes/api) instead; config-based routes are for integration endpoints, redirects, or paths that do not map cleanly to the filesystem.

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

The `createRoute` function returns an object with `use()` and `middleware()` methods to define middleware for one specific route. This is useful for things like caching that are highly contextual and should only be applied to specific routes.

The middleware is applied in the order it is defined, and is applied to the route before the route handler is called.

```typescript
import { createRoute } from '@hyperspan/framework';
import { logger } from '~/src/middleware/logger';
import { cachetime } from '~/src/middleware/cachetime';

export default createRoute()
  .get((c) => {
    return html`<div>Hello, ${c.route.params.name}!</div>`;
  })
  .use(cachetime('1w'), { methods: ['GET'] })
  .use(logger());
```

The `middleware()` method can be used to define the whole middleware stack in one call (this will overwrite any previously set middleware):

```typescript
import { createRoute } from '@hyperspan/framework';
import { logger } from '~/src/middleware/logger';
import { cachetime } from '~/src/middleware/cachetime';

export default createRoute()
  .get((c) => {
    return html`<div>Hello, ${c.route.params.name}!</div>`;
  })
  .middleware([cachetime('1w'), logger()]);
```

## Route Method-Specific Middleware

Even within a route, sometimes you want certain middleware to apply only to a specific HTTP method, like a `POST` request. This is easy with the Hyperspan route object:

```typescript
import { createRoute } from '@hyperspan/framework';
import { logger } from '~/src/middleware/logger';
import { cachetime } from '~/src/middleware/cachetime';

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
  .middleware([cachetime('1w'), logger()]); // Middleware for any HTTP method on this route
```

## Global Middleware

You can add custom global middleware in `hyperspan.config.ts`. This is useful for things like logging and authentication. Server middleware will run for _all routes_, and will run _before_ any route-specific middleware does.

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

## Custom Error Handling

Use **`.errorHandler()`** to return a friendly HTTP `Response` when this route’s **middleware** or **handler** throws (anything that bubbles out of the route as an error). The callback receives **`(c, error)`** and can return an `html` template, just like a normal handler:

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute()
  .errorHandler((c, err) => {
    return html`
      <main class="prose p-8">
        <h1>Something went wrong</h1>
        <p>We could not complete this request.</p>
        <p><code>${err.message}</code></p>
        <p><a href="/">Back home</a></p>
      </main>
    `;
  })
  .get(() => {
    throw new Error('Example: replace with real logic');
  });
```

If you want to attach a custom error handler to many routes, use [route composition](/docs/routes/composition) to reduce code duplication.

## Automatic Request Handling

For some request types, Hyperspan will return a response for you.

### `OPTIONS` Pre-Flight Requests

To be in-line with the pre-flight request specification, Hyperspan will find a matching route, and return an response with the allowed HTTP methods that can be called on that route for any matching `OPTIONS` requests.

For example, if you define a route at `/example` with `GET` and `POST` handlers, an `OPTIONS /example` request will respond with `Access-Control-Allow-Methods: GET, POST`.

### Method Not Allowed

Any HTTP methods that are not handled for a given route path will automatically return a `405: Method Not Allowed` response.

### Not Found

Any request to a route path that with no match will return a `404: File Not Found` response.

## Advanced Routing

Check out [route composition](/docs/routes/composition) for more advanced routing use cases.

## Route API

The `createRoute()` function returns a `Route` object with the following methods:

| Method                                  | Type                                                                         | Description                              |
| --------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------- |
| `route.get(handler, options?)`          | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route`            | Register a GET request handler           |
| `route.post(handler, options?)`         | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route`            | Register a POST request handler          |
| `route.put(handler, options?)`          | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route`            | Register a PUT request handler           |
| `route.patch(handler, options?)`        | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route`            | Register a PATCH request handler         |
| `route.delete(handler, options?)`       | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route`            | Register a DELETE request handler        |
| `route.options(handler, options?)`      | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route`            | Register an OPTIONS request handler      |
| `route.all(handler, options?)`          | `(handler: RouteHandler, options?: RouteHandlerOptions) => Route`            | Request handler for any HTTP method      |
| `route.errorHandler(handler)`           | `(handler: (c, error) => ...) => Route`                                      | Register an error handler for this route |
| `route.use(middleware, opts?)`          | `(middleware: MiddlewareFunction, opts?: MiddlewareOptions) => Route`        | Add middleware to this route             |
| `route.middleware([middleware], opts?)` | `(middleware: Array<MiddlewareFunction>, opts?: MiddlewareOptions) => Route` | Set middleware stack for this route      |

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
