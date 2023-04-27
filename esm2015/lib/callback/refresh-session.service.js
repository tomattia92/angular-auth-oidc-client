import { Injectable } from '@angular/core';
import { forkJoin, of, throwError, TimeoutError, timer } from 'rxjs';
import { map, mergeMap, retryWhen, switchMap, take, timeout } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../utils/flowHelper/flow-helper.service";
import * as i2 from "../config/config.provider";
import * as i3 from "../flows/flows-data.service";
import * as i4 from "../logging/logger.service";
import * as i5 from "../iframe/silent-renew.service";
import * as i6 from "../authState/auth-state.service";
import * as i7 from "../config/auth-well-known.service";
import * as i8 from "../iframe/refresh-session-iframe.service";
import * as i9 from "./refresh-session-refresh-token.service";
export const MAX_RETRY_ATTEMPTS = 3;
export class RefreshSessionService {
    constructor(flowHelper, configurationProvider, flowsDataService, loggerService, silentRenewService, authStateService, authWellKnownService, refreshSessionIframeService, refreshSessionRefreshTokenService) {
        this.flowHelper = flowHelper;
        this.configurationProvider = configurationProvider;
        this.flowsDataService = flowsDataService;
        this.loggerService = loggerService;
        this.silentRenewService = silentRenewService;
        this.authStateService = authStateService;
        this.authWellKnownService = authWellKnownService;
        this.refreshSessionIframeService = refreshSessionIframeService;
        this.refreshSessionRefreshTokenService = refreshSessionRefreshTokenService;
    }
    forceRefreshSession(extraCustomParams) {
        if (this.flowHelper.isCurrentFlowCodeFlowWithRefreshTokens()) {
            const { customParamsRefreshToken } = this.configurationProvider.getOpenIDConfiguration();
            const mergedParams = Object.assign(Object.assign({}, extraCustomParams), customParamsRefreshToken);
            return this.startRefreshSession(mergedParams).pipe(map(() => {
                const isAuthenticated = this.authStateService.areAuthStorageTokensValid();
                if (isAuthenticated) {
                    return {
                        idToken: this.authStateService.getIdToken(),
                        accessToken: this.authStateService.getAccessToken(),
                    };
                }
                return null;
            }));
        }
        const { silentRenewTimeoutInSeconds } = this.configurationProvider.getOpenIDConfiguration();
        const timeOutTime = silentRenewTimeoutInSeconds * 1000;
        return forkJoin([
            this.startRefreshSession(extraCustomParams),
            this.silentRenewService.refreshSessionWithIFrameCompleted$.pipe(take(1)),
        ]).pipe(timeout(timeOutTime), retryWhen(this.timeoutRetryStrategy.bind(this)), map(([_, callbackContext]) => {
            var _a, _b;
            const isAuthenticated = this.authStateService.areAuthStorageTokensValid();
            if (isAuthenticated) {
                return {
                    idToken: (_a = callbackContext === null || callbackContext === void 0 ? void 0 : callbackContext.authResult) === null || _a === void 0 ? void 0 : _a.id_token,
                    accessToken: (_b = callbackContext === null || callbackContext === void 0 ? void 0 : callbackContext.authResult) === null || _b === void 0 ? void 0 : _b.access_token,
                };
            }
            return null;
        }));
    }
    startRefreshSession(extraCustomParams) {
        const isSilentRenewRunning = this.flowsDataService.isSilentRenewRunning();
        this.loggerService.logDebug(`Checking: silentRenewRunning: ${isSilentRenewRunning}`);
        const shouldBeExecuted = !isSilentRenewRunning;
        if (!shouldBeExecuted) {
            return of(null);
        }
        const { authWellknownEndpoint } = this.configurationProvider.getOpenIDConfiguration() || {};
        if (!authWellknownEndpoint) {
            this.loggerService.logError('no authwellknownendpoint given!');
            return of(null);
        }
        return this.authWellKnownService.getAuthWellKnownEndPoints(authWellknownEndpoint).pipe(switchMap(() => {
            this.flowsDataService.setSilentRenewRunning();
            if (this.flowHelper.isCurrentFlowCodeFlowWithRefreshTokens()) {
                // Refresh Session using Refresh tokens
                return this.refreshSessionRefreshTokenService.refreshSessionWithRefreshTokens(extraCustomParams);
            }
            return this.refreshSessionIframeService.refreshSessionWithIframe(extraCustomParams);
        }));
    }
    timeoutRetryStrategy(errorAttempts) {
        return errorAttempts.pipe(mergeMap((error, index) => {
            const scalingDuration = 1000;
            const currentAttempt = index + 1;
            if (!(error instanceof TimeoutError) || currentAttempt > MAX_RETRY_ATTEMPTS) {
                return throwError(error);
            }
            this.loggerService.logDebug(`forceRefreshSession timeout. Attempt #${currentAttempt}`);
            this.flowsDataService.resetSilentRenewRunning();
            return timer(currentAttempt * scalingDuration);
        }));
    }
}
RefreshSessionService.ɵfac = function RefreshSessionService_Factory(t) { return new (t || RefreshSessionService)(i0.ɵɵinject(i1.FlowHelper), i0.ɵɵinject(i2.ConfigurationProvider), i0.ɵɵinject(i3.FlowsDataService), i0.ɵɵinject(i4.LoggerService), i0.ɵɵinject(i5.SilentRenewService), i0.ɵɵinject(i6.AuthStateService), i0.ɵɵinject(i7.AuthWellKnownService), i0.ɵɵinject(i8.RefreshSessionIframeService), i0.ɵɵinject(i9.RefreshSessionRefreshTokenService)); };
RefreshSessionService.ɵprov = i0.ɵɵdefineInjectable({ token: RefreshSessionService, factory: RefreshSessionService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RefreshSessionService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: i1.FlowHelper }, { type: i2.ConfigurationProvider }, { type: i3.FlowsDataService }, { type: i4.LoggerService }, { type: i5.SilentRenewService }, { type: i6.AuthStateService }, { type: i7.AuthWellKnownService }, { type: i8.RefreshSessionIframeService }, { type: i9.RefreshSessionRefreshTokenService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC1zZXNzaW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9jYWxsYmFjay9yZWZyZXNoLXNlc3Npb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxRQUFRLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7OztBQWFwRixNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLENBQUM7QUFFcEMsTUFBTSxPQUFPLHFCQUFxQjtJQUNoQyxZQUNVLFVBQXNCLEVBQ3RCLHFCQUE0QyxFQUM1QyxnQkFBa0MsRUFDbEMsYUFBNEIsRUFDNUIsa0JBQXNDLEVBQ3RDLGdCQUFrQyxFQUNsQyxvQkFBMEMsRUFDMUMsMkJBQXdELEVBQ3hELGlDQUFvRTtRQVJwRSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxnQ0FBMkIsR0FBM0IsMkJBQTJCLENBQTZCO1FBQ3hELHNDQUFpQyxHQUFqQyxpQ0FBaUMsQ0FBbUM7SUFDM0UsQ0FBQztJQUVKLG1CQUFtQixD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cnQgeyBmb3JrSm9pbiwgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IsIFRpbWVvdXRFcnJvciwgdGltZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCwgbWVyZ2VNYXAsIHJldHJ5V2hlbiwgc3dpdGNoTWFwLCB0YWtlLCB0aW1lb3V0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4uL2F1dGhTdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXV0aFdlbGxLbm93blNlcnZpY2UgfSBmcm9tICcuLi9jb25maWcvYXV0aC13ZWxsLWtub3duLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XG5pbXBvcnQgeyBDYWxsYmFja0NvbnRleHQgfSBmcm9tICcuLi9mbG93cy9jYWxsYmFjay1jb250ZXh0JztcbmltcG9ydCB7IEZsb3dzRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy9mbG93cy1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVmcmVzaFNlc3Npb25JZnJhbWVTZXJ2aWNlIH0gZnJvbSAnLi4vaWZyYW1lL3JlZnJlc2gtc2Vzc2lvbi1pZnJhbWUuc2VydmljZSc7XG5pbXBvcnQgeyBTaWxlbnRSZW5ld1NlcnZpY2UgfSBmcm9tICcuLi9pZnJhbWUvc2lsZW50LXJlbmV3LnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVG9rZW5SZXNwb25zZSB9IGZyb20gJy4uL3Rva2Vucy90b2tlbi1yZXNwb25zZSc7XG5pbXBvcnQgeyBGbG93SGVscGVyIH0gZnJvbSAnLi4vdXRpbHMvZmxvd0hlbHBlci9mbG93LWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IFJlZnJlc2hTZXNzaW9uUmVmcmVzaFRva2VuU2VydmljZSB9IGZyb20gJy4vcmVmcmVzaC1zZXNzaW9uLXJlZnJlc2gtdG9rZW4uc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBNQVhfUkVUUllfQVRURU1QVFMgPSAzO1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBSZWZyZXNoU2Vzc2lvblNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGZsb3dIZWxwZXI6IEZsb3dIZWxwZXIsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgc2lsZW50UmVuZXdTZXJ2aWNlOiBTaWxlbnRSZW5ld1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBhdXRoU3RhdGVTZXJ2aWNlOiBBdXRoU3RhdGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgYXV0aFdlbGxLbm93blNlcnZpY2U6IEF1dGhXZWxsS25vd25TZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVmcmVzaFNlc3Npb25JZnJhbWVTZXJ2aWNlOiBSZWZyZXNoU2Vzc2lvbklmcmFtZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWZyZXNoU2Vzc2lvblJlZnJlc2hUb2tlblNlcnZpY2U6IFJlZnJlc2hTZXNzaW9uUmVmcmVzaFRva2VuU2VydmljZVxuICApIHt9XG5cbiAgZm9yY2VSZWZyZXNoU2Vzc2lvbihleHRyYUN1c3RvbVBhcmFtcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KTogT2JzZXJ2YWJsZTxUb2tlblJlc3BvbnNlIHwgbnVsbD4ge1xuICAgIGlmICh0aGlzLmZsb3dIZWxwZXIuaXNDdXJyZW50Rmxvd0NvZGVGbG93V2l0aFJlZnJlc2hUb2tlbnMoKSkge1xuICAgICAgY29uc3QgeyBjdXN0b21QYXJhbXNSZWZyZXNoVG9rZW4gfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcbiAgICAgIGNvbnN0IG1lcmdlZFBhcmFtcyA9IHsgLi4uZXh0cmFDdXN0b21QYXJhbXMsIC4uLmN1c3RvbVBhcmFtc1JlZnJlc2hUb2tlbiB9O1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnRSZWZyZXNoU2Vzc2lvbihtZXJnZWRQYXJhbXMpLnBpcGUoXG4gICAgICAgIG1hcCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmFyZUF1dGhTdG9yYWdlVG9rZW5zVmFsaWQoKTtcbiAgICAgICAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBpZFRva2VuOiB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuZ2V0SWRUb2tlbigpLFxuICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmdldEFjY2Vzc1Rva2VuKCksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNpbGVudFJlbmV3VGltZW91dEluU2Vjb25kcyB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuICAgIGNvbnN0IHRpbWVPdXRUaW1lID0gc2lsZW50UmVuZXdUaW1lb3V0SW5TZWNvbmRzICogMTAwMDtcblxuICAgIHJldHVybiBmb3JrSm9pbihbXG4gICAgICB0aGlzLnN0YXJ0UmVmcmVzaFNlc3Npb24oZXh0cmFDdXN0b21QYXJhbXMpLFxuICAgICAgdGhpcy5zaWxlbnRSZW5ld1NlcnZpY2UucmVmcmVzaFNlc3Npb25XaXRoSUZyYW1lQ29tcGxldGVkJC5waXBlKHRha2UoMSkpLFxuICAgIF0pLnBpcGUoXG4gICAgICB0aW1lb3V0KHRpbWVPdXRUaW1lKSxcbiAgICAgIHJldHJ5V2hlbih0aGlzLnRpbWVvdXRSZXRyeVN0cmF0ZWd5LmJpbmQodGhpcykpLFxuICAgICAgbWFwKChbXywgY2FsbGJhY2tDb250ZXh0XSkgPT4ge1xuICAgICAgICBjb25zdCBpc0F1dGhlbnRpY2F0ZWQgPSB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuYXJlQXV0aFN0b3JhZ2VUb2tlbnNWYWxpZCgpO1xuICAgICAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkVG9rZW46IGNhbGxiYWNrQ29udGV4dD8uYXV0aFJlc3VsdD8uaWRfdG9rZW4sXG4gICAgICAgICAgICBhY2Nlc3NUb2tlbjogY2FsbGJhY2tDb250ZXh0Py5hdXRoUmVzdWx0Py5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydFJlZnJlc2hTZXNzaW9uKGV4dHJhQ3VzdG9tUGFyYW1zPzoge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW47XG4gIH0pOiBPYnNlcnZhYmxlPGJvb2xlYW4gfCBDYWxsYmFja0NvbnRleHQgfCBudWxsPiB7XG4gICAgY29uc3QgaXNTaWxlbnRSZW5ld1J1bm5pbmcgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuaXNTaWxlbnRSZW5ld1J1bm5pbmcoKTtcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYENoZWNraW5nOiBzaWxlbnRSZW5ld1J1bm5pbmc6ICR7aXNTaWxlbnRSZW5ld1J1bm5pbmd9YCk7XG4gICAgY29uc3Qgc2hvdWxkQmVFeGVjdXRlZCA9ICFpc1NpbGVudFJlbmV3UnVubmluZztcblxuICAgIGlmICghc2hvdWxkQmVFeGVjdXRlZCkge1xuICAgICAgcmV0dXJuIG9mKG51bGwpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgYXV0aFdlbGxrbm93bkVuZHBvaW50IH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCkgfHwge307XG5cbiAgICBpZiAoIWF1dGhXZWxsa25vd25FbmRwb2ludCkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKCdubyBhdXRod2VsbGtub3duZW5kcG9pbnQgZ2l2ZW4hJyk7XG4gICAgICByZXR1cm4gb2YobnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXV0aFdlbGxLbm93blNlcnZpY2UuZ2V0QXV0aFdlbGxLbm93bkVuZFBvaW50cyhhdXRoV2VsbGtub3duRW5kcG9pbnQpLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKCkgPT4ge1xuICAgICAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2Uuc2V0U2lsZW50UmVuZXdSdW5uaW5nKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZmxvd0hlbHBlci5pc0N1cnJlbnRGbG93Q29kZUZsb3dXaXRoUmVmcmVzaFRva2VucygpKSB7XG4gICAgICAgICAgLy8gUmVmcmVzaCBTZXNzaW9uIHVzaW5nIFJlZnJlc2ggdG9rZW5zXG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVmcmVzaFNlc3Npb25SZWZyZXNoVG9rZW5TZXJ2aWNlLnJlZnJlc2hTZXNzaW9uV2l0aFJlZnJlc2hUb2tlbnMoZXh0cmFDdXN0b21QYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVmcmVzaFNlc3Npb25JZnJhbWVTZXJ2aWNlLnJlZnJlc2hTZXNzaW9uV2l0aElmcmFtZShleHRyYUN1c3RvbVBhcmFtcyk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHRpbWVvdXRSZXRyeVN0cmF0ZWd5KGVycm9yQXR0ZW1wdHM6IE9ic2VydmFibGU8YW55Pik6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGVycm9yQXR0ZW1wdHMucGlwZShcbiAgICAgIG1lcmdlTWFwKChlcnJvciwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qgc2NhbGluZ0R1cmF0aW9uID0gMTAwMDtcbiAgICAgICAgY29uc3QgY3VycmVudEF0dGVtcHQgPSBpbmRleCArIDE7XG5cbiAgICAgICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBUaW1lb3V0RXJyb3IpIHx8IGN1cnJlbnRBdHRlbXB0ID4gTUFYX1JFVFJZX0FUVEVNUFRTKSB7XG4gICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGBmb3JjZVJlZnJlc2hTZXNzaW9uIHRpbWVvdXQuIEF0dGVtcHQgIyR7Y3VycmVudEF0dGVtcHR9YCk7XG5cbiAgICAgICAgdGhpcy5mbG93c0RhdGFTZXJ2aWNlLnJlc2V0U2lsZW50UmVuZXdSdW5uaW5nKCk7XG4gICAgICAgIHJldHVybiB0aW1lcihjdXJyZW50QXR0ZW1wdCAqIHNjYWxpbmdEdXJhdGlvbik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cbiJdfQ==