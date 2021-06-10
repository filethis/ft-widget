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
import { FtClient } from '../ft-client/ft-client.js';


export class FtAddConnections extends FtClient {

    static get properties() {
        return {
            _currentInstitution: { type: Object },
            _selectedPanelName: { type: String },
            _panelUnderModal: { type: String },
            _currentInteractionRequest: { type: Object },
            _currentConnection: { type: Object }
        };
    }

   constructor() {
        super();

        this.live = false;

        this._currentInstitution = null;
        this._selectedPanelName = "ft-connect-to-your-account";
        this._panelUnderModal = "ft-connect-to-your-account";
        this._currentInteractionRequest = null;
        this._currentConnection = null;

        // Command event listeners
       this.addEventListener('ft-connect-to-your-account-continue-command', this._onConnectToYourAccountContinueCommand);
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <ft-connect-to-your-account id="ft-connect-to-your-account" part="ft-connect-to-your-account">
            </ft-connect-to-your-account>

            <ft-select-your-institution id="ft-select-your-institution" part="ft-select-your-institution"
                institutions=${JSON.stringify(this.institutions)}
                @selected-institution-changed="${this._onInstitutionSelected}"
                @institution-back-button-clicked="${this._onInstitutionBackButtonClicked}"
            >
            </ft-select-your-institution>

            <ft-enter-credentials id="ft-enter-credentials" part="ft-enter-credentials"
                institution=${JSON.stringify(this._currentInstitution)}
                @credentials-back-button-clicked="${this._onCredentialsBackButtonClicked}"
                @credentials-continue-button-clicked="${this._onCredentialsContinueButtonClicked}"
            >
            </ft-enter-credentials>

            <ft-connecting id="ft-connecting" part="ft-connecting"
                institution=${JSON.stringify(this._currentInstitution)}
                @connecting-another-button-clicked="${this._onConnectingAnotherButtonClicked}"
                @connecting-done-button-clicked="${this._onConnectingDoneButtonClicked}"
            >
            </ft-connecting>

            <ft-success id="ft-success" part="ft-success"
                institution=${JSON.stringify(this._currentInstitution)}
                @success-continue-button-clicked="${this._onSuccessContinueButtonClicked}"
            >
            </ft-success>

            <ft-challenge id="ft-challenge" part="ft-challenge"
                institution=${JSON.stringify(this._currentInstitution)}
                request=${JSON.stringify(this._currentInteractionRequest)}
                @challenge-back-button-clicked="${this._onChallengeBackButtonClicked}"
                @challenge-submit-button-clicked="${this._onChallengeSubmitButtonClicked}"
            >
            </ft-challenge>

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
                    position: relative;
                    width: 100%; height: 100%;
                }
                    #ft-connect-to-your-account {
                        display: block;
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
                    #ft-challenge {
                        display: none;
                    }
        `
        ];
    }

    updated(changedProperties) {
        super.updated?.(changedProperties);

        if (changedProperties.has('interactionRequests'))
            this._onInteractionRequestsChanged();
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

    _onInstitutionBackButtonClicked() {
        this._goToPanel("ft-connect-to-your-account");
    }

    _onCredentialsBackButtonClicked() {
        this._goToPanel("ft-select-your-institution");
    }

    _onCredentialsContinueButtonClicked() {
        var enterCredentialsElement = this.shadowRoot.querySelector("#ft-enter-credentials");
        var payload = {
            institution: this._currentInstitution,
            username: enterCredentialsElement.getUsername(),
            password: enterCredentialsElement.getPassword()
        }
        const connectEvent = new CustomEvent('client-create-connection-command', { detail: payload, bubbles: true, composed: true });
        this.dispatchEvent(connectEvent);

        this._goToPanel("ft-connecting");
    }

    _onConnectingAnotherButtonClicked() {
        this._goToPanel("ft-select-your-institution");
    }

    _onSuccessContinueButtonClicked() {
        this._goToPanel("ft-connect-to-your-account");
    }
   
    _onConnectingDoneButtonClicked() {
        this._goToPanel("ft-connect-to-your-account");
    }

    _onChallengeBackButtonClicked() {
        this._goToPanel(this._panelUnderModal);
    }

    _onChallengeSubmitButtonClicked() {
        var challengeElement = this.shadowRoot.querySelector("#ft-challenge");
        const payload = {
            request: challengeElement.request,
            response: challengeElement.response
        }
        const event = new CustomEvent('client-submit-interaction-response-command', { detail: payload, bubbles: true, composed: true });
        this.dispatchEvent(event);

        this._goToPanel("ft-connect-to-your-account");
    }

    _onInstitutionSelected(event) {
        const _currentInstitution = event.detail;
        if (!_currentInstitution)
            return;
        this._currentInstitution = _currentInstitution;
        this._goToPanel("ft-enter-credentials");
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
        }

        currentPanel.exit();
        nextPanel.enter();

        this._setPanelShown("ft-connect-to-your-account", showFirst);
        this._setPanelShown("ft-select-your-institution", showSecond);
        this._setPanelShown("ft-enter-credentials", showThird);
        this._setPanelShown("ft-challenge", showFourth);
        this._setPanelShown("ft-connecting", showFifth);
        this._setPanelShown("ft-success", showSixth);

        this._selectedPanelName = nextPanelName;
    }

    _setPanelShown(panelId, show) {
        var panel = this.shadowRoot.getElementById(panelId)
        if (show)
            panel.style.display = "block";
        else
            panel.style.display = "none";
    }

}

window.customElements.define('ft-add-connections', FtAddConnections);

