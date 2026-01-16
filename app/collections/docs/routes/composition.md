# Route Composition

Hyperpspan uses a flexible API for routes that makes it easy to build, extend, and compose routes for your own purposes.

Many apps will have different paths with different levels of access, like

## Creating Your Own Route Types

```typescript
// Path: src/api-route.ts
import { createRoute } from '@hyperspan/framework';
import { apiAuthMiddleware } from '~/src/auth/api-middleware.ts'; // Your custom middleware

export function createAPIRoute() {
  return createRoute().middleware([apiAuth()]);
}
```

Now you can use this route type in all your API routes without having to import and attach the correct auth middleware to each one:

```typescript
import { createAPIRoute } from '~/src/api-route';

export default createAPIRoute().get((c) => {
  return c.res.json({ foo: 'bar' });
});
```
