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
import { light } from "../../styling/index.js";
import '../../components/ft-institution/ft-institution.js';


export class FtInstitutionList extends LitElement {

    static get properties() {
        return {
            institutions: { type: Array }
       };
    }

    constructor() {
        super();

        this.institutions = ["Bank of America", "Wells Fargo", "American Express"];
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
            }

        `
        ];
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
            ${this.institutions.map(item => html`
                <ft-institution institution=${item}></ft-institution>
            `)}
        </div>

        `;
    }
}

window.customElements.define('ft-institution-list', FtInstitutionList);

