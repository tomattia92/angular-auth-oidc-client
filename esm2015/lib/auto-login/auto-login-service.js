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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1sb2dpbi1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvYXV0by1sb2dpbi9hdXRvLWxvZ2luLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFM0MsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDO0FBRy9CLE1BQU0sT0FBTyxnQkFBZ0I7SUFDM0I7O09BRUc7SUFDSCxzQkFBc0I7UUFDcEIsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsdUJBQXVCLENBQUMsR0FBVztRQUNqQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCx5QkFBeUI7UUFDdkIsWUFBWSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2QyxDQUFDOztnRkF0QlUsZ0JBQWdCO3dEQUFoQixnQkFBZ0IsV0FBaEIsZ0JBQWdCO2tEQUFoQixnQkFBZ0I7Y0FENUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuY29uc3QgU1RPUkFHRV9LRVkgPSAncmVkaXJlY3QnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0b0xvZ2luU2VydmljZSB7XG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzdG9yZWQgcmVkaXJlY3Qgcm91dGUgZnJvbSBzdG9yYWdlLlxuICAgKi9cbiAgZ2V0U3RvcmVkUmVkaXJlY3RSb3V0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWSk7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIHJlZGlyZWN0IHVybCB0byBzdG9yYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gdXJsIFRoZSByZWRpcmVjdCB1cmwgdG8gc2F2ZS5cbiAgICovXG4gIHNhdmVTdG9yZWRSZWRpcmVjdFJvdXRlKHVybDogc3RyaW5nKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVksIHVybCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgcmVkaXJlY3QgdXJsIGZyb20gc3RvcmFnZS5cbiAgICovXG4gIGRlbGV0ZVN0b3JlZFJlZGlyZWN0Um91dGUoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oU1RPUkFHRV9LRVkpO1xuICB9XG59XG4iXX0=