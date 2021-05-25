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
import '@material/mwc-icon-button';


export class FtFormPanel extends LitElement {

    static get properties() {
        return {
            heading: { type: String },
            contentShown: { type: Boolean }
        };
    }

    constructor() {
        super();

        this.heading = "Untitled";
        this.contentShown = true;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <!-- Header -->
            <div id="header">

                <!-- Show/Hide button -->
                <mwc-icon-button id="show-hide-button"
                    icon="clear"
                    label="Hide"
                    @click="${this._onShowOrHideButtonClicked}"
                >
                </mwc-icon-button>
                
                <!-- Heading -->
                <div id="heading">
                    ${this.heading}
                </div>
                
                <!-- Summary slot -->
                <slot id="summary" name="summary"></slot>
                
                <div id="spacer"></div>
                
                <!-- Controls slot -->
                <slot id="controls" name="controls"></slot>
            
            </div>

            <!-- Content -->
            <div id="content-wrapper" class="flex" style="padding-left:35px; " hidden\$="[[!contentShown]]">

                <!-- Content slot -->
                <slot id="content" name="content"></slot>
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
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                }
                    #header {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                    }
                        #show-hide-button {
                        }
                        #heading {
                            font-size: 14pt;
                        }
                        #summary {
                            margin-top: 15px;
                        }
                        #spacer {
                            flex: 1;
                        }
                        #controls {
                        }
                    #content-wrapper {
                        padding-left: 35px;
                        display: flex;
                        flex-direction: column;
                        align-items: stretch
                    }
        `
        ];
    }

    _onShowOrHideButtonClicked()
    {
        this.contentShown = !this.contentShown;
    }

    updated(changedProperties) {
        if (changedProperties.has('contentShown'))
            this._contentShownChanged();
    }

    _contentShownChanged()
    {
        var icon;
        var label;
        if (this.contentShown)
        {
            icon = "clear";
            label = "Hide";
        }
        else
        {
            icon = "add";
            label = "Show";
        }
        var button = this.shadowRoot.querySelector("#show-hide-button");
        button.icon = icon;
        button.label = label;
    }
}

window.customElements.define('ft-form-panel', FtFormPanel);

