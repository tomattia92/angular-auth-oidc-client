import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AuthorizedState } from '../../authState/authorized-state';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../validation/state-validation.service";
import * as i3 from "../../authState/auth-state.service";
import * as i4 from "../reset-auth-data.service";
export class StateValidationCallbackHandlerService {
    constructor(loggerService, stateValidationService, authStateService, resetAuthDataService, doc) {
        this.loggerService = loggerService;
        this.stateValidationService = stateValidationService;
        this.authStateService = authStateService;
        this.resetAuthDataService = resetAuthDataService;
        this.doc = doc;
    }
    // STEP 4 All flows
    callbackStateValidation(callbackContext) {
        const validationResult = this.stateValidationService.getValidatedStateResult(callbackContext);
        callbackContext.validationResult = validationResult;
        if (validationResult.authResponseIsValid) {
            this.authStateService.setAuthorizationData(validationResult.accessToken, callbackContext.authResult);
            return of(callbackContext);
        }
        else {
            const errorMessage = `authorizedCallback, token(s) validation failed, resetting. Hash: ${this.doc.location.hash}`;
            this.loggerService.logWarning(errorMessage);
            this.resetAuthDataService.resetAuthorizationData();
            this.publishUnauthorizedState(callbackContext.validationResult, callbackContext.isRenewProcess);
            return throwError(errorMessage);
        }
    }
    publishUnauthorizedState(stateValidationResult, isRenewProcess) {
        this.authStateService.updateAndPublishAuthState({
            authorizationState: AuthorizedState.Unauthorized,
            validationResult: stateValidationResult.state,
            isRenewProcess,
        });
    }
}
StateValidationCallbackHandlerService.ɵfac = function StateValidationCallbackHandlerService_Factory(t) { return new (t || StateValidationCallbackHandlerService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.StateValidationService), i0.ɵɵinject(i3.AuthStateService), i0.ɵɵinject(i4.ResetAuthDataService), i0.ɵɵinject(DOCUMENT)); };
StateValidationCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: StateValidationCallbackHandlerService, factory: StateValidationCallbackHandlerService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(StateValidationCallbackHandlerService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }, { type: i2.StateValidationService }, { type: i3.AuthStateService }, { type: i4.ResetAuthDataService }, { type: undefined, decorators: [{
                type: Inject,
                args: [DOCUMENT]
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtdmFsaWRhdGlvbi1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9zdGF0ZS12YWxpZGF0aW9uLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFbEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7Ozs7QUFRbkUsTUFBTSxPQUFPLHFDQUFxQztJQUNoRCxZQUNtQixhQUE0QixFQUM1QixzQkFBOEMsRUFDOUMsZ0JBQWtDLEVBQ2xDLG9CQUEwQyxFQUN4QixHQUFRO1FBSjFCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFDOUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQ3hCLFFBQUcsR0FBSCxHQUFHLENBQUs7SUFDMUMsQ0FBQztJQUVKLG1CQUFtQjtJQUVuQix1QkFBdUIsQ0FBQyxlQUFnQztRQUN0RCxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM5RixlQUFlLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFFcEQsSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRTtZQUN4QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNyRyxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUM1QjthQUFNO1lBQ0wsTUFBTSxZQUFZLEdBQUcsb0VBQW9FLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xILElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQ25ELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2hHLE9BQU8sVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUVPLHdCQUF3QixDQUFDLHFCQUE0QyxFQUFFLGNBQXVCO1FBQ3BHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQztZQUM5QyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsWUFBWTtZQUNoRCxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQyxLQUFLO1lBQzdDLGNBQWM7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDOzswSEFqQ1UscUNBQXFDLDZKQU10QyxRQUFROzZFQU5QLHFDQUFxQyxXQUFyQyxxQ0FBcUM7a0RBQXJDLHFDQUFxQztjQURqRCxVQUFVOztzQkFPTixNQUFNO3VCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBdXRoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYXV0aFN0YXRlL2F1dGgtc3RhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBBdXRob3JpemVkU3RhdGUgfSBmcm9tICcuLi8uLi9hdXRoU3RhdGUvYXV0aG9yaXplZC1zdGF0ZSc7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0ZVZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICcuLi8uLi92YWxpZGF0aW9uL3N0YXRlLXZhbGlkYXRpb24tcmVzdWx0JztcbmltcG9ydCB7IFN0YXRlVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi92YWxpZGF0aW9uL3N0YXRlLXZhbGlkYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBDYWxsYmFja0NvbnRleHQgfSBmcm9tICcuLi9jYWxsYmFjay1jb250ZXh0JztcbmltcG9ydCB7IFJlc2V0QXV0aERhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vcmVzZXQtYXV0aC1kYXRhLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RhdGVWYWxpZGF0aW9uQ2FsbGJhY2tIYW5kbGVyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0YXRlVmFsaWRhdGlvblNlcnZpY2U6IFN0YXRlVmFsaWRhdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBhdXRoU3RhdGVTZXJ2aWNlOiBBdXRoU3RhdGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzZXRBdXRoRGF0YVNlcnZpY2U6IFJlc2V0QXV0aERhdGFTZXJ2aWNlLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgcmVhZG9ubHkgZG9jOiBhbnlcbiAgKSB7fVxuXG4gIC8vIFNURVAgNCBBbGwgZmxvd3NcblxuICBjYWxsYmFja1N0YXRlVmFsaWRhdGlvbihjYWxsYmFja0NvbnRleHQ6IENhbGxiYWNrQ29udGV4dCk6IE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PiB7XG4gICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IHRoaXMuc3RhdGVWYWxpZGF0aW9uU2VydmljZS5nZXRWYWxpZGF0ZWRTdGF0ZVJlc3VsdChjYWxsYmFja0NvbnRleHQpO1xuICAgIGNhbGxiYWNrQ29udGV4dC52YWxpZGF0aW9uUmVzdWx0ID0gdmFsaWRhdGlvblJlc3VsdDtcblxuICAgIGlmICh2YWxpZGF0aW9uUmVzdWx0LmF1dGhSZXNwb25zZUlzVmFsaWQpIHtcbiAgICAgIHRoaXMuYXV0aFN0YXRlU2VydmljZS5zZXRBdXRob3JpemF0aW9uRGF0YSh2YWxpZGF0aW9uUmVzdWx0LmFjY2Vzc1Rva2VuLCBjYWxsYmFja0NvbnRleHQuYXV0aFJlc3VsdCk7XG4gICAgICByZXR1cm4gb2YoY2FsbGJhY2tDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYGF1dGhvcml6ZWRDYWxsYmFjaywgdG9rZW4ocykgdmFsaWRhdGlvbiBmYWlsZWQsIHJlc2V0dGluZy4gSGFzaDogJHt0aGlzLmRvYy5sb2NhdGlvbi5oYXNofWA7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhlcnJvck1lc3NhZ2UpO1xuICAgICAgdGhpcy5yZXNldEF1dGhEYXRhU2VydmljZS5yZXNldEF1dGhvcml6YXRpb25EYXRhKCk7XG4gICAgICB0aGlzLnB1Ymxpc2hVbmF1dGhvcml6ZWRTdGF0ZShjYWxsYmFja0NvbnRleHQudmFsaWRhdGlvblJlc3VsdCwgY2FsbGJhY2tDb250ZXh0LmlzUmVuZXdQcm9jZXNzKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwdWJsaXNoVW5hdXRob3JpemVkU3RhdGUoc3RhdGVWYWxpZGF0aW9uUmVzdWx0OiBTdGF0ZVZhbGlkYXRpb25SZXN1bHQsIGlzUmVuZXdQcm9jZXNzOiBib29sZWFuKSB7XG4gICAgdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLnVwZGF0ZUFuZFB1Ymxpc2hBdXRoU3RhdGUoe1xuICAgICAgYXV0aG9yaXphdGlvblN0YXRlOiBBdXRob3JpemVkU3RhdGUuVW5hdXRob3JpemVkLFxuICAgICAgdmFsaWRhdGlvblJlc3VsdDogc3RhdGVWYWxpZGF0aW9uUmVzdWx0LnN0YXRlLFxuICAgICAgaXNSZW5ld1Byb2Nlc3MsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==