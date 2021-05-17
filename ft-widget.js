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
import './ft-component-panel.js';
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
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      ft-component-panel {
        margin-top: 45px;
      }
      .screen {
        background: #FFFFFF;
        border: solid 1px gray;
        box-shadow: 0px 6px 12px rgba(87, 102, 117, 0.14), 0px 3px 8px rgba(87, 102, 117, 0.06);
        border-radius: 8px;
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
        <ft-component-panel name="ft-connect-to-your-account">
          <ft-connect-to-your-account
            id="ft-connect-to-your-account" 
            class="screen" 
            slot="component"
          >
          </ft-connect-to-your-account>
        </ft-component-panel>

        <ft-component-panel name="ft-select-your-institution">
          <ft-select-your-institution
            id="ft-select-your-institution"
            class="screen" 
            slot="component"
          >
          </ft-select-your-institution>
        </ft-component-panel>

        <ft-component-panel name="ft-connect-to-your-account">
          <ft-enter-credentials 
            id="ft-enter-credentials"
            slot="component"
          >
          </ft-enter-credentials>
        
        </ft-component-panel>
    `;
  }
}

window.customElements.define('ft-widget', FtWidget);
