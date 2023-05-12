import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../response-type-validation/response-type-validation.service";
import * as i3 from "../../utils/url/url.service";
import * as i4 from "../../config/config.provider";
import * as i5 from "../../config/auth-well-known.service";
import * as i6 from "../popup/popup.service";
import * as i7 from "../../check-auth.service";
import * as i8 from "../../userData/user-service";
import * as i9 from "../../authState/auth-state.service";
export class PopUpLoginService {
    constructor(loggerService, responseTypeValidationService, urlService, configurationProvider, authWellKnownService, popupService, checkAuthService, userService, authStateService) {
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
    loginWithPopUpStandard(authOptions, popupOptions) {
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
        return this.authWellKnownService.getAuthWellKnownEndPoints(authWellknownEndpoint).pipe(switchMap(() => {
            const { customParams } = authOptions || {};
            const authUrl = this.urlService.getAuthorizeUrl(customParams);
            this.popupService.openPopUp(authUrl, popupOptions);
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
PopUpLoginService.ɵfac = function PopUpLoginService_Factory(t) { return new (t || PopUpLoginService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.ResponseTypeValidationService), i0.ɵɵinject(i3.UrlService), i0.ɵɵinject(i4.ConfigurationProvider), i0.ɵɵinject(i5.AuthWellKnownService), i0.ɵɵinject(i6.PopUpService), i0.ɵɵinject(i7.CheckAuthService), i0.ɵɵinject(i8.UserService), i0.ɵɵinject(i9.AuthStateService)); };
PopUpLoginService.ɵprov = i0.ɵɵdefineInjectable({ token: PopUpLoginService, factory: PopUpLoginService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(PopUpLoginService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }, { type: i2.ResponseTypeValidationService }, { type: i3.UrlService }, { type: i4.ConfigurationProvider }, { type: i5.AuthWellKnownService }, { type: i6.PopUpService }, { type: i7.CheckAuthService }, { type: i8.UserService }, { type: i9.AuthStateService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAtbG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2xvZ2luL3BvcHVwL3BvcHVwLWxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7QUFldEQsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUNVLGFBQTRCLEVBQzVCLDZCQUE0RCxFQUM1RCxVQUFzQixFQUN0QixxQkFBNEMsRUFDNUMsb0JBQTBDLEVBQzFDLFlBQTBCLEVBQzFCLGdCQUFrQyxFQUNsQyxXQUF3QixFQUN4QixnQkFBa0M7UUFSbEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsa0NBQTZCLEdBQTdCLDZCQUE2QixDQUErQjtRQUM1RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7SUFDekMsQ0FBQztJQUVKLHNCQUFzQixDQUFDLFdBQXlCLEVBQUUsWUFBMkI7UUFDM0UsSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQywwQkFBMEIsRUFBRSxFQUFFO1lBQ3BFLE1BQU0sWUFBWSxHQUFHLHdCQUF3QixDQUFDO1lBQzlDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFDLE9BQU8sVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsTUFBTSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFdEYsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzFCLE1BQU0sWUFBWSxHQUFHLGlDQUFpQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFDLE9BQU8sVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsb0RBQW9ELENBQUMsQ0FBQztRQUVsRixPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyx5QkFBeUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FDcEYsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNiLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxXQUFXLElBQUksRUFBRSxDQUFDO1lBRTNDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRTlELElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUVuRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDbkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ25CLE1BQU0sQ0FBQyxVQUFVLEtBQUssSUFBSTtnQkFDeEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixFQUFFLENBQUM7Z0JBQ25FLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQ3RELEdBQUcsQ0FBQyxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDeEIsZUFBZTtvQkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRTtvQkFDakQsV0FBVyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUU7aUJBQ3BELENBQUMsQ0FBQyxDQUNKLENBQ04sQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7O2tGQXREVSxpQkFBaUI7eURBQWpCLGlCQUFpQixXQUFqQixpQkFBaUI7a0RBQWpCLGlCQUFpQjtjQUQ3QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAsIHN3aXRjaE1hcCwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQXV0aE9wdGlvbnMgfSBmcm9tICcuLi8uLi9hdXRoLW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBBdXRoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYXV0aFN0YXRlL2F1dGgtc3RhdGUuc2VydmljZSc7XHJcbmltcG9ydCB7IENoZWNrQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9jaGVjay1hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoV2VsbEtub3duU2VydmljZSB9IGZyb20gJy4uLy4uL2NvbmZpZy9hdXRoLXdlbGwta25vd24uc2VydmljZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uLy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXNlckRhdGEvdXNlci1zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXJsU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3VybC91cmwuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2luUmVzcG9uc2UgfSBmcm9tICcuLi9sb2dpbi1yZXNwb25zZSc7XHJcbmltcG9ydCB7IFBvcHVwT3B0aW9ucyB9IGZyb20gJy4uL3BvcHVwL3BvcHVwLW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBQb3BVcFNlcnZpY2UgfSBmcm9tICcuLi9wb3B1cC9wb3B1cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9yZXNwb25zZS10eXBlLXZhbGlkYXRpb24vcmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUG9wVXBMb2dpblNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZTogUmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHVybFNlcnZpY2U6IFVybFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyLFxyXG4gICAgcHJpdmF0ZSBhdXRoV2VsbEtub3duU2VydmljZTogQXV0aFdlbGxLbm93blNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHBvcHVwU2VydmljZTogUG9wVXBTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBjaGVja0F1dGhTZXJ2aWNlOiBDaGVja0F1dGhTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSB1c2VyU2VydmljZTogVXNlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIGxvZ2luV2l0aFBvcFVwU3RhbmRhcmQoYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zPzogUG9wdXBPcHRpb25zKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlPiB7XHJcbiAgICBpZiAoIXRoaXMucmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UuaGFzQ29uZmlnVmFsaWRSZXNwb25zZVR5cGUoKSkge1xyXG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSAnSW52YWxpZCByZXNwb25zZSB0eXBlISc7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvck1lc3NhZ2UpO1xyXG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgYXV0aFdlbGxrbm93bkVuZHBvaW50IH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XHJcblxyXG4gICAgaWYgKCFhdXRoV2VsbGtub3duRW5kcG9pbnQpIHtcclxuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJ25vIGF1dGhXZWxsa25vd25FbmRwb2ludCBnaXZlbiEnO1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0JFR0lOIEF1dGhvcml6ZSBPSURDIEZsb3cgd2l0aCBwb3B1cCwgbm8gYXV0aCBkYXRhJyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYXV0aFdlbGxLbm93blNlcnZpY2UuZ2V0QXV0aFdlbGxLbm93bkVuZFBvaW50cyhhdXRoV2VsbGtub3duRW5kcG9pbnQpLnBpcGUoXHJcbiAgICAgIHN3aXRjaE1hcCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBjdXN0b21QYXJhbXMgfSA9IGF1dGhPcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICBjb25zdCBhdXRoVXJsID0gdGhpcy51cmxTZXJ2aWNlLmdldEF1dGhvcml6ZVVybChjdXN0b21QYXJhbXMpO1xyXG5cclxuICAgICAgICB0aGlzLnBvcHVwU2VydmljZS5vcGVuUG9wVXAoYXV0aFVybCwgcG9wdXBPcHRpb25zKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wdXBTZXJ2aWNlLnJlc3VsdCQucGlwZShcclxuICAgICAgICAgIHRha2UoMSksXHJcbiAgICAgICAgICBzd2l0Y2hNYXAoKHJlc3VsdCkgPT5cclxuICAgICAgICAgICAgcmVzdWx0LnVzZXJDbG9zZWQgPT09IHRydWVcclxuICAgICAgICAgICAgICA/IG9mKHsgaXNBdXRoZW50aWNhdGVkOiBmYWxzZSwgZXJyb3JNZXNzYWdlOiAnVXNlciBjbG9zZWQgcG9wdXAnIH0pXHJcbiAgICAgICAgICAgICAgOiB0aGlzLmNoZWNrQXV0aFNlcnZpY2UuY2hlY2tBdXRoKHJlc3VsdC5yZWNlaXZlZFVybCkucGlwZShcclxuICAgICAgICAgICAgICAgICAgbWFwKChpc0F1dGhlbnRpY2F0ZWQpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJEYXRhOiB0aGlzLnVzZXJTZXJ2aWNlLmdldFVzZXJEYXRhRnJvbVN0b3JlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IHRoaXMuYXV0aFN0YXRlU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpLFxyXG4gICAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgIClcclxuICAgICAgICApO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19