import { html, withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';
import '../dist/xof-tree.js';
import '../dist/xof-tree-item.js';

export default {
  title: 'XofTree',
  component: 'xof-tree',
  includeStories: ['SimpleStory', 'MultiSelectStory'],
  options: { selectedPanel: "storybookjs/knobs/panel" },
};



const data = [
  {
    "name": "Branch1",
    "expanded": true,
    "children": [
      {
        "name": "Branch1.1",
        "children": [
        {
          "name": "Leaf1.1.1"
        },
        {
          "name": "Leaf1.1.2"
        }
      ]
      }   ,
      {
        "name": "Branch1.2",
        "children": [
        {
          "name": "Leaf1.2.1"
        },
        {
          "name": "Leaf1.2.2"
        }
      ]
      }
    ]
  }
];
export const SimpleStory = () => html`
  <xof-tree title="Hello World" .data=${data}></xof-tree>
`;

export const MultiSelectStory = () => html`
  <xof-tree title="Hello World" .data=${data} multiselect="true"></xof-tree>
`;