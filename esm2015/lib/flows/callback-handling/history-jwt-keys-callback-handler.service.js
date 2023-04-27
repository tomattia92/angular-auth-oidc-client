import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthorizedState } from '../../authState/authorized-state';
import { ValidationResult } from '../../validation/validation-result';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../config/config.provider";
import * as i3 from "../../authState/auth-state.service";
import * as i4 from "../flows-data.service";
import * as i5 from "../signin-key-data.service";
import * as i6 from "../../storage/storage-persistence.service";
import * as i7 from "../reset-auth-data.service";
const JWT_KEYS = 'jwtKeys';
export class HistoryJwtKeysCallbackHandlerService {
    constructor(loggerService, configurationProvider, authStateService, flowsDataService, signInKeyDataService, storagePersistenceService, resetAuthDataService) {
        this.loggerService = loggerService;
        this.configurationProvider = configurationProvider;
        this.authStateService = authStateService;
        this.flowsDataService = flowsDataService;
        this.signInKeyDataService = signInKeyDataService;
        this.storagePersistenceService = storagePersistenceService;
        this.resetAuthDataService = resetAuthDataService;
    }
    // STEP 3 Code Flow, STEP 2 Implicit Flow, STEP 3 Refresh Token
    callbackHistoryAndResetJwtKeys(callbackContext) {
        this.storagePersistenceService.write('authnResult', callbackContext.authResult);
        if (this.historyCleanUpTurnedOn() && !callbackContext.isRenewProcess) {
            this.resetBrowserHistory();
        }
        else {
            this.loggerService.logDebug('history clean up inactive');
        }
        if (callbackContext.authResult.error) {
            const errorMessage = `authorizedCallbackProcedure came with error: ${callbackContext.authResult.error}`;
            this.loggerService.logDebug(errorMessage);
            this.resetAuthDataService.resetAuthorizationData();
            this.flowsDataService.setNonce('');
            this.handleResultErrorFromCallback(callbackContext.authResult, callbackContext.isRenewProcess);
            return throwError(errorMessage);
        }
        this.loggerService.logDebug(callbackContext.authResult);
        this.loggerService.logDebug('authorizedCallback created, begin token validation');
        return this.signInKeyDataService.getSigningKeys().pipe(tap((jwtKeys) => this.storeSigningKeys(jwtKeys)), catchError((err) => {
            // fallback: try to load jwtKeys from storage
            const storedJwtKeys = this.readSigningKeys();
            if (!!storedJwtKeys) {
                this.loggerService.logWarning(`Failed to retrieve signing keys, fallback to stored keys`);
                return of(storedJwtKeys);
            }
            return throwError(err);
        }), switchMap((jwtKeys) => {
            if (jwtKeys) {
                callbackContext.jwtKeys = jwtKeys;
                return of(callbackContext);
            }
            const errorMessage = `Failed to retrieve signing key`;
            this.loggerService.logWarning(errorMessage);
            return throwError(errorMessage);
        }), catchError((err) => {
            const errorMessage = `Failed to retrieve signing key with error: ${err}`;
            this.loggerService.logWarning(errorMessage);
            return throwError(errorMessage);
        }));
    }
    handleResultErrorFromCallback(result, isRenewProcess) {
        let validationResult = ValidationResult.SecureTokenServerError;
        if (result.error === 'login_required') {
            validationResult = ValidationResult.LoginRequired;
        }
        this.authStateService.updateAndPublishAuthState({
            authorizationState: AuthorizedState.Unauthorized,
            validationResult,
            isRenewProcess,
        });
    }
    historyCleanUpTurnedOn() {
        const { historyCleanupOff } = this.configurationProvider.getOpenIDConfiguration();
        return !historyCleanupOff;
    }
    resetBrowserHistory() {
        window.history.replaceState({}, window.document.title, window.location.origin + window.location.pathname);
    }
    storeSigningKeys(jwtKeys) {
        this.storagePersistenceService.write(JWT_KEYS, jwtKeys);
    }
    readSigningKeys() {
        return this.storagePersistenceService.read(JWT_KEYS);
    }
}
HistoryJwtKeysCallbackHandlerService.ɵfac = function HistoryJwtKeysCallbackHandlerService_Factory(t) { return new (t || HistoryJwtKeysCallbackHandlerService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.ConfigurationProvider), i0.ɵɵinject(i3.AuthStateService), i0.ɵɵinject(i4.FlowsDataService), i0.ɵɵinject(i5.SigninKeyDataService), i0.ɵɵinject(i6.StoragePersistenceService), i0.ɵɵinject(i7.ResetAuthDataService)); };
HistoryJwtKeysCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: HistoryJwtKeysCallbackHandlerService, factory: HistoryJwtKeysCallbackHandlerService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(HistoryJwtKeysCallbackHandlerService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }, { type: i2.ConfigurationProvider }, { type: i3.AuthStateService }, { type: i4.FlowsDataService }, { type: i5.SigninKeyDataService }, { type: i6.StoragePersistenceService }, { type: i7.ResetAuthDataService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9yeS1qd3Qta2V5cy1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9oaXN0b3J5LWp3dC1rZXlzLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTVELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUtuRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQzs7Ozs7Ozs7O0FBTXRFLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUczQixNQUFNLE9BQU8sb0NBQW9DO0lBQy9DLFlBQ21CLGFBQTRCLEVBQzVCLHFCQUE0QyxFQUM1QyxnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLG9CQUEwQyxFQUMxQyx5QkFBb0QsRUFDcEQsb0JBQTBDO1FBTjFDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUNwRCx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO0lBQzFELENBQUM7SUFFSiwrREFBK0Q7SUFDL0QsOEJBQThCLENBQUMs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QUF5QixDQUFDO1lBQzlDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxZQUFZO1lBQ2hELGdCQUFnQjtZQUNoQixjQUFjO1NBQ2YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLHNCQUFzQjtRQUM1QixNQUFNLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUNsRixPQUFPLENBQUMsaUJBQWlCLENBQUM7SUFDNUIsQ0FBQztJQUVPLG1CQUFtQjtRQUN6QixNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1RyxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsT0FBZ0I7UUFDdkMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVPLGVBQWU7UUFDckIsT0FBTyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7O3dIQTdGVSxvQ0FBb0M7NEVBQXBDLG9DQUFvQyxXQUFwQyxvQ0FBb0M7a0RBQXBDLG9DQUFvQztjQURoRCxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHN3aXRjaE1hcCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4uLy4uL2F1dGhTdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXV0aG9yaXplZFN0YXRlIH0gZnJvbSAnLi4vLi4vYXV0aFN0YXRlL2F1dGhvcml6ZWQtc3RhdGUnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgSnd0S2V5cyB9IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24vand0a2V5cyc7XG5pbXBvcnQgeyBWYWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnLi4vLi4vdmFsaWRhdGlvbi92YWxpZGF0aW9uLXJlc3VsdCc7XG5pbXBvcnQgeyBDYWxsYmFja0NvbnRleHQgfSBmcm9tICcuLi9jYWxsYmFjay1jb250ZXh0JztcbmltcG9ydCB7IEZsb3dzRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzZXRBdXRoRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9yZXNldC1hdXRoLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBTaWduaW5LZXlEYXRhU2VydmljZSB9IGZyb20gJy4uL3NpZ25pbi1rZXktZGF0YS5zZXJ2aWNlJztcblxuY29uc3QgSldUX0tFWVMgPSAnand0S2V5cyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBIaXN0b3J5Snd0S2V5c0NhbGxiYWNrSGFuZGxlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbG93c0RhdGFTZXJ2aWNlOiBGbG93c0RhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2lnbkluS2V5RGF0YVNlcnZpY2U6IFNpZ25pbktleURhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlc2V0QXV0aERhdGFTZXJ2aWNlOiBSZXNldEF1dGhEYXRhU2VydmljZVxuICApIHt9XG5cbiAgLy8gU1RFUCAzIENvZGUgRmxvdywgU1RFUCAyIEltcGxpY2l0IEZsb3csIFNURVAgMyBSZWZyZXNoIFRva2VuXG4gIGNhbGxiYWNrSGlzdG9yeUFuZFJlc2V0Snd0S2V5cyhjYWxsYmFja0NvbnRleHQ6IENhbGxiYWNrQ29udGV4dCk6IE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PiB7XG4gICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLndyaXRlKCdhdXRoblJlc3VsdCcsIGNhbGxiYWNrQ29udGV4dC5hdXRoUmVzdWx0KTtcblxuICAgIGlmICh0aGlzLmhpc3RvcnlDbGVhblVwVHVybmVkT24oKSAmJiAhY2FsbGJhY2tDb250ZXh0LmlzUmVuZXdQcm9jZXNzKSB7XG4gICAgICB0aGlzLnJlc2V0QnJvd3Nlckhpc3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdoaXN0b3J5IGNsZWFuIHVwIGluYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrQ29udGV4dC5hdXRoUmVzdWx0LmVycm9yKSB7XG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgYXV0aG9yaXplZENhbGxiYWNrUHJvY2VkdXJlIGNhbWUgd2l0aCBlcnJvcjogJHtjYWxsYmFja0NvbnRleHQuYXV0aFJlc3VsdC5lcnJvcn1gO1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGVycm9yTWVzc2FnZSk7XG4gICAgICB0aGlzLnJlc2V0QXV0aERhdGFTZXJ2aWNlLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoKTtcbiAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5zZXROb25jZSgnJyk7XG4gICAgICB0aGlzLmhhbmRsZVJlc3VsdEVycm9yRnJvbUNhbGxiYWNrKGNhbGxiYWNrQ29udGV4dC5hdXRoUmVzdWx0LCBjYWxsYmFja0NvbnRleHQuaXNSZW5ld1Byb2Nlc3MpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY2FsbGJhY2tDb250ZXh0LmF1dGhSZXN1bHQpO1xuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnYXV0aG9yaXplZENhbGxiYWNrIGNyZWF0ZWQsIGJlZ2luIHRva2VuIHZhbGlkYXRpb24nKTtcblxuICAgIHJldHVybiB0aGlzLnNpZ25JbktleURhdGFTZXJ2aWNlLmdldFNpZ25pbmdLZXlzKCkucGlwZShcbiAgICAgIHRhcCgoand0S2V5czogSnd0S2V5cykgPT4gdGhpcy5zdG9yZVNpZ25pbmdLZXlzKGp3dEtleXMpKSxcbiAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4ge1xuICAgICAgICAvLyBmYWxsYmFjazogdHJ5IHRvIGxvYWQgand0S2V5cyBmcm9tIHN0b3JhZ2VcbiAgICAgICAgY29uc3Qgc3RvcmVkSnd0S2V5cyA9IHRoaXMucmVhZFNpZ25pbmdLZXlzKCk7XG4gICAgICAgIGlmICghIXN0b3JlZEp3dEtleXMpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhgRmFpbGVkIHRvIHJldHJpZXZlIHNpZ25pbmcga2V5cywgZmFsbGJhY2sgdG8gc3RvcmVkIGtleXNgKTtcbiAgICAgICAgICByZXR1cm4gb2Yoc3RvcmVkSnd0S2V5cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgfSksXG4gICAgICBzd2l0Y2hNYXAoKGp3dEtleXMpID0+IHtcbiAgICAgICAgaWYgKGp3dEtleXMpIHtcbiAgICAgICAgICBjYWxsYmFja0NvbnRleHQuand0S2V5cyA9IGp3dEtleXM7XG5cbiAgICAgICAgICByZXR1cm4gb2YoY2FsbGJhY2tDb250ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBGYWlsZWQgdG8gcmV0cmlldmUgc2lnbmluZyBrZXlgO1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhlcnJvck1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgfSksXG4gICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYEZhaWxlZCB0byByZXRyaWV2ZSBzaWduaW5nIGtleSB3aXRoIGVycm9yOiAke2Vycn1gO1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhlcnJvck1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVSZXN1bHRFcnJvckZyb21DYWxsYmFjayhyZXN1bHQ6IGFueSwgaXNSZW5ld1Byb2Nlc3M6IGJvb2xlYW4pIHtcbiAgICBsZXQgdmFsaWRhdGlvblJlc3VsdCA9IFZhbGlkYXRpb25SZXN1bHQuU2VjdXJlVG9rZW5TZXJ2ZXJFcnJvcjtcblxuICAgIGlmICgocmVzdWx0LmVycm9yIGFzIHN0cmluZykgPT09ICdsb2dpbl9yZXF1aXJlZCcpIHtcbiAgICAgIHZhbGlkYXRpb25SZXN1bHQgPSBWYWxpZGF0aW9uUmVzdWx0LkxvZ2luUmVxdWlyZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLnVwZGF0ZUFuZFB1Ymxpc2hBdXRoU3RhdGUoe1xuICAgICAgYXV0aG9yaXphdGlvblN0YXRlOiBBdXRob3JpemVkU3RhdGUuVW5hdXRob3JpemVkLFxuICAgICAgdmFsaWRhdGlvblJlc3VsdCxcbiAgICAgIGlzUmVuZXdQcm9jZXNzLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBoaXN0b3J5Q2xlYW5VcFR1cm5lZE9uKCkge1xuICAgIGNvbnN0IHsgaGlzdG9yeUNsZWFudXBPZmYgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcbiAgICByZXR1cm4gIWhpc3RvcnlDbGVhbnVwT2ZmO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNldEJyb3dzZXJIaXN0b3J5KCkge1xuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgd2luZG93LmRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RvcmVTaWduaW5nS2V5cyhqd3RLZXlzOiBKd3RLZXlzKSB7XG4gICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLndyaXRlKEpXVF9LRVlTLCBqd3RLZXlzKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZFNpZ25pbmdLZXlzKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZChKV1RfS0VZUyk7XG4gIH1cbn1cbiJdfQ==