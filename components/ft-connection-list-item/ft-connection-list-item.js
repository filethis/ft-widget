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
            _message: { type: String }
       };
    }

    constructor() {
        super();

        this.connection = {};
        this._message = "Message here";
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <div id="logo" part="logo" on-tap="_onSourceClicked">
                <img id="logo-image" part="logo-image" src="${!this.connection ? '' : this.connection.logoUrl}">
            </div>
        
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
                height: 72px;
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    padding-left:12px;
                    padding-right:12px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
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
                    #text {
                        flex: 1;
                        height: 36px;
                        top: calc(50% - 36px/2);
                        margin-left: 12px;
                    }
                        #name {
                            position: static;
                            height: 20px;
                            left: 0px;
                            right: 0px;
                            top: calc(50% - 20px/2 - 8px);
                            font-size: ${unsafeCSS(light.FontSize.Body)}px;
                            font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                            line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                            max-width:300px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        #message {
                            position: static;
                            height: 16px;
                            left: 0px;
                            right: 0px;
                            top: calc(50% - 16px/2 + 10px);
                            /* cursor: pointer; */
                            font-size: ${unsafeCSS(light.FontSize.Small)}px;
                            line-height: ${unsafeCSS(light.LineHeight.Small)}px;
                            color: ${unsafeCSS(light.Color.Neutral700)};
                        }
                    #emblem {
                    }
                    #edit-button {
                    }
        `
        ];
    }

    _onEditButtonClicked() {
        const event = new CustomEvent('edit-connection-button-clicked', { detail: this.connection, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

}

window.customElements.define('ft-connection-list-item', FtConnectionListItem);

