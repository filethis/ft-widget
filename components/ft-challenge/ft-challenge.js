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
import { light } from "../../mx-design-tokens/index.js";
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-radio';
import '@material/mwc-textfield';
import '@material/mwc-formfield';
import '../ft-institution-list-item/ft-institution-list-item.js';
import '../ft-private-and-secure/ft-private-and-secure.js';
import { InteractionFormGenerator_1_0_0 } from './ft-user-interaction-form-generator-1_0_0.js';
import { InteractionFormGenerator_2_0_0 } from './ft-user-interaction-form-generator-2_0_0.js';
import { InteractionRequestParser_1_0_0 } from './ft-user-interaction-request-parser-1_0_0.js';
import { InteractionRequestParser_2_0_0 } from './ft-user-interaction-request-parser-2_0_0.js';
import { InteractionResponseGenerator_1_0_0 } from './ft-user-interaction-response-generator-1_0_0.js';
import { InteractionResponseGenerator_2_0_0 } from './ft-user-interaction-response-generator-2_0_0.js';

export class FtChallenge extends LitElement {

    static get properties() {
        return {
            institution: { type: Object },
            version: { type: Object },
            request: { type: Object },
            response: { type: Object },
            fake: { type: Object },
            _widgetMap: { type: Object }
        };
    }

    constructor() {
        super();

        this.institution = null;
        this.version = "1.0.0";
        this.request = null;
        this.response = null;
        this._widgetMap = {};
        this.fake = false;

        // Non-reactive instance variable initialization
        this._requestParser = null;
        this._responseGenerator = null;
        this._formGenerator = null;
    }

    firstUpdated()
    {
        this.shadowRoot.addEventListener("keyup", this._onKeyUp.bind(this));
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
                
            <div id="form-box" part="form-box">
                <div id="form" part="form"></div>
            </div>
        
            <mwc-button id="continue-button" part="continue-button"
                unelevated
                label="Continue"
                @click=${this._onContinueButtonClicked}>
            </mwc-button>
        
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
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                }
                    #form-box {
                        max-height: 300px;
                        overflow-y: auto;
                        overflow-x: hidden;
                        overscroll-behavior: contain;
                    }
                        #form {
                        }
                    #continue-button {
                        margin-top:20px;
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                        --mdc-theme-on-primary: white;
                        --mdc-typography-button-font-size: ${unsafeCSS(light.FontSize.Body)}px;
                        --mdc-typography-button-font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                        --mdc-typography-button-line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                        --mdc-typography-button-text-transform: none;
                    }
        `
        ];
    }

    enter() {
    }

    exit() {
    }

    _onKeyUp(event) {
        if (event.keyCode === 13)
        {
            event.preventDefault();
            // TODO: Must be enabled
            this.shadowRoot.getElementById("continue-button").click();
        }
    }

    updated(changedProperties) {
        if (changedProperties.has("version"))
            this._onVersionChanged();
        if (changedProperties.has("request"))
            this._onRequestChanged();
        if (changedProperties.has("response"))
            this._onResponseChanged();
        if (changedProperties.has("fake"))
            this._onFakeChanged();
    }

    _clear()
    {
        this._widgetMap = {};
        this._clearResponse();
    }

    _onVersionChanged()
    {
        this._clear();
  
        var form = this.shadowRoot.getElementById("form");

        switch (this.version)
        {
            case "1.0.0":
                this._requestParser = new InteractionRequestParser_1_0_0();
                this._formGenerator = new InteractionFormGenerator_1_0_0(form, this._widgetMap);
                this._responseGenerator = new InteractionResponseGenerator_1_0_0(this._widgetMap);
                break;
  
            case "2.0.0":
                this._requestParser = new InteractionRequestParser_2_0_0();
                this._formGenerator = new InteractionFormGenerator_2_0_0(form, this._widgetMap);
                this._responseGenerator = new InteractionResponseGenerator_2_0_0(this._widgetMap);
                break;
  
            default:
                throw new Error("Unknown user interaction schema version: " + this.version);
        }
    }
  
    _onRequestChanged()
    {
        this._clear();

        if (!this.request)
            return;
            
        this._generateForm();
  
        const event = new CustomEvent('request-changed', { detail: this.request, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
  
    _onResponseChanged()
    {
        const event = new CustomEvent('response-changed', { detail: this.response, bubbles: true, composed: true });
        this.dispatchEvent(event);
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
  
    _onContinueButtonClicked()
    {
        this.generateResponse();

        const event = new CustomEvent('challenge-submit-button-clicked', { detail: this.response, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    _onFakeChanged() {
        if (this.fake)
            this._loadFakeRequest();
    }

    _loadFakeRequest() {
        var path = "/components/ft-challenge/dev/fake-request.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200)
            {
                this.request = JSON.parse(request.responseText);
            }
        }.bind(this);
        request.send();
    }

}

window.customElements.define('ft-challenge', FtChallenge);

