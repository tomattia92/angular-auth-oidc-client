import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../authState/auth-state.service";
import * as i2 from "../config/config.provider";
import * as i3 from "./../logging/logger.service";
export class AuthInterceptor {
    constructor(authStateService, configurationProvider, loggerService) {
        this.authStateService = authStateService;
        this.configurationProvider = configurationProvider;
        this.loggerService = loggerService;
    }
    intercept(req, next) {
        // Ensure we send the token only to routes which are secured
        const { secureRoutes } = this.configurationProvider.getOpenIDConfiguration();
        if (!secureRoutes) {
            this.loggerService.logDebug(`No routes to check configured`);
            return next.handle(req);
        }
        const matchingRoute = secureRoutes.find((x) => req.url.startsWith(x));
        if (!matchingRoute) {
            this.loggerService.logDebug(`Did not find matching route for ${req.url}`);
            return next.handle(req);
        }
        this.loggerService.logDebug(`'${req.url}' matches configured route '${matchingRoute}'`);
        const token = this.authStateService.getAccessToken();
        if (!token) {
            this.loggerService.logDebug(`Wanted to add token to ${req.url} but found no token: '${token}'`);
            return next.handle(req);
        }
        this.loggerService.logDebug(`'${req.url}' matches configured route '${matchingRoute}', adding token`);
        req = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token),
        });
        return next.handle(req);
    }
}
AuthInterceptor.ɵfac = function AuthInterceptor_Factory(t) { return new (t || AuthInterceptor)(i0.ɵɵinject(i1.AuthStateService), i0.ɵɵinject(i2.ConfigurationProvider), i0.ɵɵinject(i3.LoggerService)); };
AuthInterceptor.ɵprov = i0.ɵɵdefineInjectable({ token: AuthInterceptor, factory: AuthInterceptor.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AuthInterceptor, [{
        type: Injectable
    }], function () { return [{ type: i1.AuthStateService }, { type: i2.ConfigurationProvider }, { type: i3.LoggerService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5pbnRlcmNlcHRvci5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFPM0MsTUFBTSxPQUFPLGVBQWU7SUFDMUIsWUFDVSxnQkFBa0MsRUFDbEMscUJBQTRDLEVBQzVDLGFBQTRCO1FBRjVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUNuQyxDQUFDO0lBRUosU0FBUyxDQUFDLEdBQXFCLEVBQUUsSUFBaUI7UUFDaEQsNERBQTREO1FBQzVELE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUU3RSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDN0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLG1DQUFtQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUMxRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLCtCQUErQixhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBRXhGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVyRCxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLEdBQUcsQ0FBQyxHQUFHLHlCQUF5QixLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2hHLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsK0JBQStCLGFBQWEsaUJBQWlCLENBQUMsQ0FBQztRQUN0RyxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUNkLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsU0FBUyxHQUFHLEtBQUssQ0FBQztTQUM3RCxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQzs7OEVBdENVLGVBQWU7dURBQWYsZUFBZSxXQUFmLGVBQWU7a0RBQWYsZUFBZTtjQUQzQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cEV2ZW50LCBIdHRwSGFuZGxlciwgSHR0cEludGVyY2VwdG9yLCBIdHRwUmVxdWVzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9hdXRoU3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBdXRoSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2VcbiAgKSB7fVxuXG4gIGludGVyY2VwdChyZXE6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xuICAgIC8vIEVuc3VyZSB3ZSBzZW5kIHRoZSB0b2tlbiBvbmx5IHRvIHJvdXRlcyB3aGljaCBhcmUgc2VjdXJlZFxuICAgIGNvbnN0IHsgc2VjdXJlUm91dGVzIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICBpZiAoIXNlY3VyZVJvdXRlcykge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGBObyByb3V0ZXMgdG8gY2hlY2sgY29uZmlndXJlZGApO1xuICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcSk7XG4gICAgfVxuXG4gICAgY29uc3QgbWF0Y2hpbmdSb3V0ZSA9IHNlY3VyZVJvdXRlcy5maW5kKCh4KSA9PiByZXEudXJsLnN0YXJ0c1dpdGgoeCkpO1xuXG4gICAgaWYgKCFtYXRjaGluZ1JvdXRlKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYERpZCBub3QgZmluZCBtYXRjaGluZyByb3V0ZSBmb3IgJHtyZXEudXJsfWApO1xuICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcSk7XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGAnJHtyZXEudXJsfScgbWF0Y2hlcyBjb25maWd1cmVkIHJvdXRlICcke21hdGNoaW5nUm91dGV9J2ApO1xuXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuZ2V0QWNjZXNzVG9rZW4oKTtcblxuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhgV2FudGVkIHRvIGFkZCB0b2tlbiB0byAke3JlcS51cmx9IGJ1dCBmb3VuZCBubyB0b2tlbjogJyR7dG9rZW59J2ApO1xuICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcSk7XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGAnJHtyZXEudXJsfScgbWF0Y2hlcyBjb25maWd1cmVkIHJvdXRlICcke21hdGNoaW5nUm91dGV9JywgYWRkaW5nIHRva2VuYCk7XG4gICAgcmVxID0gcmVxLmNsb25lKHtcbiAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzLnNldCgnQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIHRva2VuKSxcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXEpO1xuICB9XG59XG4iXX0=