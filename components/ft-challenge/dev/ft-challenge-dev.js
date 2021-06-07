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

export class FtChallengeDev extends LitElement {

    render() {
        return html`
            <div id="wrapper" part="wrapper">
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
        `
        ];
    }
}

window.customElements.define('ft-challenge-dev', FtChallengeDev);

