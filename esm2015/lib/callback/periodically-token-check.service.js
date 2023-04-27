import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../flows/reset-auth-data.service";
import * as i2 from "../utils/flowHelper/flow-helper.service";
import * as i3 from "../config/config.provider";
import * as i4 from "../flows/flows-data.service";
import * as i5 from "../logging/logger.service";
import * as i6 from "../userData/user-service";
import * as i7 from "../authState/auth-state.service";
import * as i8 from "../iframe/refresh-session-iframe.service";
import * as i9 from "./refresh-session-refresh-token.service";
import * as i10 from "./intervall.service";
import * as i11 from "../storage/storage-persistence.service";
export class PeriodicallyTokenCheckService {
    constructor(resetAuthDataService, flowHelper, configurationProvider, flowsDataService, loggerService, userService, authStateService, refreshSessionIframeService, refreshSessionRefreshTokenService, intervalService, storagePersistenceService) {
        this.resetAuthDataService = resetAuthDataService;
        this.flowHelper = flowHelper;
        this.configurationProvider = configurationProvider;
        this.flowsDataService = flowsDataService;
        this.loggerService = loggerService;
        this.userService = userService;
        this.authStateService = authStateService;
        this.refreshSessionIframeService = refreshSessionIframeService;
        this.refreshSessionRefreshTokenService = refreshSessionRefreshTokenService;
        this.intervalService = intervalService;
        this.storagePersistenceService = storagePersistenceService;
    }
    startTokenValidationPeriodically(repeatAfterSeconds) {
        const { silentRenew } = this.configurationProvider.getOpenIDConfiguration();
        if (!!this.intervalService.runTokenValidationRunning || !silentRenew) {
            return;
        }
        this.loggerService.logDebug(`starting token validation check every ${repeatAfterSeconds}s`);
        const periodicallyCheck$ = this.intervalService.startPeriodicTokenCheck(repeatAfterSeconds).pipe(switchMap(() => {
            const idToken = this.authStateService.getIdToken();
            const isSilentRenewRunning = this.flowsDataService.isSilentRenewRunning();
            const userDataFromStore = this.userService.getUserDataFromStore();
            this.loggerService.logDebug(`Checking: silentRenewRunning: ${isSilentRenewRunning} id_token: ${!!idToken} userData: ${!!userDataFromStore}`);
            const shouldBeExecuted = userDataFromStore && !isSilentRenewRunning && idToken;
            if (!shouldBeExecuted) {
                return of(null);
            }
            const idTokenHasExpired = this.authStateService.hasIdTokenExpired();
            const accessTokenHasExpired = this.authStateService.hasAccessTokenExpiredIfExpiryExists();
            if (!idTokenHasExpired && !accessTokenHasExpired) {
                return of(null);
            }
            const config = this.configurationProvider.getOpenIDConfiguration();
            if (!(config === null || config === void 0 ? void 0 : config.silentRenew)) {
                this.resetAuthDataService.resetAuthorizationData();
                return of(null);
            }
            this.loggerService.logDebug('starting silent renew...');
            this.flowsDataService.setSilentRenewRunning();
            if (this.flowHelper.isCurrentFlowCodeFlowWithRefreshTokens()) {
                // Retrieve Dynamically Set Custom Params for refresh body
                const customParamsRefresh = this.storagePersistenceService.read('storageCustomParamsRefresh') || {};
                const { customParamsRefreshToken } = this.configurationProvider.getOpenIDConfiguration();
                const mergedParams = Object.assign(Object.assign({}, customParamsRefresh), customParamsRefreshToken);
                // Refresh Session using Refresh tokens
                return this.refreshSessionRefreshTokenService.refreshSessionWithRefreshTokens(mergedParams);
            }
            // Retrieve Dynamically Set Custom Params
            const customParams = this.storagePersistenceService.read('storageCustomRequestParams');
            return this.refreshSessionIframeService.refreshSessionWithIframe(customParams);
        }));
        this.intervalService.runTokenValidationRunning = periodicallyCheck$
            .pipe(catchError(() => {
            this.flowsDataService.resetSilentRenewRunning();
            return throwError('periodically check failed');
        }))
            .subscribe(() => {
            this.loggerService.logDebug('silent renew, periodic check finished!');
            if (this.flowHelper.isCurrentFlowCodeFlowWithRefreshTokens()) {
                this.flowsDataService.resetSilentRenewRunning();
            }
        }, (err) => {
            this.loggerService.logError('silent renew failed!', err);
        });
    }
}
PeriodicallyTokenCheckService.ɵfac = function PeriodicallyTokenCheckService_Factory(t) { return new (t || PeriodicallyTokenCheckService)(i0.ɵɵinject(i1.ResetAuthDataService), i0.ɵɵinject(i2.FlowHelper), i0.ɵɵinject(i3.ConfigurationProvider), i0.ɵɵinject(i4.FlowsDataService), i0.ɵɵinject(i5.LoggerService), i0.ɵɵinject(i6.UserService), i0.ɵɵinject(i7.AuthStateService), i0.ɵɵinject(i8.RefreshSessionIframeService), i0.ɵɵinject(i9.RefreshSessionRefreshTokenService), i0.ɵɵinject(i10.IntervallService), i0.ɵɵinject(i11.StoragePersistenceService)); };
PeriodicallyTokenCheckService.ɵprov = i0.ɵɵdefineInjectable({ token: PeriodicallyTokenCheckService, factory: PeriodicallyTokenCheckService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(PeriodicallyTokenCheckService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: i1.ResetAuthDataService }, { type: i2.FlowHelper }, { type: i3.ConfigurationProvider }, { type: i4.FlowsDataService }, { type: i5.LoggerService }, { type: i6.UserService }, { type: i7.AuthStateService }, { type: i8.RefreshSessionIframeService }, { type: i9.RefreshSessionRefreshTokenService }, { type: i10.IntervallService }, { type: i11.StoragePersistenceService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyaW9kaWNhbGx5LXRva2VuLWNoZWNrLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9jYWxsYmFjay9wZXJpb2RpY2FsbHktdG9rZW4tY2hlY2suc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFjdkQsTUFBTSxPQUFPLDZCQUE2QjtJQUN4QyxZQUNVLG9CQUEwQyxFQUMxQyxVQUFzQixFQUN0QixxQkFBNEMsRUFDNUMsZ0JBQWtDLEVBQ2xDLGFBQTRCLEVBQzVCLFdBQXdCLEVBQ3hCLGdCQUFrQyxFQUNsQywyQkFBd0QsRUFDeEQsaUNBQW9FLEVBQ3BFLGVBQWlDLEVBQ2pDLHlCQUFvRDtRQVZwRCx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsZ0NBQTJCLEdBQTNCLDJCQUEyQixDQUE2QjtRQUN4RCxzQ0FBaUMsR0FBakMsaUNBQWlDLENBQW1DO1FBQ3BFLG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtRQUNqQyw4QkFBeUIsR0FBekIseUJBQXlCLENBQTJCO0lBQzNELENBQUM7SUFFSixnQ0FBZ0MsQ0FBQyxrQkFBMEI7UUFD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QUMseUJBQXlCLEdBQUcsa0JBQWtCO2FBQ2hFLElBQUksQ0FDSCxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDaEQsT0FBTyxVQUFVLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FDSDthQUNBLFNBQVMsQ0FDUixHQUFHLEVBQUU7WUFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3RFLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxzQ0FBc0MsRUFBRSxFQUFFO2dCQUM1RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLEVBQUUsQ0FBQzthQUNqRDtRQUNILENBQUMsRUFDRCxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUNGLENBQUM7SUFDTixDQUFDOzswR0FsR1UsNkJBQTZCO3FFQUE3Qiw2QkFBNkIsV0FBN0IsNkJBQTZCLG1CQURoQixNQUFNO2tEQUNuQiw2QkFBNkI7Y0FEekMsVUFBVTtlQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBBdXRoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aFN0YXRlL2F1dGgtc3RhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcbmltcG9ydCB7IEZsb3dzRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy9mbG93cy1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzZXRBdXRoRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy9yZXNldC1hdXRoLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBSZWZyZXNoU2Vzc2lvbklmcmFtZVNlcnZpY2UgfSBmcm9tICcuLi9pZnJhbWUvcmVmcmVzaC1zZXNzaW9uLWlmcmFtZS5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4uL3VzZXJEYXRhL3VzZXItc2VydmljZSc7XG5pbXBvcnQgeyBGbG93SGVscGVyIH0gZnJvbSAnLi4vdXRpbHMvZmxvd0hlbHBlci9mbG93LWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IEludGVydmFsbFNlcnZpY2UgfSBmcm9tICcuL2ludGVydmFsbC5zZXJ2aWNlJztcbmltcG9ydCB7IFJlZnJlc2hTZXNzaW9uUmVmcmVzaFRva2VuU2VydmljZSB9IGZyb20gJy4vcmVmcmVzaC1zZXNzaW9uLXJlZnJlc2gtdG9rZW4uc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgUGVyaW9kaWNhbGx5VG9rZW5DaGVja1NlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlc2V0QXV0aERhdGFTZXJ2aWNlOiBSZXNldEF1dGhEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGZsb3dIZWxwZXI6IEZsb3dIZWxwZXIsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgYXV0aFN0YXRlU2VydmljZTogQXV0aFN0YXRlU2VydmljZSxcbiAgICBwcml2YXRlIHJlZnJlc2hTZXNzaW9uSWZyYW1lU2VydmljZTogUmVmcmVzaFNlc3Npb25JZnJhbWVTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVmcmVzaFNlc3Npb25SZWZyZXNoVG9rZW5TZXJ2aWNlOiBSZWZyZXNoU2Vzc2lvblJlZnJlc2hUb2tlblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBpbnRlcnZhbFNlcnZpY2U6IEludGVydmFsbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlXG4gICkge31cblxuICBzdGFydFRva2VuVmFsaWRhdGlvblBlcmlvZGljYWxseShyZXBlYXRBZnRlclNlY29uZHM6IG51bWJlcikge1xuICAgIGNvbnN0IHsgc2lsZW50UmVuZXcgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcblxuICAgIGlmICghIXRoaXMuaW50ZXJ2YWxTZXJ2aWNlLnJ1blRva2VuVmFsaWRhdGlvblJ1bm5pbmcgfHwgIXNpbGVudFJlbmV3KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGBzdGFydGluZyB0b2tlbiB2YWxpZGF0aW9uIGNoZWNrIGV2ZXJ5ICR7cmVwZWF0QWZ0ZXJTZWNvbmRzfXNgKTtcblxuICAgIGNvbnN0IHBlcmlvZGljYWxseUNoZWNrJCA9IHRoaXMuaW50ZXJ2YWxTZXJ2aWNlLnN0YXJ0UGVyaW9kaWNUb2tlbkNoZWNrKHJlcGVhdEFmdGVyU2Vjb25kcykucGlwZShcbiAgICAgIHN3aXRjaE1hcCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGlkVG9rZW4gPSB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuZ2V0SWRUb2tlbigpO1xuICAgICAgICBjb25zdCBpc1NpbGVudFJlbmV3UnVubmluZyA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5pc1NpbGVudFJlbmV3UnVubmluZygpO1xuICAgICAgICBjb25zdCB1c2VyRGF0YUZyb21TdG9yZSA9IHRoaXMudXNlclNlcnZpY2UuZ2V0VXNlckRhdGFGcm9tU3RvcmUoKTtcblxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoXG4gICAgICAgICAgYENoZWNraW5nOiBzaWxlbnRSZW5ld1J1bm5pbmc6ICR7aXNTaWxlbnRSZW5ld1J1bm5pbmd9IGlkX3Rva2VuOiAkeyEhaWRUb2tlbn0gdXNlckRhdGE6ICR7ISF1c2VyRGF0YUZyb21TdG9yZX1gXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3Qgc2hvdWxkQmVFeGVjdXRlZCA9IHVzZXJEYXRhRnJvbVN0b3JlICYmICFpc1NpbGVudFJlbmV3UnVubmluZyAmJiBpZFRva2VuO1xuXG4gICAgICAgIGlmICghc2hvdWxkQmVFeGVjdXRlZCkge1xuICAgICAgICAgIHJldHVybiBvZihudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlkVG9rZW5IYXNFeHBpcmVkID0gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmhhc0lkVG9rZW5FeHBpcmVkKCk7XG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuSGFzRXhwaXJlZCA9IHRoaXMuYXV0aFN0YXRlU2VydmljZS5oYXNBY2Nlc3NUb2tlbkV4cGlyZWRJZkV4cGlyeUV4aXN0cygpO1xuXG4gICAgICAgIGlmICghaWRUb2tlbkhhc0V4cGlyZWQgJiYgIWFjY2Vzc1Rva2VuSGFzRXhwaXJlZCkge1xuICAgICAgICAgIHJldHVybiBvZihudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBpZiAoIWNvbmZpZz8uc2lsZW50UmVuZXcpIHtcbiAgICAgICAgICB0aGlzLnJlc2V0QXV0aERhdGFTZXJ2aWNlLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoKTtcbiAgICAgICAgICByZXR1cm4gb2YobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3N0YXJ0aW5nIHNpbGVudCByZW5ldy4uLicpO1xuXG4gICAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5zZXRTaWxlbnRSZW5ld1J1bm5pbmcoKTtcblxuICAgICAgICBpZiAodGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dDb2RlRmxvd1dpdGhSZWZyZXNoVG9rZW5zKCkpIHtcbiAgICAgICAgICAvLyBSZXRyaWV2ZSBEeW5hbWljYWxseSBTZXQgQ3VzdG9tIFBhcmFtcyBmb3IgcmVmcmVzaCBib2R5XG4gICAgICAgICAgY29uc3QgY3VzdG9tUGFyYW1zUmVmcmVzaDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH0gPVxuICAgICAgICAgICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ3N0b3JhZ2VDdXN0b21QYXJhbXNSZWZyZXNoJykgfHwge307XG5cbiAgICAgICAgICBjb25zdCB7IGN1c3RvbVBhcmFtc1JlZnJlc2hUb2tlbiB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgICAgY29uc3QgbWVyZ2VkUGFyYW1zID0geyAuLi5jdXN0b21QYXJhbXNSZWZyZXNoLCAuLi5jdXN0b21QYXJhbXNSZWZyZXNoVG9rZW4gfTtcblxuICAgICAgICAgIC8vIFJlZnJlc2ggU2Vzc2lvbiB1c2luZyBSZWZyZXNoIHRva2Vuc1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hTZXNzaW9uUmVmcmVzaFRva2VuU2VydmljZS5yZWZyZXNoU2Vzc2lvbldpdGhSZWZyZXNoVG9rZW5zKG1lcmdlZFBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXRyaWV2ZSBEeW5hbWljYWxseSBTZXQgQ3VzdG9tIFBhcmFtc1xuICAgICAgICBjb25zdCBjdXN0b21QYXJhbXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9ID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoXG4gICAgICAgICAgJ3N0b3JhZ2VDdXN0b21SZXF1ZXN0UGFyYW1zJ1xuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hTZXNzaW9uSWZyYW1lU2VydmljZS5yZWZyZXNoU2Vzc2lvbldpdGhJZnJhbWUoY3VzdG9tUGFyYW1zKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuaW50ZXJ2YWxTZXJ2aWNlLnJ1blRva2VuVmFsaWRhdGlvblJ1bm5pbmcgPSBwZXJpb2RpY2FsbHlDaGVjayRcbiAgICAgIC5waXBlKFxuICAgICAgICBjYXRjaEVycm9yKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2UucmVzZXRTaWxlbnRSZW5ld1J1bm5pbmcoKTtcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigncGVyaW9kaWNhbGx5IGNoZWNrIGZhaWxlZCcpO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnc2lsZW50IHJlbmV3LCBwZXJpb2RpYyBjaGVjayBmaW5pc2hlZCEnKTtcbiAgICAgICAgICBpZiAodGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dDb2RlRmxvd1dpdGhSZWZyZXNoVG9rZW5zKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5yZXNldFNpbGVudFJlbmV3UnVubmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignc2lsZW50IHJlbmV3IGZhaWxlZCEnLCBlcnIpO1xuICAgICAgICB9XG4gICAgICApO1xuICB9XG59XG4iXX0=