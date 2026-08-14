# Request Context

Each route is passed a single parameter - the `Hyperspan.Context` object. The Context object provides access to the request, response, route information, variables, and cookie getters/setters.

## Context API

| Property/Method                            | Type                                  | Description                            |
| ------------------------------------------ | ------------------------------------- | -------------------------------------- |
| `c.vars`                                   | `Record<string, any>`                 | Variables set by middleware            |
| `c.url(diff?, options?)`                 | `string`                              | Build a relative URL from the current request |
| `c.route`                                  | `RouteConfig`                         | Route information                      |
| `c.route.name`                             | `string \| undefined`                 | Route name                             |
| `c.route.path`                             | `string`                              | Route path pattern                     |
| `c.route.params`                           | `Record<string, string \| undefined>` | Route parameters object                |
| `c.route.cssImports`                       | `string[]`                            | CSS files imported in this route       |
| `c.req`                                    | `HSRequest`                           | The request object                     |
| `c.req.url`                                | `URL`                                 | The request URL object                 |
| `c.req.raw`                                | `Request`                             | The raw Request object                 |
| `c.req.method`                             | `string`                              | HTTP method (always uppercase)         |
| `c.req.headers`                            | `Headers`                             | Request headers (case-insensitive)     |
| `c.req.query`                              | `URLSearchParams`                     | Query parameters                       |
| `c.req.cookies`                            | `Cookies`                             | Cookie helper object                   |
| `c.req.cookies.get(name)`                  | `string \| undefined`                 | Get a cookie by name                   |
| `c.req.cookies.set(name, value, options?)` | `void`                                | Set a cookie                           |
| `c.req.cookies.delete(name)`               | `void`                                | Delete a cookie                        |
| `c.req.text()`                             | `Promise<string>`                     | Get request body as text               |
| `c.req.json<T>()`                          | `Promise<T>`                          | Parse request body as JSON             |
| `c.req.formData()`                         | `Promise<FormData>`                   | Parse request body as FormData         |
| `c.req.urlencoded()`                       | `Promise<URLSearchParams>`            | Parse request body as URL-encoded form |
| `c.res`                                    | `HSResponse`                          | The response object                    |
| `c.res.raw`                                | `Response`                            | The raw Response object                |
| `c.res.headers`                            | `Headers`                             | Response headers                       |
| `c.res.cookies`                            | `Cookies`                             | Cookie helper object                   |
| `c.res.cookies.get(name)`                  | `string \| undefined`                 | Get a cookie by name                   |
| `c.res.cookies.set(name, value, options?)` | `void`                                | Set a cookie                           |
| `c.res.cookies.delete(name)`               | `void`                                | Delete a cookie                        |
| `c.res.html(html, options?)`               | `Response`                            | Return HTML response                   |
| `c.res.json(json, options?)`               | `Response`                            | Return JSON response                   |
| `c.res.text(text, options?)`               | `Response`                            | Return text response                   |
| `c.res.redirect(url, options?)`            | `Response`                            | Redirect to a URL                      |
| `c.res.error(error, options?)`             | `Response`                            | Return error response                  |
| `c.res.notFound(options?)`                 | `Response`                            | Return 404 Not Found response          |
| `c.res.merge(response)`                    | `Response`                            | Merge another response into this one   |

## Building URLs

Use `c.url(diff?, options?)` to build link URLs from the current request URL. It returns a relative string (`pathname + search + hash`) suitable for `href` attributes and redirects.

Omitted diff keys keep the current value. Pass `null` to remove a part: `pathname: null` → `/`, `searchParams: null` → clear query, `hash: null` → clear fragment. Inside `searchParams`, `null` deletes that param; other values set or overwrite as strings.

```typescript
// Current URL: /posts?sort=asc#top

c.url({ searchParams: { page: 2 } })
// → "/posts?sort=asc&page=2#top"

c.url({ searchParams: { sort: null, page: 3 } })
// → "/posts?page=3#top"

c.url({ pathname: '/archive', hash: null, searchParams: null })
// → "/archive"

c.url({ searchParams: { page: 2 } }, { clean: true })
// → "/posts?page=2"
// (starts from pathname only, ignoring current query and hash)
```

Pass `{ clean: true }` when you want to drop the current query string and hash before applying the diff — useful for pagination links that should not inherit unrelated params.

`c.url()` does not mutate `c.req.url` or `c.req.query`.

## Cookies API

The `Cookies` object is available on both `c.req.cookies` for reading cookie values, and `c.res.cookies` for setting cookies.

| Method                               | Type                  | Description                        |
| ------------------------------------ | --------------------- | ---------------------------------- |
| `cookies.get(name)`                  | `string \| undefined` | Get a cookie value by name         |
| `cookies.set(name, value, options?)` | `void`                | Set a cookie with optional options |
| `cookies.delete(name)`               | `void`                | Delete a cookie by name            |

### CookieOptions

When setting a cookie, you can pass an optional `CookieOptions` object:

| Property   | Type                        | Description                                                     |
| ---------- | --------------------------- | --------------------------------------------------------------- |
| `maxAge`   | `number`                    | Maximum age of the cookie in seconds                            |
| `domain`   | `string`                    | Domain for which the cookie is valid                            |
| `path`     | `string`                    | Path for which the cookie is valid (default: `/`)               |
| `expires`  | `Date`                      | Expiration date for the cookie                                  |
| `httpOnly` | `boolean`                   | Whether the cookie is accessible only via HTTP (not JavaScript) |
| `secure`   | `boolean`                   | Whether the cookie should only be sent over HTTPS               |
| `sameSite` | `'lax' \| 'strict' \| true` | SameSite attribute for CSRF protection                          |
