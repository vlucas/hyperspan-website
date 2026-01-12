# Page Routes

Page routes are used to serve HTML pages and typically return [HTML templates](/docs/html).

### The `createRoute` Function

Page routes are created by calling the `createRoute` function.

The most basic route is a function that returns a string of HTML.

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute(() => html\`<div>Hello, world!</div>\`);
```

### Using Plain Functions

You _can_ define a route with a plain function, but you won't have the proper types included by default, or other helpful APIs like limiting the route to a specific HTTP method, adding route-specific middleware, etc.

```typescript
import { Context } from 'hono';
import { html } from '@hyperspan/html';

export default function (c: Context) {
return html\`<div>Hello, \${c.req.param('name')}!</div>\`;
}
```

> Plain functions for routes can be useful for migrating over from another framework, but they are not recommended for new projects due to the lack of type safety and other helpful APIs that come with `createRoute`.

## Handling POST Requests

Sometimes, you may also want your page route to handle POST requests. This can be useful for things like handling form submissions and logins without having to create a separate API endpoint for it or hookup custom client-side JavaScript. You can do this by adding a `post()` handler to the route.

```typescript
import { createRoute } from '@hyperspan/framework';
import { html } from '@hyperspan/html';

export default createRoute((c) => {
  return html`
    <p>Enter your name for a personalized greeting:</p>
    <form method="post">
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  `;
}).post(async (c) => {
  const formData = await c.req.formData();
  const name = formData.get('name');

  return html`<div>Hello, ${name}! Nice to meet you.</div>`;
});
```

## Handling Other HTTP Methods

Because page routes emulate standard HTML pages with form handling, they only support GET and POST HTTP request methods. If you need to handle other HTTP methods like `PUT`, `PATCH` or `DELETE`, you can use [API Routes](/docs/api-routes) instead.

## Full Page Route API

The `createRoute` function returns a fluent API - an object with a few methods that can be used to define handlers for other HTTP methods and add optional route-specific middleware.

| Method         | Description                                                                                                                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get()`        | Defines the handler function for GET requests to this route. This is the default handler that renders the page. You usually do not need to call this method directly, since it is the same as providing a function to `createRoute(fn)`. |
| `post()`       | Defines the handler function for POST requests to this route. Useful for handling form submissions.                                                                                                                                      |
| `middleware()` | Defines middleware functions that will be executed before the route handler. Accepts an array of middleware functions.                                                                                                                   |

## Full Functionality

Page routes can do a lot more than what is shown here! For a full list of functionality available to page routes, including custom route paths, accessing route params, adding global middleware, and more, see the [Routing Basics](/docs/routes) page.
