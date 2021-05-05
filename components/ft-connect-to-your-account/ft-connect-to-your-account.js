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

import { LitElement, html, css } from 'lit';
import { Layouts } from 'lit-flexbox-literals';

export class FtConnectToYourAccount extends LitElement {

    static get styles() {
        return [
            css`
            :host {
                display: block;
                border: solid 1px gray;
            }
            `,
            Layouts
        ];
    }

    static get properties() {
        return {
        };
    }

    constructor() {
        super();
    }

    render() {
        return html`

        <style>
            :host {
                display: block;
                overflow: hidden;
            }
        </style>

        <div class="layout vertical center">
            <div>
                Icons
            </div>
            <div>
                Connect your account
            </div>
            <div>
                Dropbox will have access to the information below unless you choose to disconnect:
            </div>
            <div>
                Account details
            </div>
            <div>
                Account balances and transactions
            </div>
            <div>
                Your information is protected securely.
            </div>
            <div>
                By clicking Continue, you agree to the MX Privacy Policy.
            </div>
            <div>
                Continue
            </div>
            <div>
                Data access powered by MX
            </div>
        </div>

        `;
    }
}

window.customElements.define('ft-connect-to-your-account', FtConnectToYourAccount);

