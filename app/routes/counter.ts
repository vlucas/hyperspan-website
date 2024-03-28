import { clientComponent, html, HSTemplate } from '@hyperspan/html';

const ButtonCounter = clientComponent((startingCount: number = 0) => {
  let count = startingCount;

  return html`<button onClick="${() => ++count}">Increment</button> |
    <span>Current count is: ${count}</span>`;
});

export default async function App(): Promise<HSTemplate> {
  return html`
    <html>
      <p>Hello world!</p>
      <div>${ButtonCounter(1)}</div>
    </html>
  `;
}
