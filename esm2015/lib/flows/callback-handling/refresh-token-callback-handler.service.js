import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError, timer } from 'rxjs';
import { catchError, mergeMap, retryWhen, switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/url/url.service";
import * as i2 from "../../logging/logger.service";
import * as i3 from "../../config/config.provider";
import * as i4 from "../../api/data.service";
import * as i5 from "../../storage/storage-persistence.service";
export class RefreshTokenCallbackHandlerService {
    constructor(urlService, loggerService, configurationProvider, dataService, storagePersistenceService) {
        this.urlService = urlService;
        this.loggerService = loggerService;
        this.configurationProvider = configurationProvider;
        this.dataService = dataService;
        this.storagePersistenceService = storagePersistenceService;
    }
    // STEP 2 Refresh Token
    refreshTokensRequestTokens(callbackContext, customParamsRefresh) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        const authWellKnown = this.storagePersistenceService.read('authWellKnownEndPoints');
        const tokenEndpoint = authWellKnown === null || authWellKnown === void 0 ? void 0 : authWellKnown.tokenEndpoint;
        if (!tokenEndpoint) {
            return throwError('Token Endpoint not defined');
        }
        const data = this.urlService.createBodyForCodeFlowRefreshTokensRequest(callbackContext.refreshToken, customParamsRefresh);
        return this.dataService.post(tokenEndpoint, data, headers).pipe(switchMap((response) => {
            this.loggerService.logDebug('token refresh response: ', response);
            let authResult = new Object();
            authResult = response;
            authResult.state = callbackContext.state;
            callbackContext.authResult = authResult;
            return of(callbackContext);
        }), retryWhen((error) => this.handleRefreshRetry(error)), catchError((error) => {
            const { stsServer } = this.configurationProvider.getOpenIDConfiguration();
            const errorMessage = `OidcService code request ${stsServer}`;
            this.loggerService.logError(errorMessage, error);
            return throwError(errorMessage);
        }));
    }
    handleRefreshRetry(errors) {
        return errors.pipe(mergeMap((error) => {
            // retry token refresh if there is no internet connection
            if (error && error instanceof HttpErrorResponse && error.error instanceof ProgressEvent && error.error.type === 'error') {
                const { stsServer, refreshTokenRetryInSeconds } = this.configurationProvider.getOpenIDConfiguration();
                const errorMessage = `OidcService code request ${stsServer} - no internet connection`;
                this.loggerService.logWarning(errorMessage, error);
                return timer(refreshTokenRetryInSeconds * 1000);
            }
            return throwError(error);
        }));
    }
}
RefreshTokenCallbackHandlerService.ɵfac = function RefreshTokenCallbackHandlerService_Factory(t) { return new (t || RefreshTokenCallbackHandlerService)(i0.ɵɵinject(i1.UrlService), i0.ɵɵinject(i2.LoggerService), i0.ɵɵinject(i3.ConfigurationProvider), i0.ɵɵinject(i4.DataService), i0.ɵɵinject(i5.StoragePersistenceService)); };
RefreshTokenCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: RefreshTokenCallbackHandlerService, factory: RefreshTokenCallbackHandlerService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RefreshTokenCallbackHandlerService, [{
        type: Injectable
    }], function () { return [{ type: i1.UrlService }, { type: i2.LoggerService }, { type: i3.ConfigurationProvider }, { type: i4.DataService }, { type: i5.StoragePersistenceService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC10b2tlbi1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9yZWZyZXNoLXRva2VuLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDdEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDekQsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7O0FBUzVFLE1BQU0sT0FBTyxrQ0FBa0M7SUFDN0MsWUFDbUIsVUFBc0IsRUFDdEIsYUFBNEIsRUFDNUIscUJBQTRDLEVBQzVDLFdBQXdCLEVBQ3hCLHlCQUFvRDtRQUpwRCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtJQUNwRSxDQUFDO0lBRUosdUJBQXVCO0lBQ3ZCLDBCQUEwQixDQUN4QixlQUFnQyxFQUNoQyxtQkFBa0U7UUFFbEUsSUFBSSxPQUFPLEdBQWdCLElBQUksV0FBVyxFQUFFLENBQUM7UUFDN0MsT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7UUFFM0UsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sYUFBYSxHQUFHLGFBQWEsYUFBYixhQUFhLHVCQUFiLGFBQWEsQ0FBRSxhQUFhLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNsQixPQUFPLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1NBQ2pEO1FBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyx5Q0FBeUMsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFMUgsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDN0QsU0FBUyxDQUFDLENBQUMsUUFBYSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDbEUsSUFBSSxVQUFVLEdBQVEsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNuQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQztZQUV6QyxlQUFlLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUN4QyxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsRUFDRixTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUNwRCxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNuQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDMUUsTUFBTSxZQUFZLEdBQUcsNEJBQTRCLFNBQVMsRUFBRSxDQUFDO1lBQzdELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNqRCxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVPLGtCQUFrQixDQUFDLE1BQXVCO1FBQ2hELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FDaEIsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDakIseURBQXlEO1lBQ3pELElBQUksS0FBSyxJQUFJLEtBQUssWUFBWSxpQkFBaUIsSUFBSSxLQUFLLENBQUMsS0FBSyxZQUFZLGFBQWEsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7Z0JBQ3ZILE1BQU0sRUFBRSxTQUFTLEVBQUUsMEJBQTBCLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztnQkFDdEcsTUFBTSxZQUFZLEdBQUcsNEJBQTRCLFNBQVMsMkJBQTJCLENBQUM7Z0JBQ3RGLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbkQsT0FBTyxLQUFLLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDakQ7WUFDRCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7b0hBMURVLGtDQUFrQzswRUFBbEMsa0NBQWtDLFdBQWxDLGtDQUFrQztrREFBbEMsa0NBQWtDO2NBRDlDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwRXJyb3JSZXNwb25zZSwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciwgdGltZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1lcmdlTWFwLCByZXRyeVdoZW4sIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYXBpL2RhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi8uLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBVcmxTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXJsL3VybC5zZXJ2aWNlJztcbmltcG9ydCB7IENhbGxiYWNrQ29udGV4dCB9IGZyb20gJy4uL2NhbGxiYWNrLWNvbnRleHQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVmcmVzaFRva2VuQ2FsbGJhY2tIYW5kbGVyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdXJsU2VydmljZTogVXJsU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2U6IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2VcbiAgKSB7fVxuXG4gIC8vIFNURVAgMiBSZWZyZXNoIFRva2VuXG4gIHJlZnJlc2hUb2tlbnNSZXF1ZXN0VG9rZW5zKFxuICAgIGNhbGxiYWNrQ29udGV4dDogQ2FsbGJhY2tDb250ZXh0LFxuICAgIGN1c3RvbVBhcmFtc1JlZnJlc2g/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfVxuICApOiBPYnNlcnZhYmxlPENhbGxiYWNrQ29udGV4dD4ge1xuICAgIGxldCBoZWFkZXJzOiBIdHRwSGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgIGhlYWRlcnMgPSBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuXG4gICAgY29uc3QgYXV0aFdlbGxLbm93biA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG4gICAgY29uc3QgdG9rZW5FbmRwb2ludCA9IGF1dGhXZWxsS25vd24/LnRva2VuRW5kcG9pbnQ7XG4gICAgaWYgKCF0b2tlbkVuZHBvaW50KSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcignVG9rZW4gRW5kcG9pbnQgbm90IGRlZmluZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gdGhpcy51cmxTZXJ2aWNlLmNyZWF0ZUJvZHlGb3JDb2RlRmxvd1JlZnJlc2hUb2tlbnNSZXF1ZXN0KGNhbGxiYWNrQ29udGV4dC5yZWZyZXNoVG9rZW4sIGN1c3RvbVBhcmFtc1JlZnJlc2gpO1xuXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcnZpY2UucG9zdCh0b2tlbkVuZHBvaW50LCBkYXRhLCBoZWFkZXJzKS5waXBlKFxuICAgICAgc3dpdGNoTWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygndG9rZW4gcmVmcmVzaCByZXNwb25zZTogJywgcmVzcG9uc2UpO1xuICAgICAgICBsZXQgYXV0aFJlc3VsdDogYW55ID0gbmV3IE9iamVjdCgpO1xuICAgICAgICBhdXRoUmVzdWx0ID0gcmVzcG9uc2U7XG4gICAgICAgIGF1dGhSZXN1bHQuc3RhdGUgPSBjYWxsYmFja0NvbnRleHQuc3RhdGU7XG5cbiAgICAgICAgY2FsbGJhY2tDb250ZXh0LmF1dGhSZXN1bHQgPSBhdXRoUmVzdWx0O1xuICAgICAgICByZXR1cm4gb2YoY2FsbGJhY2tDb250ZXh0KTtcbiAgICAgIH0pLFxuICAgICAgcmV0cnlXaGVuKChlcnJvcikgPT4gdGhpcy5oYW5kbGVSZWZyZXNoUmV0cnkoZXJyb3IpKSxcbiAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgc3RzU2VydmVyIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBPaWRjU2VydmljZSBjb2RlIHJlcXVlc3QgJHtzdHNTZXJ2ZXJ9YDtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycm9yTWVzc2FnZSwgZXJyb3IpO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVSZWZyZXNoUmV0cnkoZXJyb3JzOiBPYnNlcnZhYmxlPGFueT4pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBlcnJvcnMucGlwZShcbiAgICAgIG1lcmdlTWFwKChlcnJvcikgPT4ge1xuICAgICAgICAvLyByZXRyeSB0b2tlbiByZWZyZXNoIGlmIHRoZXJlIGlzIG5vIGludGVybmV0IGNvbm5lY3Rpb25cbiAgICAgICAgaWYgKGVycm9yICYmIGVycm9yIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UgJiYgZXJyb3IuZXJyb3IgaW5zdGFuY2VvZiBQcm9ncmVzc0V2ZW50ICYmIGVycm9yLmVycm9yLnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBjb25zdCB7IHN0c1NlcnZlciwgcmVmcmVzaFRva2VuUmV0cnlJblNlY29uZHMgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgT2lkY1NlcnZpY2UgY29kZSByZXF1ZXN0ICR7c3RzU2VydmVyfSAtIG5vIGludGVybmV0IGNvbm5lY3Rpb25gO1xuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGVycm9yTWVzc2FnZSwgZXJyb3IpO1xuICAgICAgICAgIHJldHVybiB0aW1lcihyZWZyZXNoVG9rZW5SZXRyeUluU2Vjb25kcyAqIDEwMDApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIl19