# Hyperspan. Simple. Server. Streaming.

> [!NOTE] > **Hyperspan is still in the early stages of development, your feedback is appreciated.**

Hyperspan is a server-oriented framework built with [Bun](https://bun.sh) that is focused on simplicity and ease of use.

No JSX. No Virtual DOM. No hydration time. No nonsense. Just blazing fast HTML strings with full streaming support.

## Who Is Hyperspan For?

Hyperspan is best for websites, web applications, and APIs that need fast streaming and dynamic server responses. It is
great for performance critical applications and delivers no client-side JavaScript by default. This helps to ensure your
website stays fast and lightweight for end users as it grows over time, since all client JavaScript is explicitly
opt-in.

## Why Bun?

[Bun](https://bun.sh) is a Node-compatible runtime that offers better performance and built-in TypeScript support so
transpiling is not required for writing type-safe server-side code. Bun also offers some other extras like built-in
ultra fast testing utilities so extra dependencies are not required to write high-quality code.

## Hyperspan vs. React Frameworks

Hyperspan can be best thought of as an _alternative_ to React-based frameworks like Next.js. Hyperspan has all the same
types of things, like file-based page routes, API routes, _true_ middleware, etc. but Hyperspan has a very different
runtime and execution model. React-based frameworks ship all React components and code to the client by default,
resulting in surprisingly large JS bundle sizes that grow more over time as your site does. Hyperspan takes the
opposite approach, and does not ship ANY components to the client by default.

You can still use React/Preact client components with Hyperspan, but these are explicitly opt-in and are mounted as
independent dynamic islands in a sea of otherwise static content that is not &quot;hydrated&quot;.

React frameworks are all JavaScript, all the time, delivered to the client. Hyperspan is mostly static content and
markup delivered to the client, with JavaScript sprinkles where needed.

## Philosophy

### P1: Server-Side First.

Current JavaScript frameworks ship everything to the browser by default and use non-intuitive ways to opt-out of this.
The first clue that this approach was backwards was when JavaScript bundle sizes started being measured in hundreds of
kilobytes to megabytes.

Keeping bundle sizes down in large projects over time can be challenging. A performant framework should render as much
as possible on the server by default. Sending JavaScript code to the client and increasing bundle sizes for all your
users should be explicit and opt-in.

Modern frameworks make it too easy to _accidentally_ ship code to the client that you don't want. They often mix client
and server concerns in a way that is hard to understand and keep separate. They return cryptic and confusing errors when
you make mistakes around client and server boundaries.

We've lost the forrest from the trees. The complixity has become too much, and users are paying the price.

This is the way back for a full-stack framework:

- Server fetching and rendering by default.
- Minimal client-side JavaScript by default. Code that ships to the client should be explicit and opt-in.
- Most of the work and state should be maintained on the server. The framework should help make this easy.

### P2: Performance Oriented.

Server-side code is fast because it sends HTML strings to the client and lets the browser do its job - the job that is
was built specifically to do. There is no sense in typing up the JavaScript thread for rendering static HTML markup that
can just be sent directly.

You don't need a Virtual DOM or expensive reconciliation diff calculations to make interactive web sites or
applications. You just need the ability to make specific pieces of the site interactive on the client while leaving the
rest of it alone.

### P3: Just JavaScript.

Rendering should work the same in every context. There should be no difference in how a template or component is
rendered in one context vs. another. It should not matter if a component runs on the client or the server, or fetches
data or streams in. The behavior and core conceptual semantics should be the same everywhere, because it's all just
JavaScript.

JavaScript is a robust language that provides all the tools necessary to render HTML and stream in async content. The
code should be just JavaScript &mdash; Not special framework-flavored JavaScript or a custom template syntax you have to
learn or compile.
