import { XofTreeItem } from './src/XofTreeItem.js';

window.customElements.define('xof-tree-item', XofTreeItem);

declare global {
  interface HTMLElementTagNameMap {
    'xof-tree-item': XofTreeItem;
  }
}
