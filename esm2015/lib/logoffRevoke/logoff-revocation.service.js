import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, retry, switchMap, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../api/data.service";
import * as i2 from "../storage/storage-persistence.service";
import * as i3 from "../logging/logger.service";
import * as i4 from "../utils/url/url.service";
import * as i5 from "../iframe/check-session.service";
import * as i6 from "../flows/reset-auth-data.service";
import * as i7 from "../config/config.provider";
export class LogoffRevocationService {
    constructor(dataService, storagePersistenceService, loggerService, urlService, checkSessionService, resetAuthDataService, 
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
    logoff(urlHandler) {
        this.loggerService.logDebug('logoff, remove auth ');
        const endSessionUrl = this.getEndSessionUrl();
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
            this.dataService.get(endSessionUrl).subscribe((result) => {
                console.log(result);
            }, (error) => {
                console.log('error', error);
            });
        }
    }
    logoffLocal() {
        this.resetAuthDataService.resetAuthorizationData();
        this.checkSessionService.stop();
    }
    // The refresh token and and the access token are revoked on the server. If the refresh token does not exist
    // only the access token is revoked. Then the logout run.
    logoffAndRevokeTokens(urlHandler) {
        var _a;
        if (!((_a = this.storagePersistenceService.read('authWellKnownEndPoints')) === null || _a === void 0 ? void 0 : _a.revocationEndpoint)) {
            this.loggerService.logDebug('revocation endpoint not supported');
            this.logoff(urlHandler);
        }
        if (this.storagePersistenceService.getRefreshToken()) {
            return this.revokeRefreshToken().pipe(switchMap((result) => this.revokeAccessToken(result)), catchError((error) => {
                const errorMessage = `revoke token failed`;
                this.loggerService.logError(errorMessage, error);
                return throwError(errorMessage);
            }), tap(() => this.logoff(urlHandler)));
        }
        else {
            return this.revokeAccessToken().pipe(catchError((error) => {
                const errorMessage = `revoke access token failed`;
                this.loggerService.logError(errorMessage, error);
                return throwError(errorMessage);
            }), tap(() => this.logoff(urlHandler)));
        }
    }
    // https://tools.ietf.org/html/rfc7009
    // revokes an access token on the STS. If no token is provided, then the token from
    // the storage is revoked. You can pass any token to revoke. This makes it possible to
    // manage your own tokens. The is a public API.
    revokeAccessToken(accessToken) {
        const accessTok = accessToken || this.storagePersistenceService.getAccessToken();
        const body = this.urlService.createRevocationEndpointBodyAccessToken(accessTok);
        const url = this.urlService.getRevocationEndpointUrl();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        return this.dataService.post(url, body, headers).pipe(retry(2), switchMap((response) => {
            this.loggerService.logDebug('revocation endpoint post response: ', response);
            return of(response);
        }), catchError((error) => {
            const errorMessage = `Revocation request failed`;
            this.loggerService.logError(errorMessage, error);
            return throwError(errorMessage);
        }));
    }
    // https://tools.ietf.org/html/rfc7009
    // revokes an refresh token on the STS. This is only required in the code flow with refresh tokens.
    // If no token is provided, then the token from the storage is revoked. You can pass any token to revoke.
    // This makes it possible to manage your own tokens.
    revokeRefreshToken(refreshToken) {
        const refreshTok = refreshToken || this.storagePersistenceService.getRefreshToken();
        const body = this.urlService.createRevocationEndpointBodyRefreshToken(refreshTok);
        const url = this.urlService.getRevocationEndpointUrl();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        return this.dataService.post(url, body, headers).pipe(retry(2), switchMap((response) => {
            this.loggerService.logDebug('revocation endpoint post response: ', response);
            return of(response);
        }), catchError((error) => {
            const errorMessage = `Revocation request failed`;
            this.loggerService.logError(errorMessage, error);
            return throwError(errorMessage);
        }));
    }
    getEndSessionUrl(customParams) {
        const idToken = this.storagePersistenceService.getIdToken();
        const { customParamsEndSession } = this.configurationProvider.getOpenIDConfiguration();
        const mergedParams = Object.assign(Object.assign({}, customParams), customParamsEndSession);
        return this.urlService.createEndSessionUrl(idToken, mergedParams);
    }
}
LogoffRevocationService.ɵfac = function LogoffRevocationService_Factory(t) { return new (t || LogoffRevocationService)(i0.ɵɵinject(i1.DataService), i0.ɵɵinject(i2.StoragePersistenceService), i0.ɵɵinject(i3.LoggerService), i0.ɵɵinject(i4.UrlService), i0.ɵɵinject(i5.CheckSessionService), i0.ɵɵinject(i6.ResetAuthDataService), i0.ɵɵinject(i7.ConfigurationProvider)); };
LogoffRevocationService.ɵprov = i0.ɵɵdefineInjectable({ token: LogoffRevocationService, factory: LogoffRevocationService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(LogoffRevocationService, [{
        type: Injectable
    }], function () { return [{ type: i1.DataService }, { type: i2.StoragePersistenceService }, { type: i3.LoggerService }, { type: i4.UrlService }, { type: i5.CheckSessionService }, { type: i6.ResetAuthDataService }, { type: i7.ConfigurationProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nb2ZmLXJldm9jYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2xvZ29mZlJldm9rZS9sb2dvZmYtcmV2b2NhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7O0FBVW5FLE1BQU0sT0FBTyx1QkFBdUI7SUFDbEMsWUFDVSxXQUF3QixFQUN4Qix5QkFBb0QsRUFDcEQsYUFBNEIsRUFDNUIsVUFBc0IsRUFDdEIsbUJBQXdDLEVBQ3hDLG9CQUEwQztJQUNsRCxhQUFhO0lBQ2IsMkNBQTJDO0lBQ25DLHFCQUE0QztRQVI1QyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qiw4QkFBeUIsR0FBekIseUJBQXlCLENBQTJCO1FBQ3BELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4Qyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBRzFDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7SUFDbkQsQ0FBQztJQUVKLCtDQUErQztJQUMvQywyRUFBMkU7SUFDM0UsTUFBTSxDQUFDLFVBQWlDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDcEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFD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QUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3BFLENBQUM7OzhGQTFJVSx1QkFBdUI7K0RBQXZCLHVCQUF1QixXQUF2Qix1QkFBdUI7a0RBQXZCLHVCQUF1QjtjQURuQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgcmV0cnksIHN3aXRjaE1hcCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9hcGkvZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgUmVzZXRBdXRoRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy9yZXNldC1hdXRoLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBDaGVja1Nlc3Npb25TZXJ2aWNlIH0gZnJvbSAnLi4vaWZyYW1lL2NoZWNrLXNlc3Npb24uc2VydmljZSc7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXJsU2VydmljZSB9IGZyb20gJy4uL3V0aWxzL3VybC91cmwuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb2dvZmZSZXZvY2F0aW9uU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcbiAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSB1cmxTZXJ2aWNlOiBVcmxTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2hlY2tTZXNzaW9uU2VydmljZTogQ2hlY2tTZXNzaW9uU2VydmljZSxcbiAgICBwcml2YXRlIHJlc2V0QXV0aERhdGFTZXJ2aWNlOiBSZXNldEF1dGhEYXRhU2VydmljZSxcbiAgICAvLyBUT0RPOiBIRVJFXG4gICAgLy9wcml2YXRlIHJlZGlyZWN0U2VydmljZTogUmVkaXJlY3RTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXJcbiAgKSB7fVxuXG4gIC8vIExvZ3Mgb3V0IG9uIHRoZSBzZXJ2ZXIgYW5kIHRoZSBsb2NhbCBjbGllbnQuXG4gIC8vIElmIHRoZSBzZXJ2ZXIgc3RhdGUgaGFzIGNoYW5nZWQsIGNoZWNrc2Vzc2lvbiwgdGhlbiBvbmx5IGEgbG9jYWwgbG9nb3V0LlxuICBsb2dvZmYodXJsSGFuZGxlcj86ICh1cmw6IHN0cmluZykgPT4gYW55KTogdm9pZCB7XG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdsb2dvZmYsIHJlbW92ZSBhdXRoICcpO1xuICAgIGNvbnN0IGVuZFNlc3Npb25VcmwgPSB0aGlzLmdldEVuZFNlc3Npb25VcmwoKTtcbiAgICB0aGlzLnJlc2V0QXV0aERhdGFTZXJ2aWNlLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoKTtcblxuICAgIGlmICghZW5kU2Vzc2lvblVybCkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdvbmx5IGxvY2FsIGxvZ2luIGNsZWFuZWQgdXAsIG5vIGVuZF9zZXNzaW9uX2VuZHBvaW50Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2hlY2tTZXNzaW9uU2VydmljZS5zZXJ2ZXJTdGF0ZUNoYW5nZWQoKSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdvbmx5IGxvY2FsIGxvZ2luIGNsZWFuZWQgdXAsIHNlcnZlciBzZXNzaW9uIGhhcyBjaGFuZ2VkJyk7XG4gICAgfSBlbHNlIGlmICh1cmxIYW5kbGVyKSB7XG4gICAgICB1cmxIYW5kbGVyKGVuZFNlc3Npb25VcmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPOiBIRVJFXG4gICAgICAvL3RoaXMucmVkaXJlY3RTZXJ2aWNlLnJlZGlyZWN0VG8oZW5kU2Vzc2lvblVybCk7XG4gICAgICB0aGlzLmRhdGFTZXJ2aWNlLmdldChlbmRTZXNzaW9uVXJsKS5zdWJzY3JpYmUoXG4gICAgICAgIChyZXN1bHQpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICB9LFxuICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgbG9nb2ZmTG9jYWwoKTogdm9pZCB7XG4gICAgdGhpcy5yZXNldEF1dGhEYXRhU2VydmljZS5yZXNldEF1dGhvcml6YXRpb25EYXRhKCk7XG4gICAgdGhpcy5jaGVja1Nlc3Npb25TZXJ2aWNlLnN0b3AoKTtcbiAgfVxuXG4gIC8vIFRoZSByZWZyZXNoIHRva2VuIGFuZCBhbmQgdGhlIGFjY2VzcyB0b2tlbiBhcmUgcmV2b2tlZCBvbiB0aGUgc2VydmVyLiBJZiB0aGUgcmVmcmVzaCB0b2tlbiBkb2VzIG5vdCBleGlzdFxuICAvLyBvbmx5IHRoZSBhY2Nlc3MgdG9rZW4gaXMgcmV2b2tlZC4gVGhlbiB0aGUgbG9nb3V0IHJ1bi5cbiAgbG9nb2ZmQW5kUmV2b2tlVG9rZW5zKHVybEhhbmRsZXI/OiAodXJsOiBzdHJpbmcpID0+IGFueSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKCF0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycpPy5yZXZvY2F0aW9uRW5kcG9pbnQpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygncmV2b2NhdGlvbiBlbmRwb2ludCBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICB0aGlzLmxvZ29mZih1cmxIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLmdldFJlZnJlc2hUb2tlbigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXZva2VSZWZyZXNoVG9rZW4oKS5waXBlKFxuICAgICAgICBzd2l0Y2hNYXAoKHJlc3VsdCkgPT4gdGhpcy5yZXZva2VBY2Nlc3NUb2tlbihyZXN1bHQpKSxcbiAgICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgcmV2b2tlIHRva2VuIGZhaWxlZGA7XG4gICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycm9yTWVzc2FnZSwgZXJyb3IpO1xuICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgIH0pLFxuICAgICAgICB0YXAoKCkgPT4gdGhpcy5sb2dvZmYodXJsSGFuZGxlcikpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXZva2VBY2Nlc3NUb2tlbigpLnBpcGUoXG4gICAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYHJldm9rZSBhY2Nlc3MgdG9rZW4gZmFpbGVkYDtcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyb3JNZXNzYWdlLCBlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfSksXG4gICAgICAgIHRhcCgoKSA9PiB0aGlzLmxvZ29mZih1cmxIYW5kbGVyKSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcwMDlcbiAgLy8gcmV2b2tlcyBhbiBhY2Nlc3MgdG9rZW4gb24gdGhlIFNUUy4gSWYgbm8gdG9rZW4gaXMgcHJvdmlkZWQsIHRoZW4gdGhlIHRva2VuIGZyb21cbiAgLy8gdGhlIHN0b3JhZ2UgaXMgcmV2b2tlZC4gWW91IGNhbiBwYXNzIGFueSB0b2tlbiB0byByZXZva2UuIFRoaXMgbWFrZXMgaXQgcG9zc2libGUgdG9cbiAgLy8gbWFuYWdlIHlvdXIgb3duIHRva2Vucy4gVGhlIGlzIGEgcHVibGljIEFQSS5cbiAgcmV2b2tlQWNjZXNzVG9rZW4oYWNjZXNzVG9rZW4/OiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IGFjY2Vzc1RvayA9IGFjY2Vzc1Rva2VuIHx8IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpO1xuICAgIGNvbnN0IGJvZHkgPSB0aGlzLnVybFNlcnZpY2UuY3JlYXRlUmV2b2NhdGlvbkVuZHBvaW50Qm9keUFjY2Vzc1Rva2VuKGFjY2Vzc1Rvayk7XG4gICAgY29uc3QgdXJsID0gdGhpcy51cmxTZXJ2aWNlLmdldFJldm9jYXRpb25FbmRwb2ludFVybCgpO1xuXG4gICAgbGV0IGhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XG4gICAgaGVhZGVycyA9IGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG5cbiAgICByZXR1cm4gdGhpcy5kYXRhU2VydmljZS5wb3N0KHVybCwgYm9keSwgaGVhZGVycykucGlwZShcbiAgICAgIHJldHJ5KDIpLFxuICAgICAgc3dpdGNoTWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygncmV2b2NhdGlvbiBlbmRwb2ludCBwb3N0IHJlc3BvbnNlOiAnLCByZXNwb25zZSk7XG4gICAgICAgIHJldHVybiBvZihyZXNwb25zZSk7XG4gICAgICB9KSxcbiAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBSZXZvY2F0aW9uIHJlcXVlc3QgZmFpbGVkYDtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycm9yTWVzc2FnZSwgZXJyb3IpO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcwMDlcbiAgLy8gcmV2b2tlcyBhbiByZWZyZXNoIHRva2VuIG9uIHRoZSBTVFMuIFRoaXMgaXMgb25seSByZXF1aXJlZCBpbiB0aGUgY29kZSBmbG93IHdpdGggcmVmcmVzaCB0b2tlbnMuXG4gIC8vIElmIG5vIHRva2VuIGlzIHByb3ZpZGVkLCB0aGVuIHRoZSB0b2tlbiBmcm9tIHRoZSBzdG9yYWdlIGlzIHJldm9rZWQuIFlvdSBjYW4gcGFzcyBhbnkgdG9rZW4gdG8gcmV2b2tlLlxuICAvLyBUaGlzIG1ha2VzIGl0IHBvc3NpYmxlIHRvIG1hbmFnZSB5b3VyIG93biB0b2tlbnMuXG4gIHJldm9rZVJlZnJlc2hUb2tlbihyZWZyZXNoVG9rZW4/OiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IHJlZnJlc2hUb2sgPSByZWZyZXNoVG9rZW4gfHwgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLmdldFJlZnJlc2hUb2tlbigpO1xuICAgIGNvbnN0IGJvZHkgPSB0aGlzLnVybFNlcnZpY2UuY3JlYXRlUmV2b2NhdGlvbkVuZHBvaW50Qm9keVJlZnJlc2hUb2tlbihyZWZyZXNoVG9rKTtcbiAgICBjb25zdCB1cmwgPSB0aGlzLnVybFNlcnZpY2UuZ2V0UmV2b2NhdGlvbkVuZHBvaW50VXJsKCk7XG5cbiAgICBsZXQgaGVhZGVyczogSHR0cEhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzID0gaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcblxuICAgIHJldHVybiB0aGlzLmRhdGFTZXJ2aWNlLnBvc3QodXJsLCBib2R5LCBoZWFkZXJzKS5waXBlKFxuICAgICAgcmV0cnkoMiksXG4gICAgICBzd2l0Y2hNYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdyZXZvY2F0aW9uIGVuZHBvaW50IHBvc3QgcmVzcG9uc2U6ICcsIHJlc3BvbnNlKTtcbiAgICAgICAgcmV0dXJuIG9mKHJlc3BvbnNlKTtcbiAgICAgIH0pLFxuICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYFJldm9jYXRpb24gcmVxdWVzdCBmYWlsZWRgO1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyb3JNZXNzYWdlLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBnZXRFbmRTZXNzaW9uVXJsKGN1c3RvbVBhcmFtcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KTogc3RyaW5nIHwgbnVsbCB7XG4gICAgY29uc3QgaWRUb2tlbiA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5nZXRJZFRva2VuKCk7XG5cbiAgICBjb25zdCB7IGN1c3RvbVBhcmFtc0VuZFNlc3Npb24gfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcblxuICAgIGNvbnN0IG1lcmdlZFBhcmFtcyA9IHsgLi4uY3VzdG9tUGFyYW1zLCAuLi5jdXN0b21QYXJhbXNFbmRTZXNzaW9uIH07XG5cbiAgICByZXR1cm4gdGhpcy51cmxTZXJ2aWNlLmNyZWF0ZUVuZFNlc3Npb25VcmwoaWRUb2tlbiwgbWVyZ2VkUGFyYW1zKTtcbiAgfVxufVxuIl19