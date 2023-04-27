import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../authState/auth-state.service";
import * as i2 from "./flows-data.service";
import * as i3 from "../userData/user-service";
export class ResetAuthDataService {
    constructor(authStateService, flowsDataService, userService) {
        this.authStateService = authStateService;
        this.flowsDataService = flowsDataService;
        this.userService = userService;
    }
    resetAuthorizationData() {
        this.userService.resetUserDataInStore();
        this.flowsDataService.resetStorageFlowData();
        this.authStateService.setUnauthorizedAndFireEvent();
    }
}
ResetAuthDataService.ɵfac = function ResetAuthDataService_Factory(t) { return new (t || ResetAuthDataService)(i0.ɵɵinject(i1.AuthStateService), i0.ɵɵinject(i2.FlowsDataService), i0.ɵɵinject(i3.UserService)); };
ResetAuthDataService.ɵprov = i0.ɵɵdefineInjectable({ token: ResetAuthDataService, factory: ResetAuthDataService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ResetAuthDataService, [{
        type: Injectable
    }], function () { return [{ type: i1.AuthStateService }, { type: i2.FlowsDataService }, { type: i3.UserService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtYXV0aC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9mbG93cy9yZXNldC1hdXRoLWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQU0zQyxNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLFlBQ21CLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsV0FBd0I7UUFGeEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQ3hDLENBQUM7SUFFSixzQkFBc0I7UUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0lBQ3RELENBQUM7O3dGQVhVLG9CQUFvQjs0REFBcEIsb0JBQW9CLFdBQXBCLG9CQUFvQjtrREFBcEIsb0JBQW9CO2NBRGhDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBdXRoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aFN0YXRlL2F1dGgtc3RhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4uL3VzZXJEYXRhL3VzZXItc2VydmljZSc7XG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy1kYXRhLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVzZXRBdXRoRGF0YVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbG93c0RhdGFTZXJ2aWNlOiBGbG93c0RhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlXG4gICkge31cblxuICByZXNldEF1dGhvcml6YXRpb25EYXRhKCk6IHZvaWQge1xuICAgIHRoaXMudXNlclNlcnZpY2UucmVzZXRVc2VyRGF0YUluU3RvcmUoKTtcbiAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2UucmVzZXRTdG9yYWdlRmxvd0RhdGEoKTtcbiAgICB0aGlzLmF1dGhTdGF0ZVNlcnZpY2Uuc2V0VW5hdXRob3JpemVkQW5kRmlyZUV2ZW50KCk7XG4gIH1cbn1cbiJdfQ==