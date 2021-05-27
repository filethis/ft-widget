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
import { light } from "../../mx-design-tokens/index.js";

export class FtComponentPanel extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
                background-color: ${unsafeCSS(light.Color.Neutral100)};
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
            }
            #title {
                font-family: "courier";
                font-size: 12pt;
                font-weight: 600;
                margin-bottom: 25px;
            }
        `;
    }

    static get properties() {
        return {
            name: { type: String }
        }
    }

    constructor() {
        super();
        this.name = "";
    }

    render() {
        return html`
            <div id="title">&lt;${this.name}&gt;</div>

            <slot name="component"></slot>
        `;
    }
}

window.customElements.define('ft-component-panel', FtComponentPanel);
