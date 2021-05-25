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
import '@material/mwc-icon-button';
import '../ft-labeled-icon-button/ft-labeled-icon-button.js'


export class FtAccordionItem extends LitElement {

    static get properties() {
        return {
            heading: { type: String },
            isOpen: { type: Boolean }
        };
    }

    constructor() {
        super();

        this.heading = "Untitled";
        this.isOpen = true;
    }

    render() {
        return html`

            <div id="wrapper" part="wrapper">

                <div id="open">
                    <div id="open-header">
                        <div id="open-heading">
                            ${this.heading}
                        </div>
                        <ft-labeled-icon-button id="hide-button"
                            icon="arrow_back"
                            label="Hide"
                            @click="${this._onShowOrHideButtonClicked}"
                        >
                        </ft-labeled-icon-button>
                    </div>
                    <slot name="content"></slot>
                </div>

                <div id="closed">
                    <div id="closed-button-wrapper">
                        <ft-labeled-icon-button id="show-button"
                            icon="arrow_forward"
                            label="Show"
                            @click="${this._onShowOrHideButtonClicked}"
                        >
                        </ft-labeled-icon-button>
                    </div>
                    <div id="closed-heading-wrapper">
                        <span id="closed-heading" class="verticalText">
                            ${this.heading}
                        </span>
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
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                }
                    #open {
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                    }
                        #open-header {
                            height: 60px;
                            border-bottom: 1px solid #DDD;
                            padding-left: 20px;
                            padding-right: 10px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                        }
                            #open-heading {
                                flex: 1;
                                font-size: 16pt;
                            }
                            #hide-button {
                                margin-top: 15px;
                            }
                    #closed {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                        #closed-button-wrapper {
                            height:55px;
                            padding-left: 5px;
                            padding-right: 5px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                        }
                            #show-button {
                                margin-top: 15px;
                            }
                        #closed-heading-wrapper {
                                width:20px;
                                padding-top: 58px;
                                display: flex;
                            }
                                #closed-heading {
                                    font-size: 16pt;
                                }
            .verticalText
            {
                display: block;
                transform: rotate(-90deg);
                -webkit-transform: rotate(-90deg);
                -moz-transform: rotate(-90deg);
                -ms-transform: rotate(-90deg);
                -o-transform: rotate(-90deg);
            }        `
        ];
    }

    _onShowOrHideButtonClicked() {
        this.isOpen = !this.isOpen;
    }

    updated(changedProperties) {
        if (changedProperties.has('isOpen'))
            this._isOpenChanged();
    }

    _isOpenChanged() {
        if (this.isOpen)
            this._open();
        else
            this._close();
    }

    _open() {
        var openElement = this.shadowRoot.querySelector("#open");
        var closedElement = this.shadowRoot.querySelector("#closed");

        openElement.style.display = "flex";
        closedElement.style.display = "none";
    }

    _close() {
        var openElement = this.shadowRoot.querySelector("#open");
        var closedElement = this.shadowRoot.querySelector("#closed");

        openElement.style.display = "none";
        closedElement.style.display = "flex";
    }
}

window.customElements.define('ft-accordion-item', FtAccordionItem);

