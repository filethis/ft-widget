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
import '../ft-manage-connections-panel/ft-manage-connections-panel.js'
import '../ft-edit-connection/ft-edit-connection.js'

export class FtManageConnections extends FtClientMixin(LitElement) {

    static get properties() {
        return {
            _selectedConnection: { type: Object },
            _selectedInstitution: { type: Object }
        };
    }

    constructor() {
        super();

        this.live = false;

        this._selectedConnection = null;
        this._selectedInstitution = null;

        this.addEventListener('edit-connection-button-clicked', this._onEditConnectionButtonClicked);
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <ft-manage-connections-panel id="ft-manage-connections-panel" part="ft-manage-connections-panel"
                connections=${JSON.stringify(this.connections)}
            >
            </ft-manage-connections-panel>

            <ft-edit-connection id="ft-edit-connection" part="ft-edit-connection"
                connection=${JSON.stringify(this._selectedConnection)}
                institution=${JSON.stringify(this._selectedInstitution)}
                @delete-connection-button-clicked="${this._onDeleteConnectionButtonClicked}"
                @edit-connection-back-button-clicked="${this._onEditConnectionBackButtonClicked}"
            >
            </ft-edit-connection>

        </div>

        <mwc-dialog id="delete-connection-confirm-dialog"
            @closed="${this._onDeleteConnectionConfirmDialog}"
        >
            <div>Are you sure you want to delete this connection?</div>
            <mwc-button slot="primaryAction" dialogAction="confirmed">Delete</mwc-button>
            <mwc-button slot="secondaryAction" dialogAction="canceled">Cancel</mwc-button>
        </mwc-dialog>

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
                    #ft-manage-connections-panel {
                        display: block;
                    }
                    #ft-edit-connection {
                        display: none;
                    }
        `
        ];
    }

    _onDeleteConnectionConfirmDialog(event)
    {
        if (event.detail.action == "confirmed")
        {
            const newEvent = new CustomEvent('delete-connection-command', { detail: this._selectedConnection, bubbles: true, composed: true });
            this.dispatchEvent(newEvent);

            this._goToPanel("ft-manage-connections-panel");
        }
    }

    _onEditConnectionButtonClicked(event) {
        this._selectedConnection = event.detail;
        this._selectedInstitution = this._findInstitutionForConnection(this._selectedConnection);
        this._goToPanel("ft-edit-connection");
    }

    _onDeleteConnectionButtonClicked() {
        var dialog = this.shadowRoot.querySelector("#delete-connection-confirm-dialog");
        dialog.open = true;
    }

    _onEditConnectionBackButtonClicked() {
        this._goToPanel("ft-manage-connections-panel");
    }
    
    _findInstitutionForConnection(connection)
    {
        if (!connection)
            return null;
        const institution = this.institutions.find(institution => institution.id == connection.sourceId);
        return institution;
    }

    _goToPanel(name) {
        var showFirst = false;
        var showSecond = false;

        let nextPanel;

        switch (name) {
            case "ft-manage-connections-panel":
                showFirst = true;
                nextPanel = this.shadowRoot.getElementById("ft-manage-connections-panel");
                break;
            case "ft-edit-connection":
                showSecond = true;
                nextPanel = this.shadowRoot.getElementById("ft-edit-connection");
                break;
        }

        nextPanel.enter();

        this._setPanelShown("ft-manage-connections-panel", showFirst);
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

window.customElements.define('ft-manage-connections', FtManageConnections);

