import { clientComponent, html } from '@hyperspan/html';

export default clientComponent('counter', {
  state: { count: 0 },
  mount() {
    setTimeout(() => {
      this.mergeState({ count: this.state.count + 1 });
    }, 1000);
  },
  render() {
    return html`<div>
      Count is: ${String(this.state.count || 0)}
      <button
        class="btn btn-primary"
        onClick=${() => {
          this.setState({ count: this.state.count + 1 });
        }}
      >
        Increment
      </button>
      <button
        class="btn btn-primary"
        onClick=${() => {
          this.setState({ count: this.state.count - 1 });
        }}
      >
        Decrement
      </button>
    </div>`;
  },
});
