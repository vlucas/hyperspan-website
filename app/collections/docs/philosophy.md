# Philosophy

**There is a gap in the JavaScript framework landscape**.

Older server-only frameworks like Express are fast and easy, but make client-side interactivity tedious and manual.

Modern frontend frameworks ship all your code and logic to the client by default, resulting in bloated bundle sizes and worse performance as your app grows over time. Opting out of this — if it is even possible — is often confusing, unintuitive and error prone.

There is room for a new approach. Hyperspan aims to strike a balance between these two extremes, offering both performant server-rendered streaming HTML and rich modern client-side interactivity.

## Server-Oriented.

The complexity of modern frontend frameworks has become overwhelming. We should have stopped when JavaScript bundle sizes started being measured in megabytes.

State belongs on the server. Most of the work and logic for your app or website should run on the server, _and should stay on the server_.

You should not have to duplicate logic on both client and server to have a good UX, and you should not have to create and expose API endpoints just to build a baseline functional UI.

Server rendered HTML is more secure, easier to cache, and more performant for both SEO and end users alike. It should be the default.

## JavaScript Sprinkles.

You don't need write your whole entire website in JavaScript to make interactive web sites or applications that feel great to use. You just need the ability to make specific pieces of the site interactive or dynamic on the client while leaving the rest of the page alone.

Hyperspan's approach ensures your initial page content is always rendered as fast as possible in an SEO-friendly way, and your interactive bits don't slow down user interactions or time to interactive metrics.

## Use The Platform.

Web browsers are _really good_ at rendering arbitrary strings of HTML and caching static assets across requests. Servers are _awesome_ at responding to URLs. It's okay to keep these two concerns separate. The client doesn't need to know about all your URLs and layouts. The browser can handle page navigations and caching. The web has worked like this _for decades_.

Stable and widely supported web standards and features like ES Modules, Template Literals, Generators, and Web Components are criminally under-used by frontend frameworks whose approach is to compile the world into a single file.

Client JavaScript in a browser runs on a single thread. The more work you put on the only execution thread you have, the slower your app will be. This isn't rocket science. JavaScript should not be used for rendering static HTML markup and CSS that can just be sent directly by the server (_and cached!_).

We need to stop using JavaScript for everything under the sun while end users pay the price. We can and should do better.

## Embrace Hypermedia.

The framework should make fetching and replacing new pieces of UI content easy. If new HTML content or partials come from the server, it can be diffed against the current DOM and applied without modeling the entire structure of the page in memory on the client.

Forms are the primary way browsers handle mutations in HTML documents. Forms should be embraced and enhanced by the framework instead of forcing the creation of custom API endpoints to handle state changes and updates on the client. Server responses should be able to return HTML partials in response, and the framework should make it easy to apply these updates to the DOM.

## Just TypeScript/JavaScript.

Modern JavaScript is a robust language that provides all the tools necessary to render HTML and stream in async content. The code and templates should be pure JavaScript or TypeScript — Not special framework-flavored JavaScript or a new custom template syntax you have to learn.

There should be no difference in how a template or component is rendered in one context vs. another — it should always work the same. If it fetches data, it can be an async funtion with await. If it doesn't, it's not. There are no new semantics or edge cases to learn. It should not matter if a component runs on the client or the server, or fetches data or streams in or just renders static markup. The behavior and core conceptual semantics should be the same everywhere, because it's all just JavaScript.

## Hyperspan vs. React Frameworks

Hyperspan can be best thought of as an _alternative_ to React-based frameworks like Next.js and Remix. Hyperspan has all the same types of things, like file-based page routes, API routes, _true_ middleware, etc. but Hyperspan has a very different runtime and execution model. React-based frameworks ship all React components and code to the client by default, resulting in surprisingly large JS bundle sizes that grow more over time as your site does. Hyperspan takes the opposite approach, and does not ship ANY components or templates to the client by default.

You can still use React/Preact client components with Hyperspan, but these are explicitly opt-in and are mounted as independent dynamic islands in a sea of otherwise static content that is not "hydrated".

React frameworks are all JavaScript, all the time, delivered to the client. Hyperspan is mostly static content and markup delivered to the client, with JavaScript sprinkles only where needed.
