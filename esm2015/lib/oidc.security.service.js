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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvb2lkYy5zZWN1cml0eS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBcUIzQyxNQUFNLE9BQU8sbUJBQW1CO0lBMEM5QixZQUNVLG1CQUF3QyxFQUN4QyxnQkFBa0MsRUFDbEMsV0FBd0IsRUFDeEIsa0JBQXNDLEVBQ3RDLHFCQUE0QyxFQUM1QyxnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLGVBQWdDLEVBQ2hDLHVCQUFnRCxFQUNoRCxZQUEwQixFQUMxQix5QkFBb0QsRUFDcEQscUJBQTRDO1FBWDVDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMkI7UUFDcEQsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtJQUNuRCxDQUFDO0lBdERKOztPQUVHO0lBQ0gsSUFBSSxhQUFhO1FBQ2YsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUVoRixPQUFPO1lBQ0wsYUFB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Qzs7c0ZBL05VLG1CQUFtQjsyREFBbkIsbUJBQW1CLFdBQW5CLG1CQUFtQjtrREFBbkIsbUJBQW1CO2NBRC9CLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQXV0aE9wdGlvbnMgfSBmcm9tICcuL2F1dGgtb3B0aW9ucyc7XHJcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuL2F1dGhTdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYWxsYmFja1NlcnZpY2UgfSBmcm9tICcuL2NhbGxiYWNrL2NhbGxiYWNrLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZWZyZXNoU2Vzc2lvblNlcnZpY2UgfSBmcm9tICcuL2NhbGxiYWNrL3JlZnJlc2gtc2Vzc2lvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2hlY2tBdXRoU2VydmljZSB9IGZyb20gJy4vY2hlY2stYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcclxuaW1wb3J0IHsgUHVibGljQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vY29uZmlnL3B1YmxpYy1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgRmxvd3NEYXRhU2VydmljZSB9IGZyb20gJy4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2hlY2tTZXNzaW9uU2VydmljZSB9IGZyb20gJy4vaWZyYW1lL2NoZWNrLXNlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2luUmVzcG9uc2UgfSBmcm9tICcuL2xvZ2luL2xvZ2luLXJlc3BvbnNlJztcclxuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9sb2dpbi9sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9wdXBPcHRpb25zIH0gZnJvbSAnLi9sb2dpbi9wb3B1cC9wb3B1cC1vcHRpb25zJztcclxuaW1wb3J0IHsgTG9nb2ZmUmV2b2NhdGlvblNlcnZpY2UgfSBmcm9tICcuL2xvZ29mZlJldm9rZS9sb2dvZmYtcmV2b2NhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUb2tlblJlc3BvbnNlIH0gZnJvbSAnLi90b2tlbnMvdG9rZW4tcmVzcG9uc2UnO1xyXG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4vdXNlckRhdGEvdXNlci1zZXJ2aWNlJztcclxuaW1wb3J0IHsgVG9rZW5IZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi91dGlscy90b2tlbkhlbHBlci9vaWRjLXRva2VuLWhlbHBlci5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE9pZGNTZWN1cml0eVNlcnZpY2Uge1xyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGN1cnJlbnRseSBhY3RpdmUgT3BlbklEIGNvbmZpZ3VyYXRpb24uXHJcbiAgICovXHJcbiAgZ2V0IGNvbmZpZ3VyYXRpb24oKTogUHVibGljQ29uZmlndXJhdGlvbiB7XHJcbiAgICBjb25zdCBvcGVuSURDb25maWd1cmF0aW9uID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNvbmZpZ3VyYXRpb246IG9wZW5JRENvbmZpZ3VyYXRpb24sXHJcbiAgICAgIHdlbGxrbm93bjogdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnKSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQcm92aWRlcyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgdXNlciBhZnRlciB0aGV5IGhhdmUgbG9nZ2VkIGluLlxyXG4gICAqL1xyXG4gIGdldCB1c2VyRGF0YSQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLnVzZXJTZXJ2aWNlLnVzZXJEYXRhJDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXRzIGVhY2ggdGltZSBhbiBhdXRob3JpemF0aW9uIGV2ZW50IG9jY3Vycy4gUmV0dXJucyB0cnVlIGlmIHRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQgYW5kIGZhbHNlIGlmIHRoZXkgYXJlIG5vdC5cclxuICAgKi9cclxuICBnZXQgaXNBdXRoZW50aWNhdGVkJCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuYXV0aG9yaXplZCQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyBlYWNoIHRpbWUgdGhlIHNlcnZlciBzZW5kcyBhIENoZWNrU2Vzc2lvbiBldmVudCBhbmQgdGhlIHZhbHVlIGNoYW5nZWQuIFRoaXMgcHJvcGVydHkgd2lsbCBhbHdheXMgcmV0dXJuXHJcbiAgICogdHJ1ZS5cclxuICAgKi9cclxuICBnZXQgY2hlY2tTZXNzaW9uQ2hhbmdlZCQoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jaGVja1Nlc3Npb25TZXJ2aWNlLmNoZWNrU2Vzc2lvbkNoYW5nZWQkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHMgb24gcG9zc2libGUgU1RTIGNhbGxiYWNrLiBUaGUgb2JzZXJ2YWJsZSB3aWxsIG5ldmVyIGNvbnRhaW4gYSB2YWx1ZS5cclxuICAgKi9cclxuICBnZXQgc3RzQ2FsbGJhY2skKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5jYWxsYmFja1NlcnZpY2Uuc3RzQ2FsbGJhY2skO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGNoZWNrU2Vzc2lvblNlcnZpY2U6IENoZWNrU2Vzc2lvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNoZWNrQXV0aFNlcnZpY2U6IENoZWNrQXV0aFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgdG9rZW5IZWxwZXJTZXJ2aWNlOiBUb2tlbkhlbHBlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyLFxyXG4gICAgcHJpdmF0ZSBhdXRoU3RhdGVTZXJ2aWNlOiBBdXRoU3RhdGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBmbG93c0RhdGFTZXJ2aWNlOiBGbG93c0RhdGFTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBjYWxsYmFja1NlcnZpY2U6IENhbGxiYWNrU2VydmljZSxcclxuICAgIHByaXZhdGUgbG9nb2ZmUmV2b2NhdGlvblNlcnZpY2U6IExvZ29mZlJldm9jYXRpb25TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBsb2dpblNlcnZpY2U6IExvZ2luU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVmcmVzaFNlc3Npb25TZXJ2aWNlOiBSZWZyZXNoU2Vzc2lvblNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0YXJ0cyB0aGUgY29tcGxldGUgc2V0dXAgZmxvdy4gQ2FsbGluZyB3aWxsIHN0YXJ0IHRoZSBlbnRpcmUgYXV0aGVudGljYXRpb24gZmxvdywgYW5kIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlXHJcbiAgICogd2lsbCBkZW5vdGUgd2hldGhlciB0aGUgdXNlciB3YXMgc3VjY2Vzc2Z1bGx5IGF1dGhlbnRpY2F0ZWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXJsIFRoZSB1cmwgdG8gcGVyZm9ybSB0aGUgYXV0aG9yaXphdGlvbiBvbiB0aGUgYmVoYWxmIG9mLlxyXG4gICAqL1xyXG4gIGNoZWNrQXV0aCh1cmw/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLmNoZWNrQXV0aFNlcnZpY2UuY2hlY2tBdXRoKHVybCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVja3MgdGhlIHNlcnZlciBmb3IgYW4gYXV0aGVudGljYXRlZCBzZXNzaW9uIHVzaW5nIHRoZSBpZnJhbWUgc2lsZW50IHJlbmV3IGlmIG5vdCBsb2NhbGx5IGF1dGhlbnRpY2F0ZWQuXHJcbiAgICovXHJcbiAgY2hlY2tBdXRoSW5jbHVkaW5nU2VydmVyKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hlY2tBdXRoU2VydmljZS5jaGVja0F1dGhJbmNsdWRpbmdTZXJ2ZXIoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGFjY2VzcyB0b2tlbiBmb3IgdGhlIGxvZ2luIHNjZW5hcmlvLlxyXG4gICAqL1xyXG4gIGdldFRva2VuKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmdldEFjY2Vzc1Rva2VuKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBJRCB0b2tlbiBmb3IgdGhlIGxvZ2luIHNjZW5hcmlvLlxyXG4gICAqL1xyXG4gIGdldElkVG9rZW4oKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuZ2V0SWRUb2tlbigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcmVmcmVzaCB0b2tlbiwgaWYgcHJlc2VudCwgZm9yIHRoZSBsb2dpbiBzY2VuYXJpby5cclxuICAgKi9cclxuICBnZXRSZWZyZXNoVG9rZW4oKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuZ2V0UmVmcmVzaFRva2VuKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBwYXlsb2FkIGZyb20gdGhlIElEIHRva2VuLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGVuY29kZSBTZXQgdG8gdHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBiYXNlNjQgZW5jb2RlZFxyXG4gICAqL1xyXG4gIGdldFBheWxvYWRGcm9tSWRUb2tlbihlbmNvZGUgPSBmYWxzZSk6IGFueSB7XHJcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMuZ2V0SWRUb2tlbigpO1xyXG4gICAgcmV0dXJuIHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldFBheWxvYWRGcm9tVG9rZW4odG9rZW4sIGVuY29kZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIGEgY3VzdG9tIHN0YXRlIGZvciB0aGUgYXV0aG9yaXplIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIHN0YXRlIHRvIHNldC5cclxuICAgKi9cclxuICBzZXRTdGF0ZShzdGF0ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2Uuc2V0QXV0aFN0YXRlQ29udHJvbChzdGF0ZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzdGF0ZSB2YWx1ZSB1c2VkIGZvciB0aGUgYXV0aG9yaXplIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgZ2V0U3RhdGUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuZ2V0QXV0aFN0YXRlQ29udHJvbCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVkaXJlY3RzIHRoZSB1c2VyIHRvIHRoZSBTVFMgdG8gYmVnaW4gdGhlIGF1dGhlbnRpY2F0aW9uIHByb2Nlc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYXV0aE9wdGlvbnMgVGhlIGN1c3RvbSBvcHRpb25zIGZvciB0aGUgdGhlIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgLy8gQ29kZSBGbG93IHdpdGggUENLRSBvciBJbXBsaWNpdCBGbG93XHJcbiAgYXV0aG9yaXplKGF1dGhPcHRpb25zPzogQXV0aE9wdGlvbnMpOiB2b2lkIHtcclxuICAgIGlmIChhdXRoT3B0aW9ucz8uY3VzdG9tUGFyYW1zKSB7XHJcbiAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnc3RvcmFnZUN1c3RvbVJlcXVlc3RQYXJhbXMnLCBhdXRoT3B0aW9ucy5jdXN0b21QYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubG9naW5TZXJ2aWNlLmxvZ2luKGF1dGhPcHRpb25zKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9wZW5zIHRoZSBTVFMgaW4gYSBuZXcgd2luZG93IHRvIGJlZ2luIHRoZSBhdXRoZW50aWNhdGlvbiBwcm9jZXNzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGF1dGhPcHRpb25zIFRoZSBjdXN0b20gb3B0aW9ucyBmb3IgdGhlIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3QuXHJcbiAgICogQHBhcmFtIHBvcHVwT3B0aW9ucyBUaGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIHBvcHVwIHdpbmRvdy5cclxuICAgKi9cclxuICBhdXRob3JpemVXaXRoUG9wVXAoYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zPzogUG9wdXBPcHRpb25zKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlPiB7XHJcbiAgICBpZiAoYXV0aE9wdGlvbnM/LmN1c3RvbVBhcmFtcykge1xyXG4gICAgICB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2Uud3JpdGUoJ3N0b3JhZ2VDdXN0b21SZXF1ZXN0UGFyYW1zJywgYXV0aE9wdGlvbnMuY3VzdG9tUGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5sb2dpblNlcnZpY2UubG9naW5XaXRoUG9wVXAoYXV0aE9wdGlvbnMsIHBvcHVwT3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYW51YWxseSByZWZyZXNoZXMgdGhlIHNlc3Npb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY3VzdG9tUGFyYW1zIEN1c3RvbSBwYXJhbWV0ZXJzIHRvIHBhc3MgdG8gdGhlIHJlZnJlc2ggcmVxdWVzdC5cclxuICAgKi9cclxuICBmb3JjZVJlZnJlc2hTZXNzaW9uKGN1c3RvbVBhcmFtcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KTogT2JzZXJ2YWJsZTxUb2tlblJlc3BvbnNlPiB7XHJcbiAgICBjb25zdCB7IHVzZVJlZnJlc2hUb2tlbiB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xyXG5cclxuICAgIGlmIChjdXN0b21QYXJhbXMpIHtcclxuICAgICAgaWYgKHVzZVJlZnJlc2hUb2tlbikge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnc3RvcmFnZUN1c3RvbVBhcmFtc1JlZnJlc2gnLCBjdXN0b21QYXJhbXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnc3RvcmFnZUN1c3RvbVJlcXVlc3RQYXJhbXMnLCBjdXN0b21QYXJhbXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucmVmcmVzaFNlc3Npb25TZXJ2aWNlLmZvcmNlUmVmcmVzaFNlc3Npb24oY3VzdG9tUGFyYW1zKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldm9rZXMgdGhlIHJlZnJlc2ggdG9rZW4gKGlmIHByZXNlbnQpIGFuZCB0aGUgYWNjZXNzIHRva2VuIG9uIHRoZSBzZXJ2ZXIgYW5kIHRoZW4gcGVyZm9ybXMgdGhlIGxvZ29mZiBvcGVyYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXJsSGFuZGxlciBBbiBvcHRpb25hbCB1cmwgaGFuZGxlciBmb3IgdGhlIGxvZ29mZiByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIC8vIFRoZSByZWZyZXNoIHRva2VuIGFuZCBhbmQgdGhlIGFjY2VzcyB0b2tlbiBhcmUgcmV2b2tlZCBvbiB0aGUgc2VydmVyLiBJZiB0aGUgcmVmcmVzaCB0b2tlbiBkb2VzIG5vdCBleGlzdFxyXG4gIC8vIG9ubHkgdGhlIGFjY2VzcyB0b2tlbiBpcyByZXZva2VkLiBUaGVuIHRoZSBsb2dvdXQgcnVuLlxyXG4gIGxvZ29mZkFuZFJldm9rZVRva2Vucyh1cmxIYW5kbGVyPzogKHVybDogc3RyaW5nKSA9PiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubG9nb2ZmUmV2b2NhdGlvblNlcnZpY2UubG9nb2ZmQW5kUmV2b2tlVG9rZW5zKHVybEhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9ncyBvdXQgb24gdGhlIHNlcnZlciBhbmQgdGhlIGxvY2FsIGNsaWVudC4gSWYgdGhlIHNlcnZlciBzdGF0ZSBoYXMgY2hhbmdlZCwgY29uZmlybWVkIHZpYSBjaGVja3Nlc3Npb24sXHJcbiAgICogdGhlbiBvbmx5IGEgbG9jYWwgbG9nb3V0IGlzIHBlcmZvcm1lZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmxIYW5kbGVyXHJcbiAgICovXHJcbiAgbG9nb2ZmKHVybEhhbmRsZXI/OiAodXJsOiBzdHJpbmcpID0+IGFueSk6IHZvaWQge1xyXG4gICAgcmV0dXJuIHRoaXMubG9nb2ZmUmV2b2NhdGlvblNlcnZpY2UubG9nb2ZmKHVybEhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9ncyB0aGUgdXNlciBvdXQgb2YgdGhlIGFwcGxpY2F0aW9uIHdpdGhvdXQgbG9nZ2luZyB0aGVtIG91dCBvZiB0aGUgc2VydmVyLlxyXG4gICAqL1xyXG4gIGxvZ29mZkxvY2FsKCk6IHZvaWQge1xyXG4gICAgcmV0dXJuIHRoaXMubG9nb2ZmUmV2b2NhdGlvblNlcnZpY2UubG9nb2ZmTG9jYWwoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldm9rZXMgYW4gYWNjZXNzIHRva2VuIG9uIHRoZSBTVFMuIFRoaXMgaXMgb25seSByZXF1aXJlZCBpbiB0aGUgY29kZSBmbG93IHdpdGggcmVmcmVzaCB0b2tlbnMuIElmIG5vIHRva2VuIGlzXHJcbiAgICogcHJvdmlkZWQsIHRoZW4gdGhlIHRva2VuIGZyb20gdGhlIHN0b3JhZ2UgaXMgcmV2b2tlZC4gWW91IGNhbiBwYXNzIGFueSB0b2tlbiB0byByZXZva2UuXHJcbiAgICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcwMDlcclxuICAgKlxyXG4gICAqIEBwYXJhbSBhY2Nlc3NUb2tlbiBUaGUgYWNjZXNzIHRva2VuIHRvIHJldm9rZS5cclxuICAgKi9cclxuICByZXZva2VBY2Nlc3NUb2tlbihhY2Nlc3NUb2tlbj86IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5sb2dvZmZSZXZvY2F0aW9uU2VydmljZS5yZXZva2VBY2Nlc3NUb2tlbihhY2Nlc3NUb2tlbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXZva2VzIGEgcmVmcmVzaCB0b2tlbiBvbiB0aGUgU1RTLiBUaGlzIGlzIG9ubHkgcmVxdWlyZWQgaW4gdGhlIGNvZGUgZmxvdyB3aXRoIHJlZnJlc2ggdG9rZW5zLiBJZiBubyB0b2tlbiBpc1xyXG4gICAqIHByb3ZpZGVkLCB0aGVuIHRoZSB0b2tlbiBmcm9tIHRoZSBzdG9yYWdlIGlzIHJldm9rZWQuIFlvdSBjYW4gcGFzcyBhbnkgdG9rZW4gdG8gcmV2b2tlLlxyXG4gICAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MDA5XHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVmcmVzaFRva2VuIFRoZSBhY2Nlc3MgdG9rZW4gdG8gcmV2b2tlLlxyXG4gICAqL1xyXG4gIHJldm9rZVJlZnJlc2hUb2tlbihyZWZyZXNoVG9rZW4/OiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubG9nb2ZmUmV2b2NhdGlvblNlcnZpY2UucmV2b2tlUmVmcmVzaFRva2VuKHJlZnJlc2hUb2tlbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSBlbmQgc2Vzc2lvbiBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgdG8gaW1wbGVtZW50IGFuIGFsdGVybmF0ZSBzZXJ2ZXIgbG9nb3V0LlxyXG4gICAqL1xyXG4gIGdldEVuZFNlc3Npb25VcmwoY3VzdG9tUGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH0pOiBzdHJpbmcgfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLmxvZ29mZlJldm9jYXRpb25TZXJ2aWNlLmdldEVuZFNlc3Npb25VcmwoY3VzdG9tUGFyYW1zKTtcclxuICB9XHJcbn1cclxuIl19