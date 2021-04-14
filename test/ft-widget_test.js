import {FtWidget} from '../ft-widget.js';
import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('ft-widget', () => {
  test('is defined', () => {
    const el = document.createElement('ft-widget');
    assert.instanceOf(el, FtWidget);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<ft-widget></ft-widget>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('renders with a set name', async () => {
    const el = await fixture(html`<ft-widget name="Test"></ft-widget>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, Test!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('handles a click', async () => {
    const el = await fixture(html`<ft-widget></ft-widget>`);
    const button = el.shadowRoot.querySelector('button');
    button.click();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 1</button>
      <slot></slot>
    `
    );
  });
});
