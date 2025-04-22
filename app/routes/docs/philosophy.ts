import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/DocsLayout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Philosophy</h1>

      <h2>P1: Server-Side First.</h2>
      <p>
        Current JavaScript frameworks ship everything to the browser by default and use
        non-intuitive ways to opt-out of this. The first clue that this approach was backwards was
        when JavaScript bundle sizes started being measured in hundreds of kilobytes to megabytes.
      </p>
      <p>
        Keeping bundle sizes down in large projects over time can be challenging. A performant
        framework should render as much as possible on the server by default.
        <strong
          >Sending JavaScript code to the client and increasing bundle sizes for all your users
          should be explicit and opt-in.</strong
        >
      </p>
      <p>
        Modern frameworks make it too easy to <em>accidentally</em> ship code to the client that you
        don't want. They often mix client and server concerns in a way that is hard to understand
        and keep separate. They return cryptic and confusing errors when you make mistakes around
        client and server boundaries.
      </p>
      <p>
        We've lost the forest from the trees. The complixity has become too much, and end users are
        paying the price.
      </p>
      <p>This is the way back for a full-stack framework:</p>
      <ul>
        <li>Server fetching and rendering by default.</li>
        <li>
          Minimal client-side JavaScript by default. Code that ships to the client should be
          explicit and opt-in.
        </li>
        <li>
          Most of the work and state should be maintained on the server. The framework should help
          make this easy.
        </li>
      </ul>
      <h2>P2: Performance Oriented.</h2>

      <p>
        Server-side code is fast because it sends HTML strings to the client and lets the browser do
        its job - the job that is was built specifically to do. There is no sense in tying up the
        JavaScript thread for rendering static HTML markup that can just be sent directly.
      </p>
      <p>
        You don't need a Virtual DOM or expensive reconciliation diff calculations to make
        interactive web sites or applications. You just need the ability to make specific pieces of
        the site interactive on the client while leaving the rest of the page alone. If new HTML
        content or partials come from the server, they can be diffed against the current DOM to only
        apply the changes without modeling the entire structure of the page in memory.
      </p>

      <h2>P3: Just TypeScript/JavaScript.</h2>
      <p>
        Modern JavaScript is a robust language that provides all the tools necessary to render HTML
        and stream in async content. The code and templates should be pure JavaScript or TypeScript
        — Not special framework-flavored JavaScript or a new custom template syntax you have to
        learn.
      </p>
      <p>
        There should be no difference in how a template or component is rendered in one context vs.
        another — it should always work the same. If it fetches data, it can be an async funtion
        with await. If it doesn't, it's not. There are no new semantics or edge cases to learn. It
        should not matter if a component runs on the client or the server, or fetches data or
        streams in or just renders static markup. The behavior and core conceptual semantics should
        be the same everywhere, because it's all just JavaScript.
      </p>

      <h2>Hyperspan vs. React Frameworks</h2>
      <p>
        Hyperspan can be best thought of as an <em>alternative</em> to React-based frameworks like
        Next.js and Remix. Hyperspan has all the same types of things, like file-based page routes,
        API routes, <em>true</em> middleware, etc. but Hyperspan has a very different runtime and
        execution model. React-based frameworks ship all React components and code to the client by
        default, resulting in surprisingly large JS bundle sizes that grow more over time as your
        site does. Hyperspan takes the opposite approach, and does not ship ANY components or
        templates to the client by default.
      </p>
      <p>
        You can still use React/Preact client components with Hyperspan, but these are explicitly
        opt-in and are mounted as independent dynamic islands in a sea of otherwise static content
        that is not "hydrated".
      </p>
      <p>
        React frameworks are all JavaScript, all the time, delivered to the client. Hyperspan is
        mostly static content and markup delivered to the client, with JavaScript sprinkles only
        where needed.
      </p>
    </main>
  `;

  return DocsLayout({
    title: 'Philosophy',
    content,
  });
});
