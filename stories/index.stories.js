import {
  html,
  withKnobs,
  withWebComponentsKnobs,
} from '@open-wc/demoing-storybook';
import '../dist/xof-tree.js';
import '../dist/xof-tree-item.js';

export default {
  title: 'XofTree',
  component: 'xof-tree',
  decorators: [withKnobs, withWebComponentsKnobs],
  includeStories: ['SimpleStory', 'MultiSelectStory'],
  options: { selectedPanel: 'storybookjs/knobs/panel' },
};

const items = [
  {
    itemdata: 'Branch1',
    expanded: true,
    children: [
      {
        itemdata: 'Branch1.1',
        children: [
          {
            itemdata: 'Leaf1.1.1',
          },
          {
            itemdata: 'Leaf1.1.2',
          },
        ],
      },
      {
        itemdata: 'Branch1.2',
        children: [
          {
            itemdata: 'Leaf1.2.1',
          },
          {
            itemdata: 'Leaf1.2.2',
          },
        ],
      },
    ],
  },
];
export const SimpleStory = () => html`
  <xof-tree title="Hello World" .data=${items}></xof-tree>
`;

export const MultiSelectStory = () => html`
  <xof-tree title="Hello World" .data=${items} multiselect="true"></xof-tree>
`;
