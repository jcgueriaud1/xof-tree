import { html, css, LitElement, TemplateResult, nothing } from 'lit';
import { property, queryAssignedNodes, query } from 'lit/decorators.js';

import type { HasId, TreeItemRenderer } from './XofTree.js';

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
  @property({ attribute: false })
  itemdata: HasId = { id: 0 };

  @property({ type: Number }) level = -1;

  @property({ type: Boolean })
  multiselect = false;

  @property({ type: Boolean })
  selected = false;

  @property({ type: Boolean })
  expanded = false;

  @property({ type: Boolean })
  leaf = false;

  @property({ attribute: false })
  renderer: TreeItemRenderer<HasId> = (item: HasId) => html`${item}`;

  @query('#label')
  private _label!: HTMLElement;

  @query('#ms-checkbox')
  private _checkbox!: HTMLInputElement;

  @query('#list')
  private _list!: HTMLElement;

  @queryAssignedNodes('items', true)
  private _itemNodes!: NodeListOf<XofTreeItem>;

  /**
   * Probably better to send an event that is catched in the tree
   */
  clickHandler(): void {
    if (!this.leaf) {
      const event = new CustomEvent('__item-expanded', {
        detail: { expanded: !this.expanded, item: this },
      });
      const parent = (this.getRootNode() as ShadowRoot).host as HTMLElement;
      parent.dispatchEvent(event);
    }
  }

  /**
   * Probably better to send an event that is catched in the tree
   */
  labelClickHandler(): void {
    if (this.multiselect) {
      this.toggleSelection();
    }
  }

  cssClassName(): string {
    return 'lbl';
  }

  cssExpanderClassName(): string {
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

  focus(): void {
    this._label.focus();
    this.tabIndex = 0;
  }

  focusFirstChild(): void {
    (this._itemNodes[0].firstElementChild as XofTreeItem).focus();
  }

  focusLastChild(): void {
    const child = this._itemNodes[0].lastElementChild as XofTreeItem;
    if (child.expanded) {
      child.focusLastChild();
    } else {
      child.focus();
    }
  }

  toggleSelection(): void {
    this._checkbox.checked = !this._checkbox.checked;
    const event = new CustomEvent('__item-selected', {
      detail: { selected: this._checkbox.checked, item: this },
    });
    const parent = (this.getRootNode() as ShadowRoot).host as HTMLElement;
    parent.dispatchEvent(event);
  }

  msClicked(): void {
    /**
     * send event item checked
     */
    const event = new CustomEvent('__item-selected', {
      detail: { selected: this._checkbox.checked, item: this },
    });
    const parent = (this.getRootNode() as ShadowRoot).host as HTMLElement;
    parent.dispatchEvent(event);
  }

  render(): TemplateResult {
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
                ?checked=${this.selected}
              />`
            : nothing}
          <span @click=${this.labelClickHandler}
            >${this.renderer(this.itemdata!)}</span
          >
        </span>
        ${this.leaf || !this.expanded
          ? nothing
          : html`<ul id="list" role="group">
              <slot name="items"></slot>
            </ul>`}
      </li>
    `;
  }
}
