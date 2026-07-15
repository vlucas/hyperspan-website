# Hyperspan Actions

Actions are a built-in way to render forms that submit their data back to the server and update the view with the result in-place automatically.

Actions allow you to:

- Keep all of the logic on the server (rendering, error handling, form validation and data processing, etc.)
- Not be forced to build an API for simple interactions
- Import and render a form anywhere you need to inside a template
- Use middleware for things like security and auth, just like a normal route
- Use _very little JavaScript_ on the client. Hyperspan uses [Idiomorph](https://github.com/bigskysoftware/idiomorph) from the creator of [HTMX](https://htmx.org) to apply HTML diffs from the server, and this library only loads in when you are using actions.
- Use [dynamic islands](/docs/clientjs/islands) inside forms if you need to build more complex interactions or UI components

## Using Actions

Actions are treated similar to routes, but can be embedded in other templates and routes, and have a few unique differences.

All actions have the following requirements:

- They should be placed in the `app/actions` directory.
- They should be given a unique `name`.
- They should render an HTML template with a `<form>` tag.
- They should maintain all state in form fields (Actions use a traditional form POST operation and extract data from a `FormData` object.)

NOTE: If you use a frontend framework like React to build more complex forms, just make sure you still set data into hidden form fields so actions can still work as intended.

## Example Action Usage

First, create your action in `app/actions`:

```typescript
import { createAction } from '@hyperspan/framework/actions';
import { z } from 'zod';

// File: `app/actions/exmple-action.ts
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
import ExampleAction from '~/app/actions/example-action';

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

Actions can provide an optional [Zod](https://zod.dev) schema object in the `schema` property of `createAction`. Providing one is highly recommended.

```typescript
createAction({ name: 'example-action', schema: zodSchema });
```

When a schema is provided, the `data` object will be type-safe in forms and handlers, and validation of `data` against the `schema` will happen automatically on form submit.

## Confirm Before Submit

A common pattern is to use a confirm prompt before the form submission, especially for smaller actions that might be a single button like deleting, revoking, or archiving records.

To show the user a confirm prompt before the form submission, just add a `data-confirm` attribute to your form tag, like this:

```
<form data-confrim="Are you sure you want to delete this post?">
```

A full example:

```typescript
import { createAction } from '@hyperspan/framework/actions';
import { findPostByIdAndUser } from '~/src/db/queries/posts';

// File: `app/actions/exmple-delete-post-action.ts
export default createAction({
  name: 'example-delete-post-action',
})
  .form((c, { data, error }) => {
    return html`
      <form method="post" data-confirm="Delete this post? Action cannot be undone!">
        ${error && html`<div class="alert alert-error">${error.message}</div>`}
        <input type="hidden" name="id" value="${data?.id}" />
        <button class="btn btn-danger" type="submit">Delete</button>
      </form>
    `;
  })
  .post(async (c, { data }) => {
    // Always check current user vs. the data in question
    const post = await findPostByIdAndUser(data.id, c.vars.currentUser?.id);

    if (!post) {
      // Any thrown error will be re-displayed in the form above
      throw new Error('Only the author of a post can delete it');
    }

    await deletePostById(data.id);
    return c.res.redirect('/admin/posts');
  })
  // User must be authenticated admin to use this action (same middleware as routes)
  .use(adminMiddleware());
```

When you render the action, pass in the post id:

```typescript
return html`
  <table class="table">
    <tr>
      <th>Post</th>
      <th>Edit</th>
      <th>Delete</th>
    </tr>
    ${posts.map(
      (post) => html`
        <tr>
          <td>${post.title}</td>
          <td><a href="/admin/posts/${post.id}">Edit</a></td>
          <td>${deletePostAction.render(c, { data: { id: post.id } })}</td>
        </tr>
      `
    )}
  </table>
`;
```

## Error Handling

When a schema is provided, Hyperspan will automatically validate the input `FormData` against the provided Zod schema.

If the input data does not pass schema validation, Hyperspan will re-render the form with a `ZodValidationError` passed into the `form` method. You can see if it exists, and use it to display errors if so:

```typescript
import { createAction } from '@hyperspan/framework/actions';
import { z } from 'zod';

// File: `app/actions/exmple-action.ts
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
    return html`<p>Hello, ${data.name}!</p>`;
  });
```

The `ZodValidationError` class uses [zod.prettifyError()](https://zod.dev/error-formatting?id=zprettifyerror) to format
all errors into a nice string message (accessible with `e.message`). It also has all the fields in
[zod.flatterError()](https://zod.dev/error-formatting?id=zflattenerror) available on it so that you can show error
messages specific to certain fields more easily (accessible with `e.fieldErrors.<fieldName>`, i.e. `e.fieldErrors.name`
in this example).

If your `post` handler throws an error, the error will be caught and the `form` will be re-displayed with that error set
in the `error` property. You can display it or handle it however you want, similar to the code above.

## Responding With a Redirect

Sometimes all you want to do with an action is insert a new record, then redirect to it. If your `post` handler returns
a redirect (a `Response` object with a `Location` header), Hyperspan will pick this up on the client and redirect the
user to that URL. This is the age old [POST/Redirect/GET](https://en.wikipedia.org/wiki/Post/Redirect/Get) pattern.

```typescript
import { createAction } from '@hyperspan/framework/actions';
import { z } from 'zod';

