/// <reference types="node" />
import * as http from 'http';
import * as _stream from 'stream';
import { Url } from 'url';
export declare var throwResponseError: boolean;
export declare function get(uri: string, options?: RequestOptions): Promise<Response<string>>;
export declare function post(uri: string, options?: RequestOptions, content?: any): Promise<Response<string>>;
export declare function put(uri: string, options?: RequestOptions, content?: any): Promise<Response<string>>;
export declare function patch(uri: string, options?: RequestOptions, content?: any): Promise<Response<string>>;
export declare function head(uri: string, options?: RequestOptions): Promise<Response<void>>;
export declare function del(uri: string, options?: RequestOptions): Promise<Response<string>>;
export declare function json<T>(uri: string, options?: RequestOptions): Promise<T>;
export { del as delete };
export declare function create<T>(uri: string, options?: RequestOptions, content?: any): Request<T>;
export declare function stream(uri: string, options?: RequestOptions, content?: any): Request<void>;
export declare function defaults(options: RequestOptions): void;
export declare function debug(value?: boolean): boolean;
export interface AuthOptions {
    user?: string;
    username?: string;
    pass?: string;
    password?: string;
    sendImmediately?: boolean;
    bearer?: string;
}
export interface AWSOptions {
    secret: string;
    bucket?: string;
}
export interface Cookie extends Array<CookieValue> {
    str: string;
    expires: Date;
    path: string;
    domain: string;
    toString(): string;
}
export interface CookieJar {
    setCookie(cookie: Cookie, uri: string | Url, options?: any): void;
    getCookieString(uri: string | Url): string;
    getCookies(uri: string | Url): Cookie[];
}
export interface CookieValue {
    name: string;
    value: any;
    httpOnly: boolean;
}
export interface Headers {
    [key: string]: any;
}
export interface HttpArchiveRequest {
    url?: string;
    method?: string;
    headers?: NameValuePair[];
    postData?: {
        mimeType?: string;
        params?: NameValuePair[];
    };
}
export interface Multipart {
    chunked?: boolean;
    data?: {
        'content-type'?: string;
        body: string;
    }[];
}
export interface NameValuePair {
    name: string;
    value: string;
}
export interface RequestPart {
    headers?: Headers;
    body: any;
}
export interface OAuthOptions {
    callback?: string;
    consumer_key?: string;
    consumer_secret?: string;
    token?: string;
    token_secret?: string;
    verifier?: string;
}
export interface Request<T> extends _stream.Stream {
    headers: Headers;
    method: string;
    readable: boolean;
    uri: Url;
    writable: boolean;
    getAgent(): http.Agent;
    pipeDest(dest: any): void;
    setHeader(name: string, value: string, clobber?: boolean): this;
    setHeaders(headers: Headers): this;
    qs(q: Object, clobber?: boolean): this;
    form(): any;
    form(form: any): this;
    multipart(multipart: RequestPart[]): this;
    json(val: any): this;
    aws(opts: AWSOptions, now?: boolean): this;
    auth(username: string, password: string, sendImmediately?: boolean, bearer?: string): this;
    oauth(oauth: OAuthOptions): this;
    jar(jar: CookieJar): this;
    on(event: string, listener: Function): this;
    on(event: 'request', listener: (req: http.ClientRequest) => void): this;
    on(event: 'response', listener: (resp: http.IncomingMessage) => void): this;
    on(event: 'data', listener: (data: Buffer | string) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'complete', listener: (resp: http.IncomingMessage, body?: string | Buffer) => void): this;
    write(buffer: Buffer, cb?: Function): boolean;
    write(str: string, cb?: Function): boolean;
    write(str: string, encoding: string, cb?: Function): boolean;
    write(str: string, encoding?: string, fd?: string): boolean;
    end(): void;
    end(chunk: Buffer, cb?: Function): void;
    end(chunk: string, cb?: Function): void;
    end(chunk: string, encoding: string, cb?: Function): void;
    pause(): void;
    resume(): void;
    abort(): void;
    destroy(): void;
    toJSON(): Object;
    options: RequestOptions;
    response: Promise<Response<T>>;
}
export interface RequestOptions {
    baseUrl?: string;
    jar?: CookieJar | boolean;
    formData?: Object;
    form?: Object | string;
    auth?: AuthOptions;
    oauth?: OAuthOptions;
    aws?: {
        secret: string;
        bucket?: string;
    };
    hawk?: {
        credentials: any;
    };
    qs?: any;
    json?: any;
    multipart?: RequestPart[] | Multipart;
    agentOptions?: any;
    agentClass?: any;
    forever?: any;
    host?: string;
    port?: number;
    method?: string;
    headers?: Headers;
    body?: any;
    followRedirect?: boolean | ((response: http.IncomingMessage) => boolean);
    followAllRedirects?: boolean;
    maxRedirects?: number;
    encoding?: string | null;
    pool?: any;
    timeout?: number;
    proxy?: any;
    strictSSL?: boolean;
    rejectUnauthorized?: boolean;
    gzip?: boolean;
    preambleCRLF?: boolean;
    postambleCRLF?: boolean;
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    ca?: Buffer;
    har?: HttpArchiveRequest;
    useQuerystring?: boolean;
    uri?: string;
    throwResponseError?: boolean;
    family?: number;
}
export declare class RequestError<T> extends Error {
    request: Request<T>;
    innerError: Error;
    constructor(err: Error, request: Request<T>);
}
export declare class Response<T> {
    request: Request<T>;
    message: http.IncomingMessage;
    private body;
    constructor(request: Request<T>, message: http.IncomingMessage, body: T);
    get charset(): string;
    get content(): T;
    get contentLength(): number;
    get contentType(): string;
    get cookies(): Cookie[];
    get headers(): Headers;
    get httpVersion(): string;
    get lastModified(): Date;
    get method(): string;
    get server(): string;
    get statusCode(): number;
    get statusMessage(): string;
    get uri(): Url;
}
export declare class ResponseError<T> extends Error {
    response: Response<T>;
    statusCode: number;
    constructor(response: Response<T>);
}
