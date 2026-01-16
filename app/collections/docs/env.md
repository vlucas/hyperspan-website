# Environment Variables

Since Hyperspan uses Bun, loading environment variables from a `.env` file or the command line into `process.env` is automatic and built-in.

Read the [Bun Environment Variables](https://bun.sh/guides/runtime/set-env) documentation to get familiar with exactly how it works.

## Using Environment Variables in Client-Side Code

If you need to use environment variables in client-side code like Preact components, you need to prefix them with `APP_PUBLIC_`.

For example, if you have an environment variable called `API_URL` that you need to use in a client component, you should name the variable `APP_PUBLIC_API_URL` in your `.env` file.

When you access it in your client component, you can use `process.env.APP_PUBLIC_API_URL`. Any environment variables used in client components that start with `APP_PUBLIC_` will be automatically inlined into the component on build as strings (when they are imported with an [island plugin](/docs/clientjs/islands)) so that the `process.env` object is removed from the end result.

This ensures that sensitive environment variables are not inadvertenly exposed or leaked to the client.
