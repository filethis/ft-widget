/*
Copyright 2018 FileThis, Inc.

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

// import 'log4javascript/log4javascript.js';
import { FtHttpMixin } from '../ft-http-mixin/ft-http-mixin.js';


export const FtClientMixin = (base) =>
    class FtClient extends FtHttpMixin(base)
    {
        static get properties() {
            return {

                /** When true, the element is "live" and will communicate with the FileThis service. */
                isLive: { type: Object },

                /** The "base" URL for requests. For example: "https://filethis.com". Note that you should __not__ use a trailing slash. */
                server: { type: String },

                /** The path under the baseUrl used for API requests. For example: "/api/v1". Note that you should use a leading slash, and no trailing slash. */
                apiPath: { type: String },

                /** The user's FileThis account id. */
                userAccountId: { type: String },

                /** The end-user FileThis token. Used to authenticate and authorize requests to the FileThis API endpoints. */
                userAccessToken: { type: String },

                /** The user's FileThis account resource. */
                account: { type: Object },

                /** The list FileThis institution (fetchable website) resources. */
                institutions: { type: Array },

                /** The id of the currently-selected filter. */
                selectedFilterId: { type: String },

                /** The list of all the user's FileThis connection resources. */
                connections: { type: Array },

                /** The list of all the user's FileThis fetched document resources. */
                documents: { type: Array },

                /** The list of all pending user interaction request resources. */
                interactionRequests: { type: Array },

                /** Version of user interaction schema to use. */
                interactionVersion: { type: Object },  /* JSON */

                /** When set, various debugging options are enabled, including the display of a log4javascript log window. */
                debug: { type: Boolean },

                /** When set, the fake institutions are injected into the list of institutions. */
                fakeInstitutions: { type: Boolean },

                /** When set, fake local data is used. Note that many functions that operate on FileThis resources will not work with this fake data. This is useful for rendering the UI in a quiescent state so that it "looks good". */
                fakeData: { type: Boolean },

                /** The relative path where fake data can be found. Must have trailing slash. */
                fakeDataPath: { type: String },

                /** A flag that controls whether this component should poll the FileThis service for new pending change notification resources. */
                pollForChangeNotifications: { type: Boolean }
            };
        }

        constructor()
        {
            super();

            // Reactive property initialization
            this.isLive = false;
            this.server = "https://filethis.com";
            this.apiPath = "/api/v1";
            this.userAccountId = "";
            this.account = null;
            this.institutions = [];
            this.selectedFilterId = null;
            this.interactionRequests = [];
            this.connections = [];
            this.documents = [];
            this.interactionVersion = "1.0.0";
            this.debug = false;
            this.fakeInstitutions = false;
            this.fakeData = false;
            this.fakeDataPath = "../node_modules/ft-connect-behavior/demo/data/";
            this.pollForChangeNotifications = true;

            // Non-reactive instance variable initialization
            this._interactionRequest = null;  // The current user interaction request being handled
            this._uploadableFileTypes = "application/pdf";
            this._downloadUrl = "";  // The URL for the current document download
            this._downloadFilename = "";  // The filename for the current document download
            this._lastChangeNotificationHandledOrdinal = null;
            this._createdDocuments = {};
            this._deletedDocuments = {};
            this._createdDerivatives = {};
            this._createdConnections = {};
            this._deletedConnections = {};
            this._updatedConnections = {};
            this._updatedConnectionStateProperties = {};
            this._updatedConnectionValidationProperties = {};
            this._updatedConnectionDocumentCountProperties = {};
            this._connectionPattern = /^\/connections\/([a-zA-Z0-9]+)$/;
            this._connectionStatePattern = /^\/connections\/([a-zA-Z0-9]+)\/state\/([a-zA-Z]+)$/;
            this._connectionValidationPattern = /^\/connections\/([a-zA-Z0-9]+)\/validation\/([a-zA-Z]+)$/;
            this._connectionDocumentCountPattern = /^\/connections\/([a-zA-Z0-9]+)\/documentCount\/([0-9]+)$/;
            this._interactionPattern = /^\/connections\/([a-zA-Z0-9]+)\/interactions\/([a-zA-Z0-9]+)$/;
            this._documentPattern = /^\/documents\/([a-zA-Z0-9]+)$/;
            this._derivativePattern = /^\/documents\/([a-zA-Z0-9]+)\/derivatives\/(thumbnail-medium)$/;  // TODO: For now
            this._createdInteractionRequests = {};
            this._deletedInteractionRequests = {};

            // Command event listeners
            this.addEventListener('create-connection-command', this._onCreateConnectionCommandInternal);
            this.addEventListener('download-documents-command', this._onDownloadDocumentsCommand);
            this.addEventListener('upload-documents-command', this._onUploadDocumentsCommand);
            this.addEventListener('delete-connection-command', this._onDeleteConnectionCommand);
            this.addEventListener('delete-document-command', this._onDeleteDocumentCommand);
            this.addEventListener('action-command', this._onActionCommand);
        }

        connectedCallback()
        {
            super.connectedCallback();

            // TODO: Is this really the best place to put this?

            setInterval(this._changeNotificationPoller.bind(this), 1000);  // Poll for change notifications
        }

        updated(changedProperties)
        {
            super.updated?.(changedProperties);

            if (changedProperties.has('selectedFilterId'))
                this._onSelectedFilterIdChanged();
            if (changedProperties.has('isLive'))
                this._onLiveChanged();
            if (changedProperties.has('institutions'))
            {
                var foo = "bar";
            }
        }

        _onLiveChanged()
        {
            this._lastChangeNotificationHandledOrdinal = null;
            this._processingChangeNotifications = false;

            if (this.isLive)
                this.getAllData();
        }

        // TODO: Move this outside of the client !!!
        /**
         * Poses dialog window for the next pending user interaction request, if there is one.
         */
        // poseNextPendingInteractionRequest() {
        //     if (this.interactionRequests.length === 0)
        //         return;

        //     // If we already have a dialog posed
        //     if (this.$.modalInteractionDialog.opened)
        //         return;

        //     // Pose the first request
        //     var interactionRequest = this.interactionRequests[0];
        //     this._interactionRequest = interactionRequest;
        //     this.$.modalInteractionDialog.open();
        //     return interactionRequest;
        // }
        // _poseNextPendingInteractionRequest() {
        //     return this.poseNextPendingInteractionRequest();
        // }
        // _poseInteractionForConnection(connection) {
        //     var count = this.interactionRequests.length;
        //     if (count === 0)
        //         return;

        //     // If we already have a dialog posed
        //     if (this.$.modalInteractionDialog.opened) {
        //         this.logInfo("There is already a user interaction request dialog posed");
        //         return;
        //     }

        //     var connectionId = connection.id;

        //     var interactionRequestForConnection = null;
        //     for (var index = 0; index < count; index++) {
        //         var interactionRequest = this.interactionRequests[index];
        //         if (interactionRequest.connectionId === connectionId) {
        //             interactionRequestForConnection = interactionRequest;
        //             break;
        //         }
        //     }
        //     if (interactionRequestForConnection === null)
        //         return;

        //     this._interactionRequest = interactionRequestForConnection;
        //     this.$.modalInteractionDialog.open();
        // }
        // _onInteractionRequestsListChanged(to, from) {
        //     var alreadyInitialized = (from !== undefined);
        //     if (alreadyInitialized)
        //         this._poseNextPendingInteractionRequest();
        // }
        // _onInteractionRequestsSplicesChanged(changeRecord) {
        //     if (!changeRecord)
        //         return;

        //     var alreadyInitialized = (changeRecord !== undefined);
        //     if (alreadyInitialized)
        //         this._poseNextPendingInteractionRequest();
        // }

        _changeNotificationPoller()
        {
            if (!this.pollForChangeNotifications)
                return;
            if (!this.isLive)
                return;
            if (this._processingChangeNotifications)
                return;

            this._processChangeNotifications();
        }

        _onSelectedFilterIdChanged()
        {
            this._getInstitutions();
        }


        // User action event handling --------------------------------------------------------------------------

        _onCreateConnectionCommandInternal(event)
        {
            var createConnectionDialog = event.detail;
            var username = createConnectionDialog.username;
            var password = createConnectionDialog.password;
            var institution = createConnectionDialog.institution;
            this._createConnection(username, password, institution);
        }

        _onDownloadDocumentsCommand(event)
        {
            var document = event.detail;
            this._downloadDocument(document);
        }

        _downloadDocument(document)
        {
            if (this.fakeData)
                return Promise.resolve();

            // NOTE: This is not an ideal way to download documents, but I could not get the standard method
            // to work. See: _downloadDocumentShouldWorkButDoesNot(). Here, we have to make a request to get
            // the filename before we download the actual file. Also, because we can't add headers to the
            // request, we have to pass both the ticket and the "Accept" type as URL parameters instead.
            // We had to add a new "accept" URL parameter on the server side to accommodate this. Kind of ugly...

            var documentId = document.id;

            var url = this.server + this.apiPath +
                "/documents/" + documentId;
            var options = this._buildHttpOptions();
            return this.httpGet(url, options)
                .then(function (document) {
                    this._downloadFilename = document.name;
                    this._downloadUrl = this.server + this.apiPath +
                        "/documents/" + documentId +
                        "?ticket=" + this.userAccessToken +
                        "&accept=application%2Fpdf";

                    this.$.downloader.click();
                }.bind(this))
                .catch(function (error) {
                    this._handleError(error);
                }.bind(this));
        }

        _downloadDocumentShouldWorkButDoesNot(document)
        {
            if (this.fakeData)
                return Promise.resolve();

            // TODO: Spent a lot of time trying to get this standard method for downloading files to work.
            // Best I can figure, this is some kind of cross-site problem. When call the click() method,
            // nothing happens...
            // AN IDEA: Check the "isTrusted" property of the event

            var documentId = document.id;
            var url = this.server + this.apiPath +
                "/documents/" + documentId;

            var options = this._buildHttpOptions();
            options.headers["Accept"] = "application/pdf";
            options.responseType = "blob";

            return this.httpGet(url, options)
                .then(function (responseAsBlob) {
                    var url = window.URL.createObjectURL(responseAsBlob);
                    this._downloadUrl = url;
                    this._downloadFilename = "foo.pdf";
                    this.$.downloader.click();
                    window.URL.revokeObjectURL(url);
                }.bind(this))
                .catch(function (error) {
                    this._handleError(error);
                }.bind(this));
        }

        _onUploadDocumentsCommand()
        {
            this._chooseFilesToUpload();
        }

        _chooseFilesToUpload()
        {
            // Simulate a mouse click on our hidden "uploader" element to make it prompt the user to choose files.
            // If the user does so, the uploader will emit an event that we handle with _onUploaderFilesChanged().
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('click', true, false);
            var uploader = this.$.uploader;
            uploader.dispatchEvent(clickEvent);
        }

        _onUploaderFilesChanged(event)
        {
            // Turn the given FileList into a proper array
            var filesAsArray = [];
            var files = event.target.files;
            var count = files.length;
            for (var index = 0; index < count; index++) {
                var file = files[index];
                filesAsArray.push(file);
            }

            this._uploadFiles(filesAsArray);
        }

        _uploadFiles(files)
        {
            // TODO: What we really want here is some nice progress feedback for the user

            var uploads = files.map(this._uploadFile.bind(this));

            return Promise.all(uploads)
                .catch(function (reason) {
                    this._handleError(reason);

                    // TODO: Display something to the user and suggest what they ought to do
                }.bind(this));
        }

        _uploadFile(file)
        {
            if (this.fakeData)
                return Promise.resolve([]);

            // Create a FormData instance
            var formData = new FormData();

            // Add properties to the form
            var properties = {
                filename: file.name
            };
            var propertiesAsString = JSON.stringify(properties);
            formData.append("properties", propertiesAsString);

            // Add the file to the form
            formData.append("file", file);

            var url = this.server + this.apiPath +
                "/documents/";
            var options = this._buildHttpOptions();

            // We do NOT want to set the Content-Type to "multipart/form-data" explicitly here, as it MUST be done
            // by the XMLHttpRequest instance which will add it, appending the "boundary" string to it.

            return this.httpPost(url, formData, options);
        }

        _onDeleteDocumentCommand(event)
        {
            var document = event.detail;
            this._onDeleteDocument(document)
                .catch(function (reason) {
                    this._handleError(reason);
                }.bind(this));
        }

        _onDeleteConnectionCommand(event)
        {
            var connection = event.detail;
            this._onDeleteConnection(connection)
                .catch(function (reason) {
                    this._handleError(reason);
                }.bind(this));
        }

        _onActionCommand(event)
        {
            var connection = event.detail;
            this._handleConnectionAction(connection);
        }

        _handleConnectionAction(connection)
        {
            switch (connection.state) {
                case "waiting":
                    this._startManualFetch(connection);
                    break;

                case "question":
                    this._poseInteractionForConnection(connection);
                    break;

                default:
                    break;
            }
        }

        _startManualFetch(connection)
        {
            if (this.fakeData)
                return Promise.resolve();

            // TODO: Shouldn't we disable the fetch button to prevent double-clicking?
            // Perhaps anticipate the change of connection "state" on the server by changing it immediately.

            var url = this.server + this.apiPath +
                "/connections/" + connection.id +
                "/fetch";
            var options = this._buildHttpOptions();

            return this.httpPost(url, null, options);
        }

        /**
         * Refresh all resource data by asking the server for it. There is normally no reason to call this method
         * explicitly, as it is called automatically when the element is first connected to the server.
         *
         * @return {Object} A promise that resolves when all data has been gotten.
         */
        getAllData()
        {
            Promise.resolve()
                .then(this._getAccount.bind(this))  // Rest of promise chain depends on having the account record
                .then(function () {
                    this._getDocuments();  // Nothing in the rest of promise chain depends on having documents
                    return this._getInstitutions();
                }.bind(this))
                .then(this._getConnections.bind(this))  // Depends on institutions in order to render
                .then(this._getInteractionRequests.bind(this))  // Depends on connections, though only for now
                .then(function () {
                    this._processingChangeNotifications = false;  // In case we got here after failing to get them
                }.bind(this))
                .catch(function (reason) {
                    this._processingChangeNotifications = false;  // In case we got here after failing to get them
                    this._handleError(reason);
                }.bind(this));
        }


        // Actions -------------------------------------------------------------------------

        _getAccount()
        {
            if (this.fakeData) {
                return new Promise(function (fulfill) {
                    var account = { "id": "123" };  // TODO: Move data into file to have more complete properties?
                    this.account = account;
                    fulfill(account)
                }.bind(this));
            }

            var url = this.server + this.apiPath +
                "/accounts/" + this.userAccountId;
            var options = this._buildHttpOptions();
            return this.httpGet(url, options)
                .then(function (account) {
                    this.account = account;
                    return account;
                }.bind(this));
        }

        _getInstitutions()
        {
            if (this.fakeData) {
                var fakeDataUrl = this.fakeDataPath + "fake-institutions.json";
                return this.httpGet(fakeDataUrl)
                    .then(function (institutions) {
                        this.institutions = institutions;
                        return institutions;
                    }.bind(this));
            }

            var url = this.server + this.apiPath +
                "/sources";
            if (!!this.selectedFilterId)
                url += "?filter=" + this.selectedFilterId;
            var options = this._buildHttpOptions();
            return this.httpGet(url, options)
                .then(function (institutions) {
                    if (this.fakeInstitutions)  // && this.selectedFilterId === "all")
                        this._prependFakeInstitution(institutions);
                    this.institutions = institutions;
                    return institutions;
                }.bind(this));
        }

        _getConnections()
        {
            if (this.fakeData) {
                var fakeDataUrl = this.fakeDataPath + "fake-connections.json";
                return this.httpGet(fakeDataUrl)
                    .then(function (connections) {
                        this.connections = connections;
                        return connections;
                    }.bind(this));
            }

            var url = this.server + this.apiPath +
                "/connections";
            var options = this._buildHttpOptions();
            return this.httpGet(url, options)
                .then(function (connections) {
                    this.connections = connections;
                    connections.forEach(function (connection) {
                        this._injectLogoUrlIntoConnection(connection);
                        this._injectHomePageUrlIntoConnection(connection);
                    }.bind(this));
                    return connections;
                }.bind(this));
        }

        _getConnection(connectionId)
        {
            if (this.fakeData)
                return Promise.resolve();  // Will not make the caller happy...

            var url = this.server + this.apiPath +
                "/connections/" + connectionId;
            var options = this._buildHttpOptions();
            return this.httpGet(url, options)
                .then(function (connection) {
                    this._injectLogoUrlIntoConnection(connection);
                    this._injectHomePageUrlIntoConnection(connection);
                    return connection;
                }.bind(this));
        }

        _onDeleteConnection(connection)
        {
            if (this.fakeData)
                return Promise.resolve();

            var url = this.server + this.apiPath +
                "/connections/" + connection.id;
            var options = this._buildHttpOptions();

            return this.httpDelete(url, options);
        }

        _getDocuments()
        {
            if (this.fakeData) {
                var fakeDataUrl = this.fakeDataPath + "fake-documents.json";
                return this.httpGet(fakeDataUrl)
                    .then(function (documents) {
                        // Tweak the image paths
                        documents.forEach(function (document) {
                            var newThumbnailUrl = this.fakeDataPath + document.thumbnailUrl;
                            document.thumbnailUrl = newThumbnailUrl;
                        }.bind(this));

                        this.documents = documents;
                        return documents;
                    }.bind(this));
            }

            var url = this.server + this.apiPath +
                "/documents";
            var options = this._buildHttpOptions();
            return this.httpGet(url, options)
                .then(function (documents) {
                    this.documents = documents;
                    this._injectThumbnailUrlIntoDocuments();
                    return documents;
                }.bind(this));
        }

        _getDocument(documentId)
        {
            if (this.fakeData)
                return Promise.resolve();  // Will not make the caller happy...

            var url = this.server + this.apiPath +
                "/documents/" + documentId;
            var options = this._buildHttpOptions();
            return this.httpGet(url, options)
                .then(function (document) {
                    this._injectThumbnailUrlIntoDocument(document);
                    return document;
                }.bind(this));
        }

        _onDeleteDocument(document)
        {
            if (this.fakeData)
                return Promise.resolve();

            var url = this.server + this.apiPath +
                "/documents/" + document.id;
            var options = this._buildHttpOptions();

            return this.httpDelete(url, options);
        }

        // Get all user interactions ---------------------------------------------------------

        // TODO: The way we do this is temporary. We iterate through all the user's connections,
        // asking for the interactions for each, and building a list. Once we've added a new server
        // API endpoint that lets us get all the interactions for a given user, we will change this code.

        _getInteractionRequests()
        {
            this.interactionRequests = [];

            if (this.fakeData) {
                var version = this.interactionVersion;
                var url;
                if (version === "2.0.0")
                    url = this.fakeDataPath + "fake-interaction-requests-2_0_0.json";
                else if (version === "1.0.0")
                    url = this.fakeDataPath + "fake-interaction-requests-1_0_0.json";
                else
                    throw new Error("Unrecognized user interaction schema version: " + version);

                return this.httpGet(url)
                    .then(function (response) {
                        this.interactionRequests = response;
                    }.bind(this));
            }

            var connectionIds = this.connections.map(function (connection) { return connection.id; });
            var promises = connectionIds.map(this._getConnectionInteractionRequests.bind(this));

            return Promise.all(promises)
                .then(function (interactionRequestsPerConnection) {
                    interactionRequestsPerConnection.forEach(function (interactionRequests) {
                        this.interactionRequests = this.interactionRequests.concat(interactionRequests);
                    }.bind(this))
                }.bind(this));
        }

        _getInteractionRequest(connectionId, interactionId)
        {
            if (this.fakeData)
                return Promise.resolve();  // Will not make the caller happy...

            var url = this.server + this.apiPath +
                "/accounts/" + this.account.id +
                "/connections/" + connectionId +
                "/interactions/" + interactionId;
            var options = this._buildHttpOptions();
            return this.httpGet(url, options)
                .then(function (interactionRequest) {
                    // Inject the connection id into the interaction request for future reference
                    interactionRequest.connectionId = connectionId;

                    return interactionRequest;
                }.bind(this));
        }

        _getConnectionInteractionRequests(connectionId)
        {
            if (this.fakeData)
                return Promise.resolve([]);

            var url = this.server + this.apiPath +
                "/accounts/" + this.account.id +
                "/connections/" + connectionId +
                "/interactions";
            var options = this._buildHttpOptions();
            return this.httpGet(url, options)
                .then(function (interactionRequests) {
                    // Inject the connection id into each interaction request for future reference
                    interactionRequests.forEach(function (interactionRequest) {
                        interactionRequest.connectionId = connectionId;
                    });

                    return interactionRequests;
                }.bind(this));
        }

        _createConnection(username, password, institution)
        {
            if (this.fakeData)
                return Promise.resolve();

            var institutionId = institution.id;

            var body =
            {
                "username": btoa(username),
                "password": btoa(password),
                "sourceId": institutionId
            };

            var url = this.server + this.apiPath +
                "/connections";
            var options = this._buildHttpOptions();

            return this.httpPost(url, body, options)
                .then(function (response) {
                    var connectionId = response.id.toString();
                    this.logInfo("Created connection with id: " + connectionId);
                    return connectionId;
                }.bind(this))
                .catch(function (reason) {
                    this._handleError(reason);
                }.bind(this));
        }


        // Helpers -------------------------------------------------------------------------------

        _getInstitutionLogoUrl(institutionId) {

            // HACK
            if (institutionId > 100000)
                return "https://filethis.com/static/logos/72/Logo_FakeBank.png";

            var institution = this._findInstitutionWithId(institutionId);
            if (institution === null)
                return null;
            return institution.logoUrl;
        }

        _getInstitutionHomePageUrl(institutionId) {
            var institution = this._findInstitutionWithId(institutionId);
            if (institution === null)
                return null;
            return institution.homePageUrl;
        }

        _findInstitutionWithId(institutionId)
        {
            var count = this.institutions.length;
            for (var index = 0;
                index < count;
                index++) {
                var institution = this.institutions[index];
                if (institution.id === institutionId)
                    return institution;
            }
            return null;
        }

        _findConnectionWithId(connectionId)
        {
            var count = this.connections.length;
            for (var index = 0;
                index < count;
                index++) {
                var connection = this.connections[index];
                if (connection.id === connectionId)
                    return connection;
            }
            return null;
        }

        _injectLogoUrlIntoConnection(connection) {
            var institutionId = parseInt(connection.sourceId);
            var logoUrl = this._getInstitutionLogoUrl(institutionId);
            connection.logoUrl = logoUrl;
        }

        _injectHomePageUrlIntoConnection(connection) {
            var institutionId = parseInt(connection.sourceId);
            var homePageUrl = this._getInstitutionHomePageUrl(institutionId);
            connection.homePageUrl = homePageUrl;
        }

        _injectThumbnailUrlIntoDocuments()
        {
            this.documents.forEach(function (document) {
                this._injectThumbnailUrlIntoDocument(document);
            }.bind(this));
        }

        _injectThumbnailUrlIntoDocument(document)
        {
            var url = this.server + this.apiPath +
                "/documents/" + document.id +
                "/derivatives/" + "thumbnail-medium" +
                "?ticket=" + this.userAccessToken +
                "&accept=" + "image%2Fjpeg";
            document.thumbnailUrl = url;
        }


        // Handle Change Notifications ------------------------------------------------------------------

        _processChangeNotifications()
        {
            this._clearRecordedChangeNotifications();

            this._processingChangeNotifications = true;

            Promise.resolve()
                .then(this._getAllChangeNotifications.bind(this))
                .then(this._recordChangeNotifications.bind(this))
                .then(this._consolidateRecordedChangeNotifications.bind(this))
                .then(this._handleDeletedAndUpdatedRecordedChangeNotifications.bind(this))
                .then(this._handleCreatedConnectionRecordedChangeNotifications.bind(this))
                .then(this._handleCreatedDocumentRecordedChangeNotifications.bind(this))
                .then(this._handleCreatedDerivativeRecordedChangeNotifications.bind(this))
                .then(this._handleCreatedInteractionRequestRecordedChangeNotifications.bind(this))
                .then(function () {
                    this._processingChangeNotifications = false;
                }.bind(this))
                .catch(function (reason) {
                    this._clearRecordedChangeNotifications();

                    this._handleError(reason);

                    // If we're still live (eg. the user token did not just expire)
                    if (this.isLive) {
                        // Fall back to doing a full refresh of all data
                        this.logInfo("Falling back on doing a full refresh of all data after failure to use change notifications.");
                        this.getAllData();
                    }
                    else {
                        this._processingChangeNotifications = false;
                    }

                }.bind(this));
        }
        
        _getAllChangeNotifications()
        {
            if (this.fakeData)
                return Promise.resolve([]);

            var url = this.server + this.apiPath + "/changes";

            var ordinal = this._lastChangeNotificationHandledOrdinal;
            var haveOrdinal = !!ordinal;
            if (haveOrdinal) {
                // Ask for notifications after the ordinal
                url += "?after=" + ordinal;
            }
            else {
                // Ask for notifications after "now"
                var now = new Date();
                var timestampWithMilliseconds = now.toISOString();
                var timestamp = timestampWithMilliseconds.split('.')[0] + "Z";
                var timestampUrlEncoded = encodeURIComponent(timestamp);
                url += "?from=" + timestampUrlEncoded;
                url += "&dummy=true";  // Ask for a dummy notification, if there are no real ones
            }
            var options = this._buildHttpOptions();
            return this.httpGet(url, options)
                .then(function (changeNotifications) {
                    if (changeNotifications.length === 0)
                        return [];

                    // Sort the notifications from oldest to newest
                    changeNotifications = changeNotifications.sort(function (a, b) { return a.id > b.id; });

                    // Cache the id of the the newest
                    var lastNotificationIndex = changeNotifications.length - 1;
                    var lastNotification = changeNotifications[lastNotificationIndex];
                    var lastNotificationId = lastNotification.id;
                    this._lastChangeNotificationHandledOrdinal = lastNotificationId;

                    // If we got the dummy record, filter it out
                    if (lastNotification.type === "dummy")
                        return [];

                    return changeNotifications;
                }.bind(this));
        }

        _recordChangeNotifications(notifications)
        {
            notifications.forEach(function (notification) {
                var type = notification.type;
                var resource = notification.resource;

                this.logInfo("Received change notification: " + type + "  " + resource);

                if (this._recordDocumentChanged(type, resource))
                    return;
                if (this._recordDerivativeChanged(type, resource))
                    return;
                if (this._recordConnectionChanged(type, resource))
                    return;
                if (this._recordConnectionStateChanged(type, resource))
                    return;
                if (this._recordConnectionValidationChanged(type, resource))
                    return;
                if (this._recordConnectionDocumentCountChanged(type, resource))
                    return;
                if (this._recordInteractionChanged(type, resource))
                    return;
                this.logError("Unrecognized change notification: " + type + " " + resource);
            }.bind(this));
        }

        _clearRecordedChangeNotifications()
        {
            this._createdDocuments = {};
            this._deletedDocuments = {};
            this._createdDerivatives = {};
            this._createdConnections = {};
            this._deletedConnections = {};
            this._updatedConnections = {};
            this._updatedConnectionStateProperties = {};
            this._updatedConnectionValidationProperties = {};
            this._updatedConnectionDocumentCountProperties = {};
            this._createdInteractionRequests = {};
            this._deletedInteractionRequests = {};
        }

        _recordDocumentChanged(type, resource)
        {
            var match = this._documentPattern.exec(resource);
            if (match === null)
                return false;

            var documentId = match[1];

            switch (type) {
                case "created":
                    this._createdDocuments[documentId] = null;
                    break;
                case "deleted":
                    this._deletedDocuments[documentId] = null;
                    break;
                default:
                    this.logError("Unrecognized notification type for document resource: " + type);
                    break;
            }

            return true;
        }

        _recordDerivativeChanged(type, resource)
        {
            var match = this._derivativePattern.exec(resource);
            if (match === null)
                return false;

            var documentId = match[1];
            var derivativeId = match[2];

            switch (type) {
                case "created":
                    this._createdDerivatives[documentId] = derivativeId;
                    break;
                default:
                    this.logError("Unrecognized notification type for derivative resource: " + type);
                    break;
            }

            return true;
        }

        _recordConnectionChanged(type, resource)
        {
            var match = this._connectionPattern.exec(resource);
            if (match === null)
                return false;

            var connectionId = match[1];

            switch (type) {
                case "created":
                    this._createdConnections[connectionId] = null;
                    break;
                case "updated":
                    this._updatedConnections[connectionId] = null;
                    break;
                case "deleted":
                    this._deletedConnections[connectionId] = null;
                    break;
                default:
                    this.logError("Unrecognized notification type for connection resource: " + type);
                    break;
            }

            return true;
        }

        _recordConnectionStateChanged(type, resource)
        {
            var match = this._connectionStatePattern.exec(resource);
            if (match === null)
                return false;

            var connectionId = match[1];
            var newState = match[2];

            switch (type) {
                case "updated":
                    this._updatedConnectionStateProperties[connectionId] = newState;
                    break;
                default:
                    this.logError("Unrecognized notification type for connection resource 'state' property: " + type);
                    break;
            }

            return true;
        }

        _recordConnectionValidationChanged(type, resource)
        {
            var match = this._connectionValidationPattern.exec(resource);
            if (match === null)
                return false;

            var connectionId = match[1];
            var validation = match[2];

            switch (type) {
                case "updated":
                    this._updatedConnectionValidationProperties[connectionId] = validation;
                    break;
                default:
                    this.logError("Unrecognized notification type for connection resource 'validation' property: " + type);
                    break;
            }

            return true;
        }

        _recordConnectionDocumentCountChanged(type, resource)
        {
            var match = this._connectionDocumentCountPattern.exec(resource);
            if (match === null)
                return false;

            var connectionId = match[1];
            var documentCount = match[2];

            switch (type) {
                case "updated":
                    this._updatedConnectionDocumentCountProperties[connectionId] = parseInt(documentCount);
                    break;
                default:
                    this.logError("Unrecognized notification type for connection resource 'documentCount' property: " + type);
                    break;
            }

            return true;
        }

        _recordInteractionChanged(type, resource)
        {
            var match = this._interactionPattern.exec(resource);
            if (match === null)
                return false;

            var connectionId = match[1];
            var interactionId = match[2];

            switch (type) {
                case "created":
                    this._createdInteractionRequests[interactionId] = connectionId;
                    break;
                case "deleted":
                    this._deletedInteractionRequests[interactionId] = connectionId;
                    break;
                default:
                    this.logError("Unrecognized notification type for user interaction resource: " + type);
                    break;
            }

            return true;
        }

        _consolidateRecordedChangeNotifications()
        {
            // TODO: Most, if not all of this can probably be moved into the server logic

            // For each document deletion record
            var deletedDocumentIds = Object.keys(this._deletedDocuments);
            deletedDocumentIds.forEach(function (deletedDocumentId) {
                // Remove any creation record for this document because it's old news
                delete this._createdDocuments[deletedDocumentId];

                // Remove any records for derivative creation
                delete this._createdDerivatives[deletedDocumentId];
            }.bind(this));

            // For each connection deletion record
            var deletedConnectionIds = Object.keys(this._deletedConnections);
            deletedConnectionIds.forEach(function (deletedConnectionId) {
                // Remove any creation record for this connection because it's old news
                delete this._createdConnections[deletedConnectionId];

                // Remove any update record for this connection because it no longer matters
                delete this._updatedConnections[deletedConnectionId];

                // Remove any property update records for this connection because they no longer matter
                delete this._updatedConnectionStateProperties[deletedConnectionId];
                delete this._updatedConnectionValidationProperties[deletedConnectionId];
                delete this._updatedConnectionDocumentCountProperties[deletedConnectionId];

                // Remove any records for user interaction requests that are children of this deleted connection
                this._removeInteractionRecordWithParentConnection(deletedConnectionId, this._createdInteractionRequests);
                this._removeInteractionRecordWithParentConnection(deletedConnectionId, this._deletedInteractionRequests);
            }.bind(this));

            // For each connection creation record
            var createdConnectionIds = Object.keys(this._createdConnections);
            createdConnectionIds.forEach(function (createdConnectionId) {
                // Remove any deletion record for this connection (should never be any, but...)
                delete this._deletedConnections[createdConnectionId];

                // Remove any property update records for this connection because we will get the whole connection, shortly
                delete this._updatedConnectionStateProperties[createdConnectionId];
                delete this._updatedConnectionValidationProperties[createdConnectionId];
                delete this._updatedConnectionDocumentCountProperties[createdConnectionId];
            }.bind(this));

            // For each document creation record
            var createdDocumentIds = Object.keys(this._createdDocuments);
            createdDocumentIds.forEach(function (createdDocumentId) {
                // Remove any deletion record for this document (should never be any, but...)
                delete this._deletedDocuments[createdDocumentId];
            }.bind(this));

            // For each deleted user interaction request
            var deletedInteractionRequestIds = Object.keys(this._deletedInteractionRequests);
            deletedInteractionRequestIds.forEach(function (deletedInteractionRequestId) {
                // Remove any creation record for this user interaction request because it's old news
                delete this._createdInteractionRequests[deletedInteractionRequestId];
            }.bind(this));
        }

        _removeInteractionRecordWithParentConnection(connectionId, interactionRequests)
        {
            var interactionRequestIds = Object.keys(interactionRequests);
            interactionRequestIds.forEach(function (interactionRequestId) {
                var parentConnectionId = interactionRequests[interactionRequestId];

                if (parentConnectionId !== connectionId)
                    return;

                delete interactionRequests[interactionRequestId];
            }.bind(this));
        }

        _handleDeletedAndUpdatedRecordedChangeNotifications()
        {
            // Remove deleted connections
            var deletedConnectionIds = Object.keys(this._deletedConnections);
            deletedConnectionIds.forEach(function (connectionId) {
                this.connections = this._removeObjectWithIdFromList(connectionId, this.connections);
            }.bind(this));
            this._deletedConnections = {};

            // Remove deleted documents
            var deletedDocumentIds = Object.keys(this._deletedDocuments);
            deletedDocumentIds.forEach(function (documentId) {
                this.documents = this._removeObjectWithIdFromList(documentId, this.documents);
            }.bind(this));
            this._deletedDocuments = {};

            // Remove deleted user interaction requests
            var deletedInteractionRequestIds = Object.keys(this._deletedInteractionRequests);
            deletedInteractionRequestIds.forEach(function (interactionRequestId) {
                this.interactionRequests = this._removeObjectWithIdFromList(interactionRequestId, this.interactionRequests);
            }.bind(this));
            this._deletedInteractionRequests = {};

            // Update updated connection state properties
            var updatedConnectionStateProperties = Object.keys(this._updatedConnectionStateProperties);
            updatedConnectionStateProperties.forEach(function (connectionId) {
                var newState = this._updatedConnectionStateProperties[connectionId];
                var connection = this._findObjectWithIdInList(connectionId, this.connections);
                this.connections = this._setPropertyOfObjectInListProperty("state", newState, connection, this.connections);
            }.bind(this));
            this._updatedConnectionStateProperties = {};

            // Update updated connection validation properties
            var updatedConnectionValidationProperties = Object.keys(this._updatedConnectionValidationProperties);
            updatedConnectionValidationProperties.forEach(function (connectionId) {
                var newValidation = this._updatedConnectionValidationProperties[connectionId];
                var connection = this._findObjectWithIdInList(connectionId, this.connections);
                this.connections = this._setPropertyOfObjectInListProperty("validation", newValidation, connection, this.connections);
            }.bind(this));
            this._updatedConnectionValidationProperties = {};

            // Update updated connection documentCount properties
            var updatedConnectionDocumentCountProperties = Object.keys(this._updatedConnectionDocumentCountProperties);
            updatedConnectionDocumentCountProperties.forEach(function (connectionId) {
                var newDocumentCount = this._updatedConnectionDocumentCountProperties[connectionId];
                var connection = this._findObjectWithIdInList(connectionId, this.connections);
                this.connections = this._setPropertyOfObjectInListProperty("documentCount", newDocumentCount, connection, this.connections);
            }.bind(this));
            this._updatedConnectionValidationProperties = {};
        }

        _handleCreatedDocumentRecordedChangeNotifications()
        {
            var createdDocumentIds = Object.keys(this._createdDocuments);

            // If there are no created documents recorded, short circuit
            if (createdDocumentIds.length === 0)
                return Promise.resolve();

            // Get all the created documents and add them to our local list
            var promises = createdDocumentIds.map(this._getDocument.bind(this));
            return Promise.all(promises)
                .then(function (documents) {
                    this.documents = this._addObjectListToList(documents, this.documents);
                }.bind(this));
        }

        _handleCreatedDerivativeRecordedChangeNotifications()
        {
            var createdDerivativeIds = Object.keys(this._createdDerivatives);

            // If there are no created derivatives recorded, short circuit
            if (createdDerivativeIds.length === 0)
                return Promise.resolve();

            // Get all documents for the created derivatives and add them to our local list
            var promises = createdDerivativeIds.map(this._getDocument.bind(this));
            return Promise.all(promises)
                .then(function (documents) {
                    this.documents = this._addObjectListToList(documents, this.documents);
                }.bind(this));
        }

        _handleCreatedConnectionRecordedChangeNotifications()
        {
            var createdConnectionIds = Object.keys(this._createdConnections);

            // If there are no created connections recorded, short circuit
            if (createdConnectionIds.length === 0)
                return Promise.resolve();

            // Get all the created connections and add them to our local list
            var promises = createdConnectionIds.map(this._getConnection.bind(this));
            return Promise.all(promises)
                .then(function (connections) {
                    this.connections = this._addObjectListToList(connections, this.connections);
                }.bind(this));
        }

        _handleCreatedInteractionRequestRecordedChangeNotifications()
        {
            var createdInteractionRequestIds = Object.keys(this._createdInteractionRequests);

            // If there are no created interaction requests recorded, short circuit
            if (createdInteractionRequestIds.length === 0)
                return Promise.resolve();

            // Make a list of promises to get all the created interaction requests
            var promises = [];
            createdInteractionRequestIds.forEach(function (interactionRequestId) {
                var connectionId = this._createdInteractionRequests[interactionRequestId];
                var promise = this._getInteractionRequest(connectionId, interactionRequestId);
                promises.push(promise);
            }.bind(this));

            // Get all the created interaction requests and add them to our local list
            return Promise.all(promises)
                .then(function (interactionRequests) {
                    this.interactionRequests = this._addObjectListToList(interactionRequests, this.interactionRequests);
                }.bind(this));
        }


        // Object lists ------------------------------------------------------------------

        // These methods make changes to our observed objects such that the changes are propagated to our observers,
        // updating the UI appropriately.
        // See: https://www.polymer-project.org/1.0/docs/devguide/_routeData-system#make-observable-changes

        _indexOfObjectWithIdInList(id, list)
        {
            var count = list.length;
            for (var index = 0; index < count; index++) {
                var object = list[index];
                if (object.id === id)
                    return index;
            }
            return -1;
        }

        _findObjectWithIdInList(id, list)
        {
            var index = this._indexOfObjectWithIdInList(id, list);
            return list[index];
        }

        _objectIsInList(object, list)
        {
            var id = object.id;
            var index = this._indexOfObjectWithIdInList(id, list);
            var isInList = (index !== -1);
            return isInList;
        }

        // Create

        _addObjectToList(object, list)
        {
            // Short-circuit if object is already in the list
            if (this._objectIsInList(object, list))
                return list;

            var newList = [...list];

            newList.push(object);

            return newList;
        }

        _addObjectListToList(objectList, list)
        {
            if (objectList.length === 0)
                return list;

            var newList = [...list];

            // Build a new list of objects that are not already in the target list
            var uniqueObjectList = [];
            objectList.forEach(function (object) {
                if (!this._objectIsInList(object, newList))
                    uniqueObjectList.push(object);
            }.bind(this));

            // Splice the new objects into the list property array
            var insertIndexAtStart = 0;
            var removeCountZero = 0;
            var count = uniqueObjectList.length;
            for (var index = 0; index < count; index++) {
                var object = uniqueObjectList[index];
                newList.splice(insertIndexAtStart, removeCountZero, object);
            }

            return newList;
        }

        // Update

        _setPropertyOfObjectInListProperty(objectPropertyName, objectPropertyValue, object, list)
        {
            // Make sure the object really is in the list
            var objectId = object.id;
            var objectIndexInList = this._indexOfObjectWithIdInList(objectId, list);
            if (objectIndexInList === -1) {
                this.logWarn("Attempt to set property of object that is not in given list");
                return;
            }

            var newList = [...list];

            // Set the property of the object
            var objectInList = newList[objectIndexInList];
            objectInList[objectPropertyName] = objectPropertyValue;

            return newList;
        }

        // Delete

        _removeObjectWithIdFromList(id, list)
        {
            // Short-circuit if object is not in the list
            var index = this._indexOfObjectWithIdInList(id, list);
            if (index === -1)
                return list;

            var newList = [...list];

            // Splice the object out of the list property array
            var removeCountOne = 1;
            newList.splice(index, removeCountOne);

            return newList;
        }

        _buildHttpOptions()
        {
            return {
                headers: {
                    "X-FileThis-Session": this.userAccessToken
                }
            };
        }


        // Miscellaneous

        _prependFakeInstitution(institutions)
        {
            var fakeInstitution;

            // The fake external institution
            fakeInstitution =
            {
                "id": 100100,
                "name": "Fake External",
                "type": "util",
                "state": "live",
                "homePageUrl": "https://fake-company-site.herokuapp.com",
                "phone": "(800) 555-5555",
                "logoPath": "logos/Logo_FakeBank.png",
                "logo": "Logo_FakeBank.png",
                "logoUrl": "https://filethis.com/static/logos/72/Logo_FakeBank.png",
                "note": "",
                "info": "",
                "pattern": "",
                "isNew": false,
                "isPopular": false
            };
            institutions.unshift(fakeInstitution);

            // The fake internal institution
            // fakeInstitution =
            // {
            //     "id": 100301,
            //     "name": "Fake Internal Bills",
            //     "type": "util",
            //     "state": "live",
            //     "homePageUrl": "https://fake-company-site.herokuapp.com",
            //     "phone": "(800) 555-5555",
            //     "logoPath": "logos/Logo_FakeBank.png",
            //     "logo": "Logo_FakeBank.png",
            //     "logoUrl": "https://filethis.com/static/logos/72/Logo_FakeBank.png",
            //     "note": "",
            //     "info": "",
            //     "pattern": "",
            //     "isNew": false,
            //     "isPopular": false
            // };
            // institutions.unshift(fakeInstitution);

            // The fake internal institution
            //            fakeInstitution =
            //            {
            //                "id": 100304,
            //                "name": "Fake Internal Creds",
            //                "type": "util",
            //                "state": "live",
            //                "homePageUrl": "https://fake-company-site.herokuapp.com",
            //                "phone": "(800) 555-5555",
            //                "logoPath": "logos/Logo_FakeBank.png",
            //                "logo": "Logo_FakeBank.png",
            //                "logoUrl": "https://filethis.com/static/logos/72/Logo_FakeBank.png",
            //                "note": "",
            //                "info": "",
            //                "pattern": "",
            //                "isNew": false,
            //                "isPopular": false
            //            };
            //            institutions.unshift(fakeInstitution);
        }

        _handleError(error)
        {
            // Let our parents figure out what to do. They will probably ground us by setting our
            // "live" property to false.
            const event = new CustomEvent('ft-connect-error', { detail: error, bubbles: true, composed: true });
            this.dispatchEvent(event);
        }


        // TODO: These methods are duplicated in ft-wizard-finish-panel. Refactor to eliminate duplication.

        someConnectionStillRunning()
        {
            var count = this.connections.length;
            for (var index = 0; index < count; index++) {
                var connection = this.connections[index];
                if (this.connectionStillRunning(connection))
                    return true;
            }
            return false;
        }

        someConnectionHasPendingInteraction()
        {
            var count = this.connections.length;
            for (var index = 0; index < count; index++) {
                var connection = this.connections[index];
                if (this.connectionHasPendingInteraction(connection))
                    return true;
            }
            return false;
        }

        connectionStillRunning(connection)
        {
            switch (connection.state) {
                case "waiting":
                case "error":
                case "question":
                    return false;
                default:
                    return true;
            }
        }

        connectionHasPendingInteraction(connection)
        {
            return (connection.state === "question");
        }

        logInfo(message)
        {
            message;
            // var logger = this._getLogger();
            // if (!logger)
            //   return;
            // logger.info(message);
        }

        logWarn(message)
        {
            message;
           // var logger = this._getLogger();
            // if (!logger)
            //   return;
            // logger.warn(message);
        }

        logError(message)
        {
            message;
            // var logger = this._getLogger();
            // if (!logger)
            //   return;
            // logger.error(message);
        }

        _getLogger()
        {
            // var logger = log4javascript.getDefaultLogger();
            // if (!logger)
            //   return null;
            // if (!logger.hasOwnProperty("log"))
            //   return null;
            // if (typeof logger !== "function")
            //   return null;
            // return logger;
        }
    }
