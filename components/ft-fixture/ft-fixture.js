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
import '@material/mwc-textfield';
import { light } from "../../mx-design-tokens/index.js";
import '../ft-labeled-icon-button/ft-labeled-icon-button.js'
import '../ft-form-panel/ft-form-panel.js'
import '../ft-accordion-item/ft-accordion-item.js'
import '../ft-connect/ft-connect.js'


export class FtFixture extends LitElement {

    static get properties() {
        return {
            _isOpen: { type: Object },

            server: { type: String },
            _serverPanelOpen: { type: Object },

            apiPath: { type: String },

            apiKey: { type: String },
            apiSecret: { type: String },
            _apiCredentialsPanelOpen: { type: Object },

            accountId: { type: String },
            _userAccountPanelOpen: { type: Object },

            userAccessToken: { type: String },
            _userAccessTokenPanelOpen: { type: Object }

        };
    }

    constructor() {
        super();

        this._isOpen = ("true" == localStorage.getItem("isOpen"));

        this.server = localStorage.getItem("server") || "";
        this._serverPanelOpen = ("true" == localStorage.getItem("serverPanelOpen"));

        this.apiPath = "";

        this.apiKey = localStorage.getItem("apiKey") || "";
        this.apiSecret = localStorage.getItem("apiSecret") || "";
        this._apiCredentialsPanelOpen = ("true" == localStorage.getItem("apiCredentialsPanelOpen"));

        this.accountId = localStorage.getItem("accountId") || "";
        this._userAccountPanelOpen = ("true" == localStorage.getItem("userAccountPanelOpen"));

        this.userAccessToken = localStorage.getItem("userAccessToken") || "";
        this._userAccessTokenPanelOpen = ("true" == localStorage.getItem("userAccessTokenPanelOpen"));
    }

