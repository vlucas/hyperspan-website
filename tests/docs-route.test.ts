import { describe, expect, it } from "bun:test";
import docsRoute from "~/app/routes/docs/[...page].ts";

describe("docs route", () => {
  it("returns markdown for known AI bots", async () => {
    const response = await docsRoute.fetch(
      new Request("http://localhost/docs/install", {
        headers: {
          "user-agent": "GPTBot/1.0",
        },
      })
    );

    const contentType = response.headers.get("content-type") ?? "";
    const body = await response.text();
    const markdown = await Bun.file("app/collections/docs/install.md").text();

    expect(response.status).toBe(200);
    expect(contentType).toContain("text/markdown");
    expect(body).toBe(markdown);
  });
});
