import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
const STORAGE_KEY = 'redirect';
export class AutoLoginService {
    /**
     * Gets the stored redirect route from storage.
     */
    getStoredRedirectRoute() {
        return localStorage.getItem(STORAGE_KEY);
    }
    /**
     * Saves the redirect url to storage.
     *
     * @param url The redirect url to save.
     */
    saveStoredRedirectRoute(url) {
        localStorage.setItem(STORAGE_KEY, url);
    }
    /**
     * Removes the redirect url from storage.
     */
    deleteStoredRedirectRoute() {
        localStorage.removeItem(STORAGE_KEY);
    }
}
AutoLoginService.ɵfac = function AutoLoginService_Factory(t) { return new (t || AutoLoginService)(); };
AutoLoginService.ɵprov = i0.ɵɵdefineInjectable({ token: AutoLoginService, factory: AutoLoginService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AutoLoginService, [{
        type: Injectable
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1sb2dpbi1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvYXV0by1sb2dpbi9hdXRvLWxvZ2luLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFM0MsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDO0FBRy9CLE1BQU0sT0FBTyxnQkFBZ0I7SUFDM0I7O09BRUc7SUFDSCxzQkFBc0I7UUFDcEIsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsdUJBQXVCLENBQUMsR0FBVztRQUNqQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCx5QkFBeUI7UUFDdkIsWUFBWSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2QyxDQUFDOztnRkF0QlUsZ0JBQWdCO3dEQUFoQixnQkFBZ0IsV0FBaEIsZ0JBQWdCO2tEQUFoQixnQkFBZ0I7Y0FENUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmNvbnN0IFNUT1JBR0VfS0VZID0gJ3JlZGlyZWN0JztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEF1dG9Mb2dpblNlcnZpY2Uge1xyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHN0b3JlZCByZWRpcmVjdCByb3V0ZSBmcm9tIHN0b3JhZ2UuXHJcbiAgICovXHJcbiAgZ2V0U3RvcmVkUmVkaXJlY3RSb3V0ZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNhdmVzIHRoZSByZWRpcmVjdCB1cmwgdG8gc3RvcmFnZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgVGhlIHJlZGlyZWN0IHVybCB0byBzYXZlLlxyXG4gICAqL1xyXG4gIHNhdmVTdG9yZWRSZWRpcmVjdFJvdXRlKHVybDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTVE9SQUdFX0tFWSwgdXJsKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgdGhlIHJlZGlyZWN0IHVybCBmcm9tIHN0b3JhZ2UuXHJcbiAgICovXHJcbiAgZGVsZXRlU3RvcmVkUmVkaXJlY3RSb3V0ZSgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFNUT1JBR0VfS0VZKTtcclxuICB9XHJcbn1cclxuIl19