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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9sb2dpbi9wYXIvcGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBUXhELE1BQU0sT0FBTyxVQUFVO0lBQ3JCLFlBQ1UsYUFBNEIsRUFDNUIsVUFBc0IsRUFDdEIsV0FBd0IsRUFDeEIseUJBQW9EO1FBSHBELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtJQUMzRCxDQUFDO0lBRUosY0FBYyxDQUFDLFlBQTJEO1FBQ3hFLElBQUksT0FBTyxHQUFnQixJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQzdDLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO1FBRTNFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUVwRixJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLE9BQU8sVUFBVSxDQUFDLDBFQUEwRSxDQUFDLENBQUM7U0FDL0Y7UUFFRCxNQUFNLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDO1FBQzlDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsT0FBTyxVQUFVLENBQUMseURBQXlELENBQUMsQ0FBQztTQUM5RTtRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsK0JBQStCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFM0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDM0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUNSLEdBQUcsQ0FBQyxDQUFDLFFBQWEsRUFBRSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXhELE9BQU87Z0JBQ0wsU0FBUyxFQUFFLFFBQVEsQ0FBQyxVQUFVO2dCQUM5QixVQUFVLEVBQUUsUUFBUSxDQUFDLFdBQVc7YUFDakMsQ0FBQztRQUNKLENBQUMsQ0FBQyxFQUNGLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ25CLE1BQU0sWUFBWSxHQUFHLGlEQUFpRCxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNqRCxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7b0VBekNVLFVBQVU7a0RBQVYsVUFBVSxXQUFWLFVBQVU7a0RBQVYsVUFBVTtjQUR0QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBjYXRjaEVycm9yLCBtYXAsIHJldHJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBEYXRhU2VydmljZSB9IGZyb20gJy4uLy4uL2FwaS9kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IFVybFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy91cmwvdXJsLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQYXJSZXNwb25zZSB9IGZyb20gJy4vcGFyLXJlc3BvbnNlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFBhclNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSB1cmxTZXJ2aWNlOiBVcmxTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2U6IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIHBvc3RQYXJSZXF1ZXN0KGN1c3RvbVBhcmFtcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KTogT2JzZXJ2YWJsZTxQYXJSZXNwb25zZT4ge1xyXG4gICAgbGV0IGhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICBoZWFkZXJzID0gaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuXHJcbiAgICBjb25zdCBhdXRoV2VsbEtub3duID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnKTtcclxuXHJcbiAgICBpZiAoIWF1dGhXZWxsS25vd24pIHtcclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoJ0NvdWxkIG5vdCByZWFkIFBBUiBlbmRwb2ludCBiZWNhdXNlIGF1dGhXZWxsS25vd25FbmRQb2ludHMgYXJlIG5vdCBnaXZlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhckVuZHBvaW50ID0gYXV0aFdlbGxLbm93bi5wYXJFbmRwb2ludDtcclxuICAgIGlmICghcGFyRW5kcG9pbnQpIHtcclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoJ0NvdWxkIG5vdCByZWFkIFBBUiBlbmRwb2ludCBmcm9tIGF1dGhXZWxsS25vd25FbmRwb2ludHMnKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy51cmxTZXJ2aWNlLmNyZWF0ZUJvZHlGb3JQYXJDb2RlRmxvd1JlcXVlc3QoY3VzdG9tUGFyYW1zKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VydmljZS5wb3N0KHBhckVuZHBvaW50LCBkYXRhLCBoZWFkZXJzKS5waXBlKFxyXG4gICAgICByZXRyeSgyKSxcclxuICAgICAgbWFwKChyZXNwb25zZTogYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdwYXIgcmVzcG9uc2U6ICcsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGV4cGlyZXNJbjogcmVzcG9uc2UuZXhwaXJlc19pbixcclxuICAgICAgICAgIHJlcXVlc3RVcmk6IHJlc3BvbnNlLnJlcXVlc3RfdXJpLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0pLFxyXG4gICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBUaGVyZSB3YXMgYW4gZXJyb3Igb24gUGFyU2VydmljZSBwb3N0UGFyUmVxdWVzdGA7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycm9yTWVzc2FnZSwgZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yTWVzc2FnZSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=