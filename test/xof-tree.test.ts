import { html, fixture, expect } from '@open-wc/testing';

import type { XofTree } from '../src/XofTree.js';
import '../xof-tree.js';

import * as JSON from '../test/test-data.js';
import * as JSONSMALL from '../test/test-small-data.js';

describe('XofTree', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el: XofTree = await fixture(html`
      <xof-tree .data=${JSON.default.DATA}></xof-tree>
    `);
    expect(el.title).to.equal('');
    await expect(el).shadowDom.to.be.accessible();
  });
  it('has a default title "Hey there" and counter 5', async () => {
    const el: XofTree = await fixture(html`
      <xof-tree .data=${JSONSMALL.default.DATA}></xof-tree>
    `);
    expect(el.title).to.equal('');
    await expect(el).shadowDom.to.be.accessible();
  });
  /*
  it('increases the counter on button click', async () => {
    const el: XofTree = await fixture(html`
      <xof-tree></xof-tree>
    `);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el: XofTree = await fixture(html`
      <xof-tree title="attribute title"></xof-tree>
    `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el: XofTree = await fixture(html`
      <xof-tree></xof-tree>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });*/
});
