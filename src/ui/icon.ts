import { html } from '@hyperspan/html';
import './icon.css';

// Icons that are used in the app.
// Pre-loaded with some icons used b/c streaming content comes in after the initial HTML, and icons in it will not be available until the next person loads the page.
export const usedIcons: string[] = ['arrow_forward', 'code', 'menu', 'share'];

export function Icon(name: string, classes?: string) {
  if (!usedIcons.includes(name)) {
    usedIcons.push(name);
    usedIcons.sort(); // Icon names must be sorted alphabetically (Google Fonts requirement)
  }

  return html`<span
    class="material-symbols-sharp icon align-middle overflow-hidden w-[24px] h-[24px] ${classes}"
    >${name}</span
  >`;
}