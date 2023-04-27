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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAtbG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2xvZ2luL3BvcHVwL3BvcHVwLWxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7QUFldEQsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUNVLGFBQTRCLEVBQzVCLDZCQUE0RCxFQUM1RCxVQUFzQixFQUN0QixxQkFBNEMsRUFDNUMsb0JBQTBDLEVBQzFDLFlBQTBCLEVBQzFCLGdCQUFrQyxFQUNsQyxXQUF3QixFQUN4QixnQkFBa0M7UUFSbEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsa0NBQTZCLEdBQTdCLDZCQUE2QixDQUErQjtRQUM1RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7SUFDekMsQ0FBQztJQUVKLHNCQUFzQixDQUFDLFdBQXlCLEVBQUUsWUFBMkI7UUFDM0UsSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQywwQkFBMEIsRUFBRSxFQUFFO1lBQ3BFLE1BQU0sWUFBWSxHQUFHLHdCQUF3QixDQUFDO1lBQzlDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFDLE9BQU8sVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsTUFBTSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFdEYsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzFCLE1BQU0sWUFBWSxHQUFHLGlDQUFpQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFDLE9BQU8sVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsb0RBQW9ELENBQUMsQ0FBQztRQUVsRixPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyx5QkFBeUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FDcEYsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNiLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxXQUFXLElBQUksRUFBRSxDQUFDO1lBRTNDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRTlELElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUVuRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDbkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ25CLE1BQU0sQ0FBQyxVQUFVLEtBQUssSUFBSTtnQkFDeEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixFQUFFLENBQUM7Z0JBQ25FLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQ3RELEdBQUcsQ0FBQyxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDeEIsZUFBZTtvQkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRTtvQkFDakQsV0FBVyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUU7aUJBQ3BELENBQUMsQ0FBQyxDQUNKLENBQ04sQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7O2tGQXREVSxpQkFBaUI7eURBQWpCLGlCQUFpQixXQUFqQixpQkFBaUI7a0RBQWpCLGlCQUFpQjtjQUQ3QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCwgc3dpdGNoTWFwLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQXV0aE9wdGlvbnMgfSBmcm9tICcuLi8uLi9hdXRoLW9wdGlvbnMnO1xuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4uLy4uL2F1dGhTdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2hlY2tBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL2NoZWNrLWF1dGguc2VydmljZSc7XG5pbXBvcnQgeyBBdXRoV2VsbEtub3duU2VydmljZSB9IGZyb20gJy4uLy4uL2NvbmZpZy9hdXRoLXdlbGwta25vd24uc2VydmljZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi8uLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXNlckRhdGEvdXNlci1zZXJ2aWNlJztcbmltcG9ydCB7IFVybFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy91cmwvdXJsLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9naW5SZXNwb25zZSB9IGZyb20gJy4uL2xvZ2luLXJlc3BvbnNlJztcbmltcG9ydCB7IFBvcHVwT3B0aW9ucyB9IGZyb20gJy4uL3BvcHVwL3BvcHVwLW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9wVXBTZXJ2aWNlIH0gZnJvbSAnLi4vcG9wdXAvcG9wdXAuc2VydmljZSc7XG5pbXBvcnQgeyBSZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uL3Jlc3BvbnNlLXR5cGUtdmFsaWRhdGlvbi9yZXNwb25zZS10eXBlLXZhbGlkYXRpb24uc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb3BVcExvZ2luU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIHJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlOiBSZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIHVybFNlcnZpY2U6IFVybFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIGF1dGhXZWxsS25vd25TZXJ2aWNlOiBBdXRoV2VsbEtub3duU2VydmljZSxcbiAgICBwcml2YXRlIHBvcHVwU2VydmljZTogUG9wVXBTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2hlY2tBdXRoU2VydmljZTogQ2hlY2tBdXRoU2VydmljZSxcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcbiAgICBwcml2YXRlIGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2VcbiAgKSB7fVxuXG4gIGxvZ2luV2l0aFBvcFVwU3RhbmRhcmQoYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zPzogUG9wdXBPcHRpb25zKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlPiB7XG4gICAgaWYgKCF0aGlzLnJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLmhhc0NvbmZpZ1ZhbGlkUmVzcG9uc2VUeXBlKCkpIHtcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdJbnZhbGlkIHJlc3BvbnNlIHR5cGUhJztcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGF1dGhXZWxsa25vd25FbmRwb2ludCB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgaWYgKCFhdXRoV2VsbGtub3duRW5kcG9pbnQpIHtcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdubyBhdXRoV2VsbGtub3duRW5kcG9pbnQgZ2l2ZW4hJztcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0JFR0lOIEF1dGhvcml6ZSBPSURDIEZsb3cgd2l0aCBwb3B1cCwgbm8gYXV0aCBkYXRhJyk7XG5cbiAgICByZXR1cm4gdGhpcy5hdXRoV2VsbEtub3duU2VydmljZS5nZXRBdXRoV2VsbEtub3duRW5kUG9pbnRzKGF1dGhXZWxsa25vd25FbmRwb2ludCkucGlwZShcbiAgICAgIHN3aXRjaE1hcCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY3VzdG9tUGFyYW1zIH0gPSBhdXRoT3B0aW9ucyB8fCB7fTtcblxuICAgICAgICBjb25zdCBhdXRoVXJsID0gdGhpcy51cmxTZXJ2aWNlLmdldEF1dGhvcml6ZVVybChjdXN0b21QYXJhbXMpO1xuXG4gICAgICAgIHRoaXMucG9wdXBTZXJ2aWNlLm9wZW5Qb3BVcChhdXRoVXJsLCBwb3B1cE9wdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBvcHVwU2VydmljZS5yZXN1bHQkLnBpcGUoXG4gICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICBzd2l0Y2hNYXAoKHJlc3VsdCkgPT5cbiAgICAgICAgICAgIHJlc3VsdC51c2VyQ2xvc2VkID09PSB0cnVlXG4gICAgICAgICAgICAgID8gb2YoeyBpc0F1dGhlbnRpY2F0ZWQ6IGZhbHNlLCBlcnJvck1lc3NhZ2U6ICdVc2VyIGNsb3NlZCBwb3B1cCcgfSlcbiAgICAgICAgICAgICAgOiB0aGlzLmNoZWNrQXV0aFNlcnZpY2UuY2hlY2tBdXRoKHJlc3VsdC5yZWNlaXZlZFVybCkucGlwZShcbiAgICAgICAgICAgICAgICAgIG1hcCgoaXNBdXRoZW50aWNhdGVkKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQsXG4gICAgICAgICAgICAgICAgICAgIHVzZXJEYXRhOiB0aGlzLnVzZXJTZXJ2aWNlLmdldFVzZXJEYXRhRnJvbVN0b3JlKCksXG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuZ2V0QWNjZXNzVG9rZW4oKSxcbiAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cbiJdfQ==