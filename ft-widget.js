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
import './components/ft-fixture/ft-fixture.js';
import { light } from "./mx-design-tokens/index.js";
import { Workflow } from './components/ft-connect/ft-connect.js'


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
            <div id="header">

                <div id="title">
                    FileThis Connect Widget SDK
                </div>

                <mwc-tab-bar id="tab-bar"
                    activeIndex=${this._selectedTabIndex}
                >
                    <!-- <mwc-tab label="Start"></mwc-tab> -->
                    <mwc-tab label="Fixture"></mwc-tab>
                </mwc-tab-bar>

                <div id="header-spacer"></div>

                <div id="version">Version 1.0.18</div>

            </div>

            <div id="content">

                <!-- <div id="start-panel">
                    Start
                </div> -->

                <ft-fixture id="fixture-panel"
                    workflow=${Workflow.ADD}
                >
                </ft-fixture>

            </div>

        `;
    }

    static get styles() {
        return [
            super.styles || [],
            css`
            :host {
                display: block;
                font-family: ${unsafeCSS(light.Font.Regular)};
                background-color: ${unsafeCSS(light.Color.Neutral100)};
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: stretch;
            }
                #header {
                    padding-top: 10px;
                    padding-bottom: 10px;
                    /* border-bottom: 2px solid ${unsafeCSS(light.Color.Neutral800)}; */
                    border-bottom: 2px solid #DDD;
                    background-color: white;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                }
                    #title {
                        margin-left: 24px;
                        font-size: 16pt;
                    }
                    mwc-tab-bar {
                        margin-left: 50px;
                        width: 400px;
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                    }
                        mwc-tab {
                        }
                    #header-spacer {
                        flex: 1;
                    }
                    #version {
                        margin-right: 30px;
                        font-size: ${unsafeCSS(light.FontSize.XSmall)}px;
                        line-height: ${unsafeCSS(light.LineHeight.XSmall)}px;
                        color: ${unsafeCSS(light.Color.Neutral600)};
                    }
                #content {
                    flex: 1;
                }
                    #start-panel {
                        height: 100%
                    }
                    #fixture-panel {
                        height: 100%
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

        switch (index)
        {
            case 0:  // start-panel
                showFirst = true;
                break;
            case 1:  //fixture-panel
                showSecond = true;
                break;
        }

        this._setPanelShown("start-panel", showFirst);
        this._setPanelShown("fixture-panel", showSecond);

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
