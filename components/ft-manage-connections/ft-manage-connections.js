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
import '../../components/ft-connection-list/ft-connection-list.js';

export class FtManageConnections extends LitElement {

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
                width: 400px;
                height: 650px;
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
            #wrapper {
                position:relative;
                width: 100%; height: 100%;
            }
            #header{
                position: absolute;
                width: 400px;
                height: 104px;
                left: 0px;
                top: 0px;
            }
            #title {
                position: absolute;
                height: 32px;
                left: 24px;
                right: 24px;
                top: 64px;
                font-size: ${unsafeCSS(light.FontSize.H2)}px;
                font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                line-height: ${unsafeCSS(light.LineHeight.H2)}px;
                text-align: center;
                color: ${unsafeCSS(light.Color.Neutral900)};
            }
            #search {
                position: absolute;
                height: 44px;
                left: 24px;
                right: 24px;
                top: 114px;
                --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                --mdc-text-field-outlined-idle-border-color: ${unsafeCSS(light.Color.Neutral600)};
                --mdc-text-field-outlined-hover-border-color: ${unsafeCSS(light.Color.Neutral900)};
                --mdc-text-field-ink-color: ${unsafeCSS(light.Color.Neutral900)};
                --mdc-text-field-label-ink-color: ${unsafeCSS(light.Color.Neutral600)};
            }
            #ft-connection-list {
                position: absolute;
                width: 376px;
                height: 431px;
                left: 12px;
                top: 174px;
                /* border: solid 1px gray; */
            }
            #add {
            }
        `
        ];
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <div id="header" part="header">
                <div id="title" part="title">
                    Select your connection
                </div>
            </div>
        
            <mwc-textfield id="search" part="search" outlined label="Search" icon="search">
            </mwc-textfield>
        
            <ft-connection-list id="ft-connection-list" part="ft-connection-list">
            </ft-connection-list>
        
        </div>

        `;
    }
}

window.customElements.define('ft-manage-connections', FtManageConnections);

