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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1sb2dpbi5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2F1dG8tbG9naW4vYXV0by1sb2dpbi5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7O0FBT3JDLE1BQU0sT0FBTyxjQUFjO0lBQ3pCLFlBQ1UsZ0JBQWtDLEVBQ2xDLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsWUFBMEIsRUFDMUIsTUFBYztRQUpkLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDckIsQ0FBQztJQUVKLE9BQU8sQ0FBQyxLQUFZLEVBQUUsUUFBc0I7UUFDMUMsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUzQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUE2QixFQUFFLEtBQTBCO1FBQ25FLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVPLFNBQVMsQ0FBQyxHQUFXO1FBQzNCLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBRTFFLElBQUksZUFBZSxFQUFFO1lBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pCO1FBRUQsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUMzQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUNuQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUVuRSxJQUFJLFlBQVksRUFBRTtnQkFDaEIsSUFBSSxXQUFXLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixFQUFFLENBQUM7b0JBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN4QztnQkFDRCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUIsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7NEVBM0NVLGNBQWM7c0RBQWQsY0FBYyxXQUFkLGNBQWMsbUJBREQsTUFBTTtrREFDbkIsY0FBYztjQUQxQixVQUFVO2VBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgQ2FuQWN0aXZhdGUsIENhbkxvYWQsIFJvdXRlLCBSb3V0ZXIsIFJvdXRlclN0YXRlU25hcHNob3QsIFVybFNlZ21lbnQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9hdXRoU3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IEF1dG9Mb2dpblNlcnZpY2UgfSBmcm9tICcuLi9hdXRvLWxvZ2luL2F1dG8tbG9naW4tc2VydmljZSc7XG5pbXBvcnQgeyBDaGVja0F1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vY2hlY2stYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4uL2xvZ2luL2xvZ2luLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEF1dG9Mb2dpbkd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUsIENhbkxvYWQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGF1dG9Mb2dpblNlcnZpY2U6IEF1dG9Mb2dpblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBhdXRoU3RhdGVTZXJ2aWNlOiBBdXRoU3RhdGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2hlY2tBdXRoU2VydmljZTogQ2hlY2tBdXRoU2VydmljZSxcbiAgICBwcml2YXRlIGxvZ2luU2VydmljZTogTG9naW5TZXJ2aWNlLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcbiAgKSB7fVxuXG4gIGNhbkxvYWQocm91dGU6IFJvdXRlLCBzZWdtZW50czogVXJsU2VnbWVudFtdKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgY29uc3Qgcm91dGVUb1JlZGlyZWN0ID0gc2VnbWVudHMuam9pbignLycpO1xuXG4gICAgcmV0dXJuIHRoaXMuY2hlY2tBdXRoKHJvdXRlVG9SZWRpcmVjdCk7XG4gIH1cblxuICBjYW5BY3RpdmF0ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5jaGVja0F1dGgoc3RhdGUudXJsKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tBdXRoKHVybDogc3RyaW5nKSB7XG4gICAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmFyZUF1dGhTdG9yYWdlVG9rZW5zVmFsaWQoKTtcblxuICAgIGlmIChpc0F1dGhlbnRpY2F0ZWQpIHtcbiAgICAgIHJldHVybiBvZih0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jaGVja0F1dGhTZXJ2aWNlLmNoZWNrQXV0aCgpLnBpcGUoXG4gICAgICBtYXAoKGlzQXV0aG9yaXplZCkgPT4ge1xuICAgICAgICBjb25zdCBzdG9yZWRSb3V0ZSA9IHRoaXMuYXV0b0xvZ2luU2VydmljZS5nZXRTdG9yZWRSZWRpcmVjdFJvdXRlKCk7XG5cbiAgICAgICAgaWYgKGlzQXV0aG9yaXplZCkge1xuICAgICAgICAgIGlmIChzdG9yZWRSb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5hdXRvTG9naW5TZXJ2aWNlLmRlbGV0ZVN0b3JlZFJlZGlyZWN0Um91dGUoKTtcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwoc3RvcmVkUm91dGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXV0b0xvZ2luU2VydmljZS5zYXZlU3RvcmVkUmVkaXJlY3RSb3V0ZSh1cmwpO1xuICAgICAgICB0aGlzLmxvZ2luU2VydmljZS5sb2dpbigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cbiJdfQ==