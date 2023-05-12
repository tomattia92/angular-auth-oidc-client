import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../response-type-validation/response-type-validation.service";
import * as i3 from "../../utils/url/url.service";
import * as i4 from "../../utils/redirect/redirect.service";
import * as i5 from "../../config/config.provider";
import * as i6 from "../../config/auth-well-known.service";
import * as i7 from "../popup/popup.service";
import * as i8 from "../../check-auth.service";
import * as i9 from "../../userData/user-service";
import * as i10 from "../../authState/auth-state.service";
import * as i11 from "./par.service";
export class ParLoginService {
    constructor(loggerService, responseTypeValidationService, urlService, redirectService, configurationProvider, authWellKnownService, popupService, checkAuthService, userService, authStateService, parService) {
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
    loginPar(authOptions) {
        if (!this.responseTypeValidationService.hasConfigValidResponseType()) {
            this.loggerService.logError('Invalid response type!');
            return;
        }
        const { authWellknownEndpoint } = this.configurationProvider.getOpenIDConfiguration();
        if (!authWellknownEndpoint) {
            this.loggerService.logError('no authWellknownEndpoint given!');
            return;
        }
        this.loggerService.logDebug('BEGIN Authorize OIDC Flow, no auth data');
        const { urlHandler, customParams } = authOptions || {};
        this.authWellKnownService
            .getAuthWellKnownEndPoints(authWellknownEndpoint)
            .pipe(switchMap(() => this.parService.postParRequest(customParams)))
            .subscribe((response) => {
            this.loggerService.logDebug('par response: ', response);
            const url = this.urlService.getAuthorizeParUrl(response.requestUri);
            this.loggerService.logDebug('par request url: ', url);
            if (!url) {
                this.loggerService.logError(`Could not create url with param ${response.requestUri}: '${url}'`);
                return;
            }
            if (urlHandler) {
                urlHandler(url);
            }
            else {
                this.redirectService.redirectTo(url);
            }
        });
    }
    loginWithPopUpPar(authOptions, popupOptions) {
        if (!this.responseTypeValidationService.hasConfigValidResponseType()) {
            const errorMessage = 'Invalid response type!';
            this.loggerService.logError(errorMessage);
            return throwError(errorMessage);
        }
        const { authWellknownEndpoint } = this.configurationProvider.getOpenIDConfiguration();
        if (!authWellknownEndpoint) {
            const errorMessage = 'no authWellknownEndpoint given!';
            this.loggerService.logError(errorMessage);
            return throwError(errorMessage);
        }
        this.loggerService.logDebug('BEGIN Authorize OIDC Flow with popup, no auth data');
        const { customParams } = authOptions || {};
        return this.authWellKnownService.getAuthWellKnownEndPoints(authWellknownEndpoint).pipe(switchMap(() => this.parService.postParRequest(customParams)), switchMap((response) => {
            this.loggerService.logDebug('par response: ', response);
            const url = this.urlService.getAuthorizeParUrl(response.requestUri);
            this.loggerService.logDebug('par request url: ', url);
            if (!url) {
                const errorMessage = `Could not create url with param ${response.requestUri}: 'url'`;
                this.loggerService.logError(errorMessage);
                return throwError(errorMessage);
            }
            this.popupService.openPopUp(url, popupOptions);
            return this.popupService.result$.pipe(take(1), switchMap((result) => result.userClosed === true
                ? of({ isAuthenticated: false, errorMessage: 'User closed popup' })
                : this.checkAuthService.checkAuth(result.receivedUrl).pipe(map((isAuthenticated) => ({
                    isAuthenticated,
                    userData: this.userService.getUserDataFromStore(),
                    accessToken: this.authStateService.getAccessToken(),
                })))));
        }));
    }
}
ParLoginService.ɵfac = function ParLoginService_Factory(t) { return new (t || ParLoginService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.ResponseTypeValidationService), i0.ɵɵinject(i3.UrlService), i0.ɵɵinject(i4.RedirectService), i0.ɵɵinject(i5.ConfigurationProvider), i0.ɵɵinject(i6.AuthWellKnownService), i0.ɵɵinject(i7.PopUpService), i0.ɵɵinject(i8.CheckAuthService), i0.ɵɵinject(i9.UserService), i0.ɵɵinject(i10.AuthStateService), i0.ɵɵinject(i11.ParService)); };
ParLoginService.ɵprov = i0.ɵɵdefineInjectable({ token: ParLoginService, factory: ParLoginService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ParLoginService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }, { type: i2.ResponseTypeValidationService }, { type: i3.UrlService }, { type: i4.RedirectService }, { type: i5.ConfigurationProvider }, { type: i6.AuthWellKnownService }, { type: i7.PopUpService }, { type: i8.CheckAuthService }, { type: i9.UserService }, { type: i10.AuthStateService }, { type: i11.ParService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyLWxvZ2luLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9sb2dpbi9wYXIvcGFyLWxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWtCdEQsTUFBTSxPQUFPLGVBQWU7SUFDMUIsWUFDVSxhQUE0QixFQUM1Qiw2QkFBNEQsRUFDNUQsVUFBc0IsRUFDdEIsZUFBZ0MsRUFDaEMscUJBQTRDLEVBQzVDLG9CQUEwQyxFQUMxQyxZQUEwQixFQUMxQixnQkFBa0MsRUFDbEMsV0FBd0IsRUFDeEIsZ0JBQWtDLEVBQ2xDLFVBQXNCO1FBVnRCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGtDQUE2QixHQUE3Qiw2QkFBNkIsQ0FBK0I7UUFDNUQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1Qyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxlQUFVLEdBQVYsVUFBVSxDQUFZO0lBQzdCLENBQUM7SUFFSixRQUFRLENBQUMsV0FBeUI7UUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyww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SUFDSixDQUFDOzs4RUEzR1UsZUFBZTt1REFBZixlQUFlLFdBQWYsZUFBZTtrREFBZixlQUFlO2NBRDNCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCwgc3dpdGNoTWFwLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBBdXRoT3B0aW9ucyB9IGZyb20gJy4uLy4uL2F1dGgtb3B0aW9ucyc7XHJcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hdXRoU3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2hlY2tBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL2NoZWNrLWF1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhXZWxsS25vd25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY29uZmlnL2F1dGgtd2VsbC1rbm93bi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi8uLi91c2VyRGF0YS91c2VyLXNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZWRpcmVjdFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9yZWRpcmVjdC9yZWRpcmVjdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXJsU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3VybC91cmwuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2luUmVzcG9uc2UgfSBmcm9tICcuLi9sb2dpbi1yZXNwb25zZSc7XHJcbmltcG9ydCB7IFBvcHVwT3B0aW9ucyB9IGZyb20gJy4uL3BvcHVwL3BvcHVwLW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBQb3BVcFNlcnZpY2UgfSBmcm9tICcuLi9wb3B1cC9wb3B1cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9yZXNwb25zZS10eXBlLXZhbGlkYXRpb24vcmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQYXJSZXNwb25zZSB9IGZyb20gJy4vcGFyLXJlc3BvbnNlJztcclxuaW1wb3J0IHsgUGFyU2VydmljZSB9IGZyb20gJy4vcGFyLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUGFyTG9naW5TZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2U6IFJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSB1cmxTZXJ2aWNlOiBVcmxTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWRpcmVjdFNlcnZpY2U6IFJlZGlyZWN0U2VydmljZSxcclxuICAgIHByaXZhdGUgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIsXHJcbiAgICBwcml2YXRlIGF1dGhXZWxsS25vd25TZXJ2aWNlOiBBdXRoV2VsbEtub3duU2VydmljZSxcclxuICAgIHByaXZhdGUgcG9wdXBTZXJ2aWNlOiBQb3BVcFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNoZWNrQXV0aFNlcnZpY2U6IENoZWNrQXV0aFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgYXV0aFN0YXRlU2VydmljZTogQXV0aFN0YXRlU2VydmljZSxcclxuICAgIHByaXZhdGUgcGFyU2VydmljZTogUGFyU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgbG9naW5QYXIoYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLnJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLmhhc0NvbmZpZ1ZhbGlkUmVzcG9uc2VUeXBlKCkpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKCdJbnZhbGlkIHJlc3BvbnNlIHR5cGUhJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IGF1dGhXZWxsa25vd25FbmRwb2ludCB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xyXG5cclxuICAgIGlmICghYXV0aFdlbGxrbm93bkVuZHBvaW50KSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignbm8gYXV0aFdlbGxrbm93bkVuZHBvaW50IGdpdmVuIScpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdCRUdJTiBBdXRob3JpemUgT0lEQyBGbG93LCBubyBhdXRoIGRhdGEnKTtcclxuXHJcbiAgICBjb25zdCB7IHVybEhhbmRsZXIsIGN1c3RvbVBhcmFtcyB9ID0gYXV0aE9wdGlvbnMgfHwge307XHJcblxyXG4gICAgdGhpcy5hdXRoV2VsbEtub3duU2VydmljZVxyXG4gICAgICAuZ2V0QXV0aFdlbGxLbm93bkVuZFBvaW50cyhhdXRoV2VsbGtub3duRW5kcG9pbnQpXHJcbiAgICAgIC5waXBlKHN3aXRjaE1hcCgoKSA9PiB0aGlzLnBhclNlcnZpY2UucG9zdFBhclJlcXVlc3QoY3VzdG9tUGFyYW1zKSkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdwYXIgcmVzcG9uc2U6ICcsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy51cmxTZXJ2aWNlLmdldEF1dGhvcml6ZVBhclVybChyZXNwb25zZS5yZXF1ZXN0VXJpKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdwYXIgcmVxdWVzdCB1cmw6ICcsIHVybCk7XHJcblxyXG4gICAgICAgIGlmICghdXJsKSB7XHJcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYENvdWxkIG5vdCBjcmVhdGUgdXJsIHdpdGggcGFyYW0gJHtyZXNwb25zZS5yZXF1ZXN0VXJpfTogJyR7dXJsfSdgKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1cmxIYW5kbGVyKSB7XHJcbiAgICAgICAgICB1cmxIYW5kbGVyKHVybCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVkaXJlY3RTZXJ2aWNlLnJlZGlyZWN0VG8odXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbG9naW5XaXRoUG9wVXBQYXIoYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zPzogUG9wdXBPcHRpb25zKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlPiB7XHJcbiAgICBpZiAoIXRoaXMucmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UuaGFzQ29uZmlnVmFsaWRSZXNwb25zZVR5cGUoKSkge1xyXG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSAnSW52YWxpZCByZXNwb25zZSB0eXBlISc7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvck1lc3NhZ2UpO1xyXG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgYXV0aFdlbGxrbm93bkVuZHBvaW50IH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XHJcblxyXG4gICAgaWYgKCFhdXRoV2VsbGtub3duRW5kcG9pbnQpIHtcclxuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJ25vIGF1dGhXZWxsa25vd25FbmRwb2ludCBnaXZlbiEnO1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0JFR0lOIEF1dGhvcml6ZSBPSURDIEZsb3cgd2l0aCBwb3B1cCwgbm8gYXV0aCBkYXRhJyk7XHJcblxyXG4gICAgY29uc3QgeyBjdXN0b21QYXJhbXMgfSA9IGF1dGhPcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIHJldHVybiB0aGlzLmF1dGhXZWxsS25vd25TZXJ2aWNlLmdldEF1dGhXZWxsS25vd25FbmRQb2ludHMoYXV0aFdlbGxrbm93bkVuZHBvaW50KS5waXBlKFxyXG4gICAgICBzd2l0Y2hNYXAoKCkgPT4gdGhpcy5wYXJTZXJ2aWNlLnBvc3RQYXJSZXF1ZXN0KGN1c3RvbVBhcmFtcykpLFxyXG4gICAgICBzd2l0Y2hNYXAoKHJlc3BvbnNlOiBQYXJSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygncGFyIHJlc3BvbnNlOiAnLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMudXJsU2VydmljZS5nZXRBdXRob3JpemVQYXJVcmwocmVzcG9uc2UucmVxdWVzdFVyaSk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygncGFyIHJlcXVlc3QgdXJsOiAnLCB1cmwpO1xyXG5cclxuICAgICAgICBpZiAoIXVybCkge1xyXG4gICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYENvdWxkIG5vdCBjcmVhdGUgdXJsIHdpdGggcGFyYW0gJHtyZXNwb25zZS5yZXF1ZXN0VXJpfTogJ3VybCdgO1xyXG4gICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wb3B1cFNlcnZpY2Uub3BlblBvcFVwKHVybCwgcG9wdXBPcHRpb25zKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wdXBTZXJ2aWNlLnJlc3VsdCQucGlwZShcclxuICAgICAgICAgIHRha2UoMSksXHJcbiAgICAgICAgICBzd2l0Y2hNYXAoKHJlc3VsdCkgPT5cclxuICAgICAgICAgICAgcmVzdWx0LnVzZXJDbG9zZWQgPT09IHRydWVcclxuICAgICAgICAgICAgICA/IG9mKHsgaXNBdXRoZW50aWNhdGVkOiBmYWxzZSwgZXJyb3JNZXNzYWdlOiAnVXNlciBjbG9zZWQgcG9wdXAnIH0pXHJcbiAgICAgICAgICAgICAgOiB0aGlzLmNoZWNrQXV0aFNlcnZpY2UuY2hlY2tBdXRoKHJlc3VsdC5yZWNlaXZlZFVybCkucGlwZShcclxuICAgICAgICAgICAgICAgICAgbWFwKChpc0F1dGhlbnRpY2F0ZWQpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJEYXRhOiB0aGlzLnVzZXJTZXJ2aWNlLmdldFVzZXJEYXRhRnJvbVN0b3JlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IHRoaXMuYXV0aFN0YXRlU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpLFxyXG4gICAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgIClcclxuICAgICAgICApO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19