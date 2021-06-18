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

export class FtEditDocumentPanel extends LitElement {

    static get properties() {
        return {
            document: { type: Object },
       };
    }

    constructor() {
        super();

        this.document = null;
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

            <mwc-button id="delete-button" part="delete-button"
                unelevated
                label="Delete"
                @click=${this._onDeleteButtonClicked}
            >
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
                #delete-button {
                    margin-left: 24px;
                    margin-right: 24px;
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

    _onBackButtonClicked() {
        const newEvent = new CustomEvent('edit-document-back-button-clicked', { bubbles: true, composed: true });
        this.dispatchEvent(newEvent);
    }

    _onDeleteButtonClicked() {
        const newEvent = new CustomEvent('delete-document-button-clicked', { detail: this.document, bubbles: true, composed: true });
        this.dispatchEvent(newEvent);
    }

}

window.customElements.define('ft-edit-document-panel', FtEditDocumentPanel);

