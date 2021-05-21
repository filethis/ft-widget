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

export class FtPrivateAndSecure extends LitElement {

    render() {
        return html`

        <div id="wrapper" part="wrapper">
            <div id="lock-and-private" part="lock-and-private">
                <img id="lock" part="lock" src="./components/ft-enter-credentials/assets/lock.png" />
                <div id="private" part="private">
                    Private and secure
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
                height: 16px;
            }
                #wrapper {
                    position:relative;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                    #lock-and-private {
                        margin-top: 3px;
                        height: 16px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                    }
                        #lock {
                            width: 12px;
                            height: 16px;
                        }
                        #private {
                            margin-left: 6px;
                            width: 120px;
                            height: 16px;
                            font-size: ${unsafeCSS(light.FontSize.Small)}px;
                            line-height: ${unsafeCSS(light.LineHeight.Small)}px;
                            color: ${unsafeCSS(light.Color.Neutral900)};
                        }

        `
        ];
    }
}

window.customElements.define('ft-private-and-secure', FtPrivateAndSecure);

