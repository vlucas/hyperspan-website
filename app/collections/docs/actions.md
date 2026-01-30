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
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  }),
})
  .form((c, { data, error }) => {
    return html`
      <form>
        ${error && html`<div class="alert alert-error">${error.message}</div>`}
        <input type="text" name="name" value="${data?.name}" />
        <button type="submit">Submit</button>
      </form>
    `;
  })
  .post(async (c, { data }) => {
    return c.res.html(`
      <p>Hello, ${data.name}!</p>
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

## Error Handling

When a schema is provided, Hyperspan will automatically validate the input `FormData` against the provided Zod schema.

If the input data does not pass schema validation, Hyperspan will re-render the form with a `ZodValidationError` passed into the `form` method. You can see if it exists, and use it to display errors if so:

```typescript
import { createAction } from '@hyperspan/framework/actions';
import { z } from 'zod/v4';

// File: `src/actions/exmple-action.ts
export default createAction({
  name: 'example-action',
  schema: z.object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  }),
})
  .form((c, { data, error }) => {
    return html`
      <form>
        ${error && html`<div class="alert alert-error">${error.message}</div>`}
        <input type="text" name="name" value="${data?.name}" />
        <button type="submit">Submit</button>
      </form>
    `;
  })
  .post(async (c, { data }) => {
    return c.res.html(`
      <p>Hello, ${data.name}!</p>
    `);
  });
```

The `ZodValidationError` class uses [zod.prettifyError()](https://zod.dev/error-formatting?id=zprettifyerror) to format all errors into a nice string message (accessible with `e.message`). It also has all the fields in [zod.flatterError()](https://zod.dev/error-formatting?id=zflattenerror) available on it so that you can show error messages specific to certain fields more easily (accessible with `e.fieldErrors.<fieldName>`, i.e. `e.fieldErrors.name` in this example).

If your `post` handler throws an error, the error will be caught and the `form` will be re-displayed with that error set in the `error` property. You can display it or handle it however you want, similar to the code above.

## Responding With a Redirect

Sometimes all you want to do with an action is insert a new record, then redirect to it. If your `post` handler returns a redirect (a `Response` object with a `Location` header), Hyperspan will pick this up on the client and redirect the user to that URL. This is the age old [POST/Redirect/GET](https://en.wikipedia.org/wiki/Post/Redirect/Get) pattern.

```typescript
import { createAction } from '@hyperspan/framework/actions';
import { z } from 'zod/v4';

// File: `src/actions/notes/create-note-action.ts
export default createAction({
  name: 'create-note-action',
  schema: z.object({
    note: z.string(),
  }),
})
  .form((c, { data, error }) => {
    return html`
      <form>
        ${error && html`<p>Unable to save note: ${error.message}</p>`}
        <textarea name="note">${data?.note}</textarea>
        <button type="submit">Save Note</button>
      </form>
    `;
  })
  .post(async (c, { data }) => {
    const note = await insertNote(data);

    // Redirect to the new note
    return c.res.redirect(`/notes/${note.id}`);
  });
```

## Nested Fields

Sometimes you need to build more complex forms with specific data structures. Hyperspan supports nested form fields with a bracket syntax.

Field names with empty brackets or numbers will create an array:

```html
<input type="text" name="tags[]" />
<input type="text" name="tags[]" />
<input type="text" name="tags[]" />
```

Field names with text in brackets will created a nested object:

```html
<input type="text" name="event[name]" />
<input type="text" name="event[location]" />
<input type="text" name="event[description]" />
```

You can combine these to build any nested data structure you need to, like an array of objects:

```html
<input type="text" name="event[0][name]" />
<input type="text" name="event[0][location]" />
<input type="text" name="event[0][description]" />
```

A code example:

```typescript
import { createAction } from '@hyperspan/framework/actions';
import { z } from 'zod/v4';

// File: `src/actions/nested-data-exmple-action.ts
export default createAction({
  name: 'nested-data-example',
  schema: z.object({
    url: z.string(),
    headers: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    ),
  }),
})
  .form((c, { data, error }) => {
    return html`
      <form>
        ${error && html`<p>${error.message}</p>`}
        <input type="text" name="url" />
        <div class="flex">
          <input type="text" name="headers[0][key]" />
          <input type="text" name="headers[0][value]" />
        </div>
        <div class="flex">
          <input type="text" name="headers[1][key]" />
          <input type="text" name="headers[1][value]" />
        </div>
        <div class="flex">
          <input type="text" name="headers[2][key]" />
          <input type="text" name="headers[2][value]" />
        </div>
        <button type="submit">Save</button>
      </form>
    `;
  })
  .post(async (c, { data }) => {
    // 'data' will be object with a nested structure
    // {
    //   url: 'https://www.hyperspan.dev',
    //   headers: [
    //     { key: 'Foo', value: 'Bar'}
    //     { key: 'Bar', value: 'Baz'}
    //     { key: 'Test', value: 'Value'}
    //   ]
    // }
  });
```

## Forms With Dynamic Islands

If you need something more dynamic or complex, you can use [dynamic islands](/docs/clientjs/islands) inside actions and forms to enhance them with custom React/Preact components like dynamic auto-complete boxes, date or color pickers, code editors, etc.

The only caveat in doing this is that at the end of the day, **all data must be in form fields for the action to work properly**. A simple way to achieve this if your React component does not render any actual HTML form inputs is to render them as hidden inputs yourself with the current values via `onChange` hooks. This way, you can keep all the data you need to in React, and update the hidden named inputs when the data changes. The user can submit the action form normally, and the Hyperspan action will work as intended.
