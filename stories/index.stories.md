```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/xof-tree.js';

export default {
  title: 'XofTree',
  component: 'xof-tree',
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

# XofTree

A component for...

## Features:

- a
- b
- ...

## How to use

### Installation

```bash
yarn add xof-tree
```

```js
import 'xof-tree/xof-tree.js';
```

```js preview-story
export const Simple = () => html`
  <xof-tree></xof-tree>
`;
```

## Variations

###### Custom Title

```js preview-story
export const CustomTitle = () => html`
  <xof-tree title="Hello World"></xof-tree>
`;
```
