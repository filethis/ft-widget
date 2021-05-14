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
import '../ft-institution-list-item/ft-institution-list-item.js';


export class FtInstitutionList extends LitElement {

    static get properties() {
        return {
            institutions: { type: Array }
       };
    }

    constructor() {
        super();

        // this.institutions = ["Bank of America", "Wells Fargo", "American Express"];
        this.institutions = [{
            "id": 428,
            "name": "Gusto",
            "type": "fina",
            "state": "live",
            "homePageUrl": "https:\/\/app.gusto.com\/login",
            "phone": "(800) 936-0383",
            "logoPath": "logos\/Logo_Gusto.png",
            "logo": "Logo_Gusto.png",
            "logoUrl": "https:\/\/filethis.com\/static\/logos\/72\/Logo_Gusto.png",
            "note": "",
            "info": "",
            "pattern": "",
            "isNew": false,
            "isPopular": true
        },
            {
                "id": 18,
                "name": "PayPal",
                "type": "fina",
                "state": "live",
                "homePageUrl": "https:\/\/www.paypal.com\/us\/",
                "phone": "(877) 672-9725",
                "logoPath": "logos\/Logo_Paypal.png",
                "logo": "Logo_Paypal.png",
                "logoUrl": "https:\/\/filethis.com\/static\/logos\/72\/Logo_Paypal.png",
                "note": "",
                "info": "",
                "pattern": "",
                "isNew": false,
                "isPopular": false
            },
            {
                "id": 400,
                "name": "Silicon Valley Bank",
                "type": "fina",
                "state": "live",
                "homePageUrl": "https:\/\/www.svbconnect.com\/auth\/login\/Login.jsp",
                "phone": "(800) 774-7390",
                "logoPath": "logos\/Logo_SiliconValleyBank.png",
                "logo": "Logo_SiliconValleyBank.png",
                "logoUrl": "https:\/\/filethis.com\/static\/logos\/72\/Logo_SiliconValleyBank.png",
                "note": "",
                "info": "",
                "pattern": "",
                "isNew": false,
                "isPopular": false
            },
            {
                "id": 377,
                "name": "Virgin America Credit Card",
                "type": "fina",
                "state": "live",
                "homePageUrl": "https:\/\/d.comenity.net\/virginamericavisa\/",
                "phone": "(866) 772-5275",
                "logoPath": "logos\/Logo_VirginAmericaCreditCard.png",
                "logo": "Logo_VirginAmericaCreditCard.png",
                "logoUrl": "https:\/\/filethis.com\/static\/logos\/72\/Logo_VirginAmericaCreditCard.png",
                "note": "",
                "info": "",
                "pattern": "",
                "isNew": false,
                "isPopular": false
            }];
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
                padding-left: 13px;
            }

        `
        ];
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
            ${this.institutions.map(institution => html`
                <ft-institution-list-item
                    institution=${JSON.stringify(institution)}>
                </ft-institution-list-item>
            `)}
        </div>

        `;
    }
}

window.customElements.define('ft-institution-list', FtInstitutionList);

