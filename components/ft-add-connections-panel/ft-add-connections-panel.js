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

export class FtAddConnectionsPanel extends LitElement {

    static get properties() {
        return {
            companyLogoUrl: { type: String }
       };
    }

    constructor() {
        super();

        this.companyLogoUrl = null;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <img id="illustration" part="illustration" src="https://connect.filethis.com/ft-add-connections-panel/1.0.14/component/assets/illustration.png" />
        
            <div id="title" part="title">
                Connect your account
            </div>

            <slot id="description" name="description">
                <div id="description-body"  part="description-body">
                    <div id="explanation" part="explanation" class="body">
                            We will have access to your tax documents until you choose to disconnect.
                    </div>
                    
                    <div id="details" part="details">
                        <div id="details-bullet" part="details-bullet" class="bullet"></div>
                    
                        <div id="details-text" part="details-text" class="body">
                            Account details
                        </div>
                    </div>
                            
                    <div id="balances" part="balances">
                        <div id="balances-bullet" part="balances-bullet" class="bullet"></div>
                    
                        <div id="balances-text" part="balances-text" class="body">
                            Account balances and transactions
                        </div>
                    </div>

                    <div id="lock-and-protected" name="lock-and-protected">
                        <img id="lock" part="lock"
                            src="https://connect.filethis.com/ft-add-connections-panel/1.0.14/component/assets/lock.png"
                        />
                    
                        <div id="protected" part="protected" class="body">
                            Your information is protected securely.
                        </div>
                    </div>
                </div>
            </slot>
        
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
                    src="https://connect.filethis.com/ft-add-connections-panel/1.0.14/component/assets/mx-logo.png"
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
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                }
                    #illustration {
                        margin-top: 64px;
                        width: 240px;
                        height: auto;
                    }
                    #title {
                        margin-left: 24px;
                        margin-right: 24px;
                        height: 32px;
                        font-size: ${unsafeCSS(light.FontSize.H2)}px;
                        font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                        line-height: ${unsafeCSS(light.LineHeight.H2)}px;
                        text-align: center;
                        color: ${unsafeCSS(light.Color.Neutral900)};
                    }
                    #description {
                    }
                        #description-body {
                            margin-left: 24px;
                            margin-right: 24px;
                            margin-top: 10px;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: flex-start;
                        }
                            #explanation {
                                height: 45px;
                            }
                            #details {
                                display: flex;
                                flex-direction: row;
                                justify-content: flex-start;
                                align-items: center;
                            }
                                #details-bullet {
                                    margin-left: 6px;
                                    margin-top: 5px;
                                    width: 4px;
                                    height: 4px;
                                }
                                #details-text {
                                    margin-left: 10px;
                                    margin-top: 10px;
                                    height: 20px;
                                }
                            #balances {
                                display: flex;
                                flex-direction: row;
                                justify-content: flex-start;
                                align-items: center;
                            }
                                #balances-bullet {
                                    margin-left: 6px;
                                    margin-top: 5px;
                                    width: 4px;
                                    height: 4px;
                                }
                                #balances-text {
                                    margin-left: 10px;
                                    margin-top: 10px;
                                    height: 20px;
                                }
                                #lock-and-protected {
                                    margin-top: 10px;
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start;
                                    align-items: center;
                                }
                                    #lock {
                                        width: 16px;
                                        height: 16px;
                                    }
                                    #protected {
                                        margin-top: 5px;
                                        margin-left: 5px;
                                    }
                            div.bullet {
                                background: ${unsafeCSS(light.Color.Neutral900)};
                                border-radius: 50%;
                            }
                    #agree {
                        margin-left: 24px;
                        margin-right: 24px;
                        margin-top: 40px;
                        height: 16px;
                        text-align: center;
                        font-size: ${unsafeCSS(light.FontSize.XSmall)}px;
                        line-height: ${unsafeCSS(light.LineHeight.XSmall)}px;
                        color: ${unsafeCSS(light.Color.Neutral700)};
                    }
                    #button {
                        margin-left: 24px;
                        margin-right: 24px;
                        margin-top: 15px;
                        align-self: stretch;
                        height: 44px;
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                        --mdc-theme-on-primary: white;
                        --mdc-typography-button-font-size: ${unsafeCSS(light.FontSize.Body)}px;
                        --mdc-typography-button-font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                        --mdc-typography-button-line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                        --mdc-typography-button-text-transform: none;
                    }
                    #powered-and-logo {
                        margin-top: 10px;
                        margin-left: 24px;
                        margin-right: 24px;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                    }
                        #powered {
                            width: 154px;
                            height: 16px;
                            left: 0px;
                            top: 0px;
                            font-size: ${unsafeCSS(light.FontSize.Small)}px;
                            line-height: ${unsafeCSS(light.LineHeight.Small)}px;
                            color: ${unsafeCSS(light.Color.Neutral600)};
                        }
                        #logo {
                            width: 25px;
                            height: 12px;
                            right: 1px;
                            top: 1px;
                        }
        `
        ];
    }

    enter() {
    }

    exit() {
    }

    _onContinueButtonClicked()
    {
        const event = new CustomEvent('connect-continue-button-clicked', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

}

window.customElements.define('ft-add-connections-panel', FtAddConnectionsPanel);

