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

// Figma design: https://www.figma.com/file/S6a4nOaB1T3zhe3HmyRzkt/FileThis?node-id=109%3A628


import { LitElement, html, css, unsafeCSS } from 'lit';
import { light } from "../../mx-design-tokens/index.js";
import '@material/mwc-button';

export class FtConnectToYourAccount extends LitElement {

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <img id="illustration" part="illustration" src="./components/ft-connect-to-your-account/assets/illustration.png" />
        
            <div id="title" part="title">
                Connect your account
            </div>
        
            <div id="explanation" part="explanation" class="body">
                Dropbox will have access to the information below unless you choose to disconnect:
            </div>
        
            <div id="bullet1" part="bullet1" class="bullet"></div>
        
            <div id="details" part="details" class="body">
                Account details
            </div>
        
            <div id="bullet2" part="bullet2" class="bullet"></div>
        
            <div id="balances" part="balances" class="body">
                Account balances and transactions
            </div>
        
            <img id="lock" part="lock"
                src="./components/ft-connect-to-your-account/assets/lock.png"
            />
        
            <div id="protected" part="protected" class="body">
                Your information is protected securely.
            </div>
        
            <div id="agree" part="agree">
                By clicking Continue, you agree to the MX Privacy Policy.
            </div>
        
            <mwc-button id="button" part="button"
                unelevated
                label="Continue"
                @click=${this._onContinueButtonClicked}
            >
            </mwc-button>
        
            <div id="powered-and-logo" part="powered-and-logo">
                <div id="powered" part="powered">
                    Data access powered by
                </div>
                <img id="logo" part="logo"
                    src="./components/ft-connect-to-your-account/assets/mx-logo.png"
                />
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
                div.body {
                    font-size: ${unsafeCSS(light.FontSize.Paragraph)}px;
                    line-height: ${unsafeCSS(light.LineHeight.Paragraph)}px;
                    color: ${unsafeCSS(light.Color.Neutral900)};
                }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                }
                    #illustration {
                        position: absolute;
                        width: 240px;
                        height: auto;
                        left: calc(50% - 240px/2 - 1px);
                        top: 64px;
                    }
                    #title {
                        position: absolute;
                        height: 32px;
                        left: 24px;
                        right: 24px;
                        top: 160px;
                        font-size: ${unsafeCSS(light.FontSize.H2)}px;
                        font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                        line-height: ${unsafeCSS(light.LineHeight.H2)}px;
                        text-align: center;
                        color: ${unsafeCSS(light.Color.Neutral900)};
                    }
                    #explanation {
                        position: absolute;
                        height: 48px;
                        left: 24px;
                        right: 24px;
                        top: 208px;
                    }
                    #bullet1 {
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        left: 30px;
                        top: 274px;
                    }
                    #bullet2 {
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        left: 30px;
                        top: 298px;
                    }
                    div.bullet {
                        background: ${unsafeCSS(light.Color.Neutral900)};
                        border-radius: 50%;
                    }
                    #details {
                        position: absolute;
                        height: 24px;
                        left: 48px;
                        right: 24px;
                        top: 264px;
                    }
                    #balances {
                        position: absolute;
                        height: 24px;
                        left: 48px;
                        right: 24px;
                        top: 288px;
                    }
                    #lock {
                        position: absolute;
                        width: 16px;
                        height: 16px;
                        left: 24px;
                        top: 328px;
                    }
                    #protected {
                        position: absolute;
                        height: 24px;
                        left: 48px;
                        right: 16px;
                        top: 324px;
                    }
                    #agree {
                        position: absolute;
                        height: 16px;
                        left: 24px;
                        right: 24px;
                        top: 404px;
                        text-align: center;
                        font-size: ${unsafeCSS(light.FontSize.XSmall)}px;
                        line-height: ${unsafeCSS(light.LineHeight.XSmall)}px;
                        color: ${unsafeCSS(light.Color.Neutral700)};
                    }
                    #button {
                        position: absolute;
                        height: 44px;
                        left: 24px;
                        right: 24px;
                        top: 436px;
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                        --mdc-theme-on-primary: white;
                        --mdc-typography-button-font-size: ${unsafeCSS(light.FontSize.Body)}px;
                        --mdc-typography-button-font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                        --mdc-typography-button-line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                        --mdc-typography-button-text-transform: none;
                    }
                    #powered-and-logo {
                        position: absolute;
                        width: 183px;
                        height: 16px;
                        left: calc(50% - 183px/2 - 0.5px);
                        top: 496px;
                    }
                        #powered {
                            position: absolute;
                            width: 154px;
                            height: 16px;
                            left: 0px;
                            top: 0px;
                            font-size: ${unsafeCSS(light.FontSize.Small)}px;
                            line-height: ${unsafeCSS(light.LineHeight.Small)}px;
                            color: ${unsafeCSS(light.Color.Neutral600)};
                        }
                        #logo {
                            position: absolute;
                            width: 25px;
                            height: 12px;
                            right: 1px;
                            top: 1px;
                        }
        `
        ];
    }

}

window.customElements.define('ft-connect-to-your-account', FtConnectToYourAccount);

