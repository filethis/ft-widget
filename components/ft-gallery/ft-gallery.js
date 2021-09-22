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
import './ft-component-panel.js'
import '../ft-connect/ft-connect.js'
import '../ft-manage-connections/ft-manage-connections.js'
import '../ft-add-connections-panel/ft-add-connections-panel.js'
import '../ft-select-your-institution/ft-select-your-institution.js'
import '../ft-enter-credentials/ft-enter-credentials.js'
import '../ft-connections-panel/ft-connections-panel.js'
import '../ft-challenge/ft-challenge.js'


export class FtGallery extends LitElement {

    static get properties() {
        return {
        };
    }

    constructor() {
        super();

    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <ft-component-panel name="ft-connect">
                <ft-connect
                    id="ft-connect"
                    class="screen" 
                    slot="component"
                >
                </ft-connect>
            </ft-component-panel> 

            <ft-component-panel name="ft-manage-connections">
                <ft-manage-connections
                    id="ft-manage-connections"
                    class="screen" 
                    slot="component"
                >
                </ft-manage-connections>
            </ft-component-panel> 

            <ft-component-panel name="ft-add-connections-panel">
                <ft-add-connections-panel
                    id="ft-add-connections-panel" 
                    class="screen" 
                    slot="component"
                >
                </ft-add-connections-panel>
            </ft-component-panel> 

            <ft-component-panel name="ft-select-your-institution">
                <ft-select-your-institution
                    id="ft-select-your-institution"
                    class="screen" 
                    slot="component"
                    institutions=${JSON.stringify(this.institutions)}
                >
                </ft-select-your-institution>
            </ft-component-panel>

            <ft-component-panel name="ft-add-connections-panel">
                <ft-enter-credentials 
                    id="ft-enter-credentials"
                    class="floating"
                    slot="component"
                >
                </ft-enter-credentials>
            </ft-component-panel>

            <ft-component-panel name="ft-connections-panel">
                <ft-connections-panel
                    id="ft-connections-panel"
                    class="screen"
                    slot="component"
                    connections=${JSON.stringify(this.connections)}
                >
                </ft-connections-panel>
            </ft-component-panel>
        </div>

        `;
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                overflow: hidden;
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                }
                    ft-component-panel {
                        margin-top: 50px;
                    }
            .screen {
                background: #FFFFFF;
                border: solid 1px gray;
                box-shadow: 0px 6px 12px rgba(87, 102, 117, 0.14), 0px 3px 8px rgba(87, 102, 117, 0.06);
                border-radius: 8px;
            }
        `
        ];
    }

}

window.customElements.define('ft-gallery', FtGallery);

