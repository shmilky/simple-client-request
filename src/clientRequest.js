require('es6-promise').polyfill();

require('isomorphic-fetch');
const routingHelpers = require('@propertech/react-router-routing-helpers').default;
const {objToQueryParams} = routingHelpers;

// Using the async isomorphic fetch for sending crud requests
function asyncReq(url, method, body, options={}, cb) {
    let reqHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    if (options.noCache) {
        reqHeaders['Cache-Control'] = 'no-cache'
    }

    const reqOptions = {
        credentials: 'include', // enable cookies for session.
        headers: reqHeaders,
        method: method,
    };

    if (method === 'post' || method === 'put') {
        reqOptions.body = JSON.stringify(body);
    }

    fetch(url, reqOptions).then(function(response) {
        // TODO: Consider adding the error code to the response

        return response.json();
    }).then(function (json) {
        const actualResData = json.data || json;
        let errorMsg = json.errorMessage;

        if (errorMsg) {
            throw new Error(errorMsg);
        }

        if (!actualResData && !errorMsg) {
            errorMsg = method.toUpperCase() + ' ' + url + ' request responded with neither data or error message, will be handled as error response';
            throw new Error(errorMsg);
        }

        cb(null, actualResData);
    }).catch (function(err) {
        cb(err.message || err);
    });
}

function asyncGetReq (url, queryParams, options, cb) {
    if (typeof queryParams === 'function') {
        cb = queryParams;
        queryParams = {};
    }

    const queryStr = queryParams ? objToQueryParams(queryParams) : '';
    const fullUrl = url + (queryStr !== '' ? '?' + queryStr : '');

    asyncReq(fullUrl, 'get', null, options, cb);
}

function getRequest (url, queryParams, cb) {
    asyncGetReq(url, queryParams, {}, cb);
}

function refreshGetRequest (url, queryParams, cb) {
    asyncGetReq(url, queryParams, {noCache: true}, cb);
}

function postRequest (url, data, cb) {
    if (typeof data === 'function') {
        cb = data;
        data = {};
    }

    asyncReq(url, 'post', data, {}, cb || function(err, data) {});
}

function putRequest (url, data, cb) {
    if (typeof data === 'function') {
        cb = data;
        data = {};
    }

    asyncReq(url, 'put', data, {}, cb || function(err, data) {});
}

// function postFileRequest (url, data, cb) {
//     function onProgress (progEvent) {
//         if (progEvent.lengthComputable) {
//             // Logger.log('helpers.postFile (onProgress)', 'File upload completion - ' + (progEvent.loaded/progEvent.total)*100 + '%');
//         }
//     }
//
//     function onReady (readyEvent) {
//         cb(null, readyEvent)
//     }
//
//     function onError (err) {
//         cb(err)
//     }
//
//     const formData = new FormData();
//     const xhr = new XMLHttpRequest();
//
//     Object.keys(data).forEach(function (key) {
//         formData.append(key, data[key]);
//     });
//
//     xhr.open('post', url, true);
//     xhr.addEventListener('error', onError, false);
//     xhr.addEventListener('progress', onProgress, false);
//     xhr.send(formData);
//     xhr.addEventListener('readystatechange', onReady, false);
// }

export default {
    get: getRequest,
    forceGetData: refreshGetRequest,
    post: postRequest,
    put: putRequest,
    // postFile: postFileRequest
}