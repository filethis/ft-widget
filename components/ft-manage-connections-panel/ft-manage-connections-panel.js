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


import { LitElement, html, css, unsafeCSS } from 'lit';
import { light } from "../../mx-design-tokens/index.js";
import '@material/mwc-textfield';
import '../ft-connection-list/ft-connection-list.js';
import '../ft-private-and-secure/ft-private-and-secure.js';

export class FtManageConnectionsPanel extends LitElement {

    static get properties() {
        return {
            connections: { type: Array },
            _connectionCount: { type: Number },
            fake: { type: Object }
        };
    }

    constructor() {
        super();
        this.connections = [];
        this._connectionCount = 0;
        this.fake = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <div id="header" part="header">
                <div id="title" part="title">
                    Connections
                </div>
                <div id="subtitle" part="subtitle">
                    Manage connected accounts
                </div>
                <div id="connection-count" part="connection-count">
                    ${this._connectionCount} connected institutions
                </div>
            </div>
        
            <ft-connection-list id="ft-connection-list" part="ft-connection-list"
                connections=${JSON.stringify(this.connections)}
                fake="${this.fake}"
            >
            </ft-connection-list>
        
            <div id="footer" part="footer">
                <ft-private-and-secure id="private-and-secure" part="private-and-secure">
                </ft-private-and-secure>
            </div>
        
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
                    #header{
                        margin-top: 24px;
                        margin-left: 24px;
                        margin-right: 24px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                    }
                        #title {
                            height: 40px;
                            font-size: ${unsafeCSS(light.FontSize.H1)}px;
                            font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                            line-height: ${unsafeCSS(light.LineHeight.H1)}px;
                            text-align: left;
                            color: ${unsafeCSS(light.Color.Neutral900)};
                        }
                        #subtitle{
                            margin-top: 8px;
                            height: 24px;
                            font-size: ${unsafeCSS(light.FontSize._loadFakeConnections)}px;
                            line-height: ${unsafeCSS(light.LineHeight._loadFakeConnections)}px;
                            font-weight: ${unsafeCSS(light.FontWeight.Normal)};
                            color: ${unsafeCSS(light.Color.Neutral900)};
                        }
                        #connection-count {
                            margin-top: 23px;
                            height: 16px;
                            font-size: ${unsafeCSS(light.FontSize.Small)}px;
                            font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                            line-height: ${unsafeCSS(light.LineHeight.Small)}px;
                            color: ${unsafeCSS(light.Color.Neutral900)};
                        }
                    #ft-connection-list {
                        margin-left: 12px;
                        width: 376px;
                    }
                    #footer {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: flex-start;
                        background-color: ${unsafeCSS(light.Color.Neutral100)};
                    }
                        #private-and-secure {
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }
        `
        ];
    }

    enter() {
    }

    exit() {
    }

    updated(changedProperties) {
        if (changedProperties.has('connections'))
            this._onConnectionsChanged();
    }

    _onConnectionsChanged() {
        var count = 0;
        if (!!this.connections)
            count = this.connections.length;
        this._connectionCount = count;
    }

}

window.customElements.define('ft-manage-connections-panel', FtManageConnectionsPanel);

