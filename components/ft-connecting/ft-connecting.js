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
import { light } from "../../mx-design-tokens/index.js";
import '@material/mwc-textfield';
import '@material/mwc-icon';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-circular-progress';
import '../ft-institution-list-item/ft-institution-list-item.js';
import '../ft-private-and-secure/ft-private-and-secure.js';

export class FtConnecting extends LitElement {

    static get properties() {
        return {
            institution: { type: Object },
            connection: { type: Object },
            fake: { type: Object }
       };
    }

    constructor() {
        super();

        this.institution = null;
        this.connection = null;
        this.fake = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <ft-institution-list-item id="institution" part="institution"
                institution=${JSON.stringify(this.institution)}
                fake="${this.fake}"
            >
            </ft-institution-list-item>
            
            <div id="title" part="title">
                Connecting...
            </div>

            <div id="progress-box" part="progress-box">
                <mwc-circular-progress id="progress" part="progress"
                    indeterminate
                >
                </mwc-circular-progress>
            </div>

            <div id="message1" part="message1" class="message">
                Connecting may take some time.
            </div>
            <div id="message2" part="message2" class="message">
                Feel free to add another while you wait,
            </div>
            <div id="message3" part="message3" class="message">
                or check back later.
            </div>
            
            <mwc-button id="another-button" part="another-button" class="button"
                unelevated
                label="Connect another account"
                @click=${this._onAnotherButtonClicked}
            >
            </mwc-button>
            
            <mwc-button id="done-button" part="done-button" class="button"
                label="Done for now"
                outlined
                @click=${this._onDoneButtonClicked}
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
                height: 650px;
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
            #wrapper {
                position:relative;
                width: 100%; height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: stretch;
            }
                #institution {
                    margin-left: 24px;
                    margin-top: 24px;
                    margin-right: 24px;
                    height: 64px;
                }
                #title {
                    margin-top: 20px;
                    margin-left: 24px;
                    margin-right: 24px;
                    font-size: ${unsafeCSS(light.FontSize.H3)}px;
                    font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                    line-height: ${unsafeCSS(light.LineHeight.H3)}px;
                    text-align: left;
                    color: ${unsafeCSS(light.Color.Neutral900)};
                }
                #progress-box {
                    margin-top: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                }
                    #progress {
                        width: 48px;
                        height: 48px;
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                    }
                .message {
                    margin-left: 24px;
                    margin-right: 24px;
                    text-align: center;
                    color: ${unsafeCSS(light.Color.Neutral900)};
                    font-size: ${unsafeCSS(light.FontSize.Body)}px;
                    font-weight: ${unsafeCSS(light.FontWeight.Regular)};
                    line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                }
                #message1 {
                    margin-top: 40px;
                }
                .button {
                    margin-left: 24px;
                    margin-right: 24px;
                    height: 44px;
                    --mdc-typography-button-font-size: ${unsafeCSS(light.FontSize.Body)};
                    --mdc-typography-button-font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                    --mdc-typography-button-line-height: ${unsafeCSS(light.LineHeight.Body)};
                    --mdc-typography-button-text-transform: none;
                }
                #another-button {
                    margin-top: 25px;
                    --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                    --mdc-theme-on-primary: white;
                }
                #done-button {
                    margin-top: 10px;
                    --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                }
        `
        ];
    }

    enter() {
    }

    updated(changedProperties) {
        if (changedProperties.has("fake"))
            this._onFakeChanged();
    }

    _onAnotherButtonClicked() {
        const newEvent = new CustomEvent('connecting-another-button-clicked', { bubbles: true, composed: true });
        this.dispatchEvent(newEvent);
    }

    _onDoneButtonClicked() {
        const newEvent = new CustomEvent('connecting-done-button-clicked', { bubbles: true, composed: true });
        this.dispatchEvent(newEvent);
    }

    _onFakeChanged() {
        if (this.fake)
        {
            this._loadFakeInstitution();
            this._loadFakeConnection();
        }
    }

    _loadFakeInstitution() {
        var path = "/components/ft-institution-list-item/dev/fake-institution.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200) {
                var institution = JSON.parse(request.responseText);
                this.institution = institution;
            }
        }.bind(this);
        request.send();
    }

    _loadFakeConnection() {
        var path = "/components/ft-connection-list-item/dev/fake-connection.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200) {
                var connection = JSON.parse(request.responseText);
                this.connection = connection;
            }
        }.bind(this);
        request.send();
    }

}

window.customElements.define('ft-connecting', FtConnecting);

