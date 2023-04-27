import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { EventTypes } from '../public-events/event-types';
import * as i0 from "@angular/core";
import * as i1 from "../storage/storage-persistence.service";
import * as i2 from "../logging/logger.service";
import * as i3 from "../public-events/public-events.service";
import * as i4 from "../config/config.provider";
import * as i5 from "../validation/token-validation.service";
export class AuthStateService {
    constructor(storagePersistenceService, loggerService, publicEventsService, configurationProvider, tokenValidationService) {
        this.storagePersistenceService = storagePersistenceService;
        this.loggerService = loggerService;
        this.publicEventsService = publicEventsService;
        this.configurationProvider = configurationProvider;
        this.tokenValidationService = tokenValidationService;
        this.authorizedInternal$ = new BehaviorSubject(false);
    }
    get authorized$() {
        return this.authorizedInternal$.asObservable().pipe(distinctUntilChanged());
    }
    get isAuthorized() {
        return !!this.storagePersistenceService.getAccessToken() && !!this.storagePersistenceService.getIdToken();
    }
    setAuthorizedAndFireEvent() {
        this.authorizedInternal$.next(true);
    }
    setUnauthorizedAndFireEvent() {
        this.storagePersistenceService.resetAuthStateInStorage();
        this.authorizedInternal$.next(false);
    }
    updateAndPublishAuthState(authorizationResult) {
        this.publicEventsService.fireEvent(EventTypes.NewAuthorizationResult, authorizationResult);
    }
    setAuthorizationData(accessToken, authResult) {
        this.loggerService.logDebug(accessToken);
        this.loggerService.logDebug('storing the accessToken');
        this.storagePersistenceService.write('authzData', accessToken);
        this.persistAccessTokenExpirationTime(authResult);
        this.setAuthorizedAndFireEvent();
    }
    getAccessToken() {
        if (!this.isAuthorized) {
            return '';
        }
        const token = this.storagePersistenceService.getAccessToken();
        return this.decodeURIComponentSafely(token);
    }
    getIdToken() {
        if (!this.isAuthorized) {
            return '';
        }
        const token = this.storagePersistenceService.getIdToken();
        return this.decodeURIComponentSafely(token);
    }
    getRefreshToken() {
        if (!this.isAuthorized) {
            return '';
        }
        const token = this.storagePersistenceService.getRefreshToken();
        return this.decodeURIComponentSafely(token);
    }
    areAuthStorageTokensValid() {
        if (!this.isAuthorized) {
            return false;
        }
        if (this.hasIdTokenExpired()) {
            this.loggerService.logDebug('persisted id_token is expired');
            return false;
        }
        if (this.hasAccessTokenExpiredIfExpiryExists()) {
            this.loggerService.logDebug('persisted access_token is expired');
            return false;
        }
        this.loggerService.logDebug('persisted id_token and access token are valid');
        return true;
    }
    hasIdTokenExpired() {
        const tokenToCheck = this.storagePersistenceService.getIdToken();
        const { renewTimeBeforeTokenExpiresInSeconds } = this.configurationProvider.getOpenIDConfiguration();
        const idTokenExpired = this.tokenValidationService.hasIdTokenExpired(tokenToCheck, renewTimeBeforeTokenExpiresInSeconds);
        if (idTokenExpired) {
            this.publicEventsService.fireEvent(EventTypes.IdTokenExpired, idTokenExpired);
        }
        return idTokenExpired;
    }
    hasAccessTokenExpiredIfExpiryExists() {
        const { renewTimeBeforeTokenExpiresInSeconds } = this.configurationProvider.getOpenIDConfiguration();
        const accessTokenExpiresIn = this.storagePersistenceService.read('access_token_expires_at');
        const accessTokenHasNotExpired = this.tokenValidationService.validateAccessTokenNotExpired(accessTokenExpiresIn, renewTimeBeforeTokenExpiresInSeconds);
        const hasExpired = !accessTokenHasNotExpired;
        if (hasExpired) {
            this.publicEventsService.fireEvent(EventTypes.TokenExpired, hasExpired);
        }
        return hasExpired;
    }
    decodeURIComponentSafely(token) {
        if (token) {
            return decodeURIComponent(token);
        }
        else {
            return '';
        }
    }
    persistAccessTokenExpirationTime(authResult) {
        if (authResult === null || authResult === void 0 ? void 0 : authResult.expires_in) {
            const accessTokenExpiryTime = new Date(new Date().toUTCString()).valueOf() + authResult.expires_in * 1000;
            this.storagePersistenceService.write('access_token_expires_at', accessTokenExpiryTime);
        }
    }
}
AuthStateService.ɵfac = function AuthStateService_Factory(t) { return new (t || AuthStateService)(i0.ɵɵinject(i1.StoragePersistenceService), i0.ɵɵinject(i2.LoggerService), i0.ɵɵinject(i3.PublicEventsService), i0.ɵɵinject(i4.ConfigurationProvider), i0.ɵɵinject(i5.TokenValidationService)); };
AuthStateService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthStateService, factory: AuthStateService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AuthStateService, [{
        type: Injectable
    }], function () { return [{ type: i1.StoragePersistenceService }, { type: i2.LoggerService }, { type: i3.PublicEventsService }, { type: i4.ConfigurationProvider }, { type: i5.TokenValidationService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1zdGF0ZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvYXV0aFN0YXRlL2F1dGgtc3RhdGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdkMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHdEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDhCQUE4QixDQUFDOzs7Ozs7O0FBTzFELE1BQU0sT0FBTyxnQkFBZ0I7SUFXM0IsWUFDVSx5QkFBb0QsRUFDcEQsYUFBNEIsRUFDNUIsbUJBQXdDLEVBQ3hDLHFCQUE0QyxFQUM1QyxzQkFBOEM7UUFKOUMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUNwRCxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQWZoRCx3QkFBbUIsR0FBRyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztJQWdCL0QsQ0FBQztJQWRKLElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELElBQVksWUFBWTtRQUN0QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUM1RyxDQUFDO0lB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O1NBQ3hGO0lBQ0gsQ0FBQzs7Z0ZBbElVLGdCQUFnQjt3REFBaEIsZ0JBQWdCLFdBQWhCLGdCQUFnQjtrREFBaEIsZ0JBQWdCO2NBRDVCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFdmVudFR5cGVzIH0gZnJvbSAnLi4vcHVibGljLWV2ZW50cy9ldmVudC10eXBlcyc7XG5pbXBvcnQgeyBQdWJsaWNFdmVudHNTZXJ2aWNlIH0gZnJvbSAnLi4vcHVibGljLWV2ZW50cy9wdWJsaWMtZXZlbnRzLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4uL3N0b3JhZ2Uvc3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcbmltcG9ydCB7IFRva2VuVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi92YWxpZGF0aW9uL3Rva2VuLXZhbGlkYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBBdXRob3JpemF0aW9uUmVzdWx0IH0gZnJvbSAnLi9hdXRob3JpemF0aW9uLXJlc3VsdCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBdXRoU3RhdGVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBhdXRob3JpemVkSW50ZXJuYWwkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG5cbiAgZ2V0IGF1dGhvcml6ZWQkKCkge1xuICAgIHJldHVybiB0aGlzLmF1dGhvcml6ZWRJbnRlcm5hbCQuYXNPYnNlcnZhYmxlKCkucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGlzQXV0aG9yaXplZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UuZ2V0QWNjZXNzVG9rZW4oKSAmJiAhIXRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5nZXRJZFRva2VuKCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2U6IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcHVibGljRXZlbnRzU2VydmljZTogUHVibGljRXZlbnRzU2VydmljZSxcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuICAgIHByaXZhdGUgdG9rZW5WYWxpZGF0aW9uU2VydmljZTogVG9rZW5WYWxpZGF0aW9uU2VydmljZVxuICApIHt9XG5cbiAgc2V0QXV0aG9yaXplZEFuZEZpcmVFdmVudCgpOiB2b2lkIHtcbiAgICB0aGlzLmF1dGhvcml6ZWRJbnRlcm5hbCQubmV4dCh0cnVlKTtcbiAgfVxuXG4gIHNldFVuYXV0aG9yaXplZEFuZEZpcmVFdmVudCgpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVzZXRBdXRoU3RhdGVJblN0b3JhZ2UoKTtcbiAgICB0aGlzLmF1dGhvcml6ZWRJbnRlcm5hbCQubmV4dChmYWxzZSk7XG4gIH1cblxuICB1cGRhdGVBbmRQdWJsaXNoQXV0aFN0YXRlKGF1dGhvcml6YXRpb25SZXN1bHQ6IEF1dGhvcml6YXRpb25SZXN1bHQpIHtcbiAgICB0aGlzLnB1YmxpY0V2ZW50c1NlcnZpY2UuZmlyZUV2ZW50PEF1dGhvcml6YXRpb25SZXN1bHQ+KEV2ZW50VHlwZXMuTmV3QXV0aG9yaXphdGlvblJlc3VsdCwgYXV0aG9yaXphdGlvblJlc3VsdCk7XG4gIH1cblxuICBzZXRBdXRob3JpemF0aW9uRGF0YShhY2Nlc3NUb2tlbjogYW55LCBhdXRoUmVzdWx0OiBhbnkpIHtcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYWNjZXNzVG9rZW4pO1xuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnc3RvcmluZyB0aGUgYWNjZXNzVG9rZW4nKTtcblxuICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnYXV0aHpEYXRhJywgYWNjZXNzVG9rZW4pO1xuICAgIHRoaXMucGVyc2lzdEFjY2Vzc1Rva2VuRXhwaXJhdGlvblRpbWUoYXV0aFJlc3VsdCk7XG4gICAgdGhpcy5zZXRBdXRob3JpemVkQW5kRmlyZUV2ZW50KCk7XG4gIH1cblxuICBnZXRBY2Nlc3NUb2tlbigpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5pc0F1dGhvcml6ZWQpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpO1xuICAgIHJldHVybiB0aGlzLmRlY29kZVVSSUNvbXBvbmVudFNhZmVseSh0b2tlbik7XG4gIH1cblxuICBnZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmlzQXV0aG9yaXplZCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLmdldElkVG9rZW4oKTtcbiAgICByZXR1cm4gdGhpcy5kZWNvZGVVUklDb21wb25lbnRTYWZlbHkodG9rZW4pO1xuICB9XG5cbiAgZ2V0UmVmcmVzaFRva2VuKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmlzQXV0aG9yaXplZCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLmdldFJlZnJlc2hUb2tlbigpO1xuICAgIHJldHVybiB0aGlzLmRlY29kZVVSSUNvbXBvbmVudFNhZmVseSh0b2tlbik7XG4gIH1cblxuICBhcmVBdXRoU3RvcmFnZVRva2Vuc1ZhbGlkKCkge1xuICAgIGlmICghdGhpcy5pc0F1dGhvcml6ZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNJZFRva2VuRXhwaXJlZCgpKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3BlcnNpc3RlZCBpZF90b2tlbiBpcyBleHBpcmVkJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzQWNjZXNzVG9rZW5FeHBpcmVkSWZFeHBpcnlFeGlzdHMoKSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdwZXJzaXN0ZWQgYWNjZXNzX3Rva2VuIGlzIGV4cGlyZWQnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3BlcnNpc3RlZCBpZF90b2tlbiBhbmQgYWNjZXNzIHRva2VuIGFyZSB2YWxpZCcpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaGFzSWRUb2tlbkV4cGlyZWQoKSB7XG4gICAgY29uc3QgdG9rZW5Ub0NoZWNrID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLmdldElkVG9rZW4oKTtcbiAgICBjb25zdCB7IHJlbmV3VGltZUJlZm9yZVRva2VuRXhwaXJlc0luU2Vjb25kcyB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgY29uc3QgaWRUb2tlbkV4cGlyZWQgPSB0aGlzLnRva2VuVmFsaWRhdGlvblNlcnZpY2UuaGFzSWRUb2tlbkV4cGlyZWQodG9rZW5Ub0NoZWNrLCByZW5ld1RpbWVCZWZvcmVUb2tlbkV4cGlyZXNJblNlY29uZHMpO1xuXG4gICAgaWYgKGlkVG9rZW5FeHBpcmVkKSB7XG4gICAgICB0aGlzLnB1YmxpY0V2ZW50c1NlcnZpY2UuZmlyZUV2ZW50PGJvb2xlYW4+KEV2ZW50VHlwZXMuSWRUb2tlbkV4cGlyZWQsIGlkVG9rZW5FeHBpcmVkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaWRUb2tlbkV4cGlyZWQ7XG4gIH1cblxuICBoYXNBY2Nlc3NUb2tlbkV4cGlyZWRJZkV4cGlyeUV4aXN0cygpIHtcbiAgICBjb25zdCB7IHJlbmV3VGltZUJlZm9yZVRva2VuRXhwaXJlc0luU2Vjb25kcyB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuRXhwaXJlc0luID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2FjY2Vzc190b2tlbl9leHBpcmVzX2F0Jyk7XG4gICAgY29uc3QgYWNjZXNzVG9rZW5IYXNOb3RFeHBpcmVkID0gdGhpcy50b2tlblZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlQWNjZXNzVG9rZW5Ob3RFeHBpcmVkKFxuICAgICAgYWNjZXNzVG9rZW5FeHBpcmVzSW4sXG4gICAgICByZW5ld1RpbWVCZWZvcmVUb2tlbkV4cGlyZXNJblNlY29uZHNcbiAgICApO1xuXG4gICAgY29uc3QgaGFzRXhwaXJlZCA9ICFhY2Nlc3NUb2tlbkhhc05vdEV4cGlyZWQ7XG5cbiAgICBpZiAoaGFzRXhwaXJlZCkge1xuICAgICAgdGhpcy5wdWJsaWNFdmVudHNTZXJ2aWNlLmZpcmVFdmVudDxib29sZWFuPihFdmVudFR5cGVzLlRva2VuRXhwaXJlZCwgaGFzRXhwaXJlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhc0V4cGlyZWQ7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZVVSSUNvbXBvbmVudFNhZmVseSh0b2tlbjogc3RyaW5nKSB7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHRva2VuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGVyc2lzdEFjY2Vzc1Rva2VuRXhwaXJhdGlvblRpbWUoYXV0aFJlc3VsdDogYW55KSB7XG4gICAgaWYgKGF1dGhSZXN1bHQ/LmV4cGlyZXNfaW4pIHtcbiAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuRXhwaXJ5VGltZSA9IG5ldyBEYXRlKG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSkudmFsdWVPZigpICsgYXV0aFJlc3VsdC5leHBpcmVzX2luICogMTAwMDtcbiAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnYWNjZXNzX3Rva2VuX2V4cGlyZXNfYXQnLCBhY2Nlc3NUb2tlbkV4cGlyeVRpbWUpO1xuICAgIH1cbiAgfVxufVxuIl19