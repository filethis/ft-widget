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
import '@material/mwc-icon';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '../ft-institution-list-item/ft-institution-list-item.js';

export class FtEditConnection extends LitElement {

    static get properties() {
        return {
            connection: { type: Object },
            institution: { type: Object }
       };
    }

    constructor() {
        super();

        this.connection = null;
        this.institution = null;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <div id="header" part="header">
                <mwc-icon-button id="back-button" part="back-button"
                    icon="chevron_left"
                    @click=${this._onBackButtonClicked}
                >
                </mwc-icon-button>
            </div>

            <ft-institution-list-item id="institution" part="institution"
                institution=${JSON.stringify(this.institution)}
            >
            </ft-institution-list-item>

            <div id="site" part="site">
                <div id="check-site" part="check-site">
                    Check or reset your account access
                </div>
                <mwc-icon-button id="bottom-icon" part="bottom-icon"
                    icon="open_in_new"
                    @click=${this._onCheckButtonClicked}
                >
                </mwc-icon-button>
            </div>

            <div id="disconnect-box" part="disconnect-box">
                <div id="disconnect-text" part="disconnect-text">
        
                    <div id="disconnect-title" part="disconnect-title">
                        Disconnect this institution 
                    </div>
                    <div id="disconnect-explanation" part="disconnect-explanation">
                        Stop sharing information
                    </div>
                
                </div>
                
                <mwc-icon-button id="disconnect-button" part="disconnect-button"
                    icon="chevron_right"
                    @click=${this._onDisconnectButtonClicked}
                >
                </mwc-icon-button>

            </div>

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
                #header{
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    height: 56px;
                }
                    #back-button{
                        margin-left: 5px;
                    }
                #institution {
                    margin-left: 24px;
                    margin-right: 24px;
                    height: 64px;
                }
                #site {
                    margin-left: 24px;
                    margin-right: 10px;
                    height: 64px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                }
                    #go-to-site {
                        font-size: ${unsafeCSS(light.FontSize.Body)}px;
                        font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                        line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    #check-site {
                        flex: 1;
                        margin-top: 2px;
                        font-size: ${unsafeCSS(light.FontSize.XSmall)}px;
                        line-height: ${unsafeCSS(light.LineHeight.XSmall)}px;
                        color: ${unsafeCSS(light.Color.Neutral900)};
                    }
                #disconnect-box {
                    margin-left: 24px;
                    margin-right: 10px;
                    height: 64px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                }
                    #disconnect-text {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: stretch;
                    }
                        #disconnect-title {
                            color: ${unsafeCSS(light.Color.Error300)};
                            font-size: ${unsafeCSS(light.FontSize.Body)}px;
                            font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                            line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                        }
                        #disconnect-explanation {
                            margin-top: 6px;
                            color: ${unsafeCSS(light.Color.Error300)};
                            font-size: ${unsafeCSS(light.FontSize.XSmall)}px;
                            line-height: ${unsafeCSS(light.LineHeight.XSmall)}px;
                        }
                    #disconnect-button {
                        }
                #private-and-secure {
                }
        `
        ];
    }

    enter() {
    }

    _onBackButtonClicked() {
        const newEvent = new CustomEvent('edit-connection-back-button-clicked', { bubbles: true, composed: true });
        this.dispatchEvent(newEvent);
    }

    _onCheckButtonClicked() {
        if (!this.connection)
            return;

        this._openUrl(this.connection.homePageUrl);
    }

    _onDisconnectButtonClicked() {
        const newEvent = new CustomEvent('delete-connection-button-clicked', { detail: this.connection, bubbles: true, composed: true });
        this.dispatchEvent(newEvent);
    }
    
    _onConnectButtonClicked()
    {
        var usernameField = this.shadowRoot.querySelector("#username");
        var passwordField = this.shadowRoot.querySelector("#password");
        var payload = {
            connection: this.connection,
            username: usernameField.value,
            password: passwordField.value,
        }

        const connectEvent = new CustomEvent('create-connection-command', { detail: payload, bubbles: true, composed: true });
        this.dispatchEvent(connectEvent);
 
        const continueEvent = new CustomEvent('credentials-continue-button-clicked', { bubbles: true, composed: true });
        this.dispatchEvent(continueEvent);
    }

    _handleVisibilityClicked(event) {
        alert("_handleVisibilityClicked");
    }

    // TODO: Factor out
    _openUrl(url)
    {
        var win = window.open(url, '_blank');
        if (win)
            win.focus();
        else
            alert("Please allow popups for this site");
    }

}

window.customElements.define('ft-edit-connection', FtEditConnection);

