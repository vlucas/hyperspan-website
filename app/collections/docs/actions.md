# Hyperspan Actions

Actions are a built-in way to render forms that submit their data back to the server and update the view with the result in-place automatically.

Actions allow you to:

- Use very little JavaScript (no front-end framework required)
- Keep all of the logic on the server (rendering, error handling, form validation and data processing, etc.)
- Not be forced to build an API for simple interactions
- Import and render a form anywhere you need to inside a template
- Use middleware for things like security and auth, just like a normal route
- Use [dynamic islands](/docs/clientjs/islands) inside forms if you need to build more complex interactions or UI components

## Using Actions

Actions are treated similar to routes, but can be embedded in other templates and routes, and have a few unique differences.

All actions have the following requirements:

- They should be placed in the `src/actions` directory.
- They should be given a unique `name`.
- They should render an HTML template with a `<form>` tag.
- They should maintain all state in form fields (Actions use a traditional form POST operation and extract data from a `FormData` object.)

NOTE: If you use a frontend framework like React to build more complex forms, just make sure you still set data into hidden form fields so actions can still work as intended.

## Example Action Usage

First, create your action in `src/actions`:

```typescript
import { createAction } from '@hyperspan/framework/actions';
import { z } from 'zod/v4';

// File: `src/actions/exmple-action.ts
export default createAction({
  name: 'example-action',
  schema: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
})
  .form((c, { data }) => {
    return html`
      <form>
        <input type="text" name="name" value="${data?.name}" />
        <button type="submit">Submit</button>
      </form>
    `;
  })
  .post(async (c, { data }) => {
    return c.res.html(`
      <p>Hello, ${data?.name}!</p>
    `);
  });
```

Then import and `render` your action wherever you like in your application:

```typescript
import { createRoute } from '@hyperspan/framework';
import ExampleAction from '~/src/actions/example-action';

export default createRoute().get((c) => {
  return html`
    <p>Hello there! Enter your name below:</p>

    <!-- Render embedded Action form here! -->
    ${ExampleAction.render(c)}
  `;
});
```

You can also optionally pass data to the form `render` method:

```typescript
 ${ExampleAction.render(c, { data: { name: 'John Doe' }})}
```

Hyperspan will render the `form` method of the action in-line just like any other template. If the `form` method is `async`, it will [stream in](/docs/streaming).

## Action Schemas

Actions can provide an optional [Zod v4](https://zod.dev/v4) schema object in the `schema` property of `createAction`. Providing one is highly recommended.

```typescript
createAction({ name: 'example-action', schema: zodSchema });
```

When a schema is provided, the `data` object will be type-safe in forms and handlers, and validation of `data` against the `schema` will happen automatically on form submit.
