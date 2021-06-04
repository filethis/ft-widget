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
import '@material/mwc-icon';
import '@material/mwc-icon-button';
import { light } from "../../mx-design-tokens/index.js";

export class FtConnectionListItem extends LitElement {

    static get properties() {
        return {
            connection: { type: Object },
            _message: { type: String },
            demo: { type: Object }
       };
    }

    constructor() {
        super();

        this.connection = {};
        this._message = "Message here";
        this.demo = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <div id="logo" part="logo" on-tap="_onSourceClicked">
                <img id="logo-image" part="logo-image" src="${!this.connection ? '' : this.connection.logoUrl}">
            </div>

            <div id="text-and-buttons" part="text-and-buttons">

                <div id="text" part="text">
            
                    <div id="name" part="name">
                        ${!this.connection ? '' : this.connection.name}
                    </div>
            
                    <div id="message" part="message">
                        ${this._message}
                    </div>
            
                </div>

                <mwc-icon id="emblem" part="emblem">
                    error_outline
                </mwc-icon>

                <mwc-icon-button id="edit-button" part="edit-button"
                    icon="chevron_right"
                    @click=${this._onEditButtonClicked}
                >
                </mwc-icon-button>

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
                font-family: ${unsafeCSS(light.Font.Regular)};
                width: 376px;
                height: 64px;
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    padding-left:12px;
                    padding-right:12px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: stretch;
                }
                    #logo {
                        width: 100px;
                        height: 50px;
                        min-width: 100px;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                    }
                        #logo-image {
                            width:auto;
                            max-width:100%;
                        }
                    #text-and-buttons {
                        flex: 1;
                        margin-left: 12px;
                        min-width: 0;  /* Override flex default of "auto" which prevents shrinking past content */
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                        border-bottom: solid 1px ${unsafeCSS(light.Color.Neutral300)};
                    }
                        #text {
                            flex: 1;
                            min-width: 0;  /* Override flex default of "auto" which prevents shrinking past content */
                            margin-right: 12px;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: stretch;
                        }
                            #name {
                                font-size: ${unsafeCSS(light.FontSize.Body)}px;
                                font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                                line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            #message {
                                font-size: ${unsafeCSS(light.FontSize.Small)}px;
                                line-height: ${unsafeCSS(light.LineHeight.Small)}px;
                                color: ${unsafeCSS(light.Color.Neutral700)};
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        #emblem {
                            display: none;
                            color: ${unsafeCSS(light.Color.Error300)};
                        }
                        #edit-button {
                        }
        `
        ];
    }

    updated(changedProperties) {
        if (changedProperties.has("demo"))
            this._onDemoChanged();
    }

    _onEditButtonClicked() {
        this.shadowRoot.getElementById("edit-button").blur();
        
        const event = new CustomEvent('edit-connection-button-clicked', { detail: this.connection, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    _onDemoChanged() {
        if (this.demo)
            this._loadFakeConnection();
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

window.customElements.define('ft-connection-list-item', FtConnectionListItem);

