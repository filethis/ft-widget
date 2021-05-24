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
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import './components/ft-connect-to-your-account/ft-connect-to-your-account.js';
import './components/ft-select-your-institution/ft-select-your-institution.js';
import './components/ft-enter-credentials/ft-enter-credentials.js';
import './components/ft-manage-connections/ft-manage-connections.js';
import './components/ft-connect/ft-connect.js';
import './components/ft-manage/ft-manage.js';
import './components/ft-gallery/ft-gallery.js';
import './components/ft-challenge/ft-challenge.js';
import { light } from "./mx-design-tokens/index.js";


export class FtWidget extends LitElement {

    static get properties()
    { 
        return {
            institutions: { type: Array },
            connections: { type: Array },
            _selectedTabIndex: { type: Number }
        }
    }

    constructor()
    {
        super();

        // this.institutions = [];
        // this.connections = [];

        var selectedTabIndex = localStorage.getItem('tabIndex');
        if (selectedTabIndex == null)
            selectedTabIndex = 0;
        this._selectedTabIndex = selectedTabIndex

        this._loadFakeInstitutions();
        this._loadFakeConnections();
    }

    firstUpdated()
    {
        this.shadowRoot.addEventListener('MDCTabBar:activated', this._onTabBarActivated.bind(this));
    }

    render()
    {
        return html`
            <mwc-tab-bar id="tab-bar" part="tab-bar"
                activeIndex=${this._selectedTabIndex}
            >
                <mwc-tab label="Start"></mwc-tab>
                <mwc-tab label="Fixture"></mwc-tab>
                <mwc-tab label="Gallery"></mwc-tab>
            </mwc-tab-bar>

            <div id="content" part="content">

                <div id="start-panel" part="start-panel">
                    Start
                </div>

                <div id="fixture-panel" part="fixture-panel">
                    Fixture
                </div>

                <ft-gallery id="gallery-panel" part="gallery-panel">
                </ft-gallery>

            </div>

        `;
    }

    static get styles() {
        return [
            super.styles || [],
            css`
            :host {
                display: block;
                border: solid 1px gray;
                padding: 16px;
                max-width: 800px;
                font-family: ${unsafeCSS(light.Font.Regular)};
                background-color: ${unsafeCSS(light.Color.Neutral100)};
                display: flex;
                flex-direction: column;
                align-items: center;
            }
                mwc-tab-bar {
                }
                    mwc-tab {
                    }
                #content {
                }
                    #start-panel {
                    }
                    #fixture-panel {
                    }
                    #gallery-panel {
                    }
            /* .floating {
                border: solid 1px gray;
                border-radius: 8px;
            } */
        `];
    }

    _loadFakeInstitutions() {
        var path = "./assets/ft-fake-institutions.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200) {
                var institutions = JSON.parse(request.responseText);
                this.institutions = institutions;
            }
        }.bind(this);
        request.send();
    }

    _loadFakeConnections() {
        var path = "./assets/ft-fake-connections.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200) {
                var connections = JSON.parse(request.responseText);
                this.connections = connections;
            }
        }.bind(this);
        request.send();
    }

    _onTabBarActivated(event)
    {
        this._goToPanel(event.detail.index);
    }

    _goToPanel(index)
    {
        var showFirst = false;
        var showSecond = false;
        var showThird = false;

        switch (index)
        {
            case 0:  // start-panel
                showFirst = true;
                break;
            case 1:  //fixture-panel
                showSecond = true;
                break;
            case 2:  // gallery-panel
                showThird = true;
                break;
        }

        this._setPanelShown("start-panel", showFirst);
        this._setPanelShown("fixture-panel", showSecond);
        this._setPanelShown("gallery-panel", showThird);

        localStorage.setItem('tabIndex', index);
    }

    _setPanelShown(panelId, show) {
        var panel = this.shadowRoot.getElementById(panelId)
        if (show)
            panel.style.display = "block";
        else
            panel.style.display = "none";
    }
}

window.customElements.define('ft-widget', FtWidget);
