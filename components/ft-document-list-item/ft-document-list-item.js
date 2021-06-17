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
import '@material/mwc-icon';
import '@material/mwc-icon-button';
import { light } from "../../mx-design-tokens/index.js";

export class FtDocumentListItem extends LitElement {

    static get properties() {
        return {
            document: { type: Object },
            _message: { type: String },
            fake: { type: Object }
       };
    }

    constructor() {
        super();

        this.document = {};
        this._message = "Message here";
        this.fake = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <div id="thumbnail"
            >
                <img id="thumbnail-image"
                    src="${!this.document ? '' : this.document.thumbnailUrl}"
                    alt="Thumbnail"
                >
            </div>

            <div id="text-and-buttons" part="text-and-buttons">

                <div id="text" part="text">
            
                    <div id="name" part="name">
                        ${!this.document ? '' : this.document.name}
                    </div>
            
                    <div id="message" part="message">
                        ${this._message}
                    </div>
            
                </div>
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
                font-family: ${unsafeCSS(light.Font.Regular)};
                width: 376px;
                height: 130px;
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                }
                    #thumbnail {
                        box-shadow: 3px 3px 3px #888888;
                        border:1px solid #DDD;
                    }
                        #thumbnail-image {
                            width: 80px;
                            height: 100px;
                        }
                    #text-and-buttons {
                        flex: 1;
                        margin-left: 16px;
                        min-width: 0;  /* Override flex default of "auto" which prevents shrinking past content */
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                    }
                        #text {
                            flex: 1;
                            min-width: 0;  /* Override flex default of "auto" which prevents shrinking past content */
                            margin-right: 12px;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: stretch;
                        }
                            #name {
                                font-size: ${unsafeCSS(light.FontSize.Body)}px;
                                font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                                line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            #message {
                                font-size: ${unsafeCSS(light.FontSize.Small)}px;
                                line-height: ${unsafeCSS(light.LineHeight.Small)}px;
                                color: ${unsafeCSS(light.Color.Neutral700)};
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
        `
        ];
    }

    updated(changedProperties) {
        if (changedProperties.has("fake"))
            this._onFakeChanged();
        if (changedProperties.has("document"))
            this._onDocumentChanged();
    }

    _onFakeChanged() {
        if (this.fake)
            this._loadFakeDocument();
    }

    _onDocumentChanged() {
        this._message = this.document.deliveredDate;
    }

    _loadFakeDocument() {
        var path = "/components/ft-document-list-item/dev/fake-document.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200) {
                var document = JSON.parse(request.responseText);
                this.document = document;
            }
        }.bind(this);
        request.send();
    }

}

window.customElements.define('ft-document-list-item', FtDocumentListItem);

