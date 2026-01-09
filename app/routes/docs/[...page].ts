import { html } from "@hyperspan/html";
import { createDocsRoute } from "@/src/routes/create-docs-route";
import DocsLayout from "@/app/layouts/docs-layout";
import { marked } from "marked";
import { highlightTS, highlightShell } from "@/src/lib/syntax-highlighter";
import { renderPreactIsland } from "@hyperspan/plugin-preact";
import ClientCounter from "@/app/components/client-counter.tsx";

export default createDocsRoute().get(async (c) => {
  console.log('c.route =', c.route);
  const page = c.route.params?.page || 'index';

  // Convert URL path to file path
  // e.g., "routes/pages" -> "routes/pages.md"
  // e.g., "clientjs/islands" -> "clientjs/islands.md"
  const filePath = `app/collections/docs/${page}.md`;

  try {
    const file = Bun.file(filePath);
    const markdown = await file.text();

    if (!markdown) {
      return c.res.notFound();
    }

    // Process markdown with custom renderer for code blocks
    const renderer = new marked.Renderer();

    // Override code block rendering to use syntax highlighter
    renderer.code = (code: string, language: string | undefined) => {
      if (language === "typescript" || language === "ts") {
        return highlightTS(code).toString();
      } else if (language === "shell" || language === "bash" || language === "sh") {
        return highlightShell(code).toString();
      } else {
        // Default code block
        return `<pre><code class="language-${language || ""}">${code}</code></pre>`;
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
            return renderPreactIsland(ClientCounter, props, options).toString();
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