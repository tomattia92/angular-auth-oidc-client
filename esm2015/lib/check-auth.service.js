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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvY2hlY2stYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRCxPQUFPLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFjakUsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixZQUNxQyxHQUFRLEVBQ25DLG1CQUF3QyxFQUN4QyxrQkFBc0MsRUFDdEMsV0FBd0IsRUFDeEIsYUFBNEIsRUFDNUIscUJBQTRDLEVBQzVDLGdCQUFrQyxFQUNsQyxlQUFnQyxFQUNoQyxxQkFBNEMsRUFDNUMsNkJBQTRELEVBQzVELFlBQTBCLEVBQzFCLGdCQUFrQyxFQUNsQyxNQUFjO1FBWmEsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUNuQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLGtDQUE2QixHQUE3Qiw2QkFBNkIsQ0FBK0I7UUFDNUQsaUJBQVksR0FBWixZQUFZ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VUFBVTs7c0JBR04sTUFBTTt1QkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWFwLCBzd2l0Y2hNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4vYXV0aFN0YXRlL2F1dGgtc3RhdGUuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dG9Mb2dpblNlcnZpY2UgfSBmcm9tICcuL2F1dG8tbG9naW4vYXV0by1sb2dpbi1zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FsbGJhY2tTZXJ2aWNlIH0gZnJvbSAnLi9jYWxsYmFjay9jYWxsYmFjay5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUGVyaW9kaWNhbGx5VG9rZW5DaGVja1NlcnZpY2UgfSBmcm9tICcuL2NhbGxiYWNrL3BlcmlvZGljYWxseS10b2tlbi1jaGVjay5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVmcmVzaFNlc3Npb25TZXJ2aWNlIH0gZnJvbSAnLi9jYWxsYmFjay9yZWZyZXNoLXNlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XHJcbmltcG9ydCB7IENoZWNrU2Vzc2lvblNlcnZpY2UgfSBmcm9tICcuL2lmcmFtZS9jaGVjay1zZXNzaW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTaWxlbnRSZW5ld1NlcnZpY2UgfSBmcm9tICcuL2lmcmFtZS9zaWxlbnQtcmVuZXcuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQb3BVcFNlcnZpY2UgfSBmcm9tICcuL2xvZ2luL3BvcHVwL3BvcHVwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4vdXNlckRhdGEvdXNlci1zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENoZWNrQXV0aFNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSByZWFkb25seSBkb2M6IGFueSxcclxuICAgIHByaXZhdGUgY2hlY2tTZXNzaW9uU2VydmljZTogQ2hlY2tTZXNzaW9uU2VydmljZSxcclxuICAgIHByaXZhdGUgc2lsZW50UmVuZXdTZXJ2aWNlOiBTaWxlbnRSZW5ld1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIsXHJcbiAgICBwcml2YXRlIGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNhbGxiYWNrU2VydmljZTogQ2FsbGJhY2tTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWZyZXNoU2Vzc2lvblNlcnZpY2U6IFJlZnJlc2hTZXNzaW9uU2VydmljZSxcclxuICAgIHByaXZhdGUgcGVyaW9kaWNhbGx5VG9rZW5DaGVja1NlcnZpY2U6IFBlcmlvZGljYWxseVRva2VuQ2hlY2tTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBwb3B1cFNlcnZpY2U6IFBvcFVwU2VydmljZSxcclxuICAgIHByaXZhdGUgYXV0b0xvZ2luU2VydmljZTogQXV0b0xvZ2luU2VydmljZSxcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcclxuICApIHt9XHJcblxyXG4gIGNoZWNrQXV0aCh1cmw/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIGlmICghdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuaGFzVmFsaWRDb25maWcoKSkge1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJ1BsZWFzZSBwcm92aWRlIGEgY29uZmlndXJhdGlvbiBiZWZvcmUgc2V0dGluZyB1cCB0aGUgbW9kdWxlJyk7XHJcbiAgICAgIHJldHVybiBvZihmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyBzdHNTZXJ2ZXIgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1NUUyBzZXJ2ZXI6ICcsIHN0c1NlcnZlcik7XHJcblxyXG4gICAgY29uc3QgY3VycmVudFVybCA9IHVybCB8fCB0aGlzLmRvYy5kZWZhdWx0Vmlldy5sb2NhdGlvbi50b1N0cmluZygpO1xyXG5cclxuICAgIGlmICh0aGlzLnBvcHVwU2VydmljZS5pc0N1cnJlbnRseUluUG9wdXAoKSkge1xyXG4gICAgICB0aGlzLnBvcHVwU2VydmljZS5zZW5kTWVzc2FnZVRvTWFpbldpbmRvdyhjdXJyZW50VXJsKTtcclxuICAgICAgcmV0dXJuIG9mKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGlzQ2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrU2VydmljZS5pc0NhbGxiYWNrKGN1cnJlbnRVcmwpO1xyXG5cclxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnY3VycmVudFVybCB0byBjaGVjayBhdXRoIHdpdGg6ICcsIGN1cnJlbnRVcmwpO1xyXG5cclxuICAgIGNvbnN0IGNhbGxiYWNrJCA9IGlzQ2FsbGJhY2sgPyB0aGlzLmNhbGxiYWNrU2VydmljZS5oYW5kbGVDYWxsYmFja0FuZEZpcmVFdmVudHMoY3VycmVudFVybCkgOiBvZihudWxsKTtcclxuXHJcbiAgICByZXR1cm4gY2FsbGJhY2skLnBpcGUoXHJcbiAgICAgIG1hcCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmFyZUF1dGhTdG9yYWdlVG9rZW5zVmFsaWQoKTtcclxuICAgICAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICB0aGlzLnN0YXJ0Q2hlY2tTZXNzaW9uQW5kVmFsaWRhdGlvbigpO1xyXG5cclxuICAgICAgICAgIGlmICghaXNDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhTdGF0ZVNlcnZpY2Uuc2V0QXV0aG9yaXplZEFuZEZpcmVFdmVudCgpO1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlLnB1Ymxpc2hVc2VyRGF0YUlmRXhpc3RzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2NoZWNrQXV0aCBjb21wbGV0ZWQgZmlyZWQgZXZlbnRzLCBhdXRoOiAnICsgaXNBdXRoZW50aWNhdGVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlzQXV0aGVudGljYXRlZDtcclxuICAgICAgfSksXHJcbiAgICAgIHRhcCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmFyZUF1dGhTdG9yYWdlVG9rZW5zVmFsaWQoKTtcclxuXHJcbiAgICAgICAgaWYgKGlzQXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgY29uc3Qgc2F2ZWRSb3V0ZUZvclJlZGlyZWN0ID0gdGhpcy5hdXRvTG9naW5TZXJ2aWNlLmdldFN0b3JlZFJlZGlyZWN0Um91dGUoKTtcclxuXHJcbiAgICAgICAgICBpZiAoc2F2ZWRSb3V0ZUZvclJlZGlyZWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0b0xvZ2luU2VydmljZS5kZWxldGVTdG9yZWRSZWRpcmVjdFJvdXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwoc2F2ZWRSb3V0ZUZvclJlZGlyZWN0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4ge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgcmV0dXJuIG9mKGZhbHNlKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjaGVja0F1dGhJbmNsdWRpbmdTZXJ2ZXIoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jaGVja0F1dGgoKS5waXBlKFxyXG4gICAgICBzd2l0Y2hNYXAoKGlzQXV0aGVudGljYXRlZCkgPT4ge1xyXG4gICAgICAgIGlmIChpc0F1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgIHJldHVybiBvZihpc0F1dGhlbnRpY2F0ZWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVmcmVzaFNlc3Npb25TZXJ2aWNlLmZvcmNlUmVmcmVzaFNlc3Npb24oKS5waXBlKFxyXG4gICAgICAgICAgbWFwKChyZXN1bHQpID0+ICEhcmVzdWx0Py5pZFRva2VuICYmICEhcmVzdWx0Py5hY2Nlc3NUb2tlbiksXHJcbiAgICAgICAgICBzd2l0Y2hNYXAoKGlzQXV0aCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNBdXRoKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zdGFydENoZWNrU2Vzc2lvbkFuZFZhbGlkYXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG9mKGlzQXV0aCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGFydENoZWNrU2Vzc2lvbkFuZFZhbGlkYXRpb24oKSB7XHJcbiAgICBpZiAodGhpcy5jaGVja1Nlc3Npb25TZXJ2aWNlLmlzQ2hlY2tTZXNzaW9uQ29uZmlndXJlZCgpKSB7XHJcbiAgICAgIHRoaXMuY2hlY2tTZXNzaW9uU2VydmljZS5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgdG9rZW5SZWZyZXNoSW5TZWNvbmRzIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XHJcblxyXG4gICAgdGhpcy5wZXJpb2RpY2FsbHlUb2tlbkNoZWNrU2VydmljZS5zdGFydFRva2VuVmFsaWRhdGlvblBlcmlvZGljYWxseSh0b2tlblJlZnJlc2hJblNlY29uZHMpO1xyXG5cclxuICAgIGlmICh0aGlzLnNpbGVudFJlbmV3U2VydmljZS5pc1NpbGVudFJlbmV3Q29uZmlndXJlZCgpKSB7XHJcbiAgICAgIHRoaXMuc2lsZW50UmVuZXdTZXJ2aWNlLmdldE9yQ3JlYXRlSWZyYW1lKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==