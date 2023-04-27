import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../utils/url/url.service";
import * as i2 from "../utils/flowHelper/flow-helper.service";
import * as i3 from "./implicit-flow-callback.service";
import * as i4 from "./code-flow-callback.service";
export class CallbackService {
    constructor(urlService, flowHelper, implicitFlowCallbackService, codeFlowCallbackService) {
        this.urlService = urlService;
        this.flowHelper = flowHelper;
        this.implicitFlowCallbackService = implicitFlowCallbackService;
        this.codeFlowCallbackService = codeFlowCallbackService;
        this.stsCallbackInternal$ = new Subject();
    }
    get stsCallback$() {
        return this.stsCallbackInternal$.asObservable();
    }
    isCallback(currentUrl) {
        return this.urlService.isCallbackFromSts(currentUrl);
    }
    handleCallbackAndFireEvents(currentCallbackUrl) {
        let callback$;
        if (this.flowHelper.isCurrentFlowCodeFlow()) {
            callback$ = this.codeFlowCallbackService.authorizedCallbackWithCode(currentCallbackUrl);
        }
        else if (this.flowHelper.isCurrentFlowAnyImplicitFlow()) {
            callback$ = this.implicitFlowCallbackService.authorizedImplicitFlowCallback();
        }
        return callback$.pipe(tap(() => this.stsCallbackInternal$.next()));
    }
}
CallbackService.ɵfac = function CallbackService_Factory(t) { return new (t || CallbackService)(i0.ɵɵinject(i1.UrlService), i0.ɵɵinject(i2.FlowHelper), i0.ɵɵinject(i3.ImplicitFlowCallbackService), i0.ɵɵinject(i4.CodeFlowCallbackService)); };
CallbackService.ɵprov = i0.ɵɵdefineInjectable({ token: CallbackService, factory: CallbackService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CallbackService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: i1.UrlService }, { type: i2.FlowHelper }, { type: i3.ImplicitFlowCallbackService }, { type: i4.CodeFlowCallbackService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbGJhY2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2NhbGxiYWNrL2NhbGxiYWNrLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBUXJDLE1BQU0sT0FBTyxlQUFlO0lBTzFCLFlBQ1UsVUFBc0IsRUFDdEIsVUFBc0IsRUFDdEIsMkJBQXdELEVBQ3hELHVCQUFnRDtRQUhoRCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsZ0NBQTJCLEdBQTNCLDJCQUEyQixDQUE2QjtRQUN4RCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBVmxELHlCQUFvQixHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7SUFXMUMsQ0FBQztJQVRKLElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFTRCxVQUFVLENBQUMsVUFBa0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCwyQkFBMkIsQ0FBQyxrQkFBMEI7UUFDcEQsSUFBSSxTQUEwQixDQUFDO1FBRS9CLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFO1lBQzNDLFNBQVMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsMEJBQTBCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUN6RjthQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsRUFBRSxFQUFFO1lBQ3pELFNBQVMsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsOEJBQThCLEVBQUUsQ0FBQztTQUMvRTtRQUVELE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyRSxDQUFDOzs4RUE1QlUsZUFBZTt1REFBZixlQUFlLFdBQWYsZUFBZSxtQkFERixNQUFNO2tEQUNuQixlQUFlO2NBRDNCLFVBQVU7ZUFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDYWxsYmFja0NvbnRleHQgfSBmcm9tICcuLi9mbG93cy9jYWxsYmFjay1jb250ZXh0JztcbmltcG9ydCB7IEZsb3dIZWxwZXIgfSBmcm9tICcuLi91dGlscy9mbG93SGVscGVyL2Zsb3ctaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXJsU2VydmljZSB9IGZyb20gJy4uL3V0aWxzL3VybC91cmwuc2VydmljZSc7XG5pbXBvcnQgeyBDb2RlRmxvd0NhbGxiYWNrU2VydmljZSB9IGZyb20gJy4vY29kZS1mbG93LWNhbGxiYWNrLnNlcnZpY2UnO1xuaW1wb3J0IHsgSW1wbGljaXRGbG93Q2FsbGJhY2tTZXJ2aWNlIH0gZnJvbSAnLi9pbXBsaWNpdC1mbG93LWNhbGxiYWNrLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIENhbGxiYWNrU2VydmljZSB7XG4gIHByaXZhdGUgc3RzQ2FsbGJhY2tJbnRlcm5hbCQgPSBuZXcgU3ViamVjdCgpO1xuXG4gIGdldCBzdHNDYWxsYmFjayQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RzQ2FsbGJhY2tJbnRlcm5hbCQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHVybFNlcnZpY2U6IFVybFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBmbG93SGVscGVyOiBGbG93SGVscGVyLFxuICAgIHByaXZhdGUgaW1wbGljaXRGbG93Q2FsbGJhY2tTZXJ2aWNlOiBJbXBsaWNpdEZsb3dDYWxsYmFja1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb2RlRmxvd0NhbGxiYWNrU2VydmljZTogQ29kZUZsb3dDYWxsYmFja1NlcnZpY2VcbiAgKSB7fVxuXG4gIGlzQ2FsbGJhY2soY3VycmVudFVybDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudXJsU2VydmljZS5pc0NhbGxiYWNrRnJvbVN0cyhjdXJyZW50VXJsKTtcbiAgfVxuXG4gIGhhbmRsZUNhbGxiYWNrQW5kRmlyZUV2ZW50cyhjdXJyZW50Q2FsbGJhY2tVcmw6IHN0cmluZyk6IE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PiB7XG4gICAgbGV0IGNhbGxiYWNrJDogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gICAgaWYgKHRoaXMuZmxvd0hlbHBlci5pc0N1cnJlbnRGbG93Q29kZUZsb3coKSkge1xuICAgICAgY2FsbGJhY2skID0gdGhpcy5jb2RlRmxvd0NhbGxiYWNrU2VydmljZS5hdXRob3JpemVkQ2FsbGJhY2tXaXRoQ29kZShjdXJyZW50Q2FsbGJhY2tVcmwpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dBbnlJbXBsaWNpdEZsb3coKSkge1xuICAgICAgY2FsbGJhY2skID0gdGhpcy5pbXBsaWNpdEZsb3dDYWxsYmFja1NlcnZpY2UuYXV0aG9yaXplZEltcGxpY2l0Rmxvd0NhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbGxiYWNrJC5waXBlKHRhcCgoKSA9PiB0aGlzLnN0c0NhbGxiYWNrSW50ZXJuYWwkLm5leHQoKSkpO1xuICB9XG59XG4iXX0=