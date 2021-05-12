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
import '@material/mwc-button';
export class FtConnectToYourAccount extends LitElement {

    static get properties() {
        return {
        };
    }

    constructor() {
        super();
    }

    _onContinueButtonClicked(thing) {
        alert("yeah");
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                overflow: hidden;
                border: solid 1px gray;
                width: 400px;
                height: 650px;
                padding: 25px;
            }
            #illustration {
                margin-top: 30px;
                width:250px; height:auto;
            }
            #title {
                margin-top:20px;
            }
            #explanation {
                margin-top:20px;
            }
            #details {
                margin-top:20px;
            }
            #balances {
                margin-top:20px;
            }
            #protected {
                margin-top:20px;
            }
            #agree {
                margin-top:20px;
            }
            #button {
                margin-top:20px;
            }
            #powered {
                margin-top:20px;
            }
        `,
            Layouts
        ];
    }

    render() {
        return html`

        <div class="layout vertical center">

            <img id="illustration" part="illustration" 
                src="../ConnectionIllustrationTemp.png"
            />

            <div id="title" part="title">
                Connect your account
            </div>

            <div id="explanation" part="explanation">
                Dropbox will have access to the information below unless you choose to disconnect:
            </div>

            <div id="details" part="details">
                Account details
            </div>

            <div id="balances" part="balances">
                Account balances and transactions
            </div>

            <div id="protected" part="protected">
                Your information is protected securely.
            </div>

            <div id="agree" part="agree">
                By clicking Continue, you agree to the MX Privacy Policy.
            </div>

            <mwc-button id="button" part="button" 
                outlined label="Continue"
                part="button"
                @click=${this._onContinueButtonClicked}
                >
            </mwc-button>

            <div id="powered" part="powered">
                Data access powered by MX
            </div>

        </div>

        `;
    }
}

window.customElements.define('ft-connect-to-your-account', FtConnectToYourAccount);

