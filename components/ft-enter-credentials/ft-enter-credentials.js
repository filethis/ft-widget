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
import '../ft-institution-list-item/ft-institution-list-item.js';

export class FtEnterCredentials extends LitElement {

    static get properties() {
        return {
            institution: { type: Object }
       };
    }

    constructor() {
        super();

        this.institution = {
            "id": 428,
            "name": "Gusto",
            "type": "fina",
            "state": "live",
            "homePageUrl": "https:\/\/app.gusto.com\/login",
            "phone": "(800) 936-0383",
            "logoPath": "logos\/Logo_Gusto.png",
            "logo": "Logo_Gusto.png",
            "logoUrl": "https:\/\/filethis.com\/static\/logos\/72\/Logo_Gusto.png",
            "note": "",
            "info": "",
            "pattern": "",
            "isNew": false,
            "isPopular": true
        };

        // TODO: Figure out how to get the click on the icon...
        // See: https://github.com/material-components/material-components-web/blob/a41c48519f4bdc58d748a26f7aeacd6ea8dc432f/packages/mdc-textfield/icon/component.ts#L53
        //      MDCTextFieldIconFoundation.strings.ICON_EVENT
        //            notifyIconAction: () => this.emit(
        //            MDCTextFieldIconFoundation.strings.ICON_EVENT, {} /* evtData */, true /* shouldBubble */),
        // https://github.com/material-components/material-components-web/blob/master/packages/mdc-textfield/icon/constants.ts
        //      ICON_EVENT: 'MDCTextField:icon'
        this.addEventListener('MDCTextField:icon', this._handleVisibilityClicked.bind(this));
        // this.addEventListener('click', this._handleVisibilityClicked.bind(this));
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
                align-items: center;
            }
            #top {
                position: absolute;
                width: 400px;
                height: 64px;
                left: calc(50% - 400px/2);
                top: 0;
                background-color: ${unsafeCSS(light.Color.Neutral100)};
            }
            #title {
                position: absolute;
                width: 154px;
                height: 24px;
                left: calc(50% - 154px/2);
                top: calc(50% - 24px/2 - 8px);
            }
            #lock-and-private {
                position: absolute;
                height: 16px;
                left: 134.5px;
                right: 134.5px;
                top: calc(50% - 16px/2 + 12px);
            }
            #lock {
                position: static;
                width: 12px;
                height: 16px;
                left: 0px;
                top: 0px;
            }
            #private {
                position: static;
                width: 115px;
                height: 16px;
                left: 16px;
                top: 0px;
            }
            #card {
                position: absolute;
                width: 400px;
                height: 348px;
                left: calc(50% - 400px/2);
                top: 64px;
                background-color: ${unsafeCSS(light.BackgroundColor.Card)};
                border-radius: ${unsafeCSS(light.BorderRadius.Card)};
                /* box-shadow: ${unsafeCSS(light.BoxShadow.Card)}; */
                /* margin: ${unsafeCSS(light.Spacing.CardSidePadding)}; */
                /* margin: 10px; */
                /* border: solid 1px gray; */
            }
            #bottom {
                position: absolute;
                width: 400px;
                height: 64px;
                left: calc(50% - 400px/2);
                top: 412px;
                background-color: ${unsafeCSS(light.Color.Neutral100)};
            }
            #institution {
                position: absolute;
                height: 64px;
                left: 24px;
                right: 24px;
                top: 24px;
            }
            #username-box {
                position: absolute;
                height: 80px;
                left: 24px;
                right: 24px;
                top: 112px;
            }
            #username {
                position: absolute;
                height: 48px;
                left: 0px;
                right: 0px;
                top: 8px;
                --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                --mdc-text-field-outlined-idle-border-color: ${unsafeCSS(light.Color.Neutral600)};
                --mdc-text-field-outlined-hover-border-color: ${unsafeCSS(light.Color.Neutral900)};
                --mdc-text-field-ink-color: ${unsafeCSS(light.Color.Neutral900)};
                --mdc-text-field-label-ink-color: ${unsafeCSS(light.Color.Neutral600)};
            }
            #password-box {
                position: absolute;
                height: 80px;
                left: 24px;
                right: 24px;
                top: 192px;
            }
            #password {
                position: absolute;
                height: 48px;
                left: 0px;
                right: 0px;
                top: 8px;
                --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                --mdc-text-field-outlined-idle-border-color: ${unsafeCSS(light.Color.Neutral600)};
                --mdc-text-field-outlined-hover-border-color: ${unsafeCSS(light.Color.Neutral900)};
                --mdc-text-field-ink-color: ${unsafeCSS(light.Color.Neutral900)};
                --mdc-text-field-label-ink-color: ${unsafeCSS(light.Color.Neutral600)};
            }
            #button {
                position: absolute;
                height: 44px;
                left: 24px;
                right: 24px;
                top: 280px;
                --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                --mdc-theme-on-primary: white;
                --mdc-typography-button-font-size: ${unsafeCSS(light.FontSize.Body)};
                --mdc-typography-button-font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                --mdc-typography-button-line-height: ${unsafeCSS(light.LineHeight.Body)};
                --mdc-typography-button-text-transform: none;
            }

            #go-to-site {
                position: absolute;
                width: 400px;
                height: 64px;
                left: calc(50% - 400px/2);
                top: 469px;
                background-color:green;
            }
        `
        ];
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <div id="top" part="top">
                <div id="title" part="title">
                    Enter Credentials
                </div>
                <div id="lock-and-private" part="lock-and-private">
                    <div id="lock" part="lock">
                        lock
                    </div>
                    <div id="private" part="private">
                        Private and secure
                    </div>
                </div>
            </div>

            <div id="card" part="card">

                <ft-institution-list-item id="institution" part="institution"
                    institution=${JSON.stringify(this.institution)}>
                </ft-institution-list-item>
                
                <div id="username-box" part="username-box">
                    <mwc-textfield id="username" part="username"
                        outlined 
                        label="Username"
                    >
                    </mwc-textfield>
                </div>

                <div id="password-box" part="password-box">
                    <mwc-textfield id="password" part="password"
                        outlined
                        type="password"
                        label="Password" 
                        iconTrailing="visibility"
                    >
                    </mwc-textfield>
                </div>

                <mwc-button id="button" part="button"
                    unelevated
                    label="Connect"
                    @click=${this._onConnectButtonClicked}
                >
                </mwc-button>

            </div>

            <div id="bottom" part="bottom">
                bottom
            </bottom>

            </div>

        `;
    }

    _onConnectButtonClicked(thing) {
    }

    _handleVisibilityClicked(event) {
        console.log(event);
    }

}

window.customElements.define('ft-enter-credentials', FtEnterCredentials);

