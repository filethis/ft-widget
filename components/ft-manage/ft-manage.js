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

// Figma design: https://www.figma.com/file/S6a4nOaB1T3zhe3HmyRzkt/FileThis?node-id=109%3A628


import { LitElement, html, css, unsafeCSS } from 'lit';
import { light } from "../../mx-design-tokens/index.js";
import { FtClientMixin } from '../ft-client-mixin/ft-client-mixin.js';
import '../ft-connection-list/ft-connection-list.js'


export class FtManage extends FtClientMixin(LitElement) {



    constructor() {
        super();

        this.live = false;

        this.selectedConnection = null;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
            <ft-connection-list id="ft-connection-list" part="ft-connection-list"
                connections=${JSON.stringify(this.connections)}></ft-connection-list>
                </ft-connection-list>
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
                }
        `
        ];
    }

}

window.customElements.define('ft-manage', FtManage);