// File: `app/actions/notes/create-note-action.ts
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

### Soft vs Hard Navigation

By default, Hyperspan chooses how to apply a redirect on the client:

- **Soft navigation** — same-origin or same path branch as the current page: fetch the new HTML and morph it in place with Idiomorph (no full page reload).
- **Hard navigation** — different path branch or cross-origin: a normal `window.location` redirect.

You can override this (and hook other client behavior) with action lifecycle events.

## Client Events

Actions dispatch DOM events from the `<hs-action>` element. They bubble and are composed, so you can listen on
`document`. Each event exposes a mutable `detail` object (standard `CustomEvent`). Every detail includes `action` — the
current `<hs-action>` `HTMLElement` — so you can append nodes, toggle classes, or change styles:

```javascript
document.addEventListener('hs:action:before-fetch', (e) => {
  e.detail.action?.classList.add('is-loading');
  e.detail.action?.append(document.createElement('my-spinner'));
});

document.addEventListener('hs:action:after-fetch', (e) => {
  e.detail.action?.classList.remove('is-loading');
  e.detail.action?.querySelector('my-spinner')?.remove();
});
```

| Event                       | When                                          | Cancelable              |
| --------------------------- | --------------------------------------------- | ----------------------- |
| `hs:action:before-fetch`    | Before the action request starts              | Yes — skips the request |
| `hs:action:after-fetch`     | After the request finishes (success or error) | No                      |
| `hs:action:before-swap`     | Before HTML is morphed into the page          | Yes — skips the morph   |
| `hs:action:after-swap`      | After the morph completes                     | No                      |
| `hs:action:before-navigate` | Before a redirect is applied                  | Yes — skips navigation  |

Call `e.preventDefault()` on a cancelable event to abort that step.

### Loading State (`<hs-action-loading>`)

While a request is in flight, Hyperspan appends an `<hs-action-loading>` element inside the `<hs-action>` and removes it
when the request ends (`hs:action:after-fetch`). It uses `display: contents` by default (no box, no layout impact). Use
it as a CSS hook for custom loading UI:

```css
/* Dim the form while submitting */
hs-action:has(hs-action-loading) {
  opacity: 0.6;
  pointer-events: none;
}

/* Or show your own spinner */
hs-action-loading {
  display: block;
  content: 'Loading...';
  /* …spinner styles… */
}
```

To skip inserting `<hs-action-loading>`, set `detail.loadingElement = false` on `hs:action:before-fetch`:

```javascript
document.addEventListener('hs:action:before-fetch', (e) => {
  e.detail.loadingElement = false;
});
```

### Custom Loading Logic

Listen for fetch events to disable controls, show overlays, etc.:

```javascript
document.addEventListener('hs:action:before-fetch', (e) => {
  e.detail.form.querySelectorAll('button').forEach((btn) => {
    btn.disabled = true;
  });
  document.getElementById('app-overlay')?.classList.add('is-visible');
});

document.addEventListener('hs:action:after-fetch', () => {
  document.getElementById('app-overlay')?.classList.remove('is-visible');
});
```

### Closing UI Before Content Updates

Use `hs:action:before-swap` (and/or `hs:action:before-navigate`) to tear down UI that should not survive a content
replace — for example open modals or drawers:

```javascript
document.addEventListener('hs:action:before-swap', () => {
  document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
});

document.addEventListener('hs:action:before-navigate', () => {
  document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
});
```

### Controlling Soft vs Hard Reloads

`hs:action:before-navigate` receives a mutable `detail.hardNavigate` flag:

- `false` — soft: fetch the URL and morph the HTML in place
- `true` — hard: full page navigation via `window.location.assign`

Defaults match the soft/hard rules above. Set `detail.hardNavigate` to override:

```javascript
// Always do a full page reload on action redirects
document.addEventListener('hs:action:before-navigate', (e) => {
  e.detail.hardNavigate = true;
});

// Prefer soft morph even when the path changes (same-origin only)
document.addEventListener('hs:action:before-navigate', (e) => {
  e.detail.hardNavigate = false;
});
```

Cross-origin URLs always use a hard navigation, even if you set `hardNavigate` to `false`.

### Event Detail Shape

**Fetch events** (`before-fetch` / `after-fetch`):

```typescript
{
  form: HTMLFormElement;
  action: HTMLElement | null; // the current <hs-action> element
  url: string;
  method: string;
  loadingElement: boolean; // mutable on before-fetch; default true
}
```

**Swap events** (`before-swap` / `after-swap`):

```typescript
{
  form: HTMLFormElement;
  action: HTMLElement | null; // the current <hs-action> element
  html: string;
  fullDocument: boolean;
}
```

**Navigate event** (`before-navigate`):

```typescript
{
  form: HTMLFormElement;
  action: HTMLElement | null; // the current <hs-action> element
  url: string;
  hardNavigate: boolean; // mutable
}
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
import { z } from 'zod';

// File: `app/actions/nested-data-exmple-action.ts
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
