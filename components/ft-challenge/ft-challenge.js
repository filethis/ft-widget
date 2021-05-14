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
import { Layouts } from 'lit-flexbox-literals';
import { light } from "../../styling/index.js";
import '@material/mwc-button';
export class FtChallenge extends LitElement {

    static get properties() {
        return {
        };
    }

    constructor() {
        super();
    }

    _onContinueButtonClicked(thing) {
        alert("yeah");
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                overflow: hidden;
                width: 400px;
                height: 650px;
                padding: 25px;
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
            #logo {
                margin-top: 30px;
                width:250px; height:auto;
            }
            #title {
                margin-top:20px;
            }
            #content {
                margin-top:20px;
            }
            #button {
                margin-top:20px;
            }
            #help {
                margin-top:20px;
            }
            #thing {
                margin-top:20px;
            }
        `,
            Layouts
        ];
    }

    render() {
        return html`

        <div class="layout vertical center">

            <!-- <img id="logo" part="logo"
                src="../Placeholder.png"
            /> -->

            <div id="title" part="title">
                Title
            </div>

            <div id="content" part="content">
                Content
            </div>

            <mwc-button id="button" part="button" 
                outlined label="Continue"
                part="button"
                @click=${this._onContinueButtonClicked}
                >
            </mwc-button>

            <div id="help" part="help">
                Help
            </div>

            <div id="thing" part="thing">
                Thing
           </div>

        </div>

        `;
    }
}

window.customElements.define('ft-challenge', FtChallenge);

