# Hyperspan Server

The Hyperspan Server is a collection of routes with optional global middleware.

You won't usually create the server yourself. This will happen for you when you run `hyperspan start` or `hyperspan dev` to start the server.

You have full access to the Server via the [Hyperspan Config](/docs/config) object.

## Server API

| Method/Property                           | Type                                                                            | Description                         |
| ----------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- |
| `server.use(middleware)`                  | `(middleware: MiddlewareFunction) => Server`                                    | Add global middleware to the server |
| `server.get(path, handler, options?)`     | `(path: string, handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register a GET route handler        |
| `server.post(path, handler, options?)`    | `(path: string, handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register a POST route handler       |
| `server.put(path, handler, options?)`     | `(path: string, handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register a PUT route handler        |
| `server.patch(path, handler, options?)`   | `(path: string, handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register a PATCH route handler      |
| `server.delete(path, handler, options?)`  | `(path: string, handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register a DELETE route handler     |
| `server.options(path, handler, options?)` | `(path: string, handler: RouteHandler, options?: RouteHandlerOptions) => Route` | Register an OPTIONS route handler   |

All of the method options (`get`, `post`, etc.) will return a [Hyperspan Route](/docs/routes) object.
