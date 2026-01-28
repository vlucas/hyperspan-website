import { createAction } from "@hyperspan/framework/actions";
import { html } from "@hyperspan/html";
import { z } from "zod/v4";

export default createAction({
  name: 'example-action',
  schema: z.object({
    name: z.string()
      .min(3, 'Name must be at least 3 characters long')
      .regex(/^[a-zA-Z]+$/, 'Name must contain only letters'),
  }),
})
  .form((c, { data, error }) => {
    const errorMessage = error ? (error?.fieldErrors ? error?.fieldErrors?.name?.[0] : error.message) : '';
    const errorHTML = error ? html`<div class="alert alert-error mb-2">${errorMessage}</div>` : '';
    return html`
      <p>Please enter your name below:</p>
      <ul>
        <li>Name must be at least 3 characters long</li>
        <li>Name must contain only letters (no numbers or special characters)</li>
      </ul>
      <form method="post">
        ${errorHTML}
        <input class="input input-bordered max-w-sm" type="text" name="name" value="${data?.name}" />
        <button class="btn btn-primary" type="submit">Submit</button>
      </form>
    `;
  })
  .post(async (c, { data }) => {
    return c.res.html(`
      <div class="alert alert-success"><p>Hello, ${data?.name}!</p></div>
    `);
  });