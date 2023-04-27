import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthStateService } from '../authState/auth-state.service';
import { AutoLoginService } from '../auto-login/auto-login-service';
import { CheckAuthService } from '../check-auth.service';
import { LoginService } from '../login/login.service';
import * as i0 from "@angular/core";
export declare class AutoLoginGuard implements CanActivate, CanLoad {
    private autoLoginService;
    private authStateService;
    private checkAuthService;
    private loginService;
    private router;
    constructor(autoLoginService: AutoLoginService, authStateService: AuthStateService, checkAuthService: CheckAuthService, loginService: LoginService, router: Router);
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean>;
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>;
    private checkAuth;
    static ɵfac: i0.ɵɵFactoryDef<AutoLoginGuard, never>;
    static ɵprov: i0.ɵɵInjectableDef<AutoLoginGuard>;
}
//# sourceMappingURL=auto-login.guard.d.ts.map