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
            connections: { type: Array },
            selectedConnection: { type: Object },
            fake: { type: Object }
       };
    }

    constructor() {
        super();

        this.connections = [];
        this.selectedConnection = null;
        this.fake = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
            <mwc-list id="list" part="list"
                 @selected="${this._onConnectionSelectedInList}"
           >
                ${!this.connections ? '' : this.connections.map(connection => html`
                <mwc-list-item>
                    <ft-connection-list-item connection=${JSON.stringify(connection)}>
                    </ft-connection-list-item>
                </mwc-list-item>
                `)}
            </mwc-list>
        </div>

        `;
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                overflow: hidden;
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    overscroll-behavior: contain;
                }
                    #list {
                        --mdc-ripple-color: transparent;
                    }
                        mwc-list-item {
                            cursor: default;
                            width: 376px;
                            height: 64px;
                            --mdc-list-side-padding: 0;
                            --mdc-list-vertical-padding: 0;
                        }
                            ft-connection-list-item {
                                padding-left:12px;
                                width: 376px;
                                box-sizing: border-box;
                            }
        `
        ];
    }

    _onConnectionSelectedInList(event) {
        var connection = null;
        const connectionIndex = event.detail.index;
        const haveSelection = (connectionIndex >= 0);
        if (haveSelection)
            connection = this.connections[connectionIndex];
        if (this._connectionChanges(this.selectedConnection, connection))
            this.selectedConnection = connection;
    }

    _connectionChanges(first, second) {
        return (this._valueChanges(first, second, (first, second) => first.id != second.id))
    }

    // TODO: Factor out
    _valueChanges(first, second, test) {

        const firstIsUndefinedOrNull = !first;
        const secondIsUndefinedOrNull = !second;

        const bothAreUndefinedOrNull = (firstIsUndefinedOrNull && secondIsUndefinedOrNull);
        if (bothAreUndefinedOrNull)
            return false;

        const justOneIsUndefinedOrNull = (firstIsUndefinedOrNull || secondIsUndefinedOrNull);
        if (justOneIsUndefinedOrNull)
            return true;

        return test(first, second);
    }

    updated(changedProperties) {
        if (changedProperties.has("selectedConnection"))
            this._onSelectedConnectionChanged();
        if (changedProperties.has("fake"))
            this._onFakeChanged();
    }

    _onSelectedConnectionChanged() {

        // Make sure the list element is selected
        const index = this._indexOfSelectedConnection();
        var list = this.shadowRoot.getElementById("list");
        list.select(index);

        // Notify
        const event = new CustomEvent('selected-connection-changed', { detail: this.selectedConnection, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    _indexOfSelectedConnection() {
        if (this.selectedConnection == null)
            return -1;
        return this.connections.findIndex(connection => connection.id == this.selectedConnection.id);
    }

    _onFakeChanged() {
        if (this.fake)
            this._loadFakeConnections();
    }

    _loadFakeConnections() {
        var path = "/components/ft-connection-list/dev/fake-connections.json";

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

window.customElements.define('ft-connection-list', FtConnectionList);

