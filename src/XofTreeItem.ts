import { html, css, LitElement, property, query } from 'lit-element';
import { TreeItemArray } from './XofTree';

export class XofTreeItem extends LitElement {

  @property({type: String}) title = 'Hey there';

  @property({type: Boolean}) expanded = false;

  @property({type: Number}) tabIndex = -1;

  @property({type: Boolean}) multiselect = false;


  @property({attribute: false}) data: TreeItemArray = [];

  leaf() {
    return !(this.data && this.data.length > 0)
  }

  clickHandler() {
    if (!this.leaf()) {
      this.expanded = !this.expanded;
    }
  }


  cssClassName() {
    return "lbl";
  }

  cssExpanderClassName() {
    if (this.leaf()) {
      return "leaf";
    } else {
      if (this.expanded) {
        return "expander expanded";
      } else {
        return "expander";
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
    const child = (this._list.lastElementChild as XofTreeItem);
    if (child.expanded) {
      child.focusLastChild();
    } else {
      child.focus();
    }
  }

  toggleSelection() {
    this._checkbox.checked = !this._checkbox.checked;
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
        <span id="label" class="${this.cssClassName()}" tabindex=${this.tabIndex}>
        <span @click=${this.clickHandler} class="${this.cssExpanderClassName()}"></span>
        ${(this.multiselect) ? html`<input type="checkbox" id="ms-checkbox" @click=${this.msClicked}/>` : html`` }
        ${this.title}
      </span>
        ${(this.leaf() || !this.expanded) ? html`` : html`<ul id="list" role="group">
          ${this.data.map(item => html`<xof-tree-item .title=${item.name} .data=${item.children} .expanded=${item.expanded} .multiselect=${this.multiselect}></xof-tree-item>`)}
        </ul>`}
      </li>
    `;
  }
}
