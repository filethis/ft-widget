/*
Copyright 2021 MX Technologies, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { LitElement, html, css, unsafeCSS } from 'lit';
import './components/ft-connect-to-your-account/ft-connect-to-your-account.js';
import './components/ft-select-your-institution/ft-select-your-institution.js';
import './components/ft-challenge/ft-challenge.js';
import { light, dark } from "./styling/index.js";

export class FtWidget extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
      }
      /* #ft-connect-to-your-account::part(title) {
        background-color: red;
      } */

      /* #ft-connect-to-your-account { */
        /* background-color: ${unsafeCSS(light.BackgroundColor.ButtonDestructiveDisabled)}; */
        /* background-color: ${unsafeCSS(light.BackgroundColor.ButtonDestructive)}; */
      /* } */
    `;
  }

  static get properties() { 
    return {}
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <h1>The kitchen sink</h1>

      <h2>ft-connect-to-your-account</h2>
      <ft-connect-to-your-account id="ft-connect-to-your-account" part="foo"></ft-connect-to-your-account>

      <h2>ft-select-your-institution</h2>
      <ft-select-your-institution></ft-select-your-institution>

      <h2>ft-challenge</h2>
      <ft-challenge></ft-challenge>
`;
  }
}

window.customElements.define('ft-widget', FtWidget);
