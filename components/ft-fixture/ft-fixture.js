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
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-select';
import { light } from "../../mx-design-tokens/index.js";
import { FtHttpMixin } from '../ft-http-mixin/ft-http-mixin.js';
import { FtClipboardMixin } from  '../ft-clipboard-mixin/ft-clipboard-mixin.js';
import '../ft-labeled-icon-button/ft-labeled-icon-button.js'
import '../ft-form-panel/ft-form-panel.js'
import '../ft-accordion-item/ft-accordion-item.js'
import { Workflow } from '../ft-connect/ft-connect.js'
import '../ft-documents-panel/ft-documents-panel.js'
import '../ft-code/ft-code.js'
import "juicy-ace-editor-es6";


const View = {
    RENDERED: "rendered",
    CODE: "code"
};

export class FtFixture extends FtHttpMixin(FtClipboardMixin(LitElement)) {

    static get properties() {
        return {
            _isOpen: { type: Object },

            server: { type: String },
            _serverPanelOpen: { type: Object },

            apiPath: { type: String },

            apiKey: { type: String },
            apiSecret: { type: String },
            _apiCredentialsPanelOpen: { type: Object },

            userAccountId: { type: String },
            _userAccountPanelOpen: { type: Object },

            userAccessTokenId: { type: String },
            userAccessTimeout:  { type: Number },
            userAccessToken: { type: String },
            _userAccessTokenPanelOpen: { type: Object },

            isLive: { type: Object },

            _view: { type: String },

            _code: { type: String },

            workflow: { type: String },
        };
    }

    constructor() {
        super();

        // this._isOpen = ("true" == localStorage.getItem("isOpen"));

        // this.server = localStorage.getItem("server") || "https://filethis.com";
        // this._serverPanelOpen = ("true" == localStorage.getItem("serverPanelOpen"));

        // this.apiPath = "/api/v1";

        // this.apiKey = localStorage.getItem("apiKey") || "";
        // this.apiSecret = localStorage.getItem("apiSecret") || "";
        // this._apiCredentialsPanelOpen = ("true" == localStorage.getItem("apiCredentialsPanelOpen"));

        // this.userAccountId = localStorage.getItem("userAccountId") || "";
        // this._userAccountPanelOpen = ("true" == localStorage.getItem("userAccountPanelOpen"));

        // this.userAccessTimeout = localStorage.getItem("userAccessTimeout") || 120;  // Two hours
        // this.userAccessTokenId = localStorage.getItem("userAccessTokenId") || "";
        // this.userAccessToken = localStorage.getItem("userAccessToken") || "";
        // this._userAccessTokenPanelOpen = ("true" == localStorage.getItem("userAccessTokenPanelOpen"));
    
        this.isLive = false;
    
        this._view = View.RENDERED;

        this._code = "";
    
        this._isOpen = ("true" == localStorage.getItem("isOpen"));

        this.server = localStorage.getItem("server") || "https://filethis.com";
        this._serverPanelOpen = ("true" == localStorage.getItem("serverPanelOpen"));

        this.apiPath = "/api/v1";

        this.apiKey = localStorage.getItem("apiKey") || "";
        this.apiSecret = localStorage.getItem("apiSecret") || "";
        this._apiCredentialsPanelOpen = ("true" == localStorage.getItem("apiCredentialsPanelOpen"));

        this.userAccountId = localStorage.getItem("userAccountId") || "";
        this._userAccountPanelOpen = ("true" == localStorage.getItem("userAccountPanelOpen"));

        this.userAccessTimeout = localStorage.getItem("userAccessTimeout") || 120;  // Two hours
        this.userAccessTokenId = localStorage.getItem("userAccessTokenId") || "";
        this.userAccessToken = localStorage.getItem("userAccessToken") || "";
        this._userAccessTokenPanelOpen = ("true" == localStorage.getItem("userAccessTokenPanelOpen"));

        this.workflow = Workflow.ADD;
    }

