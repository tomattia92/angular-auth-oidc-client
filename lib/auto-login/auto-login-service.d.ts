import * as i0 from "@angular/core";
export declare class AutoLoginService {
    /**
     * Gets the stored redirect route from storage.
     */
    getStoredRedirectRoute(): string;
    /**
     * Saves the redirect url to storage.
     *
     * @param url The redirect url to save.
     */
    saveStoredRedirectRoute(url: string): void;
    /**
     * Removes the redirect url from storage.
     */
    deleteStoredRedirectRoute(): void;
    static ɵfac: i0.ɵɵFactoryDef<AutoLoginService, never>;
    static ɵprov: i0.ɵɵInjectableDef<AutoLoginService>;
}
//# sourceMappingURL=auto-login-service.d.ts.map