# Hyperspan Middleware

Middleware is a function that runs before a route handler is called. It can be used to do things like:

- Validate request data
- Authenticate the user
- Log the request
- Add headers to the response
- etc.

## Middleware API

### MiddlewareFunction Type

A middleware function has the following signature:

```typescript
type MiddlewareFunction = (
  context: Hyperspan.Context,
  next: Hyperspan.NextFunction
) => Promise<Response> | Response;
```

The middleware receives:

- `context` - The [Hyperspan.Context](/docs/request-context) object with request, response, route info, etc.
- `next` - A function that returns `Promise<Response>`. Call `await next()` to continue to the next middleware or route handler.

The middleware must return a `Response` object. If you want to continue processing, call `await next()` and return its result (or modify it before returning).

### Using Middleware on Routes

You can set the middleware stack for a specific route using the `.middleware()` method:

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute((c) => {
  return html`<div>Hello, ${c.route.params.name}!</div>`;
})
  // Set the whole middleware stack at once
  .middleware([logger(), csrf()]);
```

Or you can add individual middleware functions with the `.use()` method:

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute((c) => {
  return html`<div>Hello, ${c.route.params.name}!</div>`;
})
  .use(logger()) // Add logger
  .use(csrf()); // Add CSRF
```

### Example: Creating a Middleware Function

Here's an example of a simple logging middleware:

```typescript
import { Hyperspan as HS } from '@hyperspan/framework';

export function logger() {
  return async (c: HS.Context, next: HS.NextFunction) => {
    const start = Date.now();
    console.log(`[${c.req.method}] ${c.req.url.pathname}`);

    const response = await next();

    const duration = Date.now() - start;
    console.log(`[${c.req.method}] ${c.req.url.pathname} - ${response.status} (${duration}ms)`);

    return response;
  };
}
```

This middleware logs the request method and path before processing, then logs the response status and duration after the route handler completes.
