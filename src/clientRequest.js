require('es6-promise').polyfill();

require('isomorphic-fetch');
const routingHelpers = require('react-router-routing-helpers').default;
const {objToQueryParams} = routingHelpers;

// Using the async isomorphic fetch for sending crud requests
function asyncReq(url, method, body, options={}) {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    if (options.noCache) {
        headers['Cache-Control'] = 'no-cache'
    }

    const reqOptions = {
        credentials: 'include', // enable cookies for session.
        headers,
        method,
    };

    if (method === 'post' || method === 'put') {
        reqOptions.body = JSON.stringify(body || {});
    }

    return fetch(url, Object.assign(reqOptions, options)).then(function(response) {
        // TODO: Consider adding the error code to the response

        return response.json();
    }).then((json) => {
        const actualResData = json.data || json;
        let errorMsg = json.errorMessage;

        if (errorMsg) {
            throw new Error(errorMsg);
        }

        if (!actualResData && !errorMsg) {
            errorMsg = method.toUpperCase() + ' ' + url + ' request responded with neither data or error message, will be handled as error response';
            throw new Error(errorMsg);
        }

        return actualResData;
    }).catch ((err) => {
        throw new Error(err.message || err);
    });
}

function asyncGetReq (url, queryParams, options) {
    const queryStr = queryParams ? objToQueryParams(queryParams) : '';
    const fullUrl = url + (queryStr !== '' ? '?' + queryStr : '');

    return asyncReq(fullUrl, 'get', null, options);
}

function get (url, queryParams, options) {
    return asyncGetReq(url, queryParams, options);
}

function getNoCache (url, queryParams, options) {
    return get(url, Object.assign({no_cache: new Date().getTime()}, queryParams), options);
}

function post (url, data, options) {
    return asyncReq(url, 'post', data, options);
}

function put (url, data, options) {
    return asyncReq(url, 'put', data, options);
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
    get,
    getNoCache,
    post,
    put,
    // postFile: postFileRequest
}