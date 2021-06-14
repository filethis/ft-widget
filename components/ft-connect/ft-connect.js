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
    ADD: "add",
    MANAGE: "manage"
};
export class FtConnect extends FtClient {

    static get properties() {
        return {
            workflow: { type: String },
            autoPoseChallenges: { type: Object },
            _autoPoseChallengesInterval: { type: Object },
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

        this.workflow = Workflow.ADD;
        this.autoPoseChallenges = false;
        this._autoPoseChallengesInterval = null;

        this._selectedConnection = null;
        this._selectedInstitution = null;  // Same as next one?
        this._currentInstitution = null;
        this._selectedPanelName = null;
        this._panelUnderModal = null;
        this._currentInteractionRequest = null;
        this._currentConnection = null;

        this.addEventListener('connection-list-item-edit-button-clicked', this._transitionByCustomEvent);
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <ft-connect-to-your-account id="ft-connect-to-your-account" part="ft-connect-to-your-account"
                @connect-continue-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-connect-to-your-account>

            <ft-select-your-institution id="ft-select-your-institution" part="ft-select-your-institution"
                institutions=${JSON.stringify(this.institutions)}
                @selected-institution-changed="${this._transitionByCustomEvent}"
                @institution-back-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-select-your-institution>

            <ft-enter-credentials id="ft-enter-credentials" part="ft-enter-credentials"
                institution=${JSON.stringify(this._currentInstitution)}
                @credentials-back-button-clicked="${this._transitionByCustomEvent}"
                @credentials-continue-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-enter-credentials>

            <ft-connecting id="ft-connecting" part="ft-connecting"
                institution=${JSON.stringify(this._currentInstitution)}
                @connecting-another-button-clicked="${this._transitionByCustomEvent}"
                @connecting-done-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-connecting>

            <ft-success id="ft-success" part="ft-success"
                institution=${JSON.stringify(this._currentInstitution)}
                @success-continue-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-success>

            <ft-challenge id="ft-challenge" part="ft-challenge"
                request=${JSON.stringify(this._currentInteractionRequest)}
                @challenge-back-button-clicked="${this._transitionByCustomEvent}"
                @challenge-submit-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-challenge>

            <ft-manage-connections-panel id="ft-manage-connections-panel" part="ft-manage-connections-panel"
                connections=${JSON.stringify(this.connections)}
                @manage-connections-add-button-clicked="${this._transitionByCustomEvent}"
                @connection-list-item-edit-button-clicked="${this._transitionByCustomEvent}"
                @connection-list-item-fix-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-manage-connections-panel>

            <ft-edit-connection id="ft-edit-connection" part="ft-edit-connection"
                connection=${JSON.stringify(this._selectedConnection)}
                institution=${JSON.stringify(this._selectedInstitution)}
                @delete-connection-button-clicked="${this._transitionByCustomEvent}"
                @edit-connection-back-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-edit-connection>

        </div>

        <mwc-dialog id="delete-connection-confirm-dialog"
            @closed="${this._transitionByDialogCloseEvent}"
        >
            <div>Are you sure you want to delete this connection?</div>
            <mwc-button slot="primaryAction" dialogAction="delete-connection-confirmed">Delete</mwc-button>
            <mwc-button slot="secondaryAction" dialogAction="delete-connection-canceled">Cancel</mwc-button>
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

        if (changedProperties.has('workflow'))
            this._onWorkflowChanged();
        if (changedProperties.has('autoPoseChallenges'))
            this._onAutoPoseChallengesChanged();
    }

    _onAutoPoseChallengesChanged()
    {
        // Remove any previous poller
        if (!!this._autoPoseChallengesInterval)
        {
            clearInterval(this._autoPoseChallengesInterval);
            this._autoPoseChallengesInterval = null;
        }
        
        // If want to start polling, add poller
        if (this.autoPoseChallenges)
            this._autoPoseChallengesInterval = setInterval(this._poseNextPendingInteractionRequest.bind(this), 1000);
    }

    _onWorkflowChanged() {
        switch (this.workflow)
        {
            case Workflow.ADD:
                this._goToPanel("ft-connect-to-your-account");
            break;

            case Workflow.MANAGE:
                this._goToPanel("ft-manage-connections-panel");
            break;
        }
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
        const institutionId = parseInt(connection.sourceId);
        const institution = this._findInstitutionWithId(institutionId);
        var challengeElement = this.shadowRoot.getElementById("ft-challenge");
        challengeElement.institution = institution;

        this._transition("challenge-posed");
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

    _onInstitutionSelected(event) {
        const _currentInstitution = event.detail;
        if (!_currentInstitution)
            return;
        this._currentInstitution = _currentInstitution;
        this._goToPanel("ft-enter-credentials");
    }

    _transitionByDialogCloseEvent(event) {
        const trigger = event.detail.action;
        const detail = event.detail;
        this._transition(trigger, detail);
    }

    _transitionByCustomEvent(event) {
        const trigger = event.type;
        const detail = event.detail;
        this._transition(trigger, detail);
    }

    _transition(trigger, detail) {
        switch (this.workflow)
        {
            case Workflow.ADD:
                this._transitionForAddConnections(trigger, detail);
                break;

            case Workflow.MANAGE:
                this._transitionForManageConnections(trigger, detail);
                break;
        }
    }

    _transitionForAddConnections(trigger, detail) {
        if (this._transitionAdding(trigger, detail, "ft-connect-to-your-account"))
            return;
    }

    _transitionForManageConnections(trigger, detail) {        
        switch (trigger)
        {
            case "edit-connection-back-button-clicked":
                this._goToPanel("ft-manage-connections-panel");
                return true;
            
            case "delete-connection-button-clicked":
                var dialog = this.shadowRoot.querySelector("#delete-connection-confirm-dialog");
                dialog.open = true;
                return true;
            
            case "connection-list-item-edit-button-clicked":
                this._selectedConnection = detail;
                this._selectedInstitution = this._findInstitutionForConnection(this._selectedConnection);
                this._goToPanel("ft-edit-connection");
                return true;
            
            case "connection-list-item-fix-button-clicked":
                // TODO
                return true;

            case "delete-connection-confirmed":
                {
                    const newEvent = new CustomEvent('client-delete-connection-command', { detail: this._selectedConnection, bubbles: true, composed: true });
                    this.dispatchEvent(newEvent);
                }
                this._goToPanel("ft-manage-connections-panel");
                return true;

            case "manage-connections-add-button-clicked":
                this._goToPanel("ft-select-your-institution");
                return true;
        }

        return this._transitionAdding(trigger, detail, "ft-manage-connections-panel");
    }

    _transitionAdding(trigger, detail, base) {
        switch (trigger)
        {
            case "connect-continue-button-clicked":
                this._goToPanel("ft-select-your-institution");
                return true;

            case "selected-institution-changed":
                {
                    const _currentInstitution = detail;
                    if (!_currentInstitution)
                        return true;
                    this._currentInstitution = _currentInstitution;
                }
                this._goToPanel("ft-enter-credentials");
                return true;

            case "institution-back-button-clicked":
                this._goToPanel(base);
                return true;
    
            case "credentials-back-button-clicked":
                this._goToPanel("ft-select-your-institution");
                return true;

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
                return true;

            case "connecting-another-button-clicked":
                this._goToPanel("ft-select-your-institution");
                return true;

            case "connecting-done-button-clicked":
                this._goToPanel(base);
                return true;

            case "success-continue-button-clicked":
                this._goToPanel(base);
                return true;
            
            case "challenge-posed":
                this._panelUnderModal = this._selectedPanelName;
                this._goToPanel("ft-challenge");
                return true;

            case "challenge-back-button-clicked":
                this._goToPanel(this._panelUnderModal);
                return true;

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
                this._goToPanel(this._panelUnderModal);
        }
        return false;
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

window.customElements.define('ft-connect', FtConnect);

