import { html, css, LitElement, property, PropertyValues } from 'lit-element';


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
    :host {
      color: var(--xof-tree-text-color, #000);
    }
  `;

  @property({type: String}) title = 'Hey there';

  @property({attribute: false}) data: TreeItemArray = [];

  @property({type: Boolean}) initialized = false;

  protected shouldUpdate(changedProperties: PropertyValues): boolean {
    if (!this.initialized) {
      console.log("initialized {}", changedProperties.size);
      /*this.panels = Array.from(this.children);
      this.panels.map(panel => panel.setAttribute('tabIndex', '0'));
      this.addEventListener('click', this.handleClick);
      this.addEventListener('keyup', this.handleKeyup);*/
      this.initialized = true;
    }

    return this.initialized;
  }

  leaf() {
    return !(this.data && this.data.length > 0)
  }

  render() {
    return html`
    <h3 id="tree_label">${this.title}</h3>
    ${this.leaf() ? html`` : html`<ul role="tree" aria-labelledby="tree_label">
      ${this.data.map(item => html`<xof-tree-item .title=${item.name} .data=${item.children} .expanded=${item.expanded} tabindex="-1"></xof-tree-item>`)}
    </ul>`}

    `;
  }
}
