import {html, nothing} from 'lit-html';
import { css, LitElement, property, query, TemplateResult, queryAssignedNodes } from 'lit-element';
import { TreeItemArray, TreeItem } from './XofTree';


export class XofTreeItem extends LitElement {
  static styles = css`
    ul,
    ul li,
    ul ul li {
      margin: 0;
      text-indent: 0;
      list-style-type: none;
    }
    .expander {
      content: ' ';
      display: inline-block;

      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 5px solid currentColor;

      vertical-align: middle;
      margin-right: 0.7rem;
      transform: translateY(-2px);

      transition: transform 0.2s ease-out;
    }
    .leaf.expander {
      content: none;
    }
    .expanded.expander {
      transform: rotate(90deg) translateX(-3px);
    }

  `;
  @property({ attribute: false}) itemdata;

  @property({ type: Boolean }) expanded = false;

  @property({ type: Number }) level = -1;

  @property({ attribute: false })
  itemchildren: TreeItemArray = [];

  @property({ type: Number }) tabIndex = -1;

  @property({ type: Boolean }) multiselect = false;

  @property({ type: Boolean }) leaf = false;

  @property({ attribute: false }) items: TreeItemArray = [];

  @property({ attribute: false })
  renderer: (item: any) => TemplateResult = (item: any) => html`***${item}*****`;

  /**
   * Probably better to send an event that is catched in the tree
   */
  clickHandler() {
    if (!this.leaf) {
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
    if (this.leaf) {
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
    (this._itemNodes[0].firstElementChild as XofTreeItem).focus();
    //(this._list.firstElementChild as XofTreeItem).focus();
  }

  @queryAssignedNodes('items', true)
  _itemNodes!: NodeListOf<XofTreeItem>;

  focusLastChild() {
    //const child = this._list.lastElementChild as XofTreeItem;
    const child = (this._itemNodes[0].lastElementChild as XofTreeItem);
    if (child.expanded) {
      child.focusLastChild();
    } else {
      child.focus();
    }
  }

  toggleSelection() {
    this._checkbox.checked = !this._checkbox.checked;
    const event = new CustomEvent('__item-selected', {
      detail: { selected: this._checkbox.checked, item: this },
    });
    const parent = (this.getRootNode() as ShadowRoot).host as HTMLElement;
    parent.dispatchEvent(event);
  }

  msClicked() {
    /**
     * send event item checked
     */
    const event = new CustomEvent('__item-selected', {
      detail: { selected: this._checkbox.checked, item: this },
    });
    const parent = (this.getRootNode() as ShadowRoot).host as HTMLElement;
    parent.dispatchEvent(event);
  }

  /*
  handleItemSelected(e: CustomEvent<{ selected: boolean; item: XofTreeItem }>) {
    const event = new CustomEvent('__item-selected', {
      detail: { selected: e.detail.selected, item: e.detail.item },
    });
    const parent = (this.getRootNode() as ShadowRoot).host as HTMLElement;
    parent.dispatchEvent(event);
  }*/

  render() {
    //console.log("render");
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
            : nothing}
          <span @click=${this.labelClickHandler}>${this.renderer(this.itemdata)}</span>
        </span>
        ${this.leaf || !this.expanded
          ? nothing
          : html`<ul id="list" role="group"><slot name="items"></slot>
            </ul>`}
      </li>
    `;
  }

}
