import { html, nothing } from 'lit-html';
import {
  css,
  LitElement,
  property,
  queryAssignedNodes,
  TemplateResult,
} from 'lit-element';
import { XofTreeItem } from './XofTreeItem.js';

declare type TreeItemRenderer = (item: HasId) => TemplateResult;

export class XofTree extends LitElement {
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

  @property({ type: String }) title = 'Hey there';

  @property({ attribute: false }) data: TreeItemDataArray = [];

  @property({ type: Boolean }) initialized = false;

  @property({ attribute: false }) focusedItem = null;

  @property({ type: Boolean }) multiselect = false;

  @property({ attribute: false })
  renderer: TreeItemRenderer = (item: HasId) => html`${item}`;

  private _itemsSelected: Array<HasId> = [];

  private _itemsExpanded: Array<HasId> = [];

  @queryAssignedNodes('items', true)
  private _itemNodes!: NodeListOf<XofTreeItem>;

  protected firstUpdated() {
    this.addEventListener('keydown', this.handleKeydown);
    this.addEventListener('__item-selected', this.handleItemSelected);
    this.addEventListener('__item-expanded', this.handleItemExpanded);
  }

  private handleItemSelected(e1: Event) {
    const e = e1 as CustomEvent<{ selected: boolean; item: XofTreeItem }>;
    const _oldItemsSelected = [...this._itemsSelected];
    if (e.detail.selected) {
      this.select(itemdata => e.detail.item.itemdata! == itemdata);
      this._itemsSelected.push(e.detail.item.itemdata!);
    } else {
      this.deselect(itemdata => e.detail.item.itemdata! == itemdata);
      const idx = this._itemsSelected.indexOf(e.detail.item.itemdata!);
      this._itemsSelected = this._itemsSelected.filter(
        (item, index) => index !== idx
      );
    }
    const event = new CustomEvent('item-selected', {
      detail: { old: _oldItemsSelected, new: this._itemsSelected },
    });
    this.dispatchEvent(event);
  }

  private handleItemExpanded(e1: Event) {
    const e = e1 as CustomEvent<{ expanded: boolean; item: XofTreeItem }>;
    const _oldItemsExpanded = [...this._itemsExpanded];
    if (e.detail.expanded) {
      this.expand(itemdata => e.detail.item.itemdata! == itemdata);
      this._itemsExpanded.push(e.detail.item.itemdata!);
    } else {
      this.collapse(itemdata => e.detail.item.itemdata! == itemdata);
      const idx = this._itemsExpanded.indexOf(e.detail.item.itemdata!);
      this._itemsExpanded = this._itemsExpanded.filter(
        (item, index) => index !== idx
      );
    }
    const event = new CustomEvent('item-expanded', {
      detail: { old: _oldItemsExpanded, new: this._itemsExpanded },
    });
    this.dispatchEvent(event);
  }

  leaf() {
    return !(this.data && this.data.length > 0);
  }

  handleKeydown(event: KeyboardEvent) {
    event.preventDefault();
    const treeitem: XofTreeItem = event
      .composedPath()
      .find(
        p => (p as HTMLElement).nodeName === 'XOF-TREE-ITEM'
      ) as XofTreeItem;
    treeitem.tabIndex = -1;
    switch (event.key) {
      // Tab.
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        //target = this.setNextItem(target);
        if (treeitem.expanded) {
          this.navigateToFirstChildItem(treeitem);
        } else {
          this.navigateToNextItem(treeitem);
        }
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        this.navigateToPreviousItem(treeitem);
        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        if (treeitem.leaf) {
          this.navigateToNextItem(treeitem);
        } else {
          if (!treeitem.expanded && !treeitem.leaf) {
            this._loadTreeItem(treeitem);
          } else {
            // go to next item
            this.navigateToFirstChildItem(treeitem);
          }
        }
        break;
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
        if (treeitem.expanded) {
          this.collapse(itemdata => itemdata == treeitem.itemdata);
        } else {
          // go to next item
          this.navigateToParentItem(treeitem);
        }
        break;

      case ' ':
        if (this.multiselect) {
          treeitem.toggleSelection();
        }
        break;
      default:
        break;
    }
    this.requestUpdate();
  }

  private _loadTreeItem(treeitem: XofTreeItem) {
    if (treeitem.childElementCount == 0) {
      this.expand(itemdata => itemdata == treeitem.itemdata);
    }
  }

