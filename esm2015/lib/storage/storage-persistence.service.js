import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./abstract-security-storage";
import * as i2 from "../config/config.provider";
export class StoragePersistenceService {
    constructor(oidcSecurityStorage, configurationProvider) {
        this.oidcSecurityStorage = oidcSecurityStorage;
        this.configurationProvider = configurationProvider;
    }
    read(key) {
        const keyToRead = this.createKeyWithPrefix(key);
        return this.oidcSecurityStorage.read(keyToRead);
    }
    write(key, value) {
        const keyToStore = this.createKeyWithPrefix(key);
        this.oidcSecurityStorage.write(keyToStore, value);
    }
    remove(key) {
        const keyToStore = this.createKeyWithPrefix(key);
        this.oidcSecurityStorage.remove(keyToStore);
    }
    resetStorageFlowData() {
        this.remove('session_state');
        this.remove('storageSilentRenewRunning');
        this.remove('codeVerifier');
        this.remove('userData');
        this.remove('storageCustomRequestParams');
        this.remove('storageCustomParamsRefresh');
        this.remove('access_token_expires_at');
    }
    resetAuthStateInStorage() {
        this.remove('authzData');
        this.remove('authnResult');
    }
    getAccessToken() {
        return this.read('authzData');
    }
    getIdToken() {
        var _a;
        return (_a = this.read('authnResult')) === null || _a === void 0 ? void 0 : _a.id_token;
    }
    getRefreshToken() {
        var _a;
        return (_a = this.read('authnResult')) === null || _a === void 0 ? void 0 : _a.refresh_token;
    }
    createKeyWithPrefix(key) {
        const config = this.configurationProvider.getOpenIDConfiguration();
        const prefix = (config === null || config === void 0 ? void 0 : config.clientId) || '';
        return `${prefix}_${key}`;
    }
}
StoragePersistenceService.ɵfac = function StoragePersistenceService_Factory(t) { return new (t || StoragePersistenceService)(i0.ɵɵinject(i1.AbstractSecurityStorage), i0.ɵɵinject(i2.ConfigurationProvider)); };
StoragePersistenceService.ɵprov = i0.ɵɵdefineInjectable({ token: StoragePersistenceService, factory: StoragePersistenceService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(StoragePersistenceService, [{
        type: Injectable
    }], function () { return [{ type: i1.AbstractSecurityStorage }, { type: i2.ConfigurationProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQW9CM0MsTUFBTSxPQUFPLHlCQUF5QjtJQUNwQyxZQUNtQixtQkFBNEMsRUFDNUMscUJBQTRDO1FBRDVDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBeUI7UUFDNUMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtJQUM1RCxDQUFDO0lBRUosSUFBSSxDQUFDLEdBQWdCO1FBQ25CLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFnQixFQUFFLEtBQVU7UUFDaEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxNQUFNLENBQUMsR0FBZ0I7UUFDckIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELG9CQUFvQjtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELHVCQUF1QjtRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELGNBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELFVBQVU7O1FBQ1IsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQ0FBRSxRQUFRLENBQUM7SUFDNUMsQ0FBQztJQUVELGVBQWU7O1FBQ2IsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQ0FBRSxhQUFhLENBQUM7SUFDakQsQ0FBQztJQUVPLG1CQUFtQixDQUFDLEdBQVc7UUFDckMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDbkUsTUFBTSxNQUFNLEdBQUcsQ0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsUUFBUSxLQUFJLEVBQUUsQ0FBQztRQUN0QyxPQUFPLEdBQUcsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzVCLENBQUM7O2tHQXBEVSx5QkFBeUI7aUVBQXpCLHlCQUF5QixXQUF6Qix5QkFBeUI7a0RBQXpCLHlCQUF5QjtjQURyQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcclxuaW1wb3J0IHsgQWJzdHJhY3RTZWN1cml0eVN0b3JhZ2UgfSBmcm9tICcuL2Fic3RyYWN0LXNlY3VyaXR5LXN0b3JhZ2UnO1xyXG5cclxuZXhwb3J0IHR5cGUgU3RvcmFnZUtleXMgPVxyXG4gIHwgJ2F1dGhuUmVzdWx0J1xyXG4gIHwgJ2F1dGh6RGF0YSdcclxuICB8ICdhY2Nlc3NfdG9rZW5fZXhwaXJlc19hdCdcclxuICB8ICdhdXRoV2VsbEtub3duRW5kUG9pbnRzJ1xyXG4gIHwgJ3VzZXJEYXRhJ1xyXG4gIHwgJ2F1dGhOb25jZSdcclxuICB8ICdjb2RlVmVyaWZpZXInXHJcbiAgfCAnYXV0aFN0YXRlQ29udHJvbCdcclxuICB8ICdzZXNzaW9uX3N0YXRlJ1xyXG4gIHwgJ3N0b3JhZ2VTaWxlbnRSZW5ld1J1bm5pbmcnXHJcbiAgfCAnc3RvcmFnZUN1c3RvbVJlcXVlc3RQYXJhbXMnXHJcbiAgfCAnc3RvcmFnZUN1c3RvbVBhcmFtc1JlZnJlc2gnXHJcbiAgfCAnand0S2V5cyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgb2lkY1NlY3VyaXR5U3RvcmFnZTogQWJzdHJhY3RTZWN1cml0eVN0b3JhZ2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyXHJcbiAgKSB7fVxyXG5cclxuICByZWFkKGtleTogU3RvcmFnZUtleXMpIHtcclxuICAgIGNvbnN0IGtleVRvUmVhZCA9IHRoaXMuY3JlYXRlS2V5V2l0aFByZWZpeChrZXkpO1xyXG4gICAgcmV0dXJuIHRoaXMub2lkY1NlY3VyaXR5U3RvcmFnZS5yZWFkKGtleVRvUmVhZCk7XHJcbiAgfVxyXG5cclxuICB3cml0ZShrZXk6IFN0b3JhZ2VLZXlzLCB2YWx1ZTogYW55KSB7XHJcbiAgICBjb25zdCBrZXlUb1N0b3JlID0gdGhpcy5jcmVhdGVLZXlXaXRoUHJlZml4KGtleSk7XHJcbiAgICB0aGlzLm9pZGNTZWN1cml0eVN0b3JhZ2Uud3JpdGUoa2V5VG9TdG9yZSwgdmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlKGtleTogU3RvcmFnZUtleXMpIHtcclxuICAgIGNvbnN0IGtleVRvU3RvcmUgPSB0aGlzLmNyZWF0ZUtleVdpdGhQcmVmaXgoa2V5KTtcclxuICAgIHRoaXMub2lkY1NlY3VyaXR5U3RvcmFnZS5yZW1vdmUoa2V5VG9TdG9yZSk7XHJcbiAgfVxyXG5cclxuICByZXNldFN0b3JhZ2VGbG93RGF0YSgpIHtcclxuICAgIHRoaXMucmVtb3ZlKCdzZXNzaW9uX3N0YXRlJyk7XHJcbiAgICB0aGlzLnJlbW92ZSgnc3RvcmFnZVNpbGVudFJlbmV3UnVubmluZycpO1xyXG4gICAgdGhpcy5yZW1vdmUoJ2NvZGVWZXJpZmllcicpO1xyXG4gICAgdGhpcy5yZW1vdmUoJ3VzZXJEYXRhJyk7XHJcbiAgICB0aGlzLnJlbW92ZSgnc3RvcmFnZUN1c3RvbVJlcXVlc3RQYXJhbXMnKTtcclxuICAgIHRoaXMucmVtb3ZlKCdzdG9yYWdlQ3VzdG9tUGFyYW1zUmVmcmVzaCcpO1xyXG4gICAgdGhpcy5yZW1vdmUoJ2FjY2Vzc190b2tlbl9leHBpcmVzX2F0Jyk7XHJcbiAgfVxyXG5cclxuICByZXNldEF1dGhTdGF0ZUluU3RvcmFnZSgpIHtcclxuICAgIHRoaXMucmVtb3ZlKCdhdXRoekRhdGEnKTtcclxuICAgIHRoaXMucmVtb3ZlKCdhdXRoblJlc3VsdCcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWNjZXNzVG9rZW4oKTogYW55IHtcclxuICAgIHJldHVybiB0aGlzLnJlYWQoJ2F1dGh6RGF0YScpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SWRUb2tlbigpOiBhbnkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZCgnYXV0aG5SZXN1bHQnKT8uaWRfdG9rZW47XHJcbiAgfVxyXG5cclxuICBnZXRSZWZyZXNoVG9rZW4oKTogYW55IHtcclxuICAgIHJldHVybiB0aGlzLnJlYWQoJ2F1dGhuUmVzdWx0Jyk/LnJlZnJlc2hfdG9rZW47XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUtleVdpdGhQcmVmaXgoa2V5OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcclxuICAgIGNvbnN0IHByZWZpeCA9IGNvbmZpZz8uY2xpZW50SWQgfHwgJyc7XHJcbiAgICByZXR1cm4gYCR7cHJlZml4fV8ke2tleX1gO1xyXG4gIH1cclxufVxyXG4iXX0=