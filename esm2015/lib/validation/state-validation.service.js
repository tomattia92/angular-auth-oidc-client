import { Injectable } from '@angular/core';
import { StateValidationResult } from './state-validation-result';
import { ValidationResult } from './validation-result';
import * as i0 from "@angular/core";
import * as i1 from "../storage/storage-persistence.service";
import * as i2 from "./token-validation.service";
import * as i3 from "../utils/tokenHelper/oidc-token-helper.service";
import * as i4 from "../logging/logger.service";
import * as i5 from "../config/config.provider";
import * as i6 from "../utils/equality/equality.service";
import * as i7 from "../utils/flowHelper/flow-helper.service";
export class StateValidationService {
    constructor(storagePersistenceService, tokenValidationService, tokenHelperService, loggerService, configurationProvider, equalityService, flowHelper) {
        this.storagePersistenceService = storagePersistenceService;
        this.tokenValidationService = tokenValidationService;
        this.tokenHelperService = tokenHelperService;
        this.loggerService = loggerService;
        this.configurationProvider = configurationProvider;
        this.equalityService = equalityService;
        this.flowHelper = flowHelper;
    }
    getValidatedStateResult(callbackContext) {
        if (!callbackContext) {
            return new StateValidationResult('', '', false, {});
        }
        if (callbackContext.authResult.error) {
            return new StateValidationResult('', '', false, {});
        }
        return this.validateState(callbackContext);
    }
    validateState(callbackContext) {
        const toReturn = new StateValidationResult();
        const authStateControl = this.storagePersistenceService.read('authStateControl');
        if (!this.tokenValidationService.validateStateFromHashCallback(callbackContext.authResult.state, authStateControl)) {
            this.loggerService.logWarning('authorizedCallback incorrect state');
            toReturn.state = ValidationResult.StatesDoNotMatch;
            this.handleUnsuccessfulValidation();
            return toReturn;
        }
        const isCurrentFlowImplicitFlowWithAccessToken = this.flowHelper.isCurrentFlowImplicitFlowWithAccessToken();
        const isCurrentFlowCodeFlow = this.flowHelper.isCurrentFlowCodeFlow();
        if (isCurrentFlowImplicitFlowWithAccessToken || isCurrentFlowCodeFlow) {
            toReturn.accessToken = callbackContext.authResult.access_token;
        }
        if (callbackContext.authResult.id_token) {
            const { clientId, issValidationOff, maxIdTokenIatOffsetAllowedInSeconds, disableIatOffsetValidation, ignoreNonceAfterRefresh, } = this.configurationProvider.getOpenIDConfiguration();
            toReturn.idToken = callbackContext.authResult.id_token;
            toReturn.decodedIdToken = this.tokenHelperService.getPayloadFromToken(toReturn.idToken, false);
            if (!this.tokenValidationService.validateSignatureIdToken(toReturn.idToken, callbackContext.jwtKeys)) {
                this.loggerService.logDebug('authorizedCallback Signature validation failed id_token');
                toReturn.state = ValidationResult.SignatureFailed;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            const authNonce = this.storagePersistenceService.read('authNonce');
            if (!this.tokenValidationService.validateIdTokenNonce(toReturn.decodedIdToken, authNonce, ignoreNonceAfterRefresh)) {
                this.loggerService.logWarning('authorizedCallback incorrect nonce');
                toReturn.state = ValidationResult.IncorrectNonce;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.tokenValidationService.validateRequiredIdToken(toReturn.decodedIdToken)) {
                this.loggerService.logDebug('authorizedCallback Validation, one of the REQUIRED properties missing from id_token');
                toReturn.state = ValidationResult.RequiredPropertyMissing;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.tokenValidationService.validateIdTokenIatMaxOffset(toReturn.decodedIdToken, maxIdTokenIatOffsetAllowedInSeconds, disableIatOffsetValidation)) {
                this.loggerService.logWarning('authorizedCallback Validation, iat rejected id_token was issued too far away from the current time');
                toReturn.state = ValidationResult.MaxOffsetExpired;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (authWellKnownEndPoints) {
                if (issValidationOff) {
                    this.loggerService.logDebug('iss validation is turned off, this is not recommended!');
                }
                else if (!issValidationOff &&
                    !this.tokenValidationService.validateIdTokenIss(toReturn.decodedIdToken, authWellKnownEndPoints.issuer)) {
                    this.loggerService.logWarning('authorizedCallback incorrect iss does not match authWellKnownEndpoints issuer');
                    toReturn.state = ValidationResult.IssDoesNotMatchIssuer;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
            }
            else {
                this.loggerService.logWarning('authWellKnownEndpoints is undefined');
                toReturn.state = ValidationResult.NoAuthWellKnownEndPoints;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.tokenValidationService.validateIdTokenAud(toReturn.decodedIdToken, clientId)) {
                this.loggerService.logWarning('authorizedCallback incorrect aud');
                toReturn.state = ValidationResult.IncorrectAud;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.tokenValidationService.validateIdTokenAzpExistsIfMoreThanOneAud(toReturn.decodedIdToken)) {
                this.loggerService.logWarning('authorizedCallback missing azp');
                toReturn.state = ValidationResult.IncorrectAzp;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.tokenValidationService.validateIdTokenAzpValid(toReturn.decodedIdToken, clientId)) {
                this.loggerService.logWarning('authorizedCallback incorrect azp');
                toReturn.state = ValidationResult.IncorrectAzp;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.isIdTokenAfterRefreshTokenRequestValid(callbackContext, toReturn.decodedIdToken)) {
                this.loggerService.logWarning('authorizedCallback pre, post id_token claims do not match in refresh');
                toReturn.state = ValidationResult.IncorrectIdTokenClaimsAfterRefresh;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.tokenValidationService.validateIdTokenExpNotExpired(toReturn.decodedIdToken)) {
                this.loggerService.logWarning('authorizedCallback id token expired');
                toReturn.state = ValidationResult.TokenExpired;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
        }
        else {
            this.loggerService.logDebug('No id_token found, skipping id_token validation');
        }
        // flow id_token
        if (!isCurrentFlowImplicitFlowWithAccessToken && !isCurrentFlowCodeFlow) {
            toReturn.authResponseIsValid = true;
            toReturn.state = ValidationResult.Ok;
            this.handleSuccessfulValidation();
            this.handleUnsuccessfulValidation();
            return toReturn;
        }
        // only do check if id_token returned, no always the case when using refresh tokens
        if (callbackContext.authResult.id_token) {
            const idTokenHeader = this.tokenHelperService.getHeaderFromToken(toReturn.idToken, false);
            // The at_hash is optional for the code flow
            if (isCurrentFlowCodeFlow && !toReturn.decodedIdToken.at_hash) {
                this.loggerService.logDebug('Code Flow active, and no at_hash in the id_token, skipping check!');
            }
            else if (!this.tokenValidationService.validateIdTokenAtHash(toReturn.accessToken, toReturn.decodedIdToken.at_hash, idTokenHeader.alg // 'RSA256'
            ) ||
                !toReturn.accessToken) {
                this.loggerService.logWarning('authorizedCallback incorrect at_hash');
                toReturn.state = ValidationResult.IncorrectAtHash;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
        }
        toReturn.authResponseIsValid = true;
        toReturn.state = ValidationResult.Ok;
        this.handleSuccessfulValidation();
        return toReturn;
    }
    isIdTokenAfterRefreshTokenRequestValid(callbackContext, newIdToken) {
        const { useRefreshToken, disableRefreshIdTokenAuthTimeValidation } = this.configurationProvider.getOpenIDConfiguration();
        if (!useRefreshToken) {
            return true;
        }
        if (!callbackContext.existingIdToken) {
            return true;
        }
        const decodedIdToken = this.tokenHelperService.getPayloadFromToken(callbackContext.existingIdToken, false);
        // Upon successful validation of the Refresh Token, the response body is the Token Response of Section 3.1.3.3
        // except that it might not contain an id_token.
        // If an ID Token is returned as a result of a token refresh request, the following requirements apply:
        // its iss Claim Value MUST be the same as in the ID Token issued when the original authentication occurred,
        if (decodedIdToken.iss !== newIdToken.iss) {
            this.loggerService.logDebug(`iss do not match: ${decodedIdToken.iss} ${newIdToken.iss}`);
            return false;
        }
        // its azp Claim Value MUST be the same as in the ID Token issued when the original authentication occurred;
        //   if no azp Claim was present in the original ID Token, one MUST NOT be present in the new ID Token, and
        // otherwise, the same rules apply as apply when issuing an ID Token at the time of the original authentication.
        if (decodedIdToken.azp !== newIdToken.azp) {
            this.loggerService.logDebug(`azp do not match: ${decodedIdToken.azp} ${newIdToken.azp}`);
            return false;
        }
        // its sub Claim Value MUST be the same as in the ID Token issued when the original authentication occurred,
        if (decodedIdToken.sub !== newIdToken.sub) {
            this.loggerService.logDebug(`sub do not match: ${decodedIdToken.sub} ${newIdToken.sub}`);
            return false;
        }
        // its aud Claim Value MUST be the same as in the ID Token issued when the original authentication occurred,
        if (!this.equalityService.isStringEqualOrNonOrderedArrayEqual(decodedIdToken === null || decodedIdToken === void 0 ? void 0 : decodedIdToken.aud, newIdToken === null || newIdToken === void 0 ? void 0 : newIdToken.aud)) {
            this.loggerService.logDebug(`aud in new id_token is not valid: '${decodedIdToken === null || decodedIdToken === void 0 ? void 0 : decodedIdToken.aud}' '${newIdToken.aud}'`);
            return false;
        }
        if (disableRefreshIdTokenAuthTimeValidation) {
            return true;
        }
        // its iat Claim MUST represent the time that the new ID Token is issued,
        // if the ID Token contains an auth_time Claim, its value MUST represent the time of the original authentication
        // - not the time that the new ID token is issued,
        if (decodedIdToken.auth_time !== newIdToken.auth_time) {
            this.loggerService.logDebug(`auth_time do not match: ${decodedIdToken.auth_time} ${newIdToken.auth_time}`);
            return false;
        }
        return true;
    }
    handleSuccessfulValidation() {
        const { autoCleanStateAfterAuthentication } = this.configurationProvider.getOpenIDConfiguration();
        this.storagePersistenceService.write('authNonce', '');
        if (autoCleanStateAfterAuthentication) {
            this.storagePersistenceService.write('authStateControl', '');
        }
        this.loggerService.logDebug('AuthorizedCallback token(s) validated, continue');
    }
    handleUnsuccessfulValidation() {
        const { autoCleanStateAfterAuthentication } = this.configurationProvider.getOpenIDConfiguration();
        this.storagePersistenceService.write('authNonce', '');
        if (autoCleanStateAfterAuthentication) {
            this.storagePersistenceService.write('authStateControl', '');
        }
        this.loggerService.logDebug('AuthorizedCallback token(s) invalid');
    }
}
StateValidationService.ɵfac = function StateValidationService_Factory(t) { return new (t || StateValidationService)(i0.ɵɵinject(i1.StoragePersistenceService), i0.ɵɵinject(i2.TokenValidationService), i0.ɵɵinject(i3.TokenHelperService), i0.ɵɵinject(i4.LoggerService), i0.ɵɵinject(i5.ConfigurationProvider), i0.ɵɵinject(i6.EqualityService), i0.ɵɵinject(i7.FlowHelper)); };
StateValidationService.ɵprov = i0.ɵɵdefineInjectable({ token: StateValidationService, factory: StateValidationService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(StateValidationService, [{
        type: Injectable
    }], function () { return [{ type: i1.StoragePersistenceService }, { type: i2.TokenValidationService }, { type: i3.TokenHelperService }, { type: i4.LoggerService }, { type: i5.ConfigurationProvider }, { type: i6.EqualityService }, { type: i7.FlowHelper }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtdmFsaWRhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvdmFsaWRhdGlvbi9zdGF0ZS12YWxpZGF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVEzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVsRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7Ozs7O0FBR3ZELE1BQU0sT0FBTyxzQkFBc0I7SUFDakMsWUFDVSx5QkFBb0QsRUFDcEQsc0JBQThDLEVBQzlDLGtCQUFzQyxFQUN0QyxhQUE0QixFQUM1QixxQkFBNEMsRUFDNUMsZUFBZ0MsRUFDaEMsVUFBc0I7UUFOdEIsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUNwRCwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUM3QixDQUFDO0lBRUosdUJBQXVCLENBQUMsZUFBZ0M7UUFDdEQsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUNwQixPQUFPLElBQUkscUJBQXFCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDckQ7UUFFRCxJQUFJLGVBQWUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFO1lBQ3BDLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLENB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dGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcbmltcG9ydCB7IENhbGxiYWNrQ29udGV4dCB9IGZyb20gJy4uL2Zsb3dzL2NhbGxiYWNrLWNvbnRleHQnO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4uL3N0b3JhZ2Uvc3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcbmltcG9ydCB7IEVxdWFsaXR5U2VydmljZSB9IGZyb20gJy4uL3V0aWxzL2VxdWFsaXR5L2VxdWFsaXR5LnNlcnZpY2UnO1xuaW1wb3J0IHsgRmxvd0hlbHBlciB9IGZyb20gJy4uL3V0aWxzL2Zsb3dIZWxwZXIvZmxvdy1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBUb2tlbkhlbHBlclNlcnZpY2UgfSBmcm9tICcuLi91dGlscy90b2tlbkhlbHBlci9vaWRjLXRva2VuLWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRlVmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJy4vc3RhdGUtdmFsaWRhdGlvbi1yZXN1bHQnO1xuaW1wb3J0IHsgVG9rZW5WYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4vdG9rZW4tdmFsaWRhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IFZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICcuL3ZhbGlkYXRpb24tcmVzdWx0JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0YXRlVmFsaWRhdGlvblNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2U6IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSB0b2tlblZhbGlkYXRpb25TZXJ2aWNlOiBUb2tlblZhbGlkYXRpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgdG9rZW5IZWxwZXJTZXJ2aWNlOiBUb2tlbkhlbHBlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIsXG4gICAgcHJpdmF0ZSBlcXVhbGl0eVNlcnZpY2U6IEVxdWFsaXR5U2VydmljZSxcbiAgICBwcml2YXRlIGZsb3dIZWxwZXI6IEZsb3dIZWxwZXJcbiAgKSB7fVxuXG4gIGdldFZhbGlkYXRlZFN0YXRlUmVzdWx0KGNhbGxiYWNrQ29udGV4dDogQ2FsbGJhY2tDb250ZXh0KTogU3RhdGVWYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNhbGxiYWNrQ29udGV4dCkge1xuICAgICAgcmV0dXJuIG5ldyBTdGF0ZVZhbGlkYXRpb25SZXN1bHQoJycsICcnLCBmYWxzZSwge30pO1xuICAgIH1cblxuICAgIGlmIChjYWxsYmFja0NvbnRleHQuYXV0aFJlc3VsdC5lcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBTdGF0ZVZhbGlkYXRpb25SZXN1bHQoJycsICcnLCBmYWxzZSwge30pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnZhbGlkYXRlU3RhdGUoY2FsbGJhY2tDb250ZXh0KTtcbiAgfVxuXG4gIHZhbGlkYXRlU3RhdGUoY2FsbGJhY2tDb250ZXh0KTogU3RhdGVWYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBjb25zdCB0b1JldHVybiA9IG5ldyBTdGF0ZVZhbGlkYXRpb25SZXN1bHQoKTtcbiAgICBjb25zdCBhdXRoU3RhdGVDb250cm9sID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhTdGF0ZUNvbnRyb2wnKTtcblxuICAgIGlmICghdGhpcy50b2tlblZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlU3RhdGVGcm9tSGFzaENhbGxiYWNrKGNhbGxiYWNrQ29udGV4dC5hdXRoUmVzdWx0LnN0YXRlLCBhdXRoU3RhdGVDb250cm9sKSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2F1dGhvcml6ZWRDYWxsYmFjayBpbmNvcnJlY3Qgc3RhdGUnKTtcbiAgICAgIHRvUmV0dXJuLnN0YXRlID0gVmFsaWRhdGlvblJlc3VsdC5TdGF0ZXNEb05vdE1hdGNoO1xuICAgICAgdGhpcy5oYW5kbGVVbnN1Y2Nlc3NmdWxWYWxpZGF0aW9uKCk7XG4gICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNDdXJyZW50Rmxvd0ltcGxpY2l0Rmxvd1dpdGhBY2Nlc3NUb2tlbiA9IHRoaXMuZmxvd0hlbHBlci5pc0N1cnJlbnRGbG93SW1wbGljaXRGbG93V2l0aEFjY2Vzc1Rva2VuKCk7XG4gICAgY29uc3QgaXNDdXJyZW50Rmxvd0NvZGVGbG93ID0gdGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dDb2RlRmxvdygpO1xuXG4gICAgaWYgKGlzQ3VycmVudEZsb3dJbXBsaWNpdEZsb3dXaXRoQWNjZXNzVG9rZW4gfHwgaXNDdXJyZW50Rmxvd0NvZGVGbG93KSB7XG4gICAgICB0b1JldHVybi5hY2Nlc3NUb2tlbiA9IGNhbGxiYWNrQ29udGV4dC5hdXRoUmVzdWx0LmFjY2Vzc190b2tlbjtcbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2tDb250ZXh0LmF1dGhSZXN1bHQuaWRfdG9rZW4pIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY2xpZW50SWQsXG4gICAgICAgIGlzc1ZhbGlkYXRpb25PZmYsXG4gICAgICAgIG1heElkVG9rZW5JYXRPZmZzZXRBbGxvd2VkSW5TZWNvbmRzLFxuICAgICAgICBkaXNhYmxlSWF0T2Zmc2V0VmFsaWRhdGlvbixcbiAgICAgICAgaWdub3JlTm9uY2VBZnRlclJlZnJlc2gsXG4gICAgICB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICB0b1JldHVybi5pZFRva2VuID0gY2FsbGJhY2tDb250ZXh0LmF1dGhSZXN1bHQuaWRfdG9rZW47XG5cbiAgICAgIHRvUmV0dXJuLmRlY29kZWRJZFRva2VuID0gdGhpcy50b2tlbkhlbHBlclNlcnZpY2UuZ2V0UGF5bG9hZEZyb21Ub2tlbih0b1JldHVybi5pZFRva2VuLCBmYWxzZSk7XG5cbiAgICAgIGlmICghdGhpcy50b2tlblZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlU2lnbmF0dXJlSWRUb2tlbih0b1JldHVybi5pZFRva2VuLCBjYWxsYmFja0NvbnRleHQuand0S2V5cykpIHtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhdXRob3JpemVkQ2FsbGJhY2sgU2lnbmF0dXJlIHZhbGlkYXRpb24gZmFpbGVkIGlkX3Rva2VuJyk7XG4gICAgICAgIHRvUmV0dXJuLnN0YXRlID0gVmFsaWRhdGlvblJlc3VsdC5TaWduYXR1cmVGYWlsZWQ7XG4gICAgICAgIHRoaXMuaGFuZGxlVW5zdWNjZXNzZnVsVmFsaWRhdGlvbigpO1xuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGF1dGhOb25jZSA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoTm9uY2UnKTtcblxuICAgICAgaWYgKCF0aGlzLnRva2VuVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVJZFRva2VuTm9uY2UodG9SZXR1cm4uZGVjb2RlZElkVG9rZW4sIGF1dGhOb25jZSwgaWdub3JlTm9uY2VBZnRlclJlZnJlc2gpKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRob3JpemVkQ2FsbGJhY2sgaW5jb3JyZWN0IG5vbmNlJyk7XG4gICAgICAgIHRvUmV0dXJuLnN0YXRlID0gVmFsaWRhdGlvblJlc3VsdC5JbmNvcnJlY3ROb25jZTtcbiAgICAgICAgdGhpcy5oYW5kbGVVbnN1Y2Nlc3NmdWxWYWxpZGF0aW9uKCk7XG4gICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnRva2VuVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVSZXF1aXJlZElkVG9rZW4odG9SZXR1cm4uZGVjb2RlZElkVG9rZW4pKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnYXV0aG9yaXplZENhbGxiYWNrIFZhbGlkYXRpb24sIG9uZSBvZiB0aGUgUkVRVUlSRUQgcHJvcGVydGllcyBtaXNzaW5nIGZyb20gaWRfdG9rZW4nKTtcbiAgICAgICAgdG9SZXR1cm4uc3RhdGUgPSBWYWxpZGF0aW9uUmVzdWx0LlJlcXVpcmVkUHJvcGVydHlNaXNzaW5nO1xuICAgICAgICB0aGlzLmhhbmRsZVVuc3VjY2Vzc2Z1bFZhbGlkYXRpb24oKTtcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLnRva2VuVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVJZFRva2VuSWF0TWF4T2Zmc2V0KFxuICAgICAgICAgIHRvUmV0dXJuLmRlY29kZWRJZFRva2VuLFxuICAgICAgICAgIG1heElkVG9rZW5JYXRPZmZzZXRBbGxvd2VkSW5TZWNvbmRzLFxuICAgICAgICAgIGRpc2FibGVJYXRPZmZzZXRWYWxpZGF0aW9uXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aG9yaXplZENhbGxiYWNrIFZhbGlkYXRpb24sIGlhdCByZWplY3RlZCBpZF90b2tlbiB3YXMgaXNzdWVkIHRvbyBmYXIgYXdheSBmcm9tIHRoZSBjdXJyZW50IHRpbWUnKTtcbiAgICAgICAgdG9SZXR1cm4uc3RhdGUgPSBWYWxpZGF0aW9uUmVzdWx0Lk1heE9mZnNldEV4cGlyZWQ7XG4gICAgICAgIHRoaXMuaGFuZGxlVW5zdWNjZXNzZnVsVmFsaWRhdGlvbigpO1xuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGF1dGhXZWxsS25vd25FbmRQb2ludHMgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycpO1xuXG4gICAgICBpZiAoYXV0aFdlbGxLbm93bkVuZFBvaW50cykge1xuICAgICAgICBpZiAoaXNzVmFsaWRhdGlvbk9mZikge1xuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnaXNzIHZhbGlkYXRpb24gaXMgdHVybmVkIG9mZiwgdGhpcyBpcyBub3QgcmVjb21tZW5kZWQhJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgIWlzc1ZhbGlkYXRpb25PZmYgJiZcbiAgICAgICAgICAhdGhpcy50b2tlblZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlSWRUb2tlbklzcyh0b1JldHVybi5kZWNvZGVkSWRUb2tlbiwgYXV0aFdlbGxLbm93bkVuZFBvaW50cy5pc3N1ZXIpXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRob3JpemVkQ2FsbGJhY2sgaW5jb3JyZWN0IGlzcyBkb2VzIG5vdCBtYXRjaCBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzc3VlcicpO1xuICAgICAgICAgIHRvUmV0dXJuLnN0YXRlID0gVmFsaWRhdGlvblJlc3VsdC5Jc3NEb2VzTm90TWF0Y2hJc3N1ZXI7XG4gICAgICAgICAgdGhpcy5oYW5kbGVVbnN1Y2Nlc3NmdWxWYWxpZGF0aW9uKCk7XG4gICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgdG9SZXR1cm4uc3RhdGUgPSBWYWxpZGF0aW9uUmVzdWx0Lk5vQXV0aFdlbGxLbm93bkVuZFBvaW50cztcbiAgICAgICAgdGhpcy5oYW5kbGVVbnN1Y2Nlc3NmdWxWYWxpZGF0aW9uKCk7XG4gICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnRva2VuVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVJZFRva2VuQXVkKHRvUmV0dXJuLmRlY29kZWRJZFRva2VuLCBjbGllbnRJZCkpIHtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2F1dGhvcml6ZWRDYWxsYmFjayBpbmNvcnJlY3QgYXVkJyk7XG4gICAgICAgIHRvUmV0dXJuLnN0YXRlID0gVmFsaWRhdGlvblJlc3VsdC5JbmNvcnJlY3RBdWQ7XG4gICAgICAgIHRoaXMuaGFuZGxlVW5zdWNjZXNzZnVsVmFsaWRhdGlvbigpO1xuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy50b2tlblZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlSWRUb2tlbkF6cEV4aXN0c0lmTW9yZVRoYW5PbmVBdWQodG9SZXR1cm4uZGVjb2RlZElkVG9rZW4pKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRob3JpemVkQ2FsbGJhY2sgbWlzc2luZyBhenAnKTtcbiAgICAgICAgdG9SZXR1cm4uc3RhdGUgPSBWYWxpZGF0aW9uUmVzdWx0LkluY29ycmVjdEF6cDtcbiAgICAgICAgdGhpcy5oYW5kbGVVbnN1Y2Nlc3NmdWxWYWxpZGF0aW9uKCk7XG4gICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnRva2VuVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVJZFRva2VuQXpwVmFsaWQodG9SZXR1cm4uZGVjb2RlZElkVG9rZW4sIGNsaWVudElkKSkge1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aG9yaXplZENhbGxiYWNrIGluY29ycmVjdCBhenAnKTtcbiAgICAgICAgdG9SZXR1cm4uc3RhdGUgPSBWYWxpZGF0aW9uUmVzdWx0LkluY29ycmVjdEF6cDtcbiAgICAgICAgdGhpcy5oYW5kbGVVbnN1Y2Nlc3NmdWxWYWxpZGF0aW9uKCk7XG4gICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmlzSWRUb2tlbkFmdGVyUmVmcmVzaFRva2VuUmVxdWVzdFZhbGlkKGNhbGxiYWNrQ29udGV4dCwgdG9SZXR1cm4uZGVjb2RlZElkVG9rZW4pKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRob3JpemVkQ2FsbGJhY2sgcHJlLCBwb3N0IGlkX3Rva2VuIGNsYWltcyBkbyBub3QgbWF0Y2ggaW4gcmVmcmVzaCcpO1xuICAgICAgICB0b1JldHVybi5zdGF0ZSA9IFZhbGlkYXRpb25SZXN1bHQuSW5jb3JyZWN0SWRUb2tlbkNsYWltc0FmdGVyUmVmcmVzaDtcbiAgICAgICAgdGhpcy5oYW5kbGVVbnN1Y2Nlc3NmdWxWYWxpZGF0aW9uKCk7XG4gICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnRva2VuVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVJZFRva2VuRXhwTm90RXhwaXJlZCh0b1JldHVybi5kZWNvZGVkSWRUb2tlbikpIHtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2F1dGhvcml6ZWRDYWxsYmFjayBpZCB0b2tlbiBleHBpcmVkJyk7XG4gICAgICAgIHRvUmV0dXJuLnN0YXRlID0gVmFsaWRhdGlvblJlc3VsdC5Ub2tlbkV4cGlyZWQ7XG4gICAgICAgIHRoaXMuaGFuZGxlVW5zdWNjZXNzZnVsVmFsaWRhdGlvbigpO1xuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnTm8gaWRfdG9rZW4gZm91bmQsIHNraXBwaW5nIGlkX3Rva2VuIHZhbGlkYXRpb24nKTtcbiAgICB9XG5cbiAgICAvLyBmbG93IGlkX3Rva2VuXG4gICAgaWYgKCFpc0N1cnJlbnRGbG93SW1wbGljaXRGbG93V2l0aEFjY2Vzc1Rva2VuICYmICFpc0N1cnJlbnRGbG93Q29kZUZsb3cpIHtcbiAgICAgIHRvUmV0dXJuLmF1dGhSZXNwb25zZUlzVmFsaWQgPSB0cnVlO1xuICAgICAgdG9SZXR1cm4uc3RhdGUgPSBWYWxpZGF0aW9uUmVzdWx0Lk9rO1xuICAgICAgdGhpcy5oYW5kbGVTdWNjZXNzZnVsVmFsaWRhdGlvbigpO1xuICAgICAgdGhpcy5oYW5kbGVVbnN1Y2Nlc3NmdWxWYWxpZGF0aW9uKCk7XG4gICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgfVxuXG4gICAgLy8gb25seSBkbyBjaGVjayBpZiBpZF90b2tlbiByZXR1cm5lZCwgbm8gYWx3YXlzIHRoZSBjYXNlIHdoZW4gdXNpbmcgcmVmcmVzaCB0b2tlbnNcbiAgICBpZiAoY2FsbGJhY2tDb250ZXh0LmF1dGhSZXN1bHQuaWRfdG9rZW4pIHtcbiAgICAgIGNvbnN0IGlkVG9rZW5IZWFkZXIgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRIZWFkZXJGcm9tVG9rZW4odG9SZXR1cm4uaWRUb2tlbiwgZmFsc2UpO1xuXG4gICAgICAvLyBUaGUgYXRfaGFzaCBpcyBvcHRpb25hbCBmb3IgdGhlIGNvZGUgZmxvd1xuICAgICAgaWYgKGlzQ3VycmVudEZsb3dDb2RlRmxvdyAmJiAhKHRvUmV0dXJuLmRlY29kZWRJZFRva2VuLmF0X2hhc2ggYXMgc3RyaW5nKSkge1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0NvZGUgRmxvdyBhY3RpdmUsIGFuZCBubyBhdF9oYXNoIGluIHRoZSBpZF90b2tlbiwgc2tpcHBpbmcgY2hlY2shJyk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAhdGhpcy50b2tlblZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlSWRUb2tlbkF0SGFzaChcbiAgICAgICAgICB0b1JldHVybi5hY2Nlc3NUb2tlbixcbiAgICAgICAgICB0b1JldHVybi5kZWNvZGVkSWRUb2tlbi5hdF9oYXNoLFxuICAgICAgICAgIGlkVG9rZW5IZWFkZXIuYWxnIC8vICdSU0EyNTYnXG4gICAgICAgICkgfHxcbiAgICAgICAgIXRvUmV0dXJuLmFjY2Vzc1Rva2VuXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2F1dGhvcml6ZWRDYWxsYmFjayBpbmNvcnJlY3QgYXRfaGFzaCcpO1xuICAgICAgICB0b1JldHVybi5zdGF0ZSA9IFZhbGlkYXRpb25SZXN1bHQuSW5jb3JyZWN0QXRIYXNoO1xuICAgICAgICB0aGlzLmhhbmRsZVVuc3VjY2Vzc2Z1bFZhbGlkYXRpb24oKTtcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRvUmV0dXJuLmF1dGhSZXNwb25zZUlzVmFsaWQgPSB0cnVlO1xuICAgIHRvUmV0dXJuLnN0YXRlID0gVmFsaWRhdGlvblJlc3VsdC5PaztcbiAgICB0aGlzLmhhbmRsZVN1Y2Nlc3NmdWxWYWxpZGF0aW9uKCk7XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0lkVG9rZW5BZnRlclJlZnJlc2hUb2tlblJlcXVlc3RWYWxpZChjYWxsYmFja0NvbnRleHQ6IENhbGxiYWNrQ29udGV4dCwgbmV3SWRUb2tlbjogYW55KTogYm9vbGVhbiB7XG4gICAgY29uc3QgeyB1c2VSZWZyZXNoVG9rZW4sIGRpc2FibGVSZWZyZXNoSWRUb2tlbkF1dGhUaW1lVmFsaWRhdGlvbiB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuICAgIGlmICghdXNlUmVmcmVzaFRva2VuKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWNhbGxiYWNrQ29udGV4dC5leGlzdGluZ0lkVG9rZW4pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBkZWNvZGVkSWRUb2tlbiA9IHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldFBheWxvYWRGcm9tVG9rZW4oY2FsbGJhY2tDb250ZXh0LmV4aXN0aW5nSWRUb2tlbiwgZmFsc2UpO1xuXG4gICAgLy8gVXBvbiBzdWNjZXNzZnVsIHZhbGlkYXRpb24gb2YgdGhlIFJlZnJlc2ggVG9rZW4sIHRoZSByZXNwb25zZSBib2R5IGlzIHRoZSBUb2tlbiBSZXNwb25zZSBvZiBTZWN0aW9uIDMuMS4zLjNcbiAgICAvLyBleGNlcHQgdGhhdCBpdCBtaWdodCBub3QgY29udGFpbiBhbiBpZF90b2tlbi5cblxuICAgIC8vIElmIGFuIElEIFRva2VuIGlzIHJldHVybmVkIGFzIGEgcmVzdWx0IG9mIGEgdG9rZW4gcmVmcmVzaCByZXF1ZXN0LCB0aGUgZm9sbG93aW5nIHJlcXVpcmVtZW50cyBhcHBseTpcblxuICAgIC8vIGl0cyBpc3MgQ2xhaW0gVmFsdWUgTVVTVCBiZSB0aGUgc2FtZSBhcyBpbiB0aGUgSUQgVG9rZW4gaXNzdWVkIHdoZW4gdGhlIG9yaWdpbmFsIGF1dGhlbnRpY2F0aW9uIG9jY3VycmVkLFxuICAgIGlmIChkZWNvZGVkSWRUb2tlbi5pc3MgIT09IG5ld0lkVG9rZW4uaXNzKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYGlzcyBkbyBub3QgbWF0Y2g6ICR7ZGVjb2RlZElkVG9rZW4uaXNzfSAke25ld0lkVG9rZW4uaXNzfWApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBpdHMgYXpwIENsYWltIFZhbHVlIE1VU1QgYmUgdGhlIHNhbWUgYXMgaW4gdGhlIElEIFRva2VuIGlzc3VlZCB3aGVuIHRoZSBvcmlnaW5hbCBhdXRoZW50aWNhdGlvbiBvY2N1cnJlZDtcbiAgICAvLyAgIGlmIG5vIGF6cCBDbGFpbSB3YXMgcHJlc2VudCBpbiB0aGUgb3JpZ2luYWwgSUQgVG9rZW4sIG9uZSBNVVNUIE5PVCBiZSBwcmVzZW50IGluIHRoZSBuZXcgSUQgVG9rZW4sIGFuZFxuICAgIC8vIG90aGVyd2lzZSwgdGhlIHNhbWUgcnVsZXMgYXBwbHkgYXMgYXBwbHkgd2hlbiBpc3N1aW5nIGFuIElEIFRva2VuIGF0IHRoZSB0aW1lIG9mIHRoZSBvcmlnaW5hbCBhdXRoZW50aWNhdGlvbi5cbiAgICBpZiAoZGVjb2RlZElkVG9rZW4uYXpwICE9PSBuZXdJZFRva2VuLmF6cCkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGBhenAgZG8gbm90IG1hdGNoOiAke2RlY29kZWRJZFRva2VuLmF6cH0gJHtuZXdJZFRva2VuLmF6cH1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gaXRzIHN1YiBDbGFpbSBWYWx1ZSBNVVNUIGJlIHRoZSBzYW1lIGFzIGluIHRoZSBJRCBUb2tlbiBpc3N1ZWQgd2hlbiB0aGUgb3JpZ2luYWwgYXV0aGVudGljYXRpb24gb2NjdXJyZWQsXG4gICAgaWYgKGRlY29kZWRJZFRva2VuLnN1YiAhPT0gbmV3SWRUb2tlbi5zdWIpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhgc3ViIGRvIG5vdCBtYXRjaDogJHtkZWNvZGVkSWRUb2tlbi5zdWJ9ICR7bmV3SWRUb2tlbi5zdWJ9YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaXRzIGF1ZCBDbGFpbSBWYWx1ZSBNVVNUIGJlIHRoZSBzYW1lIGFzIGluIHRoZSBJRCBUb2tlbiBpc3N1ZWQgd2hlbiB0aGUgb3JpZ2luYWwgYXV0aGVudGljYXRpb24gb2NjdXJyZWQsXG4gICAgaWYgKCF0aGlzLmVxdWFsaXR5U2VydmljZS5pc1N0cmluZ0VxdWFsT3JOb25PcmRlcmVkQXJyYXlFcXVhbChkZWNvZGVkSWRUb2tlbj8uYXVkLCBuZXdJZFRva2VuPy5hdWQpKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYGF1ZCBpbiBuZXcgaWRfdG9rZW4gaXMgbm90IHZhbGlkOiAnJHtkZWNvZGVkSWRUb2tlbj8uYXVkfScgJyR7bmV3SWRUb2tlbi5hdWR9J2ApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChkaXNhYmxlUmVmcmVzaElkVG9rZW5BdXRoVGltZVZhbGlkYXRpb24pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGl0cyBpYXQgQ2xhaW0gTVVTVCByZXByZXNlbnQgdGhlIHRpbWUgdGhhdCB0aGUgbmV3IElEIFRva2VuIGlzIGlzc3VlZCxcbiAgICAvLyBpZiB0aGUgSUQgVG9rZW4gY29udGFpbnMgYW4gYXV0aF90aW1lIENsYWltLCBpdHMgdmFsdWUgTVVTVCByZXByZXNlbnQgdGhlIHRpbWUgb2YgdGhlIG9yaWdpbmFsIGF1dGhlbnRpY2F0aW9uXG4gICAgLy8gLSBub3QgdGhlIHRpbWUgdGhhdCB0aGUgbmV3IElEIHRva2VuIGlzIGlzc3VlZCxcbiAgICBpZiAoZGVjb2RlZElkVG9rZW4uYXV0aF90aW1lICE9PSBuZXdJZFRva2VuLmF1dGhfdGltZSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGBhdXRoX3RpbWUgZG8gbm90IG1hdGNoOiAke2RlY29kZWRJZFRva2VuLmF1dGhfdGltZX0gJHtuZXdJZFRva2VuLmF1dGhfdGltZX1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlU3VjY2Vzc2Z1bFZhbGlkYXRpb24oKTogdm9pZCB7XG4gICAgY29uc3QgeyBhdXRvQ2xlYW5TdGF0ZUFmdGVyQXV0aGVudGljYXRpb24gfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcbiAgICB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2Uud3JpdGUoJ2F1dGhOb25jZScsICcnKTtcblxuICAgIGlmIChhdXRvQ2xlYW5TdGF0ZUFmdGVyQXV0aGVudGljYXRpb24pIHtcbiAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnYXV0aFN0YXRlQ29udHJvbCcsICcnKTtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdBdXRob3JpemVkQ2FsbGJhY2sgdG9rZW4ocykgdmFsaWRhdGVkLCBjb250aW51ZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVVbnN1Y2Nlc3NmdWxWYWxpZGF0aW9uKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgYXV0b0NsZWFuU3RhdGVBZnRlckF1dGhlbnRpY2F0aW9uIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG4gICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLndyaXRlKCdhdXRoTm9uY2UnLCAnJyk7XG5cbiAgICBpZiAoYXV0b0NsZWFuU3RhdGVBZnRlckF1dGhlbnRpY2F0aW9uKSB7XG4gICAgICB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2Uud3JpdGUoJ2F1dGhTdGF0ZUNvbnRyb2wnLCAnJyk7XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnQXV0aG9yaXplZENhbGxiYWNrIHRva2VuKHMpIGludmFsaWQnKTtcbiAgfVxufVxuIl19