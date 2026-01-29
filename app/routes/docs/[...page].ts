import { html, render } from "@hyperspan/html";
import { createDocsRoute } from "@/src/routes/create-docs-route";
import DocsLayout from "@/app/layouts/docs-layout";
import { marked } from "marked";
import { highlightTS, highlightShell } from "@/src/lib/syntax-highlighter";
import { renderPreactIsland } from "@hyperspan/plugin-preact";
import ClientCounter from "@/app/components/client-counter.tsx";

export default createDocsRoute().get(async (c) => {
  let page = c.req.url.pathname.replace('/docs/', '') || 'index';

  if (page.endsWith('/')) {
    return c.res.redirect(`/docs/${page.slice(0, -1)}`);
  }

  // Convert URL path to file path
  // e.g., "routes/pages" -> "routes/pages.md"
  // e.g., "clientjs/islands" -> "clientjs/islands.md"
  try {
    let file = Bun.file(`app/collections/docs/${page}.md`);
    const fileExists = await file.exists();

    if (!fileExists) {
      file = Bun.file(`app/collections/docs/${page}/index.md`);
    }

    const markdown = await file.text();

    if (!markdown) {
      return c.res.notFound();
    }

    // Process markdown with custom renderer for code blocks
    const renderer = new marked.Renderer();

    // Override code block rendering to use syntax highlighter
    renderer.code = (code) => {
      const language = code.lang;
      if (language === "typescript" || language === "ts") {
        return render(highlightTS(code.text));
      } else if (language === "shell" || language === "bash" || language === "sh") {
        return render(highlightShell(code.text));
      } else {
        // Default code block
        return `<pre><code class="language-${language || ""}">${code.text}</code></pre>`;
      }
    };

    // Configure marked options
    marked.setOptions({
      renderer,
      breaks: true,
      gfm: true,
    });

    // Parse markdown to HTML
    const htmlContent = await marked.parse(markdown);

    // Process special island comments
    // Replace <!-- ISLAND: ComponentName { props } { options } --> with actual island
    const processedContent = htmlContent.replace(
      /<!--\s*ISLAND:\s*(\w+)\s*({[^}]*})?\s*({[^}]*})?\s*-->/g,
      (match: string, componentName: string, propsStr?: string, optionsStr?: string) => {
        try {
          const props = propsStr ? eval(`(${propsStr})`) : {};
          const options = optionsStr ? eval(`(${optionsStr})`) : {};

          if (componentName === "ClientCounter") {
            return renderPreactIsland(ClientCounter, props, options)
          }
          return match; // Return original if component not found
        } catch (e) {
          console.error("Error processing island:", e);
          return match;
        }
      }
    );

    // Extract title from first h1
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : "Documentation";

    const content = html`
      <main class="prose">
        ${html.raw(processedContent)}
      </main>
    `;

    return DocsLayout(c, {
      title,
      content,
    });
  } catch (error) {
    console.error("Error loading markdown file:", error);
    return c.res.notFound();
  }
});