# Streaming in Hyperspan

Support for streaming responses is built-in by default in Hyperspan, and is most often used with [Hyperspan HTML Templates](/docs/html). Template responses return a normal HTML Response with static content, and switch to a streaming response anytime there is an unresolved `Promise` as a value in the template.

Streaming is also enabled when a Route returns a `Generator` or an `AsyncGenerator` as a response.

## Streaming Examples

Imagine you have an async function that fetches and lists blog posts as a template partial that you can import and embed in other templates:

```typescript
export async function NewBlogPostsList() {
  const posts = await fetchNewestBlogPosts();

  return html`
    <ul>
      ${posts.map((post) => html`<li><a href="/posts/${post.id}">${post.title}</a></li>`)}
    </ul>
  `;
}
```

### This Route Will Stream:

```typescript
import { createRoute } from '@hyperspan/framework';

export default createRoute().get((c) => {
  return html`
    <main>
      <h1>Blog Posts</h1>

      ${NewBlogPostsList()}
    </main>
  `;
});
```

Since we called an `async` function in a template, it will return a `Promise`. Hyperspan will see that there is an unresolved `Promise` as a template value, and will switch to streaming the response. The full outer template will be sent to the user first, and the `NewBlogPostsList` content will pop into place once the `Promise` is resolved.

### This Will NOT Stream:

```typescript
import { createRoute } from '@hyperspan/framework';

export default createRoute().get(async (c) => {
  return html`
    <main>
      <h1>Blog Posts</h1>

      ${await NewBlogPostsList()}
    </main>
  `;
});
```

Since we used `await` to ensure the template value is not a `Promise`, this whole route will wait to fetch the blog posts, then return the whole content as static HTML. No content will be sent to the user until the `Promise` is resolved.

See the [Streaming Examples](/examples/streaming) page to see a practical example on streaming with HTML templates in action.

## Tradeoffs

There are some tradeoffs to know about related to streaming responses.

### Benefits of Streaming

With streaming enabled, some pages can feel much faster. Users see content immediately, and content placeholders can be used for the content that takes longer to load without holding up the entire response. Streaming can be a relatively easy way to make slow pages feel faster.

With streaming disabled, pages and routes with lots of data fetching can take a long time to load, and can lead the user to feel like the page is unresponsive since nothing is sent in the response until all data and content is available.

### Downsides of Streaming

Sometimes streaming can complicate the way you fetch data, and may not always be possible to do if your data is fetched in a particular order, or if the slowest part of your data fetching is a dependency for other subsequent data fetching.

### Fast Response Times Are Critical

As a general rule, you always want to send a response to the user as fast as possible. For an ideal response time, you should target `100-300ms` (milliseconds). One second (`1000ms`) is wideley considered a hard upper bound. Google uses an upper limit of `800ms` internally.

## You Have Full Control Over Streaming

Streaming is not a binary option with Hyperspan. Streaming is route and content specific. With Hyperspan, you have full control over:

1. Whether or not your route streams at all
1. When streaming starts in your route

It is never all or nothing, and the semantics are simple because they are just JavaScript.

- If you want to stream _immediately_, just return a template right away with `Promise` values and Hyperspan automatically switches to streaming.
- If don't want to stream, just `await` those values and Hyperspan will return a normal HTML response from your route.
- If you want to stream, but only after some data is loaded, `await` that data before you return the template, and then pass that data into other functions that return a `Promise` to stream the rest.

Simple, straightforward, and with full control. You don't get that in even the most popular JavaScript frameworks.
