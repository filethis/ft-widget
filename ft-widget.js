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
import './components/ft-manage-connections/ft-manage-connections.js';
import './components/ft-connect/ft-connect.js';
import './components/ft-manage/ft-manage.js';
import './components/ft-challenge/ft-challenge.js';
import './ft-component-panel.js';
import { light } from "./mx-design-tokens/index.js";

export class FtWidget extends LitElement {

    static get properties()
    { 
        return {
            institutions: { type: Array },
            connections: { type: Array }
        }
    }

    constructor()
    {
        super();

        // this.institutions = [];
        // this.connections = [];

        this._loadFakeInstitutions();
        this._loadFakeConnections();
    }

    render()
    {
        return html`
            <ft-component-panel name="ft-connect">
                <ft-connect
                    id="ft-connect"
                    class="screen" 
                    slot="component"
                >
                </ft-connect>
            </ft-component-panel> 

            <ft-component-panel name="ft-manage">
                <ft-manage
                    id="ft-manage"
                    class="screen" 
                    slot="component"
                >
                </ft-manage>
            </ft-component-panel> 

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
                    institutions=${JSON.stringify(this.institutions)}
                >
                </ft-select-your-institution>
            </ft-component-panel>

            <ft-component-panel name="ft-connect-to-your-account">
                <ft-enter-credentials 
                    id="ft-enter-credentials"
                    class="floating"
                    slot="component"
                >
                </ft-enter-credentials>
            </ft-component-panel>

            <ft-component-panel name="ft-manage-connections">
                <ft-manage-connections
                    id="ft-manage-connections"
                    class="screen"
                    slot="component"
                    connections=${JSON.stringify(this.connections)}
                >
                </ft-manage-connections>
            </ft-component-panel>

        `;
    }

    static get styles() {
        return [
            super.styles || [],
            css`
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
                margin-top: 50px;
            }
            .screen {
                background: #FFFFFF;
                border: solid 1px gray;
                box-shadow: 0px 6px 12px rgba(87, 102, 117, 0.14), 0px 3px 8px rgba(87, 102, 117, 0.06);
                border-radius: 8px;
            }
            /* .floating {
                border: solid 1px gray;
                border-radius: 8px;
            } */
            /* #ft-connect-to-your-account::part(title) {
                background-color: red;
            } */
        `];
    }

    _loadFakeInstitutions() {
        var path = "./assets/ft-fake-institutions.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200) {
                var institutions = JSON.parse(request.responseText);
                this.institutions = institutions;
            }
        }.bind(this);
        request.send();
    }

    _loadFakeConnections() {
        var path = "./assets/ft-fake-connections.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200) {
                var connections = JSON.parse(request.responseText);
                this.connections = connections;
            }
        }.bind(this);
        request.send();
    }

}

window.customElements.define('ft-widget', FtWidget);
