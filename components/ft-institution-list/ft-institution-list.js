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
import '../ft-institution-list-item/ft-institution-list-item.js';


export class FtInstitutionList extends LitElement {

    static get properties() {
        return {
            institutions: { type: Array }
       };
    }

    constructor() {
        super();

        this.institutions = [];
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
            <mwc-list
                @selected="${this._onInstitutionSelected}"
            >
                ${!this.institutions ? '' : this.institutions.map(institution => html`
                    <mwc-list-item>
                        <ft-institution-list-item institution=${JSON.stringify(institution)}>
                        </ft-institution-list-item>
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
                    }
                        mwc-list-item {
                            width: 376px;
                            height: 72px;
                            --mdc-list-side-padding: 0;
                            --mdc-list-vertical-padding: 0;
                        }
        `
        ];
    }

    _onInstitutionSelected(event) {
        const institutionIndex = event.detail.index;
        const institution = this.institutions[institutionIndex];
        const event = new CustomEvent('institution-selected', { detail:institution, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
}

window.customElements.define('ft-institution-list', FtInstitutionList);

