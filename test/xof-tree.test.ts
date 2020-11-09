import { html, fixture, expect } from '@open-wc/testing';

import {XofTree} from '../src/XofTree.js';
import '../xof-tree.js';
/*
describe('XofTree', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el: XofTree = await fixture(html`
      <xof-tree></xof-tree>
    `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

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
  });
});
*/