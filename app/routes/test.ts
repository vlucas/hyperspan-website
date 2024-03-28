import { html } from '@hyperspan/html';

export default function TestPage(req: Request) {
  return html`<p>Some server component here: <code>${req.url}</code>!</p>`;
}
