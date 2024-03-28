import { html, HSTemplate } from '@hyperspan/html';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function SlowLoadingThing1() {
  await sleep(2000);

  return html`<div class="bg-sky-100 my-2 p-4 border border-gray-700">Slow loading content 1</div>`;
}

async function SlowLoadingThing2() {
  await sleep(350);

  return html`<div class="bg-sky-100 my-2 p-4 border border-gray-700">Slow loading content 2</div>`;
}

async function SlowLoadingThing3() {
  await sleep(600);

  return html`<div class="bg-sky-100 my-2 p-4 border border-gray-700">Slow loading content 3</div>`;
}

export default async function IndexPage(req: Request): Promise<HSTemplate> {
  await sleep(150);

  return html`
    <main>
      <p>Hello world!</p>
      <div>${SlowLoadingThing1()}</div>
      <div>${SlowLoadingThing2()}</div>
      <div>${SlowLoadingThing3()}</div>
      <p>Goodbye world!</p>
    </main>
  `;
}
