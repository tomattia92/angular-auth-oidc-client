import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
const PARTS_OF_TOKEN = 3;
export class TokenHelperService {
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    getTokenExpirationDate(dataIdToken) {
        if (!dataIdToken.hasOwnProperty('exp')) {
            return new Date(new Date().toUTCString());
        }
        const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
        date.setUTCSeconds(dataIdToken.exp);
        return date;
    }
    getHeaderFromToken(token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 0, encoded);
    }
    getPayloadFromToken(token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 1, encoded);
    }
    getSignatureFromToken(token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 2, encoded);
    }
    getPartOfToken(token, index, encoded) {
        const partOfToken = this.extractPartOfToken(token, index);
        if (encoded) {
            return partOfToken;
        }
        const result = this.urlBase64Decode(partOfToken);
        return JSON.parse(result);
    }
    urlBase64Decode(str) {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw Error('Illegal base64url string!');
        }
        const decoded = typeof window !== 'undefined' ? window.atob(output) : Buffer.from(output, 'base64').toString('binary');
        try {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(decoded
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join(''));
        }
        catch (err) {
            return decoded;
        }
    }
    tokenIsValid(token) {
        if (!token) {
            this.loggerService.logError(`token '${token}' is not valid --> token falsy`);
            return false;
        }
        if (!token.includes('.')) {
            this.loggerService.logError(`token '${token}' is not valid --> no dots included`);
            return false;
        }
        const parts = token.split('.');
        if (parts.length !== PARTS_OF_TOKEN) {
            this.loggerService.logError(`token '${token}' is not valid --> token has to have exactly ${PARTS_OF_TOKEN - 1} dots`);
            return false;
        }
        return true;
    }
    extractPartOfToken(token, index) {
        return token.split('.')[index];
    }
}
TokenHelperService.ɵfac = function TokenHelperService_Factory(t) { return new (t || TokenHelperService)(i0.ɵɵinject(i1.LoggerService)); };
TokenHelperService.ɵprov = i0.ɵɵdefineInjectable({ token: TokenHelperService, factory: TokenHelperService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(TokenHelperService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy10b2tlbi1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL3Rva2VuSGVscGVyL29pZGMtdG9rZW4taGVscGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBRzNDLE1BQU0sY0FBYyxHQUFHLENBQUMsQ0FBQztBQUV6QixNQUFNLE9BQU8sa0JBQWtCO0lBQzdCLFlBQTZCLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQUcsQ0FBQztJQUU3RCxzQkFBc0IsQ0FBQyxXQUFnQjtRQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN0QyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUMzQztRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsMERBQTBEO1FBQ3BGLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXBDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGtCQUFrQixDQUFDLEtBQVUsRUFBRSxPQUFnQjtRQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELG1CQUFtQixDQUFDLEtBQVUsRUFBRSxPQUFnQjtRQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxL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Q0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFVBQVUsS0FBSyxnREFBZ0QsY0FBYyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEgsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLGtCQUFrQixDQUFDLEtBQWEsRUFBRSxLQUFhO1FBQ3JELE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDOztvRkF2R1Usa0JBQWtCOzBEQUFsQixrQkFBa0IsV0FBbEIsa0JBQWtCO2tEQUFsQixrQkFBa0I7Y0FEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcblxuY29uc3QgUEFSVFNfT0ZfVE9LRU4gPSAzO1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRva2VuSGVscGVyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSkge31cblxuICBnZXRUb2tlbkV4cGlyYXRpb25EYXRlKGRhdGFJZFRva2VuOiBhbnkpOiBEYXRlIHtcbiAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdleHAnKSkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKDApOyAvLyBUaGUgMCBoZXJlIGlzIHRoZSBrZXksIHdoaWNoIHNldHMgdGhlIGRhdGUgdG8gdGhlIGVwb2NoXG4gICAgZGF0ZS5zZXRVVENTZWNvbmRzKGRhdGFJZFRva2VuLmV4cCk7XG5cbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuXG4gIGdldEhlYWRlckZyb21Ub2tlbih0b2tlbjogYW55LCBlbmNvZGVkOiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLnRva2VuSXNWYWxpZCh0b2tlbikpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRQYXJ0T2ZUb2tlbih0b2tlbiwgMCwgZW5jb2RlZCk7XG4gIH1cblxuICBnZXRQYXlsb2FkRnJvbVRva2VuKHRva2VuOiBhbnksIGVuY29kZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoIXRoaXMudG9rZW5Jc1ZhbGlkKHRva2VuKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldFBhcnRPZlRva2VuKHRva2VuLCAxLCBlbmNvZGVkKTtcbiAgfVxuXG4gIGdldFNpZ25hdHVyZUZyb21Ub2tlbih0b2tlbjogYW55LCBlbmNvZGVkOiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLnRva2VuSXNWYWxpZCh0b2tlbikpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRQYXJ0T2ZUb2tlbih0b2tlbiwgMiwgZW5jb2RlZCk7XG4gIH1cblxuICBwcml2YXRlIGdldFBhcnRPZlRva2VuKHRva2VuOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIGVuY29kZWQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBwYXJ0T2ZUb2tlbiA9IHRoaXMuZXh0cmFjdFBhcnRPZlRva2VuKHRva2VuLCBpbmRleCk7XG5cbiAgICBpZiAoZW5jb2RlZCkge1xuICAgICAgcmV0dXJuIHBhcnRPZlRva2VuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudXJsQmFzZTY0RGVjb2RlKHBhcnRPZlRva2VuKTtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cmxCYXNlNjREZWNvZGUoc3RyOiBzdHJpbmcpIHtcbiAgICBsZXQgb3V0cHV0ID0gc3RyLnJlcGxhY2UoLy0vZywgJysnKS5yZXBsYWNlKC9fL2csICcvJyk7XG5cbiAgICBzd2l0Y2ggKG91dHB1dC5sZW5ndGggJSA0KSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBvdXRwdXQgKz0gJz09JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIG91dHB1dCArPSAnPSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0lsbGVnYWwgYmFzZTY0dXJsIHN0cmluZyEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNvZGVkID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cuYXRvYihvdXRwdXQpIDogQnVmZmVyLmZyb20ob3V0cHV0LCAnYmFzZTY0JykudG9TdHJpbmcoJ2JpbmFyeScpO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIEdvaW5nIGJhY2t3YXJkczogZnJvbSBieXRlc3RyZWFtLCB0byBwZXJjZW50LWVuY29kaW5nLCB0byBvcmlnaW5hbCBzdHJpbmcuXG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KFxuICAgICAgICBkZWNvZGVkXG4gICAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAgIC5tYXAoKGM6IHN0cmluZykgPT4gJyUnICsgKCcwMCcgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMikpXG4gICAgICAgICAgLmpvaW4oJycpXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGRlY29kZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0b2tlbklzVmFsaWQodG9rZW46IHN0cmluZykge1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihgdG9rZW4gJyR7dG9rZW59JyBpcyBub3QgdmFsaWQgLS0+IHRva2VuIGZhbHN5YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCEodG9rZW4gYXMgc3RyaW5nKS5pbmNsdWRlcygnLicpKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYHRva2VuICcke3Rva2VufScgaXMgbm90IHZhbGlkIC0tPiBubyBkb3RzIGluY2x1ZGVkYCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHMgPSB0b2tlbi5zcGxpdCgnLicpO1xuXG4gICAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gUEFSVFNfT0ZfVE9LRU4pIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihgdG9rZW4gJyR7dG9rZW59JyBpcyBub3QgdmFsaWQgLS0+IHRva2VuIGhhcyB0byBoYXZlIGV4YWN0bHkgJHtQQVJUU19PRl9UT0tFTiAtIDF9IGRvdHNgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdFBhcnRPZlRva2VuKHRva2VuOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdG9rZW4uc3BsaXQoJy4nKVtpbmRleF07XG4gIH1cbn1cbiJdfQ==