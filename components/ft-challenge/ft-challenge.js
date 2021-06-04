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

// Figma design:
//  https://www.figma.com/file/S6a4nOaB1T3zhe3HmyRzkt/FileThis?node-id=124%3A3278
//  https://www.figma.com/file/S6a4nOaB1T3zhe3HmyRzkt/FileThis?node-id=124%3A3318
//  https://www.figma.com/file/S6a4nOaB1T3zhe3HmyRzkt/FileThis?node-id=124%3A3189


import { LitElement, html, css, unsafeCSS } from 'lit';
import { Layouts } from 'lit-flexbox-literals';
import { light } from "../../mx-design-tokens/index.js";
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '../../components/ft-institution-list-item/ft-institution-list-item.js';

export class FtChallenge extends LitElement {

    static get properties() {
        return {
            institution: { type: Object },
            demo: { type: Object }
        };
    }

    constructor() {
        super();

        this.institution = null;
        this.demo = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
                
            <div id="header" part="header">
                <mwc-icon-button id="back-button" part="back-button"
                    icon="arrow_back"
                    @click=${this._onBackButtonClicked}
                >
                </mwc-icon-button>
            </div>
    
            <ft-institution-list-item id="institution" part="institution"
                institution=${JSON.stringify(this.institution)}
                demo="${this.demo}"
            >
            </ft-institution-list-item>

            <div id="title" part="title">
                Authenticate
            </div>
                    
            <div id="content" part="content">
                Content
            </div>
        
            <mwc-button id="button" part="button"
                outlined
                label="Continue"
                @click=${this._onContinueButtonClicked}>
            </mwc-button>
        
            <div id="help" part="help">
                Help
            </div>
        
            <div id="thing" part="thing">
                Thing
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
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                        height: 56px;
                    }
                        #back-button{
                            margin-left: 5px;
                            margin-top: 4px;
                        }
                    #title {
                        margin-left: 24px;
                        margin-right: 24px;
                        height: 32px;
                        font-size: ${unsafeCSS(light.FontSize.H2)}px;
                        font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                        line-height: ${unsafeCSS(light.LineHeight.H2)}px;
                        text-align: left;
                        color: ${unsafeCSS(light.Color.Neutral900)};
                    }
                    #content {
                        margin-top:20px;
                    }
                    #button {
                        margin-top:20px;
                    }
                    #help {
                        margin-top:20px;
                    }
                    #thing {
                        margin-top:20px;
                    }
        `,
            Layouts
        ];
    }

    enter() {
    }

    _onBackButtonClicked()
    {
        const event = new CustomEvent('challenge-back-button-clicked', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    _onContinueButtonClicked() {
    }

}

window.customElements.define('ft-challenge', FtChallenge);

