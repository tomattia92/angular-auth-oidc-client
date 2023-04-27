import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../storage/storage-persistence.service";
import * as i2 from "../logging/logger.service";
import * as i3 from "../api/data.service";
export class SigninKeyDataService {
    constructor(storagePersistenceService, loggerService, dataService) {
        this.storagePersistenceService = storagePersistenceService;
        this.loggerService = loggerService;
        this.dataService = dataService;
    }
    getSigningKeys() {
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        const jwksUri = authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.jwksUri;
        if (!jwksUri) {
            const error = `getSigningKeys: authWellKnownEndpoints.jwksUri is: '${jwksUri}'`;
            this.loggerService.logWarning(error);
            return throwError(error);
        }
        this.loggerService.logDebug('Getting signinkeys from ', jwksUri);
        return this.dataService.get(jwksUri).pipe(retry(2), catchError(this.handleErrorGetSigningKeys));
    }
    handleErrorGetSigningKeys(errorResponse) {
        let errMsg = '';
        if (errorResponse instanceof HttpResponse) {
            const body = errorResponse.body || {};
            const err = JSON.stringify(body);
            const { status, statusText } = errorResponse;
            errMsg = `${status || ''} - ${statusText || ''} ${err || ''}`;
        }
        else {
            const { message } = errorResponse;
            errMsg = !!message ? message : `${errorResponse}`;
        }
        this.loggerService.logError(errMsg);
        return throwError(new Error(errMsg));
    }
}
SigninKeyDataService.ɵfac = function SigninKeyDataService_Factory(t) { return new (t || SigninKeyDataService)(i0.ɵɵinject(i1.StoragePersistenceService), i0.ɵɵinject(i2.LoggerService), i0.ɵɵinject(i3.DataService)); };
SigninKeyDataService.ɵprov = i0.ɵɵdefineInjectable({ token: SigninKeyDataService, factory: SigninKeyDataService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(SigninKeyDataService, [{
        type: Injectable
    }], function () { return [{ type: i1.StoragePersistenceService }, { type: i2.LoggerService }, { type: i3.DataService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmluLWtleS1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9mbG93cy9zaWduaW4ta2V5LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBT25ELE1BQU0sT0FBTyxvQkFBb0I7SUFDL0IsWUFDVSx5QkFBb0QsRUFDcEQsYUFBNEIsRUFDNUIsV0FBd0I7UUFGeEIsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUNwRCxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUMvQixDQUFDO0lBRUosY0FBYztRQUNaLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdGLE1BQU0sT0FBTyxHQUFHLHNCQUFzQixhQUF0QixzQkFBc0IsdUJBQXRCLHNCQUFzQixDQUFFLE9BQU8sQ0FBQztRQUNoRCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osTUFBTSxLQUFLLEdBQUcsdURBQXVELE9BQU8sR0FBRyxDQUFDO1lBQ2hGLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCO1FBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFakUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBVSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO0lBQzNHLENBQUM7SUFFTyx5QkFBeUIsQ0FBQyxhQUFzQztRQUN0RSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxhQUFhLFlBQVksWUFBWSxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakMsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxhQUFhLENBQUM7WUFDN0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLEVBQUUsTUFBTSxVQUFVLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQztTQUMvRDthQUFNO1lBQ0wsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLGFBQWEsQ0FBQztZQUNsQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDO1NBQ25EO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsT0FBTyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDOzt3RkFsQ1Usb0JBQW9COzREQUFwQixvQkFBb0IsV0FBcEIsb0JBQW9CO2tEQUFwQixvQkFBb0I7Y0FEaEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHJldHJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9hcGkvZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBKd3RLZXlzIH0gZnJvbSAnLi4vdmFsaWRhdGlvbi9qd3RrZXlzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNpZ25pbktleURhdGFTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBEYXRhU2VydmljZVxuICApIHt9XG5cbiAgZ2V0U2lnbmluZ0tleXMoKSB7XG4gICAgY29uc3QgYXV0aFdlbGxLbm93bkVuZFBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG4gICAgY29uc3Qgandrc1VyaSA9IGF1dGhXZWxsS25vd25FbmRQb2ludHM/Lmp3a3NVcmk7XG4gICAgaWYgKCFqd2tzVXJpKSB7XG4gICAgICBjb25zdCBlcnJvciA9IGBnZXRTaWduaW5nS2V5czogYXV0aFdlbGxLbm93bkVuZHBvaW50cy5qd2tzVXJpIGlzOiAnJHtqd2tzVXJpfSdgO1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoZXJyb3IpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnR2V0dGluZyBzaWduaW5rZXlzIGZyb20gJywgandrc1VyaSk7XG5cbiAgICByZXR1cm4gdGhpcy5kYXRhU2VydmljZS5nZXQ8Snd0S2V5cz4oandrc1VyaSkucGlwZShyZXRyeSgyKSwgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yR2V0U2lnbmluZ0tleXMpKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRXJyb3JHZXRTaWduaW5nS2V5cyhlcnJvclJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55PiB8IGFueSkge1xuICAgIGxldCBlcnJNc2cgPSAnJztcbiAgICBpZiAoZXJyb3JSZXNwb25zZSBpbnN0YW5jZW9mIEh0dHBSZXNwb25zZSkge1xuICAgICAgY29uc3QgYm9keSA9IGVycm9yUmVzcG9uc2UuYm9keSB8fCB7fTtcbiAgICAgIGNvbnN0IGVyciA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICAgICAgY29uc3QgeyBzdGF0dXMsIHN0YXR1c1RleHQgfSA9IGVycm9yUmVzcG9uc2U7XG4gICAgICBlcnJNc2cgPSBgJHtzdGF0dXMgfHwgJyd9IC0gJHtzdGF0dXNUZXh0IHx8ICcnfSAke2VyciB8fCAnJ31gO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IGVycm9yUmVzcG9uc2U7XG4gICAgICBlcnJNc2cgPSAhIW1lc3NhZ2UgPyBtZXNzYWdlIDogYCR7ZXJyb3JSZXNwb25zZX1gO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyTXNnKTtcbiAgICByZXR1cm4gdGhyb3dFcnJvcihuZXcgRXJyb3IoZXJyTXNnKSk7XG4gIH1cbn1cbiJdfQ==