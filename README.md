# Hyperspan. The Simple JS Framework.

No JSX. No Virtual DOM. No hydration time. No nonsense. Just blazing fast HTML strings with reactive templates.

Hyperspan is a full-stack framework built with [Bun](https://bun.sh) that is focused on simplicity and perforamnce.

## Philosophy

### P1: Server-Side First.

Current JavaScript frameworks ship everything to the browser by default and use non-intuitive ways to opt-out of this.
The first clue that this approach was backwards was when website bundle sizes started being measured in Megabytes.

Keeping bundle sizes down in large projects over time can be challenging. A full stack framework should render as much
as possible on the server by default for better performance. Sending JavaScript code to the client and increasing bundle
sizes for all your users should be explicit and opt-in.

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
was built specifically to do. There is no sense in typing up the JavaScript thread for rendering.

You don't need a Virtual DOM or expensive reconciliation diff calculations to make interactive web sites or
applications. You just need a more intelligent template that knows the pieces that update.

HTML strings are the fastest and easiest way to update the parts of the DOM that change. We have known this since the
Web 1.0 days of AJAX and template partials. Modern JavaScript built-ins like Tagged Template Literals are an obvious
choice to do do the same thing today, and are built into the language.

### P3: Works the Same In Every Context.

All templates and components should be rendered asynchronously to allow you to do any other kind of asynchronous work in
them that you need to, in any context that you do it in. It's just JavaScript. Not special framework-flavored
JavaScript.

There should be no difference in how a template or component is rendered in one context vs. another. It should not
matter if a component runs on the client or the server, or fetches data or streams in. The core conceptual semantics
should be the same everywhere.
