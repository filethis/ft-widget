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

// Figma design: https://www.figma.com/file/S6a4nOaB1T3zhe3HmyRzkt/FileThis?node-id=109%3A628


import { LitElement, html, css, unsafeCSS } from 'lit';
import '@material/mwc-textfield';
import { light } from "../../mx-design-tokens/index.js";


export class FtFixture extends LitElement {

    static get properties() {
        return {
            apiKey: { type: String },
            apiSecret: { type: String },
            accountId: { type: String },
            userAccessToken: { type: String }
        };
    }

    constructor() {
        super();

        this.apiKey = "";
        this.apiSecret = "";
        this.accountId = "";
        this.userAccessToken = "";
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <mwc-textfield id="api-key" part="api-key"
                outlined
                type="password"
                label="API Key"
                iconTrailing="visibility"
            >
            </mwc-textfield>

            <mwc-textfield id="api-secret" part="api-secret"
                outlined 
                type="password"
                label="API Secret"
                iconTrailing="visibility"
            >
            </mwc-textfield>

            <mwc-textfield id="account-id" part="account-id"
                outlined 
                label="Account ID"
            >
            </mwc-textfield>

            <mwc-textfield id="user-access-token" part="user-access-token"
                outlined 
                type="password"
                label="User Access Token"
                iconTrailing="visibility"
            >
            </mwc-textfield>

            <mwc-button id="button" part="button"
                unelevated 
                label="Continue" 
                @click=${this._onContinueButtonClicked}
            >
            </mwc-button>

        </div>

        `;
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                overflow: hidden;
                width: 400px;
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start
                }
                #button {
                }
        `
        ];
    }

    _onContinueButtonClicked()
    {
    }

}

window.customElements.define('ft-fixture', FtFixture);

