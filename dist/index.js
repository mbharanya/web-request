"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
exports.throwResponseError = false;
async function get(uri, options) { return await create(uri, Object.assign({}, options, { method: 'GET' })).response; }
exports.get = get;
async function post(uri, options, content) { return await create(uri, Object.assign({}, options, { method: 'POST' }), content).response; }
exports.post = post;
async function put(uri, options, content) { return await create(uri, Object.assign({}, options, { method: 'PUT' }), content).response; }
exports.put = put;
async function patch(uri, options, content) { return await create(uri, Object.assign({}, options, { method: 'PATCH' }), content).response; }
exports.patch = patch;
async function head(uri, options) { return await create(uri, Object.assign({}, options, { method: 'HEAD' })).response; }
exports.head = head;
async function del(uri, options) { return await create(uri, Object.assign({}, options, { method: 'DELETE' })).response; }
exports.del = del;
exports.delete = del;
async function json(uri, options) { return (await create(uri, Object.assign({}, options, { json: true })).response).content; }
exports.json = json;
function create(uri, options, content) {
    options = Object.assign({}, options, { uri: uri });
    if (options.jar === true)
        options.jar = request.jar();
    if (content !== undefined)
        options.body = content;
    var throwEnabled = exports.throwResponseError;
    if (options.throwResponseError !== undefined)
        throwEnabled = options.throwResponseError;
    var instance;
    var promise = new Promise((resolve, reject) => {
        instance = request(options, (err, message, body) => {
            if (!err) {
                var response = new Response(instance, message, body);
                if (message.statusCode < 400 || !throwEnabled)
                    resolve(response);
                else
                    reject(new ResponseError(response));
            }
            else {
                reject(new RequestError(err, instance));
            }
        });
    });
    instance.options = options;
    instance.response = promise;
    return instance;
}
exports.create = create;
function stream(uri, options, content) {
    options = Object.assign({}, options, { uri: uri });
    if (options.jar === true)
        options.jar = request.jar();
    if (content !== undefined)
        options.body = content;
    var instance = request(options);
    instance.options = options;
    instance.response = new Promise((resolve, reject) => instance
        .on('complete', message => {
        var response = new Response(instance, message, null);
        if (message.statusCode < 400 || !exports.throwResponseError)
            resolve(response);
        else
            reject(new ResponseError(response));
    })
        .on('error', err => reject(new RequestError(err, instance))));
    return instance;
}
exports.stream = stream;
function defaults(options) {
    if (options.throwResponseError !== undefined)
        exports.throwResponseError = options.throwResponseError;
    request.defaults(options);
}
exports.defaults = defaults;
function debug(value) {
    if (value === undefined)
        return request.debug;
    else
        request.debug = value;
}
exports.debug = debug;
class RequestError extends Error {
    constructor(err, request) {
        super(err.message);
        this.request = request;
        this.innerError = err;
    }
}
exports.RequestError = RequestError;
class Response {
    constructor(request, message, body) {
        this.request = request;
        this.message = message;
        this.body = body;
    }
    get charset() { return parseContentType(this.message.headers['content-type']).charset; }
    get content() {
        return this.body;
    }
    get contentLength() {
        if ('content-length' in this.message.headers)
            return parseInt(this.message.headers['content-length']);
        else if (typeof this.body === 'string')
            return this.body.length;
    }
    get contentType() { return parseContentType(this.message.headers['content-type']).contentType; }
    get cookies() {
        if (typeof this.request.options.jar === 'object') {
            var jar = this.request.options.jar;
            return jar.getCookies(this.request.options.uri);
        }
    }
    get headers() { return this.message.headers; }
    get httpVersion() { return this.message.httpVersion; }
    get lastModified() { return new Date(this.message.headers['last-modified']); }
    get method() { return this.message.method || this.message.request.method; }
    get server() { return this.message.headers['server']; }
    get statusCode() { return this.message.statusCode; }
    get statusMessage() { return this.message.statusMessage; }
    get uri() { return this.message.request.uri; }
}
exports.Response = Response;
class ResponseError extends Error {
    constructor(response) {
        super(response.statusMessage);
        this.response = response;
        this.statusCode = response.statusCode;
    }
}
exports.ResponseError = ResponseError;
function parseKeyValue(text) {
    var i = text.indexOf('=');
    return {
        key: i > 0 ? text.substring(0, i) : text,
        value: i > 0 ? text.substring(i + 1) : null
    };
}
function parseContentType(text) {
    var list = text ? text.split('; ') : [];
    var tuple1 = list.length > 0 ? parseKeyValue(list[0]) : null;
    var tuple2 = list.length > 1 ? parseKeyValue(list[1]) : null;
    return {
        contentType: tuple1 ? tuple1.key : null,
        charset: tuple2 && tuple2.key.toLowerCase() === 'charset' ? tuple2.value : null
    };
}
//# sourceMappingURL=index.js.map