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
import { light } from "../../mx-design-tokens/index.js";
import '@material/mwc-textfield';
import '@material/mwc-icon';
import '@material/mwc-icon-button';
import '../ft-institution-list/ft-institution-list.js';

export class FtInstitutionsPanel extends LitElement {

    static get properties() {
        return {
            institutions: { type: Array },
            showBackButton: { type: Object },
            _searchPattern: { type: String },
            _haveSearchPattern: { type: Boolean },
            _institutionsFilteredAndSorted: { type: Array },
            fake: { type: Object }
        };
    }

    constructor() {
        super();

        this.institutions = [];
        this.showBackButton = true;
        this._searchPattern = "";
        this._haveSearchPattern = false;
        this._institutionsFilteredAndSorted = [];
        this.fake = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <div id="header" part="header">
                <mwc-icon-button id="back-button" part="back-button"
                    icon="arrow_back"
                    @click=${this._onBackButtonClicked}
                >
                </mwc-icon-button>
            </div>
        
            <div id="title" part="title">
                Select your institution
            </div>

            <mwc-textfield id="search" part="search"
                outlined
                label="Search"
                icon="search"
                value="${this._searchPattern}"
                @input="${this._onSearchFieldChanged}"
            >
            </mwc-textfield>
        
            <ft-institution-list id="ft-institution-list" part="ft-institution-list"
                institutions=${JSON.stringify(this._institutionsFilteredAndSorted)}
                fake=${this.fake}
            >
            </ft-institution-list>
        
            <div id="footer" part="footer">
                <ft-private-and-secure id="private-and-secure" part="private-and-secure">
                </ft-private-and-secure>
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
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                }
                    #header{
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                        height: 56px;
                    }
                        #back-button{
                            margin-left: 5px;
                            margin-top: 4px;
                        }
                    #title {
                        margin-left: 24px;
                        margin-right: 24px;
                        height: 32px;
                        font-size: ${unsafeCSS(light.FontSize.H2)}px;
                        font-weight: ${unsafeCSS(light.FontWeight.Bold)};
                        line-height: ${unsafeCSS(light.LineHeight.H2)}px;
                        text-align: left;
                        color: ${unsafeCSS(light.Color.Neutral900)};
                    }
                    #search {
                        margin-top: 20px;
                        margin-left: 24px;
                        margin-right: 24px;
                        height: 44px;
                        --mdc-theme-primary: ${unsafeCSS(light.Color.Primary300)};
                        --mdc-text-field-outlined-idle-border-color: ${unsafeCSS(light.Color.Neutral600)};
                        --mdc-text-field-outlined-hover-border-color: ${unsafeCSS(light.Color.Neutral900)};
                        --mdc-text-field-ink-color: ${unsafeCSS(light.Color.Neutral900)};
                        --mdc-text-field-label-ink-color: ${unsafeCSS(light.Color.Neutral600)};
                    }
                    #ft-institution-list {
                        flex: 1;
                        margin-top: 12px;
                        margin-left: 12px;
                        width: 376px;
                        height: 430px;
                    }
                    #footer {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: flex-start;
                        background-color: ${unsafeCSS(light.Color.Neutral100)};
                    }
                        #private-and-secure {
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }
        `
        ];
    }

    enter() {
        setTimeout(() => {
            const searchField = this.shadowRoot.getElementById("search");
            searchField.focus();
        }, 200);
    }

    exit() {
        this._clear();
    }

    _clear() {
        var list = this.shadowRoot.getElementById("ft-institution-list");
        list.selectedInstitution = null;

        this._clearSearchField();
    }

    _clearSearchField() {
        this._searchPattern = "";
    }

    _onBackButtonClicked()
    {
        const event = new CustomEvent('institution-back-button-clicked', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    _onSearchFieldChanged()
    {
        var field = this.shadowRoot.getElementById("search");
        const value = field.value;
        this._searchPattern = value;
        this._haveSearchPattern = (!!value)
    }

    updated(changedProperties) {
        if (changedProperties.has('showBackButton'))
            this._onShowBackButtonChanged();
        if (changedProperties.has('_searchPattern'))
            this._updateFilteredInstitutionsDebounced();
        if (changedProperties.has('institutions'))
            this._updateFilteredInstitutions();
    }

    _onShowBackButtonChanged() {
        this._setElementShown("back-button", this.showBackButton);
    }

    _setElementShown(panelId, show) {
        var panel = this.shadowRoot.getElementById(panelId)
        if (show)
            panel.style.display = "block";
        else
            panel.style.display = "none";
    }

    _updateFilteredInstitutionsDebounced() {
        this.debounce(
            this._updateFilteredInstitutions.bind(this),
            250
        )();
    }

    _updateFilteredInstitutions() {
        if (!this.institutions) {
            this._institutionsFilteredAndSorted = [];
            return;
        }

        const filteredInstitutions = this.institutions.filter(this._searchFilter.bind(this));
        const filteredAndSortedInstitutions = filteredInstitutions.sort(this._institutionSort);

        this._institutionsFilteredAndSorted = filteredAndSortedInstitutions;
            
    }

    _institutionSort(first, second) {
        const firstName = first.name.toLowerCase();
        const secondName = second.name.toLowerCase();
        return (firstName.localeCompare(secondName));
    }

    _searchFilter(institution) {
        const pattern = this._searchPattern.toLowerCase();
        if (pattern == "")
            return true;
        const name = institution.name.toLowerCase();
        return name.includes(pattern);
    }

    // TODO: Factor out
    debounce(func, wait, immediate)
    {
        var timeout;
        return function ()
        {
            var context = this, args = arguments;
            var later = function ()
            {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

window.customElements.define('ft-institutions-panel', FtInstitutionsPanel);

