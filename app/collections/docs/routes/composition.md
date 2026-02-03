# Route Composition

Hyperpspan uses a flexible API for routes that makes it easy to build, extend, and compose routes for your own purposes.

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
