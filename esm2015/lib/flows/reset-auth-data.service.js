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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtYXV0aC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9mbG93cy9yZXNldC1hdXRoLWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQU0zQyxNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLFlBQ21CLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsV0FBd0I7UUFGeEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQ3hDLENBQUM7SUFFSixzQkFBc0I7UUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0lBQ3RELENBQUM7O3dGQVhVLG9CQUFvQjs0REFBcEIsb0JBQW9CLFdBQXBCLG9CQUFvQjtrREFBcEIsb0JBQW9CO2NBRGhDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9hdXRoU3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi91c2VyRGF0YS91c2VyLXNlcnZpY2UnO1xyXG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy1kYXRhLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUmVzZXRBdXRoRGF0YVNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhdXRoU3RhdGVTZXJ2aWNlOiBBdXRoU3RhdGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbG93c0RhdGFTZXJ2aWNlOiBGbG93c0RhdGFTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSB1c2VyU2VydmljZTogVXNlclNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIHJlc2V0QXV0aG9yaXphdGlvbkRhdGEoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlLnJlc2V0VXNlckRhdGFJblN0b3JlKCk7XHJcbiAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2UucmVzZXRTdG9yYWdlRmxvd0RhdGEoKTtcclxuICAgIHRoaXMuYXV0aFN0YXRlU2VydmljZS5zZXRVbmF1dGhvcml6ZWRBbmRGaXJlRXZlbnQoKTtcclxuICB9XHJcbn1cclxuIl19