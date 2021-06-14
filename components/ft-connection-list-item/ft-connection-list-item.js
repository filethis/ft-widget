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

// Figma design: https://www.figma.com/file/S6a4nOaB1T3zhe3HmyRzkt/FileThis?node-id=109%3A671


import { LitElement, html, css, unsafeCSS } from 'lit';
import '@material/mwc-icon';
import '@material/mwc-icon-button';
import '@material/mwc-button';
import '@material/mwc-circular-progress';
import { light } from "../../mx-design-tokens/index.js";

export class FtConnectionListItem extends LitElement {

    static get properties() {
        return {
            connection: { type: Object },
            _message: { type: String },
            fake: { type: Object }
       };
    }

    constructor() {
        super();

        this.connection = {};
        this._message = "Message here";
        this.fake = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <div id="logo" part="logo" on-tap="_onSourceClicked">
                <img id="logo-image" part="logo-image"
                    src="${!this.connection ? '' : this.connection.logoUrl}"
                >
            </div>

            <div id="panel" part="panel">

                <div id="text" part="text">
                    
                    <div id="title" part="title">
                        ${this.connection.name}
                    </div>

                    <div id="subtitle" part="subtitle">
                    </div>

                </div>

                <mwc-icon-button id="fix-button" part="fix-button"
                    icon="error"
                    @click=${this._onFixButtonClicked}
                >
                </mwc-icon-button>

                <mwc-circular-progress id="spinner" part="spinner"
                    indeterminate
                >
                </mwc-circular-progress>

                <mwc-icon-button id="edit-button" part="edit-button"
                    icon="chevron_right"
                    @click=${this._onEditButtonClicked}
                >
                </mwc-icon-button>

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
                height: 64px;
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: stretch;
                }
                    #logo {
                        width: 100px;
                        min-width: 100px;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                    }
                        #logo-image {
                            width:auto;
                            max-width:100%;
                        }
                    #panel {
                        min-width: 0;  /* Override flex default of "auto" which prevents shrinking past content */
                        flex: 1;
                        margin-left: 12px;
                        padding-right: 12px;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                        border-bottom: solid 1px ${unsafeCSS(light.Color.Neutral300)};
                    }
                        #text {
                            margin-left: 12px;
                            flex: 1;
                            min-width: 0;  /* Override flex default of "auto" which prevents shrinking past content */
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: stretch;
                        }
                            #title {
                                font-size: ${unsafeCSS(light.FontSize.Body)}px;
                                font-weight: ${unsafeCSS(light.FontWeight.Regular)};
                                line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            #subtitle {
                                font-size: ${unsafeCSS(light.FontSize.XSmall)}px;
                                line-height: ${unsafeCSS(light.LineHeight.XSmall)}px;
                                color: ${unsafeCSS(light.Color.Neutral700)};
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        #fix-button {
                            display: none;
                            margin-left: 12px;
                            color: ${unsafeCSS(light.Color.Error300)};
                        }
                        #spinner {
                            margin-left: 12px;
                            height: 48px;
                            --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                        }
                        #edit-button {
                            margin-left: 5px;
                        }
        `
        ];
    }

    updated(changedProperties) {
        if (changedProperties.has("fake"))
            this._onFakeChanged();
        if (changedProperties.has("connection"))
            this._onConnectionChanged();
    }

    _onConnectionChanged()
    {
        if (!this.connection)
            return;
  
        var isActive;
        var subtitle = "";
        var showFixButton = false;
  
        switch (this.connection.state)
        {
            case "waiting":
                isActive = false;
                subtitle = this._getRefreshDateString();
                break;
                
            case "created":
            case "manual":
            case "connecting":
                isActive = true;
                subtitle = "Connecting...";
                break;
                
            case "uploading":
                isActive = true;
                var documentCount = this.connection.documentCount;
                if (documentCount === 0 ||
                    !this.ftConnectionListItemShowDocumentCount)
                    subtitle = "Retrieving...";
                else
                    subtitle = "Retrieved " + documentCount.toString();
                break;
                
            case "question":
                isActive = false;
                subtitle = "Fix It";
                showFixButton = true;
                break;
                
            case "answered":
                isActive = true;
                subtitle = "Answered...";
                break;
                
            case "completed":
                isActive = true;
                subtitle = "Closing...";
                break;
                
            case "error":
                isActive = false;
                subtitle = "Error";
                showFixButton = true;
                break;
                
            case "incorrect":
            default:
                isActive = true;
                subtitle = "Incorrect...";
                break;
        }
  
        var subtitleElement = this.shadowRoot.getElementById("subtitle");
        subtitleElement.innerHTML = subtitle;

        var quiescentButtonElement = this.shadowRoot.getElementById("fix-button");
        this._showOrHideElement(quiescentButtonElement, showFixButton, "block");

        var spinnerElement = this.shadowRoot.getElementById("spinner");
        this._showOrHideElement(spinnerElement, isActive, "block");
        spinnerElement.closed = !isActive;
    }

    _showOrHideElement(element, show, display) {
        if (show)
            element.style.display = display;
        else
            element.style.display = "none";
    }
    
    _onFixButtonClicked() {
        this.shadowRoot.getElementById("fix-button").blur();
        
        const event = new CustomEvent("connection-list-item-fix-button-clicked", { detail: this.connection, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    _onEditButtonClicked() {
        this.shadowRoot.getElementById("edit-button").blur();
        
        const event = new CustomEvent('connection-list-item-edit-button-clicked', { detail: this.connection, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    _getRefreshDateString()
    {
        if (this.connection === null)
            return "";
  
        var checkedDate = new Date(this.connection.checkedDate);
  
        var checkedYear = checkedDate.getYear();
        var year2001 = 101;
        var hasNeverFetched = (checkedYear < year2001);
        if (hasNeverFetched)
            return "";
  
        var monthNames =
            [
                "Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct",
                "Nov", "Dec"
            ];
  
        var day = checkedDate.getDate();
        var monthIndex = checkedDate.getMonth();
  
        return "Refreshed " + monthNames[monthIndex] + ' ' + day;
    }

    _onFakeChanged() {
        if (this.fake)
            this._loadFakeConnection();
    }

    _loadFakeConnection() {
        var path = "/components/ft-connection-list-item/dev/fake-connection.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200) {
                var connection = JSON.parse(request.responseText);
                this.connection = connection;
            }
        }.bind(this);
        request.send();
    }

}

window.customElements.define('ft-connection-list-item', FtConnectionListItem);

