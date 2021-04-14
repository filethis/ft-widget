---
layout: page.11ty.cjs
title: <ft-widget> ⌲ Home
---

# &lt;ft-widget>

`<ft-widget>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<ft-widget>` is just an HTML element. You can it anywhere you can use HTML!

```html
<ft-widget></ft-widget>
```

  </div>
  <div>

<ft-widget></ft-widget>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<ft-widget>` can be configured with attributed in plain HTML.

```html
<ft-widget name="HTML"></ft-widget>
```

  </div>
  <div>

<ft-widget name="HTML"></ft-widget>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<ft-widget>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name="lit-html";

render(html`
  <h2>This is a &lt;ft-widget&gt;</h2>
  <ft-widget .name=${name}></ft-widget>
`, document.body);
```

  </div>
  <div>

<h2>This is a &lt;ft-widget&gt;</h2>
<ft-widget name="lit-html"></ft-widget>

  </div>
</section>
