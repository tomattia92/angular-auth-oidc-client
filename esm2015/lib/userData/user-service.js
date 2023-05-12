import { Injectable } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { map, retry, switchMap } from 'rxjs/operators';
import { EventTypes } from '../public-events/event-types';
import * as i0 from "@angular/core";
import * as i1 from "../api/data.service";
import * as i2 from "../storage/storage-persistence.service";
import * as i3 from "../public-events/public-events.service";
import * as i4 from "../logging/logger.service";
import * as i5 from "../utils/tokenHelper/oidc-token-helper.service";
import * as i6 from "../utils/flowHelper/flow-helper.service";
import * as i7 from "../config/config.provider";
export class UserService {
    constructor(oidcDataService, storagePersistenceService, eventService, loggerService, tokenHelperService, flowHelper, configurationProvider) {
        this.oidcDataService = oidcDataService;
        this.storagePersistenceService = storagePersistenceService;
        this.eventService = eventService;
        this.loggerService = loggerService;
        this.tokenHelperService = tokenHelperService;
        this.flowHelper = flowHelper;
        this.configurationProvider = configurationProvider;
        this.userDataInternal$ = new BehaviorSubject(null);
    }
    get userData$() {
        return this.userDataInternal$.asObservable();
    }
    // TODO CHECK PARAMETERS
    //  validationResult.idToken can be the complete validationResult
    getAndPersistUserDataInStore(isRenewProcess = false, idToken, decodedIdToken) {
        idToken = idToken || this.storagePersistenceService.getIdToken();
        decodedIdToken = decodedIdToken || this.tokenHelperService.getPayloadFromToken(idToken, false);
        const existingUserDataFromStorage = this.getUserDataFromStore();
        const haveUserData = !!existingUserDataFromStorage;
        const isCurrentFlowImplicitFlowWithAccessToken = this.flowHelper.isCurrentFlowImplicitFlowWithAccessToken();
        const isCurrentFlowCodeFlow = this.flowHelper.isCurrentFlowCodeFlow();
        const accessToken = this.storagePersistenceService.getAccessToken();
        if (!(isCurrentFlowImplicitFlowWithAccessToken || isCurrentFlowCodeFlow)) {
            this.loggerService.logDebug('authorizedCallback id_token flow');
            this.loggerService.logDebug('accessToken', accessToken);
            this.setUserDataToStore(decodedIdToken);
            return of(decodedIdToken);
        }
        const { renewUserInfoAfterTokenRenew } = this.configurationProvider.getOpenIDConfiguration();
        if (!isRenewProcess || renewUserInfoAfterTokenRenew || !haveUserData) {
            return this.getUserDataOidcFlowAndSave(decodedIdToken.sub).pipe(switchMap((userData) => {
                this.loggerService.logDebug('Received user data', userData);
                if (!!userData) {
                    this.loggerService.logDebug('accessToken', accessToken);
                    return of(userData);
                }
                else {
                    return throwError('no user data, request failed');
                }
            }));
        }
        return of(existingUserDataFromStorage);
    }
    getUserDataFromStore() {
        return this.storagePersistenceService.read('userData') || null;
    }
    publishUserDataIfExists() {
        const userData = this.getUserDataFromStore();
        if (userData) {
            this.userDataInternal$.next(userData);
            this.eventService.fireEvent(EventTypes.UserDataChanged, userData);
        }
    }
    setUserDataToStore(value) {
        this.storagePersistenceService.write('userData', value);
        this.userDataInternal$.next(value);
        this.eventService.fireEvent(EventTypes.UserDataChanged, value);
    }
    resetUserDataInStore() {
        this.storagePersistenceService.remove('userData');
        this.eventService.fireEvent(EventTypes.UserDataChanged, null);
        this.userDataInternal$.next(null);
    }
    getUserDataOidcFlowAndSave(idTokenSub) {
        return this.getIdentityUserData().pipe(map((data) => {
            if (this.validateUserDataSubIdToken(idTokenSub, data === null || data === void 0 ? void 0 : data.sub)) {
                this.setUserDataToStore(data);
                return data;
            }
            else {
                // something went wrong, userdata sub does not match that from id_token
                this.loggerService.logWarning('authorizedCallback, User data sub does not match sub in id_token');
                this.loggerService.logDebug('authorizedCallback, token(s) validation failed, resetting');
                this.resetUserDataInStore();
                return null;
            }
        }));
    }
    getIdentityUserData() {
        const token = this.storagePersistenceService.getAccessToken();
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        if (!authWellKnownEndPoints) {
            this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined');
            return throwError('authWellKnownEndpoints is undefined');
        }
        const userinfoEndpoint = authWellKnownEndPoints.userinfoEndpoint;
        if (!userinfoEndpoint) {
            this.loggerService.logError('init check session: authWellKnownEndpoints.userinfo_endpoint is undefined; set auto_userinfo = false in config');
            // TODO: HERE
            // Bisogna modificare il path e far intervenire proxy
            if (window.location.href.includes('localhost')) {
                let myArray = userinfoEndpoint.split('/');
                myArray.splice(0, 3);
                let pathModified = myArray.join('/');
                console.log(myArray.join('/'));
                return this.oidcDataService.get(pathModified, token).pipe(retry(2));
            }
            return throwError('authWellKnownEndpoints.userinfo_endpoint is undefined');
        }
        return this.oidcDataService.get(userinfoEndpoint, token).pipe(retry(2));
    }
    validateUserDataSubIdToken(idTokenSub, userdataSub) {
        if (!idTokenSub) {
            return false;
        }
        if (!userdataSub) {
            return false;
        }
        if (idTokenSub !== userdataSub) {
            this.loggerService.logDebug('validateUserDataSubIdToken failed', idTokenSub, userdataSub);
            return false;
        }
        return true;
    }
}
UserService.ɵfac = function UserService_Factory(t) { return new (t || UserService)(i0.ɵɵinject(i1.DataService), i0.ɵɵinject(i2.StoragePersistenceService), i0.ɵɵinject(i3.PublicEventsService), i0.ɵɵinject(i4.LoggerService), i0.ɵɵinject(i5.TokenHelperService), i0.ɵɵinject(i6.FlowHelper), i0.ɵɵinject(i7.ConfigurationProvider)); };
UserService.ɵprov = i0.ɵɵdefineInjectable({ token: UserService, factory: UserService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(UserService, [{
        type: Injectable
    }], function () { return [{ type: i1.DataService }, { type: i2.StoragePersistenceService }, { type: i3.PublicEventsService }, { type: i4.LoggerService }, { type: i5.TokenHelperService }, { type: i6.FlowHelper }, { type: i7.ConfigurationProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvdXNlckRhdGEvdXNlci1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7Ozs7Ozs7O0FBTzFELE1BQU0sT0FBTyxXQUFXO0lBT3RCLFlBQ1UsZUFBNEIsRUFDNUIseUJBQW9ELEVBQ3BELFlBQWlDLEVBQ2pDLGFBQTRCLEVBQzVCLGtCQUFzQyxFQUN0QyxVQUFzQixFQUN0QixxQkFBNEM7UUFONUMsb0JBQWUsR0FBZixlQUFlLENBQWE7UUFDNUIsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUNwRCxpQkFBWSxHQUFaLFlBQVksQ0FBcUI7UUFDakMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFiOUMsc0JBQWlCLEdBQUcsSUFBSSxlQUFlLENBQU0sSUFBSSxDQUFDLENBQUM7SUFjeEQsQ0FBQztJQVpKLElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFZRCx3QkFBd0I7SUFDeEIsaUVBQWlFO0lBQ2pFLDRCQUE0QixDQUFDLGNBQWMsR0FBRyxLQUFLLEVBQUUsT0FBYSxF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LEVBQUU7WUFDdEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsbUNBQW1DLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzFGLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O3NFQWhKVSxXQUFXO21EQUFYLFdBQVcsV0FBWCxXQUFXO2tEQUFYLFdBQVc7Y0FEdkIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAsIHJldHJ5LCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IERhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vYXBpL2RhdGEuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEV2ZW50VHlwZXMgfSBmcm9tICcuLi9wdWJsaWMtZXZlbnRzL2V2ZW50LXR5cGVzJztcclxuaW1wb3J0IHsgUHVibGljRXZlbnRzU2VydmljZSB9IGZyb20gJy4uL3B1YmxpYy1ldmVudHMvcHVibGljLWV2ZW50cy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4uL3N0b3JhZ2Uvc3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd0hlbHBlciB9IGZyb20gJy4uL3V0aWxzL2Zsb3dIZWxwZXIvZmxvdy1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFRva2VuSGVscGVyU2VydmljZSB9IGZyb20gJy4uL3V0aWxzL3Rva2VuSGVscGVyL29pZGMtdG9rZW4taGVscGVyLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgdXNlckRhdGFJbnRlcm5hbCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XHJcblxyXG4gIGdldCB1c2VyRGF0YSQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51c2VyRGF0YUludGVybmFsJC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBvaWRjRGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBldmVudFNlcnZpY2U6IFB1YmxpY0V2ZW50c1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHRva2VuSGVscGVyU2VydmljZTogVG9rZW5IZWxwZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBmbG93SGVscGVyOiBGbG93SGVscGVyLFxyXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlclxyXG4gICkge31cclxuXHJcbiAgLy8gVE9ETyBDSEVDSyBQQVJBTUVURVJTXHJcbiAgLy8gIHZhbGlkYXRpb25SZXN1bHQuaWRUb2tlbiBjYW4gYmUgdGhlIGNvbXBsZXRlIHZhbGlkYXRpb25SZXN1bHRcclxuICBnZXRBbmRQZXJzaXN0VXNlckRhdGFJblN0b3JlKGlzUmVuZXdQcm9jZXNzID0gZmFsc2UsIGlkVG9rZW4/OiBhbnksIGRlY29kZWRJZFRva2VuPzogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGlkVG9rZW4gPSBpZFRva2VuIHx8IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5nZXRJZFRva2VuKCk7XHJcbiAgICBkZWNvZGVkSWRUb2tlbiA9IGRlY29kZWRJZFRva2VuIHx8IHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldFBheWxvYWRGcm9tVG9rZW4oaWRUb2tlbiwgZmFsc2UpO1xyXG5cclxuICAgIGNvbnN0IGV4aXN0aW5nVXNlckRhdGFGcm9tU3RvcmFnZSA9IHRoaXMuZ2V0VXNlckRhdGFGcm9tU3RvcmUoKTtcclxuICAgIGNvbnN0IGhhdmVVc2VyRGF0YSA9ICEhZXhpc3RpbmdVc2VyRGF0YUZyb21TdG9yYWdlO1xyXG4gICAgY29uc3QgaXNDdXJyZW50Rmxvd0ltcGxpY2l0Rmxvd1dpdGhBY2Nlc3NUb2tlbiA9IHRoaXMuZmxvd0hlbHBlci5pc0N1cnJlbnRGbG93SW1wbGljaXRGbG93V2l0aEFjY2Vzc1Rva2VuKCk7XHJcbiAgICBjb25zdCBpc0N1cnJlbnRGbG93Q29kZUZsb3cgPSB0aGlzLmZsb3dIZWxwZXIuaXNDdXJyZW50Rmxvd0NvZGVGbG93KCk7XHJcblxyXG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UuZ2V0QWNjZXNzVG9rZW4oKTtcclxuICAgIGlmICghKGlzQ3VycmVudEZsb3dJbXBsaWNpdEZsb3dXaXRoQWNjZXNzVG9rZW4gfHwgaXNDdXJyZW50Rmxvd0NvZGVGbG93KSkge1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F1dGhvcml6ZWRDYWxsYmFjayBpZF90b2tlbiBmbG93Jyk7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnYWNjZXNzVG9rZW4nLCBhY2Nlc3NUb2tlbik7XHJcblxyXG4gICAgICB0aGlzLnNldFVzZXJEYXRhVG9TdG9yZShkZWNvZGVkSWRUb2tlbik7XHJcbiAgICAgIHJldHVybiBvZihkZWNvZGVkSWRUb2tlbik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyByZW5ld1VzZXJJbmZvQWZ0ZXJUb2tlblJlbmV3IH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XHJcblxyXG4gICAgaWYgKCFpc1JlbmV3UHJvY2VzcyB8fCByZW5ld1VzZXJJbmZvQWZ0ZXJUb2tlblJlbmV3IHx8ICFoYXZlVXNlckRhdGEpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VXNlckRhdGFPaWRjRmxvd0FuZFNhdmUoZGVjb2RlZElkVG9rZW4uc3ViKS5waXBlKFxyXG4gICAgICAgIHN3aXRjaE1hcCgodXNlckRhdGEpID0+IHtcclxuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnUmVjZWl2ZWQgdXNlciBkYXRhJywgdXNlckRhdGEpO1xyXG4gICAgICAgICAgaWYgKCEhdXNlckRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhY2Nlc3NUb2tlbicsIGFjY2Vzc1Rva2VuKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9mKHVzZXJEYXRhKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdubyB1c2VyIGRhdGEsIHJlcXVlc3QgZmFpbGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb2YoZXhpc3RpbmdVc2VyRGF0YUZyb21TdG9yYWdlKTtcclxuICB9XHJcblxyXG4gIGdldFVzZXJEYXRhRnJvbVN0b3JlKCk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ3VzZXJEYXRhJykgfHwgbnVsbDtcclxuICB9XHJcblxyXG4gIHB1Ymxpc2hVc2VyRGF0YUlmRXhpc3RzKCkge1xyXG4gICAgY29uc3QgdXNlckRhdGEgPSB0aGlzLmdldFVzZXJEYXRhRnJvbVN0b3JlKCk7XHJcbiAgICBpZiAodXNlckRhdGEpIHtcclxuICAgICAgdGhpcy51c2VyRGF0YUludGVybmFsJC5uZXh0KHVzZXJEYXRhKTtcclxuICAgICAgdGhpcy5ldmVudFNlcnZpY2UuZmlyZUV2ZW50KEV2ZW50VHlwZXMuVXNlckRhdGFDaGFuZ2VkLCB1c2VyRGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRVc2VyRGF0YVRvU3RvcmUodmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLndyaXRlKCd1c2VyRGF0YScsIHZhbHVlKTtcclxuICAgIHRoaXMudXNlckRhdGFJbnRlcm5hbCQubmV4dCh2YWx1ZSk7XHJcbiAgICB0aGlzLmV2ZW50U2VydmljZS5maXJlRXZlbnQoRXZlbnRUeXBlcy5Vc2VyRGF0YUNoYW5nZWQsIHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHJlc2V0VXNlckRhdGFJblN0b3JlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlbW92ZSgndXNlckRhdGEnKTtcclxuICAgIHRoaXMuZXZlbnRTZXJ2aWNlLmZpcmVFdmVudChFdmVudFR5cGVzLlVzZXJEYXRhQ2hhbmdlZCwgbnVsbCk7XHJcbiAgICB0aGlzLnVzZXJEYXRhSW50ZXJuYWwkLm5leHQobnVsbCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFVzZXJEYXRhT2lkY0Zsb3dBbmRTYXZlKGlkVG9rZW5TdWI6IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRJZGVudGl0eVVzZXJEYXRhKCkucGlwZShcclxuICAgICAgbWFwKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAodGhpcy52YWxpZGF0ZVVzZXJEYXRhU3ViSWRUb2tlbihpZFRva2VuU3ViLCBkYXRhPy5zdWIpKSB7XHJcbiAgICAgICAgICB0aGlzLnNldFVzZXJEYXRhVG9TdG9yZShkYXRhKTtcclxuICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZywgdXNlcmRhdGEgc3ViIGRvZXMgbm90IG1hdGNoIHRoYXQgZnJvbSBpZF90b2tlblxyXG4gICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2F1dGhvcml6ZWRDYWxsYmFjaywgVXNlciBkYXRhIHN1YiBkb2VzIG5vdCBtYXRjaCBzdWIgaW4gaWRfdG9rZW4nKTtcclxuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnYXV0aG9yaXplZENhbGxiYWNrLCB0b2tlbihzKSB2YWxpZGF0aW9uIGZhaWxlZCwgcmVzZXR0aW5nJyk7XHJcbiAgICAgICAgICB0aGlzLnJlc2V0VXNlckRhdGFJblN0b3JlKCk7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRJZGVudGl0eVVzZXJEYXRhKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpO1xyXG5cclxuICAgIGNvbnN0IGF1dGhXZWxsS25vd25FbmRQb2ludHMgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycpO1xyXG5cclxuICAgIGlmICghYXV0aFdlbGxLbm93bkVuZFBvaW50cykge1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5pdCBjaGVjayBzZXNzaW9uOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICByZXR1cm4gdGhyb3dFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1c2VyaW5mb0VuZHBvaW50ID0gYXV0aFdlbGxLbm93bkVuZFBvaW50cy51c2VyaW5mb0VuZHBvaW50O1xyXG5cclxuICAgIGlmICghdXNlcmluZm9FbmRwb2ludCkge1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoXHJcbiAgICAgICAgJ2luaXQgY2hlY2sgc2Vzc2lvbjogYXV0aFdlbGxLbm93bkVuZHBvaW50cy51c2VyaW5mb19lbmRwb2ludCBpcyB1bmRlZmluZWQ7IHNldCBhdXRvX3VzZXJpbmZvID0gZmFsc2UgaW4gY29uZmlnJ1xyXG4gICAgICApO1xyXG4gICAgICAvLyBUT0RPOiBIRVJFXHJcbiAgICAgIC8vIEJpc29nbmEgbW9kaWZpY2FyZSBpbCBwYXRoIGUgZmFyIGludGVydmVuaXJlIHByb3h5XHJcbiAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcygnbG9jYWxob3N0JykpIHtcclxuICAgICAgICBsZXQgbXlBcnJheSA9IHVzZXJpbmZvRW5kcG9pbnQuc3BsaXQoJy8nKTtcclxuICAgICAgICBteUFycmF5LnNwbGljZSgwLCAzKTtcclxuICAgICAgICBsZXQgcGF0aE1vZGlmaWVkID0gbXlBcnJheS5qb2luKCcvJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2cobXlBcnJheS5qb2luKCcvJykpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5vaWRjRGF0YVNlcnZpY2UuZ2V0KHBhdGhNb2RpZmllZCwgdG9rZW4pLnBpcGUocmV0cnkoMikpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdhdXRoV2VsbEtub3duRW5kcG9pbnRzLnVzZXJpbmZvX2VuZHBvaW50IGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm9pZGNEYXRhU2VydmljZS5nZXQodXNlcmluZm9FbmRwb2ludCwgdG9rZW4pLnBpcGUocmV0cnkoMikpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB2YWxpZGF0ZVVzZXJEYXRhU3ViSWRUb2tlbihpZFRva2VuU3ViOiBhbnksIHVzZXJkYXRhU3ViOiBhbnkpOiBib29sZWFuIHtcclxuICAgIGlmICghaWRUb2tlblN1Yikge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF1c2VyZGF0YVN1Yikge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKChpZFRva2VuU3ViIGFzIHN0cmluZykgIT09ICh1c2VyZGF0YVN1YiBhcyBzdHJpbmcpKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygndmFsaWRhdGVVc2VyRGF0YVN1YklkVG9rZW4gZmFpbGVkJywgaWRUb2tlblN1YiwgdXNlcmRhdGFTdWIpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcbiJdfQ==