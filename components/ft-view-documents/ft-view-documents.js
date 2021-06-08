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


import { LitElement, html, css, unsafeCSS } from 'lit';
import { light } from "../../mx-design-tokens/index.js";
import { FtClient } from '../ft-client/ft-client.js';
import '../ft-view-documents-panel/ft-view-documents-panel.js'

export class FtViewDocuments extends FtClient(LitElement) {

    static get properties() {
        return {
        };
    }

    constructor() {
        super();

        this.live = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <ft-view-documents-panel id="ft-view-documents-panel" part="ft-view-documents-panel"
            documents=${JSON.stringify(this.documents)}
            >
            </ft-view-documents-panel>

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
                    #ft-view-documents-panel {
                        display: block;
                    }
        `
        ];
    }

    _goToPanel(name) {
        var showFirst = false;

        let nextPanel;

        switch (name) {
            case "ft-view-documents-panel":
                showFirst = true;
                nextPanel = this.shadowRoot.getElementById("ft-view-documents-panel");
                break;
        }

        nextPanel.enter();

        this._setPanelShown("ft-view-documents-panel", showFirst);
    }

    _setPanelShown(panelId, show) {
        var panel = this.shadowRoot.getElementById(panelId)
        if (show)
            panel.style.display = "block";
        else
            panel.style.display = "none";
    }

}

window.customElements.define('ft-view-documents', FtViewDocuments);

