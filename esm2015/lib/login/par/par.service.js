import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../utils/url/url.service";
import * as i3 from "../../api/data.service";
import * as i4 from "../../storage/storage-persistence.service";
export class ParService {
    constructor(loggerService, urlService, dataService, storagePersistenceService) {
        this.loggerService = loggerService;
        this.urlService = urlService;
        this.dataService = dataService;
        this.storagePersistenceService = storagePersistenceService;
    }
    postParRequest(customParams) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        const authWellKnown = this.storagePersistenceService.read('authWellKnownEndPoints');
        if (!authWellKnown) {
            return throwError('Could not read PAR endpoint because authWellKnownEndPoints are not given');
        }
        const parEndpoint = authWellKnown.parEndpoint;
        if (!parEndpoint) {
            return throwError('Could not read PAR endpoint from authWellKnownEndpoints');
        }
        const data = this.urlService.createBodyForParCodeFlowRequest(customParams);
        return this.dataService.post(parEndpoint, data, headers).pipe(retry(2), map((response) => {
            this.loggerService.logDebug('par response: ', response);
            return {
                expiresIn: response.expires_in,
                requestUri: response.request_uri,
            };
        }), catchError((error) => {
            const errorMessage = `There was an error on ParService postParRequest`;
            this.loggerService.logError(errorMessage, error);
            return throwError(errorMessage);
        }));
    }
}
ParService.ɵfac = function ParService_Factory(t) { return new (t || ParService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.UrlService), i0.ɵɵinject(i3.DataService), i0.ɵɵinject(i4.StoragePersistenceService)); };
ParService.ɵprov = i0.ɵɵdefineInjectable({ token: ParService, factory: ParService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ParService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }, { type: i2.UrlService }, { type: i3.DataService }, { type: i4.StoragePersistenceService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9sb2dpbi9wYXIvcGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBUXhELE1BQU0sT0FBTyxVQUFVO0lBQ3JCLFlBQ1UsYUFBNEIsRUFDNUIsVUFBc0IsRUFDdEIsV0FBd0IsRUFDeEIseUJBQW9EO1FBSHBELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtJQUMzRCxDQUFDO0lBRUosY0FBYyxDQUFDLFlBQTJEO1FBQ3hFLElBQUksT0FBTyxHQUFnQixJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQzdDLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO1FBRTNFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUVwRixJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLE9BQU8sVUFBVSxDQUFDLDBFQUEwRSxDQUFDLENBQUM7U0FDL0Y7UUFFRCxNQUFNLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDO1FBQzlDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsT0FBTyxVQUFVLENBQUMseURBQXlELENBQUMsQ0FBQztTQUM5RTtRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsK0JBQStCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFM0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDM0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUNSLEdBQUcsQ0FBQyxDQUFDLFFBQWEsRUFBRSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXhELE9BQU87Z0JBQ0wsU0FBUyxFQUFFLFFBQVEsQ0FBQyxVQUFVO2dCQUM5QixVQUFVLEVBQUUsUUFBUSxDQUFDLFdBQVc7YUFDakMsQ0FBQztRQUNKLENBQUMsQ0FBQyxFQUNGLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ25CLE1BQU0sWUFBWSxHQUFHLGlEQUFpRCxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNqRCxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7b0VBekNVLFVBQVU7a0RBQVYsVUFBVSxXQUFWLFVBQVU7a0RBQVYsVUFBVTtjQUR0QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBtYXAsIHJldHJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hcGkvZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBVcmxTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXJsL3VybC5zZXJ2aWNlJztcbmltcG9ydCB7IFBhclJlc3BvbnNlIH0gZnJvbSAnLi9wYXItcmVzcG9uc2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGFyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIHVybFNlcnZpY2U6IFVybFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlXG4gICkge31cblxuICBwb3N0UGFyUmVxdWVzdChjdXN0b21QYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSk6IE9ic2VydmFibGU8UGFyUmVzcG9uc2U+IHtcbiAgICBsZXQgaGVhZGVyczogSHR0cEhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzID0gaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcblxuICAgIGNvbnN0IGF1dGhXZWxsS25vd24gPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycpO1xuXG4gICAgaWYgKCFhdXRoV2VsbEtub3duKSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcignQ291bGQgbm90IHJlYWQgUEFSIGVuZHBvaW50IGJlY2F1c2UgYXV0aFdlbGxLbm93bkVuZFBvaW50cyBhcmUgbm90IGdpdmVuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFyRW5kcG9pbnQgPSBhdXRoV2VsbEtub3duLnBhckVuZHBvaW50O1xuICAgIGlmICghcGFyRW5kcG9pbnQpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdDb3VsZCBub3QgcmVhZCBQQVIgZW5kcG9pbnQgZnJvbSBhdXRoV2VsbEtub3duRW5kcG9pbnRzJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHRoaXMudXJsU2VydmljZS5jcmVhdGVCb2R5Rm9yUGFyQ29kZUZsb3dSZXF1ZXN0KGN1c3RvbVBhcmFtcyk7XG5cbiAgICByZXR1cm4gdGhpcy5kYXRhU2VydmljZS5wb3N0KHBhckVuZHBvaW50LCBkYXRhLCBoZWFkZXJzKS5waXBlKFxuICAgICAgcmV0cnkoMiksXG4gICAgICBtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdwYXIgcmVzcG9uc2U6ICcsIHJlc3BvbnNlKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGV4cGlyZXNJbjogcmVzcG9uc2UuZXhwaXJlc19pbixcbiAgICAgICAgICByZXF1ZXN0VXJpOiByZXNwb25zZS5yZXF1ZXN0X3VyaSxcbiAgICAgICAgfTtcbiAgICAgIH0pLFxuICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYFRoZXJlIHdhcyBhbiBlcnJvciBvbiBQYXJTZXJ2aWNlIHBvc3RQYXJSZXF1ZXN0YDtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycm9yTWVzc2FnZSwgZXJyb3IpO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG59XG4iXX0=