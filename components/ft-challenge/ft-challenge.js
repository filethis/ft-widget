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
import '../ft-private-and-secure/ft-private-and-secure.js';

export class FtChallenge extends LitElement {

    static get properties() {
        return {
            institution: { type: Object },
            version: { type: Object },
            request: { type: Object },
            response: { type: Object },
            demo: { type: Object },
            _widgetMap: { type: Object }
        };
    }

    constructor() {
        super();

        this.institution = null;
        this.version = "2.0.0";
        this.request = null;
        this.response = null;
        this.demo = false;
        this._widgetMap = {};

        // Non-reactive instance variable initialization
        this._requestParser = null;
        this._formGenerator = null;
        this._responseGenerator = null;
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
        
            <mwc-button id="continue-button" part="continue-button"
                unelevated
                label="Continue"
                @click=${this._onContinueButtonClicked}>
            </mwc-button>
        
            <div id="help-box" part="help-box">

                <div id="help-text" part="help-text">
                    Get help
                </div>

                <mwc-icon-button id="help-button" part="help-button"
                    icon="chevron_right"
                    @click=${this._onHelpButtonClicked}
                >
                </mwc-icon-button>

            </div>

            <div id="bottom-divider" part="bottom-divider"></div>
        
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
                        align-items: stretch;
                        height: 56px;
                    }
                        #back-button{
                            margin-left: 5px;
                            margin-top: 4px;
                        }
                    #institution {
                        margin-left: 24px;
                        margin-right: 24px;
                        height: 64px;
                    }
                    #title {
                        margin-left: 24px;
                        margin-right: 24px;
                        margin-top: 20px;
                        height: 32px;
                        font-size: ${unsafeCSS(light.FontSize.H2)}px;
                        font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                        line-height: ${unsafeCSS(light.LineHeight.H2)}px;
                        text-align: left;
                        color: ${unsafeCSS(light.Color.Neutral900)};
                    }
                    #content {
                        margin-left: 24px;
                        margin-right: 24px;
                        margin-top:20px;
                    }
                    #continue-button {
                        margin-left: 24px;
                        margin-right: 24px;
                        margin-top:20px;
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                        --mdc-theme-on-primary: white;
                        --mdc-typography-button-font-size: ${unsafeCSS(light.FontSize.Body)};
                        --mdc-typography-button-font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                        --mdc-typography-button-line-height: ${unsafeCSS(light.LineHeight.Body)};
                        --mdc-typography-button-text-transform: none;
                    }
                    #help-box {
                        margin-top:12px;
                        margin-left: 24px;
                        margin-right: 5px;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                    }
                        #help-text {
                            flex: 1;
                            color: ${unsafeCSS(light.Color.Neutral700)};
                            font-size: ${unsafeCSS(light.FontSize.Body)}px;
                            font-weight: ${unsafeCSS(light.FontWeight.Regular)};
                            line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                        }
                        #help-button {
                            color: ${unsafeCSS(light.Color.Neutral700)};
                        }
                    #bottom-divider {
                        height: 1px;
                        margin-left: 24px;
                        margin-right: 24px;
                        border-top: 1px solid ${unsafeCSS(light.Color.Neutral300)};
                }
                    #private-and-secure {
                        margin-top: 10px;
                    }
        `,
            Layouts
        ];
    }

    enter() {
    }

    _clear()
    {
        this._widgetMap = {};
        this._clearResponse();
    }

    _onVersionChanged(to, from)
    {
        this._clear();
  
        switch (this.version)
        {
            case "1.0.0":
                this._requestParser = new InteractionRequestParser_1_0_0();
                this._formGenerator = new InteractionFormGenerator_1_0_0(this, this.$.form, this._widgetMap, "450px");
                this._responseGenerator = new InteractionResponseGenerator_1_0_0(this._widgetMap);
                break;
  
            case "2.0.0":
                this._requestParser = new InteractionRequestParser_2_0_0();
                this._formGenerator = new InteractionFormGenerator_2_0_0(this, this.$.form, this._widgetMap, "450px");
                this._responseGenerator = new InteractionResponseGenerator_2_0_0(this._widgetMap);
                break;
  
            default:
                throw new IllegalArgumentException("Unknown user interaction schema version: " + this.version);
        }
    }
  
    _onRequestChanged(to, from)
    {
        this._clear();
        this._generateForm();
  
        this.fire('request-changed', this.request);
    }
  
    _onResponseChanged(to, from)
    {
        this.fire('response-changed', this.response);
    }
  
    _clearResponse()
    {
        this.response = null;
    }
  
    _generateForm()
    {
        if (this._formGenerator == null)
            return;
        if (this.request == null)
            this._formGenerator.clear();
        else
            this._requestParser.parse(this.request, this._formGenerator);
    }
  
    /** You may call this at will to generate a partial response from what has been entered into the form, so far */
    generateResponse()
    {
        if (this._responseGenerator == null)
            return;
        this._requestParser.parse(this.request, this._responseGenerator);
        this.response = this._responseGenerator.getResponse();
    }
  
    _onButtonClicked(event)
    {
        // If a submit button was clicked, generate the response, and fire a specific event
        if (event.detail.submit)
        {
            this.generateResponse();
            this.fire('submit-response-command', this.response);
        }
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

