
// TYPES
declare interface TreeItemData {
  itemdata: HasId;
  expanded?: boolean;
  selected?: boolean;
  children?: TreeItemDataArray;
}
declare type TreeItemDataArray = Array<TreeItemData>;

declare interface HasItemData {
  itemdata?: HasId;
}
declare interface HasId {
  id: string;
}
/**
 * Fired when an item is expanded or collapsed.
 */
declare type XofTreeItemExpanded<T> = CustomEvent<{ old: T[]; new: T[] }>;

/**
 * Fired when an item is selected or deselected.
 */
declare type XofTreeItemSelected<T> = CustomEvent<{ old: T[]; new: T[] }>;

declare interface XofTreeElementEventMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'item-expanded': XofTreeItemExpanded<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'item-selected': XofTreeItemSelected<any>;
  /** Intenal events */
  '__item-selected': CustomEvent<{ selected: boolean; item: HasItemData }>;
  '__item-expanded': CustomEvent<{ expanded: boolean; item: HasItemData }>;
}

declare interface XofTreeEventMap extends HTMLElementEventMap, XofTreeElementEventMap {}
