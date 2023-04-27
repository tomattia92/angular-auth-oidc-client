import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../reset-auth-data.service";
import * as i2 from "../../logging/logger.service";
import * as i3 from "../flows-data.service";
export class ImplicitFlowCallbackHandlerService {
    constructor(resetAuthDataService, loggerService, flowsDataService, doc) {
        this.resetAuthDataService = resetAuthDataService;
        this.loggerService = loggerService;
        this.flowsDataService = flowsDataService;
        this.doc = doc;
    }
    // STEP 1 Code Flow
    // STEP 1 Implicit Flow
    implicitFlowCallback(hash) {
        const isRenewProcessData = this.flowsDataService.isSilentRenewRunning();
        this.loggerService.logDebug('BEGIN authorizedCallback, no auth data');
        if (!isRenewProcessData) {
            this.resetAuthDataService.resetAuthorizationData();
        }
        hash = hash || this.doc.location.hash.substr(1);
        const authResult = hash.split('&').reduce((resultData, item) => {
            const parts = item.split('=');
            resultData[parts.shift()] = parts.join('=');
            return resultData;
        }, {});
        const callbackContext = {
            code: null,
            refreshToken: null,
            state: null,
            sessionState: null,
            authResult,
            isRenewProcess: isRenewProcessData,
            jwtKeys: null,
            validationResult: null,
            existingIdToken: null,
        };
        return of(callbackContext);
    }
}
ImplicitFlowCallbackHandlerService.ɵfac = function ImplicitFlowCallbackHandlerService_Factory(t) { return new (t || ImplicitFlowCallbackHandlerService)(i0.ɵɵinject(i1.ResetAuthDataService), i0.ɵɵinject(i2.LoggerService), i0.ɵɵinject(i3.FlowsDataService), i0.ɵɵinject(DOCUMENT)); };
ImplicitFlowCallbackHandlerService.ɵprov = i0.ɵɵdefineInjectable({ token: ImplicitFlowCallbackHandlerService, factory: ImplicitFlowCallbackHandlerService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ImplicitFlowCallbackHandlerService, [{
        type: Injectable
    }], function () { return [{ type: i1.ResetAuthDataService }, { type: i2.LoggerService }, { type: i3.FlowsDataService }, { type: undefined, decorators: [{
                type: Inject,
                args: [DOCUMENT]
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wbGljaXQtZmxvdy1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9pbXBsaWNpdC1mbG93LWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFjLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7Ozs7QUFPdEMsTUFBTSxPQUFPLGtDQUFrQztJQUM3QyxZQUNtQixvQkFBMEMsRUFDMUMsYUFBNEIsRUFDNUIsZ0JBQWtDLEVBQ2hCLEdBQVE7UUFIMUIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2hCLFFBQUcsR0FBSCxHQUFHLENBQUs7SUFDMUMsQ0FBQztJQUVKLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsb0JBQW9CLENBQUMsSUFBYTtRQUNoQyxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBRXhFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3ZCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQ3BEO1FBRUQsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWhELE1BQU0sVUFBVSxHQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBZSxFQUFFLElBQVksRUFBRSxFQUFFO1lBQy9FLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQVksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEQsT0FBTyxVQUFVLENBQUM7UUFDcEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRVAsTUFBTSxlQUFlLEdBQUc7WUFDdEIsSUFBSSxFQUFFLElBQUk7WUFDVixZQUFZLEVBQUUsSUFBSTtZQUNsQixLQUFLLEVBQUUsSUFBSTtZQUNYLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFVBQVU7WUFDVixjQUFjLEVBQUUsa0JBQWtCO1lBQ2xDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixlQUFlLEVBQUUsSUFBSTtTQUN0QixDQUFDO1FBRUYsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDN0IsQ0FBQzs7b0hBdkNVLGtDQUFrQyxxSEFLbkMsUUFBUTswRUFMUCxrQ0FBa0MsV0FBbEMsa0NBQWtDO2tEQUFsQyxrQ0FBa0M7Y0FEOUMsVUFBVTs7c0JBTU4sTUFBTTt1QkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FsbGJhY2tDb250ZXh0IH0gZnJvbSAnLi4vY2FsbGJhY2stY29udGV4dCc7XG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IFJlc2V0QXV0aERhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vcmVzZXQtYXV0aC1kYXRhLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSW1wbGljaXRGbG93Q2FsbGJhY2tIYW5kbGVyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzZXRBdXRoRGF0YVNlcnZpY2U6IFJlc2V0QXV0aERhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSByZWFkb25seSBkb2M6IGFueVxuICApIHt9XG5cbiAgLy8gU1RFUCAxIENvZGUgRmxvd1xuICAvLyBTVEVQIDEgSW1wbGljaXQgRmxvd1xuICBpbXBsaWNpdEZsb3dDYWxsYmFjayhoYXNoPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxDYWxsYmFja0NvbnRleHQ+IHtcbiAgICBjb25zdCBpc1JlbmV3UHJvY2Vzc0RhdGEgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuaXNTaWxlbnRSZW5ld1J1bm5pbmcoKTtcblxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnQkVHSU4gYXV0aG9yaXplZENhbGxiYWNrLCBubyBhdXRoIGRhdGEnKTtcbiAgICBpZiAoIWlzUmVuZXdQcm9jZXNzRGF0YSkge1xuICAgICAgdGhpcy5yZXNldEF1dGhEYXRhU2VydmljZS5yZXNldEF1dGhvcml6YXRpb25EYXRhKCk7XG4gICAgfVxuXG4gICAgaGFzaCA9IGhhc2ggfHwgdGhpcy5kb2MubG9jYXRpb24uaGFzaC5zdWJzdHIoMSk7XG5cbiAgICBjb25zdCBhdXRoUmVzdWx0OiBhbnkgPSBoYXNoLnNwbGl0KCcmJykucmVkdWNlKChyZXN1bHREYXRhOiBhbnksIGl0ZW06IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCc9Jyk7XG4gICAgICByZXN1bHREYXRhW3BhcnRzLnNoaWZ0KCkgYXMgc3RyaW5nXSA9IHBhcnRzLmpvaW4oJz0nKTtcbiAgICAgIHJldHVybiByZXN1bHREYXRhO1xuICAgIH0sIHt9KTtcblxuICAgIGNvbnN0IGNhbGxiYWNrQ29udGV4dCA9IHtcbiAgICAgIGNvZGU6IG51bGwsXG4gICAgICByZWZyZXNoVG9rZW46IG51bGwsXG4gICAgICBzdGF0ZTogbnVsbCxcbiAgICAgIHNlc3Npb25TdGF0ZTogbnVsbCxcbiAgICAgIGF1dGhSZXN1bHQsXG4gICAgICBpc1JlbmV3UHJvY2VzczogaXNSZW5ld1Byb2Nlc3NEYXRhLFxuICAgICAgand0S2V5czogbnVsbCxcbiAgICAgIHZhbGlkYXRpb25SZXN1bHQ6IG51bGwsXG4gICAgICBleGlzdGluZ0lkVG9rZW46IG51bGwsXG4gICAgfTtcblxuICAgIHJldHVybiBvZihjYWxsYmFja0NvbnRleHQpO1xuICB9XG59XG4iXX0=