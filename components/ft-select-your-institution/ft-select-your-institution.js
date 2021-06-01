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
import { light } from "../../mx-design-tokens/index.js";
import '@material/mwc-textfield';
import '@material/mwc-icon';
import '../../components/ft-institution-list/ft-institution-list.js';

export class FtSelectYourInstitution extends LitElement {

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
        
            <div id="header" part="header">
                <div id="title" part="title">
                    Select your institution
                </div>
            </div>
        
            <mwc-textfield id="search" part="search" outlined label="Search" icon="search">
            </mwc-textfield>
        
            <ft-institution-list id="ft-institution-list" part="ft-institution-list"
                institutions=${JSON.stringify(this.institutions)}
            >
            </ft-institution-list>
        
            <div id="footer" part="footer">
                <!-- <div id="add" part="add">
                            Add company manually
                        </div> -->
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
                width: 400px;
                height: 650px;
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                }
                #header{
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    margin-top: 24px;
                    margin-left: 24px;
                    margin-right: 24px;
                }
                    #title {
                        height: 32px;
                        font-size: ${unsafeCSS(light.FontSize.H2)}px;
                        font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                        line-height: ${unsafeCSS(light.LineHeight.H2)}px;
                        text-align: center;
                        color: ${unsafeCSS(light.Color.Neutral900)};
                    }
                #search {
                    --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                    --mdc-text-field-outlined-idle-border-color: ${unsafeCSS(light.Color.Neutral600)};
                    --mdc-text-field-outlined-hover-border-color: ${unsafeCSS(light.Color.Neutral900)};
                    --mdc-text-field-ink-color: ${unsafeCSS(light.Color.Neutral900)};
                    --mdc-text-field-label-ink-color: ${unsafeCSS(light.Color.Neutral600)};
                }
                #ft-institution-list {
                    margin-left: 12px;
                    width: 376px;
                }
                #footer {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    background-color: ${unsafeCSS(light.Color.Neutral100)};
                }
                    #add {
                    }
        `
        ];
    }

}

window.customElements.define('ft-select-your-institution', FtSelectYourInstitution);

