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
import '../ft-manage-connections/ft-manage-connections.js'
import '../ft-edit-connection/ft-edit-connection.js'

export class FtManage extends FtClientMixin(LitElement) {

    static get properties() {
        return {
            selectedConnection: { type: Object }
        };
    }

    constructor() {
        super();

        this.live = false;

        this.selectedConnection = null;

        this.addEventListener('edit-connection-button-clicked', this._onEditConnectionButtonClicked);
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <ft-manage-connections id="ft-manage-connections" part="ft-manage-connections"
                connections=${JSON.stringify(this.connections)}
            >
                </ft-manage-connections>

            <ft-edit-connection id="ft-edit-connection" part="ft-edit-connection"
                connections=${JSON.stringify(this.selectedConnection)}
                @edit-connection-back-button-clicked="${this._onEditConnectionBackButtonClicked}"
            >
            </ft-edit-connection>

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
                    #ft-manage-connections {
                        display: block;
                    }
                    #ft-edit-connection {
                        display: none;
                    }
        `
        ];
    }

    _onEditConnectionButtonClicked(event) {
        this.selectedConnection = event.detail;
        this._goToPanel("ft-edit-connection");
    }

    _onEditConnectionBackButtonClicked() {
        this._goToPanel("ft-manage-connections");
    }

    _goToPanel(name) {
        var showFirst = false;
        var showSecond = false;

        let nextPanel;

        switch (name) {
            case "ft-manage-connections":
                showFirst = true;
                nextPanel = this.shadowRoot.getElementById("ft-manage-connections");
                break;
            case "ft-edit-connection":
                showSecond = true;
                nextPanel = this.shadowRoot.getElementById("ft-edit-connection");
                break;
        }

        nextPanel.enter();

        this._setPanelShown("ft-manage-connections", showFirst);
        this._setPanelShown("ft-edit-connection", showSecond);
    }

    _setPanelShown(panelId, show) {
        var panel = this.shadowRoot.getElementById(panelId)
        if (show)
            panel.style.display = "block";
        else
            panel.style.display = "none";
    }

}

window.customElements.define('ft-manage', FtManage);

