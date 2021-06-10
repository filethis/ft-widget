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
import '../ft-document-list/ft-document-list.js';

export class FtViewDocumentsPanel extends LitElement {

    static get properties() {
        return {
            documents: { type: Array },
            documentCount: { type: Number },
            fake: { type: Object }
        };
    }

    constructor() {
        super();
        this.documents = [];
        this.documentCount = 0;
        this.fake = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <div id="header" part="header">
                <div id="title" part="title">
                    Documents
                </div>
                <div id="subtitle" part="subtitle">
                    View delivered documents
                </div>
                <div id="document-count" part="document-count">
                    ${this.documentCount} delivered documents
                </div>
            </div>
        
            <ft-document-list id="ft-document-list" part="ft-document-list"
                documents=${JSON.stringify(this.documents)}
                fake="${this.fake}"
            >
            </ft-document-list>
        
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
                        margin-top: 24px;
                        margin-left: 24px;
                        margin-right: 24px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                    }
                        #title {
                            height: 40px;
                            font-size: ${unsafeCSS(light.FontSize.H1)}px;
                            font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                            line-height: ${unsafeCSS(light.LineHeight.H1)}px;
                            text-align: left;
                            color: ${unsafeCSS(light.Color.Neutral900)};
                        }
                        #subtitle{
                            margin-top: 8px;
                            height: 24px;
                            font-size: ${unsafeCSS(light.FontSize._loadFakeDocuments)}px;
                            line-height: ${unsafeCSS(light.LineHeight._loadFakeDocuments)}px;
                            font-weight: ${unsafeCSS(light.FontWeight.Normal)};
                            color: ${unsafeCSS(light.Color.Neutral900)};
                        }
                        #document-count {
                            margin-top: 23px;
                            height: 16px;
                            font-size: ${unsafeCSS(light.FontSize.Small)}px;
                            font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                            line-height: ${unsafeCSS(light.LineHeight.Small)}px;
                            color: ${unsafeCSS(light.Color.Neutral900)};
                        }
                    #ft-document-list {
                        margin-left: 12px;
                        width: 376px;
                    }
        `
        ];
    }

    enter() {
    }

    exit() {
    }

    updated(changedProperties) {
        if (changedProperties.has('documents'))
            this._onDocumentsChanged();
    }

    _onDocumentsChanged() {
        var count = 0;
        if (!!this.documents)
            count = this.documents.length;
        this.documentCount = count;
    }

}

window.customElements.define('ft-view-documents-panel', FtViewDocumentsPanel);

