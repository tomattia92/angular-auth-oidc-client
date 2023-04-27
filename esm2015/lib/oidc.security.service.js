import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./iframe/check-session.service";
import * as i2 from "./check-auth.service";
import * as i3 from "./userData/user-service";
import * as i4 from "./utils/tokenHelper/oidc-token-helper.service";
import * as i5 from "./config/config.provider";
import * as i6 from "./authState/auth-state.service";
import * as i7 from "./flows/flows-data.service";
import * as i8 from "./callback/callback.service";
import * as i9 from "./logoffRevoke/logoff-revocation.service";
import * as i10 from "./login/login.service";
import * as i11 from "./storage/storage-persistence.service";
import * as i12 from "./callback/refresh-session.service";
export class OidcSecurityService {
    constructor(checkSessionService, checkAuthService, userService, tokenHelperService, configurationProvider, authStateService, flowsDataService, callbackService, logoffRevocationService, loginService, storagePersistenceService, refreshSessionService) {
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
    /**
     * Gets the currently active OpenID configuration.
     */
    get configuration() {
        const openIDConfiguration = this.configurationProvider.getOpenIDConfiguration();
        return {
            configuration: openIDConfiguration,
            wellknown: this.storagePersistenceService.read('authWellKnownEndPoints'),
        };
    }
    /**
     * Provides information about the user after they have logged in.
     */
    get userData$() {
        return this.userService.userData$;
    }
    /**
     * Emits each time an authorization event occurs. Returns true if the user is authenticated and false if they are not.
     */
    get isAuthenticated$() {
        return this.authStateService.authorized$;
    }
    /**
     * Emits each time the server sends a CheckSession event and the value changed. This property will always return
     * true.
     */
    get checkSessionChanged$() {
        return this.checkSessionService.checkSessionChanged$;
    }
    /**
     * Emits on possible STS callback. The observable will never contain a value.
     */
    get stsCallback$() {
        return this.callbackService.stsCallback$;
    }
    /**
     * Starts the complete setup flow. Calling will start the entire authentication flow, and the returned observable
     * will denote whether the user was successfully authenticated.
     *
     * @param url The url to perform the authorization on the behalf of.
     */
    checkAuth(url) {
        return this.checkAuthService.checkAuth(url);
    }
    /**
     * Checks the server for an authenticated session using the iframe silent renew if not locally authenticated.
     */
    checkAuthIncludingServer() {
        return this.checkAuthService.checkAuthIncludingServer();
    }
    /**
     * Returns the access token for the login scenario.
     */
    getToken() {
        return this.authStateService.getAccessToken();
    }
    /**
     * Returns the ID token for the login scenario.
     */
    getIdToken() {
        return this.authStateService.getIdToken();
    }
    /**
     * Returns the refresh token, if present, for the login scenario.
     */
    getRefreshToken() {
        return this.authStateService.getRefreshToken();
    }
    /**
     * Returns the payload from the ID token.
     *
     * @param encode Set to true if the payload is base64 encoded
     */
    getPayloadFromIdToken(encode = false) {
        const token = this.getIdToken();
        return this.tokenHelperService.getPayloadFromToken(token, encode);
    }
    /**
     * Sets a custom state for the authorize request.
     *
     * @param state The state to set.
     */
    setState(state) {
        this.flowsDataService.setAuthStateControl(state);
    }
    /**
     * Gets the state value used for the authorize request.
     */
    getState() {
        return this.flowsDataService.getAuthStateControl();
    }
    /**
     * Redirects the user to the STS to begin the authentication process.
     *
     * @param authOptions The custom options for the the authentication request.
     */
    // Code Flow with PCKE or Implicit Flow
    authorize(authOptions) {
        if (authOptions === null || authOptions === void 0 ? void 0 : authOptions.customParams) {
            this.storagePersistenceService.write('storageCustomRequestParams', authOptions.customParams);
        }
        this.loginService.login(authOptions);
    }
    /**
     * Opens the STS in a new window to begin the authentication process.
     *
     * @param authOptions The custom options for the authentication request.
     * @param popupOptions The configuration for the popup window.
     */
    authorizeWithPopUp(authOptions, popupOptions) {
        if (authOptions === null || authOptions === void 0 ? void 0 : authOptions.customParams) {
            this.storagePersistenceService.write('storageCustomRequestParams', authOptions.customParams);
        }
        return this.loginService.loginWithPopUp(authOptions, popupOptions);
    }
    /**
     * Manually refreshes the session.
     *
     * @param customParams Custom parameters to pass to the refresh request.
     */
    forceRefreshSession(customParams) {
        const { useRefreshToken } = this.configurationProvider.getOpenIDConfiguration();
        if (customParams) {
            if (useRefreshToken) {
                this.storagePersistenceService.write('storageCustomParamsRefresh', customParams);
            }
            else {
                this.storagePersistenceService.write('storageCustomRequestParams', customParams);
            }
        }
        return this.refreshSessionService.forceRefreshSession(customParams);
    }
    /**
     * Revokes the refresh token (if present) and the access token on the server and then performs the logoff operation.
     *
     * @param urlHandler An optional url handler for the logoff request.
     */
    // The refresh token and and the access token are revoked on the server. If the refresh token does not exist
    // only the access token is revoked. Then the logout run.
    logoffAndRevokeTokens(urlHandler) {
        return this.logoffRevocationService.logoffAndRevokeTokens(urlHandler);
    }
    /**
     * Logs out on the server and the local client. If the server state has changed, confirmed via checksession,
     * then only a local logout is performed.
     *
     * @param urlHandler
     */
    logoff(urlHandler) {
        return this.logoffRevocationService.logoff(urlHandler);
    }
    /**
     * Logs the user out of the application without logging them out of the server.
     */
    logoffLocal() {
        return this.logoffRevocationService.logoffLocal();
    }
    /**
     * Revokes an access token on the STS. This is only required in the code flow with refresh tokens. If no token is
     * provided, then the token from the storage is revoked. You can pass any token to revoke.
     * https://tools.ietf.org/html/rfc7009
     *
     * @param accessToken The access token to revoke.
     */
    revokeAccessToken(accessToken) {
        return this.logoffRevocationService.revokeAccessToken(accessToken);
    }
    /**
     * Revokes a refresh token on the STS. This is only required in the code flow with refresh tokens. If no token is
     * provided, then the token from the storage is revoked. You can pass any token to revoke.
     * https://tools.ietf.org/html/rfc7009
     *
     * @param refreshToken The access token to revoke.
     */
    revokeRefreshToken(refreshToken) {
        return this.logoffRevocationService.revokeRefreshToken(refreshToken);
    }
    /**
     * Creates the end session URL which can be used to implement an alternate server logout.
     */
    getEndSessionUrl(customParams) {
        return this.logoffRevocationService.getEndSessionUrl(customParams);
    }
}
OidcSecurityService.ɵfac = function OidcSecurityService_Factory(t) { return new (t || OidcSecurityService)(i0.ɵɵinject(i1.CheckSessionService), i0.ɵɵinject(i2.CheckAuthService), i0.ɵɵinject(i3.UserService), i0.ɵɵinject(i4.TokenHelperService), i0.ɵɵinject(i5.ConfigurationProvider), i0.ɵɵinject(i6.AuthStateService), i0.ɵɵinject(i7.FlowsDataService), i0.ɵɵinject(i8.CallbackService), i0.ɵɵinject(i9.LogoffRevocationService), i0.ɵɵinject(i10.LoginService), i0.ɵɵinject(i11.StoragePersistenceService), i0.ɵɵinject(i12.RefreshSessionService)); };
OidcSecurityService.ɵprov = i0.ɵɵdefineInjectable({ token: OidcSecurityService, factory: OidcSecurityService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(OidcSecurityService, [{
        type: Injectable
    }], function () { return [{ type: i1.CheckSessionService }, { type: i2.CheckAuthService }, { type: i3.UserService }, { type: i4.TokenHelperService }, { type: i5.ConfigurationProvider }, { type: i6.AuthStateService }, { type: i7.FlowsDataService }, { type: i8.CallbackService }, { type: i9.LogoffRevocationService }, { type: i10.LoginService }, { type: i11.StoragePersistenceService }, { type: i12.RefreshSessionService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvb2lkYy5zZWN1cml0eS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBcUIzQyxNQUFNLE9BQU8sbUJBQW1CO0lBMEM5QixZQUNVLG1CQUF3QyxFQUN4QyxnQkFBa0MsRUFDbEMsV0FBd0IsRUFDeEIsa0JBQXNDLEVBQ3RDLHFCQUE0QyxFQUM1QyxnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLGVBQWdDLEVBQ2hDLHVCQUFnRCxFQUNoRCxZQUEwQixFQUMxQix5QkFBb0QsRUFDcEQscUJBQTRDO1FBWDVDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMkI7UUFDcEQsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtJQUNuRCxDQUFDO0lBdERKOztPQUVHO0lBQ0gsSUFBSSxhQUFhO1FBQ2YsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUVoRixPQUFPO1lBQ0wsYUFB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Qzs7c0ZBL05VLG1CQUFtQjsyREFBbkIsbUJBQW1CLFdBQW5CLG1CQUFtQjtrREFBbkIsbUJBQW1CO2NBRC9CLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBdXRoT3B0aW9ucyB9IGZyb20gJy4vYXV0aC1vcHRpb25zJztcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuL2F1dGhTdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FsbGJhY2tTZXJ2aWNlIH0gZnJvbSAnLi9jYWxsYmFjay9jYWxsYmFjay5zZXJ2aWNlJztcbmltcG9ydCB7IFJlZnJlc2hTZXNzaW9uU2VydmljZSB9IGZyb20gJy4vY2FsbGJhY2svcmVmcmVzaC1zZXNzaW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2hlY2tBdXRoU2VydmljZSB9IGZyb20gJy4vY2hlY2stYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XG5pbXBvcnQgeyBQdWJsaWNDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9jb25maWcvcHVibGljLWNvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHsgRmxvd3NEYXRhU2VydmljZSB9IGZyb20gJy4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IENoZWNrU2Vzc2lvblNlcnZpY2UgfSBmcm9tICcuL2lmcmFtZS9jaGVjay1zZXNzaW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9naW5SZXNwb25zZSB9IGZyb20gJy4vbG9naW4vbG9naW4tcmVzcG9uc2UnO1xuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9sb2dpbi9sb2dpbi5zZXJ2aWNlJztcbmltcG9ydCB7IFBvcHVwT3B0aW9ucyB9IGZyb20gJy4vbG9naW4vcG9wdXAvcG9wdXAtb3B0aW9ucyc7XG5pbXBvcnQgeyBMb2dvZmZSZXZvY2F0aW9uU2VydmljZSB9IGZyb20gJy4vbG9nb2ZmUmV2b2tlL2xvZ29mZi1yZXZvY2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgVG9rZW5SZXNwb25zZSB9IGZyb20gJy4vdG9rZW5zL3Rva2VuLXJlc3BvbnNlJztcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi91c2VyRGF0YS91c2VyLXNlcnZpY2UnO1xuaW1wb3J0IHsgVG9rZW5IZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi91dGlscy90b2tlbkhlbHBlci9vaWRjLXRva2VuLWhlbHBlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9pZGNTZWN1cml0eVNlcnZpY2Uge1xuICAvKipcbiAgICogR2V0cyB0aGUgY3VycmVudGx5IGFjdGl2ZSBPcGVuSUQgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIGdldCBjb25maWd1cmF0aW9uKCk6IFB1YmxpY0NvbmZpZ3VyYXRpb24ge1xuICAgIGNvbnN0IG9wZW5JRENvbmZpZ3VyYXRpb24gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlndXJhdGlvbjogb3BlbklEQ29uZmlndXJhdGlvbixcbiAgICAgIHdlbGxrbm93bjogdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGluZm9ybWF0aW9uIGFib3V0IHRoZSB1c2VyIGFmdGVyIHRoZXkgaGF2ZSBsb2dnZWQgaW4uXG4gICAqL1xuICBnZXQgdXNlckRhdGEkKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMudXNlclNlcnZpY2UudXNlckRhdGEkO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIGVhY2ggdGltZSBhbiBhdXRob3JpemF0aW9uIGV2ZW50IG9jY3Vycy4gUmV0dXJucyB0cnVlIGlmIHRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQgYW5kIGZhbHNlIGlmIHRoZXkgYXJlIG5vdC5cbiAgICovXG4gIGdldCBpc0F1dGhlbnRpY2F0ZWQkKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuYXV0aG9yaXplZCQ7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgZWFjaCB0aW1lIHRoZSBzZXJ2ZXIgc2VuZHMgYSBDaGVja1Nlc3Npb24gZXZlbnQgYW5kIHRoZSB2YWx1ZSBjaGFuZ2VkLiBUaGlzIHByb3BlcnR5IHdpbGwgYWx3YXlzIHJldHVyblxuICAgKiB0cnVlLlxuICAgKi9cbiAgZ2V0IGNoZWNrU2Vzc2lvbkNoYW5nZWQkKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrU2Vzc2lvblNlcnZpY2UuY2hlY2tTZXNzaW9uQ2hhbmdlZCQ7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgb24gcG9zc2libGUgU1RTIGNhbGxiYWNrLiBUaGUgb2JzZXJ2YWJsZSB3aWxsIG5ldmVyIGNvbnRhaW4gYSB2YWx1ZS5cbiAgICovXG4gIGdldCBzdHNDYWxsYmFjayQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5jYWxsYmFja1NlcnZpY2Uuc3RzQ2FsbGJhY2skO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjaGVja1Nlc3Npb25TZXJ2aWNlOiBDaGVja1Nlc3Npb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgY2hlY2tBdXRoU2VydmljZTogQ2hlY2tBdXRoU2VydmljZSxcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcbiAgICBwcml2YXRlIHRva2VuSGVscGVyU2VydmljZTogVG9rZW5IZWxwZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIsXG4gICAgcHJpdmF0ZSBhdXRoU3RhdGVTZXJ2aWNlOiBBdXRoU3RhdGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgZmxvd3NEYXRhU2VydmljZTogRmxvd3NEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGNhbGxiYWNrU2VydmljZTogQ2FsbGJhY2tTZXJ2aWNlLFxuICAgIHByaXZhdGUgbG9nb2ZmUmV2b2NhdGlvblNlcnZpY2U6IExvZ29mZlJldm9jYXRpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgbG9naW5TZXJ2aWNlOiBMb2dpblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVmcmVzaFNlc3Npb25TZXJ2aWNlOiBSZWZyZXNoU2Vzc2lvblNlcnZpY2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIGNvbXBsZXRlIHNldHVwIGZsb3cuIENhbGxpbmcgd2lsbCBzdGFydCB0aGUgZW50aXJlIGF1dGhlbnRpY2F0aW9uIGZsb3csIGFuZCB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZVxuICAgKiB3aWxsIGRlbm90ZSB3aGV0aGVyIHRoZSB1c2VyIHdhcyBzdWNjZXNzZnVsbHkgYXV0aGVudGljYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHVybCBUaGUgdXJsIHRvIHBlcmZvcm0gdGhlIGF1dGhvcml6YXRpb24gb24gdGhlIGJlaGFsZiBvZi5cbiAgICovXG4gIGNoZWNrQXV0aCh1cmw/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5jaGVja0F1dGhTZXJ2aWNlLmNoZWNrQXV0aCh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0aGUgc2VydmVyIGZvciBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24gdXNpbmcgdGhlIGlmcmFtZSBzaWxlbnQgcmVuZXcgaWYgbm90IGxvY2FsbHkgYXV0aGVudGljYXRlZC5cbiAgICovXG4gIGNoZWNrQXV0aEluY2x1ZGluZ1NlcnZlcigpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5jaGVja0F1dGhTZXJ2aWNlLmNoZWNrQXV0aEluY2x1ZGluZ1NlcnZlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFjY2VzcyB0b2tlbiBmb3IgdGhlIGxvZ2luIHNjZW5hcmlvLlxuICAgKi9cbiAgZ2V0VG9rZW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmdldEFjY2Vzc1Rva2VuKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgSUQgdG9rZW4gZm9yIHRoZSBsb2dpbiBzY2VuYXJpby5cbiAgICovXG4gIGdldElkVG9rZW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmdldElkVG9rZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByZWZyZXNoIHRva2VuLCBpZiBwcmVzZW50LCBmb3IgdGhlIGxvZ2luIHNjZW5hcmlvLlxuICAgKi9cbiAgZ2V0UmVmcmVzaFRva2VuKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYXV0aFN0YXRlU2VydmljZS5nZXRSZWZyZXNoVG9rZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwYXlsb2FkIGZyb20gdGhlIElEIHRva2VuLlxuICAgKlxuICAgKiBAcGFyYW0gZW5jb2RlIFNldCB0byB0cnVlIGlmIHRoZSBwYXlsb2FkIGlzIGJhc2U2NCBlbmNvZGVkXG4gICAqL1xuICBnZXRQYXlsb2FkRnJvbUlkVG9rZW4oZW5jb2RlID0gZmFsc2UpOiBhbnkge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5nZXRJZFRva2VuKCk7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldFBheWxvYWRGcm9tVG9rZW4odG9rZW4sIGVuY29kZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIGN1c3RvbSBzdGF0ZSBmb3IgdGhlIGF1dGhvcml6ZSByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIHN0YXRlIHRvIHNldC5cbiAgICovXG4gIHNldFN0YXRlKHN0YXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2Uuc2V0QXV0aFN0YXRlQ29udHJvbChzdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgc3RhdGUgdmFsdWUgdXNlZCBmb3IgdGhlIGF1dGhvcml6ZSByZXF1ZXN0LlxuICAgKi9cbiAgZ2V0U3RhdGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmdldEF1dGhTdGF0ZUNvbnRyb2woKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWRpcmVjdHMgdGhlIHVzZXIgdG8gdGhlIFNUUyB0byBiZWdpbiB0aGUgYXV0aGVudGljYXRpb24gcHJvY2Vzcy5cbiAgICpcbiAgICogQHBhcmFtIGF1dGhPcHRpb25zIFRoZSBjdXN0b20gb3B0aW9ucyBmb3IgdGhlIHRoZSBhdXRoZW50aWNhdGlvbiByZXF1ZXN0LlxuICAgKi9cbiAgLy8gQ29kZSBGbG93IHdpdGggUENLRSBvciBJbXBsaWNpdCBGbG93XG4gIGF1dGhvcml6ZShhdXRoT3B0aW9ucz86IEF1dGhPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKGF1dGhPcHRpb25zPy5jdXN0b21QYXJhbXMpIHtcbiAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnc3RvcmFnZUN1c3RvbVJlcXVlc3RQYXJhbXMnLCBhdXRoT3B0aW9ucy5jdXN0b21QYXJhbXMpO1xuICAgIH1cblxuICAgIHRoaXMubG9naW5TZXJ2aWNlLmxvZ2luKGF1dGhPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgU1RTIGluIGEgbmV3IHdpbmRvdyB0byBiZWdpbiB0aGUgYXV0aGVudGljYXRpb24gcHJvY2Vzcy5cbiAgICpcbiAgICogQHBhcmFtIGF1dGhPcHRpb25zIFRoZSBjdXN0b20gb3B0aW9ucyBmb3IgdGhlIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3QuXG4gICAqIEBwYXJhbSBwb3B1cE9wdGlvbnMgVGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBwb3B1cCB3aW5kb3cuXG4gICAqL1xuICBhdXRob3JpemVXaXRoUG9wVXAoYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zPzogUG9wdXBPcHRpb25zKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlPiB7XG4gICAgaWYgKGF1dGhPcHRpb25zPy5jdXN0b21QYXJhbXMpIHtcbiAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnc3RvcmFnZUN1c3RvbVJlcXVlc3RQYXJhbXMnLCBhdXRoT3B0aW9ucy5jdXN0b21QYXJhbXMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmxvZ2luU2VydmljZS5sb2dpbldpdGhQb3BVcChhdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYW51YWxseSByZWZyZXNoZXMgdGhlIHNlc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSBjdXN0b21QYXJhbXMgQ3VzdG9tIHBhcmFtZXRlcnMgdG8gcGFzcyB0byB0aGUgcmVmcmVzaCByZXF1ZXN0LlxuICAgKi9cbiAgZm9yY2VSZWZyZXNoU2Vzc2lvbihjdXN0b21QYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSk6IE9ic2VydmFibGU8VG9rZW5SZXNwb25zZT4ge1xuICAgIGNvbnN0IHsgdXNlUmVmcmVzaFRva2VuIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICBpZiAoY3VzdG9tUGFyYW1zKSB7XG4gICAgICBpZiAodXNlUmVmcmVzaFRva2VuKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnc3RvcmFnZUN1c3RvbVBhcmFtc1JlZnJlc2gnLCBjdXN0b21QYXJhbXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLndyaXRlKCdzdG9yYWdlQ3VzdG9tUmVxdWVzdFBhcmFtcycsIGN1c3RvbVBhcmFtcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVmcmVzaFNlc3Npb25TZXJ2aWNlLmZvcmNlUmVmcmVzaFNlc3Npb24oY3VzdG9tUGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZva2VzIHRoZSByZWZyZXNoIHRva2VuIChpZiBwcmVzZW50KSBhbmQgdGhlIGFjY2VzcyB0b2tlbiBvbiB0aGUgc2VydmVyIGFuZCB0aGVuIHBlcmZvcm1zIHRoZSBsb2dvZmYgb3BlcmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gdXJsSGFuZGxlciBBbiBvcHRpb25hbCB1cmwgaGFuZGxlciBmb3IgdGhlIGxvZ29mZiByZXF1ZXN0LlxuICAgKi9cbiAgLy8gVGhlIHJlZnJlc2ggdG9rZW4gYW5kIGFuZCB0aGUgYWNjZXNzIHRva2VuIGFyZSByZXZva2VkIG9uIHRoZSBzZXJ2ZXIuIElmIHRoZSByZWZyZXNoIHRva2VuIGRvZXMgbm90IGV4aXN0XG4gIC8vIG9ubHkgdGhlIGFjY2VzcyB0b2tlbiBpcyByZXZva2VkLiBUaGVuIHRoZSBsb2dvdXQgcnVuLlxuICBsb2dvZmZBbmRSZXZva2VUb2tlbnModXJsSGFuZGxlcj86ICh1cmw6IHN0cmluZykgPT4gYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5sb2dvZmZSZXZvY2F0aW9uU2VydmljZS5sb2dvZmZBbmRSZXZva2VUb2tlbnModXJsSGFuZGxlcik7XG4gIH1cblxuICAvKipcbiAgICogTG9ncyBvdXQgb24gdGhlIHNlcnZlciBhbmQgdGhlIGxvY2FsIGNsaWVudC4gSWYgdGhlIHNlcnZlciBzdGF0ZSBoYXMgY2hhbmdlZCwgY29uZmlybWVkIHZpYSBjaGVja3Nlc3Npb24sXG4gICAqIHRoZW4gb25seSBhIGxvY2FsIGxvZ291dCBpcyBwZXJmb3JtZWQuXG4gICAqXG4gICAqIEBwYXJhbSB1cmxIYW5kbGVyXG4gICAqL1xuICBsb2dvZmYodXJsSGFuZGxlcj86ICh1cmw6IHN0cmluZykgPT4gYW55KTogdm9pZCB7XG4gICAgcmV0dXJuIHRoaXMubG9nb2ZmUmV2b2NhdGlvblNlcnZpY2UubG9nb2ZmKHVybEhhbmRsZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgdGhlIHVzZXIgb3V0IG9mIHRoZSBhcHBsaWNhdGlvbiB3aXRob3V0IGxvZ2dpbmcgdGhlbSBvdXQgb2YgdGhlIHNlcnZlci5cbiAgICovXG4gIGxvZ29mZkxvY2FsKCk6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLmxvZ29mZlJldm9jYXRpb25TZXJ2aWNlLmxvZ29mZkxvY2FsKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV2b2tlcyBhbiBhY2Nlc3MgdG9rZW4gb24gdGhlIFNUUy4gVGhpcyBpcyBvbmx5IHJlcXVpcmVkIGluIHRoZSBjb2RlIGZsb3cgd2l0aCByZWZyZXNoIHRva2Vucy4gSWYgbm8gdG9rZW4gaXNcbiAgICogcHJvdmlkZWQsIHRoZW4gdGhlIHRva2VuIGZyb20gdGhlIHN0b3JhZ2UgaXMgcmV2b2tlZC4gWW91IGNhbiBwYXNzIGFueSB0b2tlbiB0byByZXZva2UuXG4gICAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MDA5XG4gICAqXG4gICAqIEBwYXJhbSBhY2Nlc3NUb2tlbiBUaGUgYWNjZXNzIHRva2VuIHRvIHJldm9rZS5cbiAgICovXG4gIHJldm9rZUFjY2Vzc1Rva2VuKGFjY2Vzc1Rva2VuPzogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5sb2dvZmZSZXZvY2F0aW9uU2VydmljZS5yZXZva2VBY2Nlc3NUb2tlbihhY2Nlc3NUb2tlbik7XG4gIH1cblxuICAvKipcbiAgICogUmV2b2tlcyBhIHJlZnJlc2ggdG9rZW4gb24gdGhlIFNUUy4gVGhpcyBpcyBvbmx5IHJlcXVpcmVkIGluIHRoZSBjb2RlIGZsb3cgd2l0aCByZWZyZXNoIHRva2Vucy4gSWYgbm8gdG9rZW4gaXNcbiAgICogcHJvdmlkZWQsIHRoZW4gdGhlIHRva2VuIGZyb20gdGhlIHN0b3JhZ2UgaXMgcmV2b2tlZC4gWW91IGNhbiBwYXNzIGFueSB0b2tlbiB0byByZXZva2UuXG4gICAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MDA5XG4gICAqXG4gICAqIEBwYXJhbSByZWZyZXNoVG9rZW4gVGhlIGFjY2VzcyB0b2tlbiB0byByZXZva2UuXG4gICAqL1xuICByZXZva2VSZWZyZXNoVG9rZW4ocmVmcmVzaFRva2VuPzogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5sb2dvZmZSZXZvY2F0aW9uU2VydmljZS5yZXZva2VSZWZyZXNoVG9rZW4ocmVmcmVzaFRva2VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBlbmQgc2Vzc2lvbiBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgdG8gaW1wbGVtZW50IGFuIGFsdGVybmF0ZSBzZXJ2ZXIgbG9nb3V0LlxuICAgKi9cbiAgZ2V0RW5kU2Vzc2lvblVybChjdXN0b21QYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmxvZ29mZlJldm9jYXRpb25TZXJ2aWNlLmdldEVuZFNlc3Npb25VcmwoY3VzdG9tUGFyYW1zKTtcbiAgfVxufVxuIl19