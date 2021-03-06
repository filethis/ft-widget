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


/* Specialize Error class to represent non-200 responses so that callers can handle them specially */

function FtHttpUnsuccessfulError(message, status, response) {
    this.message = message;
    this.status = status;
    this.response = response;
}

FtHttpUnsuccessfulError.prototype = new Error();


/**
 * `<ft-http-mixin>`
 *
 * This mixin provides "Promisified" HTTP request methods:
 *
 *     httpPost(url, body, options)
 *     httpGet(url, options)
 *     httpPut(url, body, options)
 *     httpDelete(url, options)
 *
 * All of these return a Promise object that resolves to the body of the response. By default, JSON responses are expected and deserialized, but this is configurable.
 *
 * When a communications error occurs, the promise will be rejected with an error string that contains as much information as can be gathered. Browsers vary in the kind and amount of information they provide in this case.
 *
 * When the server returns a non-200 response, the promise will be rejected with a _FtHttpUnsuccessfulError_ instance (which is derived from the _Error_ class). The _FtHttpUnsuccessfulError_ has three properties:
 *
 * #### message
 *
 * This is message which attempts to describe the issue.
 *
 * #### status
 *
 * The status code returned by the server.
 *
 * #### response
 *
 * The body of the response.
 *
 *
 * ## The _body_ Argument
 *
 * The _body_ argument of the `httpPost()` and `httpPut()` methods can be one of the following types:
 *
 * #### Object
 *
 * A content type of `application/json; charset=utf-8` will be used, and the object will be stringified.
 *
 * #### String
 * A content type of `text/plain; charset=utf-8` will be used, unless overridden.
 *
 * #### FormData
 * We let the internal `XMLHttpRequest.send()` call create and add the Content-Type header. It will add a "multipart/form-data" header with "boundary" string appended to it.
 *
 * ## The _options_ Argument
 *
 * Various options can be specified when making a request:
 *
 * #### Headers
 *
 * An object which can have any number of properties and values that are turned into HTTP header records.
 *
 *
 * #### responseType
 *
 * This lets you pass a requested response type down to the XMLHttpRequest instance used to make the actual request. See [here](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType) for more information on the meaning of this parameter.
 *
 * If specified, it must be one of "text", "json", or "blob".
 *
 * #### withCredentials
 *
 * This lets you pass a _withCredentials_ argument down to the XMLHttpRequest instance used to make the actual request. See [here](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials) for more information on the meaning of this parameter.
 *
 *
 * A example of an _options_ argument:
 *
 *     {
 *         withCredentials: true,
 *         headers:
 *         {
 *             Authorization: "9898289937972397809237693789670386"
 *             X-FileThis-Session: "89298725295825",
 *             accept: "application.pdf"
 *         }
 *     }
 *
 * @demo
 */
