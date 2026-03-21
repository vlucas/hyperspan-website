# API Routes

API routes are not treated differently or special at the framework level. API endpoints use the same [file-based routing](/docs/routes) as pages, and use the same `createRoute()` function as well - they just return something other than HTML.

By convention, most people put API routes in `app/routes/api` to separate them from other pages, but with Hyperspan, you have the flexibility to put them wherever you want.

## Example GET: Return JSON

```typescript
// File: app/routes/api/health.ts
import { createRoute } from '@hyperspan/framework';

export default createRoute().get((c) => {
  return c.res.json({ ok: true, uptime: process.uptime() });
});
```

`c.res.json()` sets the appropriate `Content-Type` and serializes the body as JSON.

## Example POST: read JSON, return JSON

Use `c.req.json()` to parse the request body, then respond with `c.res.json()`:

```typescript
// File: app/routes/api/echo.ts
import { createRoute } from '@hyperspan/framework';

export default createRoute().post(async (c) => {
  const body = await c.req.json<{ message?: string }>();
  return c.res.json({ received: body });
});
```

## Multiple methods on one route (chaining)

One file can handle several HTTP verbs by chaining `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()`, and so on. Each method runs only for matching requests to that path and HTTP method:

```typescript
// File: app/routes/api/items/[id].ts
import { createRoute } from '@hyperspan/framework';

export default createRoute()
  .get((c) => {
    const { id } = c.route.params;
    return c.res.json({ id, name: `Item ${id}` });
  })
  .put(async (c) => {
    const { id } = c.route.params;
    const body = await c.req.json<{ name?: string }>();
    return c.res.json({ id, ...body });
  })
  .delete((c) => {
    const { id } = c.route.params;
    return c.res.json({ deleted: id });
  });
```

Unhandled methods for that path return `405 Method Not Allowed`. For more patterns (HTML forms, middleware), see [Hyperspan Routes](/docs/routes#handling-post-requests).

## Status codes and headers

Pass a second argument to shape the response (for example HTTP status or extra headers), consistent with other `c.res.*` helpers:

```typescript
return c.res.json({ error: 'Not found' }, { status: 404 });
```

See the [Request Context](/docs/request-context) reference for the full `c.req` / `c.res` API.
