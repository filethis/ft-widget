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

// Figma design: https://www.figma.com/file/S6a4nOaB1T3zhe3HmyRzkt/FileThis?node-id=109%3A671

// List documentation: https://github.com/material-components/material-components-web-components/tree/master/packages/list


import { LitElement, html, css, unsafeCSS } from 'lit';
import { light } from "../../mx-design-tokens/index.js";
import '@material/mwc-list';
import '../ft-connection-list-item/ft-connection-list-item.js';


export class FtConnectionList extends LitElement {

    static get properties() {
        return {
            connections: { type: Array }
       };
    }

    constructor() {
        super();

        this.connections = [];

        this._loadFakeConnections();
    } 

    _loadFakeConnections()
    {
        var path = "./components/ft-connection-list/assets/ft-fake-connections.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function()
        {
            if (request.readyState === 4 &&
                request.status === 200)
            {
                var connections = JSON.parse(request.responseText);
                this.connections = connections;
            }
        }.bind(this);
        request.send();
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
                overflow-y: auto;
                overflow-x: hidden;
                overscroll-behavior: contain;
            }
            mwc-list {
            }
            mwc-list-item {
                width: 376px;
                height: 72px;
                --mdc-list-side-padding: 0;
                --mdc-list-vertical-padding: 0;
            }
        `
        ];
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
            <mwc-list>
                ${this.connections.map(connection => html`
                    <mwc-list-item>
                        <ft-connection-list-item connection=${JSON.stringify(connection)}>
                        </ft-connection-list-item>
                    </mwc-list-item>
                `)}
            </mwc-list>
        </div>

        `;
    }
}

window.customElements.define('ft-connection-list', FtConnectionList);

