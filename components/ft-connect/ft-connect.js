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
import '../ft-add-connections-panel/ft-add-connections-panel.js'
import '../ft-institutions-panel/ft-institutions-panel.js'
import '../ft-credentials-panel/ft-credentials-panel.js'
import '../ft-connecting-panel/ft-connecting-panel.js'
import '../ft-success-panel/ft-success-panel.js'
import '../ft-challenge-panel/ft-challenge-panel.js'
import '../ft-connections-panel/ft-connections-panel.js'
import '../ft-edit-connection-panel/ft-edit-connection-panel.js'
import '../ft-documents-panel/ft-documents-panel.js'
import '../ft-edit-document-panel/ft-edit-document-panel.js'
import { FtClient } from '../ft-client/ft-client.js';

export const Workflow = {
    ADD: "add",
    MANAGE: "manage",
    SUPPORT: "support"
};
export class FtConnect extends FtClient {

    static get properties() {
        return {
            workflow: { type: String },
            _selectedInstitution: { type: Object },
            _selectedConnection: { type: Object },
            _selectedDocument: { type: Object },
            _selectedPanelName: { type: String },
            _panelUnderModal: { type: String }
        };
    }

    constructor() {
        super();

        this.workflow = Workflow.ADD;
        this._selectedInstitution = null;
        this._selectedConnection = null;
        this._selectedDocument = null;
        this._selectedPanelName = null;
        this._panelUnderModal = null;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <ft-add-connections-panel id="ft-add-connections-panel" part="ft-add-connections-panel"
                @connect-continue-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-add-connections-panel>

            <ft-institutions-panel id="ft-institutions-panel" part="ft-institutions-panel"
                institutions=${JSON.stringify(this.institutions)}
                @selected-institution-changed="${this._transitionByCustomEvent}"
                @institution-back-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-institutions-panel>

            <ft-credentials-panel id="ft-credentials-panel" part="ft-credentials-panel"
                institution=${JSON.stringify(this._selectedInstitution)}
                @credentials-back-button-clicked="${this._transitionByCustomEvent}"
                @credentials-continue-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-credentials-panel>

            <ft-connecting-panel id="ft-connecting-panel" part="ft-connecting-panel"
                institution=${JSON.stringify(this._selectedInstitution)}
                connection=${JSON.stringify(this._selectedConnection)}
                @connecting-another-button-clicked="${this._transitionByCustomEvent}"
                @connecting-done-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-connecting-panel>

            <ft-success-panel id="ft-success-panel" part="ft-success-panel"
                institution=${JSON.stringify(this._selectedInstitution)}
                connection=${JSON.stringify(this._selectedConnection)}
                @success-continue-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-success-panel>

            <ft-challenge-panel id="ft-challenge-panel" part="ft-challenge-panel"
                request=${JSON.stringify(this.challenge)}
                @challenge-back-button-clicked="${this._transitionByCustomEvent}"
                @challenge-submit-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-challenge-panel>

            <ft-connections-panel id="ft-connections-panel" part="ft-connections-panel"
                connections=${JSON.stringify(this.connections)}
                @manage-connections-add-button-clicked="${this._transitionByCustomEvent}"
                @connection-list-item-edit-button-clicked="${this._transitionByCustomEvent}"
                @connection-list-item-fix-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-connections-panel>

            <ft-edit-connection-panel id="ft-edit-connection-panel" part="ft-edit-connection-panel"
                institution=${JSON.stringify(this._selectedInstitution)}
                connection=${JSON.stringify(this._selectedConnection)}
                @delete-connection-button-clicked="${this._transitionByCustomEvent}"
                @edit-connection-back-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-edit-connection-panel>

            <ft-documents-panel id="ft-documents-panel" part="ft-documents-panel"
                documents=${JSON.stringify(this.documents)}
                @document-list-item-edit-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-documents-panel>

            <ft-edit-document-panel id="ft-edit-document-panel" part="ft-edit-document-panel"
                document=${JSON.stringify(this._selectedDocument)}
                @delete-document-button-clicked="${this._transitionByCustomEvent}"
                @edit-document-back-button-clicked="${this._transitionByCustomEvent}"
            >
            </ft-edit-document-panel>

        </div>

        <mwc-dialog
            id="delete-connection-confirm-dialog"
            scrimClickAction=""
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
                    #ft-add-connections-panel {
                        display: none;
                    }
                    #ft-institutions-panel {
                        display: none;
                    }
                    #ft-credentials-panel {
                        display: none;
                    }
                    #ft-connecting-panel {
                        display: none;
                    }
                    #ft-success-panel {
                        display: none;
                    }
                    #ft-challenge-panel {
                        display: none;
                    }
                    #ft-connections-panel {
                        display: none;
                    }
                    #ft-edit-connection-panel {
                        display: none;
                    }
                    #ft-documents-panel {
                        display: none;
                    }
                    #ft-edit-document-panel {
                        display: none;
                    }
        `
        ];
    }

    updated(changedProperties) {
        super.updated?.(changedProperties);

        if (changedProperties.has('workflow'))
            this._onWorkflowChanged();
        if (changedProperties.has('challenge'))
            this._onChallengeChanged();
        if (changedProperties.has('connections'))
            this._onConnectionsChanged();
        if (changedProperties.has('_selectedConnection'))
            this._onSelectedConnectionChanged(changedProperties);
    }

    _onConnectionsChanged() {

        // Update the contents of the selected connection, if there is one
        if (this._selectedConnection != null)
        {
            const selectedConnectionId = this._selectedConnection.id;
            const connection = this._findConnectionWithId(selectedConnectionId);

            // NOTE: It's important to copy by value, not reference, here
            this._selectedConnection = Object.assign({}, connection);
        }
    }

    _onSelectedConnectionChanged(changedProperties) {
        if (this._selectedPanelName == "ft-connecting-panel")
        {
            const wasValidated = this._connectionWasValidated(changedProperties);
            const isDone = this._selectedConnectionIsDone();

            if (wasValidated || isDone)
                this._goToPanel("ft-success-panel");
        }
    }

    _selectedConnectionIsDone() {
        const connection = this._selectedConnection;
        if (connection == null)
            return false;
                
        switch (connection.state)
        {
            case "created":
            case "connecting":
                return false;
            default:
                return true;
        }
    }

    _connectionWasValidated(changedProperties)
    {
        const oldConnection = changedProperties.get("_selectedConnection");
        if (oldConnection == null)
            return false;

        const oldValidation = oldConnection.validation;
        const newValidation = this._selectedConnection.validation;
        
        if (oldValidation == "done")
            return false;
        
        if (newValidation == "done")
            return true;
        
        return false;
    }

    _onWorkflowChanged() {
        switch (this.workflow)
        {
            case Workflow.ADD:
                this._goToPanel("ft-add-connections-panel");
            break;

            case Workflow.MANAGE:
                this._goToPanel("ft-connections-panel");
            break;

            case Workflow.SUPPORT:
                this._goToPanel("ft-documents-panel");
            break;
        }
    }

    _onChallengeChanged() {
        if (!this.challenge)
            return;

        const connectionId = this.challenge.connectionId;
        const connection = this._findConnectionWithId(connectionId);
        const institutionId = parseInt(connection.sourceId);
        const institution = this._findInstitutionWithId(institutionId);
        var challengeElement = this.shadowRoot.getElementById("ft-challenge-panel");
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
        const _selectedInstitution = event.detail;
        if (!_selectedInstitution)
            return;
        this._selectedInstitution = _selectedInstitution;
        this._goToPanel("ft-credentials-panel");
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

            case Workflow.SUPPORT:
                this._transitionForDocument(trigger, detail);
                break;
            }
    }

    _transitionForAddConnections(trigger, detail) {
        if (this._transitionAdding(trigger, detail, "ft-add-connections-panel"))
            return;
    }

    _transitionForManageConnections(trigger, detail) {        
        switch (trigger)
        {
            case "edit-connection-back-button-clicked":
                this._goToPanel("ft-connections-panel");
                return true;
                
            case "delete-connection-button-clicked":
                {
                    var dialog = this.shadowRoot.getElementById("delete-connection-confirm-dialog");
                    dialog.open = true;
                }
                return true;
                
            case "connection-list-item-edit-button-clicked":
                this._selectedConnection = detail;
                this._selectedInstitution = this._findInstitutionForConnection(this._selectedConnection);
                this._goToPanel("ft-edit-connection-panel");
                return true;
            
            case "connection-list-item-fix-button-clicked":
                {
                    const connection = detail;
                    this.challenge = this._findChallengeForConnection(connection);
                }
                return true;
    
            case "delete-connection-confirmed":
                this.deleteConnection(this._selectedConnection);
                this._goToPanel("ft-connections-panel");
                return true;

            case "manage-connections-add-button-clicked":
                this._goToPanel("ft-institutions-panel");
                return true;
        }

        return this._transitionAdding(trigger, detail, "ft-connections-panel");
    }

    _transitionAdding(trigger, detail, base) {
        switch (trigger)
        {
            case "connect-continue-button-clicked":
                this._goToPanel("ft-institutions-panel");
                return true;

            case "selected-institution-changed":
                {
                    const _selectedInstitution = detail;
                    if (!_selectedInstitution)
                        return true;
                    this._selectedInstitution = _selectedInstitution;
                }
                this._goToPanel("ft-credentials-panel");
                return true;

            case "institution-back-button-clicked":
                this._goToPanel(base);
                return true;
    
            case "credentials-back-button-clicked":
                this._goToPanel("ft-institutions-panel");
                return true;

            case "credentials-continue-button-clicked":
                {
                    const enterCredentialsElement = this.shadowRoot.getElementById("ft-credentials-panel");
                    const username = enterCredentialsElement.getUsername();
                    const password = enterCredentialsElement.getPassword();
                    const institution = this._selectedInstitution;
        
                    this._createConnection(username, password, institution)
                    .then(function (connectionId) {
                        return this._getConnection(connectionId);
                    }.bind(this))
                    .then(function (connection) {
                        this._selectedConnection = connection;
                        this._goToPanel("ft-connecting-panel");
                    }.bind(this));
                }
                return true;

            case "connecting-another-button-clicked":
                this._goToPanel("ft-institutions-panel");
                return true;

            case "connecting-done-button-clicked":
                this._goToPanel(base);
                return true;

            case "success-continue-button-clicked":
                this._goToPanel(base);
                return true;
            
            case "challenge-posed":
                this._goToPanel("ft-challenge-panel");
                return true;

            case "challenge-back-button-clicked":
                this.posedChallenge();
                this._goToPanel(base);
                return true;

            case "challenge-submit-button-clicked":
                {
                    this.posedChallenge();
                    const challengeElement = this.shadowRoot.getElementById("ft-challenge-panel");
                    this.submitInteractionResponse(challengeElement.request, challengeElement.response);
                }
                this._goToPanel(base);
        }
        return false;
    }

    _transitionForDocument(trigger, detail) {
        switch (trigger)
        {
            case "edit-document-back-button-clicked":
                this._goToPanel("ft-documents-panel");
                return true;

            case "document-list-item-edit-button-clicked":
                this._selectedDocument = detail;
                this._goToPanel("ft-edit-document-panel");
                return true;
            
            case "delete-document-button-clicked":
                {
                    const document = detail;
                    this.deleteDocument(document);
                    this._goToPanel("ft-documents-panel");
                    // {
                    //     var dialog = this.shadowRoot.getElementById("delete-document-confirm-dialog");
                    //     dialog.open = true;
                    // }
                }
                return true;
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
        var showEighth = false;
        var showNinth = false;
        var showTenth = false;

        let nextPanel;
        
        switch (nextPanelName)
        {
            case "ft-add-connections-panel":
                showFirst = true;
                nextPanel = this.shadowRoot.getElementById("ft-add-connections-panel");
                break;
            case "ft-institutions-panel":
                showSecond = true;
                nextPanel = this.shadowRoot.getElementById("ft-institutions-panel");
                break;
            case "ft-credentials-panel":
                showThird = true;
                nextPanel = this.shadowRoot.getElementById("ft-credentials-panel");
                break;
            case "ft-challenge-panel":
                showFourth = true;
                nextPanel = this.shadowRoot.getElementById("ft-challenge-panel");
                break;
            case "ft-connecting-panel":
                showFifth = true;
                nextPanel = this.shadowRoot.getElementById("ft-connecting-panel");
                break;
            case "ft-success-panel":
                showSixth = true;
                nextPanel = this.shadowRoot.getElementById("ft-success-panel");
                break;
            case "ft-connections-panel":
                showSeventh = true;
                nextPanel = this.shadowRoot.getElementById("ft-connections-panel");
                break;
            case "ft-edit-connection-panel":
                showEighth = true;
                nextPanel = this.shadowRoot.getElementById("ft-edit-connection-panel");
                break;
            case "ft-documents-panel":
                showNinth = true;
                nextPanel = this.shadowRoot.getElementById("ft-documents-panel");
                break;
            case "ft-edit-document-panel":
                showTenth = true;
                nextPanel = this.shadowRoot.getElementById("ft-edit-document-panel");
                break;
        }

        if (!!currentPanel)
            currentPanel.exit();
        nextPanel.enter();

        this._setPanelShown("ft-add-connections-panel", showFirst);
        this._setPanelShown("ft-institutions-panel", showSecond);
        this._setPanelShown("ft-credentials-panel", showThird);
        this._setPanelShown("ft-challenge-panel", showFourth);
        this._setPanelShown("ft-connecting-panel", showFifth);
        this._setPanelShown("ft-success-panel", showSixth);
        this._setPanelShown("ft-connections-panel", showSeventh);
        this._setPanelShown("ft-edit-connection-panel", showEighth);
        this._setPanelShown("ft-documents-panel", showNinth);
        this._setPanelShown("ft-edit-document-panel", showTenth);

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
    
    _findChallengeForConnection(connection)
    {
        if (!connection)
            return null;
        const challenge = this.interactionRequests.find(challenge => challenge.connectionId == connection.id);
        return challenge;
    }

}

window.customElements.define('ft-connect', FtConnect);

