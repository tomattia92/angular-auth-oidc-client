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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyLWxvZ2luLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9sb2dpbi9wYXIvcGFyLWxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWtCdEQsTUFBTSxPQUFPLGVBQWU7SUFDMUIsWUFDVSxhQUE0QixFQUM1Qiw2QkFBNEQsRUFDNUQsVUFBc0IsRUFDdEIsZUFBZ0MsRUFDaEMscUJBQTRDLEVBQzVDLG9CQUEwQyxFQUMxQyxZQUEwQixFQUMxQixnQkFBa0MsRUFDbEMsV0FBd0IsRUFDeEIsZ0JBQWtDLEVBQ2xDLFVBQXNCO1FBVnRCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGtDQUE2QixHQUE3Qiw2QkFBNkIsQ0FBK0I7UUFDNUQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1Qyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxlQUFVLEdBQVYsVUFBVSxDQUFZO0lBQzdCLENBQUM7SUFFSixRQUFRLENBQUMsV0FBeUI7UUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyww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SUFDSixDQUFDOzs4RUEzR1UsZUFBZTt1REFBZixlQUFlLFdBQWYsZUFBZTtrREFBZixlQUFlO2NBRDNCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBzd2l0Y2hNYXAsIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBBdXRoT3B0aW9ucyB9IGZyb20gJy4uLy4uL2F1dGgtb3B0aW9ucyc7XG5pbXBvcnQgeyBBdXRoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYXV0aFN0YXRlL2F1dGgtc3RhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBDaGVja0F1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2hlY2stYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IEF1dGhXZWxsS25vd25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY29uZmlnL2F1dGgtd2VsbC1rbm93bi5zZXJ2aWNlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uLy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi8uLi91c2VyRGF0YS91c2VyLXNlcnZpY2UnO1xuaW1wb3J0IHsgUmVkaXJlY3RTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcmVkaXJlY3QvcmVkaXJlY3Quc2VydmljZSc7XG5pbXBvcnQgeyBVcmxTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXJsL3VybC5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ2luUmVzcG9uc2UgfSBmcm9tICcuLi9sb2dpbi1yZXNwb25zZSc7XG5pbXBvcnQgeyBQb3B1cE9wdGlvbnMgfSBmcm9tICcuLi9wb3B1cC9wb3B1cC1vcHRpb25zJztcbmltcG9ydCB7IFBvcFVwU2VydmljZSB9IGZyb20gJy4uL3BvcHVwL3BvcHVwLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9yZXNwb25zZS10eXBlLXZhbGlkYXRpb24vcmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGFyUmVzcG9uc2UgfSBmcm9tICcuL3Bhci1yZXNwb25zZSc7XG5pbXBvcnQgeyBQYXJTZXJ2aWNlIH0gZnJvbSAnLi9wYXIuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQYXJMb2dpblNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZTogUmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSB1cmxTZXJ2aWNlOiBVcmxTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVkaXJlY3RTZXJ2aWNlOiBSZWRpcmVjdFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIGF1dGhXZWxsS25vd25TZXJ2aWNlOiBBdXRoV2VsbEtub3duU2VydmljZSxcbiAgICBwcml2YXRlIHBvcHVwU2VydmljZTogUG9wVXBTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2hlY2tBdXRoU2VydmljZTogQ2hlY2tBdXRoU2VydmljZSxcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcbiAgICBwcml2YXRlIGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwYXJTZXJ2aWNlOiBQYXJTZXJ2aWNlXG4gICkge31cblxuICBsb2dpblBhcihhdXRoT3B0aW9ucz86IEF1dGhPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLmhhc0NvbmZpZ1ZhbGlkUmVzcG9uc2VUeXBlKCkpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignSW52YWxpZCByZXNwb25zZSB0eXBlIScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgYXV0aFdlbGxrbm93bkVuZHBvaW50IH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICBpZiAoIWF1dGhXZWxsa25vd25FbmRwb2ludCkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKCdubyBhdXRoV2VsbGtub3duRW5kcG9pbnQgZ2l2ZW4hJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdCRUdJTiBBdXRob3JpemUgT0lEQyBGbG93LCBubyBhdXRoIGRhdGEnKTtcblxuICAgIGNvbnN0IHsgdXJsSGFuZGxlciwgY3VzdG9tUGFyYW1zIH0gPSBhdXRoT3B0aW9ucyB8fCB7fTtcblxuICAgIHRoaXMuYXV0aFdlbGxLbm93blNlcnZpY2VcbiAgICAgIC5nZXRBdXRoV2VsbEtub3duRW5kUG9pbnRzKGF1dGhXZWxsa25vd25FbmRwb2ludClcbiAgICAgIC5waXBlKHN3aXRjaE1hcCgoKSA9PiB0aGlzLnBhclNlcnZpY2UucG9zdFBhclJlcXVlc3QoY3VzdG9tUGFyYW1zKSkpXG4gICAgICAuc3Vic2NyaWJlKChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3BhciByZXNwb25zZTogJywgcmVzcG9uc2UpO1xuXG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMudXJsU2VydmljZS5nZXRBdXRob3JpemVQYXJVcmwocmVzcG9uc2UucmVxdWVzdFVyaSk7XG5cbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdwYXIgcmVxdWVzdCB1cmw6ICcsIHVybCk7XG5cbiAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYENvdWxkIG5vdCBjcmVhdGUgdXJsIHdpdGggcGFyYW0gJHtyZXNwb25zZS5yZXF1ZXN0VXJpfTogJyR7dXJsfSdgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXJsSGFuZGxlcikge1xuICAgICAgICAgIHVybEhhbmRsZXIodXJsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlZGlyZWN0U2VydmljZS5yZWRpcmVjdFRvKHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbG9naW5XaXRoUG9wVXBQYXIoYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zPzogUG9wdXBPcHRpb25zKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlPiB7XG4gICAgaWYgKCF0aGlzLnJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLmhhc0NvbmZpZ1ZhbGlkUmVzcG9uc2VUeXBlKCkpIHtcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdJbnZhbGlkIHJlc3BvbnNlIHR5cGUhJztcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGF1dGhXZWxsa25vd25FbmRwb2ludCB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgaWYgKCFhdXRoV2VsbGtub3duRW5kcG9pbnQpIHtcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdubyBhdXRoV2VsbGtub3duRW5kcG9pbnQgZ2l2ZW4hJztcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0JFR0lOIEF1dGhvcml6ZSBPSURDIEZsb3cgd2l0aCBwb3B1cCwgbm8gYXV0aCBkYXRhJyk7XG5cbiAgICBjb25zdCB7IGN1c3RvbVBhcmFtcyB9ID0gYXV0aE9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gdGhpcy5hdXRoV2VsbEtub3duU2VydmljZS5nZXRBdXRoV2VsbEtub3duRW5kUG9pbnRzKGF1dGhXZWxsa25vd25FbmRwb2ludCkucGlwZShcbiAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aGlzLnBhclNlcnZpY2UucG9zdFBhclJlcXVlc3QoY3VzdG9tUGFyYW1zKSksXG4gICAgICBzd2l0Y2hNYXAoKHJlc3BvbnNlOiBQYXJSZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3BhciByZXNwb25zZTogJywgcmVzcG9uc2UpO1xuXG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMudXJsU2VydmljZS5nZXRBdXRob3JpemVQYXJVcmwocmVzcG9uc2UucmVxdWVzdFVyaSk7XG5cbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdwYXIgcmVxdWVzdCB1cmw6ICcsIHVybCk7XG5cbiAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgQ291bGQgbm90IGNyZWF0ZSB1cmwgd2l0aCBwYXJhbSAke3Jlc3BvbnNlLnJlcXVlc3RVcml9OiAndXJsJ2A7XG4gICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucG9wdXBTZXJ2aWNlLm9wZW5Qb3BVcCh1cmwsIHBvcHVwT3B0aW9ucyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucG9wdXBTZXJ2aWNlLnJlc3VsdCQucGlwZShcbiAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgIHN3aXRjaE1hcCgocmVzdWx0KSA9PlxuICAgICAgICAgICAgcmVzdWx0LnVzZXJDbG9zZWQgPT09IHRydWVcbiAgICAgICAgICAgICAgPyBvZih7IGlzQXV0aGVudGljYXRlZDogZmFsc2UsIGVycm9yTWVzc2FnZTogJ1VzZXIgY2xvc2VkIHBvcHVwJyB9KVxuICAgICAgICAgICAgICA6IHRoaXMuY2hlY2tBdXRoU2VydmljZS5jaGVja0F1dGgocmVzdWx0LnJlY2VpdmVkVXJsKS5waXBlKFxuICAgICAgICAgICAgICAgICAgbWFwKChpc0F1dGhlbnRpY2F0ZWQpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgdXNlckRhdGE6IHRoaXMudXNlclNlcnZpY2UuZ2V0VXNlckRhdGFGcm9tU3RvcmUoKSxcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IHRoaXMuYXV0aFN0YXRlU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpLFxuICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIl19