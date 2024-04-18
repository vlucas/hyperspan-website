import { clientComponent, html, HSTemplate, HSClientTemplate } from '@hyperspan/html';
import MarketingLayout from '@app/layouts/MarketingLayout';

const ClientButton = clientComponent({
  initialState({ args }) {
    return { count: args[0] ?? 0 };
  },
  mount() {
    console.log('Client component mounted!');
    setTimeout(() => {
      this.mergeState({ count: this.state.count + 1 });
    }, 1000);
  },
  render() {
    return html`<div>
      Count is: ${this.state.count ?? 0}
      <button
        class="btn btn-primary"
        onClick=${(comp: HSClientTemplate) => {
          comp.setState({ count: comp.state.count + 1 });
        }}
      >
        Increment
      </button>
      <button
        class="btn btn-primary"
        onClick=${(comp: HSClientTemplate) => {
          comp.setState({ count: comp.state.count - 1 });
        }}
      >
        Decrement
      </button>
    </div>`;
  },
});

export default function IndexPage(req: Request): Promise<HSTemplate> {
  return MarketingLayout({
    title: 'Hyperspan Demo',
    children: html`
      <main>
        <div class="hero min-h-96 bg-base-200">
          <div class="hero-content text-center">
            <div class="max-w-md">
              <h1 class="text-4xl font-bold">Simple. Server. Streaming.</h1>
              <p class="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
                exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
              </p>
              <button class="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
        <h1>Hyperspan</h1>
        <h2>Simple. Server. Streaming.</h2>
        <hr />
        ${ClientButton(1)}
      </main>
    `,
  });
}
