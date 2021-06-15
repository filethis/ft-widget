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

// List documentation: https://github.com/material-components/material-components-web-components/tree/master/packages/list


import { LitElement, html, css, unsafeCSS } from 'lit';
import { light } from "../../mx-design-tokens/index.js";
import '@material/mwc-list';
import '../ft-institution-list-item/ft-institution-list-item.js';


export class FtInstitutionList extends LitElement {

    static get properties() {
        return {
            institutions: { type: Array },
            selectedInstitution: { type: Object },
            fake: { type: Object }
       };
    }

    constructor() {
        super();

        this.institutions = [];
        this.selectedInstitution = null;
        this.fake = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
            <mwc-list id="list" part="list"
                @selected="${this._onInstitutionSelectedInList}"
            >
                ${!this.institutions ? '' : this.institutions.map(institution => html`
                    <mwc-list-item>
                        <ft-institution-list-item institution=${JSON.stringify(institution)}>
                        </ft-institution-list-item>
                    </mwc-list-item>
                `)}
            </mwc-list>
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
                    position:relative;
                    width: 100%; height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    overscroll-behavior: contain;
                }
                    mwc-list {
                    }
                        mwc-list-item {
                            width: 376px;
                            height: 72px;
                            --mdc-list-side-padding: 0;
                            --mdc-list-vertical-padding: 0;
                        }
                        ft-institution-list-item {
                            width: 376px;
                            padding-left:12px;
                            padding-right:12px;
                            box-sizing: border-box;
                        }
        `
        ];
    }

    scrollToTop() {
        const wrapper = this.shadowRoot.getElementById("wrapper");
        if (wrapper)
            wrapper.scrollTop = 0;
    }

    _onInstitutionSelectedInList(event) {
        var institution = null;
        const institutionIndex = event.detail.index;
        const haveSelection = (institutionIndex >= 0);
        if (haveSelection)
            institution = this.institutions[institutionIndex];
        if (this._institutionChanges(this.selectedInstitution, institution))
            this.selectedInstitution = institution;
    }

    _institutionChanges(first, second) {
        return (this._valueChanges(first, second, (first, second) => first.id != second.id ))
    }

    // TODO: Factor out
    _valueChanges(first, second, test) {

        const firstIsUndefinedOrNull = !first;
        const secondIsUndefinedOrNull = !second;

        const bothAreUndefinedOrNull = (firstIsUndefinedOrNull && secondIsUndefinedOrNull);
        if (bothAreUndefinedOrNull)
            return false;

        const justOneIsUndefinedOrNull = (firstIsUndefinedOrNull || secondIsUndefinedOrNull);
        if (justOneIsUndefinedOrNull)
            return true;

        return test(first, second);
    }

    updated(changedProperties) {
        if (changedProperties.has("selectedInstitution"))
            this._onSelectedInstitutionChanged();
        if (changedProperties.has("fake"))
            this._onFakeChanged();
    }

    _onSelectedInstitutionChanged() {

        // Make sure the list element is selected
        const index = this._indexOfSelectedInstitution();
        var list = this.shadowRoot.getElementById("list");
        list.select(index);

        // Notify
        const event = new CustomEvent('selected-institution-changed', { detail: this.selectedInstitution, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    _indexOfSelectedInstitution() {
        if (this.selectedInstitution == null)
            return -1;
        return this.institutions.findIndex(institution => institution.id == this.selectedInstitution.id);
    }

    _onFakeChanged() {
        if (this.fake)
            this._loadFakeInstitutions();
    }

    _loadFakeInstitutions() {
        var path = "/components/ft-institution-list/dev/fake-institutions.json";

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
}

window.customElements.define('ft-institution-list', FtInstitutionList);

