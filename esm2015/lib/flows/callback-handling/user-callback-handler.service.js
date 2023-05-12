import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthorizedState } from '../../authState/authorized-state';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../config/config.provider";
import * as i3 from "../../authState/auth-state.service";
import * as i4 from "../flows-data.service";
import * as i5 from "../../userData/user-service";
import * as i6 from "../reset-auth-data.service";
export class UserCallbackHandlerService {
    constructor(loggerService, configurationProvider, authStateService, flowsDataService, userService, resetAuthDataService) {
        this.loggerService = loggerService;
        this.configurationProvider = configurationProvider;
        this.authStateService = authStateService;
        this.flowsDataService = flowsDataService;
        this.userService = userService;
        this.resetAuthDataService = resetAuthDataService;
    }
    // STEP 5 userData
    callbackUser(callbackContext) {
        const { isRenewProcess, validationResult, authResult, refreshToken } = callbackContext;
        const { autoUserinfo, renewUserInfoAfterTokenRenew } = this.configurationProvider.getOpenIDConfiguration();
        if (!autoUserinfo) {
            if (!isRenewProcess || renewUserInfoAfterTokenRenew) {
                // userData is set to the id_token decoded, auto get user data set to false
                if (validationResult.decodedIdToken) {
                    this.userService.setUserDataToStore(validationResult.decodedIdToken);
                }
            }
            if (!isRenewProcess && !refreshToken) {
                this.flowsDataService.setSessionState(authResult.session_state);
            }
            this.publishAuthorizedState(validationResult, isRenewProcess);
            return of(callbackContext);
        }
        return this.userService.getAndPersistUserDataInStore(isRenewProcess, validationResult.idToken, validationResult.decodedIdToken).pipe(switchMap((userData) => {
            if (!!userData) {
                if (!refreshToken) {
                    this.flowsDataService.setSessionState(authResult.session_state);
                }
                this.publishAuthorizedState(validationResult, isRenewProcess);
                return of(callbackContext);
            }
            else {
                this.resetAuthDataService.resetAuthorizationData();
                this.publishUnauthorizedState(validationResult, isRenewProcess);
                const errorMessage = `Called for userData but they were ${userData}`;
                this.loggerService.logWarning(errorMessage);
                return throwError(errorMessage);
            }
        }), catchError((err) => {
            const errorMessage = `Failed to retrieve user info with error:  ${err}`;
            this.loggerService.logWarning(errorMessage);
            return throwError(errorMessage);
        }));
    }
    publishAuthorizedState(stateValidationResult, isRenewProcess) {
        this.authStateService.updateAndPublishAuthState({
            authorizationState: AuthorizedState.Authorized,
            validationResult: stateValidationResult.state,
            isRenewProcess,
        });
    }
    publishUnauthorizedState(stateValidationResult, isRenewProcess) {
        this.authStateService.updateAndPublishAuthState({
            authorizationState: AuthorizedState.Unauthorized,
            validationResult: stateValidationResult.state,
            isRenewProcess,
        });
    }
}
UserCallbackHandlerService.ɵfac = function UserCallbackHandlerService_Factory(t) { return new (t || UserCallbackHandlerService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.ConfigurationProvider), i0.ɵɵinject(i3.AuthStateService), i0.ɵɵinject(i4.FlowsDataService), i0.ɵɵinject(i5.UserService), i0.ɵɵinject(i6.ResetAuthDataService)); };
UserCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: UserCallbackHandlerService, factory: UserCallbackHandlerService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(UserCallbackHandlerService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }, { type: i2.ConfigurationProvider }, { type: i3.AuthStateService }, { type: i4.FlowsDataService }, { type: i5.UserService }, { type: i6.ResetAuthDataService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy91c2VyLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7Ozs7OztBQVVuRSxNQUFNLE9BQU8sMEJBQTBCO0lBQ3JDLFlBQ21CLGFBQTRCLEVBQzVCLHFCQUE0QyxFQUM1QyxnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLFdBQXdCLEVBQ3hCLG9CQUEwQztRQUwxQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO0lBQzFELENBQUM7SUFFSixrQkFBa0I7SUFDbEIsWUFBWSxDQUFDLGVBQWdDO1FBQzNDLE1BQU0sRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLGVBQWUsQ0FBQztRQUN2RixNQUFNLEVBQUUsWUFBWSxFQUFFLDRCQUE0QixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFM0csSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixJQUFJLENBQUMsY0FBYyxJQUFJLDRCQUE0QixFQUFFO2dCQUNuRCwyRUFBMkU7Z0JBQzNFLElBQUksZ0JBQWdCLENBQUMsY0FBYyxFQUFFO29CQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUN0RTthQUNGO1lBRUQsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDcEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDakU7WUFFRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDOUQsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDNUI7UUFFRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsNEJBQTRCLENBQUMsY0FBYyxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQ2xJLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDZCxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUNqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDakU7Z0JBRUQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUU5RCxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUM1QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUNoRSxNQUFNLFlBQVksR0FBRyxxQ0FBcUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3JFLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM1QyxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNqQztRQUNILENBQUMsQ0FBQyxFQUNGLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sWUFBWSxHQUFHLDZDQUE2QyxHQUFHLEVBQUUsQ0FBQztZQUN4RSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1QyxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVPLHNCQUFzQixDQUFDLHFCQUE0QyxFQUFFLGNBQXVCO1FBQ2xHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQztZQUM5QyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsVUFBVTtZQUM5QyxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQyxLQUFLO1lBQzdDLGNBQWM7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sd0JBQXdCLENBQUMscUJBQTRDLEVBQUUsY0FBdUI7UUFDcEcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDO1lBQzlDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxZQUFZO1lBQ2hELGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLEtBQUs7WUFDN0MsY0FBYztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7O29HQXZFVSwwQkFBMEI7a0VBQTFCLDBCQUEwQixXQUExQiwwQkFBMEI7a0RBQTFCLDBCQUEwQjtjQUR0QyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBjYXRjaEVycm9yLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hdXRoU3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aG9yaXplZFN0YXRlIH0gZnJvbSAnLi4vLi4vYXV0aFN0YXRlL2F1dGhvcml6ZWQtc3RhdGUnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi8uLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3VzZXJEYXRhL3VzZXItc2VydmljZSc7XHJcbmltcG9ydCB7IFN0YXRlVmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24vc3RhdGUtdmFsaWRhdGlvbi1yZXN1bHQnO1xyXG5pbXBvcnQgeyBDYWxsYmFja0NvbnRleHQgfSBmcm9tICcuLi9jYWxsYmFjay1jb250ZXh0JztcclxuaW1wb3J0IHsgRmxvd3NEYXRhU2VydmljZSB9IGZyb20gJy4uL2Zsb3dzLWRhdGEuc2VydmljZSc7XHJcbmltcG9ydCB7IFJlc2V0QXV0aERhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vcmVzZXQtYXV0aC1kYXRhLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXNlckNhbGxiYWNrSGFuZGxlclNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXV0aFN0YXRlU2VydmljZTogQXV0aFN0YXRlU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmxvd3NEYXRhU2VydmljZTogRmxvd3NEYXRhU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSByZXNldEF1dGhEYXRhU2VydmljZTogUmVzZXRBdXRoRGF0YVNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIC8vIFNURVAgNSB1c2VyRGF0YVxyXG4gIGNhbGxiYWNrVXNlcihjYWxsYmFja0NvbnRleHQ6IENhbGxiYWNrQ29udGV4dCk6IE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PiB7XHJcbiAgICBjb25zdCB7IGlzUmVuZXdQcm9jZXNzLCB2YWxpZGF0aW9uUmVzdWx0LCBhdXRoUmVzdWx0LCByZWZyZXNoVG9rZW4gfSA9IGNhbGxiYWNrQ29udGV4dDtcclxuICAgIGNvbnN0IHsgYXV0b1VzZXJpbmZvLCByZW5ld1VzZXJJbmZvQWZ0ZXJUb2tlblJlbmV3IH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XHJcblxyXG4gICAgaWYgKCFhdXRvVXNlcmluZm8pIHtcclxuICAgICAgaWYgKCFpc1JlbmV3UHJvY2VzcyB8fCByZW5ld1VzZXJJbmZvQWZ0ZXJUb2tlblJlbmV3KSB7XHJcbiAgICAgICAgLy8gdXNlckRhdGEgaXMgc2V0IHRvIHRoZSBpZF90b2tlbiBkZWNvZGVkLCBhdXRvIGdldCB1c2VyIGRhdGEgc2V0IHRvIGZhbHNlXHJcbiAgICAgICAgaWYgKHZhbGlkYXRpb25SZXN1bHQuZGVjb2RlZElkVG9rZW4pIHtcclxuICAgICAgICAgIHRoaXMudXNlclNlcnZpY2Uuc2V0VXNlckRhdGFUb1N0b3JlKHZhbGlkYXRpb25SZXN1bHQuZGVjb2RlZElkVG9rZW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFpc1JlbmV3UHJvY2VzcyAmJiAhcmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgdGhpcy5mbG93c0RhdGFTZXJ2aWNlLnNldFNlc3Npb25TdGF0ZShhdXRoUmVzdWx0LnNlc3Npb25fc3RhdGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnB1Ymxpc2hBdXRob3JpemVkU3RhdGUodmFsaWRhdGlvblJlc3VsdCwgaXNSZW5ld1Byb2Nlc3MpO1xyXG4gICAgICByZXR1cm4gb2YoY2FsbGJhY2tDb250ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy51c2VyU2VydmljZS5nZXRBbmRQZXJzaXN0VXNlckRhdGFJblN0b3JlKGlzUmVuZXdQcm9jZXNzLCB2YWxpZGF0aW9uUmVzdWx0LmlkVG9rZW4sIHZhbGlkYXRpb25SZXN1bHQuZGVjb2RlZElkVG9rZW4pLnBpcGUoXHJcbiAgICAgIHN3aXRjaE1hcCgodXNlckRhdGEpID0+IHtcclxuICAgICAgICBpZiAoISF1c2VyRGF0YSkge1xyXG4gICAgICAgICAgaWYgKCFyZWZyZXNoVG9rZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5mbG93c0RhdGFTZXJ2aWNlLnNldFNlc3Npb25TdGF0ZShhdXRoUmVzdWx0LnNlc3Npb25fc3RhdGUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMucHVibGlzaEF1dGhvcml6ZWRTdGF0ZSh2YWxpZGF0aW9uUmVzdWx0LCBpc1JlbmV3UHJvY2Vzcyk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIG9mKGNhbGxiYWNrQ29udGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVzZXRBdXRoRGF0YVNlcnZpY2UucmVzZXRBdXRob3JpemF0aW9uRGF0YSgpO1xyXG4gICAgICAgICAgdGhpcy5wdWJsaXNoVW5hdXRob3JpemVkU3RhdGUodmFsaWRhdGlvblJlc3VsdCwgaXNSZW5ld1Byb2Nlc3MpO1xyXG4gICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYENhbGxlZCBmb3IgdXNlckRhdGEgYnV0IHRoZXkgd2VyZSAke3VzZXJEYXRhfWA7XHJcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcclxuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgRmFpbGVkIHRvIHJldHJpZXZlIHVzZXIgaW5mbyB3aXRoIGVycm9yOiAgJHtlcnJ9YDtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yTWVzc2FnZSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwdWJsaXNoQXV0aG9yaXplZFN0YXRlKHN0YXRlVmFsaWRhdGlvblJlc3VsdDogU3RhdGVWYWxpZGF0aW9uUmVzdWx0LCBpc1JlbmV3UHJvY2VzczogYm9vbGVhbikge1xyXG4gICAgdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLnVwZGF0ZUFuZFB1Ymxpc2hBdXRoU3RhdGUoe1xyXG4gICAgICBhdXRob3JpemF0aW9uU3RhdGU6IEF1dGhvcml6ZWRTdGF0ZS5BdXRob3JpemVkLFxyXG4gICAgICB2YWxpZGF0aW9uUmVzdWx0OiBzdGF0ZVZhbGlkYXRpb25SZXN1bHQuc3RhdGUsXHJcbiAgICAgIGlzUmVuZXdQcm9jZXNzLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHB1Ymxpc2hVbmF1dGhvcml6ZWRTdGF0ZShzdGF0ZVZhbGlkYXRpb25SZXN1bHQ6IFN0YXRlVmFsaWRhdGlvblJlc3VsdCwgaXNSZW5ld1Byb2Nlc3M6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuYXV0aFN0YXRlU2VydmljZS51cGRhdGVBbmRQdWJsaXNoQXV0aFN0YXRlKHtcclxuICAgICAgYXV0aG9yaXphdGlvblN0YXRlOiBBdXRob3JpemVkU3RhdGUuVW5hdXRob3JpemVkLFxyXG4gICAgICB2YWxpZGF0aW9uUmVzdWx0OiBzdGF0ZVZhbGlkYXRpb25SZXN1bHQuc3RhdGUsXHJcbiAgICAgIGlzUmVuZXdQcm9jZXNzLFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==