export const FtHttpMixin = (base) =>
    class FtHttp extends base
    {
        /**
         * Make an HTTP POST request.
         *
         * @param {String} url The URL against which to make the request.
         * @param {String} body See documentation section for this element.
         * @param {Object} options See documentation section for this element.
         * @return {Object} A promise that resolves to the body of the received response.
         */
        httpPost(url, body, options)
        {
            return this._http('POST', url, body, options)
        }

        /**
         * Make an HTTP GET request.
         *
         * @param {String} url The URL against which to make the request.
         * @param {Object} options See documentation section for this element.
         * @return {Object} A promise that resolves to the body of the received response.
         */
        httpGet(url, options)
        {
            var nullBody = null;
            return this._http('GET', url, nullBody, options)
        }

        /**
         * Make an HTTP PUT request.
         *
         * @param {String} url The URL against which to make the request.
         * @param {String} body See documentation section for this element.
         * @param {Object} options See documentation section for this element.
         * @return {Object} A promise that resolves to the body of the received response.
         */
        httpPut(url, body, options)
        {
            return this._http('PUT', url, body, options)
        }

        /**
         * Make an HTTP DELETE request.
         *
         * @param {String} url The URL against which to make the request.
         * @param {Object} options See documentation section for this element.
         * @return {Object} A promise that resolves to the body of the received response.
         */
        httpDelete(url, options)
        {
            var nullBody = null;
            return this._http('DELETE', url, nullBody, options)
        }

        _http(method, url, body, options)
        {
            return new Promise(function (resolve, reject)
            {
                var description = method + " " + url;

                var request = new XMLHttpRequest();

                request.open(method, url, true);

                var contentType = null;
                var accept = null;
                var responseType = null;

                // Handle options
                if (options)
                {
                    // Headers
                    if (options.headers)
                    {
                        var headers = options.headers;

                        // Add header to prevent Chrome and maybe other browsers posing a Basic Auth dialog when creds are invalid
                        request.setRequestHeader("x-requested-with", "XMLHttpRequest");

                        Object.keys(headers).forEach(function (name)
                        {
                            var value = headers[name];

                            switch (name.toLowerCase())
                            {
                                case "content-type":
                                    contentType = value;
                                    break;

                                case "accept":
                                    accept = value;
                                    break;

                                default:
                                    request.setRequestHeader(name, value);  // Add any other header immediately
                                    break;
                            }
                        });
                    }

                    // withCredentials
                    var optionWithCredentials = options.withCredentials;
                    if (!!optionWithCredentials)
                        request.withCredentials = optionWithCredentials;

                    // responseType
                    var optionResponseType = options.responseType;
                    if (!!optionResponseType)
                        responseType = optionResponseType;
                }

                // On getting a response from the server
                request.onload = function ()
                {
                    var status = request.status;
                    var statusText = request.statusText;

                    // Get the response, if there is one
                    var response = null;
                    switch (request.responseType.toLowerCase())
                    {
                        case "blob":
                        case "json":
                            if (!!request.response)
                                response = request.response;
                            break;

                        case "text":
                        default:
                            if (!!request.responseText)
                                response = request.responseText;
                            break;
                    }

                    // If the server told us we were successful
                    if (status >= 200 && status < 300)
                    {
                        // Resolve our promise with the response
                        resolve(response);
                    }
                    else // the server told us we failed
                    {
                        // Build a message string that standard error handlers can display
                        var message = description + " failed" +
                            "\n\nRequest: " + description +
                            "\n\nstatusText: \"" + statusText + "\"";

                        // Create our specialized error (derived from the "Error" class) which includes the server response
                        var error = new FtHttpUnsuccessfulError(message, status, response);

                        // Reject our promise with our specialized error instance
                        reject(error);
                    }
                }.bind(this);

                // On communications/network failure
                request.onerror = function (message, url, lineNumber, columnNumber, errorObject)
                {
                    // Create an Error instance describing the problem
                    message = description + " failed\n" + message;
                    // var error = this.createErrorFromValues(message, url, lineNumber, columnNumber, errorObject);
                    var error = message;

                    // Reject our promise with the Error instance
                    reject(error);
                }.bind(this);

                // If a request body is given, stringify it, if necessary, and take care of the Content-Type header
                if (body)
                {
                    if (body instanceof FormData)
                    {
                        // We let XMLHttpRequest.send() create and add the Content-Type header. It will add a
                        // "multipart/form-data" header with "boundary" string appended to it.
                        contentType = null;
                    }
                    else if (typeof body === "object")
                    {
                        // Assume JSON
                        contentType = "application/json; charset=utf-8";
                        body = JSON.stringify(body);
                    }
                    else
                    {
                        contentType = "text/plain; charset=utf-8";
                    }

                    // Add a Content-Type header, but only if one has been given, or inferred. (See FormData, above.)
                    if (!!contentType)
                        request.setRequestHeader("Content-Type", contentType);
                }

                // Let the Accept type default to JSON
                if (!accept)
                    accept = "application/json; charset=utf-8";

                // Let the responseType default to JSON
                if (!responseType)
                    responseType = "json";

                // Add an Accept header
                request.setRequestHeader("Accept", accept);

                // Set the responseType
                request.responseType = responseType;

                // Make the request
                if (body)
                    request.send(body);
                else
                    request.send();

            }.bind(this));
        }
    }

