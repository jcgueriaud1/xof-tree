import { html, nothing, render, directive } from 'lit-html';
import {  css, LitElement, property, PropertyValues, TemplateResult, queryAssignedNodes } from 'lit-element';
import { XofTreeItem } from './XofTreeItem';

export interface TreeItem<T> {
  itemdata: T;
  expanded: boolean;
  children: TreeItemArray;
}

export type TreeItemArray = Array<TreeItem<any>>;

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

  @property({ attribute: false }) items: TreeItemArray = [];

  @property({ type: Boolean }) initialized = false;

  @property({ attribute: false }) focusedItem = null;

  @property({ type: Boolean }) multiselect = false;

  @property({ attribute: false })
  renderer: (item: any) => TemplateResult = (item: any) => html`***${item}*****`;

  private _itemsSelected: Array<any> = [];

  // First argument is the slot name
  // Second argument is `true` to flatten the assigned nodes.
  /*@queryAssignedNodes('children', true)
  _childrenNodes!: NodeListOf<HTMLElement>;*/

  protected shouldUpdate(changedProperties: PropertyValues): boolean {
    if (!this.initialized) {
      console.log('initialized {}', changedProperties.size);
      /*this.panels = Array.from(this.children);
      this.panels.map(panel => panel.setAttribute('tabIndex', '0'));
      this.addEventListener('click', this.handleClick);
      this.addEventListener('keyup', this.handleKeyup);*/
      this.addEventListener('keydown', this.handleKeydown);
      this.addEventListener('__item-selected', this.handleItemSelected);
      this.initialized = true;
    }
/*
    if (changedProperties.has('items')) {
      this._headerNodes =
    }*/

    return this.initialized;
  }

  /*handleItemSelectedE(e1: Event) {
    const e = e1 as CustomEvent<{ selected: boolean; item: XofTree }>;
    if (e.detail.selected) {
      console.log(e.detail.item + ' selectedE');
    } else {
      console.log(e.detail.item + ' deselectedE');
    }
  }*/

  handleItemSelected(e1: Event) {
    const e = e1 as CustomEvent<{ selected: boolean; item: XofTreeItem }>;
    const _oldItemsSelected = [...this._itemsSelected];
    if (e.detail.selected) {
      this._itemsSelected.push(e.detail.item.itemdata);
    } else {

      const idx = this._itemsSelected.indexOf(e.detail.item.itemdata);
      this._itemsSelected = this._itemsSelected.filter((item, index) => index !== idx);
    }
    const event = new CustomEvent('item-selected', {
      detail: { old: _oldItemsSelected, new: this._itemsSelected },
    });
    this.dispatchEvent(event);
  }

  leaf() {
    return !(this.items && this.items.length > 0);
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
        //target = this.setPreviousItem(target);
        this.navigateToPreviousItem(treeitem);
        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        if (treeitem.leaf) {
          this.navigateToNextItem(treeitem);
        } else {
          if (!treeitem.expanded && !treeitem.leaf) {
            treeitem.expanded = true;
            // jcg test load
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
          treeitem.expanded = false;
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
  }

  private _loadTreeItem(treeitem: XofTreeItem) {
    if (treeitem.childElementCount == 0) {
      render(html`<div slot="items">
      ${this.renderItems(treeitem.itemchildren, treeitem.level + 1, this.multiselect)}
    </div>`, treeitem, {eventContext: this});
    }
  }

  navigateToNextItem(treeitem: XofTreeItem) {
    console.log('navigate to next item' + treeitem.ATTRIBUTE_NODE);
    const nextElement = treeitem.nextElementSibling as XofTreeItem;

    if (nextElement) {
      nextElement.focus();
    } else {
      console.log('last child');
      const parent = (treeitem.getRootNode() as ShadowRoot).host as XofTreeItem;
      if (!(parent instanceof XofTree)) {
        this.navigateToNextItem(parent);
      } else {
        this.navigateToNextItem(
          (treeitem.parentElement as HTMLElement).closest(
            'xof-tree-item'
          ) as XofTreeItem
        );
      }
    }
  }

  navigateToPreviousItem(treeitem: XofTreeItem) {
    console.log('navigate to previous item' + treeitem.ATTRIBUTE_NODE);
    const previousElement = treeitem.previousElementSibling as XofTreeItem;
    if (previousElement) {
      if (previousElement.expanded) {
        previousElement.focusLastChild();
      } else {
        previousElement.focus();
      }
    } else {
      console.log('first child');
      treeitem.closest('element-x');
      const parent = (treeitem.getRootNode() as ShadowRoot).host as XofTreeItem;
      if (!(parent instanceof XofTree)) {
        parent.focus();
      } else {
        ((treeitem.parentElement as HTMLElement).closest(
          'xof-tree-item'
        ) as HTMLElement).focus();
      }
    }
  }

  // last Element Child

  navigateToFirstChildItem(treeitem: XofTreeItem) {
    console.log('navigate to navigateToFirstChildItem item' + treeitem.ATTRIBUTE_NODE);
    treeitem.focusFirstChild();
  }

  navigateToParentItem(treeitem: XofTreeItem) {
    console.log('navigate to parent item' + treeitem.ATTRIBUTE_NODE);
    const parent = (treeitem.getRootNode() as ShadowRoot).host as XofTreeItem;
    if (!(parent instanceof XofTree)) {
      parent.focus();
    } else {
      ((treeitem.parentElement as HTMLElement).closest(
        'xof-tree-item'
      ) as HTMLElement).focus();
    }
  }
  @queryAssignedNodes('items', true)
  _itemNodes!: NodeListOf<XofTreeItem>;

  _isleaf(children: TreeItemArray) {
    return !(children && children.length > 0);
  }

  renderItems(items: TreeItemArray, level: number, multiselect: boolean): TemplateResult {
    if (items) {
    return html`${items.map(
      item => {
        return  html`<xof-tree-item
          .itemdata=${item.itemdata}
          .itemchildren=${item.children}
          ?expanded=${item.expanded}
          ?leaf=${this._isleaf(item.children)}
          ?multiselect=${multiselect}
          .renderer=${this.renderer}
        >
        ${(this._isleaf(item.children) || !item.expanded)?nothing:
      html`<div slot="items">
        ${this.renderItems(item.children, level + 1, multiselect)}
      </div>`}
        </xof-tree-item>`;
        }
      )}`;
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
            ${this.renderItems(this.items, 0, this.multiselect)}
          </slot>
          </ul>`}
    `;
  }
}
