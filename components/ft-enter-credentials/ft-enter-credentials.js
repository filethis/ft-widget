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
import '../ft-private-and-secure/ft-private-and-secure.js';

export class FtEnterCredentials extends LitElement {

    static get properties() {
        return {
            institution: { type: Object }
       };
    }

    constructor() {
        super();

        this.institution = null;
    }

    firstUpdated()
    {
        // TODO: This still doesn't work
        // See: https://lit-element.polymer-project.org/guide/events
        this.shadowRoot.addEventListener('MDCTextField:icon', this._handleVisibilityClicked.bind(this));
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
            
            <div id="title" part="title">
                Enter your credentials
            </div>
            
            <mwc-textfield id="username" part="username"
                outlined
                label="Username"
                >
            </mwc-textfield>
            
            <mwc-textfield id="password" part="password"
                outlined type="password"
                label="Password" 
                iconTrailing="visibility"
            >
            </mwc-textfield>
            
            <mwc-button id="button" part="button"
                unelevated
                label="Continue"
                @click=${this._onConnectButtonClicked}
            >
            </mwc-button>
            
            <div id="bottom" part="bottom">
                <div id="check-site" part="check-site">
                    Check or reset your account access 
                </div>
                <mwc-icon-button id="bottom-icon" part="bottom-icon"
                    icon="open_in_new"
                    @click=${this._onCheckButtonClicked}
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
                    width:353px;
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
                #username {
                    margin-top: 25px;
                    margin-left: 24px;
                    margin-right: 24px;
                    height: 48px;
                    --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                    --mdc-text-field-outlined-idle-border-color: ${unsafeCSS(light.Color.Neutral600)};
                    --mdc-text-field-outlined-hover-border-color: ${unsafeCSS(light.Color.Neutral900)};
                    --mdc-text-field-ink-color: ${unsafeCSS(light.Color.Neutral900)};
                    --mdc-text-field-label-ink-color: ${unsafeCSS(light.Color.Neutral600)};
                }
                #password {
                    margin-top: 30px;
                    margin-left: 24px;
                    margin-right: 24px;
                    height: 48px;
                    --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                    --mdc-text-field-outlined-idle-border-color: ${unsafeCSS(light.Color.Neutral600)};
                    --mdc-text-field-outlined-hover-border-color: ${unsafeCSS(light.Color.Neutral900)};
                    --mdc-text-field-ink-color: ${unsafeCSS(light.Color.Neutral900)};
                    --mdc-text-field-label-ink-color: ${unsafeCSS(light.Color.Neutral600)};
                }
                #button {
                    margin-top: 30px;
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

                #bottom {
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
                #private-and-secure {
                }
        `
        ];
    }

    enter() {
        this.clear();
    }

    clear() {
        var usernameField = this.shadowRoot.querySelector("#username");
        var passwordField = this.shadowRoot.querySelector("#password");
        usernameField.value = "";
        passwordField.value = "";
    }

    _onBackButtonClicked() {
        const newEvent = new CustomEvent('credentials-back-button-clicked', { bubbles: true, composed: true });
        this.dispatchEvent(newEvent);
    }

    _onCheckButtonClicked()
    {
        if (!this.institution)
            return;
        
        this._openUrl(this.institution.homePageUrl);
    }

    _onConnectButtonClicked()
    {
        var usernameField = this.shadowRoot.querySelector("#username");
        var passwordField = this.shadowRoot.querySelector("#password");
        var payload = {
            institution: this.institution,
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

window.customElements.define('ft-enter-credentials', FtEnterCredentials);

