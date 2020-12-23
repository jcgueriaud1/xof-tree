// TYPES
declare interface TreeItemData {
  itemdata: HasId;
  expanded?: boolean;
  selected?: boolean;
  children?: TreeItemDataArray;
}

declare type TreeItemDataArray = Array<TreeItemData>;

declare interface HasId {
  id: string;
}
