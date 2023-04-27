import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../logging/logger.service";
import * as i2 from "../flows/reset-auth-data.service";
import * as i3 from "../flows/flows.service";
import * as i4 from "./intervall.service";
export class RefreshSessionRefreshTokenService {
    constructor(loggerService, resetAuthDataService, flowsService, intervalService) {
        this.loggerService = loggerService;
        this.resetAuthDataService = resetAuthDataService;
        this.flowsService = flowsService;
        this.intervalService = intervalService;
    }
    refreshSessionWithRefreshTokens(customParamsRefresh) {
        this.loggerService.logDebug('BEGIN refresh session Authorize');
        return this.flowsService.processRefreshToken(customParamsRefresh).pipe(catchError((error) => {
            this.intervalService.stopPeriodicallTokenCheck();
            this.resetAuthDataService.resetAuthorizationData();
            return throwError(error);
        }));
    }
}
RefreshSessionRefreshTokenService.ɵfac = function RefreshSessionRefreshTokenService_Factory(t) { return new (t || RefreshSessionRefreshTokenService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.ResetAuthDataService), i0.ɵɵinject(i3.FlowsService), i0.ɵɵinject(i4.IntervallService)); };
RefreshSessionRefreshTokenService.ɵprov = i0.ɵɵdefineInjectable({ token: RefreshSessionRefreshTokenService, factory: RefreshSessionRefreshTokenService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RefreshSessionRefreshTokenService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: i1.LoggerService }, { type: i2.ResetAuthDataService }, { type: i3.FlowsService }, { type: i4.IntervallService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC1zZXNzaW9uLXJlZnJlc2gtdG9rZW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2NhbGxiYWNrL3JlZnJlc2gtc2Vzc2lvbi1yZWZyZXNoLXRva2VuLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBUTVDLE1BQU0sT0FBTyxpQ0FBaUM7SUFDNUMsWUFDVSxhQUE0QixFQUM1QixvQkFBMEMsRUFDMUMsWUFBMEIsRUFDMUIsZUFBaUM7UUFIakMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7SUFDeEMsQ0FBQztJQUVKLCtCQUErQixDQUFDLG1CQUFrRTtRQUNoRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1FBRS9ELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksQ0FDcEUsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBQ2pELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQ25ELE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDOztrSEFsQlUsaUNBQWlDO3lFQUFqQyxpQ0FBaUMsV0FBakMsaUNBQWlDLG1CQURwQixNQUFNO2tEQUNuQixpQ0FBaUM7Y0FEN0MsVUFBVTtlQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDYWxsYmFja0NvbnRleHQgfSBmcm9tICcuLi9mbG93cy9jYWxsYmFjay1jb250ZXh0JztcbmltcG9ydCB7IEZsb3dzU2VydmljZSB9IGZyb20gJy4uL2Zsb3dzL2Zsb3dzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzZXRBdXRoRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy9yZXNldC1hdXRoLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBJbnRlcnZhbGxTZXJ2aWNlIH0gZnJvbSAnLi9pbnRlcnZhbGwuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgUmVmcmVzaFNlc3Npb25SZWZyZXNoVG9rZW5TZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVzZXRBdXRoRGF0YVNlcnZpY2U6IFJlc2V0QXV0aERhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgZmxvd3NTZXJ2aWNlOiBGbG93c1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBpbnRlcnZhbFNlcnZpY2U6IEludGVydmFsbFNlcnZpY2VcbiAgKSB7fVxuXG4gIHJlZnJlc2hTZXNzaW9uV2l0aFJlZnJlc2hUb2tlbnMoY3VzdG9tUGFyYW1zUmVmcmVzaD86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KTogT2JzZXJ2YWJsZTxDYWxsYmFja0NvbnRleHQ+IHtcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0JFR0lOIHJlZnJlc2ggc2Vzc2lvbiBBdXRob3JpemUnKTtcblxuICAgIHJldHVybiB0aGlzLmZsb3dzU2VydmljZS5wcm9jZXNzUmVmcmVzaFRva2VuKGN1c3RvbVBhcmFtc1JlZnJlc2gpLnBpcGUoXG4gICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4ge1xuICAgICAgICB0aGlzLmludGVydmFsU2VydmljZS5zdG9wUGVyaW9kaWNhbGxUb2tlbkNoZWNrKCk7XG4gICAgICAgIHRoaXMucmVzZXRBdXRoRGF0YVNlcnZpY2UucmVzZXRBdXRob3JpemF0aW9uRGF0YSgpO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cbiJdfQ==