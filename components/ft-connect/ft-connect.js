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
import '@material/mwc-button';
import { light } from "../../mx-design-tokens/index.js";
import '../ft-fixture/ft-fixture.js';
import '../ft-connect-to-your-account/ft-connect-to-your-account.js'
import '../ft-select-your-institution/ft-select-your-institution.js'
import '../ft-enter-credentials/ft-enter-credentials.js'
import { FtClientMixin } from '../ft-client-mixin/ft-client-mixin.js';


export class FtConnect extends FtClientMixin(LitElement) {

    constructor() {
        super();

        this.live = false;

        // Command event listeners
        this.addEventListener('ft-connect-to-your-account-continue-command', this._onConnectToYourAccountContinueCommand);
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">

            <div id="fixture-panel" part="fixture-panel">

                <ft-fixture id="ft-fixture" part="ft-fixture">
                </ft-fixture>

                <mwc-button id="button" part="button"
                    unelevated
                    label="Continue"
                    @click=${this._onContinueButtonClicked}
                >
                </mwc-button>

            </div>

            <ft-connect-to-your-account id="ft-connect-to-your-account" part="ft-connect-to-your-account">
            </ft-connect-to-your-account>

            <ft-select-your-institution id="ft-select-your-institution" part="ft-select-your-institution">
            </ft-select-your-institution>

            <ft-enter-credentials id="ft-enter-credentials" part="ft-enter-credentials">
            </ft-enter-credentials>

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
                    #fixture-panel {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                    }
                        #ft-fixture {
                        }
                        #button {
                        }
                    #ft-connect-to-your-account {
                        display: none;
                    }
                    #ft-select-your-institution {
                        display: none;
                    }
                    #ft-enter-credentials {
                        display: none;
                    }
        `
        ];
    }

    _onContinueButtonClicked()
    {
        this._goToPanel("ft-connect-to-your-account");
    }

    _onConnectToYourAccountContinueCommand()
    {
        this._goToPanel("ft-select-your-institution");
    }

    _goToPanel(name)
    {
        var showFirst = false;
        var showSecond = false;
        var showThird = false;
        var showFourth = false;

        switch (name)
        {
            case "fixture-panel":
                showFirst = true;
                break;
            case "ft-connect-to-your-account":
                showSecond = true;
                break;
            case "ft-select-your-institution":
                showThird = true;
                break;
            case "ft-enter-credentials":
                showFourth = true;
                break;
        }

        this._setPanelShown("fixture-panel", showFirst);
        this._setPanelShown("ft-connect-to-your-account", showSecond);
        this._setPanelShown("ft-select-your-institution", showThird);
        this._setPanelShown("ft-enter-credentials", showFourth);
    }

    _setPanelShown(panelId, show) {
        var panel = this.shadowRoot.getElementById(panelId)
        if (show)
            panel.style.display = "block";
        else
            panel.style.display = "none";
    }

}

window.customElements.define('ft-connect', FtConnect);

