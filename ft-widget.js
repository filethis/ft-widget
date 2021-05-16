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
import './components/ft-enter-credentials/ft-enter-credentials.js';
import './components/ft-challenge/ft-challenge.js';
import { light, dark } from "./mx-design-tokens/index.js";

export class FtWidget extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
        font-family: ${unsafeCSS(light.Font.Regular)};
        background-color: ${unsafeCSS(light.Color.Neutral100)};
      }
      .screen {
        background: #FFFFFF;
        border: solid 1px gray;
        box-shadow: 0px 6px 12px rgba(87, 102, 117, 0.14), 0px 3px 8px rgba(87, 102, 117, 0.06);
        border-radius: 8px;
      }
      #ft-connect-to-your-account {
      }
      #ft-select-your-institution {
      }
      #ft-enter-credentials {
      }
      /* #ft-connect-to-your-account::part(title) {
        background-color: red;
      } */
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
      <h4>&lt;ft-connect-to-your-account&gt;</h4>
      <ft-connect-to-your-account id="ft-connect-to-your-account" class="screen"></ft-connect-to-your-account>

      <h4>&lt;ft-select-your-institution&gt;</h4>
      <ft-select-your-institution id="ft-select-your-institution" class="screen"></ft-select-your-institution>

      <h4>&lt;ft-enter-credentials&gt;</h4>
      <ft-enter-credentials id="ft-enter-credentials"></ft-enter-credentials>

      <!-- <h2>ft-challenge</h2>
      <ft-challenge></ft-challenge> -->
`;
  }
}

window.customElements.define('ft-widget', FtWidget);
