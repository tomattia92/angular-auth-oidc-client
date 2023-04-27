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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy91c2VyLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7Ozs7OztBQVVuRSxNQUFNLE9BQU8sMEJBQTBCO0lBQ3JDLFlBQ21CLGFBQTRCLEVBQzVCLHFCQUE0QyxFQUM1QyxnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLFdBQXdCLEVBQ3hCLG9CQUEwQztRQUwxQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO0lBQzFELENBQUM7SUFFSixrQkFBa0I7SUFDbEIsWUFBWSxDQUFDLGVBQWdDO1FBQzNDLE1BQU0sRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLGVBQWUsQ0FBQztRQUN2RixNQUFNLEVBQUUsWUFBWSxFQUFFLDRCQUE0QixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFM0csSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixJQUFJLENBQUMsY0FBYyxJQUFJLDRCQUE0QixFQUFFO2dCQUNuRCwyRUFBMkU7Z0JBQzNFLElBQUksZ0JBQWdCLENBQUMsY0FBYyxFQUFFO29CQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUN0RTthQUNGO1lBRUQsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDcEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDakU7WUFFRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDOUQsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDNUI7UUFFRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsNEJBQTRCLENBQUMsY0FBYyxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQ2xJLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDZCxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUNqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDakU7Z0JBRUQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUU5RCxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUM1QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUNoRSxNQUFNLFlBQVksR0FBRyxxQ0FBcUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3JFLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM1QyxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNqQztRQUNILENBQUMsQ0FBQyxFQUNGLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sWUFBWSxHQUFHLDZDQUE2QyxHQUFHLEVBQUUsQ0FBQztZQUN4RSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1QyxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVPLHNCQUFzQixDQUFDLHFCQUE0QyxFQUFFLGNBQXVCO1FBQ2xHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQztZQUM5QyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsVUFBVTtZQUM5QyxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQyxLQUFLO1lBQzdDLGNBQWM7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sd0JBQXdCLENBQUMscUJBQTRDLEVBQUUsY0FBdUI7UUFDcEcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDO1lBQzlDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxZQUFZO1lBQ2hELGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLEtBQUs7WUFDN0MsY0FBYztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7O29HQXZFVSwwQkFBMEI7a0VBQTFCLDBCQUEwQixXQUExQiwwQkFBMEI7a0RBQTFCLDBCQUEwQjtjQUR0QyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hdXRoU3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IEF1dGhvcml6ZWRTdGF0ZSB9IGZyb20gJy4uLy4uL2F1dGhTdGF0ZS9hdXRob3JpemVkLXN0YXRlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uLy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi8uLi91c2VyRGF0YS91c2VyLXNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGVWYWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnLi4vLi4vdmFsaWRhdGlvbi9zdGF0ZS12YWxpZGF0aW9uLXJlc3VsdCc7XG5pbXBvcnQgeyBDYWxsYmFja0NvbnRleHQgfSBmcm9tICcuLi9jYWxsYmFjay1jb250ZXh0JztcbmltcG9ydCB7IEZsb3dzRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzZXRBdXRoRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9yZXNldC1hdXRoLWRhdGEuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBVc2VyQ2FsbGJhY2tIYW5kbGVyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXV0aFN0YXRlU2VydmljZTogQXV0aFN0YXRlU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSB1c2VyU2VydmljZTogVXNlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSByZXNldEF1dGhEYXRhU2VydmljZTogUmVzZXRBdXRoRGF0YVNlcnZpY2VcbiAgKSB7fVxuXG4gIC8vIFNURVAgNSB1c2VyRGF0YVxuICBjYWxsYmFja1VzZXIoY2FsbGJhY2tDb250ZXh0OiBDYWxsYmFja0NvbnRleHQpOiBPYnNlcnZhYmxlPENhbGxiYWNrQ29udGV4dD4ge1xuICAgIGNvbnN0IHsgaXNSZW5ld1Byb2Nlc3MsIHZhbGlkYXRpb25SZXN1bHQsIGF1dGhSZXN1bHQsIHJlZnJlc2hUb2tlbiB9ID0gY2FsbGJhY2tDb250ZXh0O1xuICAgIGNvbnN0IHsgYXV0b1VzZXJpbmZvLCByZW5ld1VzZXJJbmZvQWZ0ZXJUb2tlblJlbmV3IH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG5cbiAgICBpZiAoIWF1dG9Vc2VyaW5mbykge1xuICAgICAgaWYgKCFpc1JlbmV3UHJvY2VzcyB8fCByZW5ld1VzZXJJbmZvQWZ0ZXJUb2tlblJlbmV3KSB7XG4gICAgICAgIC8vIHVzZXJEYXRhIGlzIHNldCB0byB0aGUgaWRfdG9rZW4gZGVjb2RlZCwgYXV0byBnZXQgdXNlciBkYXRhIHNldCB0byBmYWxzZVxuICAgICAgICBpZiAodmFsaWRhdGlvblJlc3VsdC5kZWNvZGVkSWRUb2tlbikge1xuICAgICAgICAgIHRoaXMudXNlclNlcnZpY2Uuc2V0VXNlckRhdGFUb1N0b3JlKHZhbGlkYXRpb25SZXN1bHQuZGVjb2RlZElkVG9rZW4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNSZW5ld1Byb2Nlc3MgJiYgIXJlZnJlc2hUb2tlbikge1xuICAgICAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2Uuc2V0U2Vzc2lvblN0YXRlKGF1dGhSZXN1bHQuc2Vzc2lvbl9zdGF0ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHVibGlzaEF1dGhvcml6ZWRTdGF0ZSh2YWxpZGF0aW9uUmVzdWx0LCBpc1JlbmV3UHJvY2Vzcyk7XG4gICAgICByZXR1cm4gb2YoY2FsbGJhY2tDb250ZXh0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy51c2VyU2VydmljZS5nZXRBbmRQZXJzaXN0VXNlckRhdGFJblN0b3JlKGlzUmVuZXdQcm9jZXNzLCB2YWxpZGF0aW9uUmVzdWx0LmlkVG9rZW4sIHZhbGlkYXRpb25SZXN1bHQuZGVjb2RlZElkVG9rZW4pLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKHVzZXJEYXRhKSA9PiB7XG4gICAgICAgIGlmICghIXVzZXJEYXRhKSB7XG4gICAgICAgICAgaWYgKCFyZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5zZXRTZXNzaW9uU3RhdGUoYXV0aFJlc3VsdC5zZXNzaW9uX3N0YXRlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnB1Ymxpc2hBdXRob3JpemVkU3RhdGUodmFsaWRhdGlvblJlc3VsdCwgaXNSZW5ld1Byb2Nlc3MpO1xuXG4gICAgICAgICAgcmV0dXJuIG9mKGNhbGxiYWNrQ29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZXNldEF1dGhEYXRhU2VydmljZS5yZXNldEF1dGhvcml6YXRpb25EYXRhKCk7XG4gICAgICAgICAgdGhpcy5wdWJsaXNoVW5hdXRob3JpemVkU3RhdGUodmFsaWRhdGlvblJlc3VsdCwgaXNSZW5ld1Byb2Nlc3MpO1xuICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBDYWxsZWQgZm9yIHVzZXJEYXRhIGJ1dCB0aGV5IHdlcmUgJHt1c2VyRGF0YX1gO1xuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYEZhaWxlZCB0byByZXRyaWV2ZSB1c2VyIGluZm8gd2l0aCBlcnJvcjogICR7ZXJyfWA7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGVycm9yTWVzc2FnZSk7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHB1Ymxpc2hBdXRob3JpemVkU3RhdGUoc3RhdGVWYWxpZGF0aW9uUmVzdWx0OiBTdGF0ZVZhbGlkYXRpb25SZXN1bHQsIGlzUmVuZXdQcm9jZXNzOiBib29sZWFuKSB7XG4gICAgdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLnVwZGF0ZUFuZFB1Ymxpc2hBdXRoU3RhdGUoe1xuICAgICAgYXV0aG9yaXphdGlvblN0YXRlOiBBdXRob3JpemVkU3RhdGUuQXV0aG9yaXplZCxcbiAgICAgIHZhbGlkYXRpb25SZXN1bHQ6IHN0YXRlVmFsaWRhdGlvblJlc3VsdC5zdGF0ZSxcbiAgICAgIGlzUmVuZXdQcm9jZXNzLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBwdWJsaXNoVW5hdXRob3JpemVkU3RhdGUoc3RhdGVWYWxpZGF0aW9uUmVzdWx0OiBTdGF0ZVZhbGlkYXRpb25SZXN1bHQsIGlzUmVuZXdQcm9jZXNzOiBib29sZWFuKSB7XG4gICAgdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLnVwZGF0ZUFuZFB1Ymxpc2hBdXRoU3RhdGUoe1xuICAgICAgYXV0aG9yaXphdGlvblN0YXRlOiBBdXRob3JpemVkU3RhdGUuVW5hdXRob3JpemVkLFxuICAgICAgdmFsaWRhdGlvblJlc3VsdDogc3RhdGVWYWxpZGF0aW9uUmVzdWx0LnN0YXRlLFxuICAgICAgaXNSZW5ld1Byb2Nlc3MsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==