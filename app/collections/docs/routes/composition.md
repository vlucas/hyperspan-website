# Route Composition

Hyperspan uses a flexible API for routes that makes it easy to build, extend, and compose routes for your own purposes.

Many apps will have different paths with different levels of access, like public routes, API routes, and application routes for logged-in users. Remembering to import and use all the appropriate middleware can get a bit messy and error prone, so a good pattern to use is route composition.

Since routes are just objects in Hyperspan, you can define your own route type functions, configure a route object in them, add all the appropriate middleware, and then return them for use in the appropriate routes.

## Creating Your Own Route Types

First, define a function that returns a route object:

```typescript
// Path: src/api-route.ts
import { createRoute } from '@hyperspan/framework';
import { apiAuthMiddleware } from '~/src/auth/api-middleware'; // Your custom middleware

export function createAPIRoute() {
  return createRoute().use(apiAuthMiddleware());
}
```

Now you can use this route type in all your API routes without having to import and attach the correct auth middleware to every API route you define:

```typescript
import { createAPIRoute } from '~/src/api-route';

export default createAPIRoute().get((c) => {
  return c.res.json({ foo: 'bar' });
});
```

## Custom Error Handler

Use **`.errorHandler()`** on a route to catch errors thrown while running that route’s middleware or handler (including failures from [validation middleware](/docs/middleware#built-in-validation-middleware-hyperspanframeworkmiddleware)). The handler receives **`(c, error)`** and should return a **`Response`**. If you return **`c.res.json(...)`**, Hyperspan uses that response as-is instead of wrapping it as HTML.

A common pattern is to define JSON error formatting once on your **composed API route** so every API file gets the same shape.

Built-in **`validateQuery`** / **`validateBody`** throw **`HTTPResponseException`** with status **400** and the original **`ZodValidationError`** on **`_error`**. Unwrap that to return structured JSON:

```typescript
// Path: src/api-route.ts
import { createRoute, HTTPResponseException } from '@hyperspan/framework';
import { ZodValidationError } from '@hyperspan/framework/middleware';

export function createAPIRoute() {
  return createRoute().errorHandler((c, err) => {
    const zodErr =
      err instanceof ZodValidationError
        ? err
        : err instanceof HTTPResponseException && err._error instanceof ZodValidationError
          ? err._error
          : null;

    if (zodErr) {
      return c.res.json(
        {
          error: 'validation_error',
          message: zodErr.message,
          fields: zodErr.fieldErrors,
          formErrors: zodErr.formErrors,
        },
        { status: 400 }
      );
    }

    // Optional: re-use status from other HTTPResponseException cases
    if (err instanceof HTTPResponseException && err._response) {
      return err._response;
    }

    return c.res.json(
      {
        error: 'internal_error',
        message: err.message,
      },
      { status: 500 }
    );
  });
}
```

Then any route built from `createAPIRoute()` will return consistent JSON on validation failures and unexpected errors:

```typescript
import { createAPIRoute } from '~/src/api-route';
import { validateBody } from '@hyperspan/framework/middleware';
import { z } from 'zod/v4';

const schema = z.object({ name: z.string().min(1) });

export default createAPIRoute()
  .use(validateBody(schema))
  .post(async (c) => {
    return c.res.json({ ok: true, name: c.vars.body.name });
  });
```
