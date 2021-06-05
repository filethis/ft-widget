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

export class FtInstitutionListItem extends LitElement {

    static get properties() {
        return {
            institution: { type: Object },
            fake: { type: Object }
       };
    }

    constructor() {
        super();

        this.institution = {};
        this.fake = false;
    }

    render() {
        return html`

        <div id="wrapper" part="wrapper">
        
            <div id="logo" part="logo" on-tap="_onSourceClicked">
                <img id="logo-image" part="logo-image" src="${!this.institution ? '' : this.institution.logoUrl}">
            </div>
        
            <div id="text" part="text">
        
                <div id="name" part="name">
                    ${!this.institution ? '' : this.institution.name}
                </div>
        
                <div id="address" part="address">
                    ${!this.institution ? '' : this._getDomain()}
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
                height: 72px;
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                }
                    #logo {
                        width: 100px;
                        height: 50px;
                        min-width: 100px;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                    }
                        #logo-image {
                            width:auto;
                            max-width:100%;
                        }
                #text {
                    flex: 1;
                    min-width: 0;  /* Override flex default of "auto" which prevents shrinking past content */
                    margin-left: 12px;
                    margin-right: 12px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                }
                    #name {
                        font-size: ${unsafeCSS(light.FontSize.Body)}px;
                        font-weight: ${unsafeCSS(light.FontWeight.Semibold)};
                        line-height: ${unsafeCSS(light.LineHeight.Body)}px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    #address {
                        font-size: ${unsafeCSS(light.FontSize.Small)}px;
                        line-height: ${unsafeCSS(light.LineHeight.Small)}px;
                        color: ${unsafeCSS(light.Color.Neutral700)};
                        overflow: hidden;
                        text-overflow: ellipsis;
                }
        `
        ];
    }

    updated(changedProperties) {
        if (changedProperties.has("fake"))
            this._onDemoChanged();
    }

    _onDemoChanged() {
        if (this.fake)
            this._loadFakeInstitution();
    }

    _loadFakeInstitution() {
        var path = "/components/ft-institution-list-item/dev/fake-institution.json";

        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', path, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 &&
                request.status === 200) {
                var institution = JSON.parse(request.responseText);
                this.institution = institution;
            }
        }.bind(this);
        request.send();
    }

    _getDomain() {
        const homePageUrl = this.institution.homePageUrl;
        if (!homePageUrl)
            return;
        return new URL(homePageUrl).hostname;
    }
}

window.customElements.define('ft-institution-list-item', FtInstitutionListItem);

