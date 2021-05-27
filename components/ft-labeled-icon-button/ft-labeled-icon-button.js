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

import { LitElement, html, css, unsafeCSS } from 'lit';
import '@material/mwc-icon';
import { light } from "../../mx-design-tokens/index.js";

export class FtLabeledIconButton extends LitElement {

    static get properties() {
        return {
            icon: { type: String },
            label: { type: String },
            disabled: { type: Object }
        }
    }

    constructor() {
        super();

        this.icon = "arrow_back";
        this.label = "Hello";
        this.disabled = false;
    }

    render() {
        return html`
            <div id="wrapper" part="wrapper">

                <mwc-icon id="icon" part="icon">${this.icon}</mwc-icon>
                
                <div id="label" part="label">
                    ${this.label}
                </div>
            </div>
    `;
    }

    static get styles() {
        return css`
            :host {
                overflow: hidden;
                background-color: white;
                border: solid 1px gray;
                border-radius: 8px;
                width: 45px;
                height: 45px;
                cursor: pointer;
            }
            :host([disabled]) {
                pointer-events: none;
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    user-select: none;
                }
                #wrapper:active {
                    background-color: lightgray;
                }
                    #icon {
                        margin-top: 3px;
                        color: var(--ft-labeled-icon-button-icon-color);
                    }
                    #label {
                        margin-top: 3px;
                        font-family:Arial;
                        font-size: 8pt;
                        text-transform:none;
                    }
        `;
    }

}

window.customElements.define('ft-labeled-icon-button', FtLabeledIconButton);
