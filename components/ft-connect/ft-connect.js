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


import { html, css, unsafeCSS } from 'lit';
import '@material/mwc-button';
import { light } from "../../mx-design-tokens/index.js";
import '../ft-connect-to-your-account/ft-connect-to-your-account.js'
import '../ft-select-your-institution/ft-select-your-institution.js'
import '../ft-enter-credentials/ft-enter-credentials.js'
import '../ft-connecting/ft-connecting.js'
import '../ft-success/ft-success.js'
import '../ft-challenge/ft-challenge.js'
import '../ft-manage-connections-panel/ft-manage-connections-panel.js'
import '../ft-edit-connection/ft-edit-connection.js'
import { FtClient } from '../ft-client/ft-client.js';

export const Workflow = {
    ADD_CONNECTIONS: "ADD_CONNECTIONS",
    MANAGE_CONNECTIONS: "MANAGE_CONNECTIONS"
};
export class FtAddConnections extends FtClient {

    static get properties() {
        return {
            workflow: { type: String },
            _selectedConnection: { type: Object },
            _selectedInstitution: { type: Object },  // Same as next one?
            _currentInstitution: { type: Object },
            _selectedPanelName: { type: String },
            _panelUnderModal: { type: String },
            _currentInteractionRequest: { type: Object },
            _currentConnection: { type: Object }
        };
    }

