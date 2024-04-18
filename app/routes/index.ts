import { clientComponent, html, HSTemplate, HSClientTemplate } from '@hyperspan/html';
import MarketingLayout from '@app/layouts/MarketingLayout';

const ClientButton = clientComponent({
  initialState({ args }) {
    return { count: args[0] || 0 };
  },
  mount() {
    console.log('Client component mounted!');
    setTimeout(() => {
      this.mergeState({ count: this.state.count + 1 });
    }, 1000);
  },
  render() {
    return html`<div>
      Count is: ${this.state.count || 42}
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
        <h1>Hyperspan</h1>
        <h2>Simple. Server. Streaming.</h2>
        <hr />
        ${ClientButton(1)}
      </main>
    `,
  });
}
