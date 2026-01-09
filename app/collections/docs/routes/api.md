# API Routes

In addition to page routes, Hyperspan also supports API routes. API routes are defined in a similar way as page routes, but using the `createAPIRoute` function instead of `createRoute`.

API routes **do not** have to be in a specific directory - they can be in *any directory* within the `app/routes` directory, though `app/routes/api` is a common convention you may want to use. This provides a lot of flexibility to co-mingle page routes and API routes, and allows you to handle normal-looking URLs with API routes for things like tracking pixels, etc.

For convenience for the most common use cases, API routes are assumed to be JSON routes unless you specify otherwise.

## The `createAPIRoute` Function

The most basic API route is a function that returns a JSON object.

Unlike page routes, you *must* call the `get()` method specifically to define the handler function for GET requests to this route (because API routes may not always be accessed via GET requests).

\`\`\`typescript
import { createAPIRoute } from '@hyperspan/framework';

export default createAPIRoute().get(() => ({ message: 'Hello, world!' }));
\`\`\`

By default, API routes will return the object you provided, with some additonal structure:

\`\`\`json
{
  meta: {
    success: true,
    dtResponse: '2025-07-29T12:00:00.000Z',
  },
  data: {
    message: 'Hello, world!',
  },
}
\`\`\`

## Custom Response Format or Structure

If you do not want or like this response structure, you can also return a `Response` object from the handler function. When a `Response` object is returned, it will be returned as-is, and the `meta` and `data` properties will not be added to the response.

\`\`\`typescript
import { createAPIRoute } from '@hyperspan/framework';

export default createAPIRoute().get(() => Response.json({ message: 'Hello, world!' }));
\`\`\`

This route will return:

\`\`\`json
{
  message: 'Hello, world!',
}
\`\`\`

## Returning XML or Other Formats

If you want to return a different format, return a `Response` object with the desired content type.

\`\`\`typescript
import { createAPIRoute } from '@hyperspan/framework';

export default createAPIRoute().get(() => {
  return new Response('<?xml version="1.0" encoding="UTF-8"?><message>Hello, world!</message>', {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
});
\`\`\`

This route will return:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<message>Hello, world!</message>
\`\`\`

> Note that API routes can return literally anything with a `Response` object - GraphQL responses, images, videos, streams, etc. - whatever your application needs.

## Error Handling

API routes have some special error handling built-in. If an error is thrown, it will be caught and returned as a JSON object with a `meta` object and a `data` object. The idea is that you can always check the `meta.success` property to see if the request was successful, and if not, you can check the `error` property to see what the error was.

\`\`\`typescript
import { createAPIRoute } from '@hyperspan/framework';

export default createAPIRoute().get(() => {
  throw new Error('This is an error');
});
\`\`\`

By default, routes that throw an `Error` object will return a 500 status code and the following JSON object:

\`\`\`json
{
  meta: {
    success: false,
    dtResponse: '2025-07-29T12:00:00.000Z',
  },
  data: {},
  error: {
    message: 'This is an error',
    stack: [], // Will have error stack trace in DEV, will not exist in PROD
  },
}
\`\`\`

If you do not want this default error handling behavior, put a `try/catch` around your code and return a `Response` object made to your liking.

\`\`\`typescript
import { createAPIRoute } from '@hyperspan/framework';

export default createAPIRoute().get(async () => {
  try {
    const data = await fetchSomeData();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

Hyperspan will always return a `Response` object as-is:

\`\`\`json
{
  error: 'This is an error',
}
\`\`\`

## Full API Route API

The `createAPIRoute` function returns a fluent API - an object with a several methods that can be used to define handlers for other HTTP methods and add optional route-specific middleware.

| Method | Description |
|--------|-------------|
| `get()` | Defines the handler function for GET requests to this route. |
| `post()` | Defines the handler function for POST requests to this route. |
| `put()` | Defines the handler function for PUT requests to this route. |
| `patch()` | Defines the handler function for PATCH requests to this route. |
| `delete()` | Defines the handler function for DELETE requests to this route. |
| `middleware()` | Defines middleware functions that will be executed before the route handler. Accepts an array of middleware functions. |

## Full Functionality

API routes can do a lot more than what is shown here! For a full list of functionality available to API routes, including custom route paths, accessing route params, adding global middleware, and more, see the [Routing Basics](/docs/routes) page.
