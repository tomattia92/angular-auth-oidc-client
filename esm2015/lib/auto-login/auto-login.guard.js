import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../auto-login/auto-login-service";
import * as i2 from "../authState/auth-state.service";
import * as i3 from "../check-auth.service";
import * as i4 from "../login/login.service";
import * as i5 from "@angular/router";
export class AutoLoginGuard {
    constructor(autoLoginService, authStateService, checkAuthService, loginService, router) {
        this.autoLoginService = autoLoginService;
        this.authStateService = authStateService;
        this.checkAuthService = checkAuthService;
        this.loginService = loginService;
        this.router = router;
    }
    canLoad(route, segments) {
        const routeToRedirect = segments.join('/');
        return this.checkAuth(routeToRedirect);
    }
    canActivate(route, state) {
        return this.checkAuth(state.url);
    }
    checkAuth(url) {
        const isAuthenticated = this.authStateService.areAuthStorageTokensValid();
        if (isAuthenticated) {
            return of(true);
        }
        return this.checkAuthService.checkAuth().pipe(map((isAuthorized) => {
            const storedRoute = this.autoLoginService.getStoredRedirectRoute();
            if (isAuthorized) {
                if (storedRoute) {
                    this.autoLoginService.deleteStoredRedirectRoute();
                    this.router.navigateByUrl(storedRoute);
                }
                return true;
            }
            this.autoLoginService.saveStoredRedirectRoute(url);
            this.loginService.login();
            return false;
        }));
    }
}
AutoLoginGuard.ɵfac = function AutoLoginGuard_Factory(t) { return new (t || AutoLoginGuard)(i0.ɵɵinject(i1.AutoLoginService), i0.ɵɵinject(i2.AuthStateService), i0.ɵɵinject(i3.CheckAuthService), i0.ɵɵinject(i4.LoginService), i0.ɵɵinject(i5.Router)); };
AutoLoginGuard.ɵprov = i0.ɵɵdefineInjectable({ token: AutoLoginGuard, factory: AutoLoginGuard.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AutoLoginGuard, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: i1.AutoLoginService }, { type: i2.AuthStateService }, { type: i3.CheckAuthService }, { type: i4.LoginService }, { type: i5.Router }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1sb2dpbi5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2F1dG8tbG9naW4vYXV0by1sb2dpbi5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7O0FBT3JDLE1BQU0sT0FBTyxjQUFjO0lBQ3pCLFlBQ1UsZ0JBQWtDLEVBQ2xDLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsWUFBMEIsRUFDMUIsTUFBYztRQUpkLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDckIsQ0FBQztJQUVKLE9BQU8sQ0FBQyxLQUFZLEVBQUUsUUFBc0I7UUFDMUMsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUzQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUE2QixFQUFFLEtBQTBCO1FBQ25FLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVPLFNBQVMsQ0FBQyxHQUFXO1FBQzNCLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBRTFFLElBQUksZUFBZSxFQUFFO1lBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pCO1FBRUQsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUMzQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUNuQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUVuRSxJQUFJLFlBQVksRUFBRTtnQkFDaEIsSUFBSSxXQUFXLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixFQUFFLENBQUM7b0JBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN4QztnQkFDRCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUIsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7NEVBM0NVLGNBQWM7c0RBQWQsY0FBYyxXQUFkLGNBQWMsbUJBREQsTUFBTTtrREFDbkIsY0FBYztjQUQxQixVQUFVO2VBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBDYW5BY3RpdmF0ZSwgQ2FuTG9hZCwgUm91dGUsIFJvdXRlciwgUm91dGVyU3RhdGVTbmFwc2hvdCwgVXJsU2VnbWVudCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4uL2F1dGhTdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRvTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi4vYXV0by1sb2dpbi9hdXRvLWxvZ2luLXNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDaGVja0F1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vY2hlY2stYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi4vbG9naW4vbG9naW4uc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgQXV0b0xvZ2luR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSwgQ2FuTG9hZCB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGF1dG9Mb2dpblNlcnZpY2U6IEF1dG9Mb2dpblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNoZWNrQXV0aFNlcnZpY2U6IENoZWNrQXV0aFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGxvZ2luU2VydmljZTogTG9naW5TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlclxyXG4gICkge31cclxuXHJcbiAgY2FuTG9hZChyb3V0ZTogUm91dGUsIHNlZ21lbnRzOiBVcmxTZWdtZW50W10pOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIGNvbnN0IHJvdXRlVG9SZWRpcmVjdCA9IHNlZ21lbnRzLmpvaW4oJy8nKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5jaGVja0F1dGgocm91dGVUb1JlZGlyZWN0KTtcclxuICB9XHJcblxyXG4gIGNhbkFjdGl2YXRlKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hlY2tBdXRoKHN0YXRlLnVybCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrQXV0aCh1cmw6IHN0cmluZykge1xyXG4gICAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmFyZUF1dGhTdG9yYWdlVG9rZW5zVmFsaWQoKTtcclxuXHJcbiAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgIHJldHVybiBvZih0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5jaGVja0F1dGhTZXJ2aWNlLmNoZWNrQXV0aCgpLnBpcGUoXHJcbiAgICAgIG1hcCgoaXNBdXRob3JpemVkKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3RvcmVkUm91dGUgPSB0aGlzLmF1dG9Mb2dpblNlcnZpY2UuZ2V0U3RvcmVkUmVkaXJlY3RSb3V0ZSgpO1xyXG5cclxuICAgICAgICBpZiAoaXNBdXRob3JpemVkKSB7XHJcbiAgICAgICAgICBpZiAoc3RvcmVkUm91dGUpIHtcclxuICAgICAgICAgICAgdGhpcy5hdXRvTG9naW5TZXJ2aWNlLmRlbGV0ZVN0b3JlZFJlZGlyZWN0Um91dGUoKTtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybChzdG9yZWRSb3V0ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXV0b0xvZ2luU2VydmljZS5zYXZlU3RvcmVkUmVkaXJlY3RSb3V0ZSh1cmwpO1xyXG4gICAgICAgIHRoaXMubG9naW5TZXJ2aWNlLmxvZ2luKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19