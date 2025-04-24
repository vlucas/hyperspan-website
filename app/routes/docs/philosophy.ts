import { html } from '@hyperspan/html';
import { createRoute } from '@hyperspan/framework';
import DocsLayout from '@/app/layouts/DocsLayout';

export default createRoute(() => {
  const content = html`
    <main class="prose">
      <h1>Philosophy</h1>

      <p><strong>There is a gap in the JavaScript framework landscape</strong>.</p>
      <p>
        Older server-only frameworks like Express are fast and easy, but make client-side
        interactivity tedious and manual.
      </p>
      <p>
        Modern frontend frameworks ship all your code and logic to the client by default, resulting
        in bloated bundle sizes and worse performance as your app grows over time. Opting out of
        this &mdash; if it is even possible &mdash; is often confusing, unintuitive and error prone.
      </p>
      <p>
        There is room for a new approach. Hyperspan aims to strike a balance between these two
        extremes, offering both performant server-rendered streaming HTML and rich modern
        client-side interactivity.
      </p>

      <h2>Server-Oriented.</h2>
      <p>
        The complexity of modern frontend frameworks has become overwhelming. We should have stopped
        when JavaScript bundle sizes started being measured in megabytes.
      </p>
      <p>
        State belongs on the server. Most of the work and logic for your app or website should run
        on the server, <em>and should stay on the server</em>.
      </p>
      <p>
        Server rendered HTML is more secure, easier to cache, and more performant for both SEO and
        end users alike. It should be the default.
      </p>

      <h2>JavaScript Sprinkles.</h2>
      <p>
        You don't need write your whole entire website in JavaScript to make interactive web sites
        or applications that feel great to use. You just need the ability to make specific pieces of
        the site interactive or dynamic on the client while leaving the rest of the page alone.
      </p>
      <p>
        Hyperspan's approach ensures your initial page content is always rendered as fast as
        possible in an SEO-friendly way, and your interactive bits don't interfere with user
        interactions or time to interactive metrics.
      </p>

      <h2>Use The Platform.</h2>
      <p>
        Web browsers are <em>really, really good</em> at rendering arbitrary strings of HTML.
        <em>That is the job that browsers were built specifically to do</em>. Servers are
        <em>great</em>
        at responding to URLs with HTML. It's okay to keep these two concerns separate. The client
        doesn't need to know about all your URLs and layouts. The bundler doesn't need to be
        concerned with accidentally shipping server code to the client.
        <em>Some of these things are best kept separate.</em>
      </p>
      <p>
        Client JavaScript in a browser runs on a single JavaScript thread. There is no sense in
        putting more work on the JavaScript thread for rendering static HTML markup and CSS that can
        just be sent directly by the server (<em>and cached!</em>).
      </p>

      <h2>Embrace Hypermedia.</h2>
      <p>
        The framework should make fetching and replacing new pieces of UI content easy. If new HTML
        content or partials come from the server, it can be diffed against the current DOM and
        applied without modeling the entire structure of the page in memory.
      </p>
      <p>
        Forms are the primary way browsers handle mutations in HTML documents. Forms should be
        embraced and enhanced by the framework instead of forcing the creation of custom API
        endpoints to handle state changes and updates on the client. Server responses should be able
        to return HTML partials in response, and the framework should make it easy to apply these
        updates to the DOM.
      </p>

      <h2>Just TypeScript/JavaScript.</h2>
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
