import { html, LitElement, property, query, TemplateResult } from 'lit-element';
import { TreeItemArray, TreeItem } from './XofTree';

export class XofTreeItem extends LitElement {
  @property({ type: String }) title = 'Hey there';

  @property({ type: Boolean }) expanded = false;

  @property({ type: Number }) tabIndex = -1;

  @property({ type: Boolean }) multiselect = false;

  @property({ attribute: false }) data: TreeItemArray = [];

  @property({ attribute: false })
  renderer: (item: String) => TemplateResult = (item: String) => html`***${item}*****`;

  leaf() {
    return !(this.data && this.data.length > 0);
  }


  /**
   * Probably better to send an event that is catched in the tree
   */
  clickHandler() {
    if (!this.leaf()) {
      this.expanded = !this.expanded;
    }
  }

  /**
   * Probably better to send an event that is catched in the tree
   */
  labelClickHandler() {
    if (this.multiselect) {
      this.toggleSelection();
    }
  }

  cssClassName() {
    return 'lbl';
  }

  cssExpanderClassName() {
    if (this.leaf()) {
      return 'leaf';
    } else {
      if (this.expanded) {
        return 'expander expanded';
      } else {
        return 'expander';
      }
    }
  }

  @query('#label')
  _label!: HTMLElement;

  @query('#ms-checkbox')
  _checkbox!: HTMLInputElement;

  focus() {
    this._label.focus();
    this.tabIndex = 0;
  }

  @query('#list')
  _list!: HTMLElement;

  focusFirstChild() {
    (this._list.firstElementChild as XofTreeItem).focus();
  }

  focusLastChild() {
    const child = this._list.lastElementChild as XofTreeItem;
    if (child.expanded) {
      child.focusLastChild();
    } else {
      child.focus();
    }
  }

  toggleSelection() {
    this._checkbox.checked = !this._checkbox.checked;
    const event = new CustomEvent('item-selected', {
      detail: { selected: this._checkbox.checked, item: this },
    });
    const parent = (this.getRootNode() as ShadowRoot).host as HTMLElement;
    parent.dispatchEvent(event);
  }

  msClicked() {
    /**
     * send event item checked
     */
  }

  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <li role="treeitem" aria-expanded="${this.expanded}">
        <span
          id="label"
          class="${this.cssClassName()}"
          tabindex=${this.tabIndex}
        >
          <span
            @click=${this.clickHandler}
            class="${this.cssExpanderClassName()}"
          ></span>
          ${this.multiselect
            ? html`<input
                type="checkbox"
                id="ms-checkbox"
                @click=${this.msClicked}
              />`
            : html``}
          <span @click=${this.labelClickHandler}>${this.renderer(this.title)}</span>
        </span>
        ${this.leaf() || !this.expanded
          ? html``
          : html`<ul id="list" role="group">
              ${this.data.map(
                item =>
                  html`<xof-tree-item
                    .title=${item.name}
                    .data=${item.children}
                    ?expanded=${item.expanded}
                    ?multiselect=${this.multiselect}
                    .renderer=${this.renderer}
                  ></xof-tree-item>`
              )}
            </ul>`}
      </li>
    `;
  }
}
