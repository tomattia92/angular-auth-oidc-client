import { AuthStateService } from '../authState/auth-state.service';
import { ConfigurationProvider } from '../config/config.provider';
import { FlowsDataService } from '../flows/flows-data.service';
import { ResetAuthDataService } from '../flows/reset-auth-data.service';
import { RefreshSessionIframeService } from '../iframe/refresh-session-iframe.service';
import { LoggerService } from '../logging/logger.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { UserService } from '../userData/user-service';
import { FlowHelper } from '../utils/flowHelper/flow-helper.service';
import { IntervallService } from './intervall.service';
import { RefreshSessionRefreshTokenService } from './refresh-session-refresh-token.service';
import * as i0 from "@angular/core";
export declare class PeriodicallyTokenCheckService {
    private resetAuthDataService;
    private flowHelper;
    private configurationProvider;
    private flowsDataService;
    private loggerService;
    private userService;
    private authStateService;
    private refreshSessionIframeService;
    private refreshSessionRefreshTokenService;
    private intervalService;
    private storagePersistenceService;
    constructor(resetAuthDataService: ResetAuthDataService, flowHelper: FlowHelper, configurationProvider: ConfigurationProvider, flowsDataService: FlowsDataService, loggerService: LoggerService, userService: UserService, authStateService: AuthStateService, refreshSessionIframeService: RefreshSessionIframeService, refreshSessionRefreshTokenService: RefreshSessionRefreshTokenService, intervalService: IntervallService, storagePersistenceService: StoragePersistenceService);
    startTokenValidationPeriodically(repeatAfterSeconds: number): void;
    static ɵfac: i0.ɵɵFactoryDef<PeriodicallyTokenCheckService, never>;
    static ɵprov: i0.ɵɵInjectableDef<PeriodicallyTokenCheckService>;
}
//# sourceMappingURL=periodically-token-check.service.d.ts.map