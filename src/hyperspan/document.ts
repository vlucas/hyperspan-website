import { html } from '@hyperspan/html';
import { clientJSFile } from './server';

export function HyperspanStyles() {
  return html`<link rel="stylesheet" href="/styles.css" />`;
}

export function HyperspanScripts() {
  return html`<script src="/_hs/js/${clientJSFile}"></script>`;
}
