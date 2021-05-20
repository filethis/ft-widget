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
export class FtChallenge extends LitElement {

    static get properties() {
        return {
            /**
             * When true, the element is "live" and will communicate with the FileThis service.
             *
             * Note that you can provide the strings "true" and "false" as attribute values.
             *
             * @type {boolean}
             */
            live:
            {
                type: Object,
                value: true,
                observer: "_onLiveChanged"
            },

            /** The "base" URL for requests. For example: "https://filethis.com". Note that you should __not__ use a trailing slash. */
            server:
            {
                type: String,
                value: "https://filethis.com"
            },

            /** The path under the baseUrl used for API requests. For example: "/api/v1". Note that you should use a leading slash, and no trailing slash. */
            apiPath:
            {
                type: String,
                value: "/api/v1"
            },

            /** The user's FileThis account id. */
            userAccountId: {
                type: String,
                value: ""
            },

            /** The end-user FileThis token. Used to authenticate and authorize requests to the FileThis API endpoints. */
            token:
            {
                type: String,
                value: ""
            },

            /** The user's FileThis account resource. */
            account:
            {
                type: Object,
                notify: true,
                value: null
            },

            /** The list FileThis source (fetchable website) resources. */
            sources:
            {
                type: Array,
                notify: true,
                value: []
            },

            /** The id of the currently-selected filter. */
            selectedFilterId: {
                type: String,
                notify: true,
                observer: "_onSelectedFilterIdChanged"
            },

            /** The list of all the user's FileThis connection resources. */
            connections:
            {
                type: Array,
                value: [],
                notify: true
            },

            /** The list of all the user's FileThis fetched document resources. */
            documents:
            {
                type: Array,
                value: [],
                notify: true
            },

            /** Version of user interaction schema to use. */
            interactionVersion:
            {
                type: Object,  // JSON
                value: "1.0.0"
            },

            /** The list of all pending user interaction resources. */
            _interactionRequests:
            {
                type: Array,
                value: []
            },

            /** When set, various debugging options are enabled, including the display of a log4javascript log window. */
            debug:
            {
                type: Object,
                value: false,
                notify: true
            },

            /** When set, the fake institutions are injected into the list of sources. */
            fakeSources:
            {
                type: Object,
                value: false,
                notify: true
            },

            /** When set, fake local data is used. Note that many functions that operate on FileThis resources will not work with this fake data. This is useful for rendering the UI in a quiescent state so that it "looks good". */
            fakeData:
            {
                type: Object,
                value: false,
                notify: true
            },

            /** The relative path where fake data can be found. Must have trailing slash. */
            fakeDataPath:
            {
                type: String,
                value: "../node_modules/ft-connect-behavior/demo/data/",
                notify: true
            },

            _uploadableFileTypes:
            {
                type: String,
                value: "application/pdf"
            },

            /** The current user interaction request being handled. */
            _interactionRequest:
            {
                type: Object
            },

            /** The URL for the current document download. */
            _downloadUrl:
            {
                type: String,
                value: ""
            },

            /** The filename for the current document download. */
            _downloadFilename:
            {
                type: String,
                value: ""
            },

            _interactionResponse:
            {
                type: Object
            },

            /**
             * A flag that controls whether this component should poll the FileThis service for new pending change notification resources.
             *
             * Note that this property will likely go away once the component supports websockets.
             */
            pollForChangeNotifications:
            {
                type: Boolean,
                value: true
            },

            // TODO: Factor these out. Used only by ft-connect-expand-out

            _showConnectionPanel:
            {
                type: Boolean,
                notify: true,
                value: false
            },

            _showDocumentPanel:
            {
                type: Boolean,
                notify: true,
                value: false
            }

        },


            // Application data members ------------------------------------------------------------------

            // Note: These are effectively "static" class variables, not instance variables. We can get away with this
            // because we only ever instantiate one application object. We like not having these in the Polymer instance
            // properties above where they would pollute that context (which they would do even if they were "private").

            _lastChangeNotificationHandledOrdinal: null,

                // Connection changes
                _createdDocuments: { },
        _deletedDocuments: { },
        _createdDerivatives: { },
        _createdConnections: { },
        _deletedConnections: { },
        _updatedConnections: { },
        _updatedConnectionStateProperties: { },
        _updatedConnectionValidationProperties: { },
        _updatedConnectionDocumentCountProperties: { },

        // User interaction request changes
        _createdInteractionRequests: { },
        _deletedInteractionRequests: { },
        
        };
    }

    constructor() {
        super();
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                overflow: hidden;
                border: solid 1px gray;
                width: 400px;
                height: 650px;
                padding: 25px;
            }
        `,
            Layouts
        ];
    }

    render() {
        return html`

        <div class="layout vertical center">

        </div>

        `;
    }
}

window.customElements.define('ft-client', FtChallenge);

