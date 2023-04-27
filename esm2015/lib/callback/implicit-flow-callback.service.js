import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../flows/flows.service";
import * as i2 from "../config/config.provider";
import * as i3 from "@angular/router";
import * as i4 from "../flows/flows-data.service";
import * as i5 from "./intervall.service";
export class ImplicitFlowCallbackService {
    constructor(flowsService, configurationProvider, router, flowsDataService, intervalService) {
        this.flowsService = flowsService;
        this.configurationProvider = configurationProvider;
        this.router = router;
        this.flowsDataService = flowsDataService;
        this.intervalService = intervalService;
    }
    authorizedImplicitFlowCallback(hash) {
        const isRenewProcess = this.flowsDataService.isSilentRenewRunning();
        const { triggerAuthorizationResultEvent, postLoginRoute, unauthorizedRoute } = this.configurationProvider.getOpenIDConfiguration();
        return this.flowsService.processImplicitFlowCallback(hash).pipe(tap((callbackContext) => {
            if (!triggerAuthorizationResultEvent && !callbackContext.isRenewProcess) {
                this.router.navigateByUrl(postLoginRoute);
            }
        }), catchError((error) => {
            this.flowsDataService.resetSilentRenewRunning();
            this.intervalService.stopPeriodicallTokenCheck();
            if (!triggerAuthorizationResultEvent && !isRenewProcess) {
                this.router.navigateByUrl(unauthorizedRoute);
            }
            return throwError(error);
        }));
    }
}
ImplicitFlowCallbackService.ɵfac = function ImplicitFlowCallbackService_Factory(t) { return new (t || ImplicitFlowCallbackService)(i0.ɵɵinject(i1.FlowsService), i0.ɵɵinject(i2.ConfigurationProvider), i0.ɵɵinject(i3.Router), i0.ɵɵinject(i4.FlowsDataService), i0.ɵɵinject(i5.IntervallService)); };
ImplicitFlowCallbackService.ɵprov = i0.ɵɵdefineInjectable({ token: ImplicitFlowCallbackService, factory: ImplicitFlowCallbackService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ImplicitFlowCallbackService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: i1.FlowsService }, { type: i2.ConfigurationProvider }, { type: i3.Router }, { type: i4.FlowsDataService }, { type: i5.IntervallService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wbGljaXQtZmxvdy1jYWxsYmFjay5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvY2FsbGJhY2svaW1wbGljaXQtZmxvdy1jYWxsYmFjay5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7O0FBT2pELE1BQU0sT0FBTywyQkFBMkI7SUFDdEMsWUFDVSxZQUEwQixFQUMxQixxQkFBNEMsRUFDNUMsTUFBYyxFQUNkLGdCQUFrQyxFQUNsQyxlQUFpQztRQUpqQyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtJQUN4QyxDQUFDO0lBRUosOEJBQThCLENBQUMsSUFBYTtRQUMxQyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNwRSxNQUFNLEVBQUUsK0JBQStCLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFbkksT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDN0QsR0FBRyxDQUFDLENBQUMsZUFBZSxFQUFFLEVBQUU7WUFDdEIsSUFBSSxDQUFDLCtCQUErQixJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRTtnQkFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDM0M7UUFDSCxDQUFDLENBQUMsRUFDRixVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNuQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUNoRCxJQUFJLENBQUMsZUFBZSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDakQsSUFBSSxDQUFDLCtCQUErQixJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQzlDO1lBQ0QsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7O3NHQTVCVSwyQkFBMkI7bUVBQTNCLDJCQUEyQixXQUEzQiwyQkFBMkIsbUJBRGQsTUFBTTtrREFDbkIsMkJBQTJCO2NBRHZDLFVBQVU7ZUFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEZsb3dzU2VydmljZSB9IGZyb20gJy4uL2Zsb3dzL2Zsb3dzLnNlcnZpY2UnO1xuaW1wb3J0IHsgSW50ZXJ2YWxsU2VydmljZSB9IGZyb20gJy4vaW50ZXJ2YWxsLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEltcGxpY2l0Rmxvd0NhbGxiYWNrU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZmxvd3NTZXJ2aWNlOiBGbG93c1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgZmxvd3NEYXRhU2VydmljZTogRmxvd3NEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGludGVydmFsU2VydmljZTogSW50ZXJ2YWxsU2VydmljZVxuICApIHt9XG5cbiAgYXV0aG9yaXplZEltcGxpY2l0Rmxvd0NhbGxiYWNrKGhhc2g/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBpc1JlbmV3UHJvY2VzcyA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5pc1NpbGVudFJlbmV3UnVubmluZygpO1xuICAgIGNvbnN0IHsgdHJpZ2dlckF1dGhvcml6YXRpb25SZXN1bHRFdmVudCwgcG9zdExvZ2luUm91dGUsIHVuYXV0aG9yaXplZFJvdXRlIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICByZXR1cm4gdGhpcy5mbG93c1NlcnZpY2UucHJvY2Vzc0ltcGxpY2l0Rmxvd0NhbGxiYWNrKGhhc2gpLnBpcGUoXG4gICAgICB0YXAoKGNhbGxiYWNrQ29udGV4dCkgPT4ge1xuICAgICAgICBpZiAoIXRyaWdnZXJBdXRob3JpemF0aW9uUmVzdWx0RXZlbnQgJiYgIWNhbGxiYWNrQ29udGV4dC5pc1JlbmV3UHJvY2Vzcykge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwocG9zdExvZ2luUm91dGUpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5yZXNldFNpbGVudFJlbmV3UnVubmluZygpO1xuICAgICAgICB0aGlzLmludGVydmFsU2VydmljZS5zdG9wUGVyaW9kaWNhbGxUb2tlbkNoZWNrKCk7XG4gICAgICAgIGlmICghdHJpZ2dlckF1dGhvcml6YXRpb25SZXN1bHRFdmVudCAmJiAhaXNSZW5ld1Byb2Nlc3MpIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHVuYXV0aG9yaXplZFJvdXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cbiJdfQ==