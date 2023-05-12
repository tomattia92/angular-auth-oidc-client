import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EventTypes } from '../public-events/event-types';
import * as i0 from "@angular/core";
import * as i1 from "../public-events/public-events.service";
import * as i2 from "./auth-well-known-data.service";
import * as i3 from "../storage/storage-persistence.service";
export class AuthWellKnownService {
    constructor(publicEventsService, dataService, storagePersistenceService) {
        this.publicEventsService = publicEventsService;
        this.dataService = dataService;
        this.storagePersistenceService = storagePersistenceService;
    }
    getAuthWellKnownEndPoints(authWellknownEndpointUrl) {
        const alreadySavedWellKnownEndpoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        if (!!alreadySavedWellKnownEndpoints) {
            return of(alreadySavedWellKnownEndpoints);
        }
        return this.getWellKnownEndPointsFromUrl(authWellknownEndpointUrl).pipe(tap((mappedWellKnownEndpoints) => this.storeWellKnownEndpoints(mappedWellKnownEndpoints)), catchError((error) => {
            this.publicEventsService.fireEvent(EventTypes.ConfigLoadingFailed, null);
            return throwError(error);
        }));
    }
    storeWellKnownEndpoints(mappedWellKnownEndpoints) {
        this.storagePersistenceService.write('authWellKnownEndPoints', mappedWellKnownEndpoints);
    }
    getWellKnownEndPointsFromUrl(authWellknownEndpoint) {
        return this.dataService.getWellKnownEndPointsFromUrl(authWellknownEndpoint);
    }
}
AuthWellKnownService.ɵfac = function AuthWellKnownService_Factory(t) { return new (t || AuthWellKnownService)(i0.ɵɵinject(i1.PublicEventsService), i0.ɵɵinject(i2.AuthWellKnownDataService), i0.ɵɵinject(i3.StoragePersistenceService)); };
AuthWellKnownService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthWellKnownService, factory: AuthWellKnownService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AuthWellKnownService, [{
        type: Injectable
    }], function () { return [{ type: i1.PublicEventsService }, { type: i2.AuthWellKnownDataService }, { type: i3.StoragePersistenceService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC13ZWxsLWtub3duLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9jb25maWcvYXV0aC13ZWxsLWtub3duLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0QyxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7Ozs7QUFRMUQsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixZQUNVLG1CQUF3QyxFQUN4QyxXQUFxQyxFQUNyQyx5QkFBb0Q7UUFGcEQsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxnQkFBVyxHQUFYLFdBQVcsQ0FBMEI7UUFDckMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtJQUMzRCxDQUFDO0lBRUoseUJBQXlCLENBQUMsd0JBQWdDO1FBQ3hELE1BQU0sOEJBQThCLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxDQUFDLDhCQUE4QixFQUFFO1lBQ3BDLE9BQU8sRUFBRSxDQUFDLDhCQUE4QixDQUFDLENBQUM7U0FDM0M7UUFFRCxPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FDckUsR0FBRyxDQUFDLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEVBQ3pGLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ25CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQXNCLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RixPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELHVCQUF1QixDQUFDLHdCQUFnRDtRQUN0RSxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLHdCQUF3QixDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVPLDRCQUE0QixDQUFDLHFCQUE2QjtRQUNoRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsNEJBQTRCLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUM5RSxDQUFDOzt3RkE1QlUsb0JBQW9COzREQUFwQixvQkFBb0IsV0FBcEIsb0JBQW9CO2tEQUFwQixvQkFBb0I7Y0FEaEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgY2F0Y2hFcnJvciwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBFdmVudFR5cGVzIH0gZnJvbSAnLi4vcHVibGljLWV2ZW50cy9ldmVudC10eXBlcyc7XHJcbmltcG9ydCB7IFB1YmxpY0V2ZW50c1NlcnZpY2UgfSBmcm9tICcuLi9wdWJsaWMtZXZlbnRzL3B1YmxpYy1ldmVudHMuc2VydmljZSc7XHJcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhXZWxsS25vd25EYXRhU2VydmljZSB9IGZyb20gJy4vYXV0aC13ZWxsLWtub3duLWRhdGEuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhXZWxsS25vd25FbmRwb2ludHMgfSBmcm9tICcuL2F1dGgtd2VsbC1rbm93bi1lbmRwb2ludHMnO1xyXG5pbXBvcnQgeyBQdWJsaWNDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9wdWJsaWMtY29uZmlndXJhdGlvbic7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBdXRoV2VsbEtub3duU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHB1YmxpY0V2ZW50c1NlcnZpY2U6IFB1YmxpY0V2ZW50c1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBBdXRoV2VsbEtub3duRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2U6IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIGdldEF1dGhXZWxsS25vd25FbmRQb2ludHMoYXV0aFdlbGxrbm93bkVuZHBvaW50VXJsOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGFscmVhZHlTYXZlZFdlbGxLbm93bkVuZHBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XHJcbiAgICBpZiAoISFhbHJlYWR5U2F2ZWRXZWxsS25vd25FbmRwb2ludHMpIHtcclxuICAgICAgcmV0dXJuIG9mKGFscmVhZHlTYXZlZFdlbGxLbm93bkVuZHBvaW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2V0V2VsbEtub3duRW5kUG9pbnRzRnJvbVVybChhdXRoV2VsbGtub3duRW5kcG9pbnRVcmwpLnBpcGUoXHJcbiAgICAgIHRhcCgobWFwcGVkV2VsbEtub3duRW5kcG9pbnRzKSA9PiB0aGlzLnN0b3JlV2VsbEtub3duRW5kcG9pbnRzKG1hcHBlZFdlbGxLbm93bkVuZHBvaW50cykpLFxyXG4gICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4ge1xyXG4gICAgICAgIHRoaXMucHVibGljRXZlbnRzU2VydmljZS5maXJlRXZlbnQ8UHVibGljQ29uZmlndXJhdGlvbj4oRXZlbnRUeXBlcy5Db25maWdMb2FkaW5nRmFpbGVkLCBudWxsKTtcclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgc3RvcmVXZWxsS25vd25FbmRwb2ludHMobWFwcGVkV2VsbEtub3duRW5kcG9pbnRzOiBBdXRoV2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2Uud3JpdGUoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnLCBtYXBwZWRXZWxsS25vd25FbmRwb2ludHMpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRXZWxsS25vd25FbmRQb2ludHNGcm9tVXJsKGF1dGhXZWxsa25vd25FbmRwb2ludDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VydmljZS5nZXRXZWxsS25vd25FbmRQb2ludHNGcm9tVXJsKGF1dGhXZWxsa25vd25FbmRwb2ludCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==