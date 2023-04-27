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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQW9CM0MsTUFBTSxPQUFPLHlCQUF5QjtJQUNwQyxZQUNtQixtQkFBNEMsRUFDNUMscUJBQTRDO1FBRDVDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBeUI7UUFDNUMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtJQUM1RCxDQUFDO0lBRUosSUFBSSxDQUFDLEdBQWdCO1FBQ25CLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFnQixFQUFFLEtBQVU7UUFDaEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxNQUFNLENBQUMsR0FBZ0I7UUFDckIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELG9CQUFvQjtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELHVCQUF1QjtRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELGNBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELFVBQVU7O1FBQ1IsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQ0FBRSxRQUFRLENBQUM7SUFDNUMsQ0FBQztJQUVELGVBQWU7O1FBQ2IsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQ0FBRSxhQUFhLENBQUM7SUFDakQsQ0FBQztJQUVPLG1CQUFtQixDQUFDLEdBQVc7UUFDckMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDbkUsTUFBTSxNQUFNLEdBQUcsQ0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsUUFBUSxLQUFJLEVBQUUsQ0FBQztRQUN0QyxPQUFPLEdBQUcsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzVCLENBQUM7O2tHQXBEVSx5QkFBeUI7aUVBQXpCLHlCQUF5QixXQUF6Qix5QkFBeUI7a0RBQXpCLHlCQUF5QjtjQURyQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XG5pbXBvcnQgeyBBYnN0cmFjdFNlY3VyaXR5U3RvcmFnZSB9IGZyb20gJy4vYWJzdHJhY3Qtc2VjdXJpdHktc3RvcmFnZSc7XG5cbmV4cG9ydCB0eXBlIFN0b3JhZ2VLZXlzID1cbiAgfCAnYXV0aG5SZXN1bHQnXG4gIHwgJ2F1dGh6RGF0YSdcbiAgfCAnYWNjZXNzX3Rva2VuX2V4cGlyZXNfYXQnXG4gIHwgJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnXG4gIHwgJ3VzZXJEYXRhJ1xuICB8ICdhdXRoTm9uY2UnXG4gIHwgJ2NvZGVWZXJpZmllcidcbiAgfCAnYXV0aFN0YXRlQ29udHJvbCdcbiAgfCAnc2Vzc2lvbl9zdGF0ZSdcbiAgfCAnc3RvcmFnZVNpbGVudFJlbmV3UnVubmluZydcbiAgfCAnc3RvcmFnZUN1c3RvbVJlcXVlc3RQYXJhbXMnXG4gIHwgJ3N0b3JhZ2VDdXN0b21QYXJhbXNSZWZyZXNoJ1xuICB8ICdqd3RLZXlzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9pZGNTZWN1cml0eVN0b3JhZ2U6IEFic3RyYWN0U2VjdXJpdHlTdG9yYWdlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXJcbiAgKSB7fVxuXG4gIHJlYWQoa2V5OiBTdG9yYWdlS2V5cykge1xuICAgIGNvbnN0IGtleVRvUmVhZCA9IHRoaXMuY3JlYXRlS2V5V2l0aFByZWZpeChrZXkpO1xuICAgIHJldHVybiB0aGlzLm9pZGNTZWN1cml0eVN0b3JhZ2UucmVhZChrZXlUb1JlYWQpO1xuICB9XG5cbiAgd3JpdGUoa2V5OiBTdG9yYWdlS2V5cywgdmFsdWU6IGFueSkge1xuICAgIGNvbnN0IGtleVRvU3RvcmUgPSB0aGlzLmNyZWF0ZUtleVdpdGhQcmVmaXgoa2V5KTtcbiAgICB0aGlzLm9pZGNTZWN1cml0eVN0b3JhZ2Uud3JpdGUoa2V5VG9TdG9yZSwgdmFsdWUpO1xuICB9XG5cbiAgcmVtb3ZlKGtleTogU3RvcmFnZUtleXMpIHtcbiAgICBjb25zdCBrZXlUb1N0b3JlID0gdGhpcy5jcmVhdGVLZXlXaXRoUHJlZml4KGtleSk7XG4gICAgdGhpcy5vaWRjU2VjdXJpdHlTdG9yYWdlLnJlbW92ZShrZXlUb1N0b3JlKTtcbiAgfVxuXG4gIHJlc2V0U3RvcmFnZUZsb3dEYXRhKCkge1xuICAgIHRoaXMucmVtb3ZlKCdzZXNzaW9uX3N0YXRlJyk7XG4gICAgdGhpcy5yZW1vdmUoJ3N0b3JhZ2VTaWxlbnRSZW5ld1J1bm5pbmcnKTtcbiAgICB0aGlzLnJlbW92ZSgnY29kZVZlcmlmaWVyJyk7XG4gICAgdGhpcy5yZW1vdmUoJ3VzZXJEYXRhJyk7XG4gICAgdGhpcy5yZW1vdmUoJ3N0b3JhZ2VDdXN0b21SZXF1ZXN0UGFyYW1zJyk7XG4gICAgdGhpcy5yZW1vdmUoJ3N0b3JhZ2VDdXN0b21QYXJhbXNSZWZyZXNoJyk7XG4gICAgdGhpcy5yZW1vdmUoJ2FjY2Vzc190b2tlbl9leHBpcmVzX2F0Jyk7XG4gIH1cblxuICByZXNldEF1dGhTdGF0ZUluU3RvcmFnZSgpIHtcbiAgICB0aGlzLnJlbW92ZSgnYXV0aHpEYXRhJyk7XG4gICAgdGhpcy5yZW1vdmUoJ2F1dGhuUmVzdWx0Jyk7XG4gIH1cblxuICBnZXRBY2Nlc3NUb2tlbigpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnJlYWQoJ2F1dGh6RGF0YScpO1xuICB9XG5cbiAgZ2V0SWRUb2tlbigpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnJlYWQoJ2F1dGhuUmVzdWx0Jyk/LmlkX3Rva2VuO1xuICB9XG5cbiAgZ2V0UmVmcmVzaFRva2VuKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZCgnYXV0aG5SZXN1bHQnKT8ucmVmcmVzaF90b2tlbjtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlS2V5V2l0aFByZWZpeChrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcbiAgICBjb25zdCBwcmVmaXggPSBjb25maWc/LmNsaWVudElkIHx8ICcnO1xuICAgIHJldHVybiBgJHtwcmVmaXh9XyR7a2V5fWA7XG4gIH1cbn1cbiJdfQ==