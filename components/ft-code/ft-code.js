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
import '@material/mwc-select';
import '@material/mwc-button';
import '@material/mwc-checkbox';
import '@material/mwc-formfield';
import '../ft-labeled-icon-button/ft-labeled-icon-button.js';
import { FtClipboardMixin } from  '../ft-clipboard-mixin/ft-clipboard-mixin.js';
import "juicy-ace-editor-es6";


export class FtCode extends FtClipboardMixin(LitElement) {

    static get properties() {
        return {
            server: { type: String },

            apiKey: { type: String },
            apiSecret: { type: String },

            userAccountId: { type: String },

            userAccessTokenId: { type: String },
            userAccessTimeout: { type: Number },

            _substituteFixtureValues: { type: Boolean },

            code: { type: String },

            resourceName: { type: String },
            resourceHeading: { type: String },

            operationName: { type: String },
            _operation: { type: Object },
            _operations: { type: Array },

            languageAndLibraryName: { type: String },
            _languageAndLibrary: { type: Object },
            _languageAndLibraries: { type: Array },
        };
    }

    constructor() {
        super();

        this._substituteFixtureValues = false;
        this.code = "";
        this.operationName = "create";
        this._operations = [
            {
                name:'create',
                label:'Create'
            },
            {
                name:'delete',
                label:'Delete'
            }
        ];
        this._languageAndLibraries = [

            // API Blueprint
            {
                name:'apiblueprint',
                label:'API Blueprint',
                language:'apib'
            },

            // C#
            {
                name:'csharp-webrequest',
                label:'C# — WebRequest',
                language:'csharp'
            },
            {
                name:'csharp-restsharp',
                label:'C# — RestSharp',
                language:'csharp'
            },

            // cURL
            {
                name:'curl',
                label:'cURL',
                language:'sh'
            },

            // Go
            {
                name:'golang',
                label:'Go',
                language:'golang'
            },

            // HTTP
            {
                name:'http',
                label:'HTTP',
                language:'text'
            },

            // HTTPie
            {
                name:'httpie',
                label:'HTTPie',
                language:'sh'
            },

            // Java
            {
                name:'java-unirest',
                label:'Java — Unirest',
                language:'java'
            },
            {
                name:'java-okhttp',
                label:'Java — OkHttp',
                language:'java'
            },
            {
                name:'java-apachehttpclient',
                label:'Java — Apache HttpClient',
                language:'java'
            },

            // JavaScript
            {
                name:'javascript-jquery',
                label:'JavaScript — JQuery',
                language:'javascript'
            },
            {
                name:'javascript-xhr',
                label:'JavaScript — XHR',
                language:'javascript'
            },

            // Node
            {
                name:'node-http',
                label:'Node — http',
                language:'javascript'
            },
            {
                name:'node-request',
                label:'Node — Request',
                language:'javascript'
            },
            {
                name:'node-unirest',
                label:'Node — Unirest',
                language:'javascript'
            },

            // PHP
            {
                name:'php-curl',
                label:'php — cURL',
                language:'php'
            },
            {
                name:'php-httprequest',
                label:'php — HttpRequest',
                language:'php'
            },

            // Python
            {
                name:'python-requests',
                label:'Python — Requests',
                language:'python'
            },
            {
                name:'python3-httpclient',
                label:'Python 3 — http.client',
                language:'python'
            },

            // Ruby
            {
                name:'ruby-nethttp',
                label:'Ruby — Net::HTTP',
                language:'ruby'
            },

            // Wget
            {
                name:'wget',
                label:'Wget',
                language:'sh'
            }
        ];
    }

