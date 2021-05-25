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
import '@material/mwc-icon-button';
import { light } from "../../mx-design-tokens/index.js";

export class FtLabeledIconButton extends LitElement {

    static get properties() {
        return {
            label: { type: String }
        }
    }

    constructor() {
        super();
        this.label = "Hello";
    }

    render() {
        return html`
            <mwc-icon-button id="icon-button"
                icon="code"
                label="foo"
            >
                <div id="label">
                    ${this.label}
                </div>
            </mwc-icon-button>
    `;
    }

    static get styles() {
        return css`
            :host {
                overflow: hidden;
                background-color: white;
                border: solid 1px gray;
                border-radius: 8px;
            }
            :host([disabled]) {
                pointer-events: none;
            }
            #icon-button {
                height: 45px;
                --mdc-icon-size: 20px;
            }
                #label {
                    position: absolute;
                    top: 10px;
                    font-family:Arial;
                    font-size: 8pt;
                    text-transform:none;
                }
        `;
    }

}

window.customElements.define('ft-labeled-icon-button', FtLabeledIconButton);