    constructor() {
        super();

        this.workflow = Workflow.ADD_CONNECTIONS;
        this.live = false;

        this._selectedConnection = null;
        this._selectedInstitution = null;  // Same as next one?
        this._currentInstitution = null;
        this._selectedPanelName = null;
        this._panelUnderModal = null;
        this._currentInteractionRequest = null;
        this._currentConnection = null;

        this.addEventListener('edit-connection-button-clicked', this._transition);
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <ft-connect-to-your-account id="ft-connect-to-your-account" part="ft-connect-to-your-account"
                @connect-continue-button-clicked="${this._transition}"
            >
            </ft-connect-to-your-account>

            <ft-select-your-institution id="ft-select-your-institution" part="ft-select-your-institution"
                institutions=${JSON.stringify(this.institutions)}
                @selected-institution-changed="${this._onInstitutionSelected}"
                @institution-back-button-clicked="${this._transition}"
            >
            </ft-select-your-institution>

            <ft-enter-credentials id="ft-enter-credentials" part="ft-enter-credentials"
                institution=${JSON.stringify(this._currentInstitution)}
                @credentials-back-button-clicked="${this._transition}"
                @credentials-continue-button-clicked="${this._transition}"
            >
            </ft-enter-credentials>

            <ft-connecting id="ft-connecting" part="ft-connecting"
                institution=${JSON.stringify(this._currentInstitution)}
                @connecting-another-button-clicked="${this._transition}"
                @connecting-done-button-clicked="${this._transition}"
            >
            </ft-connecting>

            <ft-success id="ft-success" part="ft-success"
                institution=${JSON.stringify(this._currentInstitution)}
                @success-continue-button-clicked="${this._transition}"
            >
            </ft-success>

            <ft-challenge id="ft-challenge" part="ft-challenge"
                institution=${JSON.stringify(this._currentInstitution)}
                request=${JSON.stringify(this._currentInteractionRequest)}
                @challenge-back-button-clicked="${this._transition}"
                @challenge-submit-button-clicked="${this._transition}"
            >
            </ft-challenge>

            <ft-manage-connections-panel id="ft-manage-connections-panel" part="ft-manage-connections-panel"
                connections=${JSON.stringify(this.connections)}
            >
            </ft-manage-connections-panel>

            <ft-edit-connection id="ft-edit-connection" part="ft-edit-connection"
                connection=${JSON.stringify(this._selectedConnection)}
                institution=${JSON.stringify(this._selectedInstitution)}
                @delete-connection-button-clicked="${this._transition}"
                @edit-connection-back-button-clicked="${this._transition}"
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
                    position: relative;
                    width: 100%; height: 100%;
                }
                    #ft-connect-to-your-account {
                        display: none;
                    }
                    #ft-select-your-institution {
                        display: none;
                    }
                    #ft-enter-credentials {
                        display: none;
                    }
                    #ft-connecting {
                        display: none;
                    }
                    #ft-success {
                        display: none;
                    }
                    #ft-challenge {
                        display: none;
                    }
                    #ft-manage-connections-panel {
                        display: none;
                    }
                    #ft-edit-connection {
                        display: none;
                    }
        `
        ];
    }

    updated(changedProperties) {
        super.updated?.(changedProperties);

        if (changedProperties.has('interactionRequests'))
            this._onInteractionRequestsChanged();
        if (changedProperties.has('workflow'))
            this._onWorkflowChanged();
    }

    _onWorkflowChanged() {
        switch (this.workflow)
        {
            case Workflow.ADD_CONNECTIONS:
                this._goToPanel("ft-connect-to-your-account");
            break;

            case Workflow.MANAGE_CONNECTIONS:
                this._goToPanel("ft-manage-connections-panel");
            break;
        }
    }

    _onInteractionRequestsChanged() {
        this._poseNextPendingInteractionRequest();
    }

    _poseNextPendingInteractionRequest () {
        if (this.interactionRequests.length === 0)
            return;

        // If we already have a dialog posed
        if (this._selectedPanelName == "ft-challenge")
            return;
        
        // Pose the first request
        var interactionRequest = this.interactionRequests[0];
        this._currentInteractionRequest = interactionRequest;

        const connectionId = interactionRequest.connectionId;
        const connection = this._findConnectionWithId(connectionId);
        const institutionId = connection.institutionId;
        const institution = this._findInstitutionWithId(institutionId);
        var challengeElement = this.shadowRoot.getElementById("ft-challenge");
        challengeElement.institution = institution;

        this._panelUnderModal = this._selectedPanelName;
        this._goToPanel("ft-challenge")
    }

    _findConnectionWithId(connectionId) {
        const count = this.connections.length;
        for (var index = 0; index < count; index++)
        {
            var connection = this.connections[index];
            if (connection.id == connectionId)
                return connection;
        }
        return null;
    }

    _onConnectToYourAccountContinueCommand() {
        this._goToPanel("ft-select-your-institution");
    }

    _onInstitutionSelected(event) {
        const _currentInstitution = event.detail;
        if (!_currentInstitution)
            return;
        this._currentInstitution = _currentInstitution;
        this._goToPanel("ft-enter-credentials");
    }

    _transition(event) {
        switch (this.workflow)
        {
            case Workflow.ADD_CONNECTIONS:
                this._transitionForAddConnections(event);
                break;

            case Workflow.MANAGE_CONNECTIONS:
                this._transitionForManageConnections(event);
                break;
        }
    }

    _transitionForAddConnections(event) {
        const eventName = event.type;
        switch (eventName)
        {
            case "connect-continue-button-clicked":
                this._goToPanel("ft-select-your-institution");
                break;

            case "institution-back-button-clicked":
                this._goToPanel("ft-connect-to-your-account");
                break;
    
            case "credentials-back-button-clicked":
                this._goToPanel("ft-select-your-institution");
                break;

            case "credentials-continue-button-clicked":
                {
                    var enterCredentialsElement = this.shadowRoot.querySelector("#ft-enter-credentials");
                    var payload = {
                        institution: this._currentInstitution,
                        username: enterCredentialsElement.getUsername(),
                        password: enterCredentialsElement.getPassword()
                    };
                    const connectEvent = new CustomEvent('client-create-connection-command', { detail: payload, bubbles: true, composed: true });
                    this.dispatchEvent(connectEvent);
                }
                this._goToPanel("ft-connecting");
                break;

            case "connecting-another-button-clicked":
                this._goToPanel("ft-select-your-institution");
                break;

            case "connecting-done-button-clicked":
                this._goToPanel("ft-connect-to-your-account");
                break;

            case "success-continue-button-clicked":
                this._goToPanel("ft-connect-to-your-account");
                break;

            case "challenge-back-button-clicked":
                this._goToPanel(this._panelUnderModal);
                break;

            case "challenge-submit-button-clicked":
                {
                    var challengeElement = this.shadowRoot.querySelector("#ft-challenge");
                    const payload = {
                        request: challengeElement.request,
                        response: challengeElement.response
                    }
                    const event = new CustomEvent('client-submit-interaction-response-command', { detail: payload, bubbles: true, composed: true });
                    this.dispatchEvent(event);
                }
                this._goToPanel("ft-connect-to-your-account");
                break;
        }
    }

    _transitionForManageConnections(event) {
        const eventName = event.type;
        switch (eventName)
        {
            case "delete-connection-button-clicked":
                var dialog = this.shadowRoot.querySelector("#delete-connection-confirm-dialog");
                dialog.open = true;
                break;

            case "edit-connection-back-button-clicked":
                this._goToPanel("ft-manage-connections-panel");
                break;
            
            case "edit-connection-button-clicked":
                this._selectedConnection = event.detail;
                this._selectedInstitution = this._findInstitutionForConnection(this._selectedConnection);
                this._goToPanel("ft-edit-connection");
                break;
        }
    }

    _goToPanel(nextPanelName)
    {
        var currentPanelName = this._selectedPanelName;
        if (nextPanelName == currentPanelName)
            return;
        
        const currentPanel = this.shadowRoot.getElementById(currentPanelName);

        var showFirst = false;
        var showSecond = false;
        var showThird = false;
        var showFourth = false;
        var showFifth = false;
        var showSixth = false;
        var showSeventh = false;
        var showEigth = false;

        let nextPanel;
        
        switch (nextPanelName)
        {
            case "ft-connect-to-your-account":
                showFirst = true;
                nextPanel = this.shadowRoot.getElementById("ft-connect-to-your-account");
                break;
            case "ft-select-your-institution":
                showSecond = true;
                nextPanel = this.shadowRoot.getElementById("ft-select-your-institution");
                break;
            case "ft-enter-credentials":
                showThird = true;
                nextPanel = this.shadowRoot.getElementById("ft-enter-credentials");
                break;
            case "ft-challenge":
                showFourth = true;
                nextPanel = this.shadowRoot.getElementById("ft-challenge");
                break;
            case "ft-connecting":
                showFifth = true;
                nextPanel = this.shadowRoot.getElementById("ft-connecting");
                break;
            case "ft-success":
                showSixth = true;
                nextPanel = this.shadowRoot.getElementById("ft-success");
                break;
            case "ft-manage-connections-panel":
                showSeventh = true;
                nextPanel = this.shadowRoot.getElementById("ft-manage-connections-panel");
                break;
            case "ft-edit-connection":
                showEigth = true;
                nextPanel = this.shadowRoot.getElementById("ft-edit-connection");
                break;
        }

        if (!!currentPanel)
            currentPanel.exit();
        nextPanel.enter();

        this._setPanelShown("ft-connect-to-your-account", showFirst);
        this._setPanelShown("ft-select-your-institution", showSecond);
        this._setPanelShown("ft-enter-credentials", showThird);
        this._setPanelShown("ft-challenge", showFourth);
        this._setPanelShown("ft-connecting", showFifth);
        this._setPanelShown("ft-success", showSixth);
        this._setPanelShown("ft-manage-connections-panel", showSeventh);
        this._setPanelShown("ft-edit-connection", showEigth);

        this._selectedPanelName = nextPanelName;
    }

    _setPanelShown(panelId, show) {
        var panel = this.shadowRoot.getElementById(panelId)
        if (show)
            panel.style.display = "block";
        else
            panel.style.display = "none";
    }
    
    _findInstitutionForConnection(connection)
    {
        if (!connection)
            return null;
        const institution = this.institutions.find(institution => institution.id == connection.sourceId);
        return institution;
    }

}

window.customElements.define('ft-add-connections', FtAddConnections);

