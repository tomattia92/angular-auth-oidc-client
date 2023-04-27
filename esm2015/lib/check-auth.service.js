import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./iframe/check-session.service";
import * as i2 from "./iframe/silent-renew.service";
import * as i3 from "./userData/user-service";
import * as i4 from "./logging/logger.service";
import * as i5 from "./config/config.provider";
import * as i6 from "./authState/auth-state.service";
import * as i7 from "./callback/callback.service";
import * as i8 from "./callback/refresh-session.service";
import * as i9 from "./callback/periodically-token-check.service";
import * as i10 from "./login/popup/popup.service";
import * as i11 from "./auto-login/auto-login-service";
import * as i12 from "@angular/router";
export class CheckAuthService {
    constructor(doc, checkSessionService, silentRenewService, userService, loggerService, configurationProvider, authStateService, callbackService, refreshSessionService, periodicallyTokenCheckService, popupService, autoLoginService, router) {
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
    checkAuth(url) {
        if (!this.configurationProvider.hasValidConfig()) {
            this.loggerService.logError('Please provide a configuration before setting up the module');
            return of(false);
        }
        const { stsServer } = this.configurationProvider.getOpenIDConfiguration();
        this.loggerService.logDebug('STS server: ', stsServer);
        const currentUrl = url || this.doc.defaultView.location.toString();
        if (this.popupService.isCurrentlyInPopup()) {
            this.popupService.sendMessageToMainWindow(currentUrl);
            return of(null);
        }
        const isCallback = this.callbackService.isCallback(currentUrl);
        this.loggerService.logDebug('currentUrl to check auth with: ', currentUrl);
        const callback$ = isCallback ? this.callbackService.handleCallbackAndFireEvents(currentUrl) : of(null);
        return callback$.pipe(map(() => {
            const isAuthenticated = this.authStateService.areAuthStorageTokensValid();
            if (isAuthenticated) {
                this.startCheckSessionAndValidation();
                if (!isCallback) {
                    this.authStateService.setAuthorizedAndFireEvent();
                    this.userService.publishUserDataIfExists();
                }
            }
            this.loggerService.logDebug('checkAuth completed fired events, auth: ' + isAuthenticated);
            return isAuthenticated;
        }), tap(() => {
            const isAuthenticated = this.authStateService.areAuthStorageTokensValid();
            if (isAuthenticated) {
                const savedRouteForRedirect = this.autoLoginService.getStoredRedirectRoute();
                if (savedRouteForRedirect) {
                    this.autoLoginService.deleteStoredRedirectRoute();
                    this.router.navigateByUrl(savedRouteForRedirect);
                }
            }
        }), catchError((error) => {
            this.loggerService.logError(error);
            return of(false);
        }));
    }
    checkAuthIncludingServer() {
        return this.checkAuth().pipe(switchMap((isAuthenticated) => {
            if (isAuthenticated) {
                return of(isAuthenticated);
            }
            return this.refreshSessionService.forceRefreshSession().pipe(map((result) => !!(result === null || result === void 0 ? void 0 : result.idToken) && !!(result === null || result === void 0 ? void 0 : result.accessToken)), switchMap((isAuth) => {
                if (isAuth) {
                    this.startCheckSessionAndValidation();
                }
                return of(isAuth);
            }));
        }));
    }
    startCheckSessionAndValidation() {
        if (this.checkSessionService.isCheckSessionConfigured()) {
            this.checkSessionService.start();
        }
        const { tokenRefreshInSeconds } = this.configurationProvider.getOpenIDConfiguration();
        this.periodicallyTokenCheckService.startTokenValidationPeriodically(tokenRefreshInSeconds);
        if (this.silentRenewService.isSilentRenewConfigured()) {
            this.silentRenewService.getOrCreateIframe();
        }
    }
}
CheckAuthService.ɵfac = function CheckAuthService_Factory(t) { return new (t || CheckAuthService)(i0.ɵɵinject(DOCUMENT), i0.ɵɵinject(i1.CheckSessionService), i0.ɵɵinject(i2.SilentRenewService), i0.ɵɵinject(i3.UserService), i0.ɵɵinject(i4.LoggerService), i0.ɵɵinject(i5.ConfigurationProvider), i0.ɵɵinject(i6.AuthStateService), i0.ɵɵinject(i7.CallbackService), i0.ɵɵinject(i8.RefreshSessionService), i0.ɵɵinject(i9.PeriodicallyTokenCheckService), i0.ɵɵinject(i10.PopUpService), i0.ɵɵinject(i11.AutoLoginService), i0.ɵɵinject(i12.Router)); };
CheckAuthService.ɵprov = i0.ɵɵdefineInjectable({ token: CheckAuthService, factory: CheckAuthService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CheckAuthService, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: [DOCUMENT]
            }] }, { type: i1.CheckSessionService }, { type: i2.SilentRenewService }, { type: i3.UserService }, { type: i4.LoggerService }, { type: i5.ConfigurationProvider }, { type: i6.AuthStateService }, { type: i7.CallbackService }, { type: i8.RefreshSessionService }, { type: i9.PeriodicallyTokenCheckService }, { type: i10.PopUpService }, { type: i11.AutoLoginService }, { type: i12.Router }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvY2hlY2stYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRCxPQUFPLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFjakUsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixZQUNxQyxHQUFRLEVBQ25DLG1CQUF3QyxFQUN4QyxrQkFBc0MsRUFDdEMsV0FBd0IsRUFDeEIsYUFBNEIsRUFDNUIscUJBQTRDLEVBQzVDLGdCQUFrQyxFQUNsQyxlQUFnQyxFQUNoQyxxQkFBNEMsRUFDNUMsNkJBQTRELEVBQzVELFlBQTBCLEVBQzFCLGdCQUFrQyxFQUNsQyxNQUFjO1FBWmEsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUNuQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLGtDQUE2QixHQUE3Qiw2QkFBNkIsQ0FBK0I7UUFDNUQsaUJBQVksR0FBWixZQUFZ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VUFBVTs7c0JBR04sTUFBTTt1QkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCwgc3dpdGNoTWFwLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBBdXRoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoU3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IEF1dG9Mb2dpblNlcnZpY2UgfSBmcm9tICcuL2F1dG8tbG9naW4vYXV0by1sb2dpbi1zZXJ2aWNlJztcbmltcG9ydCB7IENhbGxiYWNrU2VydmljZSB9IGZyb20gJy4vY2FsbGJhY2svY2FsbGJhY2suc2VydmljZSc7XG5pbXBvcnQgeyBQZXJpb2RpY2FsbHlUb2tlbkNoZWNrU2VydmljZSB9IGZyb20gJy4vY2FsbGJhY2svcGVyaW9kaWNhbGx5LXRva2VuLWNoZWNrLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVmcmVzaFNlc3Npb25TZXJ2aWNlIH0gZnJvbSAnLi9jYWxsYmFjay9yZWZyZXNoLXNlc3Npb24uc2VydmljZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgQ2hlY2tTZXNzaW9uU2VydmljZSB9IGZyb20gJy4vaWZyYW1lL2NoZWNrLXNlc3Npb24uc2VydmljZSc7XG5pbXBvcnQgeyBTaWxlbnRSZW5ld1NlcnZpY2UgfSBmcm9tICcuL2lmcmFtZS9zaWxlbnQtcmVuZXcuc2VydmljZSc7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvcFVwU2VydmljZSB9IGZyb20gJy4vbG9naW4vcG9wdXAvcG9wdXAuc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4vdXNlckRhdGEvdXNlci1zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENoZWNrQXV0aFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIHJlYWRvbmx5IGRvYzogYW55LFxuICAgIHByaXZhdGUgY2hlY2tTZXNzaW9uU2VydmljZTogQ2hlY2tTZXNzaW9uU2VydmljZSxcbiAgICBwcml2YXRlIHNpbGVudFJlbmV3U2VydmljZTogU2lsZW50UmVuZXdTZXJ2aWNlLFxuICAgIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuICAgIHByaXZhdGUgYXV0aFN0YXRlU2VydmljZTogQXV0aFN0YXRlU2VydmljZSxcbiAgICBwcml2YXRlIGNhbGxiYWNrU2VydmljZTogQ2FsbGJhY2tTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVmcmVzaFNlc3Npb25TZXJ2aWNlOiBSZWZyZXNoU2Vzc2lvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwZXJpb2RpY2FsbHlUb2tlbkNoZWNrU2VydmljZTogUGVyaW9kaWNhbGx5VG9rZW5DaGVja1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb3B1cFNlcnZpY2U6IFBvcFVwU2VydmljZSxcbiAgICBwcml2YXRlIGF1dG9Mb2dpblNlcnZpY2U6IEF1dG9Mb2dpblNlcnZpY2UsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlclxuICApIHt9XG5cbiAgY2hlY2tBdXRoKHVybD86IHN0cmluZyk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuaGFzVmFsaWRDb25maWcoKSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKCdQbGVhc2UgcHJvdmlkZSBhIGNvbmZpZ3VyYXRpb24gYmVmb3JlIHNldHRpbmcgdXAgdGhlIG1vZHVsZScpO1xuICAgICAgcmV0dXJuIG9mKGZhbHNlKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHN0c1NlcnZlciB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdTVFMgc2VydmVyOiAnLCBzdHNTZXJ2ZXIpO1xuXG4gICAgY29uc3QgY3VycmVudFVybCA9IHVybCB8fCB0aGlzLmRvYy5kZWZhdWx0Vmlldy5sb2NhdGlvbi50b1N0cmluZygpO1xuXG4gICAgaWYgKHRoaXMucG9wdXBTZXJ2aWNlLmlzQ3VycmVudGx5SW5Qb3B1cCgpKSB7XG4gICAgICB0aGlzLnBvcHVwU2VydmljZS5zZW5kTWVzc2FnZVRvTWFpbldpbmRvdyhjdXJyZW50VXJsKTtcbiAgICAgIHJldHVybiBvZihudWxsKTtcbiAgICB9XG5cbiAgICBjb25zdCBpc0NhbGxiYWNrID0gdGhpcy5jYWxsYmFja1NlcnZpY2UuaXNDYWxsYmFjayhjdXJyZW50VXJsKTtcblxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnY3VycmVudFVybCB0byBjaGVjayBhdXRoIHdpdGg6ICcsIGN1cnJlbnRVcmwpO1xuXG4gICAgY29uc3QgY2FsbGJhY2skID0gaXNDYWxsYmFjayA/IHRoaXMuY2FsbGJhY2tTZXJ2aWNlLmhhbmRsZUNhbGxiYWNrQW5kRmlyZUV2ZW50cyhjdXJyZW50VXJsKSA6IG9mKG51bGwpO1xuXG4gICAgcmV0dXJuIGNhbGxiYWNrJC5waXBlKFxuICAgICAgbWFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmFyZUF1dGhTdG9yYWdlVG9rZW5zVmFsaWQoKTtcbiAgICAgICAgaWYgKGlzQXV0aGVudGljYXRlZCkge1xuICAgICAgICAgIHRoaXMuc3RhcnRDaGVja1Nlc3Npb25BbmRWYWxpZGF0aW9uKCk7XG5cbiAgICAgICAgICBpZiAoIWlzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuYXV0aFN0YXRlU2VydmljZS5zZXRBdXRob3JpemVkQW5kRmlyZUV2ZW50KCk7XG4gICAgICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlLnB1Ymxpc2hVc2VyRGF0YUlmRXhpc3RzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdjaGVja0F1dGggY29tcGxldGVkIGZpcmVkIGV2ZW50cywgYXV0aDogJyArIGlzQXV0aGVudGljYXRlZCk7XG5cbiAgICAgICAgcmV0dXJuIGlzQXV0aGVudGljYXRlZDtcbiAgICAgIH0pLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmFyZUF1dGhTdG9yYWdlVG9rZW5zVmFsaWQoKTtcblxuICAgICAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgY29uc3Qgc2F2ZWRSb3V0ZUZvclJlZGlyZWN0ID0gdGhpcy5hdXRvTG9naW5TZXJ2aWNlLmdldFN0b3JlZFJlZGlyZWN0Um91dGUoKTtcblxuICAgICAgICAgIGlmIChzYXZlZFJvdXRlRm9yUmVkaXJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuYXV0b0xvZ2luU2VydmljZS5kZWxldGVTdG9yZWRSZWRpcmVjdFJvdXRlKCk7XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHNhdmVkUm91dGVGb3JSZWRpcmVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvcik7XG4gICAgICAgIHJldHVybiBvZihmYWxzZSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBjaGVja0F1dGhJbmNsdWRpbmdTZXJ2ZXIoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2tBdXRoKCkucGlwZShcbiAgICAgIHN3aXRjaE1hcCgoaXNBdXRoZW50aWNhdGVkKSA9PiB7XG4gICAgICAgIGlmIChpc0F1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gb2YoaXNBdXRoZW50aWNhdGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hTZXNzaW9uU2VydmljZS5mb3JjZVJlZnJlc2hTZXNzaW9uKCkucGlwZShcbiAgICAgICAgICBtYXAoKHJlc3VsdCkgPT4gISFyZXN1bHQ/LmlkVG9rZW4gJiYgISFyZXN1bHQ/LmFjY2Vzc1Rva2VuKSxcbiAgICAgICAgICBzd2l0Y2hNYXAoKGlzQXV0aCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzQXV0aCkge1xuICAgICAgICAgICAgICB0aGlzLnN0YXJ0Q2hlY2tTZXNzaW9uQW5kVmFsaWRhdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gb2YoaXNBdXRoKTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydENoZWNrU2Vzc2lvbkFuZFZhbGlkYXRpb24oKSB7XG4gICAgaWYgKHRoaXMuY2hlY2tTZXNzaW9uU2VydmljZS5pc0NoZWNrU2Vzc2lvbkNvbmZpZ3VyZWQoKSkge1xuICAgICAgdGhpcy5jaGVja1Nlc3Npb25TZXJ2aWNlLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgY29uc3QgeyB0b2tlblJlZnJlc2hJblNlY29uZHMgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcblxuICAgIHRoaXMucGVyaW9kaWNhbGx5VG9rZW5DaGVja1NlcnZpY2Uuc3RhcnRUb2tlblZhbGlkYXRpb25QZXJpb2RpY2FsbHkodG9rZW5SZWZyZXNoSW5TZWNvbmRzKTtcblxuICAgIGlmICh0aGlzLnNpbGVudFJlbmV3U2VydmljZS5pc1NpbGVudFJlbmV3Q29uZmlndXJlZCgpKSB7XG4gICAgICB0aGlzLnNpbGVudFJlbmV3U2VydmljZS5nZXRPckNyZWF0ZUlmcmFtZSgpO1xuICAgIH1cbiAgfVxufVxuIl19