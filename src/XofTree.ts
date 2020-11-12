import { html, css, LitElement, property, PropertyValues } from 'lit-element';
import { XofTreeItem } from './XofTreeItem';

export interface TreeItem {
  name: string;
  expanded: boolean;
  children: TreeItemArray;
}

export type TreeItemArray = Array<TreeItem>


export class XofTree extends LitElement {
  static styles =css`
    ul,
    ul li,
    ul ul li {
      margin:0;
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
      margin-right: .7rem;
      transform: translateY(-2px);

      transition: transform .2s ease-out;
    }
    .leaf.expander {
      content: none;
    }
    .expanded.expander {
      transform: rotate(90deg) translateX(-3px);
    }

  `;

  @property({type: String}) title = 'Hey there';

  @property({attribute: false}) data: TreeItemArray = [];

  @property({type: Boolean}) initialized = false;

  @property({attribute: false}) focusedItem = null;

  @property({type: Boolean}) multiselect = false;

 // First argument is the slot name
  // Second argument is `true` to flatten the assigned nodes.
  /*@queryAssignedNodes('children', true)
  _childrenNodes!: NodeListOf<HTMLElement>;*/

  protected shouldUpdate(changedProperties: PropertyValues): boolean {
    if (!this.initialized) {
      console.log("initialized {}", changedProperties.size);
      /*this.panels = Array.from(this.children);
      this.panels.map(panel => panel.setAttribute('tabIndex', '0'));
      this.addEventListener('click', this.handleClick);
      this.addEventListener('keyup', this.handleKeyup);*/
      this.addEventListener('keydown', this.handleKeydown);
      this.addEventListener('item-selected', this.handleItemSelectedE);
      this.initialized = true;
    }
    /*
    if (changedProperties.has('data')) {
      this._childrenNodes.
    }
    */
    return this.initialized;
  }

  handleItemSelectedE(e1: Event) {
    const e = (e1 as CustomEvent<{selected: boolean; item: XofTree}>);
    if (e.detail.selected) {
      console.log(e.detail.item + " selected");
    } else {
      console.log(e.detail.item + " deselected");
    }
  }

  handleItemSelected(e: CustomEvent<{selected: boolean; item: XofTree}>) {
    if (e.detail.selected) {
      console.log(e.detail.item + " selected");
    } else {
      console.log(e.detail.item + " deselected");
    }
  }

  leaf() {
    return !(this.data && this.data.length > 0)
  }

  handleKeydown(event: KeyboardEvent ) {

    event.preventDefault();
    const treeitem: XofTreeItem = event.composedPath().find((p) => (p as HTMLElement).nodeName === "XOF-TREE-ITEM") as XofTreeItem;
    treeitem.tabIndex = -1;
    switch (event.key) {
      // Tab.
    case "Down": // IE/Edge specific value
    case "ArrowDown":
      //target = this.setNextItem(target);
      if (treeitem.expanded) {
        this.navigateToFirstChildItem(treeitem);
      } else {
        this.navigateToNextItem(treeitem);
      }
      break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        //target = this.setPreviousItem(target);
        this.navigateToPreviousItem(treeitem);
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
          if (treeitem.leaf()) {
            this.navigateToNextItem(treeitem);
          } else {
            if (!treeitem.expanded && !treeitem.leaf()) {
              treeitem.expanded = true;
            } else {
              // go to next item
              this.navigateToFirstChildItem(treeitem);
            }
          }
          break;
          case "Left": // IE/Edge specific value
          case "ArrowLeft":
              if (treeitem.expanded) {
                treeitem.expanded = false;
              } else {
                // go to next item
                this.navigateToParentItem(treeitem);
              }
              break;

          case " ":
              if (this.multiselect) {
                treeitem.toggleSelection();
              }
              break;
      default:
        break;
    }

  }

  navigateToNextItem(treeitem: XofTreeItem) {
    console.log("navigate to next item" + treeitem.ATTRIBUTE_NODE);
    const nextElement = treeitem.nextElementSibling as XofTreeItem;

    if (nextElement) {
      nextElement.focus();
    } else {
      console.log("last child");
      const parent = ((treeitem.getRootNode() as ShadowRoot).host as XofTreeItem);
      if (!(parent instanceof XofTree)) {
        this.navigateToNextItem(parent);
      } else {
        this.navigateToNextItem(((treeitem.parentElement as HTMLElement).closest('xof-tree-item') as XofTreeItem));
      }
    }
  }

  navigateToPreviousItem(treeitem: XofTreeItem) {
    console.log("navigate to previous item" + treeitem.ATTRIBUTE_NODE);
    const previousElement = treeitem.previousElementSibling as XofTreeItem;
    if (previousElement) {
      if (previousElement.expanded) {
        previousElement.focusLastChild()
      } else {
        previousElement.focus();
      }
    } else {
      console.log("first child");
      treeitem.closest('element-x');
      const parent = ((treeitem.getRootNode() as ShadowRoot).host as XofTreeItem);
      if (!(parent instanceof XofTree)) {
        parent.focus();
      } else {
        ((treeitem.parentElement as HTMLElement).closest('xof-tree-item') as HTMLElement).focus();
      }
    }
  }

  // last Element Child

  navigateToFirstChildItem(treeitem: XofTreeItem) {
    console.log("navigate to parent item" + treeitem.ATTRIBUTE_NODE);
    treeitem.focusFirstChild();
  }

  navigateToParentItem(treeitem: XofTreeItem) {
    console.log("navigate to parent item" + treeitem.ATTRIBUTE_NODE);
    //debugger;
    const parent = ((treeitem.getRootNode() as ShadowRoot).host as XofTreeItem);
    if (!(parent instanceof XofTree)) {
      parent.focus();
    } else {
      ((treeitem.parentElement as HTMLElement).closest('xof-tree-item') as HTMLElement).focus();
    }
  }
  /*setFocusToItem(treeitem) {

    for (var i = 0; i < this.treeitems.length; i++) {
      var ti = this.treeitems[i];

      if (ti === treeitem) {
        ti.domNode.tabIndex = 0;
        ti.domNode.focus();
      }
      else {
        ti.domNode.tabIndex = -1;
      }
    }

  }*/

  /*
  // This is where the roving tabindex magic happens!
function activate(item) {
  // Set all of the buttons to tabindex -1
  toolbar.querySelectorAll('button').forEach((btn) => btn.tabIndex = -1);

  // Make the current button "active"
  item.tabIndex = 0;
  item.focus();
}
  */

  render() {
    return html`
    <h3 id="tree_label">${this.title}</h3>
    ${this.leaf() ? html`` : html`<ul role="tree" id="tree" aria-labelledby="tree_label">
    ${this.data.map(item => html`<xof-tree-item .title=${item.name} .data=${item.children} .expanded=${item.expanded} .multiselect=${this.multiselect}></xof-tree-item>`)}
    </ul>`}

    `;
  }
}
