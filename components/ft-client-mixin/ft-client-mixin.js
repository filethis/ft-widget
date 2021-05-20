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
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/

// import '@filethis/ft-error-behavior/ft-error-behavior.js';
import '@filethis/ft-http-behavior/ft-http-behavior.js';
import '@filethis/ft-confirmation-dialog/ft-confirmation-dialog.js';
// import 'log4javascript/log4javascript.js';
import '@polymer/polymer/polymer-legacy.js';


/**
 * `<ft-connect-behavior>`
 *
 * A behavior that defines most of the business logic needed to implement the variations of the FileThis Connect drop-in elements.
 *
 */
export const FtClientMixin = (base) =>
    class FtClient extends base {

    // listeners:
    // {
    //     'create-connection-command': '_onCreateConnectionCommandInternal',
    //     'download-documents-command': '_onDownloadDocumentsCommand',
    //     'upload-documents-command': '_onUploadDocumentsCommand',
    //     'delete-connection-command': '_onDeleteConnectionCommand',
    //     'delete-document-command': '_onDeleteDocumentCommand',
    //     'action-command': '_onActionCommand',
    //     'visit-source-site-command': '_onVisitSourceSiteCommand',
    //     'is-this-safe-command': '_onIsThisSafeCommand'
    // }

    // observers: [
    //     '_onConnectionsListChanged(connections)',
    //     '_onConnectionsSplicesChanged(connections.splices)',

    //     '_onDocumentsListChanged(documents)',
    //     '_onDocumentsSplicedChanged(documents.splices)',

    //     '_onInteractionRequestsListChanged(_interactionRequests)',
    //     '_onInteractionRequestsSplicesChanged(_interactionRequests.splices)'
    // ],

    properties: {


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
    _createdDocuments: {},
    _deletedDocuments: {},
    _createdDerivatives: {},
    _createdConnections: {},
    _deletedConnections: {},
    _updatedConnections: {},
    _updatedConnectionStateProperties: {},
    _updatedConnectionValidationProperties: {},
    _updatedConnectionDocumentCountProperties: {},

    // User interaction request changes
    _createdInteractionRequests: {},
    _deletedInteractionRequests: {},

    ready()
	{
        // TODO: We would prefer not to load the library at all.
        // If the log4javascript code were wrapped in a polymer element, we could use _template_ with _dom-if_.
        // log4javascript.setEnabled(this.debug);

        this.logInfo("Ready");

        setInterval(this._changeNotificationPoller.bind(this), 1000);  // Poll for change notifications
    }

    _changeNotificationPoller()
	{
        if (!this.pollForChangeNotifications)
            return;
        if (!this.live)
            return;
        if (this._processingChangeNotifications)
            return;

        this._processChangeNotifications();
    }

    _onLiveChanged(to, from)
	{
        this._lastChangeNotificationHandledOrdinal = null;
        this._processingChangeNotifications = false;

        if (this.live)
            this.getAllData();
    }

    _onSelectedFilterIdChanged(to, from)
	{
        this._getSources();
    }


    // Connection list changes

    _onConnectionsListChanged(to, from)
	{
        this._handleConnectionsChanged();
    }

    _onConnectionsSplicesChanged(changeRecord)
	{
        if (!changeRecord)
            return;
        this._handleConnectionsChanged();
    }

    _handleConnectionsChanged()
	{
        var showConnectionPanel = (!!this.connections && this.connections.length > 0);
        this._showConnectionPanel = showConnectionPanel;
    }


    // Document list changes

    _onDocumentsListChanged(to, from)
	{
        this._handleDocumentsChanged();
    }

    _onDocumentsSplicedChanged(changeRecord)
	{
        if (!changeRecord)
            return;
        this._handleDocumentsChanged();
    }

    _handleDocumentsChanged()
	{
        var showDocumentPanel = (!!this.documents && this.documents.length > 0);
        this._showDocumentPanel = showDocumentPanel;
    }


    // Interaction request list changes

    _onInteractionRequestsListChanged(to, from)
	{
        this._handleInteractionRequestsChanged();

        var alreadyInitialized = (from !== undefined);
        if (alreadyInitialized)
            this._poseNextPendingInteractionRequest();
    }

    _onInteractionRequestsSplicesChanged(changeRecord)
	{
        if (!changeRecord)
            return;
        this._handleInteractionRequestsChanged();

        var alreadyInitialized = (changeRecord !== undefined);
        if (alreadyInitialized)
            this._poseNextPendingInteractionRequest();
    }

    _handleInteractionRequestsChanged()
	{
        if (!this._interactionRequests)
            return;
        if (this._interactionRequests.length === 0)
            return;
    }


    // User action event handling --------------------------------------------------------------------------

    _onCreateConnectionCommandInternal(event)
	{
        var createConnectionDialog = event.detail;
        var username = createConnectionDialog.username;
        var password = createConnectionDialog.password;
        var source = createConnectionDialog.source;
        this._createConnection(username, password, source);
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
                    "?ticket=" + this.token +
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

    _onUploadDocumentsCommand(event)
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

    _onVisitSourceSiteCommand(event)
	{
        var source = event.detail;
        var url = source.homePageUrl;
        var win = window.open(url, '_blank');
        if (win)
            win.focus();
        else
            this.$.confirmationDialog.alert("Please allow popups for this site");
    }

    _onIsThisSafeCommand(event)
	{
        this.$.confirmationDialog.alert("We use bank-level encryption to keep your credentials safe.");
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

    _poseInteractionForConnection(connection)
	{
        var count = this._interactionRequests.length;
        if (count === 0)
            return;

        // If we already have a dialog posed
        if (this.$.modalInteractionDialog.opened) {
            this.logInfo("There is already a user interaction request dialog posed");
            return;
        }

        var connectionId = connection.id;

        var interactionRequestForConnection = null;
        for (var index = 0; index < count; index++) {
            var interactionRequest = this._interactionRequests[index];
            if (interactionRequest.connectionId === connectionId) {
                interactionRequestForConnection = interactionRequest;
                break;
            }
        }
        if (interactionRequestForConnection === null)
            return;

        this._interactionRequest = interactionRequestForConnection;
        this.$.modalInteractionDialog.open();
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
                return this._getSources();
            }.bind(this))
            .then(this._getConnections.bind(this))  // Depends on sources in order to render
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

    _getSources()
	{
        if (this.fakeData) {
            var fakeDataUrl = this.fakeDataPath + "fake-sources.json";
            return this.httpGet(fakeDataUrl)
                .then(function (sources) {
                    this.sources = sources;
                    return sources;
                }.bind(this));
        }

        var url = this.server + this.apiPath +
            "/sources";
        if (!!this.selectedFilterId)
            url += "?filter=" + this.selectedFilterId;
        var options = this._buildHttpOptions();
        return this.httpGet(url, options)
            .then(function (sources) {
                if (this.fakeSources && this.selectedFilterId === "all")
                    this._prependFakeSource(sources);
                this.sources = sources;
                return sources;
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
        this._interactionRequests = [];

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
                    this._interactionRequests = this._interactionRequests.concat(interactionRequests);
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

    /**
     * Poses dialog window for the next pending user interaction request, if there is one.
     */
    poseNextPendingInteractionRequest()
	{
        if (this._interactionRequests.length === 0)
            return;

        // If we already have a dialog posed
        if (this.$.modalInteractionDialog.opened)
            return;

        // Pose the first request
        var interactionRequest = this._interactionRequests[0];
        this._interactionRequest = interactionRequest;
        this.$.modalInteractionDialog.open();
        return interactionRequest;
    }

    _poseNextPendingInteractionRequest()
	{
        return this.poseNextPendingInteractionRequest();
    }

    _createConnection(username, password, source)
	{
        if (this.fakeData)
            return Promise.resolve();

        var sourceId = source.id;

        var body =
        {
            "username": btoa(username),
            "password": btoa(password),
            "sourceId": sourceId
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

    _getSourceLogoUrl(sourceId)
	{
        var source = this._findSourceWithId(sourceId);
        if (source === null)
            return null;
        return source.logoUrl;
    }

    _findSourceWithId(sourceId)
	{
        var count = this.sources.length;
        for (var index = 0;
            index < count;
            index++) {
            var source = this.sources[index];
            if (source.id === sourceId)
                return source;
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

    _injectLogoUrlIntoConnection(connection)
	{
        var sourceId = parseInt(connection.sourceId);
        var logoUrl = this._getSourceLogoUrl(sourceId);
        connection.logoUrl = logoUrl;
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
            "?ticket=" + this.token +
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
                if (this.live) {
                    // Fall back to doing a full refresh of all data
                    this.logInfo("Falling back on doing a full refresh of all data after failure to use change notifications.");
                    this.getAllData();
                }
                else {
                    this._processingChangeNotifications = false;
                }

            }.bind(this));
    }

    _connectionPattern: /^\/connections\/([a-zA-Z0-9]+)$/,
    _connectionStatePattern: /^\/connections\/([a-zA-Z0-9]+)\/state\/([a-zA-Z]+)$/,
    _connectionValidationPattern: /^\/connections\/([a-zA-Z0-9]+)\/validation\/([a-zA-Z]+)$/,
    _connectionDocumentCountPattern: /^\/connections\/([a-zA-Z0-9]+)\/documentCount\/([0-9]+)$/,
    _interactionPattern: /^\/connections\/([a-zA-Z0-9]+)\/interactions\/([a-zA-Z0-9]+)$/,
    _documentPattern: /^\/documents\/([a-zA-Z0-9]+)$/,
    _derivativePattern: /^\/documents\/([a-zA-Z0-9]+)\/derivatives\/(thumbnail-medium)$/,  // TODO: For now

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
            this._removeObjectWithIdFromListProperty(connectionId, this.connections, "connections");
        }.bind(this));
        this._deletedConnections = {};

        // Remove deleted documents
        var deletedDocumentIds = Object.keys(this._deletedDocuments);
        deletedDocumentIds.forEach(function (documentId) {
            this._removeObjectWithIdFromListProperty(documentId, this.documents, "documents");
        }.bind(this));
        this._deletedDocuments = {};

        // Remove deleted user interaction requests
        var deletedInteractionRequestIds = Object.keys(this._deletedInteractionRequests);
        deletedInteractionRequestIds.forEach(function (interactionRequestId) {
            this._removeObjectWithIdFromListProperty(interactionRequestId, this._interactionRequests, "_interactionRequests");
        }.bind(this));
        this._deletedInteractionRequests = {};

        // Update updated connection state properties
        var updatedConnectionStateProperties = Object.keys(this._updatedConnectionStateProperties);
        updatedConnectionStateProperties.forEach(function (connectionId) {
            var newState = this._updatedConnectionStateProperties[connectionId];
            var connection = this._findObjectWithIdInList(connectionId, this.connections);
            this._setPropertyOfObjectInListProperty("state", newState, connection, this.connections, "connections");
        }.bind(this));
        this._updatedConnectionStateProperties = {};

        // Update updated connection validation properties
        var updatedConnectionValidationProperties = Object.keys(this._updatedConnectionValidationProperties);
        updatedConnectionValidationProperties.forEach(function (connectionId) {
            var newValidation = this._updatedConnectionValidationProperties[connectionId];
            var connection = this._findObjectWithIdInList(connectionId, this.connections);
            this._setPropertyOfObjectInListProperty("validation", newValidation, connection, this.connections, "connections");
        }.bind(this));
        this._updatedConnectionValidationProperties = {};

        // Update updated connection documentCount properties
        var updatedConnectionDocumentCountProperties = Object.keys(this._updatedConnectionDocumentCountProperties);
        updatedConnectionDocumentCountProperties.forEach(function (connectionId) {
            var newDocumentCount = this._updatedConnectionDocumentCountProperties[connectionId];
            var connection = this._findObjectWithIdInList(connectionId, this.connections);
            this._setPropertyOfObjectInListProperty("documentCount", newDocumentCount, connection, this.connections, "connections");
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
                this._addObjectListToListProperty(documents, this.documents, "documents");
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
                this._addObjectListToListProperty(documents, this.documents, "documents");
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
                this._addObjectListToListProperty(connections, this.connections, "connections");
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
                this._addObjectListToListProperty(interactionRequests, this._interactionRequests, "_interactionRequests");
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

    _addObjectToListProperty(object, list, listPath)
	{
        // Short-circuit if object is already in the list
        if (this._objectIsInList(object, list))
            return;

        this.push(listPath, object);
    }

    _addObjectListToListProperty(objectList, list, listPath)
	{
        if (objectList.length === 0)
            return;

        // Build a new list of objects that are not already in the target list
        var uniqueObjectList = [];
        objectList.forEach(function (object) {
            if (!this._objectIsInList(object, list))
                uniqueObjectList.push(object);
        }.bind(this));

        // Splice the new objects into the list property array
        var insertIndexAtStart = 0;
        var removeCountZero = 0;
        var count = uniqueObjectList.length;
        for (var index = 0; index < count; index++) {
            var object = uniqueObjectList[index];
            this.splice(listPath, insertIndexAtStart, removeCountZero, object);
        }
        //                var spliceObjectList = this.splice.bind(this, listPath, insertIndexAtStart, removeCountZero);
        //                spliceObjectList.apply(this, uniqueObjectList);
    }

    // Update

    _setPropertyOfObjectInListProperty(objectPropertyName, objectPropertyValue, object, list, listPath)
	{
        // Make sure the object really is in the list
        var objectId = object.id;
        var objectIndexInList = this._indexOfObjectWithIdInList(objectId, list);
        if (objectIndexInList === -1) {
            this.logWarn("Attempt to set property of object that is not in given list");
            return;
        }

        // Set the property of the object
        var path = [listPath, objectIndexInList.toString(), objectPropertyName];
        this.set(path, objectPropertyValue);
    }

    // Delete

    _removeObjectWithIdFromListProperty(id, list, listPath)
	{
        // Short-circuit if object is not in the list
        var index = this._indexOfObjectWithIdInList(id, list);
        if (index === -1)
            return;

        // Splice the object out of the list property array
        var removeCountOne = 1;
        this.splice(listPath, index, removeCountOne);
    }

    _buildHttpOptions()
	{
        return {
            headers: {
                "X-FileThis-Session": this.token
            }
        };
    }


    // Miscellaneous

    _prependFakeSource(sources)
	{
        var fakeSource;

        // The fake external source
        fakeSource =
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
        sources.unshift(fakeSource);

        // The fake internal source
        fakeSource =
        {
            "id": 100301,
            "name": "Fake Internal Bills",
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
        sources.unshift(fakeSource);

        // The fake internal source
        //            fakeSource =
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
        //            sources.unshift(fakeSource);
    }

    _handleError(error)
	{
        // Let our parents figure out what to do. They will probably ground us by setting our
        // "live" property to false.
        this.fire("ft-connect-error", error);
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
        // var logger = this._getLogger();
        // if (!logger)
        //   return;
        // logger.info(message);
    }

    logWarn(message)
	{
        // var logger = this._getLogger();
        // if (!logger)
        //   return;
        // logger.warn(message);
    }

    logError(message)
	{
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
