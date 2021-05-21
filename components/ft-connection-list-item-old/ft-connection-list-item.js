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

import { LitElement, html, css } from 'lit';
import { Layouts } from 'lit-flexbox-literals';

export class FtConnectionListItem extends LitElement {

    static get properties() {
        return {
            connection: { type: Object },

            /** Whether the item should appear selected, or not. */
            selected: { type: Boolean },

            /** True when the active panel is hidden. */
            _activePanelHidden: { type: Boolean, state: true },

            /** True when the quiescent panel is hidden. */
            _quiescentPanelHidden: { type: Boolean, state: true },

            /** True when the quiescent button is hidden. */
            _quiescentButtonHidden: { type: Boolean, state: true },

            /** True when the quiescent subtext is hidden. */
            _quiescentSubtextHidden: { type: Boolean, state: true }
        };
    }

    constructor() {
        super();

        // Non-reactive instance variable initialization
        this._activePanelHidden = true;  // True when the active panel is hidden
        this._quiescentPanelHidden = false;
        this._quiescentButtonHidden = false;
        this._quiescentSubtextHidden = false;

        // Reactive property initialization
        this.selected = false;
        this.connection =
            {
                id: "1",
                accountId: "1",
                attemptDate: "2016-03-15T01:05:34+00:00",
                checkedDate: "2016-04-15T01:05:24+00:00",
                documentCount: 1,
                enabled: true,
                fetchAll: false,
                historicalPeriod: "30",
                info: "",
                logoUrl: "https://filethis.com/static/logos/72/Logo_FileThisHosted.png",
                name: "Untitled",
                period: "2d",
                sourceId: "1",
                state: "waiting",
                successDate: "2016-03-15T01:05:14+00:00",
                tries: 0,
                validation: "done"
            };
    }
    // TODO: Move styles out of style tag in the render below and into the getStyles() method

    render() {
        return html`

        <style>
            :host {
                display: block;
                overflow: hidden;
                height: 70px;
                @apply --layout-vertical;
            }
            #name {
                width: 150px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 15px;
            }
            #quiescentButton {
                width: 100px;
                height: 32px;
                background-color: white;
            }
            #quiescentButtonLabel {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
            }
            #quiescentSubtext {
                margin-top: 6px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: small;
                font-style: italic;
            }
            #activePanel {
            }
            #activeSpinner {
            }
            #activeSpinnerLabel {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
                text-transform: uppercase;
                padding-top: 2px;
            }
        </style>

        <custom-style>
            <style>
                paper-spinner-lite.spinner
                {
                    --paper-spinner-color: black;
                    --paper-spinner-stroke-width: 2px;
                    width: 17px;
                    height: 17px;
                }
            </style>
        </custom-style>

        <!-- Root -->
        <div id="root" class="flex layout horizontal center">
            <!-- Name -->
            <div id="name">
                ${this.connection.name}
            </div>

        </div>
        `;
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                border: solid 1px gray;
                padding: 16px;
                max-width: 800px;
            }
            `,
            Layouts
        ];
    }

    updated(changes)
    {
        if (changes.has("selected"))
            this._onSelectedChanged();
        if (changes.has("connection"))
        {
            const newConnection = this.connection;
            const oldConnection = changes.get("connection");
            if (this._propertiesChanged(newConnection, oldConnection, ["state", "documentCount"]))
                this._onConnectionChanged();
        }

        super.update(changes);
    }

    // TODO: Move this into a utilities class
    _propertiesChanged(first, second, propertyNames)
    {
        const firstIsUndefined = (first === undefined);
        const secondIsUndefined = (second === undefined);

        const bothAreUndefined = (firstIsUndefined && secondIsUndefined);
        if (bothAreUndefined)
            return false;
        
        const justOneIsUndefined = (firstIsUndefined || secondIsUndefined);
        if (justOneIsUndefined)
            return true;

        // Both are defined

        propertyNames.forEach(propertyName => {
            var firstValue = first[propertyName];
            var secondValue = second[propertyName];
            if (firstValue !== secondValue)
                return true;
        });

        return false;
    }

    _onSelectedChanged()
    {
        if (this.selected)
            this.style.backgroundColor = "#F6F6F6";
        else
            this.style.backgroundColor = "#FFFFFF";
    }

    _onConnectionChanged()
    {
        if (this.connection === null)
            return;

        var isActive;
        var label;
        var showQuiescentButton = false;
        var showQuiescentSubtext = false;
        var quiescentButtonIcon = "refresh";

        switch (this.connection.state) {
            case "waiting":
                isActive = false;
                label = "Refresh";
                showQuiescentButton = this.ftConnectionListItemAllowManualFetch;
                showQuiescentSubtext = true;
                break;

            case "created":
            case "manual":
            case "connecting":
                isActive = true;
                label = "Connecting";
                break;

            case "uploading":
                isActive = true;
                var documentCount = this.connection.documentCount;
                if (documentCount === 0 ||
                    !this.ftConnectionListItemShowDocumentCount)
                    label = "Retrieving";
                else
                    label = "Retrieved " + documentCount.toString();
                break;

            case "question":
                isActive = false;
                label = "Fix It";
                showQuiescentButton = true;
                quiescentButtonIcon = "report-problem";
                break;

            case "answered":
                isActive = true;
                label = "Answered";
                break;

            case "completed":
                isActive = true;
                label = "Closing";
                break;

            case "error":
                isActive = false;
                label = "Fix It";
                showQuiescentButton = true;
                quiescentButtonIcon = "report-problem";
                break;

            case "incorrect":
            default:
                isActive = true;
                label = "Refresh";
                break;
        }

        this._activePanelHidden = !isActive;
        // this.$.activeSpinnerLabel.innerHTML = label;
        // this.$.activeSpinner.active = isActive;

        this._quiescentPanelHidden = isActive;
        this._quiescentButtonHidden = !showQuiescentButton;
        this._quiescentSubtextHidden = !showQuiescentSubtext;
        // this.$.quiescentButtonLabel.innerHTML = label;
        // this.$.quiescentButtonIcon.icon = quiescentButtonIcon;
    }

    _onQuiescentButtonTapped(event)
    {
        // TODO: The following is not preventing toggle of the selection...
        event.stopPropagation(); // So that we don't toggle the item selection when the button is clicked
        event.preventDefault();

        const commandEvent = new CustomEvent('action-command', { detail: this.connection, bubbles: true, composed: true });
        this.dispatchEvent(commandEvent);
    }

    _getRefreshDateString(connection)
    {
        if (this.connection === null)
            return "";

        var checkedDate = new Date(connection.checkedDate);

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

}

window.customElements.define('ft-connection-list-item', FtConnectionListItem);

