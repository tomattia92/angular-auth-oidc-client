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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvdXNlckRhdGEvdXNlci1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7Ozs7Ozs7O0FBTzFELE1BQU0sT0FBTyxXQUFXO0lBT3RCLFlBQ1UsZUFBNEIsRUFDNUIseUJBQW9ELEVBQ3BELFlBQWlDLEVBQ2pDLGFBQTRCLEVBQzVCLGtCQUFzQyxFQUN0QyxVQUFzQixFQUN0QixxQkFBNEM7UUFONUMsb0JBQWUsR0FBZixlQUFlLENBQWE7UUFDNUIsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUNwRCxpQkFBWSxHQUFaLFlBQVksQ0FBcUI7UUFDakMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFiOUMsc0JBQWlCLEdBQUcsSUFBSSxlQUFlLENBQU0sSUFBSSxDQUFDLENBQUM7SUFjeEQsQ0FBQztJQVpKLElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFZRCx3QkFBd0I7SUFDeEIsaUVBQWlFO0lBQ2pFLDRCQUE0QixDQUFDLGNBQWMsR0FBRyxLQUFLLEVBQUUsT0FBYSxF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LEVBQUU7WUFDdEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsbUNBQW1DLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzFGLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O3NFQWhKVSxXQUFXO21EQUFYLFdBQVcsV0FBWCxXQUFXO2tEQUFYLFdBQVc7Y0FEdkIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCwgcmV0cnksIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vYXBpL2RhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IEV2ZW50VHlwZXMgfSBmcm9tICcuLi9wdWJsaWMtZXZlbnRzL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7IFB1YmxpY0V2ZW50c1NlcnZpY2UgfSBmcm9tICcuLi9wdWJsaWMtZXZlbnRzL3B1YmxpYy1ldmVudHMuc2VydmljZSc7XG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmxvd0hlbHBlciB9IGZyb20gJy4uL3V0aWxzL2Zsb3dIZWxwZXIvZmxvdy1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBUb2tlbkhlbHBlclNlcnZpY2UgfSBmcm9tICcuLi91dGlscy90b2tlbkhlbHBlci9vaWRjLXRva2VuLWhlbHBlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSB1c2VyRGF0YUludGVybmFsJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcblxuICBnZXQgdXNlckRhdGEkKCkge1xuICAgIHJldHVybiB0aGlzLnVzZXJEYXRhSW50ZXJuYWwkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBvaWRjRGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcbiAgICBwcml2YXRlIGV2ZW50U2VydmljZTogUHVibGljRXZlbnRzU2VydmljZSxcbiAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSB0b2tlbkhlbHBlclNlcnZpY2U6IFRva2VuSGVscGVyU2VydmljZSxcbiAgICBwcml2YXRlIGZsb3dIZWxwZXI6IEZsb3dIZWxwZXIsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlclxuICApIHt9XG5cbiAgLy8gVE9ETyBDSEVDSyBQQVJBTUVURVJTXG4gIC8vICB2YWxpZGF0aW9uUmVzdWx0LmlkVG9rZW4gY2FuIGJlIHRoZSBjb21wbGV0ZSB2YWxpZGF0aW9uUmVzdWx0XG4gIGdldEFuZFBlcnNpc3RVc2VyRGF0YUluU3RvcmUoaXNSZW5ld1Byb2Nlc3MgPSBmYWxzZSwgaWRUb2tlbj86IGFueSwgZGVjb2RlZElkVG9rZW4/OiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlkVG9rZW4gPSBpZFRva2VuIHx8IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5nZXRJZFRva2VuKCk7XG4gICAgZGVjb2RlZElkVG9rZW4gPSBkZWNvZGVkSWRUb2tlbiB8fCB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRQYXlsb2FkRnJvbVRva2VuKGlkVG9rZW4sIGZhbHNlKTtcblxuICAgIGNvbnN0IGV4aXN0aW5nVXNlckRhdGFGcm9tU3RvcmFnZSA9IHRoaXMuZ2V0VXNlckRhdGFGcm9tU3RvcmUoKTtcbiAgICBjb25zdCBoYXZlVXNlckRhdGEgPSAhIWV4aXN0aW5nVXNlckRhdGFGcm9tU3RvcmFnZTtcbiAgICBjb25zdCBpc0N1cnJlbnRGbG93SW1wbGljaXRGbG93V2l0aEFjY2Vzc1Rva2VuID0gdGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dJbXBsaWNpdEZsb3dXaXRoQWNjZXNzVG9rZW4oKTtcbiAgICBjb25zdCBpc0N1cnJlbnRGbG93Q29kZUZsb3cgPSB0aGlzLmZsb3dIZWxwZXIuaXNDdXJyZW50Rmxvd0NvZGVGbG93KCk7XG5cbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpO1xuICAgIGlmICghKGlzQ3VycmVudEZsb3dJbXBsaWNpdEZsb3dXaXRoQWNjZXNzVG9rZW4gfHwgaXNDdXJyZW50Rmxvd0NvZGVGbG93KSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhdXRob3JpemVkQ2FsbGJhY2sgaWRfdG9rZW4gZmxvdycpO1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhY2Nlc3NUb2tlbicsIGFjY2Vzc1Rva2VuKTtcblxuICAgICAgdGhpcy5zZXRVc2VyRGF0YVRvU3RvcmUoZGVjb2RlZElkVG9rZW4pO1xuICAgICAgcmV0dXJuIG9mKGRlY29kZWRJZFRva2VuKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHJlbmV3VXNlckluZm9BZnRlclRva2VuUmVuZXcgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcblxuICAgIGlmICghaXNSZW5ld1Byb2Nlc3MgfHwgcmVuZXdVc2VySW5mb0FmdGVyVG9rZW5SZW5ldyB8fCAhaGF2ZVVzZXJEYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRVc2VyRGF0YU9pZGNGbG93QW5kU2F2ZShkZWNvZGVkSWRUb2tlbi5zdWIpLnBpcGUoXG4gICAgICAgIHN3aXRjaE1hcCgodXNlckRhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1JlY2VpdmVkIHVzZXIgZGF0YScsIHVzZXJEYXRhKTtcbiAgICAgICAgICBpZiAoISF1c2VyRGF0YSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhY2Nlc3NUb2tlbicsIGFjY2Vzc1Rva2VuKTtcbiAgICAgICAgICAgIHJldHVybiBvZih1c2VyRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdubyB1c2VyIGRhdGEsIHJlcXVlc3QgZmFpbGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2YoZXhpc3RpbmdVc2VyRGF0YUZyb21TdG9yYWdlKTtcbiAgfVxuXG4gIGdldFVzZXJEYXRhRnJvbVN0b3JlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCd1c2VyRGF0YScpIHx8IG51bGw7XG4gIH1cblxuICBwdWJsaXNoVXNlckRhdGFJZkV4aXN0cygpIHtcbiAgICBjb25zdCB1c2VyRGF0YSA9IHRoaXMuZ2V0VXNlckRhdGFGcm9tU3RvcmUoKTtcbiAgICBpZiAodXNlckRhdGEpIHtcbiAgICAgIHRoaXMudXNlckRhdGFJbnRlcm5hbCQubmV4dCh1c2VyRGF0YSk7XG4gICAgICB0aGlzLmV2ZW50U2VydmljZS5maXJlRXZlbnQoRXZlbnRUeXBlcy5Vc2VyRGF0YUNoYW5nZWQsIHVzZXJEYXRhKTtcbiAgICB9XG4gIH1cblxuICBzZXRVc2VyRGF0YVRvU3RvcmUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgndXNlckRhdGEnLCB2YWx1ZSk7XG4gICAgdGhpcy51c2VyRGF0YUludGVybmFsJC5uZXh0KHZhbHVlKTtcbiAgICB0aGlzLmV2ZW50U2VydmljZS5maXJlRXZlbnQoRXZlbnRUeXBlcy5Vc2VyRGF0YUNoYW5nZWQsIHZhbHVlKTtcbiAgfVxuXG4gIHJlc2V0VXNlckRhdGFJblN0b3JlKCk6IHZvaWQge1xuICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZW1vdmUoJ3VzZXJEYXRhJyk7XG4gICAgdGhpcy5ldmVudFNlcnZpY2UuZmlyZUV2ZW50KEV2ZW50VHlwZXMuVXNlckRhdGFDaGFuZ2VkLCBudWxsKTtcbiAgICB0aGlzLnVzZXJEYXRhSW50ZXJuYWwkLm5leHQobnVsbCk7XG4gIH1cblxuICBwcml2YXRlIGdldFVzZXJEYXRhT2lkY0Zsb3dBbmRTYXZlKGlkVG9rZW5TdWI6IGFueSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SWRlbnRpdHlVc2VyRGF0YSgpLnBpcGUoXG4gICAgICBtYXAoKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBpZiAodGhpcy52YWxpZGF0ZVVzZXJEYXRhU3ViSWRUb2tlbihpZFRva2VuU3ViLCBkYXRhPy5zdWIpKSB7XG4gICAgICAgICAgdGhpcy5zZXRVc2VyRGF0YVRvU3RvcmUoZGF0YSk7XG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmcsIHVzZXJkYXRhIHN1YiBkb2VzIG5vdCBtYXRjaCB0aGF0IGZyb20gaWRfdG9rZW5cbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aG9yaXplZENhbGxiYWNrLCBVc2VyIGRhdGEgc3ViIGRvZXMgbm90IG1hdGNoIHN1YiBpbiBpZF90b2tlbicpO1xuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnYXV0aG9yaXplZENhbGxiYWNrLCB0b2tlbihzKSB2YWxpZGF0aW9uIGZhaWxlZCwgcmVzZXR0aW5nJyk7XG4gICAgICAgICAgdGhpcy5yZXNldFVzZXJEYXRhSW5TdG9yZSgpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGdldElkZW50aXR5VXNlckRhdGEoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpO1xuXG4gICAgY29uc3QgYXV0aFdlbGxLbm93bkVuZFBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG5cbiAgICBpZiAoIWF1dGhXZWxsS25vd25FbmRQb2ludHMpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpbml0IGNoZWNrIHNlc3Npb246IGF1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkJyk7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyaW5mb0VuZHBvaW50ID0gYXV0aFdlbGxLbm93bkVuZFBvaW50cy51c2VyaW5mb0VuZHBvaW50O1xuXG4gICAgaWYgKCF1c2VyaW5mb0VuZHBvaW50KSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoXG4gICAgICAgICdpbml0IGNoZWNrIHNlc3Npb246IGF1dGhXZWxsS25vd25FbmRwb2ludHMudXNlcmluZm9fZW5kcG9pbnQgaXMgdW5kZWZpbmVkOyBzZXQgYXV0b191c2VyaW5mbyA9IGZhbHNlIGluIGNvbmZpZydcbiAgICAgICk7XG4gICAgICAvLyBUT0RPOiBIRVJFXG4gICAgICAvLyBCaXNvZ25hIG1vZGlmaWNhcmUgaWwgcGF0aCBlIGZhciBpbnRlcnZlbmlyZSBwcm94eVxuICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKCdsb2NhbGhvc3QnKSkge1xuICAgICAgICBsZXQgbXlBcnJheSA9IHVzZXJpbmZvRW5kcG9pbnQuc3BsaXQoJy8nKTtcbiAgICAgICAgbXlBcnJheS5zcGxpY2UoMCwgMyk7XG4gICAgICAgIGxldCBwYXRoTW9kaWZpZWQgPSBteUFycmF5LmpvaW4oJy8nKTtcbiAgICAgICAgY29uc29sZS5sb2cobXlBcnJheS5qb2luKCcvJykpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNEYXRhU2VydmljZS5nZXQocGF0aE1vZGlmaWVkLCB0b2tlbikucGlwZShyZXRyeSgyKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cy51c2VyaW5mb19lbmRwb2ludCBpcyB1bmRlZmluZWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vaWRjRGF0YVNlcnZpY2UuZ2V0KHVzZXJpbmZvRW5kcG9pbnQsIHRva2VuKS5waXBlKHJldHJ5KDIpKTtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVVc2VyRGF0YVN1YklkVG9rZW4oaWRUb2tlblN1YjogYW55LCB1c2VyZGF0YVN1YjogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKCFpZFRva2VuU3ViKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF1c2VyZGF0YVN1Yikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICgoaWRUb2tlblN1YiBhcyBzdHJpbmcpICE9PSAodXNlcmRhdGFTdWIgYXMgc3RyaW5nKSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCd2YWxpZGF0ZVVzZXJEYXRhU3ViSWRUb2tlbiBmYWlsZWQnLCBpZFRva2VuU3ViLCB1c2VyZGF0YVN1Yik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiJdfQ==