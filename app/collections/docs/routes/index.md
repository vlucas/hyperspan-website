# Routing Basics

Routes are the entry point for all requests to your application. They map a specific URL pattern to a specific file or route handler function.

> This page includes information about base functionality for **both page routes and API routes**. Read this page first, then read the page for the type of route you are interested in.

In Hyperspan, there are 2 built-in types of routes:

1. [Page routes](/docs/routes/pages) — for HTML pages
2. [API routes](/docs/routes/api) — for JSON endpoints and other types of content

Both types of routes can live in two main places:

1. `app/routes` directory (file-based routes)
2. `app/server.ts` file (custom route handlers)

## File-Based Routing

Both [page routes](/docs/routes/pages) and [API routes](/docs/routes/api) use file-based routing. This means that you can create a file in the `app/routes` directory and it will be automatically picked up by the framework and added to your routing table.

Here are some examples of how files in the `app/routes` directory map to URL patterns:

| File Path                          | URL Pattern  |
| ---------------------------------- | ------------ |
| `app/routes/index.ts`              | `/`          |
| `app/routes/about.ts`              | `/about`     |
| `app/routes/posts/index.ts`        | `/posts`     |
| `app/routes/posts/[id].ts`         | `/posts/:id` |
| `app/routes/auth/[...authPath].ts` | `/auth/*`    |

Route and query params can be accessed from the [Hono Request](https://hono.dev/docs/api/request) object by name.

\`\`\`typescript
// File: app/routes/posts/[id].ts
import { createRoute } from '@hyperspan/framework';
import { fetchPostById } from '@/src/entities/posts'; // whatever your data layer is

export default createRoute(async (c) => {
const id = c.req.param('id');
const post = await fetchPostById(id);

return html\`<main>
<h1>\${post.title}</h1>
<div>\${post.content}</div>

  </main>\`;
});
\`\`\`

### Using Plain Functions

You _can_ define a route with a plain function, but you won't have the proper types included by default, or other helpful APIs like limiting the route to a specific HTTP method, adding route-specific middleware, etc.

\`\`\`typescript
import { Context } from 'hono';

export default function (c: Context) {
return html\`<div>Hello, \${c.req.param('name')}!</div>\`;
}
\`\`\`

> Plain functions for routes can be useful for migrating over from another framework, but they are not recommended for new projects due to the lack of type safety and other helpful APIs that come with `createRoute`.

## Route Parameters

The `createRoute` and `createAPIRoute` functions have a [Hono Context](https://hono.dev/docs/api/context) parameter that can be used to access information from the [request](https://hono.dev/docs/api/request), like parameters from the route path, query string parameters, headers, cookies, etc.

\`\`\`typescript
import { createRoute } from '@hyperspan/framework';

export default createRoute((c) => {
return html\`<div>Hello, \${c.req.param('name')}!</div>\`;
});
\`\`\`

## Custom Route Paths

If you need more flexibility than file-based routing provides, you can import any file-based route and make it accessible with any custom path or URL pattern you define. Just import `createRouteFromModule` from `@hyperspan/framework` and pass in the whole imported module.

\`\`\`typescript
import hyperspanConfig from '../hyperspan.config';
import { createServer, createRouteFromModule } from '@hyperspan/framework';
import PostPageRoute from '@/app/routes/posts/[id].ts';

const app = await createServer(hyperspanConfig);

// Make post page route accessible at:
// /posts/:id (file-based route via Hyperspan)
// /articles/:id (custom path defined here)
const postRouteHandlers = createRouteFromModule(PostPageRoute);
app.get('/articles/:id', ...postRouteHandlers);

export default app;
\`\`\`

> Note that `createRouteFromModule` returns an array that includes any middleware that was defined in the route. Use the spread operator (`...`) to ensure all route handlers are added for the path.

## Custom Route Handlers

If you need more control over routing or need to do something that doesn't fit within file-based routing, you can create a custom route handler function in `app/server.ts`. The `createServer` function will return a [Hono](https://hono.dev) instance that you can use to add custom [Hono Routes](https://hono.dev/docs/api/routing) or [Hono Middleware](https://hono.dev/docs/concepts/middleware).

\`\`\`typescript
import hyperspanConfig from '../hyperspan.config';
import { createServer } from '@hyperspan/framework';

const app = await createServer(hyperspanConfig);

// Custom Hono Route
app.get('/my-custom-route', (c) => c.html('<div>Hello, world!</div>'));

export default app;
\`\`\`

If you need to add routes _before_ the file-based routes are processed, you can do so by using the `beforeRoutesAdded` hook in `createConfig` in your `hyperspan.config.ts` file.

\`\`\`typescript
import { createConfig } from '@hyperspan/framework';

export default createConfig({
appDir: './app',
staticFileRoot: './public',
beforeRoutesAdded: (app) => {
app.get('/custom-route-before-file-routes', (c) => c.html('<div>Hello, world!</div>'));
},
});
\`\`\`

## Route-Specific Middleware

The `createRoute` function returns an object with a `middleware()` method to define middleware for one specific route. This is useful for things like caching that are highly contextual and should only be applied to specific routes.

The middleware is applied in the order it is defined, and is applied to the route before the route handler is called. Any middleware that is made for Hono can be used here.

\`\`\`typescript
import { createRoute } from '@hyperspan/framework';
import { logger } from 'hono/logger';
import { csrf } from 'hono/csrf';

export default createRoute((c) => {
return html\`<div>Hello, \${c.req.param('name')}!</div>\`;
}).middleware([
csrf(),
logger(),
]);
\`\`\`

## Global or Path-Specific Middleware

You can add custom global or path-specific middleware to the Hono server directly in `app/server.ts`. This is useful for more global or path-specific things like authentication, logging, etc.

\`\`\`typescript
import hyperspanConfig from '../hyperspan.config';
import { createServer } from '@hyperspan/framework';
import { trimTrailingSlash } from 'hono/trailing-slash';

const app = await createServer(hyperspanConfig);

// Custom Hono Middleware
app.use(trimTrailingSlash());

export default app;
\`\`\`

If you are unfamiliar with middleware, you can read more about it in the [Hono Middleware](https://hono.dev/docs/concepts/middleware) documentation.
