import fetchMock from 'fetch-mock'
import clientRequest from '../src/clientRequest';

const dummyUrl = 'http://test.url';
const dummyPostData = {b: 'I\'m dummy data'};
const dummyResObject = {a: 1};

describe('clientRequest', () => {

    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });

    test('Dummy test to see that the test starts to run', (done) => {
        expect("test test").toEqual("test test");
        done();
    });


    test('get root path adds slash for root path', (done) => {
        const url = dummyUrl;
        const response = dummyResObject;
        const expectedBody = response;

        fetchMock.get(url, response);

        clientRequest.get(url, (err, body) => {
            expect(body).toEqual(expectedBody);
            done();
        });
    });



    test('get non-root path', (done) => {
        const url = dummyUrl;
        const path = '/path';
        const fullUrl = url + path;
        const data = dummyResObject;
        const expectedBody = dummyResObject;

        fetchMock.get(fullUrl, data);

        clientRequest.get(fullUrl, (err, body) => {
            expect(body).toEqual(expectedBody);
            done();
        });
    });


    test('get root path with query params', (done) => {
        const url = dummyUrl;
        const queryParams = {q: 'value'};
        const queryParamsStr = 'q=value';
        const response = dummyResObject;
        const expectedBody = response;

        fetchMock.get(url + '?' + queryParamsStr, response);

        clientRequest.get(url, queryParams, (err, body) => {
            expect(body).toEqual(expectedBody);
            done();
        });
    });


    test('get non-root path with query params', (done) => {
        const url = dummyUrl;
        const path = '/path';
        const fullPath = url + path;
        const queryParams = {q: 'value'};
        const queryParamsStr = 'q=value';
        const response = dummyResObject;
        const expectedBody = response;

        fetchMock.get(fullPath + '?' + queryParamsStr, response);

        clientRequest.get(fullPath, queryParams, (err, body) => {
            expect(body).toEqual(expectedBody);
            done();
        });
    });


    test('forceGetData adds no-cache header', (done) => {
        const url = dummyUrl;
        const path = '/path';
        const fullPath = url + path;
        const queryParams = {q: 'value'};
        const queryParamsStr = 'q=value';
        const response = dummyResObject;
        const expectedBody = response;


        fetchMock.get(
            fullPath + '?' + queryParamsStr,
            response,
            {
                headers : {
                    'Cache-Control': 'no-cache'
                }
            });

        clientRequest.forceGetData(url + path, queryParams, (err, body) => {
            expect(body).toEqual(expectedBody);
            done();
        });
    });


    test('post dummy test', (done) => {
        const responseBody = {response: 'data from the server'};

        fetchMock.once('http://test.url', {
            status: 200,
            body: JSON.stringify(responseBody),
            statusText: 'OK',
            headers: {'Content-Type': 'application/json'},
            sendAsJson: false
        }, {method: 'POST'});

        fetch('http://test.url',
            {
                method: 'post',
                body: JSON.stringify({data: 'Sent payload'}),
                headers : {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(function (res) {
                expect(res.status).toEqual(200); // Pass
                return res.json(); // return here
            })
            .then(function (json) {
                expect(json).toEqual(responseBody); // Fail expected value to equal: {"response": "data from the server"} Received: undefined

                done();
            })
    });

    test('post request data send as body', (done) => {
        const url = dummyUrl;
        const path = '/path';
        const fullPath = url + path;
        const response = dummyResObject;
        const expectedBody = response;

        fetchMock.once(fullPath, {
            status: 200,
            body: JSON.stringify(response),
            statusText: 'OK',
            headers: {'Content-Type': 'application/json'},
            sendAsJson: false
        }, {method: 'POST'});

        clientRequest.post(url + path, dummyPostData, (err, body) => {
            expect(body).toEqual(expectedBody);
            done();
        });
    });

    test('post request without any data send an empty object', (done) => {
        const url = dummyUrl;
        const path = '/path';
        const fullPath = url + path;
        const response = dummyResObject;
        const expectedBody = response;

        fetchMock.once(fullPath, {
            status: 200,
            body: JSON.stringify(response),
            statusText: 'OK',
            headers: {'Content-Type': 'application/json'},
            sendAsJson: false
        }, {method: 'POST'});

        clientRequest.post(url + path, (err, body) => {
            expect(body).toEqual(expectedBody);
            done();
        });
    });


    test('put request data sends as body', (done) => {
        const url = dummyUrl;
        const path = '/path';
        const fullPath = url + path;
        const response = dummyResObject;
        const expectedBody = response;

        fetchMock.once(fullPath, {
            status: 200,
            body: JSON.stringify(response),
            statusText: 'OK',
            headers: {'Content-Type': 'application/json'},
            sendAsJson: false
        }, {method: 'PUT'});

        clientRequest.put(url + path, dummyPostData, (err, body) => {
            expect(body).toEqual(expectedBody);
            done();
        });
    });
});
