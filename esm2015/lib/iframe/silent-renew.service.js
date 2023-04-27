import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthorizedState } from '../authState/authorized-state';
import { ValidationResult } from '../validation/validation-result';
import * as i0 from "@angular/core";
import * as i1 from "../config/config.provider";
import * as i2 from "./existing-iframe.service";
import * as i3 from "../flows/flows.service";
import * as i4 from "../flows/reset-auth-data.service";
import * as i5 from "../flows/flows-data.service";
import * as i6 from "../authState/auth-state.service";
import * as i7 from "../logging/logger.service";
import * as i8 from "../utils/flowHelper/flow-helper.service";
import * as i9 from "../callback/implicit-flow-callback.service";
import * as i10 from "../callback/intervall.service";
const IFRAME_FOR_SILENT_RENEW_IDENTIFIER = 'myiFrameForSilentRenew';
export class SilentRenewService {
    constructor(configurationProvider, iFrameService, flowsService, resetAuthDataService, flowsDataService, authStateService, loggerService, flowHelper, implicitFlowCallbackService, intervalService) {
        this.configurationProvider = configurationProvider;
        this.iFrameService = iFrameService;
        this.flowsService = flowsService;
        this.resetAuthDataService = resetAuthDataService;
        this.flowsDataService = flowsDataService;
        this.authStateService = authStateService;
        this.loggerService = loggerService;
        this.flowHelper = flowHelper;
        this.implicitFlowCallbackService = implicitFlowCallbackService;
        this.intervalService = intervalService;
        this.refreshSessionWithIFrameCompletedInternal$ = new Subject();
    }
    get refreshSessionWithIFrameCompleted$() {
        return this.refreshSessionWithIFrameCompletedInternal$.asObservable();
    }
    getOrCreateIframe() {
        const existingIframe = this.getExistingIframe();
        if (!existingIframe) {
            return this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        }
        return existingIframe;
    }
    isSilentRenewConfigured() {
        const { useRefreshToken, silentRenew } = this.configurationProvider.getOpenIDConfiguration();
        return !useRefreshToken && silentRenew;
    }
    codeFlowCallbackSilentRenewIframe(urlParts) {
        const params = new HttpParams({
            fromString: urlParts[1],
        });
        const error = params.get('error');
        if (error) {
            this.authStateService.updateAndPublishAuthState({
                authorizationState: AuthorizedState.Unauthorized,
                validationResult: ValidationResult.LoginRequired,
                isRenewProcess: true,
            });
            this.resetAuthDataService.resetAuthorizationData();
            this.flowsDataService.setNonce('');
            this.intervalService.stopPeriodicallTokenCheck();
            return throwError(error);
        }
        const code = params.get('code');
        const state = params.get('state');
        const sessionState = params.get('session_state');
        const callbackContext = {
            code,
            refreshToken: null,
            state,
            sessionState,
            authResult: null,
            isRenewProcess: true,
            jwtKeys: null,
            validationResult: null,
            existingIdToken: null,
        };
        return this.flowsService.processSilentRenewCodeFlowCallback(callbackContext).pipe(catchError((errorFromFlow) => {
            this.intervalService.stopPeriodicallTokenCheck();
            this.resetAuthDataService.resetAuthorizationData();
            return throwError(errorFromFlow);
        }));
    }
    silentRenewEventHandler(e) {
        this.loggerService.logDebug('silentRenewEventHandler');
        if (!e.detail) {
            return;
        }
        let callback$ = of(null);
        const isCodeFlow = this.flowHelper.isCurrentFlowCodeFlow();
        if (isCodeFlow) {
            const urlParts = e.detail.toString().split('?');
            callback$ = this.codeFlowCallbackSilentRenewIframe(urlParts);
        }
        else {
            callback$ = this.implicitFlowCallbackService.authorizedImplicitFlowCallback(e.detail);
        }
        callback$.subscribe((callbackContext) => {
            this.refreshSessionWithIFrameCompletedInternal$.next(callbackContext);
            this.flowsDataService.resetSilentRenewRunning();
        }, (err) => {
            this.loggerService.logError('Error: ' + err);
            this.refreshSessionWithIFrameCompletedInternal$.next(null);
            this.flowsDataService.resetSilentRenewRunning();
        });
    }
    getExistingIframe() {
        return this.iFrameService.getExistingIFrame(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
    }
}
SilentRenewService.ɵfac = function SilentRenewService_Factory(t) { return new (t || SilentRenewService)(i0.ɵɵinject(i1.ConfigurationProvider), i0.ɵɵinject(i2.IFrameService), i0.ɵɵinject(i3.FlowsService), i0.ɵɵinject(i4.ResetAuthDataService), i0.ɵɵinject(i5.FlowsDataService), i0.ɵɵinject(i6.AuthStateService), i0.ɵɵinject(i7.LoggerService), i0.ɵɵinject(i8.FlowHelper), i0.ɵɵinject(i9.ImplicitFlowCallbackService), i0.ɵɵinject(i10.IntervallService)); };
SilentRenewService.ɵprov = i0.ɵɵdefineInjectable({ token: SilentRenewService, factory: SilentRenewService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(SilentRenewService, [{
        type: Injectable
    }], function () { return [{ type: i1.ConfigurationProvider }, { type: i2.IFrameService }, { type: i3.FlowsService }, { type: i4.ResetAuthDataService }, { type: i5.FlowsDataService }, { type: i6.AuthStateService }, { type: i7.LoggerService }, { type: i8.FlowHelper }, { type: i9.ImplicitFlowCallbackService }, { type: i10.IntervallService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lsZW50LXJlbmV3LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9pZnJhbWUvc2lsZW50LXJlbmV3LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFVaEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUNBQWlDLENBQUM7Ozs7Ozs7Ozs7OztBQUduRSxNQUFNLGtDQUFrQyxHQUFHLHdCQUF3QixDQUFDO0FBR3BFLE1BQU0sT0FBTyxrQkFBa0I7SUFPN0IsWUFDVSxxQkFBNEMsRUFDNUMsYUFBNEIsRUFDNUIsWUFBMEIsRUFDMUIsb0JBQTBDLEVBQzFDLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsYUFBNEIsRUFDNUIsVUFBc0IsRUFDdEIsMkJBQXdELEVBQ3hELGVBQWlDO1FBVGpDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixnQ0FB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QUV6QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFFM0QsSUFBSSxVQUFVLEVBQUU7WUFDZCxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoRCxTQUFTLEdBQUcsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzlEO2FBQU07WUFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2RjtRQUVELFNBQVMsQ0FBQyxTQUFTLENBQ2pCLENBQUMsZUFBZSxFQUFFLEVBQUU7WUFDbEIsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN0RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNsRCxDQUFDLEVBQ0QsQ0FBQyxHQUFRLEVBQUUsRUFBRTtZQUNYLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsMENBQTBDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ2xELENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVPLGlCQUFpQjtRQUN2QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNsRixDQUFDOztvRkEvR1Usa0JBQWtCOzBEQUFsQixrQkFBa0IsV0FBbEIsa0JBQWtCO2tEQUFsQixrQkFBa0I7Y0FEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBvZiwgU3ViamVjdCwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9hdXRoU3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IEF1dGhvcml6ZWRTdGF0ZSB9IGZyb20gJy4uL2F1dGhTdGF0ZS9hdXRob3JpemVkLXN0YXRlJztcbmltcG9ydCB7IEltcGxpY2l0Rmxvd0NhbGxiYWNrU2VydmljZSB9IGZyb20gJy4uL2NhbGxiYWNrL2ltcGxpY2l0LWZsb3ctY2FsbGJhY2suc2VydmljZSc7XG5pbXBvcnQgeyBJbnRlcnZhbGxTZXJ2aWNlIH0gZnJvbSAnLi4vY2FsbGJhY2svaW50ZXJ2YWxsLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XG5pbXBvcnQgeyBDYWxsYmFja0NvbnRleHQgfSBmcm9tICcuLi9mbG93cy9jYWxsYmFjay1jb250ZXh0JztcbmltcG9ydCB7IEZsb3dzRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy9mbG93cy1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmxvd3NTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MvZmxvd3Muc2VydmljZSc7XG5pbXBvcnQgeyBSZXNldEF1dGhEYXRhU2VydmljZSB9IGZyb20gJy4uL2Zsb3dzL3Jlc2V0LWF1dGgtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IEZsb3dIZWxwZXIgfSBmcm9tICcuLi91dGlscy9mbG93SGVscGVyL2Zsb3ctaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJy4uL3ZhbGlkYXRpb24vdmFsaWRhdGlvbi1yZXN1bHQnO1xuaW1wb3J0IHsgSUZyYW1lU2VydmljZSB9IGZyb20gJy4vZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UnO1xuXG5jb25zdCBJRlJBTUVfRk9SX1NJTEVOVF9SRU5FV19JREVOVElGSUVSID0gJ215aUZyYW1lRm9yU2lsZW50UmVuZXcnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2lsZW50UmVuZXdTZXJ2aWNlIHtcbiAgcHJpdmF0ZSByZWZyZXNoU2Vzc2lvbldpdGhJRnJhbWVDb21wbGV0ZWRJbnRlcm5hbCQgPSBuZXcgU3ViamVjdDxDYWxsYmFja0NvbnRleHQ+KCk7XG5cbiAgZ2V0IHJlZnJlc2hTZXNzaW9uV2l0aElGcmFtZUNvbXBsZXRlZCQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmcmVzaFNlc3Npb25XaXRoSUZyYW1lQ29tcGxldGVkSW50ZXJuYWwkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIGlGcmFtZVNlcnZpY2U6IElGcmFtZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBmbG93c1NlcnZpY2U6IEZsb3dzU2VydmljZSxcbiAgICBwcml2YXRlIHJlc2V0QXV0aERhdGFTZXJ2aWNlOiBSZXNldEF1dGhEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBhdXRoU3RhdGVTZXJ2aWNlOiBBdXRoU3RhdGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGZsb3dIZWxwZXI6IEZsb3dIZWxwZXIsXG4gICAgcHJpdmF0ZSBpbXBsaWNpdEZsb3dDYWxsYmFja1NlcnZpY2U6IEltcGxpY2l0Rmxvd0NhbGxiYWNrU2VydmljZSxcbiAgICBwcml2YXRlIGludGVydmFsU2VydmljZTogSW50ZXJ2YWxsU2VydmljZVxuICApIHt9XG5cbiAgZ2V0T3JDcmVhdGVJZnJhbWUoKTogSFRNTElGcmFtZUVsZW1lbnQge1xuICAgIGNvbnN0IGV4aXN0aW5nSWZyYW1lID0gdGhpcy5nZXRFeGlzdGluZ0lmcmFtZSgpO1xuXG4gICAgaWYgKCFleGlzdGluZ0lmcmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaUZyYW1lU2VydmljZS5hZGRJRnJhbWVUb1dpbmRvd0JvZHkoSUZSQU1FX0ZPUl9TSUxFTlRfUkVORVdfSURFTlRJRklFUik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4aXN0aW5nSWZyYW1lO1xuICB9XG5cbiAgaXNTaWxlbnRSZW5ld0NvbmZpZ3VyZWQoKSB7XG4gICAgY29uc3QgeyB1c2VSZWZyZXNoVG9rZW4sIHNpbGVudFJlbmV3IH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG4gICAgcmV0dXJuICF1c2VSZWZyZXNoVG9rZW4gJiYgc2lsZW50UmVuZXc7XG4gIH1cblxuICBjb2RlRmxvd0NhbGxiYWNrU2lsZW50UmVuZXdJZnJhbWUodXJsUGFydHMpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyh7XG4gICAgICBmcm9tU3RyaW5nOiB1cmxQYXJ0c1sxXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGVycm9yID0gcGFyYW1zLmdldCgnZXJyb3InKTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLnVwZGF0ZUFuZFB1Ymxpc2hBdXRoU3RhdGUoe1xuICAgICAgICBhdXRob3JpemF0aW9uU3RhdGU6IEF1dGhvcml6ZWRTdGF0ZS5VbmF1dGhvcml6ZWQsXG4gICAgICAgIHZhbGlkYXRpb25SZXN1bHQ6IFZhbGlkYXRpb25SZXN1bHQuTG9naW5SZXF1aXJlZCxcbiAgICAgICAgaXNSZW5ld1Byb2Nlc3M6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVzZXRBdXRoRGF0YVNlcnZpY2UucmVzZXRBdXRob3JpemF0aW9uRGF0YSgpO1xuICAgICAgdGhpcy5mbG93c0RhdGFTZXJ2aWNlLnNldE5vbmNlKCcnKTtcbiAgICAgIHRoaXMuaW50ZXJ2YWxTZXJ2aWNlLnN0b3BQZXJpb2RpY2FsbFRva2VuQ2hlY2soKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb2RlID0gcGFyYW1zLmdldCgnY29kZScpO1xuICAgIGNvbnN0IHN0YXRlID0gcGFyYW1zLmdldCgnc3RhdGUnKTtcbiAgICBjb25zdCBzZXNzaW9uU3RhdGUgPSBwYXJhbXMuZ2V0KCdzZXNzaW9uX3N0YXRlJyk7XG5cbiAgICBjb25zdCBjYWxsYmFja0NvbnRleHQgPSB7XG4gICAgICBjb2RlLFxuICAgICAgcmVmcmVzaFRva2VuOiBudWxsLFxuICAgICAgc3RhdGUsXG4gICAgICBzZXNzaW9uU3RhdGUsXG4gICAgICBhdXRoUmVzdWx0OiBudWxsLFxuICAgICAgaXNSZW5ld1Byb2Nlc3M6IHRydWUsXG4gICAgICBqd3RLZXlzOiBudWxsLFxuICAgICAgdmFsaWRhdGlvblJlc3VsdDogbnVsbCxcbiAgICAgIGV4aXN0aW5nSWRUb2tlbjogbnVsbCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuZmxvd3NTZXJ2aWNlLnByb2Nlc3NTaWxlbnRSZW5ld0NvZGVGbG93Q2FsbGJhY2soY2FsbGJhY2tDb250ZXh0KS5waXBlKFxuICAgICAgY2F0Y2hFcnJvcigoZXJyb3JGcm9tRmxvdykgPT4ge1xuICAgICAgICB0aGlzLmludGVydmFsU2VydmljZS5zdG9wUGVyaW9kaWNhbGxUb2tlbkNoZWNrKCk7XG4gICAgICAgIHRoaXMucmVzZXRBdXRoRGF0YVNlcnZpY2UucmVzZXRBdXRob3JpemF0aW9uRGF0YSgpO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvckZyb21GbG93KTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHNpbGVudFJlbmV3RXZlbnRIYW5kbGVyKGU6IEN1c3RvbUV2ZW50KSB7XG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdzaWxlbnRSZW5ld0V2ZW50SGFuZGxlcicpO1xuICAgIGlmICghZS5kZXRhaWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY2FsbGJhY2skID0gb2YobnVsbCk7XG5cbiAgICBjb25zdCBpc0NvZGVGbG93ID0gdGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dDb2RlRmxvdygpO1xuXG4gICAgaWYgKGlzQ29kZUZsb3cpIHtcbiAgICAgIGNvbnN0IHVybFBhcnRzID0gZS5kZXRhaWwudG9TdHJpbmcoKS5zcGxpdCgnPycpO1xuICAgICAgY2FsbGJhY2skID0gdGhpcy5jb2RlRmxvd0NhbGxiYWNrU2lsZW50UmVuZXdJZnJhbWUodXJsUGFydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayQgPSB0aGlzLmltcGxpY2l0Rmxvd0NhbGxiYWNrU2VydmljZS5hdXRob3JpemVkSW1wbGljaXRGbG93Q2FsbGJhY2soZS5kZXRhaWwpO1xuICAgIH1cblxuICAgIGNhbGxiYWNrJC5zdWJzY3JpYmUoXG4gICAgICAoY2FsbGJhY2tDb250ZXh0KSA9PiB7XG4gICAgICAgIHRoaXMucmVmcmVzaFNlc3Npb25XaXRoSUZyYW1lQ29tcGxldGVkSW50ZXJuYWwkLm5leHQoY2FsbGJhY2tDb250ZXh0KTtcbiAgICAgICAgdGhpcy5mbG93c0RhdGFTZXJ2aWNlLnJlc2V0U2lsZW50UmVuZXdSdW5uaW5nKCk7XG4gICAgICB9LFxuICAgICAgKGVycjogYW55KSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignRXJyb3I6ICcgKyBlcnIpO1xuICAgICAgICB0aGlzLnJlZnJlc2hTZXNzaW9uV2l0aElGcmFtZUNvbXBsZXRlZEludGVybmFsJC5uZXh0KG51bGwpO1xuICAgICAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2UucmVzZXRTaWxlbnRSZW5ld1J1bm5pbmcoKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFeGlzdGluZ0lmcmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pRnJhbWVTZXJ2aWNlLmdldEV4aXN0aW5nSUZyYW1lKElGUkFNRV9GT1JfU0lMRU5UX1JFTkVXX0lERU5USUZJRVIpO1xuICB9XG59XG4iXX0=