import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../response-type-validation/response-type-validation.service";
import * as i3 from "../../utils/url/url.service";
import * as i4 from "../../utils/redirect/redirect.service";
import * as i5 from "../../config/config.provider";
import * as i6 from "../../config/auth-well-known.service";
export class StandardLoginService {
    constructor(loggerService, responseTypeValidationService, urlService, redirectService, configurationProvider, authWellKnownService) {
        this.loggerService = loggerService;
        this.responseTypeValidationService = responseTypeValidationService;
        this.urlService = urlService;
        this.redirectService = redirectService;
        this.configurationProvider = configurationProvider;
        this.authWellKnownService = authWellKnownService;
    }
    loginStandard(authOptions) {
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
        this.authWellKnownService.getAuthWellKnownEndPoints(authWellknownEndpoint).subscribe(() => {
            const { urlHandler, customParams } = authOptions || {};
            const url = this.urlService.getAuthorizeUrl(customParams);
            if (!url) {
                this.loggerService.logError('Could not create url', url);
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
}
StandardLoginService.ɵfac = function StandardLoginService_Factory(t) { return new (t || StandardLoginService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.ResponseTypeValidationService), i0.ɵɵinject(i3.UrlService), i0.ɵɵinject(i4.RedirectService), i0.ɵɵinject(i5.ConfigurationProvider), i0.ɵɵinject(i6.AuthWellKnownService)); };
StandardLoginService.ɵprov = i0.ɵɵdefineInjectable({ token: StandardLoginService, factory: StandardLoginService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(StandardLoginService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }, { type: i2.ResponseTypeValidationService }, { type: i3.UrlService }, { type: i4.RedirectService }, { type: i5.ConfigurationProvider }, { type: i6.AuthWellKnownService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhbmRhcmQtbG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2xvZ2luL3N0YW5kYXJkL3N0YW5kYXJkLWxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7QUFVM0MsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixZQUNVLGFBQTRCLEVBQzVCLDZCQUE0RCxFQUM1RCxVQUFzQixFQUN0QixlQUFnQyxFQUNoQyxxQkFBNEMsRUFDNUMsb0JBQTBDO1FBTDFDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGtDQUE2QixHQUE3Qiw2QkFBNkIsQ0FBK0I7UUFDNUQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1Qyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO0lBQ2pELENBQUM7SUFFSixhQUFhLENBQUMsV0FBeUI7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQywwQkFBMEIsRUFBRSxFQUFFO1lBQ3BFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDdEQsT0FBTztTQUNSO1FBRUQsTUFBTSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFdEYsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7WUFDL0QsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMseUNBQXlDLENBQUMsQ0FBQztRQUV2RSxJQUFJLENBQUMsb0JBQW9CLENBQUMseUJBQXlCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3hGLE1BQU0sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEdBQUcsV0FBVyxJQUFJLEVBQUUsQ0FBQztZQUV2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUUxRCxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNSLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6RCxPQUFPO2FBQ1I7WUFFRCxJQUFJLFVBQVUsRUFBRTtnQkFDZCxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdEM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O3dGQXpDVSxvQkFBb0I7NERBQXBCLG9CQUFvQixXQUFwQixvQkFBb0I7a0RBQXBCLG9CQUFvQjtjQURoQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXV0aE9wdGlvbnMgfSBmcm9tICcuLi8uLi9hdXRoLW9wdGlvbnMnO1xuaW1wb3J0IHsgQXV0aFdlbGxLbm93blNlcnZpY2UgfSBmcm9tICcuLi8uLi9jb25maWcvYXV0aC13ZWxsLWtub3duLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBSZWRpcmVjdFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9yZWRpcmVjdC9yZWRpcmVjdC5zZXJ2aWNlJztcbmltcG9ydCB7IFVybFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy91cmwvdXJsLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9yZXNwb25zZS10eXBlLXZhbGlkYXRpb24vcmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RhbmRhcmRMb2dpblNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZTogUmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSB1cmxTZXJ2aWNlOiBVcmxTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVkaXJlY3RTZXJ2aWNlOiBSZWRpcmVjdFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIGF1dGhXZWxsS25vd25TZXJ2aWNlOiBBdXRoV2VsbEtub3duU2VydmljZVxuICApIHt9XG5cbiAgbG9naW5TdGFuZGFyZChhdXRoT3B0aW9ucz86IEF1dGhPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLmhhc0NvbmZpZ1ZhbGlkUmVzcG9uc2VUeXBlKCkpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignSW52YWxpZCByZXNwb25zZSB0eXBlIScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgYXV0aFdlbGxrbm93bkVuZHBvaW50IH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICBpZiAoIWF1dGhXZWxsa25vd25FbmRwb2ludCkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKCdubyBhdXRoV2VsbGtub3duRW5kcG9pbnQgZ2l2ZW4hJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdCRUdJTiBBdXRob3JpemUgT0lEQyBGbG93LCBubyBhdXRoIGRhdGEnKTtcblxuICAgIHRoaXMuYXV0aFdlbGxLbm93blNlcnZpY2UuZ2V0QXV0aFdlbGxLbm93bkVuZFBvaW50cyhhdXRoV2VsbGtub3duRW5kcG9pbnQpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zdCB7IHVybEhhbmRsZXIsIGN1c3RvbVBhcmFtcyB9ID0gYXV0aE9wdGlvbnMgfHwge307XG5cbiAgICAgIGNvbnN0IHVybCA9IHRoaXMudXJsU2VydmljZS5nZXRBdXRob3JpemVVcmwoY3VzdG9tUGFyYW1zKTtcblxuICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKCdDb3VsZCBub3QgY3JlYXRlIHVybCcsIHVybCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHVybEhhbmRsZXIpIHtcbiAgICAgICAgdXJsSGFuZGxlcih1cmwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZWRpcmVjdFNlcnZpY2UucmVkaXJlY3RUbyh1cmwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=