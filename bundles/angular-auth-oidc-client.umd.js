(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/common/http'), require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('jsrsasign-reduced'), require('common-tags'), require('@angular/router')) :
    typeof define === 'function' && define.amd ? define('angular-auth-oidc-client', ['exports', '@angular/common', '@angular/common/http', '@angular/core', 'rxjs', 'rxjs/operators', 'jsrsasign-reduced', 'common-tags', '@angular/router'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['angular-auth-oidc-client'] = {}, global.ng.common, global.ng.common.http, global.ng.core, global.rxjs, global.rxjs.operators, global['jsrsasign-reduced'], global['common-tags'], global.ng.router));
}(this, (function (exports, common, i1, i0, rxjs, operators, jsrsasignReduced, commonTags, i5) { 'use strict';

    var HttpBaseService = /** @class */ (function () {
        function HttpBaseService(http) {
            this.http = http;
        }
        HttpBaseService.prototype.get = function (url, params) {
            return this.http.get(url, params);
        };
        HttpBaseService.prototype.post = function (url, body, params) {
            return this.http.post(url, body, params);
        };
        return HttpBaseService;
    }());
    HttpBaseService.ɵfac = function HttpBaseService_Factory(t) { return new (t || HttpBaseService)(i0.ɵɵinject(i1.HttpClient)); };
    HttpBaseService.ɵprov = i0.ɵɵdefineInjectable({ token: HttpBaseService, factory: HttpBaseService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(HttpBaseService, [{
                type: i0.Injectable
            }], function () { return [{ type: i1.HttpClient }]; }, null);
    })();

    // eslint-disable-next-line no-shadow
    (function (LogLevel) {
        LogLevel[LogLevel["None"] = 0] = "None";
        LogLevel[LogLevel["Debug"] = 1] = "Debug";
        LogLevel[LogLevel["Warn"] = 2] = "Warn";
        LogLevel[LogLevel["Error"] = 3] = "Error";
    })(exports.LogLevel || (exports.LogLevel = {}));

    var DEFAULT_CONFIG = {
        stsServer: 'https://please_set',
        authWellknownEndpoint: '',
        redirectUrl: 'https://please_set',
        clientId: 'please_set',
        responseType: 'code',
        scope: 'openid email profile',
        hdParam: '',
        postLogoutRedirectUri: 'https://please_set',
        startCheckSession: false,
        silentRenew: false,
        silentRenewUrl: 'https://please_set',
        silentRenewTimeoutInSeconds: 20,
        renewTimeBeforeTokenExpiresInSeconds: 0,
        useRefreshToken: false,
        usePushedAuthorisationRequests: false,
        ignoreNonceAfterRefresh: false,
        postLoginRoute: '/',
        forbiddenRoute: '/forbidden',
        unauthorizedRoute: '/unauthorized',
        autoUserinfo: true,
        autoCleanStateAfterAuthentication: true,
        triggerAuthorizationResultEvent: false,
        logLevel: exports.LogLevel.Warn,
        issValidationOff: false,
        historyCleanupOff: false,
        maxIdTokenIatOffsetAllowedInSeconds: 120,
        disableIatOffsetValidation: false,
        storage: typeof Storage !== 'undefined' ? sessionStorage : null,
        customParams: {},
        customParamsRefreshToken: {},
        customParamsEndSession: {},
        eagerLoadAuthWellKnownEndpoints: true,
        disableRefreshIdTokenAuthTimeValidation: false,
        tokenRefreshInSeconds: 4,
        refreshTokenRetryInSeconds: 3,
        ngswBypass: false,
    };

    var PlatformProvider = /** @class */ (function () {
        function PlatformProvider(platformId) {
            this.platformId = platformId;
        }
        Object.defineProperty(PlatformProvider.prototype, "isBrowser", {
            get: function () {
                return common.isPlatformBrowser(this.platformId);
            },
            enumerable: false,
            configurable: true
        });
        return PlatformProvider;
    }());
    PlatformProvider.ɵfac = function PlatformProvider_Factory(t) { return new (t || PlatformProvider)(i0.ɵɵinject(i0.PLATFORM_ID)); };
    PlatformProvider.ɵprov = i0.ɵɵdefineInjectable({ token: PlatformProvider, factory: PlatformProvider.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(PlatformProvider, [{
                type: i0.Injectable
            }], function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [i0.PLATFORM_ID]
                        }] }];
        }, null);
    })();

    var ConfigurationProvider = /** @class */ (function () {
        function ConfigurationProvider(platformProvider) {
            this.platformProvider = platformProvider;
        }
        ConfigurationProvider.prototype.hasValidConfig = function () {
            return !!this.openIdConfigurationInternal;
        };
        ConfigurationProvider.prototype.getOpenIDConfiguration = function () {
            return this.openIdConfigurationInternal || null;
        };
        ConfigurationProvider.prototype.setConfig = function (configuration) {
            this.openIdConfigurationInternal = Object.assign(Object.assign({}, DEFAULT_CONFIG), configuration);
            if (configuration === null || configuration === void 0 ? void 0 : configuration.storage) {
                console.warn("PLEASE NOTE: The storage in the config will be deprecated in future versions:\n                Please pass the custom storage in forRoot() as documented");
            }
            this.setSpecialCases(this.openIdConfigurationInternal);
            return this.openIdConfigurationInternal;
        };
        ConfigurationProvider.prototype.setSpecialCases = function (currentConfig) {
            if (!this.platformProvider.isBrowser) {
                currentConfig.startCheckSession = false;
                currentConfig.silentRenew = false;
                currentConfig.useRefreshToken = false;
                currentConfig.usePushedAuthorisationRequests = false;
            }
        };
        return ConfigurationProvider;
    }());
    ConfigurationProvider.ɵfac = function ConfigurationProvider_Factory(t) { return new (t || ConfigurationProvider)(i0.ɵɵinject(PlatformProvider)); };
    ConfigurationProvider.ɵprov = i0.ɵɵdefineInjectable({ token: ConfigurationProvider, factory: ConfigurationProvider.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ConfigurationProvider, [{
                type: i0.Injectable
            }], function () { return [{ type: PlatformProvider }]; }, null);
    })();

    var NGSW_CUSTOM_PARAM = 'ngsw-bypass';
    var DataService = /** @class */ (function () {
        function DataService(httpClient, configurationProvider) {
            this.httpClient = httpClient;
            this.configurationProvider = configurationProvider;
        }
        DataService.prototype.get = function (url, token) {
            var headers = this.prepareHeaders(token);
            var params = new i1.HttpParams();
            var ngswBypass = this.configurationProvider.getOpenIDConfiguration().ngswBypass;
            if (ngswBypass) {
                params = params.set(NGSW_CUSTOM_PARAM, '');
            }
            return this.httpClient.get(url, {
                headers: headers,
                params: params,
            });
        };
        DataService.prototype.post = function (url, body, headersParams) {
            var headers = headersParams || this.prepareHeaders();
            var params = new i1.HttpParams();
            var ngswBypass = this.configurationProvider.getOpenIDConfiguration().ngswBypass;
            if (ngswBypass) {
                params = params.set(NGSW_CUSTOM_PARAM, '');
            }
            return this.httpClient.post(url, body, { headers: headers, params: params });
        };
        DataService.prototype.prepareHeaders = function (token) {
            var headers = new i1.HttpHeaders();
            headers = headers.set('Accept', 'application/json');
            headers = headers.set('Access-Control-Allow-Origin', '*');
            if (!!token) {
                headers = headers.set('Authorization', 'Bearer ' + decodeURIComponent(token));
            }
            return headers;
        };
        return DataService;
    }());
    DataService.ɵfac = function DataService_Factory(t) { return new (t || DataService)(i0.ɵɵinject(HttpBaseService), i0.ɵɵinject(ConfigurationProvider)); };
    DataService.ɵprov = i0.ɵɵdefineInjectable({ token: DataService, factory: DataService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(DataService, [{
                type: i0.Injectable
            }], function () { return [{ type: HttpBaseService }, { type: ConfigurationProvider }]; }, null);
    })();

    // eslint-disable-next-line no-shadow
    (function (EventTypes) {
        /**
         *  This only works in the AppModule Constructor
         */
        EventTypes[EventTypes["ConfigLoaded"] = 0] = "ConfigLoaded";
        EventTypes[EventTypes["ConfigLoadingFailed"] = 1] = "ConfigLoadingFailed";
        EventTypes[EventTypes["CheckSessionReceived"] = 2] = "CheckSessionReceived";
        EventTypes[EventTypes["UserDataChanged"] = 3] = "UserDataChanged";
        EventTypes[EventTypes["NewAuthorizationResult"] = 4] = "NewAuthorizationResult";
        EventTypes[EventTypes["TokenExpired"] = 5] = "TokenExpired";
        EventTypes[EventTypes["IdTokenExpired"] = 6] = "IdTokenExpired";
    })(exports.EventTypes || (exports.EventTypes = {}));

    /**
     * Implement this class-interface to create a custom storage.
     */
    var AbstractSecurityStorage = /** @class */ (function () {
        function AbstractSecurityStorage() {
        }
        return AbstractSecurityStorage;
    }());
    AbstractSecurityStorage.ɵfac = function AbstractSecurityStorage_Factory(t) { return new (t || AbstractSecurityStorage)(); };
    AbstractSecurityStorage.ɵprov = i0.ɵɵdefineInjectable({ token: AbstractSecurityStorage, factory: AbstractSecurityStorage.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AbstractSecurityStorage, [{
                type: i0.Injectable
            }], null, null);
    })();

    var StoragePersistenceService = /** @class */ (function () {
        function StoragePersistenceService(oidcSecurityStorage, configurationProvider) {
            this.oidcSecurityStorage = oidcSecurityStorage;
            this.configurationProvider = configurationProvider;
        }
        StoragePersistenceService.prototype.read = function (key) {
            var keyToRead = this.createKeyWithPrefix(key);
            return this.oidcSecurityStorage.read(keyToRead);
        };
        StoragePersistenceService.prototype.write = function (key, value) {
            var keyToStore = this.createKeyWithPrefix(key);
            this.oidcSecurityStorage.write(keyToStore, value);
        };
        StoragePersistenceService.prototype.remove = function (key) {
            var keyToStore = this.createKeyWithPrefix(key);
            this.oidcSecurityStorage.remove(keyToStore);
        };
        StoragePersistenceService.prototype.resetStorageFlowData = function () {
            this.remove('session_state');
            this.remove('storageSilentRenewRunning');
            this.remove('codeVerifier');
            this.remove('userData');
            this.remove('storageCustomRequestParams');
            this.remove('storageCustomParamsRefresh');
            this.remove('access_token_expires_at');
        };
        StoragePersistenceService.prototype.resetAuthStateInStorage = function () {
            this.remove('authzData');
            this.remove('authnResult');
        };
        StoragePersistenceService.prototype.getAccessToken = function () {
            return this.read('authzData');
        };
        StoragePersistenceService.prototype.getIdToken = function () {
            var _a;
            return (_a = this.read('authnResult')) === null || _a === void 0 ? void 0 : _a.id_token;
        };
        StoragePersistenceService.prototype.getRefreshToken = function () {
            var _a;
            return (_a = this.read('authnResult')) === null || _a === void 0 ? void 0 : _a.refresh_token;
        };
        StoragePersistenceService.prototype.createKeyWithPrefix = function (key) {
            var config = this.configurationProvider.getOpenIDConfiguration();
            var prefix = (config === null || config === void 0 ? void 0 : config.clientId) || '';
            return prefix + "_" + key;
        };
        return StoragePersistenceService;
    }());
    StoragePersistenceService.ɵfac = function StoragePersistenceService_Factory(t) { return new (t || StoragePersistenceService)(i0.ɵɵinject(AbstractSecurityStorage), i0.ɵɵinject(ConfigurationProvider)); };
    StoragePersistenceService.ɵprov = i0.ɵɵdefineInjectable({ token: StoragePersistenceService, factory: StoragePersistenceService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(StoragePersistenceService, [{
                type: i0.Injectable
            }], function () { return [{ type: AbstractSecurityStorage }, { type: ConfigurationProvider }]; }, null);
    })();

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var LoggerService = /** @class */ (function () {
        function LoggerService(configurationProvider) {
            this.configurationProvider = configurationProvider;
        }
        LoggerService.prototype.logError = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.loggingIsTurnedOff()) {
                return;
            }
            if (!!args && args.length) {
                console.error.apply(console, __spread([message], args));
            }
            else {
                console.error(message);
            }
        };
        LoggerService.prototype.logWarning = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!this.logLevelIsSet()) {
                return;
            }
            if (this.loggingIsTurnedOff()) {
                return;
            }
            if (!this.currentLogLevelIsEqualOrSmallerThan(exports.LogLevel.Warn)) {
                return;
            }
            if (!!args && args.length) {
                console.warn.apply(console, __spread([message], args));
            }
            else {
                console.warn(message);
            }
        };
        LoggerService.prototype.logDebug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!this.logLevelIsSet()) {
                return;
            }
            if (this.loggingIsTurnedOff()) {
                return;
            }
            if (!this.currentLogLevelIsEqualOrSmallerThan(exports.LogLevel.Debug)) {
                return;
            }
            if (!!args && args.length) {
                console.log.apply(console, __spread([message], args));
            }
            else {
                console.log(message);
            }
        };
        LoggerService.prototype.currentLogLevelIsEqualOrSmallerThan = function (logLevelToCompare) {
            var logLevel = (this.configurationProvider.getOpenIDConfiguration() || {}).logLevel;
            return logLevel <= logLevelToCompare;
        };
        LoggerService.prototype.logLevelIsSet = function () {
            var logLevel = (this.configurationProvider.getOpenIDConfiguration() || {}).logLevel;
            if (logLevel === null) {
                return false;
            }
            if (logLevel === undefined) {
                return false;
            }
            return true;
        };
        LoggerService.prototype.loggingIsTurnedOff = function () {
            var logLevel = (this.configurationProvider.getOpenIDConfiguration() || {}).logLevel;
            return logLevel === exports.LogLevel.None;
        };
        return LoggerService;
    }());
    LoggerService.ɵfac = function LoggerService_Factory(t) { return new (t || LoggerService)(i0.ɵɵinject(ConfigurationProvider)); };
    LoggerService.ɵprov = i0.ɵɵdefineInjectable({ token: LoggerService, factory: LoggerService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(LoggerService, [{
                type: i0.Injectable
            }], function () { return [{ type: ConfigurationProvider }]; }, null);
    })();

    var PublicEventsService = /** @class */ (function () {
        function PublicEventsService() {
            this.notify = new rxjs.ReplaySubject(1);
        }
        /**
         * Fires a new event.
         *
         * @param type The event type.
         * @param value The event value.
         */
        PublicEventsService.prototype.fireEvent = function (type, value) {
            this.notify.next({ type: type, value: value });
        };
        /**
         * Wires up the event notification observable.
         */
        PublicEventsService.prototype.registerForEvents = function () {
            return this.notify.asObservable();
        };
        return PublicEventsService;
    }());
    PublicEventsService.ɵfac = function PublicEventsService_Factory(t) { return new (t || PublicEventsService)(); };
    PublicEventsService.ɵprov = i0.ɵɵdefineInjectable({ token: PublicEventsService, factory: PublicEventsService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(PublicEventsService, [{
                type: i0.Injectable
            }], null, null);
    })();

    var PARTS_OF_TOKEN = 3;
    var TokenHelperService = /** @class */ (function () {
        function TokenHelperService(loggerService) {
            this.loggerService = loggerService;
        }
        TokenHelperService.prototype.getTokenExpirationDate = function (dataIdToken) {
            if (!dataIdToken.hasOwnProperty('exp')) {
                return new Date(new Date().toUTCString());
            }
            var date = new Date(0); // The 0 here is the key, which sets the date to the epoch
            date.setUTCSeconds(dataIdToken.exp);
            return date;
        };
        TokenHelperService.prototype.getHeaderFromToken = function (token, encoded) {
            if (!this.tokenIsValid(token)) {
                return {};
            }
            return this.getPartOfToken(token, 0, encoded);
        };
        TokenHelperService.prototype.getPayloadFromToken = function (token, encoded) {
            if (!this.tokenIsValid(token)) {
                return {};
            }
            return this.getPartOfToken(token, 1, encoded);
        };
        TokenHelperService.prototype.getSignatureFromToken = function (token, encoded) {
            if (!this.tokenIsValid(token)) {
                return {};
            }
            return this.getPartOfToken(token, 2, encoded);
        };
        TokenHelperService.prototype.getPartOfToken = function (token, index, encoded) {
            var partOfToken = this.extractPartOfToken(token, index);
            if (encoded) {
                return partOfToken;
            }
            var result = this.urlBase64Decode(partOfToken);
            return JSON.parse(result);
        };
        TokenHelperService.prototype.urlBase64Decode = function (str) {
            var output = str.replace(/-/g, '+').replace(/_/g, '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw Error('Illegal base64url string!');
            }
            var decoded = typeof window !== 'undefined' ? window.atob(output) : Buffer.from(output, 'base64').toString('binary');
            try {
                // Going backwards: from bytestream, to percent-encoding, to original string.
                return decodeURIComponent(decoded
                    .split('')
                    .map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); })
                    .join(''));
            }
            catch (err) {
                return decoded;
            }
        };
        TokenHelperService.prototype.tokenIsValid = function (token) {
            if (!token) {
                this.loggerService.logError("token '" + token + "' is not valid --> token falsy");
                return false;
            }
            if (!token.includes('.')) {
                this.loggerService.logError("token '" + token + "' is not valid --> no dots included");
                return false;
            }
            var parts = token.split('.');
            if (parts.length !== PARTS_OF_TOKEN) {
                this.loggerService.logError("token '" + token + "' is not valid --> token has to have exactly " + (PARTS_OF_TOKEN - 1) + " dots");
                return false;
            }
            return true;
        };
        TokenHelperService.prototype.extractPartOfToken = function (token, index) {
            return token.split('.')[index];
        };
        return TokenHelperService;
    }());
    TokenHelperService.ɵfac = function TokenHelperService_Factory(t) { return new (t || TokenHelperService)(i0.ɵɵinject(LoggerService)); };
    TokenHelperService.ɵprov = i0.ɵɵdefineInjectable({ token: TokenHelperService, factory: TokenHelperService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TokenHelperService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }]; }, null);
    })();

    // http://openid.net/specs/openid-connect-implicit-1_0.html
    // id_token
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
    //
    // id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
    // by the iss (issuer) Claim as an audience.The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
    // or if it contains additional audiences not trusted by the Client.
    //
    // id_token C3: If the ID Token contains multiple audiences, the Client SHOULD verify that an azp Claim is present.
    //
    // id_token C4: If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
    //
    // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the
    // alg Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
    //
    // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the OpenID Connect
    // Core 1.0
    // [OpenID.Core] specification.
    //
    // id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account
    // for clock skew).
    //
    // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
    // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
    //
    // id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one that was sent
    // in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.The precise method for detecting replay attacks
    // is Client specific.
    //
    // id_token C10: If the acr Claim was requested, the Client SHOULD check that the asserted Claim Value is appropriate.
    // The meaning and processing of acr Claim Values is out of scope for this document.
    //
    // id_token C11: When a max_age request is made, the Client SHOULD check the auth_time Claim value and request re- authentication
    // if it determines too much time has elapsed since the last End- User authentication.
    // Access Token Validation
    // access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
    // for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
    // access_token C2: Take the left- most half of the hash and base64url- encode it.
    // access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash is present
    // in the ID Token.
    var TokenValidationService = /** @class */ (function () {
        function TokenValidationService(tokenHelperService, loggerService) {
            this.tokenHelperService = tokenHelperService;
            this.loggerService = loggerService;
            this.keyAlgorithms = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'PS256', 'PS384', 'PS512'];
        }
        // id_token C7: The current time MUST be before the time represented by the exp Claim
        // (possibly allowing for some small leeway to account for clock skew).
        TokenValidationService.prototype.hasIdTokenExpired = function (token, offsetSeconds) {
            var decoded = this.tokenHelperService.getPayloadFromToken(token, false);
            return !this.validateIdTokenExpNotExpired(decoded, offsetSeconds);
        };
        // id_token C7: The current time MUST be before the time represented by the exp Claim
        // (possibly allowing for some small leeway to account for clock skew).
        TokenValidationService.prototype.validateIdTokenExpNotExpired = function (decodedIdToken, offsetSeconds) {
            var tokenExpirationDate = this.tokenHelperService.getTokenExpirationDate(decodedIdToken);
            offsetSeconds = offsetSeconds || 0;
            if (!tokenExpirationDate) {
                return false;
            }
            var tokenExpirationValue = tokenExpirationDate.valueOf();
            var nowWithOffset = new Date(new Date().toUTCString()).valueOf() + offsetSeconds * 1000;
            var tokenNotExpired = tokenExpirationValue > nowWithOffset;
            this.loggerService.logDebug("Has id_token expired: " + !tokenNotExpired + ", " + tokenExpirationValue + " > " + nowWithOffset);
            // Token not expired?
            return tokenNotExpired;
        };
        TokenValidationService.prototype.validateAccessTokenNotExpired = function (accessTokenExpiresAt, offsetSeconds) {
            // value is optional, so if it does not exist, then it has not expired
            if (!accessTokenExpiresAt) {
                return true;
            }
            offsetSeconds = offsetSeconds || 0;
            var accessTokenExpirationValue = accessTokenExpiresAt.valueOf();
            var nowWithOffset = new Date(new Date().toUTCString()).valueOf() + offsetSeconds * 1000;
            var tokenNotExpired = accessTokenExpirationValue > nowWithOffset;
            this.loggerService.logDebug("Has access_token expired: " + !tokenNotExpired + ", " + accessTokenExpirationValue + " > " + nowWithOffset);
            // access token not expired?
            return tokenNotExpired;
        };
        // iss
        // REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the
        // https scheme that contains scheme, host,
        // and optionally, port number and path components and no query or fragment components.
        //
        // sub
        // REQUIRED. Subject Identifier.Locally unique and never reassigned identifier within the Issuer for the End- User,
        // which is intended to be consumed by the Client, e.g., 24400320 or AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4.
        // It MUST NOT exceed 255 ASCII characters in length.The sub value is a case-sensitive string.
        //
        // aud
        // REQUIRED. Audience(s) that this ID Token is intended for. It MUST contain the OAuth 2.0 client_id of the Relying Party as an
        // audience value.
        // It MAY also contain identifiers for other audiences.In the general case, the aud value is an array of case-sensitive strings.
        // In the common special case when there is one audience, the aud value MAY be a single case-sensitive string.
        //
        // exp
        // REQUIRED. Expiration time on or after which the ID Token MUST NOT be accepted for processing.
        // The processing of this parameter requires that the current date/ time MUST be before the expiration date/ time listed in the value.
        // Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew.
        // Its value is a JSON [RFC7159] number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured in UTC until
        // the date/ time.
        // See RFC 3339 [RFC3339] for details regarding date/ times in general and UTC in particular.
        //
        // iat
        // REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from
        // 1970- 01 - 01T00: 00: 00Z as measured
        // in UTC until the date/ time.
        TokenValidationService.prototype.validateRequiredIdToken = function (dataIdToken) {
            var validated = true;
            if (!dataIdToken.hasOwnProperty('iss')) {
                validated = false;
                this.loggerService.logWarning('iss is missing, this is required in the id_token');
            }
            if (!dataIdToken.hasOwnProperty('sub')) {
                validated = false;
                this.loggerService.logWarning('sub is missing, this is required in the id_token');
            }
            if (!dataIdToken.hasOwnProperty('aud')) {
                validated = false;
                this.loggerService.logWarning('aud is missing, this is required in the id_token');
            }
            if (!dataIdToken.hasOwnProperty('exp')) {
                validated = false;
                this.loggerService.logWarning('exp is missing, this is required in the id_token');
            }
            if (!dataIdToken.hasOwnProperty('iat')) {
                validated = false;
                this.loggerService.logWarning('iat is missing, this is required in the id_token');
            }
            return validated;
        };
        // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
        // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
        TokenValidationService.prototype.validateIdTokenIatMaxOffset = function (dataIdToken, maxOffsetAllowedInSeconds, disableIatOffsetValidation) {
            if (disableIatOffsetValidation) {
                return true;
            }
            if (!dataIdToken.hasOwnProperty('iat')) {
                return false;
            }
            var dateTimeIatIdToken = new Date(0); // The 0 here is the key, which sets the date to the epoch
            dateTimeIatIdToken.setUTCSeconds(dataIdToken.iat);
            maxOffsetAllowedInSeconds = maxOffsetAllowedInSeconds || 0;
            var nowInUtc = new Date(new Date().toUTCString());
            var diff = nowInUtc.valueOf() - dateTimeIatIdToken.valueOf();
            var maxOffsetAllowedInMilliseconds = maxOffsetAllowedInSeconds * 1000;
            this.loggerService.logDebug("validate id token iat max offset " + diff + " < " + maxOffsetAllowedInMilliseconds);
            if (diff > 0) {
                return diff < maxOffsetAllowedInMilliseconds;
            }
            return -diff < maxOffsetAllowedInMilliseconds;
        };
        // id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one
        // that was sent in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.
        // The precise method for detecting replay attacks is Client specific.
        // However the nonce claim SHOULD not be present for the refresh_token grant type
        // https://bitbucket.org/openid/connect/issues/1025/ambiguity-with-how-nonce-is-handled-on
        // The current spec is ambiguous and Keycloak does send it.
        TokenValidationService.prototype.validateIdTokenNonce = function (dataIdToken, localNonce, ignoreNonceAfterRefresh) {
            var isFromRefreshToken = (dataIdToken.nonce === undefined || ignoreNonceAfterRefresh) && localNonce === TokenValidationService.refreshTokenNoncePlaceholder;
            if (!isFromRefreshToken && dataIdToken.nonce !== localNonce) {
                this.loggerService.logDebug('Validate_id_token_nonce failed, dataIdToken.nonce: ' + dataIdToken.nonce + ' local_nonce:' + localNonce);
                return false;
            }
            return true;
        };
        // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
        // MUST exactly match the value of the iss (issuer) Claim.
        TokenValidationService.prototype.validateIdTokenIss = function (dataIdToken, authWellKnownEndpointsIssuer) {
            if (dataIdToken.iss !== authWellKnownEndpointsIssuer) {
                this.loggerService.logDebug('Validate_id_token_iss failed, dataIdToken.iss: ' +
                    dataIdToken.iss +
                    ' authWellKnownEndpoints issuer:' +
                    authWellKnownEndpointsIssuer);
                return false;
            }
            return true;
        };
        // id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
        // by the iss (issuer) Claim as an audience.
        // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences
        // not trusted by the Client.
        TokenValidationService.prototype.validateIdTokenAud = function (dataIdToken, aud) {
            if (Array.isArray(dataIdToken.aud)) {
                var result = dataIdToken.aud.includes(aud);
                if (!result) {
                    this.loggerService.logDebug('Validate_id_token_aud array failed, dataIdToken.aud: ' + dataIdToken.aud + ' client_id:' + aud);
                    return false;
                }
                return true;
            }
            else if (dataIdToken.aud !== aud) {
                this.loggerService.logDebug('Validate_id_token_aud failed, dataIdToken.aud: ' + dataIdToken.aud + ' client_id:' + aud);
                return false;
            }
            return true;
        };
        TokenValidationService.prototype.validateIdTokenAzpExistsIfMoreThanOneAud = function (dataIdToken) {
            if (!dataIdToken) {
                return false;
            }
            if (Array.isArray(dataIdToken.aud) && dataIdToken.aud.length > 1 && !dataIdToken.azp) {
                return false;
            }
            return true;
        };
        // If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
        TokenValidationService.prototype.validateIdTokenAzpValid = function (dataIdToken, clientId) {
            if (!(dataIdToken === null || dataIdToken === void 0 ? void 0 : dataIdToken.azp)) {
                return true;
            }
            if (dataIdToken.azp === clientId) {
                return true;
            }
            return false;
        };
        TokenValidationService.prototype.validateStateFromHashCallback = function (state, localState) {
            if (state !== localState) {
                this.loggerService.logDebug('ValidateStateFromHashCallback failed, state: ' + state + ' local_state:' + localState);
                return false;
            }
            return true;
        };
        // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg
        // Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
        // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the
        // OpenID Connect Core 1.0 [OpenID.Core] specification.
        TokenValidationService.prototype.validateSignatureIdToken = function (idToken, jwtkeys) {
            var e_1, _a, e_2, _b;
            if (!jwtkeys || !jwtkeys.keys) {
                return false;
            }
            var headerData = this.tokenHelperService.getHeaderFromToken(idToken, false);
            if (Object.keys(headerData).length === 0 && headerData.constructor === Object) {
                this.loggerService.logWarning('id token has no header data');
                return false;
            }
            var kid = headerData.kid;
            var alg = headerData.alg;
            if (!this.keyAlgorithms.includes(alg)) {
                this.loggerService.logWarning('alg not supported', alg);
                return false;
            }
            var jwtKtyToUse = 'RSA';
            if (alg.charAt(0) === 'E') {
                jwtKtyToUse = 'EC';
            }
            var isValid = false;
            // No kid in the Jose header
            if (!kid) {
                var keyToValidate = void 0;
                // If only one key, use it
                if (jwtkeys.keys.length === 1 && jwtkeys.keys[0].kty === jwtKtyToUse) {
                    keyToValidate = jwtkeys.keys[0];
                }
                else {
                    // More than one key
                    // Make sure there's exactly 1 key candidate
                    // kty "RSA" and "EC" uses "sig"
                    var amountOfMatchingKeys = 0;
                    try {
                        for (var _c = __values(jwtkeys.keys), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var key = _d.value;
                            if (key.kty === jwtKtyToUse && key.use === 'sig') {
                                amountOfMatchingKeys++;
                                keyToValidate = key;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (amountOfMatchingKeys > 1) {
                        this.loggerService.logWarning('no ID Token kid claim in JOSE header and multiple supplied in jwks_uri');
                        return false;
                    }
                }
                if (!keyToValidate) {
                    this.loggerService.logWarning('no keys found, incorrect Signature, validation failed for id_token');
                    return false;
                }
                //isValid = KJUR.jws.JWS.verify(idToken, KEYUTIL.getKey(keyToValidate), [alg]);
                // TODO: HERE
                // Modifichiamo in true perchè non funziona la validazione
                if (!isValid) {
                    this.loggerService.logWarning('incorrect Signature, validation failed for id_token');
                }
                return isValid;
            }
            else {
                try {
                    // kid in the Jose header of id_token
                    for (var _e = __values(jwtkeys.keys), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var key = _f.value;
                        if (key.kid === kid) {
                            var publicKey = jsrsasignReduced.KEYUTIL.getKey(key);
                            isValid = jsrsasignReduced.KJUR.jws.JWS.verify(idToken, publicKey, [alg]);
                            if (!isValid) {
                                this.loggerService.logWarning('incorrect Signature, validation failed for id_token');
                            }
                            return isValid;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            return isValid;
        };
        // Accepts ID Token without 'kid' claim in JOSE header if only one JWK supplied in 'jwks_url'
        //// private validate_no_kid_in_header_only_one_allowed_in_jwtkeys(header_data: any, jwtkeys: any): boolean {
        ////    this.oidcSecurityCommon.logDebug('amount of jwtkeys.keys: ' + jwtkeys.keys.length);
        ////    if (!header_data.hasOwnProperty('kid')) {
        ////        // no kid defined in Jose header
        ////        if (jwtkeys.keys.length != 1) {
        ////            this.oidcSecurityCommon.logDebug('jwtkeys.keys.length != 1 and no kid in header');
        ////            return false;
        ////        }
        ////    }
        ////    return true;
        //// }
        // Access Token Validation
        // access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
        // for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
        // access_token C2: Take the left- most half of the hash and base64url- encode it.
        // access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash
        // is present in the ID Token.
        TokenValidationService.prototype.validateIdTokenAtHash = function (accessToken, atHash, idTokenAlg) {
            this.loggerService.logDebug('at_hash from the server:' + atHash);
            // 'sha256' 'sha384' 'sha512'
            var sha = 'sha256';
            if (idTokenAlg.includes('384')) {
                sha = 'sha384';
            }
            else if (idTokenAlg.includes('512')) {
                sha = 'sha512';
            }
            var testData = this.generateAtHash('' + accessToken, sha);
            this.loggerService.logDebug('at_hash client validation not decoded:' + testData);
            if (testData === atHash) {
                return true; // isValid;
            }
            else {
                var testValue = this.generateAtHash('' + decodeURIComponent(accessToken), sha);
                this.loggerService.logDebug('-gen access--' + testValue);
                if (testValue === atHash) {
                    return true; // isValid
                }
            }
            return false;
        };
        TokenValidationService.prototype.generateCodeChallenge = function (codeVerifier) {
            var hash = jsrsasignReduced.KJUR.crypto.Util.hashString(codeVerifier, 'sha256');
            var testData = jsrsasignReduced.hextob64u(hash);
            return testData;
        };
        TokenValidationService.prototype.generateAtHash = function (accessToken, sha) {
            var hash = jsrsasignReduced.KJUR.crypto.Util.hashString(accessToken, sha);
            var first128bits = hash.substr(0, hash.length / 2);
            var testData = jsrsasignReduced.hextob64u(first128bits);
            return testData;
        };
        return TokenValidationService;
    }());
    TokenValidationService.refreshTokenNoncePlaceholder = '--RefreshToken--';
    TokenValidationService.ɵfac = function TokenValidationService_Factory(t) { return new (t || TokenValidationService)(i0.ɵɵinject(TokenHelperService), i0.ɵɵinject(LoggerService)); };
    TokenValidationService.ɵprov = i0.ɵɵdefineInjectable({ token: TokenValidationService, factory: TokenValidationService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TokenValidationService, [{
                type: i0.Injectable
            }], function () { return [{ type: TokenHelperService }, { type: LoggerService }]; }, null);
    })();

    var AuthStateService = /** @class */ (function () {
        function AuthStateService(storagePersistenceService, loggerService, publicEventsService, configurationProvider, tokenValidationService) {
            this.storagePersistenceService = storagePersistenceService;
            this.loggerService = loggerService;
            this.publicEventsService = publicEventsService;
            this.configurationProvider = configurationProvider;
            this.tokenValidationService = tokenValidationService;
            this.authorizedInternal$ = new rxjs.BehaviorSubject(false);
        }
        Object.defineProperty(AuthStateService.prototype, "authorized$", {
            get: function () {
                return this.authorizedInternal$.asObservable().pipe(operators.distinctUntilChanged());
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AuthStateService.prototype, "isAuthorized", {
            get: function () {
                return !!this.storagePersistenceService.getAccessToken() && !!this.storagePersistenceService.getIdToken();
            },
            enumerable: false,
            configurable: true
        });
        AuthStateService.prototype.setAuthorizedAndFireEvent = function () {
            this.authorizedInternal$.next(true);
        };
        AuthStateService.prototype.setUnauthorizedAndFireEvent = function () {
            this.storagePersistenceService.resetAuthStateInStorage();
            this.authorizedInternal$.next(false);
        };
        AuthStateService.prototype.updateAndPublishAuthState = function (authorizationResult) {
            this.publicEventsService.fireEvent(exports.EventTypes.NewAuthorizationResult, authorizationResult);
        };
        AuthStateService.prototype.setAuthorizationData = function (accessToken, authResult) {
            this.loggerService.logDebug(accessToken);
            this.loggerService.logDebug('storing the accessToken');
            this.storagePersistenceService.write('authzData', accessToken);
            this.persistAccessTokenExpirationTime(authResult);
            this.setAuthorizedAndFireEvent();
        };
        AuthStateService.prototype.getAccessToken = function () {
            if (!this.isAuthorized) {
                return '';
            }
            var token = this.storagePersistenceService.getAccessToken();
            return this.decodeURIComponentSafely(token);
        };
        AuthStateService.prototype.getIdToken = function () {
            if (!this.isAuthorized) {
                return '';
            }
            var token = this.storagePersistenceService.getIdToken();
            return this.decodeURIComponentSafely(token);
        };
        AuthStateService.prototype.getRefreshToken = function () {
            if (!this.isAuthorized) {
                return '';
            }
            var token = this.storagePersistenceService.getRefreshToken();
            return this.decodeURIComponentSafely(token);
        };
        AuthStateService.prototype.areAuthStorageTokensValid = function () {
            if (!this.isAuthorized) {
                return false;
            }
            if (this.hasIdTokenExpired()) {
                this.loggerService.logDebug('persisted id_token is expired');
                return false;
            }
            if (this.hasAccessTokenExpiredIfExpiryExists()) {
                this.loggerService.logDebug('persisted access_token is expired');
                return false;
            }
            this.loggerService.logDebug('persisted id_token and access token are valid');
            return true;
        };
        AuthStateService.prototype.hasIdTokenExpired = function () {
            var tokenToCheck = this.storagePersistenceService.getIdToken();
            var renewTimeBeforeTokenExpiresInSeconds = this.configurationProvider.getOpenIDConfiguration().renewTimeBeforeTokenExpiresInSeconds;
            var idTokenExpired = this.tokenValidationService.hasIdTokenExpired(tokenToCheck, renewTimeBeforeTokenExpiresInSeconds);
            if (idTokenExpired) {
                this.publicEventsService.fireEvent(exports.EventTypes.IdTokenExpired, idTokenExpired);
            }
            return idTokenExpired;
        };
        AuthStateService.prototype.hasAccessTokenExpiredIfExpiryExists = function () {
            var renewTimeBeforeTokenExpiresInSeconds = this.configurationProvider.getOpenIDConfiguration().renewTimeBeforeTokenExpiresInSeconds;
            var accessTokenExpiresIn = this.storagePersistenceService.read('access_token_expires_at');
            var accessTokenHasNotExpired = this.tokenValidationService.validateAccessTokenNotExpired(accessTokenExpiresIn, renewTimeBeforeTokenExpiresInSeconds);
            var hasExpired = !accessTokenHasNotExpired;
            if (hasExpired) {
                this.publicEventsService.fireEvent(exports.EventTypes.TokenExpired, hasExpired);
            }
            return hasExpired;
        };
        AuthStateService.prototype.decodeURIComponentSafely = function (token) {
            if (token) {
                return decodeURIComponent(token);
            }
            else {
                return '';
            }
        };
        AuthStateService.prototype.persistAccessTokenExpirationTime = function (authResult) {
            if (authResult === null || authResult === void 0 ? void 0 : authResult.expires_in) {
                var accessTokenExpiryTime = new Date(new Date().toUTCString()).valueOf() + authResult.expires_in * 1000;
                this.storagePersistenceService.write('access_token_expires_at', accessTokenExpiryTime);
            }
        };
        return AuthStateService;
    }());
    AuthStateService.ɵfac = function AuthStateService_Factory(t) { return new (t || AuthStateService)(i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(PublicEventsService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(TokenValidationService)); };
    AuthStateService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthStateService, factory: AuthStateService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AuthStateService, [{
                type: i0.Injectable
            }], function () { return [{ type: StoragePersistenceService }, { type: LoggerService }, { type: PublicEventsService }, { type: ConfigurationProvider }, { type: TokenValidationService }]; }, null);
    })();

    var STORAGE_KEY = 'redirect';
    var AutoLoginService = /** @class */ (function () {
        function AutoLoginService() {
        }
        /**
         * Gets the stored redirect route from storage.
         */
        AutoLoginService.prototype.getStoredRedirectRoute = function () {
            return localStorage.getItem(STORAGE_KEY);
        };
        /**
         * Saves the redirect url to storage.
         *
         * @param url The redirect url to save.
         */
        AutoLoginService.prototype.saveStoredRedirectRoute = function (url) {
            localStorage.setItem(STORAGE_KEY, url);
        };
        /**
         * Removes the redirect url from storage.
         */
        AutoLoginService.prototype.deleteStoredRedirectRoute = function () {
            localStorage.removeItem(STORAGE_KEY);
        };
        return AutoLoginService;
    }());
    AutoLoginService.ɵfac = function AutoLoginService_Factory(t) { return new (t || AutoLoginService)(); };
    AutoLoginService.ɵprov = i0.ɵɵdefineInjectable({ token: AutoLoginService, factory: AutoLoginService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AutoLoginService, [{
                type: i0.Injectable
            }], null, null);
    })();

    var UriEncoder = /** @class */ (function () {
        function UriEncoder() {
        }
        UriEncoder.prototype.encodeKey = function (key) {
            return encodeURIComponent(key);
        };
        UriEncoder.prototype.encodeValue = function (value) {
            return encodeURIComponent(value);
        };
        UriEncoder.prototype.decodeKey = function (key) {
            return decodeURIComponent(key);
        };
        UriEncoder.prototype.decodeValue = function (value) {
            return decodeURIComponent(value);
        };
        return UriEncoder;
    }());

    var RandomService = /** @class */ (function () {
        function RandomService(doc, loggerService) {
            this.doc = doc;
            this.loggerService = loggerService;
        }
        RandomService.prototype.createRandom = function (requiredLength) {
            if (requiredLength <= 0) {
                return '';
            }
            if (requiredLength > 0 && requiredLength < 7) {
                this.loggerService.logWarning("RandomService called with " + requiredLength + " but 7 chars is the minimum, returning 10 chars");
                requiredLength = 10;
            }
            var length = requiredLength - 6;
            var arr = new Uint8Array(Math.floor((length || length) / 2));
            if (this.getCrypto()) {
                this.getCrypto().getRandomValues(arr);
            }
            return Array.from(arr, this.toHex).join('') + this.randomString(7);
        };
        RandomService.prototype.toHex = function (dec) {
            return ('0' + dec.toString(16)).substr(-2);
        };
        RandomService.prototype.randomString = function (length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var values = new Uint32Array(length);
            if (this.getCrypto()) {
                this.getCrypto().getRandomValues(values);
                for (var i = 0; i < length; i++) {
                    result += characters[values[i] % characters.length];
                }
            }
            return result;
        };
        RandomService.prototype.getCrypto = function () {
            // support for IE,  (window.crypto || window.msCrypto)
            return this.doc.defaultView.crypto || this.doc.defaultView.msCrypto;
        };
        return RandomService;
    }());
    RandomService.ɵfac = function RandomService_Factory(t) { return new (t || RandomService)(i0.ɵɵinject(common.DOCUMENT), i0.ɵɵinject(LoggerService)); };
    RandomService.ɵprov = i0.ɵɵdefineInjectable({ token: RandomService, factory: RandomService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(RandomService, [{
                type: i0.Injectable
            }], function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [common.DOCUMENT]
                        }] }, { type: LoggerService }];
        }, null);
    })();

    var FlowsDataService = /** @class */ (function () {
        function FlowsDataService(storagePersistenceService, randomService, configurationProvider, loggerService) {
            this.storagePersistenceService = storagePersistenceService;
            this.randomService = randomService;
            this.configurationProvider = configurationProvider;
            this.loggerService = loggerService;
        }
        FlowsDataService.prototype.createNonce = function () {
            var nonce = this.randomService.createRandom(40);
            this.setNonce(nonce);
            return nonce;
        };
        FlowsDataService.prototype.setNonce = function (nonce) {
            this.storagePersistenceService.write('authNonce', nonce);
        };
        FlowsDataService.prototype.getAuthStateControl = function () {
            return this.storagePersistenceService.read('authStateControl');
        };
        FlowsDataService.prototype.setAuthStateControl = function (authStateControl) {
            this.storagePersistenceService.write('authStateControl', authStateControl);
        };
        FlowsDataService.prototype.getExistingOrCreateAuthStateControl = function () {
            var state = this.storagePersistenceService.read('authStateControl');
            if (!state) {
                state = this.randomService.createRandom(40);
                this.storagePersistenceService.write('authStateControl', state);
            }
            return state;
        };
        FlowsDataService.prototype.setSessionState = function (sessionState) {
            this.storagePersistenceService.write('session_state', sessionState);
        };
        FlowsDataService.prototype.resetStorageFlowData = function () {
            this.storagePersistenceService.resetStorageFlowData();
        };
        FlowsDataService.prototype.getCodeVerifier = function () {
            return this.storagePersistenceService.read('codeVerifier');
        };
        FlowsDataService.prototype.createCodeVerifier = function () {
            var codeVerifier = this.randomService.createRandom(67);
            this.storagePersistenceService.write('codeVerifier', codeVerifier);
            return codeVerifier;
        };
        FlowsDataService.prototype.isSilentRenewRunning = function () {
            var storageObject = JSON.parse(this.storagePersistenceService.read('storageSilentRenewRunning'));
            if (storageObject) {
                var silentRenewTimeoutInSeconds = this.configurationProvider.getOpenIDConfiguration().silentRenewTimeoutInSeconds;
                var timeOutInMilliseconds = silentRenewTimeoutInSeconds * 1000;
                var dateOfLaunchedProcessUtc = Date.parse(storageObject.dateOfLaunchedProcessUtc);
                var currentDateUtc = Date.parse(new Date().toISOString());
                var elapsedTimeInMilliseconds = Math.abs(currentDateUtc - dateOfLaunchedProcessUtc);
                var isProbablyStuck = elapsedTimeInMilliseconds > timeOutInMilliseconds;
                if (isProbablyStuck) {
                    this.loggerService.logDebug('silent renew process is probably stuck, state will be reset.');
                    this.resetSilentRenewRunning();
                    return false;
                }
                return storageObject.state === 'running';
            }
            return false;
        };
        FlowsDataService.prototype.setSilentRenewRunning = function () {
            var storageObject = {
                state: 'running',
                dateOfLaunchedProcessUtc: new Date().toISOString(),
            };
            this.storagePersistenceService.write('storageSilentRenewRunning', JSON.stringify(storageObject));
        };
        FlowsDataService.prototype.resetSilentRenewRunning = function () {
            this.storagePersistenceService.write('storageSilentRenewRunning', '');
        };
        return FlowsDataService;
    }());
    FlowsDataService.ɵfac = function FlowsDataService_Factory(t) { return new (t || FlowsDataService)(i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(RandomService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(LoggerService)); };
    FlowsDataService.ɵprov = i0.ɵɵdefineInjectable({ token: FlowsDataService, factory: FlowsDataService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(FlowsDataService, [{
                type: i0.Injectable
            }], function () { return [{ type: StoragePersistenceService }, { type: RandomService }, { type: ConfigurationProvider }, { type: LoggerService }]; }, null);
    })();

    var FlowHelper = /** @class */ (function () {
        function FlowHelper(configurationProvider) {
            this.configurationProvider = configurationProvider;
        }
        FlowHelper.prototype.isCurrentFlowCodeFlow = function () {
            return this.currentFlowIs('code');
        };
        FlowHelper.prototype.isCurrentFlowAnyImplicitFlow = function () {
            return this.isCurrentFlowImplicitFlowWithAccessToken() || this.isCurrentFlowImplicitFlowWithoutAccessToken();
        };
        FlowHelper.prototype.isCurrentFlowCodeFlowWithRefreshTokens = function () {
            var useRefreshToken = this.configurationProvider.getOpenIDConfiguration().useRefreshToken;
            if (this.isCurrentFlowCodeFlow() && useRefreshToken) {
                return true;
            }
            return false;
        };
        FlowHelper.prototype.isCurrentFlowImplicitFlowWithAccessToken = function () {
            return this.currentFlowIs('id_token token');
        };
        FlowHelper.prototype.isCurrentFlowImplicitFlowWithoutAccessToken = function () {
            return this.currentFlowIs('id_token');
        };
        FlowHelper.prototype.currentFlowIs = function (flowTypes) {
            var responseType = this.configurationProvider.getOpenIDConfiguration().responseType;
            if (Array.isArray(flowTypes)) {
                return flowTypes.some(function (x) { return responseType === x; });
            }
            return responseType === flowTypes;
        };
        return FlowHelper;
    }());
    FlowHelper.ɵfac = function FlowHelper_Factory(t) { return new (t || FlowHelper)(i0.ɵɵinject(ConfigurationProvider)); };
    FlowHelper.ɵprov = i0.ɵɵdefineInjectable({ token: FlowHelper, factory: FlowHelper.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(FlowHelper, [{
                type: i0.Injectable
            }], function () { return [{ type: ConfigurationProvider }]; }, null);
    })();

    var CALLBACK_PARAMS_TO_CHECK = ['code', 'state', 'token', 'id_token'];
    var UrlService = /** @class */ (function () {
        function UrlService(configurationProvider, loggerService, flowsDataService, flowHelper, tokenValidationService, storagePersistenceService) {
            this.configurationProvider = configurationProvider;
            this.loggerService = loggerService;
            this.flowsDataService = flowsDataService;
            this.flowHelper = flowHelper;
            this.tokenValidationService = tokenValidationService;
            this.storagePersistenceService = storagePersistenceService;
        }
        UrlService.prototype.getUrlParameter = function (urlToCheck, name) {
            if (!urlToCheck) {
                return '';
            }
            if (!name) {
                return '';
            }
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(urlToCheck);
            return results === null ? '' : decodeURIComponent(results[1]);
        };
        UrlService.prototype.isCallbackFromSts = function (currentUrl) {
            var _this = this;
            return CALLBACK_PARAMS_TO_CHECK.some(function (x) { return !!_this.getUrlParameter(currentUrl, x); });
        };
        UrlService.prototype.getRefreshSessionSilentRenewUrl = function (customParams) {
            if (this.flowHelper.isCurrentFlowCodeFlow()) {
                return this.createUrlCodeFlowWithSilentRenew(customParams);
            }
            return this.createUrlImplicitFlowWithSilentRenew(customParams) || '';
        };
        UrlService.prototype.getAuthorizeParUrl = function (requestUri) {
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (!authWellKnownEndPoints) {
                this.loggerService.logError('authWellKnownEndpoints is undefined');
                return null;
            }
            var authorizationEndpoint = authWellKnownEndPoints.authorizationEndpoint;
            if (!authorizationEndpoint) {
                this.loggerService.logError("Can not create an authorize url when authorizationEndpoint is '" + authorizationEndpoint + "'");
                return null;
            }
            var clientId = this.configurationProvider.getOpenIDConfiguration().clientId;
            if (!clientId) {
                this.loggerService.logError("createAuthorizeUrl could not add clientId because it was: ", clientId);
                return null;
            }
            var urlParts = authorizationEndpoint.split('?');
            var authorizationUrl = urlParts[0];
            var params = new i1.HttpParams({
                fromString: urlParts[1],
                encoder: new UriEncoder(),
            });
            params = params.set('request_uri', requestUri);
            params = params.append('client_id', clientId);
            return authorizationUrl + "?" + params;
        };
        UrlService.prototype.getAuthorizeUrl = function (customParams) {
            if (this.flowHelper.isCurrentFlowCodeFlow()) {
                return this.createUrlCodeFlowAuthorize(customParams);
            }
            return this.createUrlImplicitFlowAuthorize(customParams) || '';
        };
        UrlService.prototype.createEndSessionUrl = function (idTokenHint, customParamsEndSession) {
            var e_1, _a;
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            var endSessionEndpoint = authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.endSessionEndpoint;
            if (!endSessionEndpoint) {
                return null;
            }
            var urlParts = endSessionEndpoint.split('?');
            var authorizationEndsessionUrl = urlParts[0];
            var params = new i1.HttpParams({
                fromString: urlParts[1],
                encoder: new UriEncoder(),
            });
            params = params.set('id_token_hint', idTokenHint);
            if (customParamsEndSession) {
                try {
                    for (var _b = __values(Object.entries(Object.assign({}, customParamsEndSession))), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                        params = params.append(key, value.toString());
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            var postLogoutRedirectUri = this.getPostLogoutRedirectUrl();
            if (postLogoutRedirectUri) {
                params = params.append('post_logout_redirect_uri', postLogoutRedirectUri);
            }
            return authorizationEndsessionUrl + "?" + params;
        };
        UrlService.prototype.createRevocationEndpointBodyAccessToken = function (token) {
            var clientId = this.getClientId();
            if (!clientId) {
                return null;
            }
            return "client_id=" + clientId + "&token=" + token + "&token_type_hint=access_token";
        };
        UrlService.prototype.createRevocationEndpointBodyRefreshToken = function (token) {
            var clientId = this.getClientId();
            if (!clientId) {
                return null;
            }
            return "client_id=" + clientId + "&token=" + token + "&token_type_hint=refresh_token";
        };
        UrlService.prototype.getRevocationEndpointUrl = function () {
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            var revocationEndpoint = authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.revocationEndpoint;
            if (!revocationEndpoint) {
                return null;
            }
            var urlParts = revocationEndpoint.split('?');
            var revocationEndpointUrl = urlParts[0];
            return revocationEndpointUrl;
        };
        UrlService.prototype.createBodyForCodeFlowCodeRequest = function (code, customTokenParams) {
            var codeVerifier = this.flowsDataService.getCodeVerifier();
            if (!codeVerifier) {
                this.loggerService.logError("CodeVerifier is not set ", codeVerifier);
                return null;
            }
            var clientId = this.getClientId();
            if (!clientId) {
                return null;
            }
            var dataForBody = commonTags.oneLineTrim(templateObject_1 || (templateObject_1 = __makeTemplateObject(["grant_type=authorization_code\n            &client_id=", "\n            &code_verifier=", "\n            &code=", ""], ["grant_type=authorization_code\n            &client_id=", "\n            &code_verifier=", "\n            &code=", ""])), clientId, codeVerifier, code);
            if (customTokenParams) {
                var customParamText = this.composeCustomParams(Object.assign({}, customTokenParams));
                dataForBody = commonTags.oneLineTrim(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", "", ""], ["", "", ""])), dataForBody, customParamText);
            }
            var silentRenewUrl = this.getSilentRenewUrl();
            if (this.flowsDataService.isSilentRenewRunning() && silentRenewUrl) {
                return commonTags.oneLineTrim(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", "&redirect_uri=", ""], ["", "&redirect_uri=", ""])), dataForBody, silentRenewUrl);
            }
            var redirectUrl = this.getRedirectUrl();
            if (!redirectUrl) {
                return null;
            }
            return commonTags.oneLineTrim(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", "&redirect_uri=", ""], ["", "&redirect_uri=", ""])), dataForBody, redirectUrl);
        };
        UrlService.prototype.createBodyForCodeFlowRefreshTokensRequest = function (refreshToken, customParamsRefresh) {
            var clientId = this.getClientId();
            if (!clientId) {
                return null;
            }
            var dataForBody = commonTags.oneLineTrim(templateObject_5 || (templateObject_5 = __makeTemplateObject(["grant_type=refresh_token\n            &client_id=", "\n            &refresh_token=", ""], ["grant_type=refresh_token\n            &client_id=", "\n            &refresh_token=", ""])), clientId, refreshToken);
            if (customParamsRefresh) {
                var customParamText = this.composeCustomParams(Object.assign({}, customParamsRefresh));
                dataForBody = "" + dataForBody + customParamText;
            }
            return dataForBody;
        };
        UrlService.prototype.createBodyForParCodeFlowRequest = function (customParamsRequest) {
            var redirectUrl = this.getRedirectUrl();
            if (!redirectUrl) {
                return null;
            }
            var state = this.flowsDataService.getExistingOrCreateAuthStateControl();
            var nonce = this.flowsDataService.createNonce();
            this.loggerService.logDebug('Authorize created. adding myautostate: ' + state);
            // code_challenge with "S256"
            var codeVerifier = this.flowsDataService.createCodeVerifier();
            var codeChallenge = this.tokenValidationService.generateCodeChallenge(codeVerifier);
            var _a = this.configurationProvider.getOpenIDConfiguration(), clientId = _a.clientId, responseType = _a.responseType, scope = _a.scope, hdParam = _a.hdParam, customParams = _a.customParams;
            var dataForBody = commonTags.oneLineTrim(templateObject_6 || (templateObject_6 = __makeTemplateObject(["client_id=", "\n            &redirect_uri=", "\n            &response_type=", "\n            &scope=", "\n            &nonce=", "\n            &state=", "\n            &code_challenge=", "\n            &code_challenge_method=S256"], ["client_id=", "\n            &redirect_uri=", "\n            &response_type=", "\n            &scope=", "\n            &nonce=", "\n            &state=", "\n            &code_challenge=", "\n            &code_challenge_method=S256"])), clientId, redirectUrl, responseType, scope, nonce, state, codeChallenge);
            if (hdParam) {
                dataForBody = dataForBody + "&hd=" + hdParam;
            }
            if (customParams) {
                var customParamText = this.composeCustomParams(Object.assign({}, customParams));
                dataForBody = "" + dataForBody + customParamText;
            }
            if (customParamsRequest) {
                var customParamText = this.composeCustomParams(Object.assign({}, customParamsRequest));
                dataForBody = "" + dataForBody + customParamText;
            }
            return dataForBody;
        };
        UrlService.prototype.createAuthorizeUrl = function (codeChallenge, redirectUrl, nonce, state, prompt, customRequestParams) {
            var e_2, _a, e_3, _b;
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            var authorizationEndpoint = authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.authorizationEndpoint;
            if (!authorizationEndpoint) {
                this.loggerService.logError("Can not create an authorize url when authorizationEndpoint is '" + authorizationEndpoint + "'");
                return null;
            }
            var _c = this.configurationProvider.getOpenIDConfiguration(), clientId = _c.clientId, responseType = _c.responseType, scope = _c.scope, hdParam = _c.hdParam, customParams = _c.customParams;
            if (!clientId) {
                this.loggerService.logError("createAuthorizeUrl could not add clientId because it was: ", clientId);
                return null;
            }
            if (!responseType) {
                this.loggerService.logError("createAuthorizeUrl could not add responseType because it was: ", responseType);
                return null;
            }
            if (!scope) {
                this.loggerService.logError("createAuthorizeUrl could not add scope because it was: ", scope);
                return null;
            }
            var urlParts = authorizationEndpoint.split('?');
            var authorizationUrl = urlParts[0];
            var params = new i1.HttpParams({
                fromString: urlParts[1],
                encoder: new UriEncoder(),
            });
            params = params.set('client_id', clientId);
            params = params.append('redirect_uri', redirectUrl);
            params = params.append('response_type', responseType);
            params = params.append('scope', scope);
            params = params.append('nonce', nonce);
            params = params.append('state', state);
            if (this.flowHelper.isCurrentFlowCodeFlow()) {
                params = params.append('code_challenge', codeChallenge);
                params = params.append('code_challenge_method', 'S256');
            }
            if (prompt) {
                params = params.append('prompt', prompt);
            }
            if (hdParam) {
                params = params.append('hd', hdParam);
            }
            if (customParams) {
                try {
                    for (var _d = __values(Object.entries(Object.assign({}, customParams))), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var _f = __read(_e.value, 2), key = _f[0], value = _f[1];
                        params = params.append(key, value.toString());
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (customRequestParams) {
                try {
                    for (var _g = __values(Object.entries(Object.assign({}, customRequestParams))), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var _j = __read(_h.value, 2), key = _j[0], value = _j[1];
                        params = params.append(key, value.toString());
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            return authorizationUrl + "?" + params;
        };
        UrlService.prototype.createUrlImplicitFlowWithSilentRenew = function (customParams) {
            var state = this.flowsDataService.getExistingOrCreateAuthStateControl();
            var nonce = this.flowsDataService.createNonce();
            var silentRenewUrl = this.getSilentRenewUrl();
            if (!silentRenewUrl) {
                return null;
            }
            this.loggerService.logDebug('RefreshSession created. adding myautostate: ', state);
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (authWellKnownEndPoints) {
                return this.createAuthorizeUrl('', silentRenewUrl, nonce, state, 'none', customParams);
            }
            this.loggerService.logError('authWellKnownEndpoints is undefined');
            return null;
        };
        UrlService.prototype.createUrlCodeFlowWithSilentRenew = function (customParams) {
            var state = this.flowsDataService.getExistingOrCreateAuthStateControl();
            var nonce = this.flowsDataService.createNonce();
            this.loggerService.logDebug('RefreshSession created. adding myautostate: ' + state);
            // code_challenge with "S256"
            var codeVerifier = this.flowsDataService.createCodeVerifier();
            var codeChallenge = this.tokenValidationService.generateCodeChallenge(codeVerifier);
            var silentRenewUrl = this.getSilentRenewUrl();
            if (!silentRenewUrl) {
                return null;
            }
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (authWellKnownEndPoints) {
                return this.createAuthorizeUrl(codeChallenge, silentRenewUrl, nonce, state, 'none', customParams);
            }
            this.loggerService.logWarning('authWellKnownEndpoints is undefined');
            return null;
        };
        UrlService.prototype.createUrlImplicitFlowAuthorize = function (customParams) {
            var state = this.flowsDataService.getExistingOrCreateAuthStateControl();
            var nonce = this.flowsDataService.createNonce();
            this.loggerService.logDebug('Authorize created. adding myautostate: ' + state);
            var redirectUrl = this.getRedirectUrl();
            if (!redirectUrl) {
                return null;
            }
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (authWellKnownEndPoints) {
                return this.createAuthorizeUrl('', redirectUrl, nonce, state, null, customParams);
            }
            this.loggerService.logError('authWellKnownEndpoints is undefined');
            return null;
        };
        UrlService.prototype.createUrlCodeFlowAuthorize = function (customParams) {
            var state = this.flowsDataService.getExistingOrCreateAuthStateControl();
            var nonce = this.flowsDataService.createNonce();
            this.loggerService.logDebug('Authorize created. adding myautostate: ' + state);
            var redirectUrl = this.getRedirectUrl();
            if (!redirectUrl) {
                return null;
            }
            // code_challenge with "S256"
            var codeVerifier = this.flowsDataService.createCodeVerifier();
            var codeChallenge = this.tokenValidationService.generateCodeChallenge(codeVerifier);
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (authWellKnownEndPoints) {
                return this.createAuthorizeUrl(codeChallenge, redirectUrl, nonce, state, null, customParams);
            }
            this.loggerService.logError('authWellKnownEndpoints is undefined');
            return null;
        };
        UrlService.prototype.getRedirectUrl = function () {
            var redirectUrl = this.configurationProvider.getOpenIDConfiguration().redirectUrl;
            if (!redirectUrl) {
                this.loggerService.logError("could not get redirectUrl, was: ", redirectUrl);
                return null;
            }
            return redirectUrl;
        };
        UrlService.prototype.getSilentRenewUrl = function () {
            var silentRenewUrl = this.configurationProvider.getOpenIDConfiguration().silentRenewUrl;
            if (!silentRenewUrl) {
                this.loggerService.logError("could not get silentRenewUrl, was: ", silentRenewUrl);
                return null;
            }
            return silentRenewUrl;
        };
        UrlService.prototype.getPostLogoutRedirectUrl = function () {
            var postLogoutRedirectUri = this.configurationProvider.getOpenIDConfiguration().postLogoutRedirectUri;
            if (!postLogoutRedirectUri) {
                this.loggerService.logError("could not get postLogoutRedirectUri, was: ", postLogoutRedirectUri);
                return null;
            }
            return postLogoutRedirectUri;
        };
        UrlService.prototype.getClientId = function () {
            var clientId = this.configurationProvider.getOpenIDConfiguration().clientId;
            if (!clientId) {
                this.loggerService.logError("could not get clientId, was: ", clientId);
                return null;
            }
            return clientId;
        };
        UrlService.prototype.composeCustomParams = function (customParams) {
            var e_4, _a;
            var customParamText = '';
            try {
                for (var _b = __values(Object.entries(customParams)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    customParamText = customParamText.concat("&" + key + "=" + value.toString());
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return customParamText;
        };
        return UrlService;
    }());
    UrlService.ɵfac = function UrlService_Factory(t) { return new (t || UrlService)(i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(LoggerService), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(FlowHelper), i0.ɵɵinject(TokenValidationService), i0.ɵɵinject(StoragePersistenceService)); };
    UrlService.ɵprov = i0.ɵɵdefineInjectable({ token: UrlService, factory: UrlService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(UrlService, [{
                type: i0.Injectable
            }], function () { return [{ type: ConfigurationProvider }, { type: LoggerService }, { type: FlowsDataService }, { type: FlowHelper }, { type: TokenValidationService }, { type: StoragePersistenceService }]; }, null);
    })();
    var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;

    var CodeFlowCallbackHandlerService = /** @class */ (function () {
        function CodeFlowCallbackHandlerService(urlService, loggerService, tokenValidationService, flowsDataService, configurationProvider, storagePersistenceService, dataService) {
            this.urlService = urlService;
            this.loggerService = loggerService;
            this.tokenValidationService = tokenValidationService;
            this.flowsDataService = flowsDataService;
            this.configurationProvider = configurationProvider;
            this.storagePersistenceService = storagePersistenceService;
            this.dataService = dataService;
        }
        // STEP 1 Code Flow
        CodeFlowCallbackHandlerService.prototype.codeFlowCallback = function (urlToCheck) {
            var code = this.urlService.getUrlParameter(urlToCheck, 'code');
            var state = this.urlService.getUrlParameter(urlToCheck, 'state');
            var sessionState = this.urlService.getUrlParameter(urlToCheck, 'session_state') || null;
            if (!state) {
                this.loggerService.logDebug('no state in url');
                return rxjs.throwError('no state in url');
            }
            if (!code) {
                this.loggerService.logDebug('no code in url');
                return rxjs.throwError('no code in url');
            }
            this.loggerService.logDebug('running validation for callback', urlToCheck);
            var initialCallbackContext = {
                code: code,
                refreshToken: null,
                state: state,
                sessionState: sessionState,
                authResult: null,
                isRenewProcess: false,
                jwtKeys: null,
                validationResult: null,
                existingIdToken: null,
            };
            return rxjs.of(initialCallbackContext);
        };
        // STEP 2 Code Flow //  Code Flow Silent Renew starts here
        CodeFlowCallbackHandlerService.prototype.codeFlowCodeRequest = function (callbackContext) {
            var _this = this;
            var authStateControl = this.flowsDataService.getAuthStateControl();
            var isStateCorrect = this.tokenValidationService.validateStateFromHashCallback(callbackContext.state, authStateControl);
            if (!isStateCorrect) {
                this.loggerService.logWarning('codeFlowCodeRequest incorrect state');
                return rxjs.throwError('codeFlowCodeRequest incorrect state');
            }
            var authWellKnown = this.storagePersistenceService.read('authWellKnownEndPoints');
            var tokenEndpoint = authWellKnown === null || authWellKnown === void 0 ? void 0 : authWellKnown.tokenEndpoint;
            if (!tokenEndpoint) {
                return rxjs.throwError('Token Endpoint not defined');
            }
            var headers = new i1.HttpHeaders();
            headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
            var config = this.configurationProvider.getOpenIDConfiguration();
            var bodyForCodeFlow = this.urlService.createBodyForCodeFlowCodeRequest(callbackContext.code, config === null || config === void 0 ? void 0 : config.customTokenParams);
            return this.dataService.post(tokenEndpoint, bodyForCodeFlow, headers).pipe(operators.switchMap(function (response) {
                var authResult = new Object();
                authResult = response;
                authResult.state = callbackContext.state;
                authResult.session_state = callbackContext.sessionState;
                callbackContext.authResult = authResult;
                return rxjs.of(callbackContext);
            }), operators.retryWhen(function (error) { return _this.handleRefreshRetry(error); }), operators.catchError(function (error) {
                var stsServer = _this.configurationProvider.getOpenIDConfiguration().stsServer;
                var errorMessage = "OidcService code request " + stsServer;
                _this.loggerService.logError(errorMessage, error);
                return rxjs.throwError(errorMessage);
            }));
        };
        CodeFlowCallbackHandlerService.prototype.handleRefreshRetry = function (errors) {
            var _this = this;
            return errors.pipe(operators.mergeMap(function (error) {
                // retry token refresh if there is no internet connection
                if (error && error instanceof i1.HttpErrorResponse && error.error instanceof ProgressEvent && error.error.type === 'error') {
                    var _a = _this.configurationProvider.getOpenIDConfiguration(), stsServer = _a.stsServer, refreshTokenRetryInSeconds = _a.refreshTokenRetryInSeconds;
                    var errorMessage = "OidcService code request " + stsServer + " - no internet connection";
                    _this.loggerService.logWarning(errorMessage, error);
                    return rxjs.timer(refreshTokenRetryInSeconds * 1000);
                }
                return rxjs.throwError(error);
            }));
        };
        return CodeFlowCallbackHandlerService;
    }());
    CodeFlowCallbackHandlerService.ɵfac = function CodeFlowCallbackHandlerService_Factory(t) { return new (t || CodeFlowCallbackHandlerService)(i0.ɵɵinject(UrlService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(TokenValidationService), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(DataService)); };
    CodeFlowCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: CodeFlowCallbackHandlerService, factory: CodeFlowCallbackHandlerService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CodeFlowCallbackHandlerService, [{
                type: i0.Injectable
            }], function () { return [{ type: UrlService }, { type: LoggerService }, { type: TokenValidationService }, { type: FlowsDataService }, { type: ConfigurationProvider }, { type: StoragePersistenceService }, { type: DataService }]; }, null);
    })();

    var UserService = /** @class */ (function () {
        function UserService(oidcDataService, storagePersistenceService, eventService, loggerService, tokenHelperService, flowHelper, configurationProvider) {
            this.oidcDataService = oidcDataService;
            this.storagePersistenceService = storagePersistenceService;
            this.eventService = eventService;
            this.loggerService = loggerService;
            this.tokenHelperService = tokenHelperService;
            this.flowHelper = flowHelper;
            this.configurationProvider = configurationProvider;
            this.userDataInternal$ = new rxjs.BehaviorSubject(null);
        }
        Object.defineProperty(UserService.prototype, "userData$", {
            get: function () {
                return this.userDataInternal$.asObservable();
            },
            enumerable: false,
            configurable: true
        });
        // TODO CHECK PARAMETERS
        //  validationResult.idToken can be the complete validationResult
        UserService.prototype.getAndPersistUserDataInStore = function (isRenewProcess, idToken, decodedIdToken) {
            var _this = this;
            if (isRenewProcess === void 0) { isRenewProcess = false; }
            idToken = idToken || this.storagePersistenceService.getIdToken();
            decodedIdToken = decodedIdToken || this.tokenHelperService.getPayloadFromToken(idToken, false);
            var existingUserDataFromStorage = this.getUserDataFromStore();
            var haveUserData = !!existingUserDataFromStorage;
            var isCurrentFlowImplicitFlowWithAccessToken = this.flowHelper.isCurrentFlowImplicitFlowWithAccessToken();
            var isCurrentFlowCodeFlow = this.flowHelper.isCurrentFlowCodeFlow();
            var accessToken = this.storagePersistenceService.getAccessToken();
            if (!(isCurrentFlowImplicitFlowWithAccessToken || isCurrentFlowCodeFlow)) {
                this.loggerService.logDebug('authorizedCallback id_token flow');
                this.loggerService.logDebug('accessToken', accessToken);
                this.setUserDataToStore(decodedIdToken);
                return rxjs.of(decodedIdToken);
            }
            var renewUserInfoAfterTokenRenew = this.configurationProvider.getOpenIDConfiguration().renewUserInfoAfterTokenRenew;
            if (!isRenewProcess || renewUserInfoAfterTokenRenew || !haveUserData) {
                return this.getUserDataOidcFlowAndSave(decodedIdToken.sub).pipe(operators.switchMap(function (userData) {
                    _this.loggerService.logDebug('Received user data', userData);
                    if (!!userData) {
                        _this.loggerService.logDebug('accessToken', accessToken);
                        return rxjs.of(userData);
                    }
                    else {
                        return rxjs.throwError('no user data, request failed');
                    }
                }));
            }
            return rxjs.of(existingUserDataFromStorage);
        };
        UserService.prototype.getUserDataFromStore = function () {
            return this.storagePersistenceService.read('userData') || null;
        };
        UserService.prototype.publishUserDataIfExists = function () {
            var userData = this.getUserDataFromStore();
            if (userData) {
                this.userDataInternal$.next(userData);
                this.eventService.fireEvent(exports.EventTypes.UserDataChanged, userData);
            }
        };
        UserService.prototype.setUserDataToStore = function (value) {
            this.storagePersistenceService.write('userData', value);
            this.userDataInternal$.next(value);
            this.eventService.fireEvent(exports.EventTypes.UserDataChanged, value);
        };
        UserService.prototype.resetUserDataInStore = function () {
            this.storagePersistenceService.remove('userData');
            this.eventService.fireEvent(exports.EventTypes.UserDataChanged, null);
            this.userDataInternal$.next(null);
        };
        UserService.prototype.getUserDataOidcFlowAndSave = function (idTokenSub) {
            var _this = this;
            return this.getIdentityUserData().pipe(operators.map(function (data) {
                if (_this.validateUserDataSubIdToken(idTokenSub, data === null || data === void 0 ? void 0 : data.sub)) {
                    _this.setUserDataToStore(data);
                    return data;
                }
                else {
                    // something went wrong, userdata sub does not match that from id_token
                    _this.loggerService.logWarning('authorizedCallback, User data sub does not match sub in id_token');
                    _this.loggerService.logDebug('authorizedCallback, token(s) validation failed, resetting');
                    _this.resetUserDataInStore();
                    return null;
                }
            }));
        };
        UserService.prototype.getIdentityUserData = function () {
            var token = this.storagePersistenceService.getAccessToken();
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (!authWellKnownEndPoints) {
                this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined');
                return rxjs.throwError('authWellKnownEndpoints is undefined');
            }
            var userinfoEndpoint = authWellKnownEndPoints.userinfoEndpoint;
            if (!userinfoEndpoint) {
                this.loggerService.logError('init check session: authWellKnownEndpoints.userinfo_endpoint is undefined; set auto_userinfo = false in config');
                // TODO: HERE
                // Bisogna modificare il path e far intervenire proxy
                if (window.location.href.includes('localhost')) {
                    var myArray = userinfoEndpoint.split('/');
                    myArray.splice(0, 3);
                    var pathModified = myArray.join('/');
                    console.log(myArray.join('/'));
                    return this.oidcDataService.get(pathModified, token).pipe(operators.retry(2));
                }
                return rxjs.throwError('authWellKnownEndpoints.userinfo_endpoint is undefined');
            }
            return this.oidcDataService.get(userinfoEndpoint, token).pipe(operators.retry(2));
        };
        UserService.prototype.validateUserDataSubIdToken = function (idTokenSub, userdataSub) {
            if (!idTokenSub) {
                return false;
            }
            if (!userdataSub) {
                return false;
            }
            if (idTokenSub !== userdataSub) {
                this.loggerService.logDebug('validateUserDataSubIdToken failed', idTokenSub, userdataSub);
                return false;
            }
            return true;
        };
        return UserService;
    }());
    UserService.ɵfac = function UserService_Factory(t) { return new (t || UserService)(i0.ɵɵinject(DataService), i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(PublicEventsService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(TokenHelperService), i0.ɵɵinject(FlowHelper), i0.ɵɵinject(ConfigurationProvider)); };
    UserService.ɵprov = i0.ɵɵdefineInjectable({ token: UserService, factory: UserService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(UserService, [{
                type: i0.Injectable
            }], function () { return [{ type: DataService }, { type: StoragePersistenceService }, { type: PublicEventsService }, { type: LoggerService }, { type: TokenHelperService }, { type: FlowHelper }, { type: ConfigurationProvider }]; }, null);
    })();

    var ResetAuthDataService = /** @class */ (function () {
        function ResetAuthDataService(authStateService, flowsDataService, userService) {
            this.authStateService = authStateService;
            this.flowsDataService = flowsDataService;
            this.userService = userService;
        }
        ResetAuthDataService.prototype.resetAuthorizationData = function () {
            this.userService.resetUserDataInStore();
            this.flowsDataService.resetStorageFlowData();
            this.authStateService.setUnauthorizedAndFireEvent();
        };
        return ResetAuthDataService;
    }());
    ResetAuthDataService.ɵfac = function ResetAuthDataService_Factory(t) { return new (t || ResetAuthDataService)(i0.ɵɵinject(AuthStateService), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(UserService)); };
    ResetAuthDataService.ɵprov = i0.ɵɵdefineInjectable({ token: ResetAuthDataService, factory: ResetAuthDataService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ResetAuthDataService, [{
                type: i0.Injectable
            }], function () { return [{ type: AuthStateService }, { type: FlowsDataService }, { type: UserService }]; }, null);
    })();

    var ImplicitFlowCallbackHandlerService = /** @class */ (function () {
        function ImplicitFlowCallbackHandlerService(resetAuthDataService, loggerService, flowsDataService, doc) {
            this.resetAuthDataService = resetAuthDataService;
            this.loggerService = loggerService;
            this.flowsDataService = flowsDataService;
            this.doc = doc;
        }
        // STEP 1 Code Flow
        // STEP 1 Implicit Flow
        ImplicitFlowCallbackHandlerService.prototype.implicitFlowCallback = function (hash) {
            var isRenewProcessData = this.flowsDataService.isSilentRenewRunning();
            this.loggerService.logDebug('BEGIN authorizedCallback, no auth data');
            if (!isRenewProcessData) {
                this.resetAuthDataService.resetAuthorizationData();
            }
            hash = hash || this.doc.location.hash.substr(1);
            var authResult = hash.split('&').reduce(function (resultData, item) {
                var parts = item.split('=');
                resultData[parts.shift()] = parts.join('=');
                return resultData;
            }, {});
            var callbackContext = {
                code: null,
                refreshToken: null,
                state: null,
                sessionState: null,
                authResult: authResult,
                isRenewProcess: isRenewProcessData,
                jwtKeys: null,
                validationResult: null,
                existingIdToken: null,
            };
            return rxjs.of(callbackContext);
        };
        return ImplicitFlowCallbackHandlerService;
    }());
    ImplicitFlowCallbackHandlerService.ɵfac = function ImplicitFlowCallbackHandlerService_Factory(t) { return new (t || ImplicitFlowCallbackHandlerService)(i0.ɵɵinject(ResetAuthDataService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(common.DOCUMENT)); };
    ImplicitFlowCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: ImplicitFlowCallbackHandlerService, factory: ImplicitFlowCallbackHandlerService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ImplicitFlowCallbackHandlerService, [{
                type: i0.Injectable
            }], function () {
            return [{ type: ResetAuthDataService }, { type: LoggerService }, { type: FlowsDataService }, { type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [common.DOCUMENT]
                        }] }];
        }, null);
    })();

    /* eslint-disable no-shadow */
    (function (AuthorizedState) {
        AuthorizedState["Authorized"] = "Authorized";
        AuthorizedState["Unauthorized"] = "Unauthorized";
        AuthorizedState["Unknown"] = "Unknown";
    })(exports.AuthorizedState || (exports.AuthorizedState = {}));

    /* eslint-disable no-shadow */
    (function (ValidationResult) {
        ValidationResult["NotSet"] = "NotSet";
        ValidationResult["StatesDoNotMatch"] = "StatesDoNotMatch";
        ValidationResult["SignatureFailed"] = "SignatureFailed";
        ValidationResult["IncorrectNonce"] = "IncorrectNonce";
        ValidationResult["RequiredPropertyMissing"] = "RequiredPropertyMissing";
        ValidationResult["MaxOffsetExpired"] = "MaxOffsetExpired";
        ValidationResult["IssDoesNotMatchIssuer"] = "IssDoesNotMatchIssuer";
        ValidationResult["NoAuthWellKnownEndPoints"] = "NoAuthWellKnownEndPoints";
        ValidationResult["IncorrectAud"] = "IncorrectAud";
        ValidationResult["IncorrectIdTokenClaimsAfterRefresh"] = "IncorrectIdTokenClaimsAfterRefresh";
        ValidationResult["IncorrectAzp"] = "IncorrectAzp";
        ValidationResult["TokenExpired"] = "TokenExpired";
        ValidationResult["IncorrectAtHash"] = "IncorrectAtHash";
        ValidationResult["Ok"] = "Ok";
        ValidationResult["LoginRequired"] = "LoginRequired";
        ValidationResult["SecureTokenServerError"] = "SecureTokenServerError";
    })(exports.ValidationResult || (exports.ValidationResult = {}));

    var SigninKeyDataService = /** @class */ (function () {
        function SigninKeyDataService(storagePersistenceService, loggerService, dataService) {
            this.storagePersistenceService = storagePersistenceService;
            this.loggerService = loggerService;
            this.dataService = dataService;
        }
        SigninKeyDataService.prototype.getSigningKeys = function () {
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            var jwksUri = authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.jwksUri;
            if (!jwksUri) {
                var error = "getSigningKeys: authWellKnownEndpoints.jwksUri is: '" + jwksUri + "'";
                this.loggerService.logWarning(error);
                return rxjs.throwError(error);
            }
            this.loggerService.logDebug('Getting signinkeys from ', jwksUri);
            return this.dataService.get(jwksUri).pipe(operators.retry(2), operators.catchError(this.handleErrorGetSigningKeys));
        };
        SigninKeyDataService.prototype.handleErrorGetSigningKeys = function (errorResponse) {
            var errMsg = '';
            if (errorResponse instanceof i1.HttpResponse) {
                var body = errorResponse.body || {};
                var err = JSON.stringify(body);
                var status = errorResponse.status, statusText = errorResponse.statusText;
                errMsg = (status || '') + " - " + (statusText || '') + " " + (err || '');
            }
            else {
                var message = errorResponse.message;
                errMsg = !!message ? message : "" + errorResponse;
            }
            this.loggerService.logError(errMsg);
            return rxjs.throwError(new Error(errMsg));
        };
        return SigninKeyDataService;
    }());
    SigninKeyDataService.ɵfac = function SigninKeyDataService_Factory(t) { return new (t || SigninKeyDataService)(i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(DataService)); };
    SigninKeyDataService.ɵprov = i0.ɵɵdefineInjectable({ token: SigninKeyDataService, factory: SigninKeyDataService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(SigninKeyDataService, [{
                type: i0.Injectable
            }], function () { return [{ type: StoragePersistenceService }, { type: LoggerService }, { type: DataService }]; }, null);
    })();

    var JWT_KEYS = 'jwtKeys';
    var HistoryJwtKeysCallbackHandlerService = /** @class */ (function () {
        function HistoryJwtKeysCallbackHandlerService(loggerService, configurationProvider, authStateService, flowsDataService, signInKeyDataService, storagePersistenceService, resetAuthDataService) {
            this.loggerService = loggerService;
            this.configurationProvider = configurationProvider;
            this.authStateService = authStateService;
            this.flowsDataService = flowsDataService;
            this.signInKeyDataService = signInKeyDataService;
            this.storagePersistenceService = storagePersistenceService;
            this.resetAuthDataService = resetAuthDataService;
        }
        // STEP 3 Code Flow, STEP 2 Implicit Flow, STEP 3 Refresh Token
        HistoryJwtKeysCallbackHandlerService.prototype.callbackHistoryAndResetJwtKeys = function (callbackContext) {
            var _this = this;
            this.storagePersistenceService.write('authnResult', callbackContext.authResult);
            if (this.historyCleanUpTurnedOn() && !callbackContext.isRenewProcess) {
                this.resetBrowserHistory();
            }
            else {
                this.loggerService.logDebug('history clean up inactive');
            }
            if (callbackContext.authResult.error) {
                var errorMessage = "authorizedCallbackProcedure came with error: " + callbackContext.authResult.error;
                this.loggerService.logDebug(errorMessage);
                this.resetAuthDataService.resetAuthorizationData();
                this.flowsDataService.setNonce('');
                this.handleResultErrorFromCallback(callbackContext.authResult, callbackContext.isRenewProcess);
                return rxjs.throwError(errorMessage);
            }
            this.loggerService.logDebug(callbackContext.authResult);
            this.loggerService.logDebug('authorizedCallback created, begin token validation');
            return this.signInKeyDataService.getSigningKeys().pipe(operators.tap(function (jwtKeys) { return _this.storeSigningKeys(jwtKeys); }), operators.catchError(function (err) {
                // fallback: try to load jwtKeys from storage
                var storedJwtKeys = _this.readSigningKeys();
                if (!!storedJwtKeys) {
                    _this.loggerService.logWarning("Failed to retrieve signing keys, fallback to stored keys");
                    return rxjs.of(storedJwtKeys);
                }
                return rxjs.throwError(err);
            }), operators.switchMap(function (jwtKeys) {
                if (jwtKeys) {
                    callbackContext.jwtKeys = jwtKeys;
                    return rxjs.of(callbackContext);
                }
                var errorMessage = "Failed to retrieve signing key";
                _this.loggerService.logWarning(errorMessage);
                return rxjs.throwError(errorMessage);
            }), operators.catchError(function (err) {
                var errorMessage = "Failed to retrieve signing key with error: " + err;
                _this.loggerService.logWarning(errorMessage);
                return rxjs.throwError(errorMessage);
            }));
        };
        HistoryJwtKeysCallbackHandlerService.prototype.handleResultErrorFromCallback = function (result, isRenewProcess) {
            var validationResult = exports.ValidationResult.SecureTokenServerError;
            if (result.error === 'login_required') {
                validationResult = exports.ValidationResult.LoginRequired;
            }
            this.authStateService.updateAndPublishAuthState({
                authorizationState: exports.AuthorizedState.Unauthorized,
                validationResult: validationResult,
                isRenewProcess: isRenewProcess,
            });
        };
        HistoryJwtKeysCallbackHandlerService.prototype.historyCleanUpTurnedOn = function () {
            var historyCleanupOff = this.configurationProvider.getOpenIDConfiguration().historyCleanupOff;
            return !historyCleanupOff;
        };
        HistoryJwtKeysCallbackHandlerService.prototype.resetBrowserHistory = function () {
            window.history.replaceState({}, window.document.title, window.location.origin + window.location.pathname);
        };
        HistoryJwtKeysCallbackHandlerService.prototype.storeSigningKeys = function (jwtKeys) {
            this.storagePersistenceService.write(JWT_KEYS, jwtKeys);
        };
        HistoryJwtKeysCallbackHandlerService.prototype.readSigningKeys = function () {
            return this.storagePersistenceService.read(JWT_KEYS);
        };
        return HistoryJwtKeysCallbackHandlerService;
    }());
    HistoryJwtKeysCallbackHandlerService.ɵfac = function HistoryJwtKeysCallbackHandlerService_Factory(t) { return new (t || HistoryJwtKeysCallbackHandlerService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(SigninKeyDataService), i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(ResetAuthDataService)); };
    HistoryJwtKeysCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: HistoryJwtKeysCallbackHandlerService, factory: HistoryJwtKeysCallbackHandlerService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(HistoryJwtKeysCallbackHandlerService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }, { type: ConfigurationProvider }, { type: AuthStateService }, { type: FlowsDataService }, { type: SigninKeyDataService }, { type: StoragePersistenceService }, { type: ResetAuthDataService }]; }, null);
    })();

    var UserCallbackHandlerService = /** @class */ (function () {
        function UserCallbackHandlerService(loggerService, configurationProvider, authStateService, flowsDataService, userService, resetAuthDataService) {
            this.loggerService = loggerService;
            this.configurationProvider = configurationProvider;
            this.authStateService = authStateService;
            this.flowsDataService = flowsDataService;
            this.userService = userService;
            this.resetAuthDataService = resetAuthDataService;
        }
        // STEP 5 userData
        UserCallbackHandlerService.prototype.callbackUser = function (callbackContext) {
            var _this = this;
            var isRenewProcess = callbackContext.isRenewProcess, validationResult = callbackContext.validationResult, authResult = callbackContext.authResult, refreshToken = callbackContext.refreshToken;
            var _a = this.configurationProvider.getOpenIDConfiguration(), autoUserinfo = _a.autoUserinfo, renewUserInfoAfterTokenRenew = _a.renewUserInfoAfterTokenRenew;
            if (!autoUserinfo) {
                if (!isRenewProcess || renewUserInfoAfterTokenRenew) {
                    // userData is set to the id_token decoded, auto get user data set to false
                    if (validationResult.decodedIdToken) {
                        this.userService.setUserDataToStore(validationResult.decodedIdToken);
                    }
                }
                if (!isRenewProcess && !refreshToken) {
                    this.flowsDataService.setSessionState(authResult.session_state);
                }
                this.publishAuthorizedState(validationResult, isRenewProcess);
                return rxjs.of(callbackContext);
            }
            return this.userService.getAndPersistUserDataInStore(isRenewProcess, validationResult.idToken, validationResult.decodedIdToken).pipe(operators.switchMap(function (userData) {
                if (!!userData) {
                    if (!refreshToken) {
                        _this.flowsDataService.setSessionState(authResult.session_state);
                    }
                    _this.publishAuthorizedState(validationResult, isRenewProcess);
                    return rxjs.of(callbackContext);
                }
                else {
                    _this.resetAuthDataService.resetAuthorizationData();
                    _this.publishUnauthorizedState(validationResult, isRenewProcess);
                    var errorMessage = "Called for userData but they were " + userData;
                    _this.loggerService.logWarning(errorMessage);
                    return rxjs.throwError(errorMessage);
                }
            }), operators.catchError(function (err) {
                var errorMessage = "Failed to retrieve user info with error:  " + err;
                _this.loggerService.logWarning(errorMessage);
                return rxjs.throwError(errorMessage);
            }));
        };
        UserCallbackHandlerService.prototype.publishAuthorizedState = function (stateValidationResult, isRenewProcess) {
            this.authStateService.updateAndPublishAuthState({
                authorizationState: exports.AuthorizedState.Authorized,
                validationResult: stateValidationResult.state,
                isRenewProcess: isRenewProcess,
            });
        };
        UserCallbackHandlerService.prototype.publishUnauthorizedState = function (stateValidationResult, isRenewProcess) {
            this.authStateService.updateAndPublishAuthState({
                authorizationState: exports.AuthorizedState.Unauthorized,
                validationResult: stateValidationResult.state,
                isRenewProcess: isRenewProcess,
            });
        };
        return UserCallbackHandlerService;
    }());
    UserCallbackHandlerService.ɵfac = function UserCallbackHandlerService_Factory(t) { return new (t || UserCallbackHandlerService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(UserService), i0.ɵɵinject(ResetAuthDataService)); };
    UserCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: UserCallbackHandlerService, factory: UserCallbackHandlerService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(UserCallbackHandlerService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }, { type: ConfigurationProvider }, { type: AuthStateService }, { type: FlowsDataService }, { type: UserService }, { type: ResetAuthDataService }]; }, null);
    })();

    var StateValidationResult = /** @class */ (function () {
        function StateValidationResult(accessToken, idToken, authResponseIsValid, decodedIdToken, state) {
            if (accessToken === void 0) { accessToken = ''; }
            if (idToken === void 0) { idToken = ''; }
            if (authResponseIsValid === void 0) { authResponseIsValid = false; }
            if (decodedIdToken === void 0) { decodedIdToken = {}; }
            if (state === void 0) { state = exports.ValidationResult.NotSet; }
            this.accessToken = accessToken;
            this.idToken = idToken;
            this.authResponseIsValid = authResponseIsValid;
            this.decodedIdToken = decodedIdToken;
            this.state = state;
        }
        return StateValidationResult;
    }());

    var EqualityService = /** @class */ (function () {
        function EqualityService() {
        }
        EqualityService.prototype.isStringEqualOrNonOrderedArrayEqual = function (value1, value2) {
            if (this.isNullOrUndefined(value1)) {
                return false;
            }
            if (this.isNullOrUndefined(value2)) {
                return false;
            }
            if (this.oneValueIsStringAndTheOtherIsArray(value1, value2)) {
                return false;
            }
            if (this.bothValuesAreStrings(value1, value2)) {
                return value1 === value2;
            }
            if (this.bothValuesAreArrays(value1, value2)) {
                return this.arraysHaveEqualContent(value1, value2);
            }
            return false;
        };
        EqualityService.prototype.areEqual = function (value1, value2) {
            if (!value1 || !value2) {
                return false;
            }
            if (this.bothValuesAreArrays(value1, value2)) {
                return this.arraysStrictEqual(value1, value2);
            }
            if (this.bothValuesAreStrings(value1, value2)) {
                return value1 === value2;
            }
            if (this.bothValuesAreObjects(value1, value2)) {
                return JSON.stringify(value1).toLowerCase() === JSON.stringify(value2).toLowerCase();
            }
            if (this.oneValueIsStringAndTheOtherIsArray(value1, value2)) {
                if (Array.isArray(value1) && this.valueIsString(value2)) {
                    return value1[0] === value2;
                }
                if (Array.isArray(value2) && this.valueIsString(value1)) {
                    return value2[0] === value1;
                }
            }
        };
        EqualityService.prototype.oneValueIsStringAndTheOtherIsArray = function (value1, value2) {
            return (Array.isArray(value1) && this.valueIsString(value2)) || (Array.isArray(value2) && this.valueIsString(value1));
        };
        EqualityService.prototype.bothValuesAreObjects = function (value1, value2) {
            return this.valueIsObject(value1) && this.valueIsObject(value2);
        };
        EqualityService.prototype.bothValuesAreStrings = function (value1, value2) {
            return this.valueIsString(value1) && this.valueIsString(value2);
        };
        EqualityService.prototype.bothValuesAreArrays = function (value1, value2) {
            return Array.isArray(value1) && Array.isArray(value2);
        };
        EqualityService.prototype.valueIsString = function (value) {
            return typeof value === 'string' || value instanceof String;
        };
        EqualityService.prototype.valueIsObject = function (value) {
            return typeof value === 'object';
        };
        EqualityService.prototype.arraysStrictEqual = function (arr1, arr2) {
            if (arr1.length !== arr2.length) {
                return false;
            }
            for (var i = arr1.length; i--;) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
            return true;
        };
        EqualityService.prototype.arraysHaveEqualContent = function (arr1, arr2) {
            if (arr1.length !== arr2.length) {
                return false;
            }
            return arr1.some(function (v) { return arr2.includes(v); });
        };
        EqualityService.prototype.isNullOrUndefined = function (val) {
            return val === null || val === undefined;
        };
        return EqualityService;
    }());
    EqualityService.ɵfac = function EqualityService_Factory(t) { return new (t || EqualityService)(); };
    EqualityService.ɵprov = i0.ɵɵdefineInjectable({ token: EqualityService, factory: EqualityService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(EqualityService, [{
                type: i0.Injectable
            }], null, null);
    })();

    var StateValidationService = /** @class */ (function () {
        function StateValidationService(storagePersistenceService, tokenValidationService, tokenHelperService, loggerService, configurationProvider, equalityService, flowHelper) {
            this.storagePersistenceService = storagePersistenceService;
            this.tokenValidationService = tokenValidationService;
            this.tokenHelperService = tokenHelperService;
            this.loggerService = loggerService;
            this.configurationProvider = configurationProvider;
            this.equalityService = equalityService;
            this.flowHelper = flowHelper;
        }
        StateValidationService.prototype.getValidatedStateResult = function (callbackContext) {
            if (!callbackContext) {
                return new StateValidationResult('', '', false, {});
            }
            if (callbackContext.authResult.error) {
                return new StateValidationResult('', '', false, {});
            }
            return this.validateState(callbackContext);
        };
        StateValidationService.prototype.validateState = function (callbackContext) {
            var toReturn = new StateValidationResult();
            var authStateControl = this.storagePersistenceService.read('authStateControl');
            if (!this.tokenValidationService.validateStateFromHashCallback(callbackContext.authResult.state, authStateControl)) {
                this.loggerService.logWarning('authorizedCallback incorrect state');
                toReturn.state = exports.ValidationResult.StatesDoNotMatch;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            var isCurrentFlowImplicitFlowWithAccessToken = this.flowHelper.isCurrentFlowImplicitFlowWithAccessToken();
            var isCurrentFlowCodeFlow = this.flowHelper.isCurrentFlowCodeFlow();
            if (isCurrentFlowImplicitFlowWithAccessToken || isCurrentFlowCodeFlow) {
                toReturn.accessToken = callbackContext.authResult.access_token;
            }
            if (callbackContext.authResult.id_token) {
                var _a = this.configurationProvider.getOpenIDConfiguration(), clientId = _a.clientId, issValidationOff = _a.issValidationOff, maxIdTokenIatOffsetAllowedInSeconds = _a.maxIdTokenIatOffsetAllowedInSeconds, disableIatOffsetValidation = _a.disableIatOffsetValidation, ignoreNonceAfterRefresh = _a.ignoreNonceAfterRefresh;
                toReturn.idToken = callbackContext.authResult.id_token;
                toReturn.decodedIdToken = this.tokenHelperService.getPayloadFromToken(toReturn.idToken, false);
                if (!this.tokenValidationService.validateSignatureIdToken(toReturn.idToken, callbackContext.jwtKeys)) {
                    this.loggerService.logDebug('authorizedCallback Signature validation failed id_token');
                    toReturn.state = exports.ValidationResult.SignatureFailed;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
                var authNonce = this.storagePersistenceService.read('authNonce');
                if (!this.tokenValidationService.validateIdTokenNonce(toReturn.decodedIdToken, authNonce, ignoreNonceAfterRefresh)) {
                    this.loggerService.logWarning('authorizedCallback incorrect nonce');
                    toReturn.state = exports.ValidationResult.IncorrectNonce;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
                if (!this.tokenValidationService.validateRequiredIdToken(toReturn.decodedIdToken)) {
                    this.loggerService.logDebug('authorizedCallback Validation, one of the REQUIRED properties missing from id_token');
                    toReturn.state = exports.ValidationResult.RequiredPropertyMissing;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
                if (!this.tokenValidationService.validateIdTokenIatMaxOffset(toReturn.decodedIdToken, maxIdTokenIatOffsetAllowedInSeconds, disableIatOffsetValidation)) {
                    this.loggerService.logWarning('authorizedCallback Validation, iat rejected id_token was issued too far away from the current time');
                    toReturn.state = exports.ValidationResult.MaxOffsetExpired;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
                var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
                if (authWellKnownEndPoints) {
                    if (issValidationOff) {
                        this.loggerService.logDebug('iss validation is turned off, this is not recommended!');
                    }
                    else if (!issValidationOff &&
                        !this.tokenValidationService.validateIdTokenIss(toReturn.decodedIdToken, authWellKnownEndPoints.issuer)) {
                        this.loggerService.logWarning('authorizedCallback incorrect iss does not match authWellKnownEndpoints issuer');
                        toReturn.state = exports.ValidationResult.IssDoesNotMatchIssuer;
                        this.handleUnsuccessfulValidation();
                        return toReturn;
                    }
                }
                else {
                    this.loggerService.logWarning('authWellKnownEndpoints is undefined');
                    toReturn.state = exports.ValidationResult.NoAuthWellKnownEndPoints;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
                if (!this.tokenValidationService.validateIdTokenAud(toReturn.decodedIdToken, clientId)) {
                    this.loggerService.logWarning('authorizedCallback incorrect aud');
                    toReturn.state = exports.ValidationResult.IncorrectAud;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
                if (!this.tokenValidationService.validateIdTokenAzpExistsIfMoreThanOneAud(toReturn.decodedIdToken)) {
                    this.loggerService.logWarning('authorizedCallback missing azp');
                    toReturn.state = exports.ValidationResult.IncorrectAzp;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
                if (!this.tokenValidationService.validateIdTokenAzpValid(toReturn.decodedIdToken, clientId)) {
                    this.loggerService.logWarning('authorizedCallback incorrect azp');
                    toReturn.state = exports.ValidationResult.IncorrectAzp;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
                if (!this.isIdTokenAfterRefreshTokenRequestValid(callbackContext, toReturn.decodedIdToken)) {
                    this.loggerService.logWarning('authorizedCallback pre, post id_token claims do not match in refresh');
                    toReturn.state = exports.ValidationResult.IncorrectIdTokenClaimsAfterRefresh;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
                if (!this.tokenValidationService.validateIdTokenExpNotExpired(toReturn.decodedIdToken)) {
                    this.loggerService.logWarning('authorizedCallback id token expired');
                    toReturn.state = exports.ValidationResult.TokenExpired;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
            }
            else {
                this.loggerService.logDebug('No id_token found, skipping id_token validation');
            }
            // flow id_token
            if (!isCurrentFlowImplicitFlowWithAccessToken && !isCurrentFlowCodeFlow) {
                toReturn.authResponseIsValid = true;
                toReturn.state = exports.ValidationResult.Ok;
                this.handleSuccessfulValidation();
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            // only do check if id_token returned, no always the case when using refresh tokens
            if (callbackContext.authResult.id_token) {
                var idTokenHeader = this.tokenHelperService.getHeaderFromToken(toReturn.idToken, false);
                // The at_hash is optional for the code flow
                if (isCurrentFlowCodeFlow && !toReturn.decodedIdToken.at_hash) {
                    this.loggerService.logDebug('Code Flow active, and no at_hash in the id_token, skipping check!');
                }
                else if (!this.tokenValidationService.validateIdTokenAtHash(toReturn.accessToken, toReturn.decodedIdToken.at_hash, idTokenHeader.alg // 'RSA256'
                ) ||
                    !toReturn.accessToken) {
                    this.loggerService.logWarning('authorizedCallback incorrect at_hash');
                    toReturn.state = exports.ValidationResult.IncorrectAtHash;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
            }
            toReturn.authResponseIsValid = true;
            toReturn.state = exports.ValidationResult.Ok;
            this.handleSuccessfulValidation();
            return toReturn;
        };
        StateValidationService.prototype.isIdTokenAfterRefreshTokenRequestValid = function (callbackContext, newIdToken) {
            var _a = this.configurationProvider.getOpenIDConfiguration(), useRefreshToken = _a.useRefreshToken, disableRefreshIdTokenAuthTimeValidation = _a.disableRefreshIdTokenAuthTimeValidation;
            if (!useRefreshToken) {
                return true;
            }
            if (!callbackContext.existingIdToken) {
                return true;
            }
            var decodedIdToken = this.tokenHelperService.getPayloadFromToken(callbackContext.existingIdToken, false);
            // Upon successful validation of the Refresh Token, the response body is the Token Response of Section 3.1.3.3
            // except that it might not contain an id_token.
            // If an ID Token is returned as a result of a token refresh request, the following requirements apply:
            // its iss Claim Value MUST be the same as in the ID Token issued when the original authentication occurred,
            if (decodedIdToken.iss !== newIdToken.iss) {
                this.loggerService.logDebug("iss do not match: " + decodedIdToken.iss + " " + newIdToken.iss);
                return false;
            }
            // its azp Claim Value MUST be the same as in the ID Token issued when the original authentication occurred;
            //   if no azp Claim was present in the original ID Token, one MUST NOT be present in the new ID Token, and
            // otherwise, the same rules apply as apply when issuing an ID Token at the time of the original authentication.
            if (decodedIdToken.azp !== newIdToken.azp) {
                this.loggerService.logDebug("azp do not match: " + decodedIdToken.azp + " " + newIdToken.azp);
                return false;
            }
            // its sub Claim Value MUST be the same as in the ID Token issued when the original authentication occurred,
            if (decodedIdToken.sub !== newIdToken.sub) {
                this.loggerService.logDebug("sub do not match: " + decodedIdToken.sub + " " + newIdToken.sub);
                return false;
            }
            // its aud Claim Value MUST be the same as in the ID Token issued when the original authentication occurred,
            if (!this.equalityService.isStringEqualOrNonOrderedArrayEqual(decodedIdToken === null || decodedIdToken === void 0 ? void 0 : decodedIdToken.aud, newIdToken === null || newIdToken === void 0 ? void 0 : newIdToken.aud)) {
                this.loggerService.logDebug("aud in new id_token is not valid: '" + (decodedIdToken === null || decodedIdToken === void 0 ? void 0 : decodedIdToken.aud) + "' '" + newIdToken.aud + "'");
                return false;
            }
            if (disableRefreshIdTokenAuthTimeValidation) {
                return true;
            }
            // its iat Claim MUST represent the time that the new ID Token is issued,
            // if the ID Token contains an auth_time Claim, its value MUST represent the time of the original authentication
            // - not the time that the new ID token is issued,
            if (decodedIdToken.auth_time !== newIdToken.auth_time) {
                this.loggerService.logDebug("auth_time do not match: " + decodedIdToken.auth_time + " " + newIdToken.auth_time);
                return false;
            }
            return true;
        };
        StateValidationService.prototype.handleSuccessfulValidation = function () {
            var autoCleanStateAfterAuthentication = this.configurationProvider.getOpenIDConfiguration().autoCleanStateAfterAuthentication;
            this.storagePersistenceService.write('authNonce', '');
            if (autoCleanStateAfterAuthentication) {
                this.storagePersistenceService.write('authStateControl', '');
            }
            this.loggerService.logDebug('AuthorizedCallback token(s) validated, continue');
        };
        StateValidationService.prototype.handleUnsuccessfulValidation = function () {
            var autoCleanStateAfterAuthentication = this.configurationProvider.getOpenIDConfiguration().autoCleanStateAfterAuthentication;
            this.storagePersistenceService.write('authNonce', '');
            if (autoCleanStateAfterAuthentication) {
                this.storagePersistenceService.write('authStateControl', '');
            }
            this.loggerService.logDebug('AuthorizedCallback token(s) invalid');
        };
        return StateValidationService;
    }());
    StateValidationService.ɵfac = function StateValidationService_Factory(t) { return new (t || StateValidationService)(i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(TokenValidationService), i0.ɵɵinject(TokenHelperService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(EqualityService), i0.ɵɵinject(FlowHelper)); };
    StateValidationService.ɵprov = i0.ɵɵdefineInjectable({ token: StateValidationService, factory: StateValidationService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(StateValidationService, [{
                type: i0.Injectable
            }], function () { return [{ type: StoragePersistenceService }, { type: TokenValidationService }, { type: TokenHelperService }, { type: LoggerService }, { type: ConfigurationProvider }, { type: EqualityService }, { type: FlowHelper }]; }, null);
    })();

    var StateValidationCallbackHandlerService = /** @class */ (function () {
        function StateValidationCallbackHandlerService(loggerService, stateValidationService, authStateService, resetAuthDataService, doc) {
            this.loggerService = loggerService;
            this.stateValidationService = stateValidationService;
            this.authStateService = authStateService;
            this.resetAuthDataService = resetAuthDataService;
            this.doc = doc;
        }
        // STEP 4 All flows
        StateValidationCallbackHandlerService.prototype.callbackStateValidation = function (callbackContext) {
            var validationResult = this.stateValidationService.getValidatedStateResult(callbackContext);
            callbackContext.validationResult = validationResult;
            if (validationResult.authResponseIsValid) {
                this.authStateService.setAuthorizationData(validationResult.accessToken, callbackContext.authResult);
                return rxjs.of(callbackContext);
            }
            else {
                var errorMessage = "authorizedCallback, token(s) validation failed, resetting. Hash: " + this.doc.location.hash;
                this.loggerService.logWarning(errorMessage);
                this.resetAuthDataService.resetAuthorizationData();
                this.publishUnauthorizedState(callbackContext.validationResult, callbackContext.isRenewProcess);
                return rxjs.throwError(errorMessage);
            }
        };
        StateValidationCallbackHandlerService.prototype.publishUnauthorizedState = function (stateValidationResult, isRenewProcess) {
            this.authStateService.updateAndPublishAuthState({
                authorizationState: exports.AuthorizedState.Unauthorized,
                validationResult: stateValidationResult.state,
                isRenewProcess: isRenewProcess,
            });
        };
        return StateValidationCallbackHandlerService;
    }());
    StateValidationCallbackHandlerService.ɵfac = function StateValidationCallbackHandlerService_Factory(t) { return new (t || StateValidationCallbackHandlerService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(StateValidationService), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(ResetAuthDataService), i0.ɵɵinject(common.DOCUMENT)); };
    StateValidationCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: StateValidationCallbackHandlerService, factory: StateValidationCallbackHandlerService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(StateValidationCallbackHandlerService, [{
                type: i0.Injectable
            }], function () {
            return [{ type: LoggerService }, { type: StateValidationService }, { type: AuthStateService }, { type: ResetAuthDataService }, { type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [common.DOCUMENT]
                        }] }];
        }, null);
    })();

    var RefreshSessionCallbackHandlerService = /** @class */ (function () {
        function RefreshSessionCallbackHandlerService(loggerService, authStateService, flowsDataService) {
            this.loggerService = loggerService;
            this.authStateService = authStateService;
            this.flowsDataService = flowsDataService;
        }
        // STEP 1 Refresh session
        RefreshSessionCallbackHandlerService.prototype.refreshSessionWithRefreshTokens = function () {
            var stateData = this.flowsDataService.getExistingOrCreateAuthStateControl();
            this.loggerService.logDebug('RefreshSession created. adding myautostate: ' + stateData);
            var refreshToken = this.authStateService.getRefreshToken();
            var idToken = this.authStateService.getIdToken();
            if (refreshToken) {
                var callbackContext = {
                    code: null,
                    refreshToken: refreshToken,
                    state: stateData,
                    sessionState: null,
                    authResult: null,
                    isRenewProcess: true,
                    jwtKeys: null,
                    validationResult: null,
                    existingIdToken: idToken,
                };
                this.loggerService.logDebug('found refresh code, obtaining new credentials with refresh code');
                // Nonce is not used with refresh tokens; but Keycloak may send it anyway
                this.flowsDataService.setNonce(TokenValidationService.refreshTokenNoncePlaceholder);
                return rxjs.of(callbackContext);
            }
            else {
                var errorMessage = 'no refresh token found, please login';
                this.loggerService.logError(errorMessage);
                return rxjs.throwError(errorMessage);
            }
        };
        return RefreshSessionCallbackHandlerService;
    }());
    RefreshSessionCallbackHandlerService.ɵfac = function RefreshSessionCallbackHandlerService_Factory(t) { return new (t || RefreshSessionCallbackHandlerService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(FlowsDataService)); };
    RefreshSessionCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: RefreshSessionCallbackHandlerService, factory: RefreshSessionCallbackHandlerService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(RefreshSessionCallbackHandlerService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }, { type: AuthStateService }, { type: FlowsDataService }]; }, null);
    })();

    var RefreshTokenCallbackHandlerService = /** @class */ (function () {
        function RefreshTokenCallbackHandlerService(urlService, loggerService, configurationProvider, dataService, storagePersistenceService) {
            this.urlService = urlService;
            this.loggerService = loggerService;
            this.configurationProvider = configurationProvider;
            this.dataService = dataService;
            this.storagePersistenceService = storagePersistenceService;
        }
        // STEP 2 Refresh Token
        RefreshTokenCallbackHandlerService.prototype.refreshTokensRequestTokens = function (callbackContext, customParamsRefresh) {
            var _this = this;
            var headers = new i1.HttpHeaders();
            headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
            var authWellKnown = this.storagePersistenceService.read('authWellKnownEndPoints');
            var tokenEndpoint = authWellKnown === null || authWellKnown === void 0 ? void 0 : authWellKnown.tokenEndpoint;
            if (!tokenEndpoint) {
                return rxjs.throwError('Token Endpoint not defined');
            }
            var data = this.urlService.createBodyForCodeFlowRefreshTokensRequest(callbackContext.refreshToken, customParamsRefresh);
            return this.dataService.post(tokenEndpoint, data, headers).pipe(operators.switchMap(function (response) {
                _this.loggerService.logDebug('token refresh response: ', response);
                var authResult = new Object();
                authResult = response;
                authResult.state = callbackContext.state;
                callbackContext.authResult = authResult;
                return rxjs.of(callbackContext);
            }), operators.retryWhen(function (error) { return _this.handleRefreshRetry(error); }), operators.catchError(function (error) {
                var stsServer = _this.configurationProvider.getOpenIDConfiguration().stsServer;
                var errorMessage = "OidcService code request " + stsServer;
                _this.loggerService.logError(errorMessage, error);
                return rxjs.throwError(errorMessage);
            }));
        };
        RefreshTokenCallbackHandlerService.prototype.handleRefreshRetry = function (errors) {
            var _this = this;
            return errors.pipe(operators.mergeMap(function (error) {
                // retry token refresh if there is no internet connection
                if (error && error instanceof i1.HttpErrorResponse && error.error instanceof ProgressEvent && error.error.type === 'error') {
                    var _a = _this.configurationProvider.getOpenIDConfiguration(), stsServer = _a.stsServer, refreshTokenRetryInSeconds = _a.refreshTokenRetryInSeconds;
                    var errorMessage = "OidcService code request " + stsServer + " - no internet connection";
                    _this.loggerService.logWarning(errorMessage, error);
                    return rxjs.timer(refreshTokenRetryInSeconds * 1000);
                }
                return rxjs.throwError(error);
            }));
        };
        return RefreshTokenCallbackHandlerService;
    }());
    RefreshTokenCallbackHandlerService.ɵfac = function RefreshTokenCallbackHandlerService_Factory(t) { return new (t || RefreshTokenCallbackHandlerService)(i0.ɵɵinject(UrlService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(DataService), i0.ɵɵinject(StoragePersistenceService)); };
    RefreshTokenCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: RefreshTokenCallbackHandlerService, factory: RefreshTokenCallbackHandlerService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(RefreshTokenCallbackHandlerService, [{
                type: i0.Injectable
            }], function () { return [{ type: UrlService }, { type: LoggerService }, { type: ConfigurationProvider }, { type: DataService }, { type: StoragePersistenceService }]; }, null);
    })();

    var FlowsService = /** @class */ (function () {
        function FlowsService(codeFlowCallbackHandlerService, implicitFlowCallbackHandlerService, historyJwtKeysCallbackHandlerService, userHandlerService, stateValidationCallbackHandlerService, refreshSessionCallbackHandlerService, refreshTokenCallbackHandlerService) {
            this.codeFlowCallbackHandlerService = codeFlowCallbackHandlerService;
            this.implicitFlowCallbackHandlerService = implicitFlowCallbackHandlerService;
            this.historyJwtKeysCallbackHandlerService = historyJwtKeysCallbackHandlerService;
            this.userHandlerService = userHandlerService;
            this.stateValidationCallbackHandlerService = stateValidationCallbackHandlerService;
            this.refreshSessionCallbackHandlerService = refreshSessionCallbackHandlerService;
            this.refreshTokenCallbackHandlerService = refreshTokenCallbackHandlerService;
        }
        FlowsService.prototype.processCodeFlowCallback = function (urlToCheck) {
            var _this = this;
            return this.codeFlowCallbackHandlerService.codeFlowCallback(urlToCheck).pipe(operators.switchMap(function (callbackContext) { return _this.codeFlowCallbackHandlerService.codeFlowCodeRequest(callbackContext); }), operators.switchMap(function (callbackContext) { return _this.historyJwtKeysCallbackHandlerService.callbackHistoryAndResetJwtKeys(callbackContext); }), operators.switchMap(function (callbackContext) { return _this.stateValidationCallbackHandlerService.callbackStateValidation(callbackContext); }), operators.switchMap(function (callbackContext) { return _this.userHandlerService.callbackUser(callbackContext); }));
        };
        FlowsService.prototype.processSilentRenewCodeFlowCallback = function (firstContext) {
            var _this = this;
            return this.codeFlowCallbackHandlerService.codeFlowCodeRequest(firstContext).pipe(operators.switchMap(function (callbackContext) { return _this.historyJwtKeysCallbackHandlerService.callbackHistoryAndResetJwtKeys(callbackContext); }), operators.switchMap(function (callbackContext) { return _this.stateValidationCallbackHandlerService.callbackStateValidation(callbackContext); }), operators.switchMap(function (callbackContext) { return _this.userHandlerService.callbackUser(callbackContext); }));
        };
        FlowsService.prototype.processImplicitFlowCallback = function (hash) {
            var _this = this;
            return this.implicitFlowCallbackHandlerService.implicitFlowCallback(hash).pipe(operators.switchMap(function (callbackContext) { return _this.historyJwtKeysCallbackHandlerService.callbackHistoryAndResetJwtKeys(callbackContext); }), operators.switchMap(function (callbackContext) { return _this.stateValidationCallbackHandlerService.callbackStateValidation(callbackContext); }), operators.switchMap(function (callbackContext) { return _this.userHandlerService.callbackUser(callbackContext); }));
        };
        FlowsService.prototype.processRefreshToken = function (customParamsRefresh) {
            var _this = this;
            return this.refreshSessionCallbackHandlerService.refreshSessionWithRefreshTokens().pipe(operators.switchMap(function (callbackContext) { return _this.refreshTokenCallbackHandlerService.refreshTokensRequestTokens(callbackContext, customParamsRefresh); }), operators.switchMap(function (callbackContext) { return _this.historyJwtKeysCallbackHandlerService.callbackHistoryAndResetJwtKeys(callbackContext); }), operators.switchMap(function (callbackContext) { return _this.stateValidationCallbackHandlerService.callbackStateValidation(callbackContext); }), operators.switchMap(function (callbackContext) { return _this.userHandlerService.callbackUser(callbackContext); }));
        };
        return FlowsService;
    }());
    FlowsService.ɵfac = function FlowsService_Factory(t) { return new (t || FlowsService)(i0.ɵɵinject(CodeFlowCallbackHandlerService), i0.ɵɵinject(ImplicitFlowCallbackHandlerService), i0.ɵɵinject(HistoryJwtKeysCallbackHandlerService), i0.ɵɵinject(UserCallbackHandlerService), i0.ɵɵinject(StateValidationCallbackHandlerService), i0.ɵɵinject(RefreshSessionCallbackHandlerService), i0.ɵɵinject(RefreshTokenCallbackHandlerService)); };
    FlowsService.ɵprov = i0.ɵɵdefineInjectable({ token: FlowsService, factory: FlowsService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(FlowsService, [{
                type: i0.Injectable
            }], function () { return [{ type: CodeFlowCallbackHandlerService }, { type: ImplicitFlowCallbackHandlerService }, { type: HistoryJwtKeysCallbackHandlerService }, { type: UserCallbackHandlerService }, { type: StateValidationCallbackHandlerService }, { type: RefreshSessionCallbackHandlerService }, { type: RefreshTokenCallbackHandlerService }]; }, null);
    })();

    var IntervallService = /** @class */ (function () {
        function IntervallService(zone) {
            this.zone = zone;
            this.runTokenValidationRunning = null;
        }
        IntervallService.prototype.stopPeriodicallTokenCheck = function () {
            if (this.runTokenValidationRunning) {
                this.runTokenValidationRunning.unsubscribe();
                this.runTokenValidationRunning = null;
            }
        };
        IntervallService.prototype.startPeriodicTokenCheck = function (repeatAfterSeconds) {
            var _this = this;
            var millisecondsDelayBetweenTokenCheck = repeatAfterSeconds * 1000;
            return new rxjs.Observable(function (subscriber) {
                var intervalId;
                _this.zone.runOutsideAngular(function () {
                    intervalId = setInterval(function () { return _this.zone.run(function () { return subscriber.next(); }); }, millisecondsDelayBetweenTokenCheck);
                });
                return function () {
                    clearInterval(intervalId);
                };
            });
        };
        return IntervallService;
    }());
    IntervallService.ɵfac = function IntervallService_Factory(t) { return new (t || IntervallService)(i0.ɵɵinject(i0.NgZone)); };
    IntervallService.ɵprov = i0.ɵɵdefineInjectable({ token: IntervallService, factory: IntervallService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(IntervallService, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], function () { return [{ type: i0.NgZone }]; }, null);
    })();

    var ImplicitFlowCallbackService = /** @class */ (function () {
        function ImplicitFlowCallbackService(flowsService, configurationProvider, router, flowsDataService, intervalService) {
            this.flowsService = flowsService;
            this.configurationProvider = configurationProvider;
            this.router = router;
            this.flowsDataService = flowsDataService;
            this.intervalService = intervalService;
        }
        ImplicitFlowCallbackService.prototype.authorizedImplicitFlowCallback = function (hash) {
            var _this = this;
            var isRenewProcess = this.flowsDataService.isSilentRenewRunning();
            var _a = this.configurationProvider.getOpenIDConfiguration(), triggerAuthorizationResultEvent = _a.triggerAuthorizationResultEvent, postLoginRoute = _a.postLoginRoute, unauthorizedRoute = _a.unauthorizedRoute;
            return this.flowsService.processImplicitFlowCallback(hash).pipe(operators.tap(function (callbackContext) {
                if (!triggerAuthorizationResultEvent && !callbackContext.isRenewProcess) {
                    _this.router.navigateByUrl(postLoginRoute);
                }
            }), operators.catchError(function (error) {
                _this.flowsDataService.resetSilentRenewRunning();
                _this.intervalService.stopPeriodicallTokenCheck();
                if (!triggerAuthorizationResultEvent && !isRenewProcess) {
                    _this.router.navigateByUrl(unauthorizedRoute);
                }
                return rxjs.throwError(error);
            }));
        };
        return ImplicitFlowCallbackService;
    }());
    ImplicitFlowCallbackService.ɵfac = function ImplicitFlowCallbackService_Factory(t) { return new (t || ImplicitFlowCallbackService)(i0.ɵɵinject(FlowsService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(i5.Router), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(IntervallService)); };
    ImplicitFlowCallbackService.ɵprov = i0.ɵɵdefineInjectable({ token: ImplicitFlowCallbackService, factory: ImplicitFlowCallbackService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ImplicitFlowCallbackService, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], function () { return [{ type: FlowsService }, { type: ConfigurationProvider }, { type: i5.Router }, { type: FlowsDataService }, { type: IntervallService }]; }, null);
    })();

    var IFrameService = /** @class */ (function () {
        function IFrameService(doc, loggerService) {
            this.doc = doc;
            this.loggerService = loggerService;
        }
        IFrameService.prototype.getExistingIFrame = function (identifier) {
            var iFrameOnParent = this.getIFrameFromParentWindow(identifier);
            if (this.isIFrameElement(iFrameOnParent)) {
                return iFrameOnParent;
            }
            var iFrameOnSelf = this.getIFrameFromWindow(identifier);
            if (this.isIFrameElement(iFrameOnSelf)) {
                return iFrameOnSelf;
            }
            return null;
        };
        IFrameService.prototype.addIFrameToWindowBody = function (identifier) {
            var sessionIframe = this.doc.createElement('iframe');
            sessionIframe.id = identifier;
            sessionIframe.title = identifier;
            this.loggerService.logDebug(sessionIframe);
            sessionIframe.style.display = 'none';
            this.doc.body.appendChild(sessionIframe);
            return sessionIframe;
        };
        IFrameService.prototype.getIFrameFromParentWindow = function (identifier) {
            try {
                var iFrameElement = this.doc.defaultView.parent.document.getElementById(identifier);
                if (this.isIFrameElement(iFrameElement)) {
                    return iFrameElement;
                }
                return null;
            }
            catch (e) {
                return null;
            }
        };
        IFrameService.prototype.getIFrameFromWindow = function (identifier) {
            var iFrameElement = this.doc.getElementById(identifier);
            if (this.isIFrameElement(iFrameElement)) {
                return iFrameElement;
            }
            return null;
        };
        IFrameService.prototype.isIFrameElement = function (element) {
            return !!element && element instanceof HTMLIFrameElement;
        };
        return IFrameService;
    }());
    IFrameService.ɵfac = function IFrameService_Factory(t) { return new (t || IFrameService)(i0.ɵɵinject(common.DOCUMENT), i0.ɵɵinject(LoggerService)); };
    IFrameService.ɵprov = i0.ɵɵdefineInjectable({ token: IFrameService, factory: IFrameService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(IFrameService, [{
                type: i0.Injectable
            }], function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [common.DOCUMENT]
                        }] }, { type: LoggerService }];
        }, null);
    })();

    var IFRAME_FOR_CHECK_SESSION_IDENTIFIER = 'myiFrameForCheckSession';
    // http://openid.net/specs/openid-connect-session-1_0-ID4.html
    var CheckSessionService = /** @class */ (function () {
        function CheckSessionService(storagePersistenceService, loggerService, iFrameService, eventService, configurationProvider, zone) {
            this.storagePersistenceService = storagePersistenceService;
            this.loggerService = loggerService;
            this.iFrameService = iFrameService;
            this.eventService = eventService;
            this.configurationProvider = configurationProvider;
            this.zone = zone;
            this.checkSessionReceived = false;
            this.lastIFrameRefresh = 0;
            this.outstandingMessages = 0;
            this.heartBeatInterval = 3000;
            this.iframeRefreshInterval = 60000;
            this.checkSessionChangedInternal$ = new rxjs.BehaviorSubject(false);
        }
        Object.defineProperty(CheckSessionService.prototype, "checkSessionChanged$", {
            get: function () {
                return this.checkSessionChangedInternal$.asObservable();
            },
            enumerable: false,
            configurable: true
        });
        CheckSessionService.prototype.isCheckSessionConfigured = function () {
            var startCheckSession = this.configurationProvider.getOpenIDConfiguration().startCheckSession;
            return startCheckSession;
        };
        CheckSessionService.prototype.start = function () {
            if (!!this.scheduledHeartBeatRunning) {
                return;
            }
            var clientId = this.configurationProvider.getOpenIDConfiguration().clientId;
            this.pollServerSession(clientId);
        };
        CheckSessionService.prototype.stop = function () {
            if (!this.scheduledHeartBeatRunning) {
                return;
            }
            this.clearScheduledHeartBeat();
            this.checkSessionReceived = false;
        };
        CheckSessionService.prototype.serverStateChanged = function () {
            var startCheckSession = this.configurationProvider.getOpenIDConfiguration().startCheckSession;
            return startCheckSession && this.checkSessionReceived;
        };
        CheckSessionService.prototype.getExistingIframe = function () {
            return this.iFrameService.getExistingIFrame(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
        };
        CheckSessionService.prototype.init = function () {
            var _this = this;
            if (this.lastIFrameRefresh + this.iframeRefreshInterval > Date.now()) {
                return rxjs.of(undefined);
            }
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (!authWellKnownEndPoints) {
                this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined. Returning.');
                return rxjs.of();
            }
            var existingIframe = this.getOrCreateIframe();
            var checkSessionIframe = authWellKnownEndPoints.checkSessionIframe;
            if (checkSessionIframe) {
                existingIframe.contentWindow.location.replace(checkSessionIframe);
            }
            else {
                this.loggerService.logWarning('init check session: checkSessionIframe is not configured to run');
            }
            return new rxjs.Observable(function (observer) {
                existingIframe.onload = function () {
                    _this.lastIFrameRefresh = Date.now();
                    observer.next();
                    observer.complete();
                };
            });
        };
        CheckSessionService.prototype.pollServerSession = function (clientId) {
            var _this = this;
            this.outstandingMessages = 0;
            var pollServerSessionRecur = function () {
                _this.init()
                    .pipe(operators.take(1))
                    .subscribe(function () {
                    var _a;
                    var existingIframe = _this.getExistingIframe();
                    if (existingIframe && clientId) {
                        _this.loggerService.logDebug(existingIframe);
                        var sessionState = _this.storagePersistenceService.read('session_state');
                        var authWellKnownEndPoints = _this.storagePersistenceService.read('authWellKnownEndPoints');
                        if (sessionState && (authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.checkSessionIframe)) {
                            var iframeOrigin = (_a = new URL(authWellKnownEndPoints.checkSessionIframe)) === null || _a === void 0 ? void 0 : _a.origin;
                            _this.outstandingMessages++;
                            existingIframe.contentWindow.postMessage(clientId + ' ' + sessionState, iframeOrigin);
                        }
                        else {
                            _this.loggerService.logDebug("OidcSecurityCheckSession pollServerSession session_state is '" + sessionState + "'");
                            _this.loggerService.logDebug("AuthWellKnownEndPoints is '" + JSON.stringify(authWellKnownEndPoints) + "'");
                            _this.checkSessionChangedInternal$.next(true);
                        }
                    }
                    else {
                        _this.loggerService.logWarning('OidcSecurityCheckSession pollServerSession checkSession IFrame does not exist');
                        _this.loggerService.logDebug(clientId);
                        _this.loggerService.logDebug(existingIframe);
                    }
                    // after sending three messages with no response, fail.
                    if (_this.outstandingMessages > 3) {
                        _this.loggerService.logError("OidcSecurityCheckSession not receiving check session response messages.\n                            Outstanding messages: " + _this.outstandingMessages + ". Server unreachable?");
                    }
                    _this.zone.runOutsideAngular(function () {
                        _this.scheduledHeartBeatRunning = setTimeout(function () { return _this.zone.run(pollServerSessionRecur); }, _this.heartBeatInterval);
                    });
                });
            };
            pollServerSessionRecur();
        };
        CheckSessionService.prototype.clearScheduledHeartBeat = function () {
            clearTimeout(this.scheduledHeartBeatRunning);
            this.scheduledHeartBeatRunning = null;
        };
        CheckSessionService.prototype.messageHandler = function (e) {
            var _a;
            var existingIFrame = this.getExistingIframe();
            var authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            var startsWith = !!((_a = authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.checkSessionIframe) === null || _a === void 0 ? void 0 : _a.startsWith(e.origin));
            this.outstandingMessages = 0;
            if (existingIFrame && startsWith && e.source === existingIFrame.contentWindow) {
                if (e.data === 'error') {
                    this.loggerService.logWarning('error from checksession messageHandler');
                }
                else if (e.data === 'changed') {
                    this.loggerService.logDebug(e);
                    this.checkSessionReceived = true;
                    this.eventService.fireEvent(exports.EventTypes.CheckSessionReceived, e.data);
                    this.checkSessionChangedInternal$.next(true);
                }
                else {
                    this.eventService.fireEvent(exports.EventTypes.CheckSessionReceived, e.data);
                    this.loggerService.logDebug(e.data + ' from checksession messageHandler');
                }
            }
        };
        CheckSessionService.prototype.bindMessageEventToIframe = function () {
            var iframeMessageEvent = this.messageHandler.bind(this);
            window.addEventListener('message', iframeMessageEvent, false);
        };
        CheckSessionService.prototype.getOrCreateIframe = function () {
            var existingIframe = this.getExistingIframe();
            if (!existingIframe) {
                var frame = this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
                this.bindMessageEventToIframe();
                return frame;
            }
            return existingIframe;
        };
        return CheckSessionService;
    }());
    CheckSessionService.ɵfac = function CheckSessionService_Factory(t) { return new (t || CheckSessionService)(i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(IFrameService), i0.ɵɵinject(PublicEventsService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(i0.NgZone)); };
    CheckSessionService.ɵprov = i0.ɵɵdefineInjectable({ token: CheckSessionService, factory: CheckSessionService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CheckSessionService, [{
                type: i0.Injectable
            }], function () { return [{ type: StoragePersistenceService }, { type: LoggerService }, { type: IFrameService }, { type: PublicEventsService }, { type: ConfigurationProvider }, { type: i0.NgZone }]; }, null);
    })();

    var IFRAME_FOR_SILENT_RENEW_IDENTIFIER = 'myiFrameForSilentRenew';
    var SilentRenewService = /** @class */ (function () {
        function SilentRenewService(configurationProvider, iFrameService, flowsService, resetAuthDataService, flowsDataService, authStateService, loggerService, flowHelper, implicitFlowCallbackService, intervalService) {
            this.configurationProvider = configurationProvider;
            this.iFrameService = iFrameService;
            this.flowsService = flowsService;
            this.resetAuthDataService = resetAuthDataService;
            this.flowsDataService = flowsDataService;
            this.authStateService = authStateService;
            this.loggerService = loggerService;
            this.flowHelper = flowHelper;
            this.implicitFlowCallbackService = implicitFlowCallbackService;
            this.intervalService = intervalService;
            this.refreshSessionWithIFrameCompletedInternal$ = new rxjs.Subject();
        }
        Object.defineProperty(SilentRenewService.prototype, "refreshSessionWithIFrameCompleted$", {
            get: function () {
                return this.refreshSessionWithIFrameCompletedInternal$.asObservable();
            },
            enumerable: false,
            configurable: true
        });
        SilentRenewService.prototype.getOrCreateIframe = function () {
            var existingIframe = this.getExistingIframe();
            if (!existingIframe) {
                return this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
            }
            return existingIframe;
        };
        SilentRenewService.prototype.isSilentRenewConfigured = function () {
            var _a = this.configurationProvider.getOpenIDConfiguration(), useRefreshToken = _a.useRefreshToken, silentRenew = _a.silentRenew;
            return !useRefreshToken && silentRenew;
        };
        SilentRenewService.prototype.codeFlowCallbackSilentRenewIframe = function (urlParts) {
            var _this = this;
            var params = new i1.HttpParams({
                fromString: urlParts[1],
            });
            var error = params.get('error');
            if (error) {
                this.authStateService.updateAndPublishAuthState({
                    authorizationState: exports.AuthorizedState.Unauthorized,
                    validationResult: exports.ValidationResult.LoginRequired,
                    isRenewProcess: true,
                });
                this.resetAuthDataService.resetAuthorizationData();
                this.flowsDataService.setNonce('');
                this.intervalService.stopPeriodicallTokenCheck();
                return rxjs.throwError(error);
            }
            var code = params.get('code');
            var state = params.get('state');
            var sessionState = params.get('session_state');
            var callbackContext = {
                code: code,
                refreshToken: null,
                state: state,
                sessionState: sessionState,
                authResult: null,
                isRenewProcess: true,
                jwtKeys: null,
                validationResult: null,
                existingIdToken: null,
            };
            return this.flowsService.processSilentRenewCodeFlowCallback(callbackContext).pipe(operators.catchError(function (errorFromFlow) {
                _this.intervalService.stopPeriodicallTokenCheck();
                _this.resetAuthDataService.resetAuthorizationData();
                return rxjs.throwError(errorFromFlow);
            }));
        };
        SilentRenewService.prototype.silentRenewEventHandler = function (e) {
            var _this = this;
            this.loggerService.logDebug('silentRenewEventHandler');
            if (!e.detail) {
                return;
            }
            var callback$ = rxjs.of(null);
            var isCodeFlow = this.flowHelper.isCurrentFlowCodeFlow();
            if (isCodeFlow) {
                var urlParts = e.detail.toString().split('?');
                callback$ = this.codeFlowCallbackSilentRenewIframe(urlParts);
            }
            else {
                callback$ = this.implicitFlowCallbackService.authorizedImplicitFlowCallback(e.detail);
            }
            callback$.subscribe(function (callbackContext) {
                _this.refreshSessionWithIFrameCompletedInternal$.next(callbackContext);
                _this.flowsDataService.resetSilentRenewRunning();
            }, function (err) {
                _this.loggerService.logError('Error: ' + err);
                _this.refreshSessionWithIFrameCompletedInternal$.next(null);
                _this.flowsDataService.resetSilentRenewRunning();
            });
        };
        SilentRenewService.prototype.getExistingIframe = function () {
            return this.iFrameService.getExistingIFrame(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        };
        return SilentRenewService;
    }());
    SilentRenewService.ɵfac = function SilentRenewService_Factory(t) { return new (t || SilentRenewService)(i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(IFrameService), i0.ɵɵinject(FlowsService), i0.ɵɵinject(ResetAuthDataService), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(FlowHelper), i0.ɵɵinject(ImplicitFlowCallbackService), i0.ɵɵinject(IntervallService)); };
    SilentRenewService.ɵprov = i0.ɵɵdefineInjectable({ token: SilentRenewService, factory: SilentRenewService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(SilentRenewService, [{
                type: i0.Injectable
            }], function () { return [{ type: ConfigurationProvider }, { type: IFrameService }, { type: FlowsService }, { type: ResetAuthDataService }, { type: FlowsDataService }, { type: AuthStateService }, { type: LoggerService }, { type: FlowHelper }, { type: ImplicitFlowCallbackService }, { type: IntervallService }]; }, null);
    })();

    var CodeFlowCallbackService = /** @class */ (function () {
        function CodeFlowCallbackService(flowsService, flowsDataService, intervallService, configurationProvider, router) {
            this.flowsService = flowsService;
            this.flowsDataService = flowsDataService;
            this.intervallService = intervallService;
            this.configurationProvider = configurationProvider;
            this.router = router;
        }
        CodeFlowCallbackService.prototype.authorizedCallbackWithCode = function (urlToCheck) {
            var _this = this;
            var isRenewProcess = this.flowsDataService.isSilentRenewRunning();
            var _a = this.configurationProvider.getOpenIDConfiguration(), triggerAuthorizationResultEvent = _a.triggerAuthorizationResultEvent, postLoginRoute = _a.postLoginRoute, unauthorizedRoute = _a.unauthorizedRoute;
            return this.flowsService.processCodeFlowCallback(urlToCheck).pipe(operators.tap(function (callbackContext) {
                if (!triggerAuthorizationResultEvent && !callbackContext.isRenewProcess) {
                    _this.router.navigateByUrl(postLoginRoute);
                }
            }), operators.catchError(function (error) {
                _this.flowsDataService.resetSilentRenewRunning();
                _this.intervallService.stopPeriodicallTokenCheck();
                if (!triggerAuthorizationResultEvent && !isRenewProcess) {
                    _this.router.navigateByUrl(unauthorizedRoute);
                }
                return rxjs.throwError(error);
            }));
        };
        return CodeFlowCallbackService;
    }());
    CodeFlowCallbackService.ɵfac = function CodeFlowCallbackService_Factory(t) { return new (t || CodeFlowCallbackService)(i0.ɵɵinject(FlowsService), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(IntervallService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(i5.Router)); };
    CodeFlowCallbackService.ɵprov = i0.ɵɵdefineInjectable({ token: CodeFlowCallbackService, factory: CodeFlowCallbackService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CodeFlowCallbackService, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], function () { return [{ type: FlowsService }, { type: FlowsDataService }, { type: IntervallService }, { type: ConfigurationProvider }, { type: i5.Router }]; }, null);
    })();

    var CallbackService = /** @class */ (function () {
        function CallbackService(urlService, flowHelper, implicitFlowCallbackService, codeFlowCallbackService) {
            this.urlService = urlService;
            this.flowHelper = flowHelper;
            this.implicitFlowCallbackService = implicitFlowCallbackService;
            this.codeFlowCallbackService = codeFlowCallbackService;
            this.stsCallbackInternal$ = new rxjs.Subject();
        }
        Object.defineProperty(CallbackService.prototype, "stsCallback$", {
            get: function () {
                return this.stsCallbackInternal$.asObservable();
            },
            enumerable: false,
            configurable: true
        });
        CallbackService.prototype.isCallback = function (currentUrl) {
            return this.urlService.isCallbackFromSts(currentUrl);
        };
        CallbackService.prototype.handleCallbackAndFireEvents = function (currentCallbackUrl) {
            var _this = this;
            var callback$;
            if (this.flowHelper.isCurrentFlowCodeFlow()) {
                callback$ = this.codeFlowCallbackService.authorizedCallbackWithCode(currentCallbackUrl);
            }
            else if (this.flowHelper.isCurrentFlowAnyImplicitFlow()) {
                callback$ = this.implicitFlowCallbackService.authorizedImplicitFlowCallback();
            }
            return callback$.pipe(operators.tap(function () { return _this.stsCallbackInternal$.next(); }));
        };
        return CallbackService;
    }());
    CallbackService.ɵfac = function CallbackService_Factory(t) { return new (t || CallbackService)(i0.ɵɵinject(UrlService), i0.ɵɵinject(FlowHelper), i0.ɵɵinject(ImplicitFlowCallbackService), i0.ɵɵinject(CodeFlowCallbackService)); };
    CallbackService.ɵprov = i0.ɵɵdefineInjectable({ token: CallbackService, factory: CallbackService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CallbackService, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], function () { return [{ type: UrlService }, { type: FlowHelper }, { type: ImplicitFlowCallbackService }, { type: CodeFlowCallbackService }]; }, null);
    })();

    var WELL_KNOWN_SUFFIX = "/.well-known/openid-configuration";
    var AuthWellKnownDataService = /** @class */ (function () {
        function AuthWellKnownDataService(http) {
            this.http = http;
        }
        AuthWellKnownDataService.prototype.getWellKnownEndPointsFromUrl = function (authWellknownEndpoint) {
            return this.getWellKnownDocument(authWellknownEndpoint).pipe(operators.map(function (wellKnownEndpoints) { return ({
                issuer: wellKnownEndpoints.issuer,
                jwksUri: wellKnownEndpoints.jwks_uri,
                authorizationEndpoint: wellKnownEndpoints.authorization_endpoint,
                tokenEndpoint: wellKnownEndpoints.token_endpoint,
                userinfoEndpoint: wellKnownEndpoints.userinfo_endpoint,
                endSessionEndpoint: wellKnownEndpoints.end_session_endpoint,
                checkSessionIframe: wellKnownEndpoints.check_session_iframe,
                revocationEndpoint: wellKnownEndpoints.revocation_endpoint,
                introspectionEndpoint: wellKnownEndpoints.introspection_endpoint,
                parEndpoint: wellKnownEndpoints.pushed_authorization_request_endpoint,
            }); }));
        };
        AuthWellKnownDataService.prototype.getWellKnownDocument = function (wellKnownEndpoint) {
            var url = wellKnownEndpoint;
            if (!wellKnownEndpoint.includes(WELL_KNOWN_SUFFIX)) {
                url = "" + wellKnownEndpoint + WELL_KNOWN_SUFFIX;
            }
            return this.http.get(url).pipe(operators.retry(2));
        };
        return AuthWellKnownDataService;
    }());
    AuthWellKnownDataService.ɵfac = function AuthWellKnownDataService_Factory(t) { return new (t || AuthWellKnownDataService)(i0.ɵɵinject(DataService)); };
    AuthWellKnownDataService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthWellKnownDataService, factory: AuthWellKnownDataService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AuthWellKnownDataService, [{
                type: i0.Injectable
            }], function () { return [{ type: DataService }]; }, null);
    })();

    var AuthWellKnownService = /** @class */ (function () {
        function AuthWellKnownService(publicEventsService, dataService, storagePersistenceService) {
            this.publicEventsService = publicEventsService;
            this.dataService = dataService;
            this.storagePersistenceService = storagePersistenceService;
        }
        AuthWellKnownService.prototype.getAuthWellKnownEndPoints = function (authWellknownEndpointUrl) {
            var _this = this;
            var alreadySavedWellKnownEndpoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (!!alreadySavedWellKnownEndpoints) {
                return rxjs.of(alreadySavedWellKnownEndpoints);
            }
            return this.getWellKnownEndPointsFromUrl(authWellknownEndpointUrl).pipe(operators.tap(function (mappedWellKnownEndpoints) { return _this.storeWellKnownEndpoints(mappedWellKnownEndpoints); }), operators.catchError(function (error) {
                _this.publicEventsService.fireEvent(exports.EventTypes.ConfigLoadingFailed, null);
                return rxjs.throwError(error);
            }));
        };
        AuthWellKnownService.prototype.storeWellKnownEndpoints = function (mappedWellKnownEndpoints) {
            this.storagePersistenceService.write('authWellKnownEndPoints', mappedWellKnownEndpoints);
        };
        AuthWellKnownService.prototype.getWellKnownEndPointsFromUrl = function (authWellknownEndpoint) {
            return this.dataService.getWellKnownEndPointsFromUrl(authWellknownEndpoint);
        };
        return AuthWellKnownService;
    }());
    AuthWellKnownService.ɵfac = function AuthWellKnownService_Factory(t) { return new (t || AuthWellKnownService)(i0.ɵɵinject(PublicEventsService), i0.ɵɵinject(AuthWellKnownDataService), i0.ɵɵinject(StoragePersistenceService)); };
    AuthWellKnownService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthWellKnownService, factory: AuthWellKnownService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AuthWellKnownService, [{
                type: i0.Injectable
            }], function () { return [{ type: PublicEventsService }, { type: AuthWellKnownDataService }, { type: StoragePersistenceService }]; }, null);
    })();

    var RefreshSessionIframeService = /** @class */ (function () {
        function RefreshSessionIframeService(doc, loggerService, urlService, silentRenewService, rendererFactory) {
            this.doc = doc;
            this.loggerService = loggerService;
            this.urlService = urlService;
            this.silentRenewService = silentRenewService;
            this.renderer = rendererFactory.createRenderer(null, null);
        }
        RefreshSessionIframeService.prototype.refreshSessionWithIframe = function (customParams) {
            this.loggerService.logDebug('BEGIN refresh session Authorize Iframe renew');
            var url = this.urlService.getRefreshSessionSilentRenewUrl(customParams);
            return this.sendAuthorizeRequestUsingSilentRenew(url);
        };
        RefreshSessionIframeService.prototype.sendAuthorizeRequestUsingSilentRenew = function (url) {
            var _this = this;
            var sessionIframe = this.silentRenewService.getOrCreateIframe();
            this.initSilentRenewRequest();
            this.loggerService.logDebug('sendAuthorizeRequestUsingSilentRenew for URL:' + url);
            return new rxjs.Observable(function (observer) {
                var onLoadHandler = function () {
                    sessionIframe.removeEventListener('load', onLoadHandler);
                    _this.loggerService.logDebug('removed event listener from IFrame');
                    observer.next(true);
                    observer.complete();
                };
                sessionIframe.addEventListener('load', onLoadHandler);
                sessionIframe.contentWindow.location.replace(url);
            });
        };
        RefreshSessionIframeService.prototype.initSilentRenewRequest = function () {
            var _this = this;
            var instanceId = Math.random();
            var initDestroyHandler = this.renderer.listen('window', 'oidc-silent-renew-init', function (e) {
                if (e.detail !== instanceId) {
                    initDestroyHandler();
                    renewDestroyHandler();
                }
            });
            var renewDestroyHandler = this.renderer.listen('window', 'oidc-silent-renew-message', function (e) { return _this.silentRenewService.silentRenewEventHandler(e); });
            this.doc.defaultView.dispatchEvent(new CustomEvent('oidc-silent-renew-init', {
                detail: instanceId,
            }));
        };
        return RefreshSessionIframeService;
    }());
    RefreshSessionIframeService.ɵfac = function RefreshSessionIframeService_Factory(t) { return new (t || RefreshSessionIframeService)(i0.ɵɵinject(common.DOCUMENT), i0.ɵɵinject(LoggerService), i0.ɵɵinject(UrlService), i0.ɵɵinject(SilentRenewService), i0.ɵɵinject(i0.RendererFactory2)); };
    RefreshSessionIframeService.ɵprov = i0.ɵɵdefineInjectable({ token: RefreshSessionIframeService, factory: RefreshSessionIframeService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(RefreshSessionIframeService, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [common.DOCUMENT]
                        }] }, { type: LoggerService }, { type: UrlService }, { type: SilentRenewService }, { type: i0.RendererFactory2 }];
        }, null);
    })();

    var RefreshSessionRefreshTokenService = /** @class */ (function () {
        function RefreshSessionRefreshTokenService(loggerService, resetAuthDataService, flowsService, intervalService) {
            this.loggerService = loggerService;
            this.resetAuthDataService = resetAuthDataService;
            this.flowsService = flowsService;
            this.intervalService = intervalService;
        }
        RefreshSessionRefreshTokenService.prototype.refreshSessionWithRefreshTokens = function (customParamsRefresh) {
            var _this = this;
            this.loggerService.logDebug('BEGIN refresh session Authorize');
            return this.flowsService.processRefreshToken(customParamsRefresh).pipe(operators.catchError(function (error) {
                _this.intervalService.stopPeriodicallTokenCheck();
                _this.resetAuthDataService.resetAuthorizationData();
                return rxjs.throwError(error);
            }));
        };
        return RefreshSessionRefreshTokenService;
    }());
    RefreshSessionRefreshTokenService.ɵfac = function RefreshSessionRefreshTokenService_Factory(t) { return new (t || RefreshSessionRefreshTokenService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(ResetAuthDataService), i0.ɵɵinject(FlowsService), i0.ɵɵinject(IntervallService)); };
    RefreshSessionRefreshTokenService.ɵprov = i0.ɵɵdefineInjectable({ token: RefreshSessionRefreshTokenService, factory: RefreshSessionRefreshTokenService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(RefreshSessionRefreshTokenService, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], function () { return [{ type: LoggerService }, { type: ResetAuthDataService }, { type: FlowsService }, { type: IntervallService }]; }, null);
    })();

    var MAX_RETRY_ATTEMPTS = 3;
    var RefreshSessionService = /** @class */ (function () {
        function RefreshSessionService(flowHelper, configurationProvider, flowsDataService, loggerService, silentRenewService, authStateService, authWellKnownService, refreshSessionIframeService, refreshSessionRefreshTokenService) {
            this.flowHelper = flowHelper;
            this.configurationProvider = configurationProvider;
            this.flowsDataService = flowsDataService;
            this.loggerService = loggerService;
            this.silentRenewService = silentRenewService;
            this.authStateService = authStateService;
            this.authWellKnownService = authWellKnownService;
            this.refreshSessionIframeService = refreshSessionIframeService;
            this.refreshSessionRefreshTokenService = refreshSessionRefreshTokenService;
        }
        RefreshSessionService.prototype.forceRefreshSession = function (extraCustomParams) {
            var _this = this;
            if (this.flowHelper.isCurrentFlowCodeFlowWithRefreshTokens()) {
                var customParamsRefreshToken = this.configurationProvider.getOpenIDConfiguration().customParamsRefreshToken;
                var mergedParams = Object.assign(Object.assign({}, extraCustomParams), customParamsRefreshToken);
                return this.startRefreshSession(mergedParams).pipe(operators.map(function () {
                    var isAuthenticated = _this.authStateService.areAuthStorageTokensValid();
                    if (isAuthenticated) {
                        return {
                            idToken: _this.authStateService.getIdToken(),
                            accessToken: _this.authStateService.getAccessToken(),
                        };
                    }
                    return null;
                }));
            }
            var silentRenewTimeoutInSeconds = this.configurationProvider.getOpenIDConfiguration().silentRenewTimeoutInSeconds;
            var timeOutTime = silentRenewTimeoutInSeconds * 1000;
            return rxjs.forkJoin([
                this.startRefreshSession(extraCustomParams),
                this.silentRenewService.refreshSessionWithIFrameCompleted$.pipe(operators.take(1)),
            ]).pipe(operators.timeout(timeOutTime), operators.retryWhen(this.timeoutRetryStrategy.bind(this)), operators.map(function (_c) {
                var _d = __read(_c, 2), _ = _d[0], callbackContext = _d[1];
                var _a, _b;
                var isAuthenticated = _this.authStateService.areAuthStorageTokensValid();
                if (isAuthenticated) {
                    return {
                        idToken: (_a = callbackContext === null || callbackContext === void 0 ? void 0 : callbackContext.authResult) === null || _a === void 0 ? void 0 : _a.id_token,
                        accessToken: (_b = callbackContext === null || callbackContext === void 0 ? void 0 : callbackContext.authResult) === null || _b === void 0 ? void 0 : _b.access_token,
                    };
                }
                return null;
            }));
        };
        RefreshSessionService.prototype.startRefreshSession = function (extraCustomParams) {
            var _this = this;
            var isSilentRenewRunning = this.flowsDataService.isSilentRenewRunning();
            this.loggerService.logDebug("Checking: silentRenewRunning: " + isSilentRenewRunning);
            var shouldBeExecuted = !isSilentRenewRunning;
            if (!shouldBeExecuted) {
                return rxjs.of(null);
            }
            var authWellknownEndpoint = (this.configurationProvider.getOpenIDConfiguration() || {}).authWellknownEndpoint;
            if (!authWellknownEndpoint) {
                this.loggerService.logError('no authwellknownendpoint given!');
                return rxjs.of(null);
            }
            return this.authWellKnownService.getAuthWellKnownEndPoints(authWellknownEndpoint).pipe(operators.switchMap(function () {
                _this.flowsDataService.setSilentRenewRunning();
                if (_this.flowHelper.isCurrentFlowCodeFlowWithRefreshTokens()) {
                    // Refresh Session using Refresh tokens
                    return _this.refreshSessionRefreshTokenService.refreshSessionWithRefreshTokens(extraCustomParams);
                }
                return _this.refreshSessionIframeService.refreshSessionWithIframe(extraCustomParams);
            }));
        };
        RefreshSessionService.prototype.timeoutRetryStrategy = function (errorAttempts) {
            var _this = this;
            return errorAttempts.pipe(operators.mergeMap(function (error, index) {
                var scalingDuration = 1000;
                var currentAttempt = index + 1;
                if (!(error instanceof rxjs.TimeoutError) || currentAttempt > MAX_RETRY_ATTEMPTS) {
                    return rxjs.throwError(error);
                }
                _this.loggerService.logDebug("forceRefreshSession timeout. Attempt #" + currentAttempt);
                _this.flowsDataService.resetSilentRenewRunning();
                return rxjs.timer(currentAttempt * scalingDuration);
            }));
        };
        return RefreshSessionService;
    }());
    RefreshSessionService.ɵfac = function RefreshSessionService_Factory(t) { return new (t || RefreshSessionService)(i0.ɵɵinject(FlowHelper), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(SilentRenewService), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(AuthWellKnownService), i0.ɵɵinject(RefreshSessionIframeService), i0.ɵɵinject(RefreshSessionRefreshTokenService)); };
    RefreshSessionService.ɵprov = i0.ɵɵdefineInjectable({ token: RefreshSessionService, factory: RefreshSessionService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(RefreshSessionService, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], function () { return [{ type: FlowHelper }, { type: ConfigurationProvider }, { type: FlowsDataService }, { type: LoggerService }, { type: SilentRenewService }, { type: AuthStateService }, { type: AuthWellKnownService }, { type: RefreshSessionIframeService }, { type: RefreshSessionRefreshTokenService }]; }, null);
    })();

    var PeriodicallyTokenCheckService = /** @class */ (function () {
        function PeriodicallyTokenCheckService(resetAuthDataService, flowHelper, configurationProvider, flowsDataService, loggerService, userService, authStateService, refreshSessionIframeService, refreshSessionRefreshTokenService, intervalService, storagePersistenceService) {
            this.resetAuthDataService = resetAuthDataService;
            this.flowHelper = flowHelper;
            this.configurationProvider = configurationProvider;
            this.flowsDataService = flowsDataService;
            this.loggerService = loggerService;
            this.userService = userService;
            this.authStateService = authStateService;
            this.refreshSessionIframeService = refreshSessionIframeService;
            this.refreshSessionRefreshTokenService = refreshSessionRefreshTokenService;
            this.intervalService = intervalService;
            this.storagePersistenceService = storagePersistenceService;
        }
        PeriodicallyTokenCheckService.prototype.startTokenValidationPeriodically = function (repeatAfterSeconds) {
            var _this = this;
            var silentRenew = this.configurationProvider.getOpenIDConfiguration().silentRenew;
            if (!!this.intervalService.runTokenValidationRunning || !silentRenew) {
                return;
            }
            this.loggerService.logDebug("starting token validation check every " + repeatAfterSeconds + "s");
            var periodicallyCheck$ = this.intervalService.startPeriodicTokenCheck(repeatAfterSeconds).pipe(operators.switchMap(function () {
                var idToken = _this.authStateService.getIdToken();
                var isSilentRenewRunning = _this.flowsDataService.isSilentRenewRunning();
                var userDataFromStore = _this.userService.getUserDataFromStore();
                _this.loggerService.logDebug("Checking: silentRenewRunning: " + isSilentRenewRunning + " id_token: " + !!idToken + " userData: " + !!userDataFromStore);
                var shouldBeExecuted = userDataFromStore && !isSilentRenewRunning && idToken;
                if (!shouldBeExecuted) {
                    return rxjs.of(null);
                }
                var idTokenHasExpired = _this.authStateService.hasIdTokenExpired();
                var accessTokenHasExpired = _this.authStateService.hasAccessTokenExpiredIfExpiryExists();
                if (!idTokenHasExpired && !accessTokenHasExpired) {
                    return rxjs.of(null);
                }
                var config = _this.configurationProvider.getOpenIDConfiguration();
                if (!(config === null || config === void 0 ? void 0 : config.silentRenew)) {
                    _this.resetAuthDataService.resetAuthorizationData();
                    return rxjs.of(null);
                }
                _this.loggerService.logDebug('starting silent renew...');
                _this.flowsDataService.setSilentRenewRunning();
                if (_this.flowHelper.isCurrentFlowCodeFlowWithRefreshTokens()) {
                    // Retrieve Dynamically Set Custom Params for refresh body
                    var customParamsRefresh = _this.storagePersistenceService.read('storageCustomParamsRefresh') || {};
                    var customParamsRefreshToken = _this.configurationProvider.getOpenIDConfiguration().customParamsRefreshToken;
                    var mergedParams = Object.assign(Object.assign({}, customParamsRefresh), customParamsRefreshToken);
                    // Refresh Session using Refresh tokens
                    return _this.refreshSessionRefreshTokenService.refreshSessionWithRefreshTokens(mergedParams);
                }
                // Retrieve Dynamically Set Custom Params
                var customParams = _this.storagePersistenceService.read('storageCustomRequestParams');
                return _this.refreshSessionIframeService.refreshSessionWithIframe(customParams);
            }));
            this.intervalService.runTokenValidationRunning = periodicallyCheck$
                .pipe(operators.catchError(function () {
                _this.flowsDataService.resetSilentRenewRunning();
                return rxjs.throwError('periodically check failed');
            }))
                .subscribe(function () {
                _this.loggerService.logDebug('silent renew, periodic check finished!');
                if (_this.flowHelper.isCurrentFlowCodeFlowWithRefreshTokens()) {
                    _this.flowsDataService.resetSilentRenewRunning();
                }
            }, function (err) {
                _this.loggerService.logError('silent renew failed!', err);
            });
        };
        return PeriodicallyTokenCheckService;
    }());
    PeriodicallyTokenCheckService.ɵfac = function PeriodicallyTokenCheckService_Factory(t) { return new (t || PeriodicallyTokenCheckService)(i0.ɵɵinject(ResetAuthDataService), i0.ɵɵinject(FlowHelper), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(UserService), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(RefreshSessionIframeService), i0.ɵɵinject(RefreshSessionRefreshTokenService), i0.ɵɵinject(IntervallService), i0.ɵɵinject(StoragePersistenceService)); };
    PeriodicallyTokenCheckService.ɵprov = i0.ɵɵdefineInjectable({ token: PeriodicallyTokenCheckService, factory: PeriodicallyTokenCheckService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(PeriodicallyTokenCheckService, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], function () { return [{ type: ResetAuthDataService }, { type: FlowHelper }, { type: ConfigurationProvider }, { type: FlowsDataService }, { type: LoggerService }, { type: UserService }, { type: AuthStateService }, { type: RefreshSessionIframeService }, { type: RefreshSessionRefreshTokenService }, { type: IntervallService }, { type: StoragePersistenceService }]; }, null);
    })();

    var PopUpService = /** @class */ (function () {
        function PopUpService() {
            this.STORAGE_IDENTIFIER = 'popupauth';
            this.resultInternal$ = new rxjs.Subject();
        }
        Object.defineProperty(PopUpService.prototype, "result$", {
            get: function () {
                return this.resultInternal$.asObservable();
            },
            enumerable: false,
            configurable: true
        });
        PopUpService.prototype.isCurrentlyInPopup = function () {
            var popup = sessionStorage.getItem(this.STORAGE_IDENTIFIER);
            return !!window.opener && window.opener !== window && !!popup;
        };
        PopUpService.prototype.openPopUp = function (url, popupOptions) {
            var _this = this;
            var optionsToPass = this.getOptions(popupOptions);
            this.popUp = window.open(url, '_blank', optionsToPass);
            this.popUp.sessionStorage.setItem(this.STORAGE_IDENTIFIER, 'true');
            var listener = function (event) {
                if (!(event === null || event === void 0 ? void 0 : event.data) || typeof event.data !== 'string') {
                    return;
                }
                _this.resultInternal$.next({ userClosed: false, receivedUrl: event.data });
                _this.cleanUp(listener);
            };
            window.addEventListener('message', listener, false);
            this.handle = window.setInterval(function () {
                if (_this.popUp.closed) {
                    _this.resultInternal$.next({ userClosed: true });
                    _this.cleanUp(listener);
                }
            }, 200);
        };
        PopUpService.prototype.sendMessageToMainWindow = function (url) {
            if (window.opener) {
                this.sendMessage(url, window.location.href);
            }
        };
        PopUpService.prototype.cleanUp = function (listener) {
            var _a;
            window.removeEventListener('message', listener, false);
            window.clearInterval(this.handle);
            if (this.popUp) {
                (_a = this.popUp.sessionStorage) === null || _a === void 0 ? void 0 : _a.removeItem(this.STORAGE_IDENTIFIER);
                this.popUp.close();
                this.popUp = null;
            }
        };
        PopUpService.prototype.sendMessage = function (url, href) {
            window.opener.postMessage(url, href);
        };
        PopUpService.prototype.getOptions = function (popupOptions) {
            var popupDefaultOptions = { width: 500, height: 500, left: 50, top: 50 };
            var options = Object.assign(Object.assign({}, popupDefaultOptions), (popupOptions || {}));
            return Object.entries(options)
                .map(function (_b) {
                var _c = __read(_b, 2), key = _c[0], value = _c[1];
                return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            })
                .join(',');
        };
        return PopUpService;
    }());
    PopUpService.ɵfac = function PopUpService_Factory(t) { return new (t || PopUpService)(); };
    PopUpService.ɵprov = i0.ɵɵdefineInjectable({ token: PopUpService, factory: PopUpService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(PopUpService, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], null, null);
    })();

    var CheckAuthService = /** @class */ (function () {
        function CheckAuthService(doc, checkSessionService, silentRenewService, userService, loggerService, configurationProvider, authStateService, callbackService, refreshSessionService, periodicallyTokenCheckService, popupService, autoLoginService, router) {
            this.doc = doc;
            this.checkSessionService = checkSessionService;
            this.silentRenewService = silentRenewService;
            this.userService = userService;
            this.loggerService = loggerService;
            this.configurationProvider = configurationProvider;
            this.authStateService = authStateService;
            this.callbackService = callbackService;
            this.refreshSessionService = refreshSessionService;
            this.periodicallyTokenCheckService = periodicallyTokenCheckService;
            this.popupService = popupService;
            this.autoLoginService = autoLoginService;
            this.router = router;
        }
        CheckAuthService.prototype.checkAuth = function (url) {
            var _this = this;
            if (!this.configurationProvider.hasValidConfig()) {
                this.loggerService.logError('Please provide a configuration before setting up the module');
                return rxjs.of(false);
            }
            var stsServer = this.configurationProvider.getOpenIDConfiguration().stsServer;
            this.loggerService.logDebug('STS server: ', stsServer);
            var currentUrl = url || this.doc.defaultView.location.toString();
            if (this.popupService.isCurrentlyInPopup()) {
                this.popupService.sendMessageToMainWindow(currentUrl);
                return rxjs.of(null);
            }
            var isCallback = this.callbackService.isCallback(currentUrl);
            this.loggerService.logDebug('currentUrl to check auth with: ', currentUrl);
            var callback$ = isCallback ? this.callbackService.handleCallbackAndFireEvents(currentUrl) : rxjs.of(null);
            return callback$.pipe(operators.map(function () {
                var isAuthenticated = _this.authStateService.areAuthStorageTokensValid();
                if (isAuthenticated) {
                    _this.startCheckSessionAndValidation();
                    if (!isCallback) {
                        _this.authStateService.setAuthorizedAndFireEvent();
                        _this.userService.publishUserDataIfExists();
                    }
                }
                _this.loggerService.logDebug('checkAuth completed fired events, auth: ' + isAuthenticated);
                return isAuthenticated;
            }), operators.tap(function () {
                var isAuthenticated = _this.authStateService.areAuthStorageTokensValid();
                if (isAuthenticated) {
                    var savedRouteForRedirect = _this.autoLoginService.getStoredRedirectRoute();
                    if (savedRouteForRedirect) {
                        _this.autoLoginService.deleteStoredRedirectRoute();
                        _this.router.navigateByUrl(savedRouteForRedirect);
                    }
                }
            }), operators.catchError(function (error) {
                _this.loggerService.logError(error);
                return rxjs.of(false);
            }));
        };
        CheckAuthService.prototype.checkAuthIncludingServer = function () {
            var _this = this;
            return this.checkAuth().pipe(operators.switchMap(function (isAuthenticated) {
                if (isAuthenticated) {
                    return rxjs.of(isAuthenticated);
                }
                return _this.refreshSessionService.forceRefreshSession().pipe(operators.map(function (result) { return !!(result === null || result === void 0 ? void 0 : result.idToken) && !!(result === null || result === void 0 ? void 0 : result.accessToken); }), operators.switchMap(function (isAuth) {
                    if (isAuth) {
                        _this.startCheckSessionAndValidation();
                    }
                    return rxjs.of(isAuth);
                }));
            }));
        };
        CheckAuthService.prototype.startCheckSessionAndValidation = function () {
            if (this.checkSessionService.isCheckSessionConfigured()) {
                this.checkSessionService.start();
            }
            var tokenRefreshInSeconds = this.configurationProvider.getOpenIDConfiguration().tokenRefreshInSeconds;
            this.periodicallyTokenCheckService.startTokenValidationPeriodically(tokenRefreshInSeconds);
            if (this.silentRenewService.isSilentRenewConfigured()) {
                this.silentRenewService.getOrCreateIframe();
            }
        };
        return CheckAuthService;
    }());
    CheckAuthService.ɵfac = function CheckAuthService_Factory(t) { return new (t || CheckAuthService)(i0.ɵɵinject(common.DOCUMENT), i0.ɵɵinject(CheckSessionService), i0.ɵɵinject(SilentRenewService), i0.ɵɵinject(UserService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(CallbackService), i0.ɵɵinject(RefreshSessionService), i0.ɵɵinject(PeriodicallyTokenCheckService), i0.ɵɵinject(PopUpService), i0.ɵɵinject(AutoLoginService), i0.ɵɵinject(i5.Router)); };
    CheckAuthService.ɵprov = i0.ɵɵdefineInjectable({ token: CheckAuthService, factory: CheckAuthService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CheckAuthService, [{
                type: i0.Injectable
            }], function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [common.DOCUMENT]
                        }] }, { type: CheckSessionService }, { type: SilentRenewService }, { type: UserService }, { type: LoggerService }, { type: ConfigurationProvider }, { type: AuthStateService }, { type: CallbackService }, { type: RefreshSessionService }, { type: PeriodicallyTokenCheckService }, { type: PopUpService }, { type: AutoLoginService }, { type: i5.Router }];
        }, null);
    })();

    var POSITIVE_VALIDATION_RESULT = {
        result: true,
        messages: [],
        level: null,
    };

    var ensureClientId = function (passedConfig) {
        if (!passedConfig.clientId) {
            return {
                result: false,
                messages: ['The clientId is required and missing from your config!'],
                level: 'error',
            };
        }
        return POSITIVE_VALIDATION_RESULT;
    };

    var ensureRedirectRule = function (passedConfig) {
        if (!passedConfig.redirectUrl) {
            return {
                result: false,
                messages: ['The redirectURL is required and missing from your config'],
                level: 'error',
            };
        }
        return POSITIVE_VALIDATION_RESULT;
    };

    var ensureSilentRenewUrlWhenNoRefreshTokenUsed = function (passedConfig) {
        var usesSilentRenew = passedConfig.silentRenew;
        var usesRefreshToken = passedConfig.useRefreshToken;
        var hasSilentRenewUrl = passedConfig.silentRenewUrl;
        if (usesSilentRenew && !usesRefreshToken && !hasSilentRenewUrl) {
            return {
                result: false,
                messages: ['Please provide a silent renew URL if using renew and not refresh tokens'],
                level: 'error',
            };
        }
        return POSITIVE_VALIDATION_RESULT;
    };

    var ensureStsServer = function (passedConfig) {
        if (!passedConfig.stsServer) {
            return {
                result: false,
                messages: ['The STS URL MUST be provided in the configuration!'],
                level: 'error',
            };
        }
        return POSITIVE_VALIDATION_RESULT;
    };

    var useOfflineScopeWithSilentRenew = function (passedConfig) {
        var hasRefreshToken = passedConfig.useRefreshToken;
        var hasSilentRenew = passedConfig.silentRenew;
        var scope = passedConfig.scope || '';
        var hasOfflineScope = scope.split(' ').includes('offline_access');
        if (hasRefreshToken && hasSilentRenew && !hasOfflineScope) {
            return {
                result: false,
                messages: ['When using silent renew and refresh tokens please set the `offline_access` scope'],
                level: 'warning',
            };
        }
        return POSITIVE_VALIDATION_RESULT;
    };

    var allRules = [
        ensureStsServer,
        useOfflineScopeWithSilentRenew,
        ensureRedirectRule,
        ensureClientId,
        ensureSilentRenewUrlWhenNoRefreshTokenUsed,
    ];

    var ConfigValidationService = /** @class */ (function () {
        function ConfigValidationService(loggerService) {
            this.loggerService = loggerService;
        }
        ConfigValidationService.prototype.validateConfig = function (passedConfig) {
            var _this = this;
            var allValidationResults = allRules.map(function (rule) { return rule(passedConfig); });
            var allMessages = allValidationResults.filter(function (x) { return x.messages.length > 0; });
            var allErrorMessages = this.getAllMessagesOfType('error', allMessages);
            var allWarnings = this.getAllMessagesOfType('warning', allMessages);
            allErrorMessages.map(function (message) { return _this.loggerService.logError(message); });
            allWarnings.map(function (message) { return _this.loggerService.logWarning(message); });
            return allErrorMessages.length === 0;
        };
        ConfigValidationService.prototype.getAllMessagesOfType = function (type, results) {
            var allMessages = results.filter(function (x) { return x.level === type; }).map(function (result) { return result.messages; });
            return allMessages.reduce(function (acc, val) { return acc.concat(val); }, []);
        };
        return ConfigValidationService;
    }());
    ConfigValidationService.ɵfac = function ConfigValidationService_Factory(t) { return new (t || ConfigValidationService)(i0.ɵɵinject(LoggerService)); };
    ConfigValidationService.ɵprov = i0.ɵɵdefineInjectable({ token: ConfigValidationService, factory: ConfigValidationService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ConfigValidationService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }]; }, null);
    })();

    var OidcConfigService = /** @class */ (function () {
        function OidcConfigService(loggerService, publicEventsService, configurationProvider, authWellKnownService, storagePersistenceService, configValidationService) {
            this.loggerService = loggerService;
            this.publicEventsService = publicEventsService;
            this.configurationProvider = configurationProvider;
            this.authWellKnownService = authWellKnownService;
            this.storagePersistenceService = storagePersistenceService;
            this.configValidationService = configValidationService;
        }
        OidcConfigService.prototype.withConfig = function (passedConfig, passedAuthWellKnownEndpoints) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this.configValidationService.validateConfig(passedConfig)) {
                    _this.loggerService.logError('Validation of config rejected with errors. Config is NOT set.');
                    resolve();
                }
                if (!passedConfig.authWellknownEndpoint) {
                    passedConfig.authWellknownEndpoint = passedConfig.stsServer;
                }
                var usedConfig = _this.configurationProvider.setConfig(passedConfig);
                var alreadyExistingAuthWellKnownEndpoints = _this.storagePersistenceService.read('authWellKnownEndPoints');
                if (!!alreadyExistingAuthWellKnownEndpoints) {
                    _this.publicEventsService.fireEvent(exports.EventTypes.ConfigLoaded, {
                        configuration: passedConfig,
                        wellknown: alreadyExistingAuthWellKnownEndpoints,
                    });
                    resolve();
                }
                if (!!passedAuthWellKnownEndpoints) {
                    _this.authWellKnownService.storeWellKnownEndpoints(passedAuthWellKnownEndpoints);
                    _this.publicEventsService.fireEvent(exports.EventTypes.ConfigLoaded, {
                        configuration: passedConfig,
                        wellknown: passedAuthWellKnownEndpoints,
                    });
                    resolve();
                }
                if (usedConfig.eagerLoadAuthWellKnownEndpoints) {
                    _this.authWellKnownService
                        .getAuthWellKnownEndPoints(usedConfig.authWellknownEndpoint)
                        .pipe(operators.catchError(function (error) {
                        _this.loggerService.logError('Getting auth well known endpoints failed on start', error);
                        return rxjs.throwError(error);
                    }), operators.tap(function (wellknownEndPoints) { return _this.publicEventsService.fireEvent(exports.EventTypes.ConfigLoaded, {
                        configuration: passedConfig,
                        wellknown: wellknownEndPoints,
                    }); }))
                        .subscribe(function () { return resolve(); }, function () { return reject(); });
                }
                else {
                    _this.publicEventsService.fireEvent(exports.EventTypes.ConfigLoaded, {
                        configuration: passedConfig,
                        wellknown: null,
                    });
                    resolve();
                }
            });
        };
        return OidcConfigService;
    }());
    OidcConfigService.ɵfac = function OidcConfigService_Factory(t) { return new (t || OidcConfigService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(PublicEventsService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(AuthWellKnownService), i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(ConfigValidationService)); };
    OidcConfigService.ɵprov = i0.ɵɵdefineInjectable({ token: OidcConfigService, factory: OidcConfigService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(OidcConfigService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }, { type: PublicEventsService }, { type: ConfigurationProvider }, { type: AuthWellKnownService }, { type: StoragePersistenceService }, { type: ConfigValidationService }]; }, null);
    })();

    var ResponseTypeValidationService = /** @class */ (function () {
        function ResponseTypeValidationService(loggerService, flowHelper) {
            this.loggerService = loggerService;
            this.flowHelper = flowHelper;
        }
        ResponseTypeValidationService.prototype.hasConfigValidResponseType = function () {
            if (this.flowHelper.isCurrentFlowAnyImplicitFlow()) {
                return true;
            }
            if (this.flowHelper.isCurrentFlowCodeFlow()) {
                return true;
            }
            this.loggerService.logWarning('module configured incorrectly, invalid response_type. Check the responseType in the config');
            return false;
        };
        return ResponseTypeValidationService;
    }());
    ResponseTypeValidationService.ɵfac = function ResponseTypeValidationService_Factory(t) { return new (t || ResponseTypeValidationService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(FlowHelper)); };
    ResponseTypeValidationService.ɵprov = i0.ɵɵdefineInjectable({ token: ResponseTypeValidationService, factory: ResponseTypeValidationService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ResponseTypeValidationService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }, { type: FlowHelper }]; }, null);
    })();

    var RedirectService = /** @class */ (function () {
        function RedirectService(doc) {
            this.doc = doc;
        }
        RedirectService.prototype.redirectTo = function (url) {
            this.doc.location.href = url;
        };
        return RedirectService;
    }());
    RedirectService.ɵfac = function RedirectService_Factory(t) { return new (t || RedirectService)(i0.ɵɵinject(common.DOCUMENT)); };
    RedirectService.ɵprov = i0.ɵɵdefineInjectable({ token: RedirectService, factory: RedirectService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(RedirectService, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [common.DOCUMENT]
                        }] }];
        }, null);
    })();

    var ParService = /** @class */ (function () {
        function ParService(loggerService, urlService, dataService, storagePersistenceService) {
            this.loggerService = loggerService;
            this.urlService = urlService;
            this.dataService = dataService;
            this.storagePersistenceService = storagePersistenceService;
        }
        ParService.prototype.postParRequest = function (customParams) {
            var _this = this;
            var headers = new i1.HttpHeaders();
            headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
            var authWellKnown = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (!authWellKnown) {
                return rxjs.throwError('Could not read PAR endpoint because authWellKnownEndPoints are not given');
            }
            var parEndpoint = authWellKnown.parEndpoint;
            if (!parEndpoint) {
                return rxjs.throwError('Could not read PAR endpoint from authWellKnownEndpoints');
            }
            var data = this.urlService.createBodyForParCodeFlowRequest(customParams);
            return this.dataService.post(parEndpoint, data, headers).pipe(operators.retry(2), operators.map(function (response) {
                _this.loggerService.logDebug('par response: ', response);
                return {
                    expiresIn: response.expires_in,
                    requestUri: response.request_uri,
                };
            }), operators.catchError(function (error) {
                var errorMessage = "There was an error on ParService postParRequest";
                _this.loggerService.logError(errorMessage, error);
                return rxjs.throwError(errorMessage);
            }));
        };
        return ParService;
    }());
    ParService.ɵfac = function ParService_Factory(t) { return new (t || ParService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(UrlService), i0.ɵɵinject(DataService), i0.ɵɵinject(StoragePersistenceService)); };
    ParService.ɵprov = i0.ɵɵdefineInjectable({ token: ParService, factory: ParService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ParService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }, { type: UrlService }, { type: DataService }, { type: StoragePersistenceService }]; }, null);
    })();

    var ParLoginService = /** @class */ (function () {
        function ParLoginService(loggerService, responseTypeValidationService, urlService, redirectService, configurationProvider, authWellKnownService, popupService, checkAuthService, userService, authStateService, parService) {
            this.loggerService = loggerService;
            this.responseTypeValidationService = responseTypeValidationService;
            this.urlService = urlService;
            this.redirectService = redirectService;
            this.configurationProvider = configurationProvider;
            this.authWellKnownService = authWellKnownService;
            this.popupService = popupService;
            this.checkAuthService = checkAuthService;
            this.userService = userService;
            this.authStateService = authStateService;
            this.parService = parService;
        }
        ParLoginService.prototype.loginPar = function (authOptions) {
            var _this = this;
            if (!this.responseTypeValidationService.hasConfigValidResponseType()) {
                this.loggerService.logError('Invalid response type!');
                return;
            }
            var authWellknownEndpoint = this.configurationProvider.getOpenIDConfiguration().authWellknownEndpoint;
            if (!authWellknownEndpoint) {
                this.loggerService.logError('no authWellknownEndpoint given!');
                return;
            }
            this.loggerService.logDebug('BEGIN Authorize OIDC Flow, no auth data');
            var _a = authOptions || {}, urlHandler = _a.urlHandler, customParams = _a.customParams;
            this.authWellKnownService
                .getAuthWellKnownEndPoints(authWellknownEndpoint)
                .pipe(operators.switchMap(function () { return _this.parService.postParRequest(customParams); }))
                .subscribe(function (response) {
                _this.loggerService.logDebug('par response: ', response);
                var url = _this.urlService.getAuthorizeParUrl(response.requestUri);
                _this.loggerService.logDebug('par request url: ', url);
                if (!url) {
                    _this.loggerService.logError("Could not create url with param " + response.requestUri + ": '" + url + "'");
                    return;
                }
                if (urlHandler) {
                    urlHandler(url);
                }
                else {
                    _this.redirectService.redirectTo(url);
                }
            });
        };
        ParLoginService.prototype.loginWithPopUpPar = function (authOptions, popupOptions) {
            var _this = this;
            if (!this.responseTypeValidationService.hasConfigValidResponseType()) {
                var errorMessage = 'Invalid response type!';
                this.loggerService.logError(errorMessage);
                return rxjs.throwError(errorMessage);
            }
            var authWellknownEndpoint = this.configurationProvider.getOpenIDConfiguration().authWellknownEndpoint;
            if (!authWellknownEndpoint) {
                var errorMessage = 'no authWellknownEndpoint given!';
                this.loggerService.logError(errorMessage);
                return rxjs.throwError(errorMessage);
            }
            this.loggerService.logDebug('BEGIN Authorize OIDC Flow with popup, no auth data');
            var customParams = (authOptions || {}).customParams;
            return this.authWellKnownService.getAuthWellKnownEndPoints(authWellknownEndpoint).pipe(operators.switchMap(function () { return _this.parService.postParRequest(customParams); }), operators.switchMap(function (response) {
                _this.loggerService.logDebug('par response: ', response);
                var url = _this.urlService.getAuthorizeParUrl(response.requestUri);
                _this.loggerService.logDebug('par request url: ', url);
                if (!url) {
                    var errorMessage = "Could not create url with param " + response.requestUri + ": 'url'";
                    _this.loggerService.logError(errorMessage);
                    return rxjs.throwError(errorMessage);
                }
                _this.popupService.openPopUp(url, popupOptions);
                return _this.popupService.result$.pipe(operators.take(1), operators.switchMap(function (result) { return result.userClosed === true
                    ? rxjs.of({ isAuthenticated: false, errorMessage: 'User closed popup' })
                    : _this.checkAuthService.checkAuth(result.receivedUrl).pipe(operators.map(function (isAuthenticated) { return ({
                        isAuthenticated: isAuthenticated,
                        userData: _this.userService.getUserDataFromStore(),
                        accessToken: _this.authStateService.getAccessToken(),
                    }); })); }));
            }));
        };
        return ParLoginService;
    }());
    ParLoginService.ɵfac = function ParLoginService_Factory(t) { return new (t || ParLoginService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(ResponseTypeValidationService), i0.ɵɵinject(UrlService), i0.ɵɵinject(RedirectService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(AuthWellKnownService), i0.ɵɵinject(PopUpService), i0.ɵɵinject(CheckAuthService), i0.ɵɵinject(UserService), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(ParService)); };
    ParLoginService.ɵprov = i0.ɵɵdefineInjectable({ token: ParLoginService, factory: ParLoginService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ParLoginService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }, { type: ResponseTypeValidationService }, { type: UrlService }, { type: RedirectService }, { type: ConfigurationProvider }, { type: AuthWellKnownService }, { type: PopUpService }, { type: CheckAuthService }, { type: UserService }, { type: AuthStateService }, { type: ParService }]; }, null);
    })();

    var PopUpLoginService = /** @class */ (function () {
        function PopUpLoginService(loggerService, responseTypeValidationService, urlService, configurationProvider, authWellKnownService, popupService, checkAuthService, userService, authStateService) {
            this.loggerService = loggerService;
            this.responseTypeValidationService = responseTypeValidationService;
            this.urlService = urlService;
            this.configurationProvider = configurationProvider;
            this.authWellKnownService = authWellKnownService;
            this.popupService = popupService;
            this.checkAuthService = checkAuthService;
            this.userService = userService;
            this.authStateService = authStateService;
        }
        PopUpLoginService.prototype.loginWithPopUpStandard = function (authOptions, popupOptions) {
            var _this = this;
            if (!this.responseTypeValidationService.hasConfigValidResponseType()) {
                var errorMessage = 'Invalid response type!';
                this.loggerService.logError(errorMessage);
                return rxjs.throwError(errorMessage);
            }
            var authWellknownEndpoint = this.configurationProvider.getOpenIDConfiguration().authWellknownEndpoint;
            if (!authWellknownEndpoint) {
                var errorMessage = 'no authWellknownEndpoint given!';
                this.loggerService.logError(errorMessage);
                return rxjs.throwError(errorMessage);
            }
            this.loggerService.logDebug('BEGIN Authorize OIDC Flow with popup, no auth data');
            return this.authWellKnownService.getAuthWellKnownEndPoints(authWellknownEndpoint).pipe(operators.switchMap(function () {
                var customParams = (authOptions || {}).customParams;
                var authUrl = _this.urlService.getAuthorizeUrl(customParams);
                _this.popupService.openPopUp(authUrl, popupOptions);
                return _this.popupService.result$.pipe(operators.take(1), operators.switchMap(function (result) { return result.userClosed === true
                    ? rxjs.of({ isAuthenticated: false, errorMessage: 'User closed popup' })
                    : _this.checkAuthService.checkAuth(result.receivedUrl).pipe(operators.map(function (isAuthenticated) { return ({
                        isAuthenticated: isAuthenticated,
                        userData: _this.userService.getUserDataFromStore(),
                        accessToken: _this.authStateService.getAccessToken(),
                    }); })); }));
            }));
        };
        return PopUpLoginService;
    }());
    PopUpLoginService.ɵfac = function PopUpLoginService_Factory(t) { return new (t || PopUpLoginService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(ResponseTypeValidationService), i0.ɵɵinject(UrlService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(AuthWellKnownService), i0.ɵɵinject(PopUpService), i0.ɵɵinject(CheckAuthService), i0.ɵɵinject(UserService), i0.ɵɵinject(AuthStateService)); };
    PopUpLoginService.ɵprov = i0.ɵɵdefineInjectable({ token: PopUpLoginService, factory: PopUpLoginService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(PopUpLoginService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }, { type: ResponseTypeValidationService }, { type: UrlService }, { type: ConfigurationProvider }, { type: AuthWellKnownService }, { type: PopUpService }, { type: CheckAuthService }, { type: UserService }, { type: AuthStateService }]; }, null);
    })();

    var StandardLoginService = /** @class */ (function () {
        function StandardLoginService(loggerService, responseTypeValidationService, urlService, redirectService, configurationProvider, authWellKnownService) {
            this.loggerService = loggerService;
            this.responseTypeValidationService = responseTypeValidationService;
            this.urlService = urlService;
            this.redirectService = redirectService;
            this.configurationProvider = configurationProvider;
            this.authWellKnownService = authWellKnownService;
        }
        StandardLoginService.prototype.loginStandard = function (authOptions) {
            var _this = this;
            if (!this.responseTypeValidationService.hasConfigValidResponseType()) {
                this.loggerService.logError('Invalid response type!');
                return;
            }
            var authWellknownEndpoint = this.configurationProvider.getOpenIDConfiguration().authWellknownEndpoint;
            if (!authWellknownEndpoint) {
                this.loggerService.logError('no authWellknownEndpoint given!');
                return;
            }
            this.loggerService.logDebug('BEGIN Authorize OIDC Flow, no auth data');
            this.authWellKnownService.getAuthWellKnownEndPoints(authWellknownEndpoint).subscribe(function () {
                var _a = authOptions || {}, urlHandler = _a.urlHandler, customParams = _a.customParams;
                var url = _this.urlService.getAuthorizeUrl(customParams);
                if (!url) {
                    _this.loggerService.logError('Could not create url', url);
                    return;
                }
                if (urlHandler) {
                    urlHandler(url);
                }
                else {
                    _this.redirectService.redirectTo(url);
                }
            });
        };
        return StandardLoginService;
    }());
    StandardLoginService.ɵfac = function StandardLoginService_Factory(t) { return new (t || StandardLoginService)(i0.ɵɵinject(LoggerService), i0.ɵɵinject(ResponseTypeValidationService), i0.ɵɵinject(UrlService), i0.ɵɵinject(RedirectService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(AuthWellKnownService)); };
    StandardLoginService.ɵprov = i0.ɵɵdefineInjectable({ token: StandardLoginService, factory: StandardLoginService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(StandardLoginService, [{
                type: i0.Injectable
            }], function () { return [{ type: LoggerService }, { type: ResponseTypeValidationService }, { type: UrlService }, { type: RedirectService }, { type: ConfigurationProvider }, { type: AuthWellKnownService }]; }, null);
    })();

    var LoginService = /** @class */ (function () {
        function LoginService(configurationProvider, parLoginService, popUpLoginService, standardLoginService) {
            this.configurationProvider = configurationProvider;
            this.parLoginService = parLoginService;
            this.popUpLoginService = popUpLoginService;
            this.standardLoginService = standardLoginService;
        }
        LoginService.prototype.login = function (authOptions) {
            var usePushedAuthorisationRequests = this.configurationProvider.getOpenIDConfiguration().usePushedAuthorisationRequests;
            if (usePushedAuthorisationRequests) {
                return this.parLoginService.loginPar(authOptions);
            }
            else {
                return this.standardLoginService.loginStandard(authOptions);
            }
        };
        LoginService.prototype.loginWithPopUp = function (authOptions, popupOptions) {
            var usePushedAuthorisationRequests = this.configurationProvider.getOpenIDConfiguration().usePushedAuthorisationRequests;
            if (usePushedAuthorisationRequests) {
                return this.parLoginService.loginWithPopUpPar(authOptions, popupOptions);
            }
            else {
                return this.popUpLoginService.loginWithPopUpStandard(authOptions, popupOptions);
            }
        };
        return LoginService;
    }());
    LoginService.ɵfac = function LoginService_Factory(t) { return new (t || LoginService)(i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(ParLoginService), i0.ɵɵinject(PopUpLoginService), i0.ɵɵinject(StandardLoginService)); };
    LoginService.ɵprov = i0.ɵɵdefineInjectable({ token: LoginService, factory: LoginService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(LoginService, [{
                type: i0.Injectable
            }], function () { return [{ type: ConfigurationProvider }, { type: ParLoginService }, { type: PopUpLoginService }, { type: StandardLoginService }]; }, null);
    })();

    var LogoffRevocationService = /** @class */ (function () {
        function LogoffRevocationService(dataService, storagePersistenceService, loggerService, urlService, checkSessionService, resetAuthDataService, 
        // TODO: HERE
        //private redirectService: RedirectService,
        configurationProvider) {
            this.dataService = dataService;
            this.storagePersistenceService = storagePersistenceService;
            this.loggerService = loggerService;
            this.urlService = urlService;
            this.checkSessionService = checkSessionService;
            this.resetAuthDataService = resetAuthDataService;
            this.configurationProvider = configurationProvider;
        }
        // Logs out on the server and the local client.
        // If the server state has changed, checksession, then only a local logout.
        LogoffRevocationService.prototype.logoff = function (urlHandler) {
            this.loggerService.logDebug('logoff, remove auth ');
            var endSessionUrl = this.getEndSessionUrl();
            this.resetAuthDataService.resetAuthorizationData();
            if (!endSessionUrl) {
                this.loggerService.logDebug('only local login cleaned up, no end_session_endpoint');
                return;
            }
            if (this.checkSessionService.serverStateChanged()) {
                this.loggerService.logDebug('only local login cleaned up, server session has changed');
            }
            else if (urlHandler) {
                urlHandler(endSessionUrl);
            }
            else {
                // TODO: HERE
                //this.redirectService.redirectTo(endSessionUrl);
                this.dataService.get(endSessionUrl).subscribe(function (result) {
                    console.log(result);
                }, function (error) {
                    console.log('error', error);
                });
            }
        };
        LogoffRevocationService.prototype.logoffLocal = function () {
            this.resetAuthDataService.resetAuthorizationData();
            this.checkSessionService.stop();
        };
        // The refresh token and and the access token are revoked on the server. If the refresh token does not exist
        // only the access token is revoked. Then the logout run.
        LogoffRevocationService.prototype.logoffAndRevokeTokens = function (urlHandler) {
            var _this = this;
            var _a;
            if (!((_a = this.storagePersistenceService.read('authWellKnownEndPoints')) === null || _a === void 0 ? void 0 : _a.revocationEndpoint)) {
                this.loggerService.logDebug('revocation endpoint not supported');
                this.logoff(urlHandler);
            }
            if (this.storagePersistenceService.getRefreshToken()) {
                return this.revokeRefreshToken().pipe(operators.switchMap(function (result) { return _this.revokeAccessToken(result); }), operators.catchError(function (error) {
                    var errorMessage = "revoke token failed";
                    _this.loggerService.logError(errorMessage, error);
                    return rxjs.throwError(errorMessage);
                }), operators.tap(function () { return _this.logoff(urlHandler); }));
            }
            else {
                return this.revokeAccessToken().pipe(operators.catchError(function (error) {
                    var errorMessage = "revoke access token failed";
                    _this.loggerService.logError(errorMessage, error);
                    return rxjs.throwError(errorMessage);
                }), operators.tap(function () { return _this.logoff(urlHandler); }));
            }
        };
        // https://tools.ietf.org/html/rfc7009
        // revokes an access token on the STS. If no token is provided, then the token from
        // the storage is revoked. You can pass any token to revoke. This makes it possible to
        // manage your own tokens. The is a public API.
        LogoffRevocationService.prototype.revokeAccessToken = function (accessToken) {
            var _this = this;
            var accessTok = accessToken || this.storagePersistenceService.getAccessToken();
            var body = this.urlService.createRevocationEndpointBodyAccessToken(accessTok);
            var url = this.urlService.getRevocationEndpointUrl();
            var headers = new i1.HttpHeaders();
            headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
            return this.dataService.post(url, body, headers).pipe(operators.retry(2), operators.switchMap(function (response) {
                _this.loggerService.logDebug('revocation endpoint post response: ', response);
                return rxjs.of(response);
            }), operators.catchError(function (error) {
                var errorMessage = "Revocation request failed";
                _this.loggerService.logError(errorMessage, error);
                return rxjs.throwError(errorMessage);
            }));
        };
        // https://tools.ietf.org/html/rfc7009
        // revokes an refresh token on the STS. This is only required in the code flow with refresh tokens.
        // If no token is provided, then the token from the storage is revoked. You can pass any token to revoke.
        // This makes it possible to manage your own tokens.
        LogoffRevocationService.prototype.revokeRefreshToken = function (refreshToken) {
            var _this = this;
            var refreshTok = refreshToken || this.storagePersistenceService.getRefreshToken();
            var body = this.urlService.createRevocationEndpointBodyRefreshToken(refreshTok);
            var url = this.urlService.getRevocationEndpointUrl();
            var headers = new i1.HttpHeaders();
            headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
            return this.dataService.post(url, body, headers).pipe(operators.retry(2), operators.switchMap(function (response) {
                _this.loggerService.logDebug('revocation endpoint post response: ', response);
                return rxjs.of(response);
            }), operators.catchError(function (error) {
                var errorMessage = "Revocation request failed";
                _this.loggerService.logError(errorMessage, error);
                return rxjs.throwError(errorMessage);
            }));
        };
        LogoffRevocationService.prototype.getEndSessionUrl = function (customParams) {
            var idToken = this.storagePersistenceService.getIdToken();
            var customParamsEndSession = this.configurationProvider.getOpenIDConfiguration().customParamsEndSession;
            var mergedParams = Object.assign(Object.assign({}, customParams), customParamsEndSession);
            return this.urlService.createEndSessionUrl(idToken, mergedParams);
        };
        return LogoffRevocationService;
    }());
    LogoffRevocationService.ɵfac = function LogoffRevocationService_Factory(t) { return new (t || LogoffRevocationService)(i0.ɵɵinject(DataService), i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(LoggerService), i0.ɵɵinject(UrlService), i0.ɵɵinject(CheckSessionService), i0.ɵɵinject(ResetAuthDataService), i0.ɵɵinject(ConfigurationProvider)); };
    LogoffRevocationService.ɵprov = i0.ɵɵdefineInjectable({ token: LogoffRevocationService, factory: LogoffRevocationService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(LogoffRevocationService, [{
                type: i0.Injectable
            }], function () { return [{ type: DataService }, { type: StoragePersistenceService }, { type: LoggerService }, { type: UrlService }, { type: CheckSessionService }, { type: ResetAuthDataService }, { type: ConfigurationProvider }]; }, null);
    })();

    var OidcSecurityService = /** @class */ (function () {
        function OidcSecurityService(checkSessionService, checkAuthService, userService, tokenHelperService, configurationProvider, authStateService, flowsDataService, callbackService, logoffRevocationService, loginService, storagePersistenceService, refreshSessionService) {
            this.checkSessionService = checkSessionService;
            this.checkAuthService = checkAuthService;
            this.userService = userService;
            this.tokenHelperService = tokenHelperService;
            this.configurationProvider = configurationProvider;
            this.authStateService = authStateService;
            this.flowsDataService = flowsDataService;
            this.callbackService = callbackService;
            this.logoffRevocationService = logoffRevocationService;
            this.loginService = loginService;
            this.storagePersistenceService = storagePersistenceService;
            this.refreshSessionService = refreshSessionService;
        }
        Object.defineProperty(OidcSecurityService.prototype, "configuration", {
            /**
             * Gets the currently active OpenID configuration.
             */
            get: function () {
                var openIDConfiguration = this.configurationProvider.getOpenIDConfiguration();
                return {
                    configuration: openIDConfiguration,
                    wellknown: this.storagePersistenceService.read('authWellKnownEndPoints'),
                };
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OidcSecurityService.prototype, "userData$", {
            /**
             * Provides information about the user after they have logged in.
             */
            get: function () {
                return this.userService.userData$;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OidcSecurityService.prototype, "isAuthenticated$", {
            /**
             * Emits each time an authorization event occurs. Returns true if the user is authenticated and false if they are not.
             */
            get: function () {
                return this.authStateService.authorized$;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OidcSecurityService.prototype, "checkSessionChanged$", {
            /**
             * Emits each time the server sends a CheckSession event and the value changed. This property will always return
             * true.
             */
            get: function () {
                return this.checkSessionService.checkSessionChanged$;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OidcSecurityService.prototype, "stsCallback$", {
            /**
             * Emits on possible STS callback. The observable will never contain a value.
             */
            get: function () {
                return this.callbackService.stsCallback$;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Starts the complete setup flow. Calling will start the entire authentication flow, and the returned observable
         * will denote whether the user was successfully authenticated.
         *
         * @param url The url to perform the authorization on the behalf of.
         */
        OidcSecurityService.prototype.checkAuth = function (url) {
            return this.checkAuthService.checkAuth(url);
        };
        /**
         * Checks the server for an authenticated session using the iframe silent renew if not locally authenticated.
         */
        OidcSecurityService.prototype.checkAuthIncludingServer = function () {
            return this.checkAuthService.checkAuthIncludingServer();
        };
        /**
         * Returns the access token for the login scenario.
         */
        OidcSecurityService.prototype.getToken = function () {
            return this.authStateService.getAccessToken();
        };
        /**
         * Returns the ID token for the login scenario.
         */
        OidcSecurityService.prototype.getIdToken = function () {
            return this.authStateService.getIdToken();
        };
        /**
         * Returns the refresh token, if present, for the login scenario.
         */
        OidcSecurityService.prototype.getRefreshToken = function () {
            return this.authStateService.getRefreshToken();
        };
        /**
         * Returns the payload from the ID token.
         *
         * @param encode Set to true if the payload is base64 encoded
         */
        OidcSecurityService.prototype.getPayloadFromIdToken = function (encode) {
            if (encode === void 0) { encode = false; }
            var token = this.getIdToken();
            return this.tokenHelperService.getPayloadFromToken(token, encode);
        };
        /**
         * Sets a custom state for the authorize request.
         *
         * @param state The state to set.
         */
        OidcSecurityService.prototype.setState = function (state) {
            this.flowsDataService.setAuthStateControl(state);
        };
        /**
         * Gets the state value used for the authorize request.
         */
        OidcSecurityService.prototype.getState = function () {
            return this.flowsDataService.getAuthStateControl();
        };
        /**
         * Redirects the user to the STS to begin the authentication process.
         *
         * @param authOptions The custom options for the the authentication request.
         */
        // Code Flow with PCKE or Implicit Flow
        OidcSecurityService.prototype.authorize = function (authOptions) {
            if (authOptions === null || authOptions === void 0 ? void 0 : authOptions.customParams) {
                this.storagePersistenceService.write('storageCustomRequestParams', authOptions.customParams);
            }
            this.loginService.login(authOptions);
        };
        /**
         * Opens the STS in a new window to begin the authentication process.
         *
         * @param authOptions The custom options for the authentication request.
         * @param popupOptions The configuration for the popup window.
         */
        OidcSecurityService.prototype.authorizeWithPopUp = function (authOptions, popupOptions) {
            if (authOptions === null || authOptions === void 0 ? void 0 : authOptions.customParams) {
                this.storagePersistenceService.write('storageCustomRequestParams', authOptions.customParams);
            }
            return this.loginService.loginWithPopUp(authOptions, popupOptions);
        };
        /**
         * Manually refreshes the session.
         *
         * @param customParams Custom parameters to pass to the refresh request.
         */
        OidcSecurityService.prototype.forceRefreshSession = function (customParams) {
            var useRefreshToken = this.configurationProvider.getOpenIDConfiguration().useRefreshToken;
            if (customParams) {
                if (useRefreshToken) {
                    this.storagePersistenceService.write('storageCustomParamsRefresh', customParams);
                }
                else {
                    this.storagePersistenceService.write('storageCustomRequestParams', customParams);
                }
            }
            return this.refreshSessionService.forceRefreshSession(customParams);
        };
        /**
         * Revokes the refresh token (if present) and the access token on the server and then performs the logoff operation.
         *
         * @param urlHandler An optional url handler for the logoff request.
         */
        // The refresh token and and the access token are revoked on the server. If the refresh token does not exist
        // only the access token is revoked. Then the logout run.
        OidcSecurityService.prototype.logoffAndRevokeTokens = function (urlHandler) {
            return this.logoffRevocationService.logoffAndRevokeTokens(urlHandler);
        };
        /**
         * Logs out on the server and the local client. If the server state has changed, confirmed via checksession,
         * then only a local logout is performed.
         *
         * @param urlHandler
         */
        OidcSecurityService.prototype.logoff = function (urlHandler) {
            return this.logoffRevocationService.logoff(urlHandler);
        };
        /**
         * Logs the user out of the application without logging them out of the server.
         */
        OidcSecurityService.prototype.logoffLocal = function () {
            return this.logoffRevocationService.logoffLocal();
        };
        /**
         * Revokes an access token on the STS. This is only required in the code flow with refresh tokens. If no token is
         * provided, then the token from the storage is revoked. You can pass any token to revoke.
         * https://tools.ietf.org/html/rfc7009
         *
         * @param accessToken The access token to revoke.
         */
        OidcSecurityService.prototype.revokeAccessToken = function (accessToken) {
            return this.logoffRevocationService.revokeAccessToken(accessToken);
        };
        /**
         * Revokes a refresh token on the STS. This is only required in the code flow with refresh tokens. If no token is
         * provided, then the token from the storage is revoked. You can pass any token to revoke.
         * https://tools.ietf.org/html/rfc7009
         *
         * @param refreshToken The access token to revoke.
         */
        OidcSecurityService.prototype.revokeRefreshToken = function (refreshToken) {
            return this.logoffRevocationService.revokeRefreshToken(refreshToken);
        };
        /**
         * Creates the end session URL which can be used to implement an alternate server logout.
         */
        OidcSecurityService.prototype.getEndSessionUrl = function (customParams) {
            return this.logoffRevocationService.getEndSessionUrl(customParams);
        };
        return OidcSecurityService;
    }());
    OidcSecurityService.ɵfac = function OidcSecurityService_Factory(t) { return new (t || OidcSecurityService)(i0.ɵɵinject(CheckSessionService), i0.ɵɵinject(CheckAuthService), i0.ɵɵinject(UserService), i0.ɵɵinject(TokenHelperService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(FlowsDataService), i0.ɵɵinject(CallbackService), i0.ɵɵinject(LogoffRevocationService), i0.ɵɵinject(LoginService), i0.ɵɵinject(StoragePersistenceService), i0.ɵɵinject(RefreshSessionService)); };
    OidcSecurityService.ɵprov = i0.ɵɵdefineInjectable({ token: OidcSecurityService, factory: OidcSecurityService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(OidcSecurityService, [{
                type: i0.Injectable
            }], function () { return [{ type: CheckSessionService }, { type: CheckAuthService }, { type: UserService }, { type: TokenHelperService }, { type: ConfigurationProvider }, { type: AuthStateService }, { type: FlowsDataService }, { type: CallbackService }, { type: LogoffRevocationService }, { type: LoginService }, { type: StoragePersistenceService }, { type: RefreshSessionService }]; }, null);
    })();

    var BrowserStorageService = /** @class */ (function () {
        function BrowserStorageService(configProvider, loggerService) {
            this.configProvider = configProvider;
            this.loggerService = loggerService;
        }
        BrowserStorageService.prototype.read = function (key) {
            var _a;
            if (!this.hasStorage()) {
                this.loggerService.logDebug("Wanted to read '" + key + "' but Storage was undefined");
                return false;
            }
            var item = (_a = this.getStorage()) === null || _a === void 0 ? void 0 : _a.getItem(key);
            if (!item) {
                this.loggerService.logDebug("Wanted to read '" + key + "' but nothing was found");
                return null;
            }
            return JSON.parse(item);
        };
        BrowserStorageService.prototype.write = function (key, value) {
            if (!this.hasStorage()) {
                this.loggerService.logDebug("Wanted to write '" + key + "/" + value + "' but Storage was falsy");
                return false;
            }
            var storage = this.getStorage();
            if (!storage) {
                this.loggerService.logDebug("Wanted to write '" + key + "/" + value + "' but Storage was falsy");
                return false;
            }
            value = value || null;
            storage.setItem("" + key, JSON.stringify(value));
            return true;
        };
        BrowserStorageService.prototype.remove = function (key) {
            if (!this.hasStorage()) {
                this.loggerService.logDebug("Wanted to remove '" + key + "' but Storage was falsy");
                return false;
            }
            var storage = this.getStorage();
            if (!storage) {
                this.loggerService.logDebug("Wanted to write '" + key + "' but Storage was falsy");
                return false;
            }
            storage.removeItem("" + key);
            return true;
        };
        BrowserStorageService.prototype.getStorage = function () {
            var config = this.configProvider.getOpenIDConfiguration();
            if (!config) {
                return null;
            }
            return config.storage;
        };
        BrowserStorageService.prototype.hasStorage = function () {
            return typeof Storage !== 'undefined';
        };
        return BrowserStorageService;
    }());
    BrowserStorageService.ɵfac = function BrowserStorageService_Factory(t) { return new (t || BrowserStorageService)(i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(LoggerService)); };
    BrowserStorageService.ɵprov = i0.ɵɵdefineInjectable({ token: BrowserStorageService, factory: BrowserStorageService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(BrowserStorageService, [{
                type: i0.Injectable
            }], function () { return [{ type: ConfigurationProvider }, { type: LoggerService }]; }, null);
    })();

    var AuthModule = /** @class */ (function () {
        function AuthModule() {
        }
        AuthModule.forRoot = function (token) {
            if (token === void 0) { token = {}; }
            return {
                ngModule: AuthModule,
                providers: [
                    OidcConfigService,
                    PublicEventsService,
                    FlowHelper,
                    OidcSecurityService,
                    TokenValidationService,
                    PlatformProvider,
                    CheckSessionService,
                    FlowsDataService,
                    FlowsService,
                    SilentRenewService,
                    ConfigurationProvider,
                    LogoffRevocationService,
                    UserService,
                    RandomService,
                    HttpBaseService,
                    UrlService,
                    AuthStateService,
                    SigninKeyDataService,
                    StoragePersistenceService,
                    TokenHelperService,
                    LoggerService,
                    IFrameService,
                    EqualityService,
                    LoginService,
                    ParService,
                    AuthWellKnownDataService,
                    AuthWellKnownService,
                    DataService,
                    StateValidationService,
                    ConfigValidationService,
                    CheckAuthService,
                    ResetAuthDataService,
                    ImplicitFlowCallbackService,
                    HistoryJwtKeysCallbackHandlerService,
                    ResponseTypeValidationService,
                    UserCallbackHandlerService,
                    StateValidationCallbackHandlerService,
                    RefreshSessionCallbackHandlerService,
                    RefreshTokenCallbackHandlerService,
                    CodeFlowCallbackHandlerService,
                    ImplicitFlowCallbackHandlerService,
                    ParLoginService,
                    PopUpLoginService,
                    StandardLoginService,
                    AutoLoginService,
                    {
                        provide: AbstractSecurityStorage,
                        useClass: token.storage || BrowserStorageService,
                    },
                ],
            };
        };
        return AuthModule;
    }());
    AuthModule.ɵmod = i0.ɵɵdefineNgModule({ type: AuthModule });
    AuthModule.ɵinj = i0.ɵɵdefineInjector({ factory: function AuthModule_Factory(t) { return new (t || AuthModule)(); }, imports: [[common.CommonModule, i1.HttpClientModule]] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AuthModule, { imports: [common.CommonModule, i1.HttpClientModule] }); })();
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AuthModule, [{
                type: i0.NgModule,
                args: [{
                        imports: [common.CommonModule, i1.HttpClientModule],
                        declarations: [],
                        exports: [],
                    }]
            }], null, null);
    })();

    var AutoLoginGuard = /** @class */ (function () {
        function AutoLoginGuard(autoLoginService, authStateService, checkAuthService, loginService, router) {
            this.autoLoginService = autoLoginService;
            this.authStateService = authStateService;
            this.checkAuthService = checkAuthService;
            this.loginService = loginService;
            this.router = router;
        }
        AutoLoginGuard.prototype.canLoad = function (route, segments) {
            var routeToRedirect = segments.join('/');
            return this.checkAuth(routeToRedirect);
        };
        AutoLoginGuard.prototype.canActivate = function (route, state) {
            return this.checkAuth(state.url);
        };
        AutoLoginGuard.prototype.checkAuth = function (url) {
            var _this = this;
            var isAuthenticated = this.authStateService.areAuthStorageTokensValid();
            if (isAuthenticated) {
                return rxjs.of(true);
            }
            return this.checkAuthService.checkAuth().pipe(operators.map(function (isAuthorized) {
                var storedRoute = _this.autoLoginService.getStoredRedirectRoute();
                if (isAuthorized) {
                    if (storedRoute) {
                        _this.autoLoginService.deleteStoredRedirectRoute();
                        _this.router.navigateByUrl(storedRoute);
                    }
                    return true;
                }
                _this.autoLoginService.saveStoredRedirectRoute(url);
                _this.loginService.login();
                return false;
            }));
        };
        return AutoLoginGuard;
    }());
    AutoLoginGuard.ɵfac = function AutoLoginGuard_Factory(t) { return new (t || AutoLoginGuard)(i0.ɵɵinject(AutoLoginService), i0.ɵɵinject(AuthStateService), i0.ɵɵinject(CheckAuthService), i0.ɵɵinject(LoginService), i0.ɵɵinject(i5.Router)); };
    AutoLoginGuard.ɵprov = i0.ɵɵdefineInjectable({ token: AutoLoginGuard, factory: AutoLoginGuard.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AutoLoginGuard, [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], function () { return [{ type: AutoLoginService }, { type: AuthStateService }, { type: CheckAuthService }, { type: LoginService }, { type: i5.Router }]; }, null);
    })();

    var AuthInterceptor = /** @class */ (function () {
        function AuthInterceptor(authStateService, configurationProvider, loggerService) {
            this.authStateService = authStateService;
            this.configurationProvider = configurationProvider;
            this.loggerService = loggerService;
        }
        AuthInterceptor.prototype.intercept = function (req, next) {
            // Ensure we send the token only to routes which are secured
            var secureRoutes = this.configurationProvider.getOpenIDConfiguration().secureRoutes;
            if (!secureRoutes) {
                this.loggerService.logDebug("No routes to check configured");
                return next.handle(req);
            }
            var matchingRoute = secureRoutes.find(function (x) { return req.url.startsWith(x); });
            if (!matchingRoute) {
                this.loggerService.logDebug("Did not find matching route for " + req.url);
                return next.handle(req);
            }
            this.loggerService.logDebug("'" + req.url + "' matches configured route '" + matchingRoute + "'");
            var token = this.authStateService.getAccessToken();
            if (!token) {
                this.loggerService.logDebug("Wanted to add token to " + req.url + " but found no token: '" + token + "'");
                return next.handle(req);
            }
            this.loggerService.logDebug("'" + req.url + "' matches configured route '" + matchingRoute + "', adding token");
            req = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token),
            });
            return next.handle(req);
        };
        return AuthInterceptor;
    }());
    AuthInterceptor.ɵfac = function AuthInterceptor_Factory(t) { return new (t || AuthInterceptor)(i0.ɵɵinject(AuthStateService), i0.ɵɵinject(ConfigurationProvider), i0.ɵɵinject(LoggerService)); };
    AuthInterceptor.ɵprov = i0.ɵɵdefineInjectable({ token: AuthInterceptor, factory: AuthInterceptor.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AuthInterceptor, [{
                type: i0.Injectable
            }], function () { return [{ type: AuthStateService }, { type: ConfigurationProvider }, { type: LoggerService }]; }, null);
    })();

    // Public classes.

    /*
     * Public API Surface of angular-auth-oidc-client
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.AbstractSecurityStorage = AbstractSecurityStorage;
    exports.AuthInterceptor = AuthInterceptor;
    exports.AuthModule = AuthModule;
    exports.AutoLoginGuard = AutoLoginGuard;
    exports.LoggerService = LoggerService;
    exports.OidcConfigService = OidcConfigService;
    exports.OidcSecurityService = OidcSecurityService;
    exports.PublicEventsService = PublicEventsService;
    exports.StateValidationResult = StateValidationResult;
    exports.TokenHelperService = TokenHelperService;
    exports.TokenValidationService = TokenValidationService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-auth-oidc-client.umd.js.map
