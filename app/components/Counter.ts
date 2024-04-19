import { clientComponent, html, HSClientTemplate } from '@hyperspan/html';

export default clientComponent({
  initialState({ props }) {
    return { count: props.count || 0 };
  },
  mount() {
    console.log('Client component mounted!');
    setTimeout(() => {
      // @ts-ignore
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
