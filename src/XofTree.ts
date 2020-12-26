import { html, nothing } from 'lit-html';
import {
  css,
  LitElement,
  property,
  queryAssignedNodes,
  TemplateResult,
} from 'lit-element';
import { XofTreeItem } from './XofTreeItem.js';

/**
 *
 * `<xof-tree>` is a Tree element to show hierarchical data as a tree.
 *
 *
 * ### Item rendering
 *
 * ```html
 * <xof-tree id="tree"></xof-tree>
 * ```
 * ```js
 * const tree = document.querySelector('#reee');
 * tree.data = [{"itemdata": "Branch1","children": [{"itemdata": "Branch1.1"}, {"itemdata": "Branch1.2"}]}];
 * ```
 *
 * The following properties are available for item template bindings:
 *
 * Property name | Type | Description
 * --------------|------|------------
 * `title`| String | Title of the tree
 * `data` | TreeItemDataArray | The tree data
 * `multiselect` | Boolean | True when the tree is in multiselect mode
 * `renderer` | TreeItemRenderer | renderer for the item
 *
 *
 * ```javascript
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|-------------
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 *
 *
 *
 * @element xof-tree
 *
 * @fires {CustomEvent<{old: HasId[], new:HasId[]>} item-selected - fires event
 * @fires {CustomEvent<HasId>} item-expanded
 *
 *
 * @slot items - To document, the tree item are added in the `items` slot
 *
 */
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

 /**
  * Title of the tree
  * @type {String}
  * @attr
  */
  @property({ type: String }) title = '';

  /**
   * The tree data
   * @type {TreeItemDataArray}
   * @prop
   */
  @property({ attribute: false }) data: TreeItemDataArray = [];

  /**
   * is tree in multi select?
   *
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean }) multiselect = false;

  /**
   * renderer for the item
   * @type {TreeItemRenderer}
   * @prop
   */
  @property({ attribute: false })
  renderer: TreeItemRenderer = (item: HasId) => html`${item}`;

  @property({ attribute: false }) focusedItem = null;

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
      const parentElement = treeitem.parentElement!.closest(
        'xof-tree-item'
      );
      if (parentElement) {
        this.navigateToNextItem(parentElement);
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
      const parentElement = treeitem.parentElement!.closest(
        'xof-tree-item'
      );
      if (parentElement) {
        parentElement.focus();
      }
    }
  }

  // last Element Child
  navigateToFirstChildItem(treeitem: XofTreeItem) {
    treeitem.focusFirstChild();
  }

  navigateToParentItem(treeitem: XofTreeItem) {
    const parentElement = treeitem.parentElement!.closest(
      'xof-tree-item'
    );
    if (parentElement) {
      parentElement.focus();
    }
  }

  _isleaf(children?: TreeItemDataArray) {
    return !(children && children.length > 0);
  }

  /**
   * Collapse all the nodes
   */
  public collapseAll() {
    this.collapse(() => true);
  }

  /**
   * Expand all the nodes
   */
  public expandAll() {
    this.expand(() => true);
  }

  /**
   * Collapse the node that fits the condition
   *
   * @param condition condition to collapse the node
   */
  public collapse(condition: (item: HasId) => boolean) {
    this.data = this.__expandOrCollapseIf(this.data, false, condition);
  }

  /**
   * Collapse the item
   *
   * @param item item to collapse
   */
  public collapseItem(item: HasId) {
    this.collapse( (item1) => item1.id === item.id);
  }

  /**
   * Collapse the item id
   *
   * @param id id to collapse
   */
  public collapseId(id: string) {
    this.collapse( (item1) => item1.id === id);
  }
  /**
   * Collapse the node that fits the condition
   *
   * @param condition condition to collapse the node
   */
  public expand(condition: (item: HasId) => boolean) {
    this.data = this.__expandOrCollapseIf(this.data, true, condition);
  }

  /**
   * expand the item
   *
   * @param item item to expand
   */
  public expandItem(item: HasId) {
    this.expand( (item1) => item1.id === item.id);
  }
  /**
   * expand the item id
   *
   * @param id id to expand
   */
  public expandId(id: string) {
    this.expand( (item1) => item1.id === id);
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

  public selectAll() {
    this.select(() => true);
  }

  public deselectAll() {
    this.deselect(() => true);
  }

  public select(condition: (item: HasId) => boolean) {
    this.data = this.__selectOrSelectIf(this.data, true, condition);
  }

  /**
   * select the item
   *
   * @param item item to select
   */
  public selectItem(item: HasId) {
    this.select( (item1) => item1.id === item.id);
  }
  /**
   * select the item id
   *
   * @param id id to select
   */
  public selectId(id: string) {
    this.select( (item1) => item1.id === id);
  }

  public deselect(condition: (item: HasId) => boolean) {
    this.data = this.__selectOrSelectIf(this.data, false, condition);
  }

  /**
   * deselect the item
   *
   * @param item item to deselect
   */
  public deselectItem(item: HasId) {
    this.deselect( (item1) => item1.id === item.id);
  }
  /**
   * deselect the item id
   *
   * @param id id to deselect
   */
  public deselectId(id: string) {
    this.deselect( (item1) => item1.id === id);
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

  public addEventListener<T extends keyof XofTreeEventMap>(
    type: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: XofTree, ev: XofTreeEventMap[T]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;

  public addEventListener(
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: XofTree, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener, options);
  }


  public removeEventListener<K extends keyof XofTreeEventMap>(
    type: K,
    listener: (this: XofTree, ev: XofTreeEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;


  public removeEventListener(
    type: string,
    listener: (this: XofTree, ev: Event) => void,
    options?: boolean | EventListenerOptions
  ): void {
    super.removeEventListener(type, listener, options);
  }
}

declare type TreeItemRenderer = (item: HasId) => TemplateResult;

declare global {
  interface HTMLElementTagNameMap {
    'xof-tree-item': XofTreeItem;
  }
}