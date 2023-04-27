import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError, timer } from 'rxjs';
import { catchError, mergeMap, retryWhen, switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/url/url.service";
import * as i2 from "../../logging/logger.service";
import * as i3 from "../../validation/token-validation.service";
import * as i4 from "../flows-data.service";
import * as i5 from "../../config/config.provider";
import * as i6 from "../../storage/storage-persistence.service";
import * as i7 from "../../api/data.service";
export class CodeFlowCallbackHandlerService {
    constructor(urlService, loggerService, tokenValidationService, flowsDataService, configurationProvider, storagePersistenceService, dataService) {
        this.urlService = urlService;
        this.loggerService = loggerService;
        this.tokenValidationService = tokenValidationService;
        this.flowsDataService = flowsDataService;
        this.configurationProvider = configurationProvider;
        this.storagePersistenceService = storagePersistenceService;
        this.dataService = dataService;
    }
    // STEP 1 Code Flow
    codeFlowCallback(urlToCheck) {
        const code = this.urlService.getUrlParameter(urlToCheck, 'code');
        const state = this.urlService.getUrlParameter(urlToCheck, 'state');
        const sessionState = this.urlService.getUrlParameter(urlToCheck, 'session_state') || null;
        if (!state) {
            this.loggerService.logDebug('no state in url');
            return throwError('no state in url');
        }
        if (!code) {
            this.loggerService.logDebug('no code in url');
            return throwError('no code in url');
        }
        this.loggerService.logDebug('running validation for callback', urlToCheck);
        const initialCallbackContext = {
            code,
            refreshToken: null,
            state,
            sessionState,
            authResult: null,
            isRenewProcess: false,
            jwtKeys: null,
            validationResult: null,
            existingIdToken: null,
        };
        return of(initialCallbackContext);
    }
    // STEP 2 Code Flow //  Code Flow Silent Renew starts here
    codeFlowCodeRequest(callbackContext) {
        const authStateControl = this.flowsDataService.getAuthStateControl();
        const isStateCorrect = this.tokenValidationService.validateStateFromHashCallback(callbackContext.state, authStateControl);
        if (!isStateCorrect) {
            this.loggerService.logWarning('codeFlowCodeRequest incorrect state');
            return throwError('codeFlowCodeRequest incorrect state');
        }
        const authWellKnown = this.storagePersistenceService.read('authWellKnownEndPoints');
        const tokenEndpoint = authWellKnown === null || authWellKnown === void 0 ? void 0 : authWellKnown.tokenEndpoint;
        if (!tokenEndpoint) {
            return throwError('Token Endpoint not defined');
        }
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        const config = this.configurationProvider.getOpenIDConfiguration();
        const bodyForCodeFlow = this.urlService.createBodyForCodeFlowCodeRequest(callbackContext.code, config === null || config === void 0 ? void 0 : config.customTokenParams);
        return this.dataService.post(tokenEndpoint, bodyForCodeFlow, headers).pipe(switchMap((response) => {
            let authResult = new Object();
            authResult = response;
            authResult.state = callbackContext.state;
            authResult.session_state = callbackContext.sessionState;
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
CodeFlowCallbackHandlerService.ɵfac = function CodeFlowCallbackHandlerService_Factory(t) { return new (t || CodeFlowCallbackHandlerService)(i0.ɵɵinject(i1.UrlService), i0.ɵɵinject(i2.LoggerService), i0.ɵɵinject(i3.TokenValidationService), i0.ɵɵinject(i4.FlowsDataService), i0.ɵɵinject(i5.ConfigurationProvider), i0.ɵɵinject(i6.StoragePersistenceService), i0.ɵɵinject(i7.DataService)); };
CodeFlowCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: CodeFlowCallbackHandlerService, factory: CodeFlowCallbackHandlerService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CodeFlowCallbackHandlerService, [{
        type: Injectable
    }], function () { return [{ type: i1.UrlService }, { type: i2.LoggerService }, { type: i3.TokenValidationService }, { type: i4.FlowsDataService }, { type: i5.ConfigurationProvider }, { type: i6.StoragePersistenceService }, { type: i7.DataService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1mbG93LWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL2NvZGUtZmxvdy1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7O0FBVzVFLE1BQU0sT0FBTyw4QkFBOEI7SUFDekMsWUFDbUIsVUFBc0IsRUFDdEIsYUFBNEIsRUFDNUIsc0JBQThDLEVBQzlDLGdCQUFrQyxFQUNsQyxxQkFBNEMsRUFDNUMseUJBQW9ELEVBQ3BELFdBQXdCO1FBTnhCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUM5QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUNwRCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUN4QyxDQUFDO0lBRUosbUJBQW1CO0lBQ25CLGdCQUFnQixDQUFDLFVBQWtCO1FBQ2pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxNQUFN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LE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDOzs0R0FyR1UsOEJBQThCO3NFQUE5Qiw4QkFBOEIsV0FBOUIsOEJBQThCO2tEQUE5Qiw4QkFBOEI7Y0FEMUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBFcnJvclJlc3BvbnNlLCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yLCB0aW1lciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWVyZ2VNYXAsIHJldHJ5V2hlbiwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hcGkvZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uLy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4uLy4uL3N0b3JhZ2Uvc3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcbmltcG9ydCB7IFVybFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy91cmwvdXJsLnNlcnZpY2UnO1xuaW1wb3J0IHsgVG9rZW5WYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24vdG9rZW4tdmFsaWRhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IENhbGxiYWNrQ29udGV4dCB9IGZyb20gJy4uL2NhbGxiYWNrLWNvbnRleHQnO1xuaW1wb3J0IHsgRmxvd3NEYXRhU2VydmljZSB9IGZyb20gJy4uL2Zsb3dzLWRhdGEuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb2RlRmxvd0NhbGxiYWNrSGFuZGxlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHVybFNlcnZpY2U6IFVybFNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdG9rZW5WYWxpZGF0aW9uU2VydmljZTogVG9rZW5WYWxpZGF0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2U6IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBkYXRhU2VydmljZTogRGF0YVNlcnZpY2VcbiAgKSB7fVxuXG4gIC8vIFNURVAgMSBDb2RlIEZsb3dcbiAgY29kZUZsb3dDYWxsYmFjayh1cmxUb0NoZWNrOiBzdHJpbmcpOiBPYnNlcnZhYmxlPENhbGxiYWNrQ29udGV4dD4ge1xuICAgIGNvbnN0IGNvZGUgPSB0aGlzLnVybFNlcnZpY2UuZ2V0VXJsUGFyYW1ldGVyKHVybFRvQ2hlY2ssICdjb2RlJyk7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnVybFNlcnZpY2UuZ2V0VXJsUGFyYW1ldGVyKHVybFRvQ2hlY2ssICdzdGF0ZScpO1xuICAgIGNvbnN0IHNlc3Npb25TdGF0ZSA9IHRoaXMudXJsU2VydmljZS5nZXRVcmxQYXJhbWV0ZXIodXJsVG9DaGVjaywgJ3Nlc3Npb25fc3RhdGUnKSB8fCBudWxsO1xuXG4gICAgaWYgKCFzdGF0ZSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdubyBzdGF0ZSBpbiB1cmwnKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdubyBzdGF0ZSBpbiB1cmwnKTtcbiAgICB9XG5cbiAgICBpZiAoIWNvZGUpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnbm8gY29kZSBpbiB1cmwnKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdubyBjb2RlIGluIHVybCcpO1xuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygncnVubmluZyB2YWxpZGF0aW9uIGZvciBjYWxsYmFjaycsIHVybFRvQ2hlY2spO1xuXG4gICAgY29uc3QgaW5pdGlhbENhbGxiYWNrQ29udGV4dCA9IHtcbiAgICAgIGNvZGUsXG4gICAgICByZWZyZXNoVG9rZW46IG51bGwsXG4gICAgICBzdGF0ZSxcbiAgICAgIHNlc3Npb25TdGF0ZSxcbiAgICAgIGF1dGhSZXN1bHQ6IG51bGwsXG4gICAgICBpc1JlbmV3UHJvY2VzczogZmFsc2UsXG4gICAgICBqd3RLZXlzOiBudWxsLFxuICAgICAgdmFsaWRhdGlvblJlc3VsdDogbnVsbCxcbiAgICAgIGV4aXN0aW5nSWRUb2tlbjogbnVsbCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG9mKGluaXRpYWxDYWxsYmFja0NvbnRleHQpO1xuICB9XG5cbiAgLy8gU1RFUCAyIENvZGUgRmxvdyAvLyAgQ29kZSBGbG93IFNpbGVudCBSZW5ldyBzdGFydHMgaGVyZVxuICBjb2RlRmxvd0NvZGVSZXF1ZXN0KGNhbGxiYWNrQ29udGV4dDogQ2FsbGJhY2tDb250ZXh0KTogT2JzZXJ2YWJsZTxDYWxsYmFja0NvbnRleHQ+IHtcbiAgICBjb25zdCBhdXRoU3RhdGVDb250cm9sID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmdldEF1dGhTdGF0ZUNvbnRyb2woKTtcblxuICAgIGNvbnN0IGlzU3RhdGVDb3JyZWN0ID0gdGhpcy50b2tlblZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlU3RhdGVGcm9tSGFzaENhbGxiYWNrKGNhbGxiYWNrQ29udGV4dC5zdGF0ZSwgYXV0aFN0YXRlQ29udHJvbCk7XG5cbiAgICBpZiAoIWlzU3RhdGVDb3JyZWN0KSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnY29kZUZsb3dDb2RlUmVxdWVzdCBpbmNvcnJlY3Qgc3RhdGUnKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdjb2RlRmxvd0NvZGVSZXF1ZXN0IGluY29ycmVjdCBzdGF0ZScpO1xuICAgIH1cblxuICAgIGNvbnN0IGF1dGhXZWxsS25vd24gPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycpO1xuICAgIGNvbnN0IHRva2VuRW5kcG9pbnQgPSBhdXRoV2VsbEtub3duPy50b2tlbkVuZHBvaW50O1xuICAgIGlmICghdG9rZW5FbmRwb2ludCkge1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoJ1Rva2VuIEVuZHBvaW50IG5vdCBkZWZpbmVkJyk7XG4gICAgfVxuXG4gICAgbGV0IGhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XG4gICAgaGVhZGVycyA9IGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG5cbiAgICBjb25zdCBjb25maWcgPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICBjb25zdCBib2R5Rm9yQ29kZUZsb3cgPSB0aGlzLnVybFNlcnZpY2UuY3JlYXRlQm9keUZvckNvZGVGbG93Q29kZVJlcXVlc3QoY2FsbGJhY2tDb250ZXh0LmNvZGUsIGNvbmZpZz8uY3VzdG9tVG9rZW5QYXJhbXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcnZpY2UucG9zdCh0b2tlbkVuZHBvaW50LCBib2R5Rm9yQ29kZUZsb3csIGhlYWRlcnMpLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGxldCBhdXRoUmVzdWx0OiBhbnkgPSBuZXcgT2JqZWN0KCk7XG4gICAgICAgIGF1dGhSZXN1bHQgPSByZXNwb25zZTtcbiAgICAgICAgYXV0aFJlc3VsdC5zdGF0ZSA9IGNhbGxiYWNrQ29udGV4dC5zdGF0ZTtcbiAgICAgICAgYXV0aFJlc3VsdC5zZXNzaW9uX3N0YXRlID0gY2FsbGJhY2tDb250ZXh0LnNlc3Npb25TdGF0ZTtcblxuICAgICAgICBjYWxsYmFja0NvbnRleHQuYXV0aFJlc3VsdCA9IGF1dGhSZXN1bHQ7XG4gICAgICAgIHJldHVybiBvZihjYWxsYmFja0NvbnRleHQpO1xuICAgICAgfSksXG4gICAgICByZXRyeVdoZW4oKGVycm9yKSA9PiB0aGlzLmhhbmRsZVJlZnJlc2hSZXRyeShlcnJvcikpLFxuICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc3QgeyBzdHNTZXJ2ZXIgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYE9pZGNTZXJ2aWNlIGNvZGUgcmVxdWVzdCAke3N0c1NlcnZlcn1gO1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyb3JNZXNzYWdlLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZVJlZnJlc2hSZXRyeShlcnJvcnM6IE9ic2VydmFibGU8YW55Pik6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIGVycm9ycy5waXBlKFxuICAgICAgbWVyZ2VNYXAoKGVycm9yKSA9PiB7XG4gICAgICAgIC8vIHJldHJ5IHRva2VuIHJlZnJlc2ggaWYgdGhlcmUgaXMgbm8gaW50ZXJuZXQgY29ubmVjdGlvblxuICAgICAgICBpZiAoZXJyb3IgJiYgZXJyb3IgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZSAmJiBlcnJvci5lcnJvciBpbnN0YW5jZW9mIFByb2dyZXNzRXZlbnQgJiYgZXJyb3IuZXJyb3IudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGNvbnN0IHsgc3RzU2VydmVyLCByZWZyZXNoVG9rZW5SZXRyeUluU2Vjb25kcyB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBPaWRjU2VydmljZSBjb2RlIHJlcXVlc3QgJHtzdHNTZXJ2ZXJ9IC0gbm8gaW50ZXJuZXQgY29ubmVjdGlvbmA7XG4gICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoZXJyb3JNZXNzYWdlLCBlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIHRpbWVyKHJlZnJlc2hUb2tlblJldHJ5SW5TZWNvbmRzICogMTAwMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG59XG4iXX0=