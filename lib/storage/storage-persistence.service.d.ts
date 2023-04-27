import { ConfigurationProvider } from '../config/config.provider';
import { AbstractSecurityStorage } from './abstract-security-storage';
import * as i0 from "@angular/core";
export declare type StorageKeys = 'authnResult' | 'authzData' | 'access_token_expires_at' | 'authWellKnownEndPoints' | 'userData' | 'authNonce' | 'codeVerifier' | 'authStateControl' | 'session_state' | 'storageSilentRenewRunning' | 'storageCustomRequestParams' | 'storageCustomParamsRefresh' | 'jwtKeys';
export declare class StoragePersistenceService {
    private readonly oidcSecurityStorage;
    private readonly configurationProvider;
    constructor(oidcSecurityStorage: AbstractSecurityStorage, configurationProvider: ConfigurationProvider);
    read(key: StorageKeys): any;
    write(key: StorageKeys, value: any): void;
    remove(key: StorageKeys): void;
    resetStorageFlowData(): void;
    resetAuthStateInStorage(): void;
    getAccessToken(): any;
    getIdToken(): any;
    getRefreshToken(): any;
    private createKeyWithPrefix;
    static ɵfac: i0.ɵɵFactoryDef<StoragePersistenceService, never>;
    static ɵprov: i0.ɵɵInjectableDef<StoragePersistenceService>;
}
//# sourceMappingURL=storage-persistence.service.d.ts.map