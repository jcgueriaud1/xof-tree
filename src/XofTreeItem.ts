import { html, css, LitElement, property, query } from 'lit-element';
import { TreeItemArray } from './XofTree';

export class XofTreeItem extends LitElement {
  static styles =css`
ul,
ul li,
ul ul li {
   margin:0;
   text-indent: 0;
   list-style-type: none;
}
  .lbl-toggle::before {
  content: ' ';
  display: inline-block;

  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid currentColor;

  vertical-align: middle;
  margin-right: .7rem;
  transform: translateY(-2px);

  transition: transform .2s ease-out;
}
.expanded.lbl-toggle::before {
  transform: rotate(90deg) translateX(-3px);
}
  `;

  @property({type: String}) title = 'Hey there';

  @property({type: Boolean}) expanded = false;

  @property({type: Number}) tabIndex = -1;


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
    if (this.leaf()) {
      return "lbl-leaf";
    } else {
      if (this.expanded) {
        return "lbl-toggle expanded";
      } else {
        return "lbl-toggle";
      }
    }
  }

  @query('#label')
  _label!: HTMLElement;

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
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <li role="treeitem" aria-expanded="${this.expanded}">
        <span id="label" class="${this.cssClassName()}" @click=${this.clickHandler} tabindex=${this.tabIndex}>${this.title}</span>
        ${(this.leaf() || !this.expanded) ? html`` : html`<ul id="list" role="group">
          ${this.data.map(item => html`<xof-tree-item .title=${item.name} .data=${item.children} .expanded=${item.expanded}></xof-tree-item>`)}
        </ul>`}
      </li>
    `;
  }
}
