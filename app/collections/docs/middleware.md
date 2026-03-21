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

You can optionally specify an HTTP method the middleware applies to:

```typescript
// Add only to GET and POST requests
route.middleware([logger(), csrf()], { methods: ['GET', 'POST'] });
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

You can optionally specify which HTTP methods the middleware applies to:

```typescript
// Add only on POST requests
route.use(csrf(), { methods: ['POST'] });
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

## Built-in Validation Middleware

Hyperspan includes **Zod-based** validation helpers. Import them from `@hyperspan/framework/middleware` and define schemas with **Zod v4** (same major version the framework uses):

```shell
bun add zod
```

```typescript
import { z } from 'zod/v4';
import { validateQuery, validateBody } from '@hyperspan/framework/middleware';
```

### `validateQuery(schema)`

Validates **query string** parameters against a Zod schema. The raw query is converted to a plain object, parsed, and on success the result is assigned to **`c.vars.query`**.

```typescript
import { createRoute } from '@hyperspan/framework';
import { validateQuery } from '@hyperspan/framework/middleware';
import { z } from 'zod/v4';

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export default createRoute()
  .use(validateQuery(querySchema))
  .get((c) => {
    const { page, limit } = c.vars.query;
    return c.res.json({ page, limit });
  });
```

### `validateBody(schema, type?)`

Validates the **request body** against a Zod schema. On success, the parsed body is available on **`c.vars.body`**.

If you omit the second argument, the body format is inferred from **`Content-Type`**:

| `Content-Type`                      | Treated as                                     |
| ----------------------------------- | ---------------------------------------------- |
| `application/json`                  | JSON                                           |
| `multipart/form-data`               | `FormData` (converted to a plain object)       |
| `application/x-www-form-urlencoded` | URL-encoded form (converted to a plain object) |

If the header is missing or unrecognized, validation defaults to **JSON**.

Pass an explicit type when you want to force a parser regardless of headers:

```typescript
type TValidationType = 'json' | 'form' | 'urlencoded';

validateBody(schema); // infer from Content-Type
validateBody(schema, 'json');
validateBody(schema, 'form');
validateBody(schema, 'urlencoded');
```

Example: JSON `POST` body:

```typescript
import { createRoute } from '@hyperspan/framework';
import { validateBody } from '@hyperspan/framework/middleware';
import { z } from 'zod/v4';

const bodySchema = z.object({
  title: z.string().min(1),
  published: z.coerce.boolean().optional(),
});

export default createRoute()
  .use(validateBody(bodySchema))
  .post(async (c) => {
    const { title, published } = c.vars.body;
    return c.res.json({ title, published: published ?? false });
  });
```

### Validation errors (`ZodValidationError`)

If validation fails, the middleware throws an **`HTTPResponseException`** with status **`400`**. The error may wrap **`ZodValidationError`** (exported from `@hyperspan/framework/middleware`), which exposes:

- **`fieldErrors`** — per-field messages from Zod’s flattened error shape
- **`formErrors`** — top-level form errors

Use your app's global error handling or route-level error handlers to format these for clients (JSON API vs HTML).

### Other exports

The same module also exports **`executeMiddleware`**, a low-level helper that runs a mixed array of middleware and route handlers in order. Most apps should prefer **`createRoute()`** and `.use()` / `.middleware()` instead.
