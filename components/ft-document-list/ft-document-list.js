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

// List documentation: https://github.com/material-components/material-components-web-components/tree/master/packages/list


import { LitElement, html, css, unsafeCSS } from 'lit';
import { light } from "../../mx-design-tokens/index.js";
import '@material/mwc-list';
import '../ft-document-list-item/ft-document-list-item.js';


export class FtDocumentList extends LitElement {

    static get properties() {
        return {
            documents: { type: Array },
            selectedDocument: { type: Object },
            fake: { type: Object }
       };
    }

    constructor() {
        super();

        this.documents = [];
        this.selectedDocument = null;
        this.fake = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
            <mwc-list id="list" part="list"
                 @selected="${this._onDocumentSelectedInList}"
           >
                ${!this.documents ? '' : this.documents.map(document => html`
                <mwc-list-item>
                    <ft-document-list-item
                        document=${JSON.stringify(document)}
                    >
                    </ft-document-list-item>
                </mwc-list-item>
                `)}
            </mwc-list>
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
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    overscroll-behavior: contain;
                }
                    mwc-list {
                        --mdc-ripple-color: transparent;
                    }
                        mwc-list-item {
                            cursor: default;
                            width: 376px;
                            height: 130px;
                            --mdc-list-side-padding: 0;
                            --mdc-list-vertical-padding: 0;
                        }
                            ft-document-list-item {
                                padding-left:12px;
                                padding-right:12px;
                                box-sizing: border-box;
                            }
        `
        ];
    }

    _onDocumentSelectedInList(event) {
        var document = null;
        const documentIndex = event.detail.index;
        const haveSelection = (documentIndex >= 0);
        if (haveSelection)
            document = this.documents[documentIndex];
        if (this._documentChanges(this.selectedDocument, document))
            this.selectedDocument = document;
    }

    _documentChanges(first, second) {
        return (this._valueChanges(first, second, (first, second) => first.id != second.id))
    }

    // TODO: Factor out
    _valueChanges(first, second, test) {

        const firstIsUndefinedOrNull = !first;
        const secondIsUndefinedOrNull = !second;

        const bothAreUndefinedOrNull = (firstIsUndefinedOrNull && secondIsUndefinedOrNull);
        if (bothAreUndefinedOrNull)
            return false;

        const justOneIsUndefinedOrNull = (firstIsUndefinedOrNull || secondIsUndefinedOrNull);
        if (justOneIsUndefinedOrNull)
            return true;

        return test(first, second);
    }

    updated(changedProperties) {
        if (changedProperties.has("selectedDocument"))
            this._onSelectedDocumentChanged();
        if (changedProperties.has("fake"))
            this._onFakeChanged();
        if (changedProperties.has('documents'))
            this._onDocumentsChanged();
    }

    _onDocumentsChanged() {
        var foo = "bar";
    }

    _onSelectedDocumentChanged() {

        // Make sure the list element is selected
        const index = this._indexOfSelectedDocument();
        var list = this.shadowRoot.getElementById("list");
        list.select(index);

        // Notify
        const event = new CustomEvent('selected-document-changed', { detail: this.selectedDocument, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    _indexOfSelectedDocument() {
        if (this.selectedDocument == null)
            return -1;
        return this.documents.findIndex(document => document.id == this.selectedDocument.id);
    }

    _onFakeChanged() {
        if (this.fake)
            this._loadFakeDocuments();
    }

    _loadFakeDocuments() {
        var path = "/components/ft-document-list/dev/fake-documents.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200) {
                var documents = JSON.parse(request.responseText);
                this.documents = documents;
            }
        }.bind(this);
        request.send();
    }

}

window.customElements.define('ft-document-list', FtDocumentList);