  navigateToNextItem(treeitem: XofTreeItem) {
    const nextElement = treeitem.nextElementSibling as XofTreeItem;

    if (nextElement) {
      nextElement.focus();
    } else {
      const parentElement = (treeitem.parentElement as HTMLElement).closest(
        'xof-tree-item'
      );
      if (parentElement) {
        this.navigateToNextItem(parentElement as XofTreeItem);
      }
    }
  }

  navigateToPreviousItem(treeitem: XofTreeItem) {
    const previousElement = treeitem.previousElementSibling as XofTreeItem;
    if (previousElement) {
      if (previousElement.expanded) {
        previousElement.focusLastChild();
      } else {
        previousElement.focus();
      }
    } else {
      const parentElement = (treeitem.parentElement as HTMLElement).closest(
        'xof-tree-item'
      );
      if (parentElement) {
        (parentElement as HTMLElement).focus();
      }
    }
  }

  // last Element Child
  navigateToFirstChildItem(treeitem: XofTreeItem) {
    treeitem.focusFirstChild();
  }

  navigateToParentItem(treeitem: XofTreeItem) {
    const parentElement = (treeitem.parentElement as HTMLElement).closest(
      'xof-tree-item'
    );
    if (parentElement) {
      (parentElement as HTMLElement).focus();
    }
  }

  _isleaf(children?: TreeItemDataArray) {
    return !(children && children.length > 0);
  }

  collapseAll() {
    this.collapse(() => true);
  }

  expandAll() {
    this.expand(() => true);
  }

  collapse(condition: (item: HasId) => boolean) {
    this.data = this.__expandOrCollapseIf(this.data, false, condition);
  }

  expand(condition: (item: HasId) => boolean) {
    this.data = this.__expandOrCollapseIf(this.data, true, condition);
  }

  private __expandOrCollapseIf(
    items: TreeItemDataArray,
    expanded: boolean,
    condition: (item: HasId) => boolean
  ) {
    return items.map(item => {
      if (item.children) {
        return {
          itemdata: item.itemdata,
          selected: item.selected,
          expanded: condition(item.itemdata) ? expanded : item.expanded,
          children: this.__expandOrCollapseIf(
            item.children,
            expanded,
            condition
          ),
        };
      } else {
        return { itemdata: item.itemdata, selected: item.selected };
      }
    });
  }

  selectAll() {
    this.select(() => true);
  }

  deselectAll() {
    this.deselect(() => true);
  }

  select(condition: (item: HasId) => boolean) {
    this.data = this.__selectOrSelectIf(this.data, true, condition);
  }

  deselect(condition: (item: HasId) => boolean) {
    this.data = this.__selectOrSelectIf(this.data, false, condition);
  }

  private __selectOrSelectIf(
    items: TreeItemDataArray,
    selected: boolean,
    condition: (item: HasId) => boolean
  ) {
    return items.map(item => {
      if (item.children) {
        return {
          itemdata: item.itemdata,
          expanded: item.expanded,
          selected: condition(item.itemdata) ? selected : item.selected,
          children: this.__selectOrSelectIf(item.children, selected, condition),
        };
      } else {
        return {
          itemdata: item.itemdata,
          selected: condition(item.itemdata) ? selected : item.selected,
        };
      }
    });
  }

  renderItems(
    items: TreeItemDataArray,
    level: number,
    multiselect: boolean
  ): TemplateResult {
    if (items) {
      return html`${items.map(item => {
        return html`<xof-tree-item
          .itemdata=${item.itemdata}
          .item=${item}
          ?expanded=${item.expanded}
          ?selected=${item.selected}
          ?leaf=${this._isleaf(item.children)}
          ?multiselect=${multiselect}
          .renderer=${this.renderer}
        >
          ${this._isleaf(item.children) || !item.expanded
            ? nothing
            : html`<div slot="items">
                ${this.renderItems(item.children!, level + 1, multiselect)}
              </div>`}
        </xof-tree-item>`;
      })}`;
    } else {
      return html``;
    }
  }

  render() {
    return html`
      <h3 id="tree_label">${this.title}</h3>
      ${this.leaf()
        ? nothing
        : html`<ul role="tree" id="tree" aria-labelledby="tree_label">
            <slot name="items">
              ${this.renderItems(this.data, 0, this.multiselect)}
            </slot>
          </ul>`}
    `;
  }
}
