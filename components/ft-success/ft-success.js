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
import '@material/mwc-icon';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '../ft-private-and-secure/ft-private-and-secure.js';

export class FtSuccess extends LitElement {

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
                    
            <div id="title" part="title">
                Success
            </div>

            <div id="message" part="message">
                You have successfully connected ${!this.institution ? '' : this.institution.name}.
            </div>
                        
            <mwc-button id="continue-button" part="continue-button" class="button"
                label="Continue"
                unelevated
                @click=${this._onContinueButtonClicked}
            >
            </mwc-button>

            <ft-private-and-secure id="private-and-secure" part="private-and-secure">
            </ft-private-and-secure>

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
                #title {
                    margin-top: 40px;
                    margin-left: 24px;
                    margin-right: 24px;
                    font-size: ${unsafeCSS(light.FontSize.H3)}px;
                    font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                    line-height: ${unsafeCSS(light.LineHeight.H3)}px;
                    text-align: left;
                    color: ${unsafeCSS(light.Color.Neutral900)};
                }
                #message {
                    margin-top: 12px;
                    margin-left: 24px;
                    margin-right: 24px;
                    color: ${unsafeCSS(light.Color.Neutral900)};
                    font-size: ${unsafeCSS(light.FontSize.Body)}px;
                    font-weight: ${unsafeCSS(light.FontWeight.Regular)};
                    line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                }
                #continue-button {
                    margin-top: 40px;
                    margin-left: 24px;
                    margin-right: 24px;
                    height: 44px;
                    --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                    --mdc-theme-on-primary: white;
                    --mdc-typography-button-font-size: ${unsafeCSS(light.FontSize.Body)};
                    --mdc-typography-button-font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                    --mdc-typography-button-line-height: ${unsafeCSS(light.LineHeight.Body)};
                    --mdc-typography-button-text-transform: none;
                }
                #private-and-secure {
                    margin-top: 7px;
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

    _onContinueButtonClicked() {
        const newEvent = new CustomEvent('success-continue-button-clicked', { bubbles: true, composed: true });
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

window.customElements.define('ft-success', FtSuccess);

