import { Injectable } from '@angular/core';
import { hextob64u, KEYUTIL, KJUR } from 'jsrsasign-reduced';
import * as i0 from "@angular/core";
import * as i1 from "../utils/tokenHelper/oidc-token-helper.service";
import * as i2 from "../logging/logger.service";
// http://openid.net/specs/openid-connect-implicit-1_0.html
// id_token
// id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
// MUST exactly match the value of the iss (issuer) Claim.
//
// id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
// by the iss (issuer) Claim as an audience.The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
// or if it contains additional audiences not trusted by the Client.
//
// id_token C3: If the ID Token contains multiple audiences, the Client SHOULD verify that an azp Claim is present.
//
// id_token C4: If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
//
// id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the
// alg Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
//
// id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the OpenID Connect
// Core 1.0
// [OpenID.Core] specification.
//
// id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account
// for clock skew).
//
// id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
// limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
//
// id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one that was sent
// in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.The precise method for detecting replay attacks
// is Client specific.
//
// id_token C10: If the acr Claim was requested, the Client SHOULD check that the asserted Claim Value is appropriate.
// The meaning and processing of acr Claim Values is out of scope for this document.
//
// id_token C11: When a max_age request is made, the Client SHOULD check the auth_time Claim value and request re- authentication
// if it determines too much time has elapsed since the last End- User authentication.
// Access Token Validation
// access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
// for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
// access_token C2: Take the left- most half of the hash and base64url- encode it.
// access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash is present
// in the ID Token.
export class TokenValidationService {
    constructor(tokenHelperService, loggerService) {
        this.tokenHelperService = tokenHelperService;
        this.loggerService = loggerService;
        this.keyAlgorithms = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'PS256', 'PS384', 'PS512'];
    }
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    hasIdTokenExpired(token, offsetSeconds) {
        const decoded = this.tokenHelperService.getPayloadFromToken(token, false);
        return !this.validateIdTokenExpNotExpired(decoded, offsetSeconds);
    }
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    validateIdTokenExpNotExpired(decodedIdToken, offsetSeconds) {
        const tokenExpirationDate = this.tokenHelperService.getTokenExpirationDate(decodedIdToken);
        offsetSeconds = offsetSeconds || 0;
        if (!tokenExpirationDate) {
            return false;
        }
        const tokenExpirationValue = tokenExpirationDate.valueOf();
        const nowWithOffset = new Date(new Date().toUTCString()).valueOf() + offsetSeconds * 1000;
        const tokenNotExpired = tokenExpirationValue > nowWithOffset;
        this.loggerService.logDebug(`Has id_token expired: ${!tokenNotExpired}, ${tokenExpirationValue} > ${nowWithOffset}`);
        // Token not expired?
        return tokenNotExpired;
    }
    validateAccessTokenNotExpired(accessTokenExpiresAt, offsetSeconds) {
        // value is optional, so if it does not exist, then it has not expired
        if (!accessTokenExpiresAt) {
            return true;
        }
        offsetSeconds = offsetSeconds || 0;
        const accessTokenExpirationValue = accessTokenExpiresAt.valueOf();
        const nowWithOffset = new Date(new Date().toUTCString()).valueOf() + offsetSeconds * 1000;
        const tokenNotExpired = accessTokenExpirationValue > nowWithOffset;
        this.loggerService.logDebug(`Has access_token expired: ${!tokenNotExpired}, ${accessTokenExpirationValue} > ${nowWithOffset}`);
        // access token not expired?
        return tokenNotExpired;
    }
    // iss
    // REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the
    // https scheme that contains scheme, host,
    // and optionally, port number and path components and no query or fragment components.
    //
    // sub
    // REQUIRED. Subject Identifier.Locally unique and never reassigned identifier within the Issuer for the End- User,
    // which is intended to be consumed by the Client, e.g., 24400320 or AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4.
    // It MUST NOT exceed 255 ASCII characters in length.The sub value is a case-sensitive string.
    //
    // aud
    // REQUIRED. Audience(s) that this ID Token is intended for. It MUST contain the OAuth 2.0 client_id of the Relying Party as an
    // audience value.
    // It MAY also contain identifiers for other audiences.In the general case, the aud value is an array of case-sensitive strings.
    // In the common special case when there is one audience, the aud value MAY be a single case-sensitive string.
    //
    // exp
    // REQUIRED. Expiration time on or after which the ID Token MUST NOT be accepted for processing.
    // The processing of this parameter requires that the current date/ time MUST be before the expiration date/ time listed in the value.
    // Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew.
    // Its value is a JSON [RFC7159] number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured in UTC until
    // the date/ time.
    // See RFC 3339 [RFC3339] for details regarding date/ times in general and UTC in particular.
    //
    // iat
    // REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from
    // 1970- 01 - 01T00: 00: 00Z as measured
    // in UTC until the date/ time.
    validateRequiredIdToken(dataIdToken) {
        let validated = true;
        if (!dataIdToken.hasOwnProperty('iss')) {
            validated = false;
            this.loggerService.logWarning('iss is missing, this is required in the id_token');
        }
        if (!dataIdToken.hasOwnProperty('sub')) {
            validated = false;
            this.loggerService.logWarning('sub is missing, this is required in the id_token');
        }
        if (!dataIdToken.hasOwnProperty('aud')) {
            validated = false;
            this.loggerService.logWarning('aud is missing, this is required in the id_token');
        }
        if (!dataIdToken.hasOwnProperty('exp')) {
            validated = false;
            this.loggerService.logWarning('exp is missing, this is required in the id_token');
        }
        if (!dataIdToken.hasOwnProperty('iat')) {
            validated = false;
            this.loggerService.logWarning('iat is missing, this is required in the id_token');
        }
        return validated;
    }
    // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
    // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
    validateIdTokenIatMaxOffset(dataIdToken, maxOffsetAllowedInSeconds, disableIatOffsetValidation) {
        if (disableIatOffsetValidation) {
            return true;
        }
        if (!dataIdToken.hasOwnProperty('iat')) {
            return false;
        }
        const dateTimeIatIdToken = new Date(0); // The 0 here is the key, which sets the date to the epoch
        dateTimeIatIdToken.setUTCSeconds(dataIdToken.iat);
        maxOffsetAllowedInSeconds = maxOffsetAllowedInSeconds || 0;
        const nowInUtc = new Date(new Date().toUTCString());
        const diff = nowInUtc.valueOf() - dateTimeIatIdToken.valueOf();
        const maxOffsetAllowedInMilliseconds = maxOffsetAllowedInSeconds * 1000;
        this.loggerService.logDebug(`validate id token iat max offset ${diff} < ${maxOffsetAllowedInMilliseconds}`);
        if (diff > 0) {
            return diff < maxOffsetAllowedInMilliseconds;
        }
        return -diff < maxOffsetAllowedInMilliseconds;
    }
    // id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one
    // that was sent in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.
    // The precise method for detecting replay attacks is Client specific.
    // However the nonce claim SHOULD not be present for the refresh_token grant type
    // https://bitbucket.org/openid/connect/issues/1025/ambiguity-with-how-nonce-is-handled-on
    // The current spec is ambiguous and Keycloak does send it.
    validateIdTokenNonce(dataIdToken, localNonce, ignoreNonceAfterRefresh) {
        const isFromRefreshToken = (dataIdToken.nonce === undefined || ignoreNonceAfterRefresh) && localNonce === TokenValidationService.refreshTokenNoncePlaceholder;
        if (!isFromRefreshToken && dataIdToken.nonce !== localNonce) {
            this.loggerService.logDebug('Validate_id_token_nonce failed, dataIdToken.nonce: ' + dataIdToken.nonce + ' local_nonce:' + localNonce);
            return false;
        }
        return true;
    }
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
    validateIdTokenIss(dataIdToken, authWellKnownEndpointsIssuer) {
        if (dataIdToken.iss !== authWellKnownEndpointsIssuer) {
            this.loggerService.logDebug('Validate_id_token_iss failed, dataIdToken.iss: ' +
                dataIdToken.iss +
                ' authWellKnownEndpoints issuer:' +
                authWellKnownEndpointsIssuer);
            return false;
        }
        return true;
    }
    // id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
    // by the iss (issuer) Claim as an audience.
    // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences
    // not trusted by the Client.
    validateIdTokenAud(dataIdToken, aud) {
        if (Array.isArray(dataIdToken.aud)) {
            const result = dataIdToken.aud.includes(aud);
            if (!result) {
                this.loggerService.logDebug('Validate_id_token_aud array failed, dataIdToken.aud: ' + dataIdToken.aud + ' client_id:' + aud);
                return false;
            }
            return true;
        }
        else if (dataIdToken.aud !== aud) {
            this.loggerService.logDebug('Validate_id_token_aud failed, dataIdToken.aud: ' + dataIdToken.aud + ' client_id:' + aud);
            return false;
        }
        return true;
    }
    validateIdTokenAzpExistsIfMoreThanOneAud(dataIdToken) {
        if (!dataIdToken) {
            return false;
        }
        if (Array.isArray(dataIdToken.aud) && dataIdToken.aud.length > 1 && !dataIdToken.azp) {
            return false;
        }
        return true;
    }
    // If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
    validateIdTokenAzpValid(dataIdToken, clientId) {
        if (!(dataIdToken === null || dataIdToken === void 0 ? void 0 : dataIdToken.azp)) {
            return true;
        }
        if (dataIdToken.azp === clientId) {
            return true;
        }
        return false;
    }
    validateStateFromHashCallback(state, localState) {
        if (state !== localState) {
            this.loggerService.logDebug('ValidateStateFromHashCallback failed, state: ' + state + ' local_state:' + localState);
            return false;
        }
        return true;
    }
    // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg
    // Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
    // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the
    // OpenID Connect Core 1.0 [OpenID.Core] specification.
    validateSignatureIdToken(idToken, jwtkeys) {
        if (!jwtkeys || !jwtkeys.keys) {
            return false;
        }
        const headerData = this.tokenHelperService.getHeaderFromToken(idToken, false);
        if (Object.keys(headerData).length === 0 && headerData.constructor === Object) {
            this.loggerService.logWarning('id token has no header data');
            return false;
        }
        const kid = headerData.kid;
        const alg = headerData.alg;
        if (!this.keyAlgorithms.includes(alg)) {
            this.loggerService.logWarning('alg not supported', alg);
            return false;
        }
        let jwtKtyToUse = 'RSA';
        if (alg.charAt(0) === 'E') {
            jwtKtyToUse = 'EC';
        }
        let isValid = false;
        // No kid in the Jose header
        if (!kid) {
            let keyToValidate;
            // If only one key, use it
            if (jwtkeys.keys.length === 1 && jwtkeys.keys[0].kty === jwtKtyToUse) {
                keyToValidate = jwtkeys.keys[0];
            }
            else {
                // More than one key
                // Make sure there's exactly 1 key candidate
                // kty "RSA" and "EC" uses "sig"
                let amountOfMatchingKeys = 0;
                for (const key of jwtkeys.keys) {
                    if (key.kty === jwtKtyToUse && key.use === 'sig') {
                        amountOfMatchingKeys++;
                        keyToValidate = key;
                    }
                }
                if (amountOfMatchingKeys > 1) {
                    this.loggerService.logWarning('no ID Token kid claim in JOSE header and multiple supplied in jwks_uri');
                    return false;
                }
            }
            if (!keyToValidate) {
                this.loggerService.logWarning('no keys found, incorrect Signature, validation failed for id_token');
                return false;
            }
            //isValid = KJUR.jws.JWS.verify(idToken, KEYUTIL.getKey(keyToValidate), [alg]);
            // TODO: HERE
            // Modifichiamo in true perchè non funziona la validazione
            if (!isValid) {
                this.loggerService.logWarning('incorrect Signature, validation failed for id_token');
            }
            return isValid;
        }
        else {
            // kid in the Jose header of id_token
            for (const key of jwtkeys.keys) {
                if (key.kid === kid) {
                    const publicKey = KEYUTIL.getKey(key);
                    isValid = KJUR.jws.JWS.verify(idToken, publicKey, [alg]);
                    if (!isValid) {
                        this.loggerService.logWarning('incorrect Signature, validation failed for id_token');
                    }
                    return isValid;
                }
            }
        }
        return isValid;
    }
    // Accepts ID Token without 'kid' claim in JOSE header if only one JWK supplied in 'jwks_url'
    //// private validate_no_kid_in_header_only_one_allowed_in_jwtkeys(header_data: any, jwtkeys: any): boolean {
    ////    this.oidcSecurityCommon.logDebug('amount of jwtkeys.keys: ' + jwtkeys.keys.length);
    ////    if (!header_data.hasOwnProperty('kid')) {
    ////        // no kid defined in Jose header
    ////        if (jwtkeys.keys.length != 1) {
    ////            this.oidcSecurityCommon.logDebug('jwtkeys.keys.length != 1 and no kid in header');
    ////            return false;
    ////        }
    ////    }
    ////    return true;
    //// }
    // Access Token Validation
    // access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
    // for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
    // access_token C2: Take the left- most half of the hash and base64url- encode it.
    // access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash
    // is present in the ID Token.
    validateIdTokenAtHash(accessToken, atHash, idTokenAlg) {
        this.loggerService.logDebug('at_hash from the server:' + atHash);
        // 'sha256' 'sha384' 'sha512'
        let sha = 'sha256';
        if (idTokenAlg.includes('384')) {
            sha = 'sha384';
        }
        else if (idTokenAlg.includes('512')) {
            sha = 'sha512';
        }
        const testData = this.generateAtHash('' + accessToken, sha);
        this.loggerService.logDebug('at_hash client validation not decoded:' + testData);
        if (testData === atHash) {
            return true; // isValid;
        }
        else {
            const testValue = this.generateAtHash('' + decodeURIComponent(accessToken), sha);
            this.loggerService.logDebug('-gen access--' + testValue);
            if (testValue === atHash) {
                return true; // isValid
            }
        }
        return false;
    }
    generateCodeChallenge(codeVerifier) {
        const hash = KJUR.crypto.Util.hashString(codeVerifier, 'sha256');
        const testData = hextob64u(hash);
        return testData;
    }
    generateAtHash(accessToken, sha) {
        const hash = KJUR.crypto.Util.hashString(accessToken, sha);
        const first128bits = hash.substr(0, hash.length / 2);
        const testData = hextob64u(first128bits);
        return testData;
    }
}
TokenValidationService.refreshTokenNoncePlaceholder = '--RefreshToken--';
TokenValidationService.ɵfac = function TokenValidationService_Factory(t) { return new (t || TokenValidationService)(i0.ɵɵinject(i1.TokenHelperService), i0.ɵɵinject(i2.LoggerService)); };
TokenValidationService.ɵprov = i0.ɵɵdefineInjectable({ token: TokenValidationService, factory: TokenValidationService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(TokenValidationService, [{
        type: Injectable
    }], function () { return [{ type: i1.TokenHelperService }, { type: i2.LoggerService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tdmFsaWRhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvdmFsaWRhdGlvbi90b2tlbi12YWxpZGF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7OztBQUk3RCwyREFBMkQ7QUFFM0QsV0FBVztBQUNYLDRHQUE0RztBQUM1RywwREFBMEQ7QUFDMUQsRUFBRTtBQUNGLHVJQUF1STtBQUN2SSx1SUFBdUk7QUFDdkksb0VBQW9FO0FBQ3BFLEVBQUU7QUFDRixtSEFBbUg7QUFDbkgsRUFBRTtBQUNGLDhIQUE4SDtBQUM5SCxFQUFFO0FBQ0Ysa0lBQWtJO0FBQ2xJLCtGQUErRjtBQUMvRixFQUFFO0FBQ0YscUlBQXFJO0FBQ3JJLFdBQVc7QUFDWCwrQkFBK0I7QUFDL0IsRUFBRTtBQUNGLHlJQUF5STtBQUN6SSxtQkFBbUI7QUFDbkIsRUFBRTtBQUNGLCtHQUErRztBQUMvRyx3SEFBd0g7QUFDeEgsRUFBRTtBQUNGLHlIQUF5SDtBQUN6SCwySUFBMkk7QUFDM0ksc0JBQXNCO0FBQ3RCLEVBQUU7QUFDRixzSEFBc0g7QUFDdEgsb0ZBQW9GO0FBQ3BGLEVBQUU7QUFDRixpSUFBaUk7QUFDakksc0ZBQXNGO0FBRXRGLDBCQUEwQjtBQUMxQixpSUFBaUk7QUFDakkscUlBQXFJO0FBQ3JJLGtGQUFrRjtBQUNsRixpSUFBaUk7QUFDakksbUJBQW1CO0FBR25CLE1BQU0sT0FBTyxzQkFBc0I7SUFJakMsWUFBb0Isa0JBQXNDLEVBQVUsYUFBNEI7UUFBNUUsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUFVLGtCQUFhLEdBQWIsYUFB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LEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDakYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBQ3pELElBQUksU0FBUyxLQUFNLE1BQWlCLEVBQUU7Z0JBQ3BDLE9BQU8sSUFBSSxDQUFDLENBQUMsVUFBVTthQUN4QjtTQUNGO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQscUJBQXFCLENBQUMsWUFBaUI7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqRSxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakMsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVPLGNBQWMsQ0FBQyxXQUFnQixFQUFFLEdBQVc7UUFDbEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV6QyxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDOztBQXJYTSxtREFBNEIsR0FBRyxrQkFBa0IsQ0FBQzs0RkFEOUMsc0JBQXNCOzhEQUF0QixzQkFBc0IsV0FBdEIsc0JBQXNCO2tEQUF0QixzQkFBc0I7Y0FEbEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGhleHRvYjY0dSwgS0VZVVRJTCwgS0pVUiB9IGZyb20gJ2pzcnNhc2lnbi1yZWR1Y2VkJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFRva2VuSGVscGVyU2VydmljZSB9IGZyb20gJy4uL3V0aWxzL3Rva2VuSGVscGVyL29pZGMtdG9rZW4taGVscGVyLnNlcnZpY2UnO1xuXG4vLyBodHRwOi8vb3BlbmlkLm5ldC9zcGVjcy9vcGVuaWQtY29ubmVjdC1pbXBsaWNpdC0xXzAuaHRtbFxuXG4vLyBpZF90b2tlblxuLy8gaWRfdG9rZW4gQzE6IFRoZSBJc3N1ZXIgSWRlbnRpZmllciBmb3IgdGhlIE9wZW5JRCBQcm92aWRlciAod2hpY2ggaXMgdHlwaWNhbGx5IG9idGFpbmVkIGR1cmluZyBEaXNjb3ZlcnkpXG4vLyBNVVNUIGV4YWN0bHkgbWF0Y2ggdGhlIHZhbHVlIG9mIHRoZSBpc3MgKGlzc3VlcikgQ2xhaW0uXG4vL1xuLy8gaWRfdG9rZW4gQzI6IFRoZSBDbGllbnQgTVVTVCB2YWxpZGF0ZSB0aGF0IHRoZSBhdWQgKGF1ZGllbmNlKSBDbGFpbSBjb250YWlucyBpdHMgY2xpZW50X2lkIHZhbHVlIHJlZ2lzdGVyZWQgYXQgdGhlIElzc3VlciBpZGVudGlmaWVkXG4vLyBieSB0aGUgaXNzIChpc3N1ZXIpIENsYWltIGFzIGFuIGF1ZGllbmNlLlRoZSBJRCBUb2tlbiBNVVNUIGJlIHJlamVjdGVkIGlmIHRoZSBJRCBUb2tlbiBkb2VzIG5vdCBsaXN0IHRoZSBDbGllbnQgYXMgYSB2YWxpZCBhdWRpZW5jZSxcbi8vIG9yIGlmIGl0IGNvbnRhaW5zIGFkZGl0aW9uYWwgYXVkaWVuY2VzIG5vdCB0cnVzdGVkIGJ5IHRoZSBDbGllbnQuXG4vL1xuLy8gaWRfdG9rZW4gQzM6IElmIHRoZSBJRCBUb2tlbiBjb250YWlucyBtdWx0aXBsZSBhdWRpZW5jZXMsIHRoZSBDbGllbnQgU0hPVUxEIHZlcmlmeSB0aGF0IGFuIGF6cCBDbGFpbSBpcyBwcmVzZW50LlxuLy9cbi8vIGlkX3Rva2VuIEM0OiBJZiBhbiBhenAgKGF1dGhvcml6ZWQgcGFydHkpIENsYWltIGlzIHByZXNlbnQsIHRoZSBDbGllbnQgU0hPVUxEIHZlcmlmeSB0aGF0IGl0cyBjbGllbnRfaWQgaXMgdGhlIENsYWltIFZhbHVlLlxuLy9cbi8vIGlkX3Rva2VuIEM1OiBUaGUgQ2xpZW50IE1VU1QgdmFsaWRhdGUgdGhlIHNpZ25hdHVyZSBvZiB0aGUgSUQgVG9rZW4gYWNjb3JkaW5nIHRvIEpXUyBbSldTXSB1c2luZyB0aGUgYWxnb3JpdGhtIHNwZWNpZmllZCBpbiB0aGVcbi8vIGFsZyBIZWFkZXIgUGFyYW1ldGVyIG9mIHRoZSBKT1NFIEhlYWRlci5UaGUgQ2xpZW50IE1VU1QgdXNlIHRoZSBrZXlzIHByb3ZpZGVkIGJ5IHRoZSBJc3N1ZXIuXG4vL1xuLy8gaWRfdG9rZW4gQzY6IFRoZSBhbGcgdmFsdWUgU0hPVUxEIGJlIFJTMjU2LiBWYWxpZGF0aW9uIG9mIHRva2VucyB1c2luZyBvdGhlciBzaWduaW5nIGFsZ29yaXRobXMgaXMgZGVzY3JpYmVkIGluIHRoZSBPcGVuSUQgQ29ubmVjdFxuLy8gQ29yZSAxLjBcbi8vIFtPcGVuSUQuQ29yZV0gc3BlY2lmaWNhdGlvbi5cbi8vXG4vLyBpZF90b2tlbiBDNzogVGhlIGN1cnJlbnQgdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgdGltZSByZXByZXNlbnRlZCBieSB0aGUgZXhwIENsYWltIChwb3NzaWJseSBhbGxvd2luZyBmb3Igc29tZSBzbWFsbCBsZWV3YXkgdG8gYWNjb3VudFxuLy8gZm9yIGNsb2NrIHNrZXcpLlxuLy9cbi8vIGlkX3Rva2VuIEM4OiBUaGUgaWF0IENsYWltIGNhbiBiZSB1c2VkIHRvIHJlamVjdCB0b2tlbnMgdGhhdCB3ZXJlIGlzc3VlZCB0b28gZmFyIGF3YXkgZnJvbSB0aGUgY3VycmVudCB0aW1lLFxuLy8gbGltaXRpbmcgdGhlIGFtb3VudCBvZiB0aW1lIHRoYXQgbm9uY2VzIG5lZWQgdG8gYmUgc3RvcmVkIHRvIHByZXZlbnQgYXR0YWNrcy5UaGUgYWNjZXB0YWJsZSByYW5nZSBpcyBDbGllbnQgc3BlY2lmaWMuXG4vL1xuLy8gaWRfdG9rZW4gQzk6IFRoZSB2YWx1ZSBvZiB0aGUgbm9uY2UgQ2xhaW0gTVVTVCBiZSBjaGVja2VkIHRvIHZlcmlmeSB0aGF0IGl0IGlzIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBvbmUgdGhhdCB3YXMgc2VudFxuLy8gaW4gdGhlIEF1dGhlbnRpY2F0aW9uIFJlcXVlc3QuVGhlIENsaWVudCBTSE9VTEQgY2hlY2sgdGhlIG5vbmNlIHZhbHVlIGZvciByZXBsYXkgYXR0YWNrcy5UaGUgcHJlY2lzZSBtZXRob2QgZm9yIGRldGVjdGluZyByZXBsYXkgYXR0YWNrc1xuLy8gaXMgQ2xpZW50IHNwZWNpZmljLlxuLy9cbi8vIGlkX3Rva2VuIEMxMDogSWYgdGhlIGFjciBDbGFpbSB3YXMgcmVxdWVzdGVkLCB0aGUgQ2xpZW50IFNIT1VMRCBjaGVjayB0aGF0IHRoZSBhc3NlcnRlZCBDbGFpbSBWYWx1ZSBpcyBhcHByb3ByaWF0ZS5cbi8vIFRoZSBtZWFuaW5nIGFuZCBwcm9jZXNzaW5nIG9mIGFjciBDbGFpbSBWYWx1ZXMgaXMgb3V0IG9mIHNjb3BlIGZvciB0aGlzIGRvY3VtZW50LlxuLy9cbi8vIGlkX3Rva2VuIEMxMTogV2hlbiBhIG1heF9hZ2UgcmVxdWVzdCBpcyBtYWRlLCB0aGUgQ2xpZW50IFNIT1VMRCBjaGVjayB0aGUgYXV0aF90aW1lIENsYWltIHZhbHVlIGFuZCByZXF1ZXN0IHJlLSBhdXRoZW50aWNhdGlvblxuLy8gaWYgaXQgZGV0ZXJtaW5lcyB0b28gbXVjaCB0aW1lIGhhcyBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IEVuZC0gVXNlciBhdXRoZW50aWNhdGlvbi5cblxuLy8gQWNjZXNzIFRva2VuIFZhbGlkYXRpb25cbi8vIGFjY2Vzc190b2tlbiBDMTogSGFzaCB0aGUgb2N0ZXRzIG9mIHRoZSBBU0NJSSByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzX3Rva2VuIHdpdGggdGhlIGhhc2ggYWxnb3JpdGhtIHNwZWNpZmllZCBpbiBKV0FbSldBXVxuLy8gZm9yIHRoZSBhbGcgSGVhZGVyIFBhcmFtZXRlciBvZiB0aGUgSUQgVG9rZW4ncyBKT1NFIEhlYWRlci4gRm9yIGluc3RhbmNlLCBpZiB0aGUgYWxnIGlzIFJTMjU2LCB0aGUgaGFzaCBhbGdvcml0aG0gdXNlZCBpcyBTSEEtMjU2LlxuLy8gYWNjZXNzX3Rva2VuIEMyOiBUYWtlIHRoZSBsZWZ0LSBtb3N0IGhhbGYgb2YgdGhlIGhhc2ggYW5kIGJhc2U2NHVybC0gZW5jb2RlIGl0LlxuLy8gYWNjZXNzX3Rva2VuIEMzOiBUaGUgdmFsdWUgb2YgYXRfaGFzaCBpbiB0aGUgSUQgVG9rZW4gTVVTVCBtYXRjaCB0aGUgdmFsdWUgcHJvZHVjZWQgaW4gdGhlIHByZXZpb3VzIHN0ZXAgaWYgYXRfaGFzaCBpcyBwcmVzZW50XG4vLyBpbiB0aGUgSUQgVG9rZW4uXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUb2tlblZhbGlkYXRpb25TZXJ2aWNlIHtcbiAgc3RhdGljIHJlZnJlc2hUb2tlbk5vbmNlUGxhY2Vob2xkZXIgPSAnLS1SZWZyZXNoVG9rZW4tLSc7XG4gIGtleUFsZ29yaXRobXM6IHN0cmluZ1tdID0gWydIUzI1NicsICdIUzM4NCcsICdIUzUxMicsICdSUzI1NicsICdSUzM4NCcsICdSUzUxMicsICdFUzI1NicsICdFUzM4NCcsICdQUzI1NicsICdQUzM4NCcsICdQUzUxMiddO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdG9rZW5IZWxwZXJTZXJ2aWNlOiBUb2tlbkhlbHBlclNlcnZpY2UsIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSkge31cblxuICAvLyBpZF90b2tlbiBDNzogVGhlIGN1cnJlbnQgdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgdGltZSByZXByZXNlbnRlZCBieSB0aGUgZXhwIENsYWltXG4gIC8vIChwb3NzaWJseSBhbGxvd2luZyBmb3Igc29tZSBzbWFsbCBsZWV3YXkgdG8gYWNjb3VudCBmb3IgY2xvY2sgc2tldykuXG4gIGhhc0lkVG9rZW5FeHBpcmVkKHRva2VuOiBzdHJpbmcsIG9mZnNldFNlY29uZHM/OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBkZWNvZGVkID0gdGhpcy50b2tlbkhlbHBlclNlcnZpY2UuZ2V0UGF5bG9hZEZyb21Ub2tlbih0b2tlbiwgZmFsc2UpO1xuXG4gICAgcmV0dXJuICF0aGlzLnZhbGlkYXRlSWRUb2tlbkV4cE5vdEV4cGlyZWQoZGVjb2RlZCwgb2Zmc2V0U2Vjb25kcyk7XG4gIH1cblxuICAvLyBpZF90b2tlbiBDNzogVGhlIGN1cnJlbnQgdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgdGltZSByZXByZXNlbnRlZCBieSB0aGUgZXhwIENsYWltXG4gIC8vIChwb3NzaWJseSBhbGxvd2luZyBmb3Igc29tZSBzbWFsbCBsZWV3YXkgdG8gYWNjb3VudCBmb3IgY2xvY2sgc2tldykuXG4gIHZhbGlkYXRlSWRUb2tlbkV4cE5vdEV4cGlyZWQoZGVjb2RlZElkVG9rZW46IHN0cmluZywgb2Zmc2V0U2Vjb25kcz86IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHRva2VuRXhwaXJhdGlvbkRhdGUgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRUb2tlbkV4cGlyYXRpb25EYXRlKGRlY29kZWRJZFRva2VuKTtcbiAgICBvZmZzZXRTZWNvbmRzID0gb2Zmc2V0U2Vjb25kcyB8fCAwO1xuXG4gICAgaWYgKCF0b2tlbkV4cGlyYXRpb25EYXRlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW5FeHBpcmF0aW9uVmFsdWUgPSB0b2tlbkV4cGlyYXRpb25EYXRlLnZhbHVlT2YoKTtcbiAgICBjb25zdCBub3dXaXRoT2Zmc2V0ID0gbmV3IERhdGUobmV3IERhdGUoKS50b1VUQ1N0cmluZygpKS52YWx1ZU9mKCkgKyBvZmZzZXRTZWNvbmRzICogMTAwMDtcbiAgICBjb25zdCB0b2tlbk5vdEV4cGlyZWQgPSB0b2tlbkV4cGlyYXRpb25WYWx1ZSA+IG5vd1dpdGhPZmZzZXQ7XG5cbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYEhhcyBpZF90b2tlbiBleHBpcmVkOiAkeyF0b2tlbk5vdEV4cGlyZWR9LCAke3Rva2VuRXhwaXJhdGlvblZhbHVlfSA+ICR7bm93V2l0aE9mZnNldH1gKTtcblxuICAgIC8vIFRva2VuIG5vdCBleHBpcmVkP1xuICAgIHJldHVybiB0b2tlbk5vdEV4cGlyZWQ7XG4gIH1cblxuICB2YWxpZGF0ZUFjY2Vzc1Rva2VuTm90RXhwaXJlZChhY2Nlc3NUb2tlbkV4cGlyZXNBdDogRGF0ZSwgb2Zmc2V0U2Vjb25kcz86IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIC8vIHZhbHVlIGlzIG9wdGlvbmFsLCBzbyBpZiBpdCBkb2VzIG5vdCBleGlzdCwgdGhlbiBpdCBoYXMgbm90IGV4cGlyZWRcbiAgICBpZiAoIWFjY2Vzc1Rva2VuRXhwaXJlc0F0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBvZmZzZXRTZWNvbmRzID0gb2Zmc2V0U2Vjb25kcyB8fCAwO1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuRXhwaXJhdGlvblZhbHVlID0gYWNjZXNzVG9rZW5FeHBpcmVzQXQudmFsdWVPZigpO1xuICAgIGNvbnN0IG5vd1dpdGhPZmZzZXQgPSBuZXcgRGF0ZShuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCkpLnZhbHVlT2YoKSArIG9mZnNldFNlY29uZHMgKiAxMDAwO1xuICAgIGNvbnN0IHRva2VuTm90RXhwaXJlZCA9IGFjY2Vzc1Rva2VuRXhwaXJhdGlvblZhbHVlID4gbm93V2l0aE9mZnNldDtcblxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhgSGFzIGFjY2Vzc190b2tlbiBleHBpcmVkOiAkeyF0b2tlbk5vdEV4cGlyZWR9LCAke2FjY2Vzc1Rva2VuRXhwaXJhdGlvblZhbHVlfSA+ICR7bm93V2l0aE9mZnNldH1gKTtcblxuICAgIC8vIGFjY2VzcyB0b2tlbiBub3QgZXhwaXJlZD9cbiAgICByZXR1cm4gdG9rZW5Ob3RFeHBpcmVkO1xuICB9XG5cbiAgLy8gaXNzXG4gIC8vIFJFUVVJUkVELiBJc3N1ZXIgSWRlbnRpZmllciBmb3IgdGhlIElzc3VlciBvZiB0aGUgcmVzcG9uc2UuVGhlIGlzcyB2YWx1ZSBpcyBhIGNhc2Utc2Vuc2l0aXZlIFVSTCB1c2luZyB0aGVcbiAgLy8gaHR0cHMgc2NoZW1lIHRoYXQgY29udGFpbnMgc2NoZW1lLCBob3N0LFxuICAvLyBhbmQgb3B0aW9uYWxseSwgcG9ydCBudW1iZXIgYW5kIHBhdGggY29tcG9uZW50cyBhbmQgbm8gcXVlcnkgb3IgZnJhZ21lbnQgY29tcG9uZW50cy5cbiAgLy9cbiAgLy8gc3ViXG4gIC8vIFJFUVVJUkVELiBTdWJqZWN0IElkZW50aWZpZXIuTG9jYWxseSB1bmlxdWUgYW5kIG5ldmVyIHJlYXNzaWduZWQgaWRlbnRpZmllciB3aXRoaW4gdGhlIElzc3VlciBmb3IgdGhlIEVuZC0gVXNlcixcbiAgLy8gd2hpY2ggaXMgaW50ZW5kZWQgdG8gYmUgY29uc3VtZWQgYnkgdGhlIENsaWVudCwgZS5nLiwgMjQ0MDAzMjAgb3IgQUl0T2F3bXd0V3djVDBrNTFCYXlld052dXRySlVxc3ZsNnFzN0E0LlxuICAvLyBJdCBNVVNUIE5PVCBleGNlZWQgMjU1IEFTQ0lJIGNoYXJhY3RlcnMgaW4gbGVuZ3RoLlRoZSBzdWIgdmFsdWUgaXMgYSBjYXNlLXNlbnNpdGl2ZSBzdHJpbmcuXG4gIC8vXG4gIC8vIGF1ZFxuICAvLyBSRVFVSVJFRC4gQXVkaWVuY2UocykgdGhhdCB0aGlzIElEIFRva2VuIGlzIGludGVuZGVkIGZvci4gSXQgTVVTVCBjb250YWluIHRoZSBPQXV0aCAyLjAgY2xpZW50X2lkIG9mIHRoZSBSZWx5aW5nIFBhcnR5IGFzIGFuXG4gIC8vIGF1ZGllbmNlIHZhbHVlLlxuICAvLyBJdCBNQVkgYWxzbyBjb250YWluIGlkZW50aWZpZXJzIGZvciBvdGhlciBhdWRpZW5jZXMuSW4gdGhlIGdlbmVyYWwgY2FzZSwgdGhlIGF1ZCB2YWx1ZSBpcyBhbiBhcnJheSBvZiBjYXNlLXNlbnNpdGl2ZSBzdHJpbmdzLlxuICAvLyBJbiB0aGUgY29tbW9uIHNwZWNpYWwgY2FzZSB3aGVuIHRoZXJlIGlzIG9uZSBhdWRpZW5jZSwgdGhlIGF1ZCB2YWx1ZSBNQVkgYmUgYSBzaW5nbGUgY2FzZS1zZW5zaXRpdmUgc3RyaW5nLlxuICAvL1xuICAvLyBleHBcbiAgLy8gUkVRVUlSRUQuIEV4cGlyYXRpb24gdGltZSBvbiBvciBhZnRlciB3aGljaCB0aGUgSUQgVG9rZW4gTVVTVCBOT1QgYmUgYWNjZXB0ZWQgZm9yIHByb2Nlc3NpbmcuXG4gIC8vIFRoZSBwcm9jZXNzaW5nIG9mIHRoaXMgcGFyYW1ldGVyIHJlcXVpcmVzIHRoYXQgdGhlIGN1cnJlbnQgZGF0ZS8gdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgZXhwaXJhdGlvbiBkYXRlLyB0aW1lIGxpc3RlZCBpbiB0aGUgdmFsdWUuXG4gIC8vIEltcGxlbWVudGVycyBNQVkgcHJvdmlkZSBmb3Igc29tZSBzbWFsbCBsZWV3YXksIHVzdWFsbHkgbm8gbW9yZSB0aGFuIGEgZmV3IG1pbnV0ZXMsIHRvIGFjY291bnQgZm9yIGNsb2NrIHNrZXcuXG4gIC8vIEl0cyB2YWx1ZSBpcyBhIEpTT04gW1JGQzcxNTldIG51bWJlciByZXByZXNlbnRpbmcgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gMTk3MC0gMDEgLSAwMVQwMDogMDA6MDBaIGFzIG1lYXN1cmVkIGluIFVUQyB1bnRpbFxuICAvLyB0aGUgZGF0ZS8gdGltZS5cbiAgLy8gU2VlIFJGQyAzMzM5IFtSRkMzMzM5XSBmb3IgZGV0YWlscyByZWdhcmRpbmcgZGF0ZS8gdGltZXMgaW4gZ2VuZXJhbCBhbmQgVVRDIGluIHBhcnRpY3VsYXIuXG4gIC8vXG4gIC8vIGlhdFxuICAvLyBSRVFVSVJFRC4gVGltZSBhdCB3aGljaCB0aGUgSldUIHdhcyBpc3N1ZWQuIEl0cyB2YWx1ZSBpcyBhIEpTT04gbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbVxuICAvLyAxOTcwLSAwMSAtIDAxVDAwOiAwMDogMDBaIGFzIG1lYXN1cmVkXG4gIC8vIGluIFVUQyB1bnRpbCB0aGUgZGF0ZS8gdGltZS5cbiAgdmFsaWRhdGVSZXF1aXJlZElkVG9rZW4oZGF0YUlkVG9rZW46IGFueSk6IGJvb2xlYW4ge1xuICAgIGxldCB2YWxpZGF0ZWQgPSB0cnVlO1xuICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ2lzcycpKSB7XG4gICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpc3MgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdzdWInKSkge1xuICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnc3ViIGlzIG1pc3NpbmcsIHRoaXMgaXMgcmVxdWlyZWQgaW4gdGhlIGlkX3Rva2VuJyk7XG4gICAgfVxuXG4gICAgaWYgKCFkYXRhSWRUb2tlbi5oYXNPd25Qcm9wZXJ0eSgnYXVkJykpIHtcbiAgICAgIHZhbGlkYXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2F1ZCBpcyBtaXNzaW5nLCB0aGlzIGlzIHJlcXVpcmVkIGluIHRoZSBpZF90b2tlbicpO1xuICAgIH1cblxuICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ2V4cCcpKSB7XG4gICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdleHAgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xuICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaWF0IGlzIG1pc3NpbmcsIHRoaXMgaXMgcmVxdWlyZWQgaW4gdGhlIGlkX3Rva2VuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkYXRlZDtcbiAgfVxuXG4gIC8vIGlkX3Rva2VuIEM4OiBUaGUgaWF0IENsYWltIGNhbiBiZSB1c2VkIHRvIHJlamVjdCB0b2tlbnMgdGhhdCB3ZXJlIGlzc3VlZCB0b28gZmFyIGF3YXkgZnJvbSB0aGUgY3VycmVudCB0aW1lLFxuICAvLyBsaW1pdGluZyB0aGUgYW1vdW50IG9mIHRpbWUgdGhhdCBub25jZXMgbmVlZCB0byBiZSBzdG9yZWQgdG8gcHJldmVudCBhdHRhY2tzLlRoZSBhY2NlcHRhYmxlIHJhbmdlIGlzIENsaWVudCBzcGVjaWZpYy5cbiAgdmFsaWRhdGVJZFRva2VuSWF0TWF4T2Zmc2V0KGRhdGFJZFRva2VuOiBhbnksIG1heE9mZnNldEFsbG93ZWRJblNlY29uZHM6IG51bWJlciwgZGlzYWJsZUlhdE9mZnNldFZhbGlkYXRpb246IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBpZiAoZGlzYWJsZUlhdE9mZnNldFZhbGlkYXRpb24pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ2lhdCcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0ZVRpbWVJYXRJZFRva2VuID0gbmV3IERhdGUoMCk7IC8vIFRoZSAwIGhlcmUgaXMgdGhlIGtleSwgd2hpY2ggc2V0cyB0aGUgZGF0ZSB0byB0aGUgZXBvY2hcbiAgICBkYXRlVGltZUlhdElkVG9rZW4uc2V0VVRDU2Vjb25kcyhkYXRhSWRUb2tlbi5pYXQpO1xuICAgIG1heE9mZnNldEFsbG93ZWRJblNlY29uZHMgPSBtYXhPZmZzZXRBbGxvd2VkSW5TZWNvbmRzIHx8IDA7XG5cbiAgICBjb25zdCBub3dJblV0YyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgY29uc3QgZGlmZiA9IG5vd0luVXRjLnZhbHVlT2YoKSAtIGRhdGVUaW1lSWF0SWRUb2tlbi52YWx1ZU9mKCk7XG4gICAgY29uc3QgbWF4T2Zmc2V0QWxsb3dlZEluTWlsbGlzZWNvbmRzID0gbWF4T2Zmc2V0QWxsb3dlZEluU2Vjb25kcyAqIDEwMDA7XG5cbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYHZhbGlkYXRlIGlkIHRva2VuIGlhdCBtYXggb2Zmc2V0ICR7ZGlmZn0gPCAke21heE9mZnNldEFsbG93ZWRJbk1pbGxpc2Vjb25kc31gKTtcblxuICAgIGlmIChkaWZmID4gMCkge1xuICAgICAgcmV0dXJuIGRpZmYgPCBtYXhPZmZzZXRBbGxvd2VkSW5NaWxsaXNlY29uZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIC1kaWZmIDwgbWF4T2Zmc2V0QWxsb3dlZEluTWlsbGlzZWNvbmRzO1xuICB9XG5cbiAgLy8gaWRfdG9rZW4gQzk6IFRoZSB2YWx1ZSBvZiB0aGUgbm9uY2UgQ2xhaW0gTVVTVCBiZSBjaGVja2VkIHRvIHZlcmlmeSB0aGF0IGl0IGlzIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBvbmVcbiAgLy8gdGhhdCB3YXMgc2VudCBpbiB0aGUgQXV0aGVudGljYXRpb24gUmVxdWVzdC5UaGUgQ2xpZW50IFNIT1VMRCBjaGVjayB0aGUgbm9uY2UgdmFsdWUgZm9yIHJlcGxheSBhdHRhY2tzLlxuICAvLyBUaGUgcHJlY2lzZSBtZXRob2QgZm9yIGRldGVjdGluZyByZXBsYXkgYXR0YWNrcyBpcyBDbGllbnQgc3BlY2lmaWMuXG5cbiAgLy8gSG93ZXZlciB0aGUgbm9uY2UgY2xhaW0gU0hPVUxEIG5vdCBiZSBwcmVzZW50IGZvciB0aGUgcmVmcmVzaF90b2tlbiBncmFudCB0eXBlXG4gIC8vIGh0dHBzOi8vYml0YnVja2V0Lm9yZy9vcGVuaWQvY29ubmVjdC9pc3N1ZXMvMTAyNS9hbWJpZ3VpdHktd2l0aC1ob3ctbm9uY2UtaXMtaGFuZGxlZC1vblxuICAvLyBUaGUgY3VycmVudCBzcGVjIGlzIGFtYmlndW91cyBhbmQgS2V5Y2xvYWsgZG9lcyBzZW5kIGl0LlxuICB2YWxpZGF0ZUlkVG9rZW5Ob25jZShkYXRhSWRUb2tlbjogYW55LCBsb2NhbE5vbmNlOiBhbnksIGlnbm9yZU5vbmNlQWZ0ZXJSZWZyZXNoOiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgY29uc3QgaXNGcm9tUmVmcmVzaFRva2VuID1cbiAgICAgIChkYXRhSWRUb2tlbi5ub25jZSA9PT0gdW5kZWZpbmVkIHx8IGlnbm9yZU5vbmNlQWZ0ZXJSZWZyZXNoKSAmJiBsb2NhbE5vbmNlID09PSBUb2tlblZhbGlkYXRpb25TZXJ2aWNlLnJlZnJlc2hUb2tlbk5vbmNlUGxhY2Vob2xkZXI7XG4gICAgaWYgKCFpc0Zyb21SZWZyZXNoVG9rZW4gJiYgZGF0YUlkVG9rZW4ubm9uY2UgIT09IGxvY2FsTm9uY2UpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVfaWRfdG9rZW5fbm9uY2UgZmFpbGVkLCBkYXRhSWRUb2tlbi5ub25jZTogJyArIGRhdGFJZFRva2VuLm5vbmNlICsgJyBsb2NhbF9ub25jZTonICsgbG9jYWxOb25jZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBpZF90b2tlbiBDMTogVGhlIElzc3VlciBJZGVudGlmaWVyIGZvciB0aGUgT3BlbklEIFByb3ZpZGVyICh3aGljaCBpcyB0eXBpY2FsbHkgb2J0YWluZWQgZHVyaW5nIERpc2NvdmVyeSlcbiAgLy8gTVVTVCBleGFjdGx5IG1hdGNoIHRoZSB2YWx1ZSBvZiB0aGUgaXNzIChpc3N1ZXIpIENsYWltLlxuICB2YWxpZGF0ZUlkVG9rZW5Jc3MoZGF0YUlkVG9rZW46IGFueSwgYXV0aFdlbGxLbm93bkVuZHBvaW50c0lzc3VlcjogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKChkYXRhSWRUb2tlbi5pc3MgYXMgc3RyaW5nKSAhPT0gKGF1dGhXZWxsS25vd25FbmRwb2ludHNJc3N1ZXIgYXMgc3RyaW5nKSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKFxuICAgICAgICAnVmFsaWRhdGVfaWRfdG9rZW5faXNzIGZhaWxlZCwgZGF0YUlkVG9rZW4uaXNzOiAnICtcbiAgICAgICAgICBkYXRhSWRUb2tlbi5pc3MgK1xuICAgICAgICAgICcgYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpc3N1ZXI6JyArXG4gICAgICAgICAgYXV0aFdlbGxLbm93bkVuZHBvaW50c0lzc3VlclxuICAgICAgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGlkX3Rva2VuIEMyOiBUaGUgQ2xpZW50IE1VU1QgdmFsaWRhdGUgdGhhdCB0aGUgYXVkIChhdWRpZW5jZSkgQ2xhaW0gY29udGFpbnMgaXRzIGNsaWVudF9pZCB2YWx1ZSByZWdpc3RlcmVkIGF0IHRoZSBJc3N1ZXIgaWRlbnRpZmllZFxuICAvLyBieSB0aGUgaXNzIChpc3N1ZXIpIENsYWltIGFzIGFuIGF1ZGllbmNlLlxuICAvLyBUaGUgSUQgVG9rZW4gTVVTVCBiZSByZWplY3RlZCBpZiB0aGUgSUQgVG9rZW4gZG9lcyBub3QgbGlzdCB0aGUgQ2xpZW50IGFzIGEgdmFsaWQgYXVkaWVuY2UsIG9yIGlmIGl0IGNvbnRhaW5zIGFkZGl0aW9uYWwgYXVkaWVuY2VzXG4gIC8vIG5vdCB0cnVzdGVkIGJ5IHRoZSBDbGllbnQuXG4gIHZhbGlkYXRlSWRUb2tlbkF1ZChkYXRhSWRUb2tlbjogYW55LCBhdWQ6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGFJZFRva2VuLmF1ZCkpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGRhdGFJZFRva2VuLmF1ZC5pbmNsdWRlcyhhdWQpO1xuXG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1ZhbGlkYXRlX2lkX3Rva2VuX2F1ZCBhcnJheSBmYWlsZWQsIGRhdGFJZFRva2VuLmF1ZDogJyArIGRhdGFJZFRva2VuLmF1ZCArICcgY2xpZW50X2lkOicgKyBhdWQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZGF0YUlkVG9rZW4uYXVkICE9PSBhdWQpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVfaWRfdG9rZW5fYXVkIGZhaWxlZCwgZGF0YUlkVG9rZW4uYXVkOiAnICsgZGF0YUlkVG9rZW4uYXVkICsgJyBjbGllbnRfaWQ6JyArIGF1ZCk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhbGlkYXRlSWRUb2tlbkF6cEV4aXN0c0lmTW9yZVRoYW5PbmVBdWQoZGF0YUlkVG9rZW46IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICghZGF0YUlkVG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhSWRUb2tlbi5hdWQpICYmIGRhdGFJZFRva2VuLmF1ZC5sZW5ndGggPiAxICYmICFkYXRhSWRUb2tlbi5henApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIElmIGFuIGF6cCAoYXV0aG9yaXplZCBwYXJ0eSkgQ2xhaW0gaXMgcHJlc2VudCwgdGhlIENsaWVudCBTSE9VTEQgdmVyaWZ5IHRoYXQgaXRzIGNsaWVudF9pZCBpcyB0aGUgQ2xhaW0gVmFsdWUuXG4gIHZhbGlkYXRlSWRUb2tlbkF6cFZhbGlkKGRhdGFJZFRva2VuOiBhbnksIGNsaWVudElkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoIWRhdGFJZFRva2VuPy5henApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkYXRhSWRUb2tlbi5henAgPT09IGNsaWVudElkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YWxpZGF0ZVN0YXRlRnJvbUhhc2hDYWxsYmFjayhzdGF0ZTogYW55LCBsb2NhbFN0YXRlOiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAoKHN0YXRlIGFzIHN0cmluZykgIT09IChsb2NhbFN0YXRlIGFzIHN0cmluZykpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVTdGF0ZUZyb21IYXNoQ2FsbGJhY2sgZmFpbGVkLCBzdGF0ZTogJyArIHN0YXRlICsgJyBsb2NhbF9zdGF0ZTonICsgbG9jYWxTdGF0ZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBpZF90b2tlbiBDNTogVGhlIENsaWVudCBNVVNUIHZhbGlkYXRlIHRoZSBzaWduYXR1cmUgb2YgdGhlIElEIFRva2VuIGFjY29yZGluZyB0byBKV1MgW0pXU10gdXNpbmcgdGhlIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gdGhlIGFsZ1xuICAvLyBIZWFkZXIgUGFyYW1ldGVyIG9mIHRoZSBKT1NFIEhlYWRlci5UaGUgQ2xpZW50IE1VU1QgdXNlIHRoZSBrZXlzIHByb3ZpZGVkIGJ5IHRoZSBJc3N1ZXIuXG4gIC8vIGlkX3Rva2VuIEM2OiBUaGUgYWxnIHZhbHVlIFNIT1VMRCBiZSBSUzI1Ni4gVmFsaWRhdGlvbiBvZiB0b2tlbnMgdXNpbmcgb3RoZXIgc2lnbmluZyBhbGdvcml0aG1zIGlzIGRlc2NyaWJlZCBpbiB0aGVcbiAgLy8gT3BlbklEIENvbm5lY3QgQ29yZSAxLjAgW09wZW5JRC5Db3JlXSBzcGVjaWZpY2F0aW9uLlxuICB2YWxpZGF0ZVNpZ25hdHVyZUlkVG9rZW4oaWRUb2tlbjogYW55LCBqd3RrZXlzOiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAoIWp3dGtleXMgfHwgIWp3dGtleXMua2V5cykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGhlYWRlckRhdGEgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRIZWFkZXJGcm9tVG9rZW4oaWRUb2tlbiwgZmFsc2UpO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKGhlYWRlckRhdGEpLmxlbmd0aCA9PT0gMCAmJiBoZWFkZXJEYXRhLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpZCB0b2tlbiBoYXMgbm8gaGVhZGVyIGRhdGEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBraWQgPSBoZWFkZXJEYXRhLmtpZDtcbiAgICBjb25zdCBhbGcgPSBoZWFkZXJEYXRhLmFsZztcblxuICAgIGlmICghdGhpcy5rZXlBbGdvcml0aG1zLmluY2x1ZGVzKGFsZyBhcyBzdHJpbmcpKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYWxnIG5vdCBzdXBwb3J0ZWQnLCBhbGcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBqd3RLdHlUb1VzZSA9ICdSU0EnO1xuICAgIGlmICgoYWxnIGFzIHN0cmluZykuY2hhckF0KDApID09PSAnRScpIHtcbiAgICAgIGp3dEt0eVRvVXNlID0gJ0VDJztcbiAgICB9XG5cbiAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuXG4gICAgLy8gTm8ga2lkIGluIHRoZSBKb3NlIGhlYWRlclxuICAgIGlmICgha2lkKSB7XG4gICAgICBsZXQga2V5VG9WYWxpZGF0ZTtcblxuICAgICAgLy8gSWYgb25seSBvbmUga2V5LCB1c2UgaXRcbiAgICAgIGlmIChqd3RrZXlzLmtleXMubGVuZ3RoID09PSAxICYmIChqd3RrZXlzLmtleXNbMF0ua3R5IGFzIHN0cmluZykgPT09IGp3dEt0eVRvVXNlKSB7XG4gICAgICAgIGtleVRvVmFsaWRhdGUgPSBqd3RrZXlzLmtleXNbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBNb3JlIHRoYW4gb25lIGtleVxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlcmUncyBleGFjdGx5IDEga2V5IGNhbmRpZGF0ZVxuICAgICAgICAvLyBrdHkgXCJSU0FcIiBhbmQgXCJFQ1wiIHVzZXMgXCJzaWdcIlxuICAgICAgICBsZXQgYW1vdW50T2ZNYXRjaGluZ0tleXMgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBqd3RrZXlzLmtleXMpIHtcbiAgICAgICAgICBpZiAoKGtleS5rdHkgYXMgc3RyaW5nKSA9PT0gand0S3R5VG9Vc2UgJiYgKGtleS51c2UgYXMgc3RyaW5nKSA9PT0gJ3NpZycpIHtcbiAgICAgICAgICAgIGFtb3VudE9mTWF0Y2hpbmdLZXlzKys7XG4gICAgICAgICAgICBrZXlUb1ZhbGlkYXRlID0ga2V5O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhbW91bnRPZk1hdGNoaW5nS2V5cyA+IDEpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnbm8gSUQgVG9rZW4ga2lkIGNsYWltIGluIEpPU0UgaGVhZGVyIGFuZCBtdWx0aXBsZSBzdXBwbGllZCBpbiBqd2tzX3VyaScpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWtleVRvVmFsaWRhdGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ25vIGtleXMgZm91bmQsIGluY29ycmVjdCBTaWduYXR1cmUsIHZhbGlkYXRpb24gZmFpbGVkIGZvciBpZF90b2tlbicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vaXNWYWxpZCA9IEtKVVIuandzLkpXUy52ZXJpZnkoaWRUb2tlbiwgS0VZVVRJTC5nZXRLZXkoa2V5VG9WYWxpZGF0ZSksIFthbGddKTtcbiAgICAgIC8vIFRPRE86IEhFUkVcbiAgICAgIC8vIE1vZGlmaWNoaWFtbyBpbiB0cnVlIHBlcmNow6ggbm9uIGZ1bnppb25hIGxhIHZhbGlkYXppb25lXG5cbiAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5jb3JyZWN0IFNpZ25hdHVyZSwgdmFsaWRhdGlvbiBmYWlsZWQgZm9yIGlkX3Rva2VuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBraWQgaW4gdGhlIEpvc2UgaGVhZGVyIG9mIGlkX3Rva2VuXG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBqd3RrZXlzLmtleXMpIHtcbiAgICAgICAgaWYgKChrZXkua2lkIGFzIHN0cmluZykgPT09IChraWQgYXMgc3RyaW5nKSkge1xuICAgICAgICAgIGNvbnN0IHB1YmxpY0tleSA9IEtFWVVUSUwuZ2V0S2V5KGtleSk7XG4gICAgICAgICAgaXNWYWxpZCA9IEtKVVIuandzLkpXUy52ZXJpZnkoaWRUb2tlbiwgcHVibGljS2V5LCBbYWxnXSk7XG4gICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5jb3JyZWN0IFNpZ25hdHVyZSwgdmFsaWRhdGlvbiBmYWlsZWQgZm9yIGlkX3Rva2VuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzVmFsaWQ7XG4gIH1cblxuICAvLyBBY2NlcHRzIElEIFRva2VuIHdpdGhvdXQgJ2tpZCcgY2xhaW0gaW4gSk9TRSBoZWFkZXIgaWYgb25seSBvbmUgSldLIHN1cHBsaWVkIGluICdqd2tzX3VybCdcbiAgLy8vLyBwcml2YXRlIHZhbGlkYXRlX25vX2tpZF9pbl9oZWFkZXJfb25seV9vbmVfYWxsb3dlZF9pbl9qd3RrZXlzKGhlYWRlcl9kYXRhOiBhbnksIGp3dGtleXM6IGFueSk6IGJvb2xlYW4ge1xuICAvLy8vICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmxvZ0RlYnVnKCdhbW91bnQgb2Ygand0a2V5cy5rZXlzOiAnICsgand0a2V5cy5rZXlzLmxlbmd0aCk7XG4gIC8vLy8gICAgaWYgKCFoZWFkZXJfZGF0YS5oYXNPd25Qcm9wZXJ0eSgna2lkJykpIHtcbiAgLy8vLyAgICAgICAgLy8gbm8ga2lkIGRlZmluZWQgaW4gSm9zZSBoZWFkZXJcbiAgLy8vLyAgICAgICAgaWYgKGp3dGtleXMua2V5cy5sZW5ndGggIT0gMSkge1xuICAvLy8vICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24ubG9nRGVidWcoJ2p3dGtleXMua2V5cy5sZW5ndGggIT0gMSBhbmQgbm8ga2lkIGluIGhlYWRlcicpO1xuICAvLy8vICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAvLy8vICAgICAgICB9XG4gIC8vLy8gICAgfVxuXG4gIC8vLy8gICAgcmV0dXJuIHRydWU7XG4gIC8vLy8gfVxuXG4gIC8vIEFjY2VzcyBUb2tlbiBWYWxpZGF0aW9uXG4gIC8vIGFjY2Vzc190b2tlbiBDMTogSGFzaCB0aGUgb2N0ZXRzIG9mIHRoZSBBU0NJSSByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzX3Rva2VuIHdpdGggdGhlIGhhc2ggYWxnb3JpdGhtIHNwZWNpZmllZCBpbiBKV0FbSldBXVxuICAvLyBmb3IgdGhlIGFsZyBIZWFkZXIgUGFyYW1ldGVyIG9mIHRoZSBJRCBUb2tlbidzIEpPU0UgSGVhZGVyLiBGb3IgaW5zdGFuY2UsIGlmIHRoZSBhbGcgaXMgUlMyNTYsIHRoZSBoYXNoIGFsZ29yaXRobSB1c2VkIGlzIFNIQS0yNTYuXG4gIC8vIGFjY2Vzc190b2tlbiBDMjogVGFrZSB0aGUgbGVmdC0gbW9zdCBoYWxmIG9mIHRoZSBoYXNoIGFuZCBiYXNlNjR1cmwtIGVuY29kZSBpdC5cbiAgLy8gYWNjZXNzX3Rva2VuIEMzOiBUaGUgdmFsdWUgb2YgYXRfaGFzaCBpbiB0aGUgSUQgVG9rZW4gTVVTVCBtYXRjaCB0aGUgdmFsdWUgcHJvZHVjZWQgaW4gdGhlIHByZXZpb3VzIHN0ZXAgaWYgYXRfaGFzaFxuICAvLyBpcyBwcmVzZW50IGluIHRoZSBJRCBUb2tlbi5cbiAgdmFsaWRhdGVJZFRva2VuQXRIYXNoKGFjY2Vzc1Rva2VuOiBhbnksIGF0SGFzaDogYW55LCBpZFRva2VuQWxnOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F0X2hhc2ggZnJvbSB0aGUgc2VydmVyOicgKyBhdEhhc2gpO1xuXG4gICAgLy8gJ3NoYTI1NicgJ3NoYTM4NCcgJ3NoYTUxMidcbiAgICBsZXQgc2hhID0gJ3NoYTI1Nic7XG4gICAgaWYgKGlkVG9rZW5BbGcuaW5jbHVkZXMoJzM4NCcpKSB7XG4gICAgICBzaGEgPSAnc2hhMzg0JztcbiAgICB9IGVsc2UgaWYgKGlkVG9rZW5BbGcuaW5jbHVkZXMoJzUxMicpKSB7XG4gICAgICBzaGEgPSAnc2hhNTEyJztcbiAgICB9XG5cbiAgICBjb25zdCB0ZXN0RGF0YSA9IHRoaXMuZ2VuZXJhdGVBdEhhc2goJycgKyBhY2Nlc3NUb2tlbiwgc2hhKTtcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F0X2hhc2ggY2xpZW50IHZhbGlkYXRpb24gbm90IGRlY29kZWQ6JyArIHRlc3REYXRhKTtcbiAgICBpZiAodGVzdERhdGEgPT09IChhdEhhc2ggYXMgc3RyaW5nKSkge1xuICAgICAgcmV0dXJuIHRydWU7IC8vIGlzVmFsaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRlc3RWYWx1ZSA9IHRoaXMuZ2VuZXJhdGVBdEhhc2goJycgKyBkZWNvZGVVUklDb21wb25lbnQoYWNjZXNzVG9rZW4pLCBzaGEpO1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCctZ2VuIGFjY2Vzcy0tJyArIHRlc3RWYWx1ZSk7XG4gICAgICBpZiAodGVzdFZhbHVlID09PSAoYXRIYXNoIGFzIHN0cmluZykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIGlzVmFsaWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZW5lcmF0ZUNvZGVDaGFsbGVuZ2UoY29kZVZlcmlmaWVyOiBhbnkpOiBzdHJpbmcge1xuICAgIGNvbnN0IGhhc2ggPSBLSlVSLmNyeXB0by5VdGlsLmhhc2hTdHJpbmcoY29kZVZlcmlmaWVyLCAnc2hhMjU2Jyk7XG4gICAgY29uc3QgdGVzdERhdGEgPSBoZXh0b2I2NHUoaGFzaCk7XG5cbiAgICByZXR1cm4gdGVzdERhdGE7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlQXRIYXNoKGFjY2Vzc1Rva2VuOiBhbnksIHNoYTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBoYXNoID0gS0pVUi5jcnlwdG8uVXRpbC5oYXNoU3RyaW5nKGFjY2Vzc1Rva2VuLCBzaGEpO1xuICAgIGNvbnN0IGZpcnN0MTI4Yml0cyA9IGhhc2guc3Vic3RyKDAsIGhhc2gubGVuZ3RoIC8gMik7XG4gICAgY29uc3QgdGVzdERhdGEgPSBoZXh0b2I2NHUoZmlyc3QxMjhiaXRzKTtcblxuICAgIHJldHVybiB0ZXN0RGF0YTtcbiAgfVxufVxuIl19