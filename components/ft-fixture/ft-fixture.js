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
            _userAccessTokenPanelOpen: { type: Object },

            isLive: { type: Boolean, reflect: true },

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
    
        this.isLive = false;
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

                        <div id="ft-connect-wrapper">
                            <div id="ft-connect-wrapper-label" class="code">&lt;ft-connect&gt;</div>
                            <ft-connect id="ft-connect" class="screen">
                            </ft-connect>
                        </div>

                        <div id="ft-manage-wrapper">
                            <div id="ft-manage-wrapper-label" class="code">&lt;ft-manage&gt;</div>
                            <ft-manage id="ft-manage" class="screen">
                            </ft-manage>
                        </div>

                    </div>

                    <div id="dead">

                        <div id="dotted-ft-connect-wrapper">
                            <div id="dotted-ft-connect-wrapper-label" class="code">&lt;ft-connect&gt;</div>
                            <div id="dotted-ft-connect"></div>
                        </div>
                        
                        <div id="dotted-ft-manage-wrapper">
                            <div id="dotted-ft-manage-wrapper-label" class="code">&lt;ft-manage&gt;</div>
                            <div id="dotted-ft-manage"></div>
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
                    justify-content: flex-start;
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
                        justify-content: flex-start;
                        align-items: stretch;
                    }
                        #instance-header {
                            height: 60px;
                            border-bottom: 1px solid #DDD;
                            padding-left: 20px;
                            padding-right: 10px;
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-start;
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
                                display: none;
                                flex-direction: row;
                                justify-content: center;
                                align-items: center;
                            }
                                #ft-connect-wrapper {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-start;
                                    align-items: center;
                                }
                                    #ft-connect-wrapper-label {
                                    }
                                    #ft-connect {
                                    }
                                #ft-manage-wrapper {
                                    margin-left: 100px;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-start;
                                    align-items: center;
                                }
                                    #ft-connect-manage-label {
                                    }
                                    #ft-manage {
                                    }
                            #dead {
                                width:100%;
                                height: 100%;
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                align-items: center;
                            }
                                #dotted-ft-connect-wrapper {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-start;
                                    align-items: center;
                                }
                                    #dotted-ft-connect-wrapper-label {
                                    }
                                    #dotted-ft-connect {
                                        width: 400px;
                                        height: 650px;
                                        border-style:dashed;
                                        border-color:black;
                                        border-width:2px;
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: flex-start;
                                        align-items: center;
                                    }
                                #dotted-ft-manage-wrapper {
                                    margin-left: 100px;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-start;
                                    align-items: center;
                                }
                                    #dotted-ft-manage-wrapper-label {
                                    }
                                    #dotted-ft-manage {
                                        width: 400px;
                                        height: 650px;
                                        border-style:dashed;
                                        border-color:black;
                                        border-width:2px;
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: flex-start;
                                        align-items: center;
                                    }
            .screen {
                background: #FFFFFF;
                border: solid 1px gray;
                box-shadow: 0px 6px 12px rgba(87, 102, 117, 0.14), 0px 3px 8px rgba(87, 102, 117, 0.06);
                border-radius: 8px;
            }
            .colorRed {
                color: limegreen;
            }
            .colorGreen {
                color: firebrick;
            }
            .code {
                font-family: "courier";
                font-size: 14pt;
                font-weight: 600;
                margin-bottom: 16px;
            }
        `
        ];
    }

    _onPowerButtonClicked() {
        this.isLive = !this.isLive;
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

        if (changedProperties.has('isLive'))
            this._handleIsLiveChanged();
    }

    _handleIsLiveChanged() {
        var showLivePanel = false;
        var showDeadPanel = false;
        if (this.isLive)
            showLivePanel = true;
        else
            showDeadPanel = true;
        this._setPanelShown("live", showLivePanel);
        this._setPanelShown("dead", showDeadPanel);

        // Change the icon color of the power button
        var iconLabel;
        var iconColor;
        if (this.isLive)
        {
            iconLabel = "On";
            iconColor = "limegreen";
        }
        else
        {
            iconLabel = "Off";
            iconColor = "firebrick";
        }
        var button = this.shadowRoot.getElementById("power-button");
        button.label = iconLabel;
        button.style.setProperty("--ft-labeled-icon-button-icon-color", iconColor);
    }

    _setPanelShown(panelId, show) {
        var panel = this.shadowRoot.getElementById(panelId)
        if (show)
            panel.style.display = "flex";
        else
            panel.style.display = "none";
    }

    _handlePropertyChanged(propertyName, detailName, event) {
        const newValue = event.detail[detailName];
        const oldValue = this[propertyName];
        if (oldValue != newValue)
            this[propertyName] = newValue;
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