    firstUpdated() {

        // TODO: Find a way to get events when the text input fields change instead of polling like this
        setInterval(this._checkForNewInput.bind(this), 1000);

        this._updateCode();
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
                        <div slot="summary" class="summary">
                            ${this._getDomain()}
                        </div>

                        <!-- Test button -->
                        <ft-labeled-icon-button id="server-test-button"
                            slot="controls"
                            icon="check"
                            label="Test"
                            @click="${this._onTestServerButtonClicked}"
                        >
                        </ft-labeled-icon-button>

                        <!-- Test tooltip -->
                        <div id="server-test-tooltip" slot="tooltip" class="tooltip"></div>

                        <!-- Content -->
                        <div id="server-panel-content" slot="content">
                            <mwc-textfield id="server-field"
                                outlined
                                label="URL"
                                value="${this.server}"
                            >
                            </mwc-textfield>

                            <!-- Default button -->
                            <ft-labeled-icon-button id="server-default-button"
                                icon="undo"
                                label="Default"
                                @click="${this._onDefaultServerButtonClicked}"
                            >
                            </ft-labeled-icon-button>

                            <mwc-dialog id="server-default-confirm-dialog"
                                scrimClickAction=""
                                @closed="${this._onServerDefaultConfirmDialog}"
                            >
                                <div>Are you sure you want to restore the default FileThis server?</div>
                                <mwc-button slot="primaryAction" dialogAction="confirmed">Restore</mwc-button>
                                <mwc-button slot="secondaryAction" dialogAction="canceled">Cancel</mwc-button>
                            </mwc-dialog>

                        </div>
                    </ft-form-panel>

                    <!-- API Credentials -->
                    <ft-form-panel id="api-credentials-panel"
                        class="panel-top"
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

                        <!-- Test tooltip -->
                        <div id="api-credentials-test-tooltip" slot="tooltip" class="tooltip"></div>

                        <!-- Content -->
                        <div id="api-credentials-panel-content" slot="content">
                            <mwc-textfield id="api-key-field" part="api-key"
                                outlined
                                type="password"
                                label="API Key"
                                value="${this.apiKey}"
                            >
                            </mwc-textfield>

                            <mwc-textfield id="api-secret-field" part="api-secret"
                                outlined 
                                type="password"
                                label="API Secret"
                                value="${this.apiSecret}"
                            >
                            </mwc-textfield>
                        </div>
                    </ft-form-panel>

                    <!-- User Account -->
                    <ft-form-panel id="user-account-panel"
                        class="panel-top"
                        heading="User Account"
                        contentShown="${this._userAccountPanelOpen}"
                        @content-shown-changed="${this._handlePropertyChanged.bind(this, "_userAccountPanelOpen", "contentShown")}"
                    >
                        <!-- Summary -->
                        <div slot="summary" class="summary">ID: ${this.userAccountId}</div>

                        <!-- Test button -->
                        <ft-labeled-icon-button id="user-account-test-button"
                            slot="controls"
                            icon="check"
                            label="Test"
                            @click="${this._onTestAccountButtonClicked}"
                        >
                        </ft-labeled-icon-button>

                        <!-- Test tooltip -->
                        <div id="user-account-test-tooltip" slot="tooltip" class="tooltip"></div>

                        <!-- Content -->
                        <div id="user-account-panel-content" slot="content">
                            <mwc-textfield id="user-account-field" part="user-account"
                                outlined 
                                label="Account ID"
                                value="${this.userAccountId}"
                            >
                            </mwc-textfield>

                            <ft-labeled-icon-button id="account-copy-button"
                                icon="content_copy"
                                label="Copy"
                                @click="${this._onCopyUserAccountIdButtonClicked}"
                            >
                            </ft-labeled-icon-button>

                            <!-- <ft-labeled-icon-button id="account-code-button"
                                icon="code" 
                                label="Code"
                                @click="${this._onAccountCodeButtonClicked}"
                            >
                            </ft-labeled-icon-button> -->

                            <ft-labeled-icon-button id="account-delete-button"
                                icon="remove"
                                label="Delete"
                                @click="${this._onDeleteAccountButtonClicked}"
                            >
                            </ft-labeled-icon-button>

                            <mwc-dialog
                                id="account-delete-confirm-dialog"
                                scrimClickAction=""
                                @closed="${this._onAccountDeleteConfirmDialog}"
                            >
                                <div>Are you sure you want to delete the user account?</div>
                                <div>This will also delete the current user access token, if it exists.</div>
                                <mwc-button slot="primaryAction" dialogAction="confirmed">Delete User Account</mwc-button>
                                <mwc-button slot="secondaryAction" dialogAction="canceled">Cancel</mwc-button>
                            </mwc-dialog>

                            <ft-labeled-icon-button id="account-new-button"
                                icon="add"
                                label="New"
                                @click="${this._onCreateAccountButtonClicked}"
                            >
                            </ft-labeled-icon-button>

                            <mwc-dialog
                                id="account-create-confirm-dialog"
                                scrimClickAction=""
                                @closed="${this._onAccountCreateConfirmDialog}"
                            >
                                <div>Are you sure you want to create a new user account?</div>
                                <mwc-button slot="primaryAction" dialogAction="confirmed">Create Account</mwc-button>
                                <mwc-button slot="secondaryAction" dialogAction="canceled">Cancel</mwc-button>
                            </mwc-dialog>

                            <mwc-dialog
                                id="account-code-dialog"
                                class="code-dialog"
                                scrimClickAction=""
                            >
                                <ft-code
                                    resourceHeading="User Account"
                                    operationName = "create"
                                    resourceName = "account"
                                    languageAndLibraryName = "python-requests"
                                    partnerAccountId = "123"
                                    expiresIn = "123"
                                >
                                </ft-code>
                                <mwc-button slot="primaryAction" dialogAction="done">Done</mwc-button>
                            </mwc-dialog>

                        </div>
                    </ft-form-panel>

                    <!-- User Access Token -->
                    <ft-form-panel id="user-access-token-panel"
                        class="panel-top"
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

                        <!-- Test tooltip -->
                        <div id="user-access-token-test-tooltip" slot="tooltip" class="tooltip"></div>

                        <!-- Content -->
                        <div id="user-access-token-panel-content" slot="content">

                            <div id="timeout-and-token">

                                <mwc-textfield id="user-access-timeout-field" part="user-access-timeout-field"
                                    outlined 
                                    label="Timeout"
                                    value="${this.userAccessTimeout}"
                                >
                                </mwc-textfield>
                                
                                <mwc-textfield id="user-access-token-field" part="user-access-token-field"
                                    outlined 
                                    type="password"
                                    label="User Access Token"
                                    value="${this.userAccessToken}"
                                >
                                </mwc-textfield>

                            </div>

                            <ft-labeled-icon-button id="user-access-token-copy-button"
                                icon="content_copy"
                                label="Copy"
                                @click="${this._onCopyUserAccessTokenButtonClicked}"
                            >
                            </ft-labeled-icon-button>
                            
                            <!-- <ft-labeled-icon-button id="user-access-token-code-button"
                                icon="code" 
                                label="Code"
                                @click="${this._onUserAccessTokenCodeButtonClicked}"
                            >
                            </ft-labeled-icon-button> -->
                            
                            <ft-labeled-icon-button id="user-access-token-delete-button"
                                icon="remove"
                                label="Delete"
                                @click="${this._onDeleteTokenButtonClicked}"
                            >
                            </ft-labeled-icon-button>

                            <ft-labeled-icon-button id="user-access-token-new-button"
                                icon="add"
                                label="New"
                                @click="${this._onCreateTokenButtonClicked}"
                            >
                            </ft-labeled-icon-button>

                            <mwc-dialog
                                id="token-delete-confirm-dialog"
                                scrimClickAction=""
                                @closed="${this._onTokenDeleteConfirmDialog}"
                            >
                                <div>Creating a new user access token will first delete the current one, if it exists.</div>
                                <div>Do you want do proceed?.</div>
                                <mwc-button slot="primaryAction" dialogAction="confirmed">Delete Token</mwc-button>
                                <mwc-button slot="secondaryAction" dialogAction="canceled">Cancel</mwc-button>
                            </mwc-dialog>

                            <mwc-dialog
                                id="token-create-confirm-dialog"
                                scrimClickAction=""
                                @closed="${this._onTokenCreateConfirmDialog}"
                            >
                                <div>Creating a new user access token will first delete the current one, if it exists.</div>
                                <div>Do you want do proceed?.</div>
                                <mwc-button slot="primaryAction" dialogAction="confirmed">Create Token</mwc-button>
                                <mwc-button slot="secondaryAction" dialogAction="canceled">Cancel</mwc-button>
                            </mwc-dialog>

                            <mwc-dialog
                                id="token-code-dialog"
                                class="code-dialog"
                                scrimClickAction=""
                            >
                                <ft-code
                                    resourceHeading="User Access Token"
                                    operationName = "create"
                                    resourceName = "token"
                                    languageAndLibraryName = "python-requests"
                                    partnerAccountId = "123"
                                    expiresIn = "123"
                                >
                                </ft-code>
                                <mwc-button slot="primaryAction" dialogAction="done">Done</mwc-button>
                            </mwc-dialog>

                        </div>
                    </ft-form-panel>
                </div>
            </ft-accordion-item>

            <div id="instance-panel">

                <div id="instance-header">

                    <div id="instance-title">Instance</div>

                    <mwc-select id="workflow"
                        label="Workflow"
                        @selected="${this._workflowItemSelected}"
                    >
                        <mwc-list-item value="add">Add Connections</mwc-list-item>
                        <mwc-list-item value="manage">Manage Connections</mwc-list-item>
                        <mwc-list-item value="support">Support</mwc-list-item>
                    </mwc-select>

                    <div id="header-spacer"></div>

                    <ft-labeled-icon-button id="code-button"
                        icon="code"
                        label="Code"
                        @click="${this._onCodeButtonClicked}">
                    </ft-labeled-icon-button>

                    <div id="or-label">or</div>

                    <ft-labeled-icon-button id="render-button"
                        icon="web"
                        label="Render"
                        @click="${this._onRenderButtonClicked}">
                    </ft-labeled-icon-button>

                    <div id="button-spacer"></div>

                    <ft-labeled-icon-button id="power-button"
                        icon="power_settings_new"
                        label="Power"
                        @click="${this._onPowerButtonClicked}">
                    </ft-labeled-icon-button>

                </div>

                <div id="live-or-dead">

                    <div id="live">

                        <div id="render">
                            <div id="ft-connect-add-wrapper">
                                <div id="ft-connect-add-wrapper-label" class="code">&lt;ft-connect workflow="add"&gt;</div>

                                <ft-connect id="ft-connect-add" class="screen"
                                    workflow="${Workflow.ADD}"
                                    server="${this.server}"
                                    apiPath="${this.apiPath}"
                                    userAccountId="${this.userAccountId}"
                                    userAccessToken="${this.userAccessToken}"
                                    isLive="${this.isLive}"
                                    fakeInstitutions="true"
                                >
                                </ft-connect>
                            </div>

                            <div id="ft-connect-manage-wrapper">
                                <div id="ft-connect-manage-wrapper-label" class="code">&lt;ft-connect workflow="manage"&gt;</div>

                                <ft-connect id="ft-connect-manage" class="screen"
                                    workflow="${Workflow.MANAGE}"
                                    server="${this.server}"
                                    apiPath="${this.apiPath}"
                                    userAccountId="${this.userAccountId}"
                                    userAccessToken="${this.userAccessToken}"
                                    isLive="${this.isLive}"
                                    fakeInstitutions="true"
                                >
                                </ft-connect>
                            </div>

                            <div id="ft-support-wrapper">
                                <div id="ft-support-wrapper-label" class="code">&lt;ft-connect workflow="support"&gt;</div>

                                <ft-connect id="ft-documents-panel" class="screen"
                                    workflow="${Workflow.SUPPORT}"
                                    server="${this.server}"
                                    apiPath="${this.apiPath}"
                                    userAccountId="${this.userAccountId}"
                                    userAccessToken="${this.userAccessToken}"
                                    isLive="${this.isLive}"
                                    fakeInstitutions="true"
                                >
                                </ft-connect>
                            </div>
                        </div>

                        <!-- Fix loading of modes and themes. This is the console error message:
                            Unable to infer path to ace from script src, use ace.config.set('basePath', 'path') to enable
                            dynamic loading of modes and themes or with webpack use ace/webpack-resolver
                            reportErrorIfPathIsNotConfigured @ ace.js:3794
                        -->
                        <juicy-ace-editor id="code"
                            fontsize="16px"
                            softtabs="true"
                            theme="ace/theme/chrome"
                            mode="ace/mode/html"
                            tabsize="4"
                            value="Testing"
                            mode="ace/mode/html"
                        >
                        </juicy-ace-editor>

                        <!-- <juicy-ace-editor id="code"
                            readonly=""
                            theme="ace/theme/chrome"
                            mode="ace/mode/html"
                            fontsize="14px"
                            softtabs=""
                            value="${this.code}"
                            tabsize="4"
                        >
                        </juicy-ace-editor> -->

                    </div>

                    <div id="dead">

                        <div id="dotted-ft-connect-add-wrapper">
                            <div id="dotted-ft-connect-add-wrapper-label" class="code">&lt;ft-connect workflow="add"&gt;</div>
                            <div id="dotted-ft-connect-add"></div>
                        </div>
                        
                        <div id="dotted-ft-connect-manage-wrapper">
                            <div id="dotted-ft-connect-manage-wrapper-label" class="code">&lt;ft-connect workflow="manage"&gt;</div>
                            <div id="dotted-ft-connect-manage"></div>
                        </div>
                        
                        <div id="dotted-ft-support-wrapper">
                            <div id="dotted-ft-support-wrapper-label" class="code">&lt;ft-connect workflow="support"&gt;</div>
                            <div id="dotted-ft-support"></div>
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
                            width: 450px;
                        }
                            #server-panel {
                            }
                                #server-panel-content {
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start;
                                    align-items: center;
                                }
                                    #server-field {
                                        flex: 1;
                                        margin-right: 25px;
                                    }
                                #api-credentials-panel-content {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-start;
                                    align-items: stretch;
                                }
                                    #api-key-field {
                                    }
                                    #api-secret-field {
                                        margin-top: 20px;
                                    }
                                #user-account-panel-content {
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start;
                                    align-items: center;
                                }
                                    #user-account-field {
                                        flex: 1;
                                        margin-right: 25px;
                                    }
                                    #account-code-button {
                                        margin-left: 10px;
                                    }
                                    #account-delete-button {
                                        margin-left: 10px;
                                    }
                                    #account-new-button {
                                        margin-left: 10px;
                                    }
                                #user-access-token-panel-content {
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start;
                                    align-items: flex-end;
                                }
                                    #timeout-and-token {
                                        flex: 1;
                                        margin-right: 25px;
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: flex-start;
                                        align-items: stretch;
                                    }
                                        #user-access-timeout-field {
                                            width: 120px;
                                        }
                                        #user-access-token-field {
                                            margin-top: 20px;
                                        }
                                    #user-access-token-code-button {
                                        margin-left: 10px;
                                    }
                                    #user-access-token-delete-button {
                                        margin-left: 10px;
                                    }
                                    #user-access-token-new-button {
                                        margin-left: 10px;
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
                            padding-left: 24px;
                            padding-right: 10px;
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-start;
                            align-items: center;
                        }
                            #instance-title {
                                font-size: 16pt;
                            }
                            #workflow {
                                margin-left: 48px;
                                width: 225px;
                                --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                            }
                            #header-spacer {
                                flex: 1;
                            }
                            #code-button {
                                margin-left: 48px;
                            }
                            #or-label {
                                margin-left: 12px;
                            }
                            #render-button {
                                margin-left: 12px;
                            }
                            #button-spacer {
                                margin-left: 48px;
                                width: 2px;
                                height: 42px;
                                border-left: 1px solid #DDD;
                            }
                            #power-button {
                                margin-left:48px;
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
                                align-items: stretch;
                            }
                                #render {
                                    flex-direction: row;
                                    justify-content: center;
                                    align-items: center;
                                }
                                    #ft-connect-add-wrapper {
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: flex-start;
                                        align-items: center;
                                    }
                                        #ft-connect-add-wrapper-label {
                                        }
                                        #ft-connect-add {
                                        }
                                    #ft-connect-manage-wrapper {
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: flex-start;
                                        align-items: center;
                                    }
                                        #ft-connect-manage-label {
                                        }
                                        #ft-connect-manage {
                                        }
                                    #ft-support-wrapper {
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: flex-start;
                                        align-items: center;
                                    }
                                        #ft-support-wrapper-label {
                                        }
                                        #ft-view-documents {
                                        }
                                #code {
                                    flex: 1;
                                    margin-top:12px;
                                    border: 1px solid #DDD;
                                }
                            #dead {
                                width:100%;
                                height: 100%;
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                align-items: center;
                            }
                                #dotted-ft-connect-add-wrapper {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-start;
                                    align-items: center;
                                }
                                    #dotted-ft-connect-add-wrapper-label {
                                    }
                                    #dotted-ft-connect-add {
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
                                #dotted-ft-connect-manage-wrapper {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-start;
                                    align-items: center;
                                }
                                    #dotted-ft-connect-manage-wrapper-label {
                                    }
                                    #dotted-ft-connect-manage {
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
                                #dotted-ft-support-wrapper {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-start;
                                    align-items: center;
                                }
                                    #dotted-ft-support-wrapper-label {
                                        }
                                    #dotted-ft-support {
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
            .summary {
                font-size: 9pt;
                padding-top: 5px;
                color: #AAA;
            }
            .panel-top
            {
                border-top: 1px solid #DDD;
            }
            .tooltip
            {
                display: none;
                position: fixed;
                margin-left: 5px;
                margin-top: 9px;
                border: 1px solid #DDD;
                padding: 4px;
            }
            .code-dialog {
                --mdc-dialog-max-width: 1000px;
                --mdc-dialog-max-height: 1000px;
                --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                --mdc-theme-on-primary: white;
                --mdc-typography-button-font-size: ${unsafeCSS(light.FontSize.Body)}px;
                --mdc-typography-button-font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                --mdc-typography-button-line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                --mdc-typography-button-text-transform: none;
            }
            `
        ];
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

        if (changedProperties.has('userAccountId'))
            localStorage.setItem('userAccountId', this.userAccountId);
        if (changedProperties.has('_userAccountPanelOpen'))
            localStorage.setItem('userAccountPanelOpen', this._userAccountPanelOpen);

        if (changedProperties.has('userAccessTokenId'))
            localStorage.setItem('userAccessTokenId', this.userAccessTokenId);
        if (changedProperties.has('userAccessTimeout'))
            localStorage.setItem('userAccessTimeout', this.userAccessTimeout);
        if (changedProperties.has('userAccessToken'))
            localStorage.setItem('userAccessToken', this.userAccessToken);
        if (changedProperties.has('_userAccessTokenPanelOpen'))
            localStorage.setItem('userAccessTokenPanelOpen', this._userAccessTokenPanelOpen);

        if (changedProperties.has('_view'))
            this._handleViewChanged();

        if (changedProperties.has('isLive'))
           this._handleIsLiveChanged();
    
        if (changedProperties.has('_code'))
            this._handleCodeChanged();
        
        if (changedProperties.has('workflow'))
            this._handleWorkflowChanged();
    }

    _onCodeButtonClicked() {
        this._view = View.CODE;
    }

    _onRenderButtonClicked() {
        this._view = View.RENDERED;
    }

    _onPowerButtonClicked() {
        this.isLive = !this.isLive;
    }

    _onDefaultServerButtonClicked()
    {
        var dialog = this.shadowRoot.querySelector("#server-default-confirm-dialog");
        dialog.open = true;
    }

    _onServerDefaultConfirmDialog(event)
    {
        if (event.detail.action == "confirmed")
            this._restoreDefaultServer();
    }

    _restoreDefaultServer()
    {
        this.server = "https://filethis.com";
    }

    _onTestServerButtonClicked()
    {
        var url = this.server + this.apiPath + "/healthcheck";
        var options = this._buildHttpOptions();

        this._makeTest
            (
                url,
                options,
                "#server-test-button",
                "#server-test-tooltip",
                "Server URL is valid and reachable",
                "Invalid Server URL, or not reachable"
            );
    }

    _onTestApiCredentialsButtonClicked()
    {
        var url = this.server + this.apiPath + "/partners";
        var options = this._buildHttpOptions();
        this._makeTest
            (
                url,
                options,
                "#api-credentials-test-button",
                "#api-credentials-test-tooltip",
                "API credentials are valid",
                "Invalid API credentials"
            );
    }

    _onTestAccountButtonClicked()
    {
        var url = this.server + this.apiPath + "/accounts/" + this.userAccountId;
        var options = this._buildHttpOptions();
        this._makeTest
            (
                url,
                options,
                "#user-account-test-button",
                "#user-account-test-tooltip",
                "User account is valid",
                "Invalid user account"
            );
    }

    _onTestTokenButtonClicked()
    {
        var url = this.server + this.apiPath + "/accounts/" + this.userAccountId;
        var options = {
            headers: {
                "X-FileThis-Session": this.userAccessToken
            }
        };
        this._makeTest
            (
                url,
                options,
                "#user-access-token-test-button",
                "#user-access-token-test-tooltip",
                "Token is valid",
                "Invalid token"
            );
    }

    _onAccountCodeButtonClicked()
    {
        var dialog = this.shadowRoot.querySelector("#account-code-dialog");
        dialog.open = true;
    }

    _onUserAccessTokenCodeButtonClicked()
    {
        var dialog = this.shadowRoot.querySelector("#token-code-dialog");
        dialog.open = true;
    }

    _makeTest(url, options, anchorSelector, tooltipSelector, successText, failureText)
    {
        this.httpGet(url, options)
            .then(function () {
                this._showTooltip
                    (
                        anchorSelector,
                        tooltipSelector,
                        successText,
                        true // successful
                    );
            }.bind(this))
            .catch(function () {
                this._showTooltip
                    (
                        anchorSelector,
                        tooltipSelector,
                        failureText,
                        false // failed
                    );
            }.bind(this));
    }

    _showTooltip(anchorSelector, tooltipSelector, message, wasSuccessful)
    {
        var tooltip = this.shadowRoot.querySelector(tooltipSelector);

        // Move into position
        const anchor = this.shadowRoot.querySelector(anchorSelector);
        const anchorGlobalBounds = anchor.getBoundingClientRect();
        const tooltipLeft = anchorGlobalBounds.right;
        const tooltipTop = anchorGlobalBounds.top;
        tooltip.style.left = tooltipLeft.toString() + "px";
        tooltip.style.top = tooltipTop.toString() + "px";

        // Set Message
        tooltip.innerHTML = message;

        // Colorize
        var backgroundColor;
        if (wasSuccessful)
            backgroundColor = '#ebfaeb';
        else // failed
            backgroundColor = '#ffe6e6';
        tooltip.style.backgroundColor = backgroundColor;

        // Show tooltip
        tooltip.style.display = "block";
        setTimeout(function () {
            tooltip.style.display = "none";
        }.bind(this), 2000)  // Show for two seconds
    }

    _buildHttpOptions()
    {
        var authorizationValue = "Basic " + btoa(this.apiKey + ":" + this.apiSecret);

        return {
            withCredentials: true,
            headers: {
                Authorization: authorizationValue
            }
        };
    }

    _checkForNewInput() {
        this._updatePropertyFromField("server", "#server-field")
        this._updatePropertyFromField("apiKey", "#api-key-field")
        this._updatePropertyFromField("apiSecret", "#api-secret-field")
        this._updatePropertyFromField("userAccountId", "#user-account-field")
        this._updatePropertyFromField("userAccessToken", "#user-access-token-field")
        this._updatePropertyFromField("userAccessTimeout", "#user-access-timeout-field")
    }

    _updatePropertyFromField(propertyName, fieldSelector)
    {
        const field = this.shadowRoot.querySelector(fieldSelector);
        const fieldValue = field.value;
        if (this[propertyName] != fieldValue)
            this[propertyName] = fieldValue;
    }

    _workflowItemSelected() {
        const workflowElement = this.shadowRoot.getElementById("workflow");
        const selectedItemElement = workflowElement.selected;
        selectedItemElement.blur();
        const workflow = selectedItemElement.value;
        if (this.workflow != workflow)
            this.workflow = workflow
    }

    _handleWorkflowChanged() {
        var showAddWorkflow = false;
        var showManageWorkflow = false;
        var showSupportWorkflow = false;
        switch (this.workflow)
        {
            case Workflow.ADD:
                showAddWorkflow = true;
                break;
            case Workflow.MANAGE:
                showManageWorkflow = true;
                break;
            case Workflow.SUPPORT:
                showSupportWorkflow = true;
                break;
        }
        this._setElementShown("ft-connect-add-wrapper", showAddWorkflow);
        this._setElementShown("ft-connect-manage-wrapper", showManageWorkflow);
        this._setElementShown("ft-support-wrapper", showSupportWorkflow);

        this._setElementShown("dotted-ft-connect-add-wrapper", showAddWorkflow);
        this._setElementShown("dotted-ft-connect-manage-wrapper", showManageWorkflow);
        this._setElementShown("dotted-ft-support-wrapper", showSupportWorkflow);

        const workflowElement = this.shadowRoot.getElementById("workflow");
        if (workflowElement.value != this.workflow)
            workflowElement.value = this.workflow;
    }

    _handleViewChanged() {
        var showRendered = false;
        var showCode = false;
        switch (this._view)
        {
            case View.CODE:
                showCode = true;
                break;
            case View.RENDERED:
                showRendered = true
                break;
        }
        this._setElementShown("render", showRendered);
        this._setElementShown("code", showCode);
    }

    _handleCodeChanged() {
        var codeElement = this.shadowRoot.getElementById("code");
        codeElement.value = this._code;
    }

    _handleIsLiveChanged() {
        var showLivePanel = false;
        var showDeadPanel = false;
        if (this.isLive)
            showLivePanel = true;
        else
            showDeadPanel = true;
        this._setElementShown("live", showLivePanel);
        this._setElementShown("dead", showDeadPanel);

        this._setElementShown("code-button", showLivePanel);
        this._setElementShown("or-label", showLivePanel);
        this._setElementShown("render-button", showLivePanel);
        this._setElementShown("button-spacer", showLivePanel);

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

    _setElementShown(id, show) {
        var panel = this.shadowRoot.getElementById(id)
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

    _onCopyUserAccountIdButtonClicked()
    {
        this.copyTextToClipboard(this.userAccountId);
    }

    _onCopyUserAccessTokenButtonClicked() {
        this.copyTextToClipboard(this.userAccessToken);
    }

    _onCreateAccountButtonClicked(event)
    {
        Promise.resolve()
            .then(function ()
            {
                // If there is no current user account, go ahead and create one
                var haveCurrentAccount = !!this.userAccountId;
                if (!haveCurrentAccount)
                    return this._createUserAccount();

                // If caller asked to override the warning, go ahead and delete and recreate the user account
                var overrideWarning = event.metaKey;
                if (overrideWarning)
                    return this._deleteAndRecreateUserAccount();

                // Ask the caller to confirm that they really want to delete the current user account
                var dialog = this.shadowRoot.querySelector("#account-create-confirm-dialog");
                dialog.open = true;
                return Promise.reject('DIALOG');
            }.bind(this))
            .then(function (response)
            {
                this.userAccountId = response.id;
            }.bind(this))
            .catch(function (reason)
            {
                if (reason == "DIALOG")
                    return;
                this._handleCaughtError(reason);
            }.bind(this));
    }

    _onAccountCreateConfirmDialog(event)
    {
        if (event.detail.action != "confirmed")
            return;
        
        Promise.resolve()
            .then(function ()
            {
                return this._deleteAndRecreateUserAccount();
            }.bind(this))
            .then(function (response)
            {
                this.userAccountId = response.id;
            }.bind(this))
            .catch(function (reason)
            {
                this._handleCaughtError(reason);
            }.bind(this));
    }

    _deleteAndRecreateUserAccount() {
        return this._deleteUserAccount()
            .catch(function ()
            {
                // TODO: Ignore?
            }.bind(this))
            .then(function ()
            {
                this.userAccountId = "";
                this.userAccessToken = "";  // Deleting an account deletes its tokens
            }.bind(this))
            .then(this._createUserAccount.bind(this));
    }

    _onDeleteAccountButtonClicked(event) {
        var overrideWarning = event.metaKey;
        if (overrideWarning)
            this._deleteUserAccountAction();

        // Ask the caller to confirm that they really want to delete the current user account
        var dialog = this.shadowRoot.querySelector("#account-delete-confirm-dialog");
        dialog.open = true;
    }

    _onAccountDeleteConfirmDialog(event)
    {
        if (event.detail.action == "confirmed")
            this._deleteUserAccountAction();
    }

    _deleteUserAccountAction()
    {
        this._deleteUserAccount()
            .then(function ()
            {
                this.userAccountId = "";

                // Deleting an account deletes its tokens
                this.userAccessTokenId = "";
                this.userAccessToken = "";
            }.bind(this))
            .catch(function (reason)
            {
                this._handleCaughtError(reason);
            }.bind(this));
    }

    _onCreateTokenButtonClicked(event)
    {
        Promise.resolve()
            .then(function ()
            {
                // If there is no current token, go ahead and create one
                var haveCurrentToken = !!this.userAccessToken;
                if (!haveCurrentToken)
                    return this._createToken();

                // If caller asked to override the warning, go ahead and delete and recreate the token
                var overrideWarning = event.metaKey;
                if (overrideWarning)
                    return this._deleteAndRecreateToken();

                // Ask the caller to confirm that they really want to delete the current token
                var dialog = this.shadowRoot.querySelector("#token-create-confirm-dialog");
                dialog.open = true;
                return Promise.reject('DIALOG');
            }.bind(this))
            .then(function (response)
            {
                this.userAccessTokenId = response.id;
                this.userAccessToken = response.token;
            }.bind(this))
            .catch(function (reason)
            {
                if (reason == "DIALOG")
                    return;
                this._handleCaughtError(reason);
            }.bind(this));
    }

    _onTokenCreateConfirmDialog(event)
    {
        if (event.detail.action != "confirmed")
            return;
        
        Promise.resolve()
            .then(function ()
            {
                return this._deleteAndRecreateToken();
            }.bind(this))
            .then(function (response)
            {
                this.userAccessTokenId = response.id;
                this.userAccessToken = response.token;
            }.bind(this))
            .catch(function (reason)
            {
                this._handleCaughtError(reason);
            }.bind(this));
    }

    _deleteAndRecreateToken()
    {
        return this._deleteToken()
            .catch(function ()
            {
                // Ignore. Token likely timed out.
            }.bind(this))
            .then(function ()
            {
                this.userAccessTokenId = "";
                this.userAccessToken = "";
            }.bind(this))
            .then(this._createToken.bind(this));
    }

    _onDeleteTokenButtonClicked(event)
    {
        var overrideWarning = event.metaKey;
        if (overrideWarning)
            return this._deleteTokenButtonAction();

        var dialog = this.shadowRoot.querySelector("#token-delete-confirm-dialog");
        dialog.open = true;
    }

    _onTokenDeleteConfirmDialog(event)
    {
        if (event.detail.action != "confirmed")
            return;

        this._deleteTokenButtonAction();
    }

    _deleteTokenButtonAction()
    {
        this._deleteToken()
            .then(function ()
            {
                this.userAccessTokenId = "";
                this.userAccessToken = "";
            }.bind(this))
            .catch(function (reason)
            {
                this._handleCaughtError(reason);
            }.bind(this));
    }

    _onClearSecretsButtonClicked(event) {
        var overrideWarning = event.metaKey;
        if (overrideWarning)
            return this._clearSecretsAction();

        var prompt = "Are you sure you want to the clear secrets stored in your browser's local storage?";
        prompt += "<br><br>Secrets include the API key, API secret, and the current user access token.";
        this.$.confirmationDialog.confirm(prompt, "Clear Secrets")
            .then(function (choice) {
                if (choice === "cancel")
                    return;
                return this._clearSecretsAction();
            }.bind(this))
    }

    _clearSecretsAction() {
        this._clearSecrets()
            .catch(function (reason) {
                if (reason === "cancel")
                    return;
                this._handleCaughtError(reason);
            }.bind(this));
    }

    _clearSecrets() {
        // TODO: Prompt to delete account and token

        // this._suppressWriteToLocalStorage = true;
        try {
            this.apiKey = "";
            this.apiSecret = "";
            this.userAccessToken = "";
            this.userAccessTokenId = "";
        }
        finally {
            this._suppressWriteToLocalStorage = false;
        }
        // this._writeToLocalStorage();
    }

    // Actions -------------------------------------------------------------------------------------

    _deleteUserAccount() {
        var url = this.server + "/api/v1/accounts/" + this.userAccountId;
        var options = this._buildHttpOptions();
        return this.httpDelete(url, options);
    }

    _createUserAccount() {
        var url = this.server +
            "/api/v1/accounts/";
        var partnerAccountId = this._generateGuid();
        var body = {
            partnerAccountId: partnerAccountId
        };
        var options = this._buildHttpOptions();
        return this.httpPost(url, body, options);
    }

    _deleteToken() {
        var url = this.server + "/api/v1/accounts/" + this.userAccountId + "/tokens/" + this.userAccessTokenId;
        var options = this._buildHttpOptions();
        return this.httpDelete(url, options);
    }

    _createToken() {
        var url = this.server + "/api/v1/accounts/" + this.userAccountId + "/tokens/";
        var body = {
            expiresIn: this.userAccessTimeout.toString()
        };
        var options = this._buildHttpOptions();
        return this.httpPost(url, body, options);
    }

    _getDomain()
    {
        var server = this.server;
        if (!server)
            return;
        var regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/;
        var matches = server.match(regex);
        if (matches.length !== 2)
            return;
        var serverDomain = matches[1];
        return serverDomain;
    }

    _generateGuid()
    {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    _handleCaughtError(reason)
    {
        var message = this._createMessageFromError(reason);
        console.log(message);
        if (this.errorDebug)
            alert(message);
        //                this.$.confirmationDialog.alert(message);
    }

    _createMessageFromError(error) {
        // If the error is not an Error class instance, return a message that renders it as a string
        var errorType = typeof error;
        if (errorType !== 'object')
            return "Error of type " + errorType + ": " + error.toString();

        var message = "An error occurred\n";
        message += "-----------------\n\n";

        message += "---------------------------------\n\n";

        // The standard properties
        message = this._appendErrorPropertyTo(error, 'name', "Name", message);
        message = this._appendErrorPropertyTo(error, 'message', "Message", message);

        // File properties (can come from window.onerror() and XMLHttpRequest.onError())
        message = this._appendErrorPropertyTo(error, 'filename', "Filename", message);
        message = this._appendErrorInlineCodePropertyTo(error, 'url', "URL", message);
        message = this._appendErrorPropertyTo(error, 'lineNumber', "Line", message);
        message = this._appendErrorPropertyTo(error, 'columnNumber', "Column", message);

        // System error properties
        message = this._appendErrorPropertyTo(error, 'code', "Code", message);
        message = this._appendErrorPropertyTo(error, 'errno', "errno", message);
        message = this._appendErrorPropertyTo(error, 'syscall', "syscall", message);
        message = this._appendErrorInlineCodePropertyTo(error, 'path', "Path", message);
        message = this._appendErrorPropertyTo(error, 'port', "Port", message);

        // Stack property
        message = this._appendErrorStackPropertyTo(error, message);

        return message;
    }

    _appendErrorPropertyTo(error, name, label, message) {
        if (!error.hasOwnProperty(name))
            return message;

        var value = error[name].toString();
        return message + "**" + label + "**: " + value + "\n\n";
    }

    _appendErrorInlineCodePropertyTo(error, name, label, message) {
        if (!error.hasOwnProperty(name))
            return message;

        var value = error[name].toString();
        return message + "**" + label + "**: `" + value + "`\n\n";
    }

    _appendErrorStackPropertyTo(error, message) {
        // It seems that sometimes the "stack" property just contains another copy of the "message" property.
        // When it does, we ignore it.

        if (!error.hasOwnProperty("stack"))
            return message;

        var stack = error["stack"].toString();

        if (error.hasOwnProperty("message")) {
            var originalMessage = error["message"].toString();
            if (stack === originalMessage)
                return message;
        }

        message += "**Stacktrace**:\n\n```" + stack + "```";

        return message;
    }

    /**
     * Call this method with the parameters you get from things like the XMLHttpRequest onerror() callback to turn
     * it into a standard "Error" instance. Different browsers provide different data in different contexts,
     * and any of the given parameters are allowed to have null values.
     *
     * @param {String} message The error message.
     * @param {String} url The url of the error.
     * @param {String} lineNumber The line number in the source code where the error occurred.
     * @param {String} columnNumber The column number in the source code where the error occurred.
     * @param {Object} errorObject The error object.
     */
    createErrorFromValues(message, url, lineNumber, columnNumber, errorObject) {
        var error = new Error();
        if (!!message)
            error.message = message;
        if (!!url)
            error.url = url;
        if (!!lineNumber)
            error.lineNumber = lineNumber;
        if (!!columnNumber)
            error.columnNumber = columnNumber;
        if (!!errorObject)
            error.errorObject = errorObject;
        return error;
    }

    _updateCode() {
        this._code = this._makeSubstitutionsInto(CodeTemplate);
    }

    _makeSubstitutionsInto(template)
    {
        // TODO: Find a more efficient way to do this

        var code = template;
        code = code.replace(/{{WORKFLOW}}/g, this.workflow);
        code = code.replace(/{{SERVER}}/g, this.server);
        code = code.replace(/{{ACCOUNT_ID}}/g, this.userAccountId);
        // code = code.replace(/{{PARTNER_ACCOUNT_ID}}/g, this.partnerAccountId);
        code = code.replace(/{{USER_ACCESS_TOKEN}}/g, this.userAccessToken);
        return code;
    }
}

const CodeTemplate = '\
<!doctype html>\n\
<html lang="en">\n\
    \n\
    <head>\n\
        <meta charset="utf-8">\n\
        <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">\n\
        \n\
        <script type="module" src="https://connect.filethis.com/ft-connect/component/latest/ft-connect.js"></script>\n\
        <link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">\n\
    </head>\n\
    \n\
    <body>\n\
        <ft-connect\n\
            style="border: solid 1px gray;"\n\
            workflow="{{WORKFLOW}}"\n\
            userAccountId="{{ACCOUNT_ID}}"\n\
            userAccessToken="{{USER_ACCESS_TOKEN}}">\n\
        </ft-connect>\n\
    </body>\n\
    \n\
</html>\n\
';

window.customElements.define('ft-fixture', FtFixture);

