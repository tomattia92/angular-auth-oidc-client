import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { oneLineTrim } from 'common-tags';
import { UriEncoder } from './uri-encoder';
import * as i0 from "@angular/core";
import * as i1 from "../../config/config.provider";
import * as i2 from "../../logging/logger.service";
import * as i3 from "../../flows/flows-data.service";
import * as i4 from "../flowHelper/flow-helper.service";
import * as i5 from "../../validation/token-validation.service";
import * as i6 from "../../storage/storage-persistence.service";
const CALLBACK_PARAMS_TO_CHECK = ['code', 'state', 'token', 'id_token'];
export class UrlService {
    constructor(configurationProvider, loggerService, flowsDataService, flowHelper, tokenValidationService, storagePersistenceService) {
        this.configurationProvider = configurationProvider;
        this.loggerService = loggerService;
        this.flowsDataService = flowsDataService;
        this.flowHelper = flowHelper;
        this.tokenValidationService = tokenValidationService;
        this.storagePersistenceService = storagePersistenceService;
    }
    getUrlParameter(urlToCheck, name) {
        if (!urlToCheck) {
            return '';
        }
        if (!name) {
            return '';
        }
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(urlToCheck);
        return results === null ? '' : decodeURIComponent(results[1]);
    }
    isCallbackFromSts(currentUrl) {
        return CALLBACK_PARAMS_TO_CHECK.some((x) => !!this.getUrlParameter(currentUrl, x));
    }
    getRefreshSessionSilentRenewUrl(customParams) {
        if (this.flowHelper.isCurrentFlowCodeFlow()) {
            return this.createUrlCodeFlowWithSilentRenew(customParams);
        }
        return this.createUrlImplicitFlowWithSilentRenew(customParams) || '';
    }
    getAuthorizeParUrl(requestUri) {
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        if (!authWellKnownEndPoints) {
            this.loggerService.logError('authWellKnownEndpoints is undefined');
            return null;
        }
        const authorizationEndpoint = authWellKnownEndPoints.authorizationEndpoint;
        if (!authorizationEndpoint) {
            this.loggerService.logError(`Can not create an authorize url when authorizationEndpoint is '${authorizationEndpoint}'`);
            return null;
        }
        const { clientId } = this.configurationProvider.getOpenIDConfiguration();
        if (!clientId) {
            this.loggerService.logError(`createAuthorizeUrl could not add clientId because it was: `, clientId);
            return null;
        }
        const urlParts = authorizationEndpoint.split('?');
        const authorizationUrl = urlParts[0];
        let params = new HttpParams({
            fromString: urlParts[1],
            encoder: new UriEncoder(),
        });
        params = params.set('request_uri', requestUri);
        params = params.append('client_id', clientId);
        return `${authorizationUrl}?${params}`;
    }
    getAuthorizeUrl(customParams) {
        if (this.flowHelper.isCurrentFlowCodeFlow()) {
            return this.createUrlCodeFlowAuthorize(customParams);
        }
        return this.createUrlImplicitFlowAuthorize(customParams) || '';
    }
    createEndSessionUrl(idTokenHint, customParamsEndSession) {
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        const endSessionEndpoint = authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.endSessionEndpoint;
        if (!endSessionEndpoint) {
            return null;
        }
        const urlParts = endSessionEndpoint.split('?');
        const authorizationEndsessionUrl = urlParts[0];
        let params = new HttpParams({
            fromString: urlParts[1],
            encoder: new UriEncoder(),
        });
        params = params.set('id_token_hint', idTokenHint);
        if (customParamsEndSession) {
            for (const [key, value] of Object.entries(Object.assign({}, customParamsEndSession))) {
                params = params.append(key, value.toString());
            }
        }
        const postLogoutRedirectUri = this.getPostLogoutRedirectUrl();
        if (postLogoutRedirectUri) {
            params = params.append('post_logout_redirect_uri', postLogoutRedirectUri);
        }
        return `${authorizationEndsessionUrl}?${params}`;
    }
    createRevocationEndpointBodyAccessToken(token) {
        const clientId = this.getClientId();
        if (!clientId) {
            return null;
        }
        return `client_id=${clientId}&token=${token}&token_type_hint=access_token`;
    }
    createRevocationEndpointBodyRefreshToken(token) {
        const clientId = this.getClientId();
        if (!clientId) {
            return null;
        }
        return `client_id=${clientId}&token=${token}&token_type_hint=refresh_token`;
    }
    getRevocationEndpointUrl() {
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        const revocationEndpoint = authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.revocationEndpoint;
        if (!revocationEndpoint) {
            return null;
        }
        const urlParts = revocationEndpoint.split('?');
        const revocationEndpointUrl = urlParts[0];
        return revocationEndpointUrl;
    }
    createBodyForCodeFlowCodeRequest(code, customTokenParams) {
        const codeVerifier = this.flowsDataService.getCodeVerifier();
        if (!codeVerifier) {
            this.loggerService.logError(`CodeVerifier is not set `, codeVerifier);
            return null;
        }
        const clientId = this.getClientId();
        if (!clientId) {
            return null;
        }
        let dataForBody = oneLineTrim `grant_type=authorization_code
            &client_id=${clientId}
            &code_verifier=${codeVerifier}
            &code=${code}`;
        if (customTokenParams) {
            const customParamText = this.composeCustomParams(Object.assign({}, customTokenParams));
            dataForBody = oneLineTrim `${dataForBody}${customParamText}`;
        }
        const silentRenewUrl = this.getSilentRenewUrl();
        if (this.flowsDataService.isSilentRenewRunning() && silentRenewUrl) {
            return oneLineTrim `${dataForBody}&redirect_uri=${silentRenewUrl}`;
        }
        const redirectUrl = this.getRedirectUrl();
        if (!redirectUrl) {
            return null;
        }
        return oneLineTrim `${dataForBody}&redirect_uri=${redirectUrl}`;
    }
    createBodyForCodeFlowRefreshTokensRequest(refreshToken, customParamsRefresh) {
        const clientId = this.getClientId();
        if (!clientId) {
            return null;
        }
        let dataForBody = oneLineTrim `grant_type=refresh_token
            &client_id=${clientId}
            &refresh_token=${refreshToken}`;
        if (customParamsRefresh) {
            const customParamText = this.composeCustomParams(Object.assign({}, customParamsRefresh));
            dataForBody = `${dataForBody}${customParamText}`;
        }
        return dataForBody;
    }
    createBodyForParCodeFlowRequest(customParamsRequest) {
        const redirectUrl = this.getRedirectUrl();
        if (!redirectUrl) {
            return null;
        }
        const state = this.flowsDataService.getExistingOrCreateAuthStateControl();
        const nonce = this.flowsDataService.createNonce();
        this.loggerService.logDebug('Authorize created. adding myautostate: ' + state);
        // code_challenge with "S256"
        const codeVerifier = this.flowsDataService.createCodeVerifier();
        const codeChallenge = this.tokenValidationService.generateCodeChallenge(codeVerifier);
        const { clientId, responseType, scope, hdParam, customParams } = this.configurationProvider.getOpenIDConfiguration();
        let dataForBody = oneLineTrim `client_id=${clientId}
            &redirect_uri=${redirectUrl}
            &response_type=${responseType}
            &scope=${scope}
            &nonce=${nonce}
            &state=${state}
            &code_challenge=${codeChallenge}
            &code_challenge_method=S256`;
        if (hdParam) {
            dataForBody = `${dataForBody}&hd=${hdParam}`;
        }
        if (customParams) {
            const customParamText = this.composeCustomParams(Object.assign({}, customParams));
            dataForBody = `${dataForBody}${customParamText}`;
        }
        if (customParamsRequest) {
            const customParamText = this.composeCustomParams(Object.assign({}, customParamsRequest));
            dataForBody = `${dataForBody}${customParamText}`;
        }
        return dataForBody;
    }
    createAuthorizeUrl(codeChallenge, redirectUrl, nonce, state, prompt, customRequestParams) {
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        const authorizationEndpoint = authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.authorizationEndpoint;
        if (!authorizationEndpoint) {
            this.loggerService.logError(`Can not create an authorize url when authorizationEndpoint is '${authorizationEndpoint}'`);
            return null;
        }
        const { clientId, responseType, scope, hdParam, customParams } = this.configurationProvider.getOpenIDConfiguration();
        if (!clientId) {
            this.loggerService.logError(`createAuthorizeUrl could not add clientId because it was: `, clientId);
            return null;
        }
        if (!responseType) {
            this.loggerService.logError(`createAuthorizeUrl could not add responseType because it was: `, responseType);
            return null;
        }
        if (!scope) {
            this.loggerService.logError(`createAuthorizeUrl could not add scope because it was: `, scope);
            return null;
        }
        const urlParts = authorizationEndpoint.split('?');
        const authorizationUrl = urlParts[0];
        let params = new HttpParams({
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
            for (const [key, value] of Object.entries(Object.assign({}, customParams))) {
                params = params.append(key, value.toString());
            }
        }
        if (customRequestParams) {
            for (const [key, value] of Object.entries(Object.assign({}, customRequestParams))) {
                params = params.append(key, value.toString());
            }
        }
        return `${authorizationUrl}?${params}`;
    }
    createUrlImplicitFlowWithSilentRenew(customParams) {
        const state = this.flowsDataService.getExistingOrCreateAuthStateControl();
        const nonce = this.flowsDataService.createNonce();
        const silentRenewUrl = this.getSilentRenewUrl();
        if (!silentRenewUrl) {
            return null;
        }
        this.loggerService.logDebug('RefreshSession created. adding myautostate: ', state);
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        if (authWellKnownEndPoints) {
            return this.createAuthorizeUrl('', silentRenewUrl, nonce, state, 'none', customParams);
        }
        this.loggerService.logError('authWellKnownEndpoints is undefined');
        return null;
    }
    createUrlCodeFlowWithSilentRenew(customParams) {
        const state = this.flowsDataService.getExistingOrCreateAuthStateControl();
        const nonce = this.flowsDataService.createNonce();
        this.loggerService.logDebug('RefreshSession created. adding myautostate: ' + state);
        // code_challenge with "S256"
        const codeVerifier = this.flowsDataService.createCodeVerifier();
        const codeChallenge = this.tokenValidationService.generateCodeChallenge(codeVerifier);
        const silentRenewUrl = this.getSilentRenewUrl();
        if (!silentRenewUrl) {
            return null;
        }
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        if (authWellKnownEndPoints) {
            return this.createAuthorizeUrl(codeChallenge, silentRenewUrl, nonce, state, 'none', customParams);
        }
        this.loggerService.logWarning('authWellKnownEndpoints is undefined');
        return null;
    }
    createUrlImplicitFlowAuthorize(customParams) {
        const state = this.flowsDataService.getExistingOrCreateAuthStateControl();
        const nonce = this.flowsDataService.createNonce();
        this.loggerService.logDebug('Authorize created. adding myautostate: ' + state);
        const redirectUrl = this.getRedirectUrl();
        if (!redirectUrl) {
            return null;
        }
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        if (authWellKnownEndPoints) {
            return this.createAuthorizeUrl('', redirectUrl, nonce, state, null, customParams);
        }
        this.loggerService.logError('authWellKnownEndpoints is undefined');
        return null;
    }
    createUrlCodeFlowAuthorize(customParams) {
        const state = this.flowsDataService.getExistingOrCreateAuthStateControl();
        const nonce = this.flowsDataService.createNonce();
        this.loggerService.logDebug('Authorize created. adding myautostate: ' + state);
        const redirectUrl = this.getRedirectUrl();
        if (!redirectUrl) {
            return null;
        }
        // code_challenge with "S256"
        const codeVerifier = this.flowsDataService.createCodeVerifier();
        const codeChallenge = this.tokenValidationService.generateCodeChallenge(codeVerifier);
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        if (authWellKnownEndPoints) {
            return this.createAuthorizeUrl(codeChallenge, redirectUrl, nonce, state, null, customParams);
        }
        this.loggerService.logError('authWellKnownEndpoints is undefined');
        return null;
    }
    getRedirectUrl() {
        const { redirectUrl } = this.configurationProvider.getOpenIDConfiguration();
        if (!redirectUrl) {
            this.loggerService.logError(`could not get redirectUrl, was: `, redirectUrl);
            return null;
        }
        return redirectUrl;
    }
    getSilentRenewUrl() {
        const { silentRenewUrl } = this.configurationProvider.getOpenIDConfiguration();
        if (!silentRenewUrl) {
            this.loggerService.logError(`could not get silentRenewUrl, was: `, silentRenewUrl);
            return null;
        }
        return silentRenewUrl;
    }
    getPostLogoutRedirectUrl() {
        const { postLogoutRedirectUri } = this.configurationProvider.getOpenIDConfiguration();
        if (!postLogoutRedirectUri) {
            this.loggerService.logError(`could not get postLogoutRedirectUri, was: `, postLogoutRedirectUri);
            return null;
        }
        return postLogoutRedirectUri;
    }
    getClientId() {
        const { clientId } = this.configurationProvider.getOpenIDConfiguration();
        if (!clientId) {
            this.loggerService.logError(`could not get clientId, was: `, clientId);
            return null;
        }
        return clientId;
    }
    composeCustomParams(customParams) {
        let customParamText = '';
        for (const [key, value] of Object.entries(customParams)) {
            customParamText = customParamText.concat(`&${key}=${value.toString()}`);
        }
        return customParamText;
    }
}
UrlService.ɵfac = function UrlService_Factory(t) { return new (t || UrlService)(i0.ɵɵinject(i1.ConfigurationProvider), i0.ɵɵinject(i2.LoggerService), i0.ɵɵinject(i3.FlowsDataService), i0.ɵɵinject(i4.FlowHelper), i0.ɵɵinject(i5.TokenValidationService), i0.ɵɵinject(i6.StoragePersistenceService)); };
UrlService.ɵprov = i0.ɵɵdefineInjectable({ token: UrlService, factory: UrlService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(UrlService, [{
        type: Injectable
    }], function () { return [{ type: i1.ConfigurationProvider }, { type: i2.LoggerService }, { type: i3.FlowsDataService }, { type: i4.FlowHelper }, { type: i5.TokenValidationService }, { type: i6.StoragePersistenceService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi91dGlscy91cmwvdXJsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQU8xQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7OztBQUUzQyxNQUFNLHdCQUF3QixHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFFeEUsTUFBTSxPQUFPLFVBQVU7SUFDckIsWUFDbUIscUJBQTRDLEVBQzVDLGFBQTRCLEVBQzVCLGdCQUFrQyxFQUNsQyxVQUFzQixFQUMvQixzQkFBOEMsRUFDOUMseUJBQW9EO1FBTDNDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQy9CLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFDOUMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtJQUMzRCxDQUFDO0lBRUosZUFBZSxDQUFDLFVBQWUsRUFBRSxJQUFTO1FBQ3hDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FB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b21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBvbmVMaW5lVHJpbSB9IGZyb20gJ2NvbW1vbi10YWdzJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uLy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgRmxvd3NEYXRhU2VydmljZSB9IGZyb20gJy4uLy4uL2Zsb3dzL2Zsb3dzLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgVG9rZW5WYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24vdG9rZW4tdmFsaWRhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEZsb3dIZWxwZXIgfSBmcm9tICcuLi9mbG93SGVscGVyL2Zsb3ctaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXJpRW5jb2RlciB9IGZyb20gJy4vdXJpLWVuY29kZXInO1xuXG5jb25zdCBDQUxMQkFDS19QQVJBTVNfVE9fQ0hFQ0sgPSBbJ2NvZGUnLCAnc3RhdGUnLCAndG9rZW4nLCAnaWRfdG9rZW4nXTtcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBVcmxTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbG93c0RhdGFTZXJ2aWNlOiBGbG93c0RhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmxvd0hlbHBlcjogRmxvd0hlbHBlcixcbiAgICBwcml2YXRlIHRva2VuVmFsaWRhdGlvblNlcnZpY2U6IFRva2VuVmFsaWRhdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlXG4gICkge31cblxuICBnZXRVcmxQYXJhbWV0ZXIodXJsVG9DaGVjazogYW55LCBuYW1lOiBhbnkpOiBzdHJpbmcge1xuICAgIGlmICghdXJsVG9DaGVjaykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGlmICghbmFtZSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtdLywgJ1xcXFxbJykucmVwbGFjZSgvW1xcXV0vLCAnXFxcXF0nKTtcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoJ1tcXFxcPyZdJyArIG5hbWUgKyAnPShbXiYjXSopJyk7XG4gICAgY29uc3QgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsVG9DaGVjayk7XG4gICAgcmV0dXJuIHJlc3VsdHMgPT09IG51bGwgPyAnJyA6IGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzFdKTtcbiAgfVxuXG4gIGlzQ2FsbGJhY2tGcm9tU3RzKGN1cnJlbnRVcmw6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBDQUxMQkFDS19QQVJBTVNfVE9fQ0hFQ0suc29tZSgoeCkgPT4gISF0aGlzLmdldFVybFBhcmFtZXRlcihjdXJyZW50VXJsLCB4KSk7XG4gIH1cblxuICBnZXRSZWZyZXNoU2Vzc2lvblNpbGVudFJlbmV3VXJsKGN1c3RvbVBhcmFtcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dDb2RlRmxvdygpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVVcmxDb2RlRmxvd1dpdGhTaWxlbnRSZW5ldyhjdXN0b21QYXJhbXMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNyZWF0ZVVybEltcGxpY2l0Rmxvd1dpdGhTaWxlbnRSZW5ldyhjdXN0b21QYXJhbXMpIHx8ICcnO1xuICB9XG5cbiAgZ2V0QXV0aG9yaXplUGFyVXJsKHJlcXVlc3RVcmk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgYXV0aFdlbGxLbm93bkVuZFBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG5cbiAgICBpZiAoIWF1dGhXZWxsS25vd25FbmRQb2ludHMpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGF1dGhvcml6YXRpb25FbmRwb2ludCA9IGF1dGhXZWxsS25vd25FbmRQb2ludHMuYXV0aG9yaXphdGlvbkVuZHBvaW50O1xuXG4gICAgaWYgKCFhdXRob3JpemF0aW9uRW5kcG9pbnQpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihgQ2FuIG5vdCBjcmVhdGUgYW4gYXV0aG9yaXplIHVybCB3aGVuIGF1dGhvcml6YXRpb25FbmRwb2ludCBpcyAnJHthdXRob3JpemF0aW9uRW5kcG9pbnR9J2ApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgeyBjbGllbnRJZCB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgaWYgKCFjbGllbnRJZCkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGBjcmVhdGVBdXRob3JpemVVcmwgY291bGQgbm90IGFkZCBjbGllbnRJZCBiZWNhdXNlIGl0IHdhczogYCwgY2xpZW50SWQpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdXJsUGFydHMgPSBhdXRob3JpemF0aW9uRW5kcG9pbnQuc3BsaXQoJz8nKTtcbiAgICBjb25zdCBhdXRob3JpemF0aW9uVXJsID0gdXJsUGFydHNbMF07XG5cbiAgICBsZXQgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMoe1xuICAgICAgZnJvbVN0cmluZzogdXJsUGFydHNbMV0sXG4gICAgICBlbmNvZGVyOiBuZXcgVXJpRW5jb2RlcigpLFxuICAgIH0pO1xuXG4gICAgcGFyYW1zID0gcGFyYW1zLnNldCgncmVxdWVzdF91cmknLCByZXF1ZXN0VXJpKTtcbiAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdjbGllbnRfaWQnLCBjbGllbnRJZCk7XG5cbiAgICByZXR1cm4gYCR7YXV0aG9yaXphdGlvblVybH0/JHtwYXJhbXN9YDtcbiAgfVxuXG4gIGdldEF1dGhvcml6ZVVybChjdXN0b21QYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZmxvd0hlbHBlci5pc0N1cnJlbnRGbG93Q29kZUZsb3coKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlVXJsQ29kZUZsb3dBdXRob3JpemUoY3VzdG9tUGFyYW1zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jcmVhdGVVcmxJbXBsaWNpdEZsb3dBdXRob3JpemUoY3VzdG9tUGFyYW1zKSB8fCAnJztcbiAgfVxuXG4gIGNyZWF0ZUVuZFNlc3Npb25VcmwoaWRUb2tlbkhpbnQ6IHN0cmluZywgY3VzdG9tUGFyYW1zRW5kU2Vzc2lvbj86IHsgW3A6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgY29uc3QgYXV0aFdlbGxLbm93bkVuZFBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG4gICAgY29uc3QgZW5kU2Vzc2lvbkVuZHBvaW50ID0gYXV0aFdlbGxLbm93bkVuZFBvaW50cz8uZW5kU2Vzc2lvbkVuZHBvaW50O1xuXG4gICAgaWYgKCFlbmRTZXNzaW9uRW5kcG9pbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHVybFBhcnRzID0gZW5kU2Vzc2lvbkVuZHBvaW50LnNwbGl0KCc/Jyk7XG5cbiAgICBjb25zdCBhdXRob3JpemF0aW9uRW5kc2Vzc2lvblVybCA9IHVybFBhcnRzWzBdO1xuXG4gICAgbGV0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKHtcbiAgICAgIGZyb21TdHJpbmc6IHVybFBhcnRzWzFdLFxuICAgICAgZW5jb2RlcjogbmV3IFVyaUVuY29kZXIoKSxcbiAgICB9KTtcbiAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KCdpZF90b2tlbl9oaW50JywgaWRUb2tlbkhpbnQpO1xuXG4gICAgaWYgKGN1c3RvbVBhcmFtc0VuZFNlc3Npb24pIHtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHsgLi4uY3VzdG9tUGFyYW1zRW5kU2Vzc2lvbiB9KSkge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKGtleSwgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcG9zdExvZ291dFJlZGlyZWN0VXJpID0gdGhpcy5nZXRQb3N0TG9nb3V0UmVkaXJlY3RVcmwoKTtcblxuICAgIGlmIChwb3N0TG9nb3V0UmVkaXJlY3RVcmkpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3Bvc3RfbG9nb3V0X3JlZGlyZWN0X3VyaScsIHBvc3RMb2dvdXRSZWRpcmVjdFVyaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke2F1dGhvcml6YXRpb25FbmRzZXNzaW9uVXJsfT8ke3BhcmFtc31gO1xuICB9XG5cbiAgY3JlYXRlUmV2b2NhdGlvbkVuZHBvaW50Qm9keUFjY2Vzc1Rva2VuKHRva2VuOiBhbnkpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNsaWVudElkID0gdGhpcy5nZXRDbGllbnRJZCgpO1xuXG4gICAgaWYgKCFjbGllbnRJZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBjbGllbnRfaWQ9JHtjbGllbnRJZH0mdG9rZW49JHt0b2tlbn0mdG9rZW5fdHlwZV9oaW50PWFjY2Vzc190b2tlbmA7XG4gIH1cblxuICBjcmVhdGVSZXZvY2F0aW9uRW5kcG9pbnRCb2R5UmVmcmVzaFRva2VuKHRva2VuOiBhbnkpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNsaWVudElkID0gdGhpcy5nZXRDbGllbnRJZCgpO1xuXG4gICAgaWYgKCFjbGllbnRJZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBjbGllbnRfaWQ9JHtjbGllbnRJZH0mdG9rZW49JHt0b2tlbn0mdG9rZW5fdHlwZV9oaW50PXJlZnJlc2hfdG9rZW5gO1xuICB9XG5cbiAgZ2V0UmV2b2NhdGlvbkVuZHBvaW50VXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgYXV0aFdlbGxLbm93bkVuZFBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG4gICAgY29uc3QgcmV2b2NhdGlvbkVuZHBvaW50ID0gYXV0aFdlbGxLbm93bkVuZFBvaW50cz8ucmV2b2NhdGlvbkVuZHBvaW50O1xuXG4gICAgaWYgKCFyZXZvY2F0aW9uRW5kcG9pbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHVybFBhcnRzID0gcmV2b2NhdGlvbkVuZHBvaW50LnNwbGl0KCc/Jyk7XG5cbiAgICBjb25zdCByZXZvY2F0aW9uRW5kcG9pbnRVcmwgPSB1cmxQYXJ0c1swXTtcbiAgICByZXR1cm4gcmV2b2NhdGlvbkVuZHBvaW50VXJsO1xuICB9XG5cbiAgY3JlYXRlQm9keUZvckNvZGVGbG93Q29kZVJlcXVlc3QoY29kZTogc3RyaW5nLCBjdXN0b21Ub2tlblBhcmFtcz86IHsgW3A6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgY29uc3QgY29kZVZlcmlmaWVyID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmdldENvZGVWZXJpZmllcigpO1xuICAgIGlmICghY29kZVZlcmlmaWVyKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYENvZGVWZXJpZmllciBpcyBub3Qgc2V0IGAsIGNvZGVWZXJpZmllcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjbGllbnRJZCA9IHRoaXMuZ2V0Q2xpZW50SWQoKTtcblxuICAgIGlmICghY2xpZW50SWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBkYXRhRm9yQm9keSA9IG9uZUxpbmVUcmltYGdyYW50X3R5cGU9YXV0aG9yaXphdGlvbl9jb2RlXG4gICAgICAgICAgICAmY2xpZW50X2lkPSR7Y2xpZW50SWR9XG4gICAgICAgICAgICAmY29kZV92ZXJpZmllcj0ke2NvZGVWZXJpZmllcn1cbiAgICAgICAgICAgICZjb2RlPSR7Y29kZX1gO1xuXG4gICAgaWYgKGN1c3RvbVRva2VuUGFyYW1zKSB7XG4gICAgICBjb25zdCBjdXN0b21QYXJhbVRleHQgPSB0aGlzLmNvbXBvc2VDdXN0b21QYXJhbXMoeyAuLi5jdXN0b21Ub2tlblBhcmFtcyB9KTtcbiAgICAgIGRhdGFGb3JCb2R5ID0gb25lTGluZVRyaW1gJHtkYXRhRm9yQm9keX0ke2N1c3RvbVBhcmFtVGV4dH1gO1xuICAgIH1cblxuICAgIGNvbnN0IHNpbGVudFJlbmV3VXJsID0gdGhpcy5nZXRTaWxlbnRSZW5ld1VybCgpO1xuXG4gICAgaWYgKHRoaXMuZmxvd3NEYXRhU2VydmljZS5pc1NpbGVudFJlbmV3UnVubmluZygpICYmIHNpbGVudFJlbmV3VXJsKSB7XG4gICAgICByZXR1cm4gb25lTGluZVRyaW1gJHtkYXRhRm9yQm9keX0mcmVkaXJlY3RfdXJpPSR7c2lsZW50UmVuZXdVcmx9YDtcbiAgICB9XG5cbiAgICBjb25zdCByZWRpcmVjdFVybCA9IHRoaXMuZ2V0UmVkaXJlY3RVcmwoKTtcblxuICAgIGlmICghcmVkaXJlY3RVcmwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBvbmVMaW5lVHJpbWAke2RhdGFGb3JCb2R5fSZyZWRpcmVjdF91cmk9JHtyZWRpcmVjdFVybH1gO1xuICB9XG5cbiAgY3JlYXRlQm9keUZvckNvZGVGbG93UmVmcmVzaFRva2Vuc1JlcXVlc3QoXG4gICAgcmVmcmVzaFRva2VuOiBzdHJpbmcsXG4gICAgY3VzdG9tUGFyYW1zUmVmcmVzaD86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9XG4gICk6IHN0cmluZyB7XG4gICAgY29uc3QgY2xpZW50SWQgPSB0aGlzLmdldENsaWVudElkKCk7XG5cbiAgICBpZiAoIWNsaWVudElkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgZGF0YUZvckJvZHkgPSBvbmVMaW5lVHJpbWBncmFudF90eXBlPXJlZnJlc2hfdG9rZW5cbiAgICAgICAgICAgICZjbGllbnRfaWQ9JHtjbGllbnRJZH1cbiAgICAgICAgICAgICZyZWZyZXNoX3Rva2VuPSR7cmVmcmVzaFRva2VufWA7XG5cbiAgICBpZiAoY3VzdG9tUGFyYW1zUmVmcmVzaCkge1xuICAgICAgY29uc3QgY3VzdG9tUGFyYW1UZXh0ID0gdGhpcy5jb21wb3NlQ3VzdG9tUGFyYW1zKHsgLi4uY3VzdG9tUGFyYW1zUmVmcmVzaCB9KTtcbiAgICAgIGRhdGFGb3JCb2R5ID0gYCR7ZGF0YUZvckJvZHl9JHtjdXN0b21QYXJhbVRleHR9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YUZvckJvZHk7XG4gIH1cblxuICBjcmVhdGVCb2R5Rm9yUGFyQ29kZUZsb3dSZXF1ZXN0KGN1c3RvbVBhcmFtc1JlcXVlc3Q/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVkaXJlY3RVcmwgPSB0aGlzLmdldFJlZGlyZWN0VXJsKCk7XG5cbiAgICBpZiAoIXJlZGlyZWN0VXJsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5nZXRFeGlzdGluZ09yQ3JlYXRlQXV0aFN0YXRlQ29udHJvbCgpO1xuICAgIGNvbnN0IG5vbmNlID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmNyZWF0ZU5vbmNlKCk7XG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdBdXRob3JpemUgY3JlYXRlZC4gYWRkaW5nIG15YXV0b3N0YXRlOiAnICsgc3RhdGUpO1xuXG4gICAgLy8gY29kZV9jaGFsbGVuZ2Ugd2l0aCBcIlMyNTZcIlxuICAgIGNvbnN0IGNvZGVWZXJpZmllciA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5jcmVhdGVDb2RlVmVyaWZpZXIoKTtcbiAgICBjb25zdCBjb2RlQ2hhbGxlbmdlID0gdGhpcy50b2tlblZhbGlkYXRpb25TZXJ2aWNlLmdlbmVyYXRlQ29kZUNoYWxsZW5nZShjb2RlVmVyaWZpZXIpO1xuXG4gICAgY29uc3QgeyBjbGllbnRJZCwgcmVzcG9uc2VUeXBlLCBzY29wZSwgaGRQYXJhbSwgY3VzdG9tUGFyYW1zIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICBsZXQgZGF0YUZvckJvZHkgPSBvbmVMaW5lVHJpbWBjbGllbnRfaWQ9JHtjbGllbnRJZH1cbiAgICAgICAgICAgICZyZWRpcmVjdF91cmk9JHtyZWRpcmVjdFVybH1cbiAgICAgICAgICAgICZyZXNwb25zZV90eXBlPSR7cmVzcG9uc2VUeXBlfVxuICAgICAgICAgICAgJnNjb3BlPSR7c2NvcGV9XG4gICAgICAgICAgICAmbm9uY2U9JHtub25jZX1cbiAgICAgICAgICAgICZzdGF0ZT0ke3N0YXRlfVxuICAgICAgICAgICAgJmNvZGVfY2hhbGxlbmdlPSR7Y29kZUNoYWxsZW5nZX1cbiAgICAgICAgICAgICZjb2RlX2NoYWxsZW5nZV9tZXRob2Q9UzI1NmA7XG5cbiAgICBpZiAoaGRQYXJhbSkge1xuICAgICAgZGF0YUZvckJvZHkgPSBgJHtkYXRhRm9yQm9keX0maGQ9JHtoZFBhcmFtfWA7XG4gICAgfVxuXG4gICAgaWYgKGN1c3RvbVBhcmFtcykge1xuICAgICAgY29uc3QgY3VzdG9tUGFyYW1UZXh0ID0gdGhpcy5jb21wb3NlQ3VzdG9tUGFyYW1zKHsgLi4uY3VzdG9tUGFyYW1zIH0pO1xuICAgICAgZGF0YUZvckJvZHkgPSBgJHtkYXRhRm9yQm9keX0ke2N1c3RvbVBhcmFtVGV4dH1gO1xuICAgIH1cblxuICAgIGlmIChjdXN0b21QYXJhbXNSZXF1ZXN0KSB7XG4gICAgICBjb25zdCBjdXN0b21QYXJhbVRleHQgPSB0aGlzLmNvbXBvc2VDdXN0b21QYXJhbXMoeyAuLi5jdXN0b21QYXJhbXNSZXF1ZXN0IH0pO1xuICAgICAgZGF0YUZvckJvZHkgPSBgJHtkYXRhRm9yQm9keX0ke2N1c3RvbVBhcmFtVGV4dH1gO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhRm9yQm9keTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQXV0aG9yaXplVXJsKFxuICAgIGNvZGVDaGFsbGVuZ2U6IHN0cmluZyxcbiAgICByZWRpcmVjdFVybDogc3RyaW5nLFxuICAgIG5vbmNlOiBzdHJpbmcsXG4gICAgc3RhdGU6IHN0cmluZyxcbiAgICBwcm9tcHQ/OiBzdHJpbmcsXG4gICAgY3VzdG9tUmVxdWVzdFBhcmFtcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9XG4gICk6IHN0cmluZyB7XG4gICAgY29uc3QgYXV0aFdlbGxLbm93bkVuZFBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG4gICAgY29uc3QgYXV0aG9yaXphdGlvbkVuZHBvaW50ID0gYXV0aFdlbGxLbm93bkVuZFBvaW50cz8uYXV0aG9yaXphdGlvbkVuZHBvaW50O1xuXG4gICAgaWYgKCFhdXRob3JpemF0aW9uRW5kcG9pbnQpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihgQ2FuIG5vdCBjcmVhdGUgYW4gYXV0aG9yaXplIHVybCB3aGVuIGF1dGhvcml6YXRpb25FbmRwb2ludCBpcyAnJHthdXRob3JpemF0aW9uRW5kcG9pbnR9J2ApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgeyBjbGllbnRJZCwgcmVzcG9uc2VUeXBlLCBzY29wZSwgaGRQYXJhbSwgY3VzdG9tUGFyYW1zIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICBpZiAoIWNsaWVudElkKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYGNyZWF0ZUF1dGhvcml6ZVVybCBjb3VsZCBub3QgYWRkIGNsaWVudElkIGJlY2F1c2UgaXQgd2FzOiBgLCBjbGllbnRJZCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXJlc3BvbnNlVHlwZSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGBjcmVhdGVBdXRob3JpemVVcmwgY291bGQgbm90IGFkZCByZXNwb25zZVR5cGUgYmVjYXVzZSBpdCB3YXM6IGAsIHJlc3BvbnNlVHlwZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXNjb3BlKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYGNyZWF0ZUF1dGhvcml6ZVVybCBjb3VsZCBub3QgYWRkIHNjb3BlIGJlY2F1c2UgaXQgd2FzOiBgLCBzY29wZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB1cmxQYXJ0cyA9IGF1dGhvcml6YXRpb25FbmRwb2ludC5zcGxpdCgnPycpO1xuICAgIGNvbnN0IGF1dGhvcml6YXRpb25VcmwgPSB1cmxQYXJ0c1swXTtcblxuICAgIGxldCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyh7XG4gICAgICBmcm9tU3RyaW5nOiB1cmxQYXJ0c1sxXSxcbiAgICAgIGVuY29kZXI6IG5ldyBVcmlFbmNvZGVyKCksXG4gICAgfSk7XG5cbiAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KCdjbGllbnRfaWQnLCBjbGllbnRJZCk7XG4gICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgncmVkaXJlY3RfdXJpJywgcmVkaXJlY3RVcmwpO1xuICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3Jlc3BvbnNlX3R5cGUnLCByZXNwb25zZVR5cGUpO1xuICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3Njb3BlJywgc2NvcGUpO1xuICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ25vbmNlJywgbm9uY2UpO1xuICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3N0YXRlJywgc3RhdGUpO1xuXG4gICAgaWYgKHRoaXMuZmxvd0hlbHBlci5pc0N1cnJlbnRGbG93Q29kZUZsb3coKSkge1xuICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnY29kZV9jaGFsbGVuZ2UnLCBjb2RlQ2hhbGxlbmdlKTtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ2NvZGVfY2hhbGxlbmdlX21ldGhvZCcsICdTMjU2Jyk7XG4gICAgfVxuXG4gICAgaWYgKHByb21wdCkge1xuICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgncHJvbXB0JywgcHJvbXB0KTtcbiAgICB9XG5cbiAgICBpZiAoaGRQYXJhbSkge1xuICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnaGQnLCBoZFBhcmFtKTtcbiAgICB9XG5cbiAgICBpZiAoY3VzdG9tUGFyYW1zKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh7IC4uLmN1c3RvbVBhcmFtcyB9KSkge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKGtleSwgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGN1c3RvbVJlcXVlc3RQYXJhbXMpIHtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHsgLi4uY3VzdG9tUmVxdWVzdFBhcmFtcyB9KSkge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKGtleSwgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke2F1dGhvcml6YXRpb25Vcmx9PyR7cGFyYW1zfWA7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVVybEltcGxpY2l0Rmxvd1dpdGhTaWxlbnRSZW5ldyhjdXN0b21QYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuZ2V0RXhpc3RpbmdPckNyZWF0ZUF1dGhTdGF0ZUNvbnRyb2woKTtcbiAgICBjb25zdCBub25jZSA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5jcmVhdGVOb25jZSgpO1xuXG4gICAgY29uc3Qgc2lsZW50UmVuZXdVcmwgPSB0aGlzLmdldFNpbGVudFJlbmV3VXJsKCk7XG5cbiAgICBpZiAoIXNpbGVudFJlbmV3VXJsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1JlZnJlc2hTZXNzaW9uIGNyZWF0ZWQuIGFkZGluZyBteWF1dG9zdGF0ZTogJywgc3RhdGUpO1xuXG4gICAgY29uc3QgYXV0aFdlbGxLbm93bkVuZFBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG4gICAgaWYgKGF1dGhXZWxsS25vd25FbmRQb2ludHMpIHtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUF1dGhvcml6ZVVybCgnJywgc2lsZW50UmVuZXdVcmwsIG5vbmNlLCBzdGF0ZSwgJ25vbmUnLCBjdXN0b21QYXJhbXMpO1xuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVXJsQ29kZUZsb3dXaXRoU2lsZW50UmVuZXcoY3VzdG9tUGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmdldEV4aXN0aW5nT3JDcmVhdGVBdXRoU3RhdGVDb250cm9sKCk7XG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuY3JlYXRlTm9uY2UoKTtcblxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnUmVmcmVzaFNlc3Npb24gY3JlYXRlZC4gYWRkaW5nIG15YXV0b3N0YXRlOiAnICsgc3RhdGUpO1xuXG4gICAgLy8gY29kZV9jaGFsbGVuZ2Ugd2l0aCBcIlMyNTZcIlxuICAgIGNvbnN0IGNvZGVWZXJpZmllciA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5jcmVhdGVDb2RlVmVyaWZpZXIoKTtcbiAgICBjb25zdCBjb2RlQ2hhbGxlbmdlID0gdGhpcy50b2tlblZhbGlkYXRpb25TZXJ2aWNlLmdlbmVyYXRlQ29kZUNoYWxsZW5nZShjb2RlVmVyaWZpZXIpO1xuXG4gICAgY29uc3Qgc2lsZW50UmVuZXdVcmwgPSB0aGlzLmdldFNpbGVudFJlbmV3VXJsKCk7XG5cbiAgICBpZiAoIXNpbGVudFJlbmV3VXJsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdXRoV2VsbEtub3duRW5kUG9pbnRzID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnKTtcbiAgICBpZiAoYXV0aFdlbGxLbm93bkVuZFBvaW50cykge1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQXV0aG9yaXplVXJsKGNvZGVDaGFsbGVuZ2UsIHNpbGVudFJlbmV3VXJsLCBub25jZSwgc3RhdGUsICdub25lJywgY3VzdG9tUGFyYW1zKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVXJsSW1wbGljaXRGbG93QXV0aG9yaXplKGN1c3RvbVBhcmFtcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5nZXRFeGlzdGluZ09yQ3JlYXRlQXV0aFN0YXRlQ29udHJvbCgpO1xuICAgIGNvbnN0IG5vbmNlID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmNyZWF0ZU5vbmNlKCk7XG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdBdXRob3JpemUgY3JlYXRlZC4gYWRkaW5nIG15YXV0b3N0YXRlOiAnICsgc3RhdGUpO1xuXG4gICAgY29uc3QgcmVkaXJlY3RVcmwgPSB0aGlzLmdldFJlZGlyZWN0VXJsKCk7XG5cbiAgICBpZiAoIXJlZGlyZWN0VXJsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdXRoV2VsbEtub3duRW5kUG9pbnRzID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnKTtcbiAgICBpZiAoYXV0aFdlbGxLbm93bkVuZFBvaW50cykge1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQXV0aG9yaXplVXJsKCcnLCByZWRpcmVjdFVybCwgbm9uY2UsIHN0YXRlLCBudWxsLCBjdXN0b21QYXJhbXMpO1xuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVXJsQ29kZUZsb3dBdXRob3JpemUoY3VzdG9tUGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmdldEV4aXN0aW5nT3JDcmVhdGVBdXRoU3RhdGVDb250cm9sKCk7XG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuY3JlYXRlTm9uY2UoKTtcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0F1dGhvcml6ZSBjcmVhdGVkLiBhZGRpbmcgbXlhdXRvc3RhdGU6ICcgKyBzdGF0ZSk7XG5cbiAgICBjb25zdCByZWRpcmVjdFVybCA9IHRoaXMuZ2V0UmVkaXJlY3RVcmwoKTtcblxuICAgIGlmICghcmVkaXJlY3RVcmwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGNvZGVfY2hhbGxlbmdlIHdpdGggXCJTMjU2XCJcbiAgICBjb25zdCBjb2RlVmVyaWZpZXIgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuY3JlYXRlQ29kZVZlcmlmaWVyKCk7XG4gICAgY29uc3QgY29kZUNoYWxsZW5nZSA9IHRoaXMudG9rZW5WYWxpZGF0aW9uU2VydmljZS5nZW5lcmF0ZUNvZGVDaGFsbGVuZ2UoY29kZVZlcmlmaWVyKTtcblxuICAgIGNvbnN0IGF1dGhXZWxsS25vd25FbmRQb2ludHMgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycpO1xuICAgIGlmIChhdXRoV2VsbEtub3duRW5kUG9pbnRzKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVBdXRob3JpemVVcmwoY29kZUNoYWxsZW5nZSwgcmVkaXJlY3RVcmwsIG5vbmNlLCBzdGF0ZSwgbnVsbCwgY3VzdG9tUGFyYW1zKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJ2F1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGdldFJlZGlyZWN0VXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgeyByZWRpcmVjdFVybCB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgaWYgKCFyZWRpcmVjdFVybCkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGBjb3VsZCBub3QgZ2V0IHJlZGlyZWN0VXJsLCB3YXM6IGAsIHJlZGlyZWN0VXJsKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZWRpcmVjdFVybDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U2lsZW50UmVuZXdVcmwoKTogc3RyaW5nIHtcbiAgICBjb25zdCB7IHNpbGVudFJlbmV3VXJsIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICBpZiAoIXNpbGVudFJlbmV3VXJsKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYGNvdWxkIG5vdCBnZXQgc2lsZW50UmVuZXdVcmwsIHdhczogYCwgc2lsZW50UmVuZXdVcmwpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNpbGVudFJlbmV3VXJsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb3N0TG9nb3V0UmVkaXJlY3RVcmwoKTogc3RyaW5nIHtcbiAgICBjb25zdCB7IHBvc3RMb2dvdXRSZWRpcmVjdFVyaSB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgaWYgKCFwb3N0TG9nb3V0UmVkaXJlY3RVcmkpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihgY291bGQgbm90IGdldCBwb3N0TG9nb3V0UmVkaXJlY3RVcmksIHdhczogYCwgcG9zdExvZ291dFJlZGlyZWN0VXJpKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBwb3N0TG9nb3V0UmVkaXJlY3RVcmk7XG4gIH1cblxuICBwcml2YXRlIGdldENsaWVudElkKCk6IHN0cmluZyB7XG4gICAgY29uc3QgeyBjbGllbnRJZCB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgaWYgKCFjbGllbnRJZCkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGBjb3VsZCBub3QgZ2V0IGNsaWVudElkLCB3YXM6IGAsIGNsaWVudElkKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjbGllbnRJZDtcbiAgfVxuXG4gIHByaXZhdGUgY29tcG9zZUN1c3RvbVBhcmFtcyhjdXN0b21QYXJhbXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KSB7XG4gICAgbGV0IGN1c3RvbVBhcmFtVGV4dCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoY3VzdG9tUGFyYW1zKSkge1xuICAgICAgY3VzdG9tUGFyYW1UZXh0ID0gY3VzdG9tUGFyYW1UZXh0LmNvbmNhdChgJiR7a2V5fT0ke3ZhbHVlLnRvU3RyaW5nKCl9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1c3RvbVBhcmFtVGV4dDtcbiAgfVxufVxuIl19