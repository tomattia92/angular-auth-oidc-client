import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../flows/flows.service";
import * as i2 from "../flows/flows-data.service";
import * as i3 from "./intervall.service";
import * as i4 from "../config/config.provider";
import * as i5 from "@angular/router";
export class CodeFlowCallbackService {
    constructor(flowsService, flowsDataService, intervallService, configurationProvider, router) {
        this.flowsService = flowsService;
        this.flowsDataService = flowsDataService;
        this.intervallService = intervallService;
        this.configurationProvider = configurationProvider;
        this.router = router;
    }
    authorizedCallbackWithCode(urlToCheck) {
        const isRenewProcess = this.flowsDataService.isSilentRenewRunning();
        const { triggerAuthorizationResultEvent, postLoginRoute, unauthorizedRoute } = this.configurationProvider.getOpenIDConfiguration();
        return this.flowsService.processCodeFlowCallback(urlToCheck).pipe(tap((callbackContext) => {
            if (!triggerAuthorizationResultEvent && !callbackContext.isRenewProcess) {
                this.router.navigateByUrl(postLoginRoute);
            }
        }), catchError((error) => {
            this.flowsDataService.resetSilentRenewRunning();
            this.intervallService.stopPeriodicallTokenCheck();
            if (!triggerAuthorizationResultEvent && !isRenewProcess) {
                this.router.navigateByUrl(unauthorizedRoute);
            }
            return throwError(error);
        }));
    }
}
CodeFlowCallbackService.ɵfac = function CodeFlowCallbackService_Factory(t) { return new (t || CodeFlowCallbackService)(i0.ɵɵinject(i1.FlowsService), i0.ɵɵinject(i2.FlowsDataService), i0.ɵɵinject(i3.IntervallService), i0.ɵɵinject(i4.ConfigurationProvider), i0.ɵɵinject(i5.Router)); };
CodeFlowCallbackService.ɵprov = i0.ɵɵdefineInjectable({ token: CodeFlowCallbackService, factory: CodeFlowCallbackService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CodeFlowCallbackService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: i1.FlowsService }, { type: i2.FlowsDataService }, { type: i3.IntervallService }, { type: i4.ConfigurationProvider }, { type: i5.Router }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1mbG93LWNhbGxiYWNrLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9jYWxsYmFjay9jb2RlLWZsb3ctY2FsbGJhY2suc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7OztBQU9qRCxNQUFNLE9BQU8sdUJBQXVCO0lBQ2xDLFlBQ1UsWUFBMEIsRUFDMUIsZ0JBQWtDLEVBQ2xDLGdCQUFrQyxFQUNsQyxxQkFBNEMsRUFDNUMsTUFBYztRQUpkLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDckIsQ0FBQztJQUVKLDBCQUEwQixDQUFDLFVBQWtCO1FBQzNDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ3BFLE1BQU0sRUFBRSwrQkFBK0IsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUVuSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUMvRCxHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUN0QixJQUFJLENBQUMsK0JBQStCLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxFQUFFO2dCQUN2RSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUMzQztRQUNILENBQUMsQ0FBQyxFQUNGLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ25CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBQ2xELElBQUksQ0FBQywrQkFBK0IsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUM5QztZQUNELE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDOzs4RkE1QlUsdUJBQXVCOytEQUF2Qix1QkFBdUIsV0FBdkIsdUJBQXVCLG1CQURWLE1BQU07a0RBQ25CLHVCQUF1QjtjQURuQyxVQUFVO2VBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgRmxvd3NEYXRhU2VydmljZSB9IGZyb20gJy4uL2Zsb3dzL2Zsb3dzLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBGbG93c1NlcnZpY2UgfSBmcm9tICcuLi9mbG93cy9mbG93cy5zZXJ2aWNlJztcbmltcG9ydCB7IEludGVydmFsbFNlcnZpY2UgfSBmcm9tICcuL2ludGVydmFsbC5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBDb2RlRmxvd0NhbGxiYWNrU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZmxvd3NTZXJ2aWNlOiBGbG93c1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBmbG93c0RhdGFTZXJ2aWNlOiBGbG93c0RhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgaW50ZXJ2YWxsU2VydmljZTogSW50ZXJ2YWxsU2VydmljZSxcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcbiAgKSB7fVxuXG4gIGF1dGhvcml6ZWRDYWxsYmFja1dpdGhDb2RlKHVybFRvQ2hlY2s6IHN0cmluZykge1xuICAgIGNvbnN0IGlzUmVuZXdQcm9jZXNzID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmlzU2lsZW50UmVuZXdSdW5uaW5nKCk7XG4gICAgY29uc3QgeyB0cmlnZ2VyQXV0aG9yaXphdGlvblJlc3VsdEV2ZW50LCBwb3N0TG9naW5Sb3V0ZSwgdW5hdXRob3JpemVkUm91dGUgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcblxuICAgIHJldHVybiB0aGlzLmZsb3dzU2VydmljZS5wcm9jZXNzQ29kZUZsb3dDYWxsYmFjayh1cmxUb0NoZWNrKS5waXBlKFxuICAgICAgdGFwKChjYWxsYmFja0NvbnRleHQpID0+IHtcbiAgICAgICAgaWYgKCF0cmlnZ2VyQXV0aG9yaXphdGlvblJlc3VsdEV2ZW50ICYmICFjYWxsYmFja0NvbnRleHQuaXNSZW5ld1Byb2Nlc3MpIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHBvc3RMb2dpblJvdXRlKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4ge1xuICAgICAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2UucmVzZXRTaWxlbnRSZW5ld1J1bm5pbmcoKTtcbiAgICAgICAgdGhpcy5pbnRlcnZhbGxTZXJ2aWNlLnN0b3BQZXJpb2RpY2FsbFRva2VuQ2hlY2soKTtcbiAgICAgICAgaWYgKCF0cmlnZ2VyQXV0aG9yaXphdGlvblJlc3VsdEV2ZW50ICYmICFpc1JlbmV3UHJvY2Vzcykge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodW5hdXRob3JpemVkUm91dGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIl19