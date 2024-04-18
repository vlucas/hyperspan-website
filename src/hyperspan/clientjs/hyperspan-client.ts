import { html, renderToString, HSClientTemplate, type THSClientComponent } from '@hyperspan/html';
import { Idiomorph } from './idomorph.esm';
// @ts-ignore
import mixin from 'mixin-deep';

// Hyperspan - Async content loader
// Puts streamed content in its place immediately after it is added to the DOM
if (typeof MutationObserver != 'undefined') {
  const asyncContentObserver = new MutationObserver((list) => {
    const asyncContent = list
      .map((mutation) =>
        Array.from(mutation.addedNodes).find((node: any) => {
          return node.id?.startsWith('async_') && node.id?.endsWith('_content');
        })
      )
      .filter((node: any) => node);

    asyncContent.forEach((el: any) => {
      try {
        // Also observe child nodes for nested async content
        asyncContentObserver.observe(el.content, { childList: true, subtree: true });

        const slotId = el.id.replace('_content', '');
        const slotEl = document.getElementById(slotId);

        if (slotEl) {
          // Wait until next paint for streaming content to finish writing to DOM
          requestAnimationFrame(() => {
            setTimeout(() => {
              Idiomorph.morph(slotEl, el.content.cloneNode(true));
              el.parentNode.removeChild(el);
            }, 100);
          });
        }
      } catch (e) {
        console.error(e);
      }
    });
  });
  asyncContentObserver.observe(document.body, { childList: true, subtree: true });
}

// Registers client components if they are not registered already
function hyperspanOnLoad() {
  const comps = window.__hsc || [];

  comps.forEach((c) => window.__hs.component(c));
}

type TStateStore = {
  state: any;
  setState(newState: any): any;
  mergeState(state: any): any;
};
function createStore<T>(
  initialState: T,
  fn: ({ state, setState, mergeState }: TStateStore) => void
) {
  const store: TStateStore = {
    state: initialState,
    setState(newState: T): T {
      store.state = newState;
      fn(store);
      return store.state;
    },
    mergeState(newState: Partial<T>): T {
      store.state = mixin(store.state, newState);
      fn(store);
      return store.state;
    },
  };

  return store;
}

/**
 * Global Window assignments...
 */

// @ts-ignore
const hs: any = {
  _c: {},
  _fn: [],
  component(c: THSClientComponent) {
    const id = c.id ?? '';
    if (!id || this._c[id] !== undefined) {
      return;
    }
    const comp = (this._c[id] = new HSClientTemplate(c, c.args));
    const targetEl = document.querySelector(`[data-hsc-id="${c.id}"]`);
    comp._onUpdate(async () => {
      const newHTML = await renderToString(c.render.call(comp));

      if (targetEl && newHTML) {
        Idiomorph.morph(targetEl, newHTML);
      }
    });
    comp.mount && comp.mount();
  },
  compIdOrLast(id?: string) {
    let comps = Object.keys(this._c);
    if (comps.length === 0) {
      hyperspanOnLoad();
    }

    comps = Object.keys(this._c);
    if (comps.length === 0) {
      return false;
    }

    const lastCompId = comps.reverse()[0];
    const cid = this._c[id || lastCompId] !== undefined ? id : lastCompId;
    const comp = cid ? this._c[cid] : false;

    return comp;
  },
  fn(id: string, ufn: any) {
    const comp = this.compIdOrLast(id);

    if (!comp) {
      return;
    }

    const fnd = {
      id,
      cid: comp.id,
      fn: ufn.bind(comp),
      comp,
    };

    this._fn.push(fnd);
  },
  fnc(id: string, ...args: any[]) {
    const fnd = this._fn.find((f: any) => f.id === id || f.cid === id);

    if (!fnd) {
      return;
    }

    fnd.fn(fnd.comp, ...args);
  },
};

// @ts-ignore
window.__hs = hs;

// @ts-ignore
window.html = html;
window.addEventListener('load', hyperspanOnLoad);
