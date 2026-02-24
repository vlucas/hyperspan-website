import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import ContentLayout from '~/app/layouts/content-layout';
import ExampleAction from '~/app/actions/example-action';
import { highlightTS } from '~/src/lib/syntax-highlighter';

export default createRoute().get((c) => {
  const content = html`
    <main class="prose pl-6">
      <h1>Actions Example</h1>
      <p>
        Actions in Hyperspan are progressively enhanced <code>&lt;form&gt;</code> elements that can
        be used to perform data mutations.
      </p>
      <p>
        Hyperspan Actions feature data validation with <a href="https://zod.dev">Zod v4.x</a> and
        can automatically update the UI with pending states, errors, and server-rendered responses
        in place. Hyperspan Actions <strong>require very little JavaScript to work</strong>, and can
        be used in any template or route. Read more about Actions in the
        <a href="/docs/actions">Actions Docs</a>.
      </p>

      <h2>Example Action:</h2>
      ${ExampleAction.render(c)}

      <h2>Example Action Code:</h2>
      <p>
        You can create an action by using the <code>createAction</code> function from the
        <code>@hyperspan/framework/actions</code> package, similar to how you would create a route.
      </p>
      ${highlightTS(`import { createAction } from "@hyperspan/framework/actions";
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
    const errorHTML = error ? html\`< div class= "alert alert-error mb-2" > \${ errorMessage } </div>\` : '';
  return html\`
      <p>Please enter your name below:</p>
      <ul>
        <li>Name must be at least 3 characters long</li>
        <li>Name must contain only letters (no numbers or special characters)</li>
      </ul>
      <form method="post">
        \${errorHTML}
        <input class="input input-bordered max-w-sm" type="text" name="name" value="\${data?.name}" />
        <button class="btn btn-primary" type="submit">Submit</button>
      </form>
    \`;
})
  .post(async (c, { data }) => {
    return html(\`
      <div class="alert alert-success"><p>Hello, \${data?.name}!</p></div>
    \`;
  }); `)}

      <h2>Example Action Usage:</h2>
      <p>To use the action in a route, you can simply import it and render it in your template:</p>
      ${highlightTS(`import { createRoute } from '@hyperspan/framework';
import ExampleAction from '~/app/actions/example-action';

export default createRoute().get((c) => {
  return html\`
    <h1>Identify Yourself</h1>

    \${ExampleAction.render(c)}
  \`;
});`)}
    </main>
  `;

  return ContentLayout(c, {
    title: 'Actions Example',
    content,
  });
});