    render() {
        return html`

            <!-- Heading -->
            <div id="heading">
                Your Back End Code — ${this.resourceHeading}
            </div>

            <!-- Menus -->
            <div id="menus">

                <!-- Operation Menu -->
                <mwc-select id="operation"
                    label="Operation"
                    value="${this.operationName}"
                    @selected="${this._operationItemSelected}"
                >
                    ${!this._operations ? '' : this._operations.map(operation => html`
                        <mwc-list-item value="${operation.name}">
                            ${operation.label}
                        </mwc-list-item>
                    `)}
                </mwc-select>

                <div id="using">
                    using
                </div>

                <!-- Language and Library Menu -->
                <mwc-select id="language-and-library"
                    label="Language and Library"
                    value="${this.languageAndLibraryName}"
                    @selected="${this._languageAndLibrariesItemSelected}"
                >
                    ${!this._languageAndLibraries ? '' : this._languageAndLibraries.map(languageAndLibrary => html`
                        <mwc-list-item value="${languageAndLibrary.name}">
                            ${languageAndLibrary.label}
                        </mwc-list-item>
                    `)}
                </mwc-select>

                <div id="menus-spacer"></div>

                <!-- Copy code button -->
                <ft-labeled-icon-button id="copy-code-button"
                    icon="content_copy"
                    label="Copy"
                    @click="${this._onCopyCodeButtonClicked}"
                >
                </ft-labeled-icon-button>

            </div>

            <!-- Code -->
            <juicy-ace-editor id="code"
                readonly=""
                theme="ace/theme/chrome"
                mode="ace/mode/html"
                fontsize="14px"
                softtabs=""
                value="${this.code}"
                tabsize="4"
            >
            </juicy-ace-editor>

            <div id="code-spacer"></div>

            <!-- Substitute fixture values checkbox -->
            <mwc-formfield
                id="substitute-checkbox-formfield"
                label="Substitute fixture values into code (Warning: Contains secrets)"
            >
                <mwc-checkbox
                    id="substitute-checkbox"
                    @change="${this._onSubstituteCheckboxChanged}"
                >
                </mwc-checkbox>
            </mwc-formfield>

        `;
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                width: 765px;
                height: 710px;
                overflow: hidden;
                font-family: ${unsafeCSS(light.Font.Regular)};
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: stretch;
            }
                #heading {
                    color: ${unsafeCSS(light.Color.Neutral900)};
                    font-size: 14pt
                }
                #menus {
                    margin-top: 20px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: stretch;
                }
                    #operation {
                        width: 140px;
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                    }
                    #using {
                        padding-left:15px;
                        padding-top: 18px;
                        padding-right: 17px;
                        font-size: 13pt
                    }
                    #language-and-library {
                        width:230px;
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                    }
                    #menus-spacer {
                        flex: 1;
                    }
                    #copy-code-button {
                    }
                #code-spacer {
                    height:12px;
                }
                #code {
                    flex: 1;
                    margin-top:12px;
                    border: 1px solid #DDD;
                }
        `
        ];
    }

    updated(changedProperties)
    {
        if (changedProperties.has("operationName") ||
            changedProperties.has("_operations"))
        {
            this._onOperationChanged();
        }
        if (changedProperties.has("_languageAndLibraries"))
        {
            this._onLanguageAndLibraryChanged();
        }
        if (changedProperties.has("_operation") ||
            changedProperties.has("resourceName") ||
            changedProperties.has("_languageAndLibrary") ||
            changedProperties.has("_substituteFixtureValues"))
        {
            this._onRequestChanged();
        }
        if (changedProperties.has("_substituteFixtureValues"))
            this.onSubstituteFixtureValuesChanged();
    }

    // Operation

    _operationItemSelected(event) {
        const detail = event.detail;
        const operationIndex = detail.index;
    }

    _onOperationChanged()
    {
        this._handleOperationNameChanged();
    }

    _onOperationNameChanged()
    {
        if (!this.operationName || !this._operations)
            return;
        this._handleOperationNameChanged();
    }

    _handleOperationNameChanged()
    {
        this._operation = this._findOperationNamed(this.operationName);
    }

    // Language and library

    _languageAndLibrariesItemSelected(event) {
        const detail = event.detail;
        const languageAndLibraryIndex = detail.index;
    }

    _onLanguageAndLibraryChanged()
    {
        if (!this._languageAndLibrary)
            return;

        this._handleLanguageAndLibraryChanged();
    }

    _handleLanguageAndLibraryChanged(toLanguageAndLibrary)
    {
        // Set the code editor mode
        var language = this._languageAndLibrary.language;
        var mode = "ace/mode/" + language;
        var editorInternal = this.$.code.editor;
        var session = editorInternal.getSession();
        session.setMode(mode);
    }

    _onLanguageAndLibraryNameChanged()
    {
        if (!this.languageAndLibraryName || !this._languageAndLibraries)
            return;
        this._handleLanguageAndLibraryNameChanged();
    }

    _handleLanguageAndLibraryNameChanged()
    {
        this._languageAndLibrary = this._findLanguageAndLibraryNamed(this.languageAndLibraryName);
    }

    // Request

    _onRequestChanged()
    {
        // Load the code template

        // TODO: This should not be necessary
        if (!this._languageAndLibrary)
            return;

        var language = this._languageAndLibrary.language;
        var fileExtension = this._mapLanguageToFileExtension(language);
        var filename = this.resourceName + "-" + this.operationName + "-" + this.languageAndLibraryName + "." + fileExtension;

        var base = "https://filethis.github.io/ft-test-account-manager/components/ft-test-account-manager/data/";
        var url = base + this.resourceName + "/" + this.operationName + "/" + filename;

        var options =
            {
                responseType: "text",
                headers:
                    {
                        Accept: "text/plain"
                    }
            };

        return this.httpGet(url, options)
            .then(function(codeTemplate)
            {
                var code = this._makeSubstitutionsInto(codeTemplate);
                this.code = code;
                var editorInternal = this.$.code.editor;
                editorInternal.selection.selectFileStart();
            }.bind(this))
            .catch(function()
            {
                console.log("Could not load local code template file: " + url);
            }.bind(this));
    }

    // Substitute

    onSubstituteFixtureValuesChanged()
    {
        const checkboxElement = this.shadowRoot.getElementById("substitute-checkbox");
        checkboxElement.checked = this._substituteFixtureValues;
    }

    _onSubstituteCheckboxChanged() {
        const checkboxElement = this.shadowRoot.getElementById("substitute-checkbox");
        checkboxElement.blur();
        const checked = checkboxElement.checked;
        if (this._substituteFixtureValues != checked)
            this._substituteFixtureValues = checked;
    }

    _onCopyCodeButtonClicked()
    {
        this.copyTextToClipboard(this.code);
    }

    _makeSubstitutionsInto(template)
    {
        // TODO: Find a more efficient way to do this

        var code = template;
        code = code.replace(/{{SERVER}}/g, this.server);
        if (this._substituteFixtureValues)
        {
            code = code.replace(/{{ACCOUNT_ID}}/g, this.accountId);
            code = code.replace(/{{PARTNER_ACCOUNT_ID}}/g, this.partnerAccountId);
            code = code.replace(/{{TOKEN_ID}}/g, this.tokenId);
            code = code.replace(/{{EXPIRES_IN}}/g, this.expiresIn);
            var authorizationValue = btoa(this.apiKey + ":" + this.apiSecret);
            code = code.replace(/{{API_CREDENTIALS}}/g, authorizationValue);
        }
        return code;
    }

    _findOperationNamed(name)
    {
        var operations = this._operations;
        var count = operations.length;
        for (var index = 0; index < count; index++)
        {
            var operation = operations[index];
            if (operation.name === name)
                return operation;
        }
        return null;
    }

    _findLanguageAndLibraryNamed(name)
    {
        var languageAndLibraries = this._languageAndLibraries;
        var count = languageAndLibraries.length;
        for (var index = 0; index < count; index++)
        {
            var languageAndLibrary = languageAndLibraries[index];
            if (languageAndLibrary.name === name)
                return languageAndLibrary;
        }
        return null;
    }

    _mapLanguageToFileExtension(language)
    {
        switch (language)
        {
            case "text":
                return "txt";
            case "apib":
                return "apib";
            case "csharp":
                return "cs";
            case "sh":
                return "sh";
            case "golang":
                return "go";
            case "java":
                return "java";
            case "javascript":
                return "js";
            case "php":
                return "php";
            case "python":
                return "py";
            case "ruby":
                return "rb";
            default:
                return "txt";
        }
    }
}

window.customElements.define('ft-code', FtCode);

