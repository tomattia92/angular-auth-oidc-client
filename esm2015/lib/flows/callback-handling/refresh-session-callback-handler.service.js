import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TokenValidationService } from '../../validation/token-validation.service';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../authState/auth-state.service";
import * as i3 from "../flows-data.service";
export class RefreshSessionCallbackHandlerService {
    constructor(loggerService, authStateService, flowsDataService) {
        this.loggerService = loggerService;
        this.authStateService = authStateService;
        this.flowsDataService = flowsDataService;
    }
    // STEP 1 Refresh session
    refreshSessionWithRefreshTokens() {
        const stateData = this.flowsDataService.getExistingOrCreateAuthStateControl();
        this.loggerService.logDebug('RefreshSession created. adding myautostate: ' + stateData);
        const refreshToken = this.authStateService.getRefreshToken();
        const idToken = this.authStateService.getIdToken();
        if (refreshToken) {
            const callbackContext = {
                code: null,
                refreshToken,
                state: stateData,
                sessionState: null,
                authResult: null,
                isRenewProcess: true,
                jwtKeys: null,
                validationResult: null,
                existingIdToken: idToken,
            };
            this.loggerService.logDebug('found refresh code, obtaining new credentials with refresh code');
            // Nonce is not used with refresh tokens; but Keycloak may send it anyway
            this.flowsDataService.setNonce(TokenValidationService.refreshTokenNoncePlaceholder);
            return of(callbackContext);
        }
        else {
            const errorMessage = 'no refresh token found, please login';
            this.loggerService.logError(errorMessage);
            return throwError(errorMessage);
        }
    }
}
RefreshSessionCallbackHandlerService.ɵfac = function RefreshSessionCallbackHandlerService_Factory(t) { return new (t || RefreshSessionCallbackHandlerService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.AuthStateService), i0.ɵɵinject(i3.FlowsDataService)); };
RefreshSessionCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: RefreshSessionCallbackHandlerService, factory: RefreshSessionCallbackHandlerService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RefreshSessionCallbackHandlerService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }, { type: i2.AuthStateService }, { type: i3.FlowsDataService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC1zZXNzaW9uLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL3JlZnJlc2gtc2Vzc2lvbi1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUdsRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQzs7Ozs7QUFLbkYsTUFBTSxPQUFPLG9DQUFvQztJQUMvQyxZQUNtQixhQUE0QixFQUM1QixnQkFBa0MsRUFDbEMsZ0JBQWtDO1FBRmxDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtJQUNsRCxDQUFDO0lBRUoseUJBQXlCO0lBQ3pCLCtCQUErQjtRQUM3QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUNBQW1DLEVBQUUsQ0FBQztRQUM5RSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyw4Q0FBOEMsR0FBRyxTQUFTLENBQUMsQ0FBQztRQUN4RixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDN0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRW5ELElBQUksWUFBWSxFQUFFO1lBQ2hCLE1BQU0sZUFBZSxHQUFHO2dCQUN0QixJQUFJLEVBQUUsSUFBSTtnQkFDVixZQUFZO2dCQUNaLEtBQUssRUFBRSxTQUFTO2dCQUNoQixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixPQUFPLEVBQUUsSUFBSTtnQkFDYixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixlQUFlLEVBQUUsT0FBTzthQUN6QixDQUFDO1lBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsaUVBQWlFLENBQUMsQ0FBQztZQUMvRix5RUFBeUU7WUFDekUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBRXBGLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQzVCO2FBQU07WUFDTCxNQUFNLFlBQVksR0FBRyxzQ0FBc0MsQ0FBQztZQUM1RCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMxQyxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNqQztJQUNILENBQUM7O3dIQXJDVSxvQ0FBb0M7NEVBQXBDLG9DQUFvQyxXQUFwQyxvQ0FBb0M7a0RBQXBDLG9DQUFvQztjQURoRCxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hdXRoU3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFRva2VuVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi92YWxpZGF0aW9uL3Rva2VuLXZhbGlkYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBDYWxsYmFja0NvbnRleHQgfSBmcm9tICcuLi9jYWxsYmFjay1jb250ZXh0JztcbmltcG9ydCB7IEZsb3dzRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy1kYXRhLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVmcmVzaFNlc3Npb25DYWxsYmFja0hhbmRsZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXV0aFN0YXRlU2VydmljZTogQXV0aFN0YXRlU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2VcbiAgKSB7fVxuXG4gIC8vIFNURVAgMSBSZWZyZXNoIHNlc3Npb25cbiAgcmVmcmVzaFNlc3Npb25XaXRoUmVmcmVzaFRva2VucygpOiBPYnNlcnZhYmxlPENhbGxiYWNrQ29udGV4dD4ge1xuICAgIGNvbnN0IHN0YXRlRGF0YSA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5nZXRFeGlzdGluZ09yQ3JlYXRlQXV0aFN0YXRlQ29udHJvbCgpO1xuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnUmVmcmVzaFNlc3Npb24gY3JlYXRlZC4gYWRkaW5nIG15YXV0b3N0YXRlOiAnICsgc3RhdGVEYXRhKTtcbiAgICBjb25zdCByZWZyZXNoVG9rZW4gPSB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuZ2V0UmVmcmVzaFRva2VuKCk7XG4gICAgY29uc3QgaWRUb2tlbiA9IHRoaXMuYXV0aFN0YXRlU2VydmljZS5nZXRJZFRva2VuKCk7XG5cbiAgICBpZiAocmVmcmVzaFRva2VuKSB7XG4gICAgICBjb25zdCBjYWxsYmFja0NvbnRleHQgPSB7XG4gICAgICAgIGNvZGU6IG51bGwsXG4gICAgICAgIHJlZnJlc2hUb2tlbixcbiAgICAgICAgc3RhdGU6IHN0YXRlRGF0YSxcbiAgICAgICAgc2Vzc2lvblN0YXRlOiBudWxsLFxuICAgICAgICBhdXRoUmVzdWx0OiBudWxsLFxuICAgICAgICBpc1JlbmV3UHJvY2VzczogdHJ1ZSxcbiAgICAgICAgand0S2V5czogbnVsbCxcbiAgICAgICAgdmFsaWRhdGlvblJlc3VsdDogbnVsbCxcbiAgICAgICAgZXhpc3RpbmdJZFRva2VuOiBpZFRva2VuLFxuICAgICAgfTtcblxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdmb3VuZCByZWZyZXNoIGNvZGUsIG9idGFpbmluZyBuZXcgY3JlZGVudGlhbHMgd2l0aCByZWZyZXNoIGNvZGUnKTtcbiAgICAgIC8vIE5vbmNlIGlzIG5vdCB1c2VkIHdpdGggcmVmcmVzaCB0b2tlbnM7IGJ1dCBLZXljbG9hayBtYXkgc2VuZCBpdCBhbnl3YXlcbiAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5zZXROb25jZShUb2tlblZhbGlkYXRpb25TZXJ2aWNlLnJlZnJlc2hUb2tlbk5vbmNlUGxhY2Vob2xkZXIpO1xuXG4gICAgICByZXR1cm4gb2YoY2FsbGJhY2tDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJ25vIHJlZnJlc2ggdG9rZW4gZm91bmQsIHBsZWFzZSBsb2dpbic7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgfVxuICB9XG59XG4iXX0=