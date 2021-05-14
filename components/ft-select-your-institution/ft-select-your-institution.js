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
import { Layouts } from 'lit-flexbox-literals';
import { light } from "../../styling/index.js";

export class FtSelectYourInstitution extends LitElement {

    static get properties() {
        return {
        };
    }

    constructor() {
        super();
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                overflow: hidden;
                border: solid 1px gray;
                width: 400px;
                height: 650px;
                padding: 25px;
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
            #title {
                margin-top:20px;
                /* background-color: ${unsafeCSS(light.BackgroundColor.ButtonDestructive)}; */
            }
            #search {
                margin-top:20px;
            }
            #content {
                margin-top:20px;
            }
            #add {
                margin-top:20px;
            }
        `,
            Layouts
        ];
    }

    render() {
        return html`

        <div class="layout vertical center">

            <div id="title" part="title">
                Select your institution
            </div>

            <div id="search" part="search">
                Search
            </div>

            <div id="content" part="content">
                Content
            </div>

            <div id="add" part="add">
                Add company manually
            </div>

        </div>

        `;
    }
}

window.customElements.define('ft-select-your-institution', FtSelectYourInstitution);

