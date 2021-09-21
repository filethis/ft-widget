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
import '@material/mwc-icon';
import '@material/mwc-button';
import '@material/mwc-icon-button';

export class FtConfirmationDialogPanel extends LitElement {

    static get properties() {
        return {
            commitButtonLabel: { type: String },
            commitButtonEventType: { type: String },
            
            cancelButtonLabel: { type: String },
            cancelButtonEventType: { type: String },
            showCancelButton: { type: Object }
       };
    }

    constructor() {
        super();

        this.commitButtonLabel = "OK";
        this.commitButtonEventType = "commit-button-clicked";

        this.cancelButtonLabel = "Cancel";
        this.cancelButtonEventType = "cancel-button-clicked";
        this.showCancelButton = true;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <slot id="prompt" name="prompt">
                Are you sure you want to do this?
            </slot>

            <div id="buttons">
                <mwc-button id="cancel-button" part="cancel-button" class="button"
                    label="${this.cancelButtonLabel}"
                    outlined
                    @click=${this._onCancelButtonClicked}
                >
                </mwc-button>

                <mwc-button id="commit-button" part="commit-button" class="button"
                    unelevated
                    label="${this.commitButtonLabel}"
                    @click=${this._onCommitButtonClicked}
                >
                </mwc-button>
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
                width: 400px;
                height: 650px;
                font-family: ${unsafeCSS(light.Font.Regular)};
            }
            #wrapper {
                margin: 30px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
            }
                #buttons {
                    margin-top: 30px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;
                }
                    #cancel-button {
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                    }
                    #commit-button {
                        margin-left: 25px;
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Brand300)};
                        --mdc-theme-on-primary: white;
                    }
        `
        ];
    }

    enter() {
    }

    exit() {
    }

    updated(changedProperties) {
        if (changedProperties.has("commitButtonLabel"))
            this._onCommitButtonLabelChanged();
        if (changedProperties.has("cancelButtonLabel"))
            this._onCancelButtonLabelChanged();
        if (changedProperties.has("showCancelButton"))
            this._onShowCancelButtonChanged();
    }

    _onCommitButtonLabelChanged() {
        var button = this.shadowRoot.getElementById("commit-button");
        button.label = this.commitButtonLabel;
    }

    _onCancelButtonLabelChanged() {
        var button = this.shadowRoot.getElementById("cancel-button");
        button.label = this.cancelButtonLabel;
    }

    _onShowCancelButtonChanged() {
        var button = this.shadowRoot.getElementById("cancel-button");
        if (this.showCancelButton)
            button.style.display = "block";
        else
            button.style.display = "none";
    }

    _onCommitButtonClicked() {
        var button = this.shadowRoot.getElementById("commit-button");
        button.blur();
        const newEvent = new CustomEvent(this.commitButtonEventType, { bubbles: true, composed: true });
        this.dispatchEvent(newEvent);
    }

    _onCancelButtonClicked() {
        var button = this.shadowRoot.getElementById("cancel-button");
        button.blur();
        const newEvent = new CustomEvent(this.cancelButtonEventType, { bubbles: true, composed: true });
        this.dispatchEvent(newEvent);
    }

}

window.customElements.define('ft-confirmation-dialog-panel', FtConfirmationDialogPanel);

