import { describe, expect, it } from "bun:test";
import blogIndexRoute from "~/app/routes/blog/index.ts";
import blogPostRoute from "~/app/routes/blog/[...page].ts";

describe("blog post route", () => {
  it("returns markdown for known AI bots", async () => {
    const response = await blogPostRoute.fetch(
      new Request("http://localhost/blog/introducing-hyperspan", {
        headers: {
          "user-agent": "GPTBot/1.0",
        },
      })
    );

    const contentType = response.headers.get("content-type") ?? "";
    const body = await response.text();
    const markdown = await Bun.file("app/collections/blog/introducing-hyperspan.md").text();

    expect(response.status).toBe(200);
    expect(contentType).toContain("text/markdown");
    expect(body).toBe(markdown);
  });
});

describe("blog index route", () => {
  it("returns markdown index for known AI bots", async () => {
    const response = await blogIndexRoute.fetch(
      new Request("http://localhost/blog", {
        headers: {
          "user-agent": "GPTBot/1.0",
        },
      })
    );

    const contentType = response.headers.get("content-type") ?? "";
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(contentType).toContain("text/markdown");
    expect(body).toContain("# Hyperspan Blog");
    expect(body).toContain("/blog/introducing-hyperspan");
    expect(body).toContain("2026-04-06");
  });
});