    firstUpdated() {

        // TODO: Find a way to get events when the text input fields change instead of polling like this
        setInterval(this._checkForNewInput.bind(this), 1000)
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <ft-accordion-item id="accordion"
                heading="Fixture"
                isOpen="${this._isOpen}"
                @is-open-changed="${this._handlePropertyChanged.bind(this, "_isOpen", "isOpen")}"
            >
                <div id="sidebar" slot="content">

                    <!-- Server -->
                    <ft-form-panel id="server-panel"
                        heading="FileThis Server"
                        contentShown="${this._serverPanelOpen}"
                        @content-shown-changed="${this._handlePropertyChanged.bind(this, "_serverPanelOpen", "contentShown")}"
                    >
                        <!-- Summary -->
                        <div slot="summary">${this._getDomain()}</div>

                        <!-- Test button -->
                        <ft-labeled-icon-button id="server-test-button"
                            slot="controls"
                            icon="check"
                            label="Test"
                            @click="${this._onDefaultServerButtonClicked}"
                        >
                        </ft-labeled-icon-button>

                        <!-- Content -->
                        <div slot="content">
                            <mwc-textfield id="server"
                                outlined
                                label="URL"
                                value="${this.server}"
                            >
                            </mwc-textfield>

                        <!-- Default button -->
                        <ft-labeled-icon-button id="default-server-button"
                            icon="undo"
                            label="Default"
                            @click="${this._onDefaultServerButtonClicked}"
                        >
                        </ft-labeled-icon-button>

                        </div>
                    </ft-form-panel>

                    <!-- API Credentials -->
                    <ft-form-panel id="api-credentials-panel"
                        heading="API Credentials"
                        contentShown="${this._apiCredentialsPanelOpen}"
                        @content-shown-changed="${this._handlePropertyChanged.bind(this, "_apiCredentialsPanelOpen", "contentShown")}"
                    >
                        <!-- Test button -->
                        <ft-labeled-icon-button id="api-credentials-test-button"
                            slot="controls"
                            icon="check"
                            label="Test"
                            @click="${this._onTestApiCredentialsButtonClicked}"
                        >
                        </ft-labeled-icon-button>

                        <!-- Content -->
                        <div slot="content">
                            <mwc-textfield id="api-key" part="api-key"
                                outlined
                                type="password"
                                label="API Key"
                                iconTrailing="visibility"
                                value="${this.apiKey}"
                            >
                            </mwc-textfield>

                            <mwc-textfield id="api-secret" part="api-secret"
                                outlined 
                                type="password"
                                label="API Secret"
                                iconTrailing="visibility"
                                value="${this.apiSecret}"
                            >
                            </mwc-textfield>
                        </div>
                    </ft-form-panel>

                    <!-- User Account -->
                    <ft-form-panel id="user-account-panel"
                        heading="User Account"
                        contentShown="${this._userAccountPanelOpen}"
                        @content-shown-changed="${this._handlePropertyChanged.bind(this, "_userAccountPanelOpen", "contentShown")}"
                    >
                        <!-- Test button -->
                        <ft-labeled-icon-button id="user-account-test-button"
                            slot="controls"
                            icon="check"
                            label="Test"
                            @click="${this._onTestAccountButtonClicked}"
                        >
                        </ft-labeled-icon-button>

                        <!-- Content -->
                        <div slot="content">
                            <mwc-textfield id="account-id" part="account-id"
                                outlined 
                                label="Account ID"
                                value="${this.accountId}"
                            >
                            </mwc-textfield>
                        </div>
                    </ft-form-panel>

                    <!-- User Access Token -->
                    <ft-form-panel id="user-access-token-panel"
                        heading="User Access Token"
                        contentShown="${this._userAccessTokenPanelOpen}"
                        @content-shown-changed="${this._handlePropertyChanged.bind(this, "_userAccessTokenPanelOpen", "contentShown")}"
                    >
                        <!-- Test button -->
                        <ft-labeled-icon-button id="user-access-token-test-button"
                            slot="controls"
                            icon="check"
                            label="Test"
                            @click="${this._onTestTokenButtonClicked}">
                        </ft-labeled-icon-button>

                        <!-- Content -->
                        <div slot="content">
                            <mwc-textfield id="user-access-token" part="user-access-token"
                                outlined 
                                type="password"
                                label="User Access Token"
                                iconTrailing="visibility"
                                value="${this.userAccessToken}"
                            >
                            </mwc-textfield>
                        </div>
                    </ft-form-panel>
                </div>
            </ft-accordion-item>

            <div id="instance-panel">

                <div id="instance-header">

                    <div id="instance-title">Instance</div>

                    <ft-labeled-icon-button id="power-button"
                        icon="power_settings_new"
                        label="Power"
                        @click="${this._onPowerButtonClicked}">
                    </ft-labeled-icon-button>

                </div>

                <div id="live-or-dead">

                    <div id="live">
                        <ft-connect id="ft-connect">
                        </ft-connect>
                    </div>

                    <div id="dead">
                        <div id="dotted-ft-connect">
                        </div>

                        <div id="dotted-ft-manage">
                        </div>
                    </div>
                    
                </div>
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
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: stretch;
                }
                    #accordion {
                        border-right: 2px solid #DDD;
                    }
                        #sidebar {
                            width: 410px;
                        }
                            #server-panel {
                            }
                    #instance-panel {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                    }
                        #instance-header {
                            height: 60px;
                            border-bottom: 1px solid #DDD;
                            padding-left: 20px;
                            padding-right: 10px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                        }
                            #instance-title {
                                flex: 1;
                                font-size: 16pt;
                            }
                            #power-button {
                                margin-left:30px;
                                margin-right: 16px;
                                margin-top: 3px;
                            }
                        #live-or-dead {
                            flex: 1;
                        }
                            #live {
                                width:100%;
                                height: 100%;
                                /* display: flex; */
                                display: none;
                                flex-direction: column;
                                align-items: center;
                            }
                                #ft-connect {
                                }
                            #dead {
                                width:100%;
                                height: 100%;
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                background-color: tan;
                            }
                                #dotted-ft-connect {
                                    width: 400px;
                                    height: 650px;
                                    border-style:dashed;
                                    border-color:black;
                                    border-width:2px;
                                    padding:10px;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                }
                                #dotted-ft-manage {
                                    width: 400px;
                                    height: 650px;
                                    border-style:dashed;
                                    border-color:black;
                                    border-width:2px;
                                    padding:10px;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                }
        `
        ];
    }

    _checkForNewInput() {
        this._updatePropertyFromField("server", "#server")
        this._updatePropertyFromField("apiKey", "#api-key")
        this._updatePropertyFromField("apiSecret", "#api-secret")
        this._updatePropertyFromField("accountId", "#account-id")
        this._updatePropertyFromField("userAccessToken", "#user-access-token")
    }

    _updatePropertyFromField(propertyName, fieldSelector)
    {
        const field = this.shadowRoot.querySelector(fieldSelector);
        const fieldValue = field.value;
        if (this[propertyName] != fieldValue)
            this[propertyName] = fieldValue;
    }

    updated(changedProperties)
    {
        if (changedProperties.has('_isOpen'))
            localStorage.setItem('isOpen', this._isOpen);

        if (changedProperties.has('server'))
            localStorage.setItem('server', this.server);
        if (changedProperties.has('_serverPanelOpen'))
            localStorage.setItem('serverPanelOpen', this._serverPanelOpen);

        if (changedProperties.has('apiKey'))
            localStorage.setItem('apiKey', this.apiKey);
        if (changedProperties.has('apiSecret'))
            localStorage.setItem('apiSecret', this.apiSecret);
        if (changedProperties.has('_apiCredentialsPanelOpen'))
            localStorage.setItem('apiCredentialsPanelOpen', this._apiCredentialsPanelOpen);

        if (changedProperties.has('accountId'))
            localStorage.setItem('accountId', this.accountId);
        if (changedProperties.has('_userAccountPanelOpen'))
            localStorage.setItem('userAccountPanelOpen', this._userAccountPanelOpen);

        if (changedProperties.has('userAccessToken'))
            localStorage.setItem('userAccessToken', this.userAccessToken);
        if (changedProperties.has('_userAccessTokenPanelOpen'))
            localStorage.setItem('userAccessTokenPanelOpen', this._userAccessTokenPanelOpen);
    }

    _handlePropertyChanged(propertyName, detailName, event) {
        const newValue = event.detail[detailName];
        const oldValue = this[propertyName];
        if (oldValue != newValue)
            this[propertyName] = newValue;
    }

    _onLiveChanged(to, from)
    {
        if (this.live)
            this._liveOrDeadPageName = "live";
        else
            this._liveOrDeadPageName = "dead";

        // Change the icon color of the power button
        var iconColor;
        if (this.live)
            iconColor = "limegreen";
        else
            iconColor = "firebrick";
        this.$.liveButton.updateStyles({
            '--ft-labeled-icon-button-icon-fill-color': iconColor
        });
    }

    _onContinueButtonClicked()
    {
    }

    _getDomain() {
        // return new URL(this.server).hostname;
        return "kkkk";
    }

}

window.customElements.define('ft-fixture', FtFixture);

