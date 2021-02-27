import { XofTree } from './src/XofTree.js';

window.customElements.define('xof-tree', XofTree);

declare global {
  interface HTMLElementTagNameMap {
    'xof-tree': XofTree;
  }
}
