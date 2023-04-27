import { ConfigurationProvider } from '../config/config.provider';
import { LoggerService } from '../logging/logger.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { RandomService } from './random/random.service';
import * as i0 from "@angular/core";
export declare class FlowsDataService {
    private storagePersistenceService;
    private randomService;
    private configurationProvider;
    private loggerService;
    constructor(storagePersistenceService: StoragePersistenceService, randomService: RandomService, configurationProvider: ConfigurationProvider, loggerService: LoggerService);
    createNonce(): string;
    setNonce(nonce: string): void;
    getAuthStateControl(): any;
    setAuthStateControl(authStateControl: string): void;
    getExistingOrCreateAuthStateControl(): any;
    setSessionState(sessionState: any): void;
    resetStorageFlowData(): void;
    getCodeVerifier(): any;
    createCodeVerifier(): string;
    isSilentRenewRunning(): boolean;
    setSilentRenewRunning(): void;
    resetSilentRenewRunning(): void;
    static ɵfac: i0.ɵɵFactoryDef<FlowsDataService, never>;
    static ɵprov: i0.ɵɵInjectableDef<FlowsDataService>;
}
//# sourceMappingURL=flows-data.service.d.ts.map