```js script
import { html, withKnobs, withWebComponentsKnobs  } from '@open-wc/demoing-storybook';
import '../dist/xof-tree.js';

export default {
  title: 'XofTree',
  component: 'xof-tree',
  decorators: [withKnobs, withWebComponentsKnobs],
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
import 'xof-tree/xof-tree-item.js';
```

```js preview-story
export const Simple = () => html`
  <xof-tree></xof-tree>
`;
```
