import { Observable } from 'rxjs';
import { AuthStateService } from '../../authState/auth-state.service';
import { ConfigurationProvider } from '../../config/config.provider';
import { LoggerService } from '../../logging/logger.service';
import { StoragePersistenceService } from '../../storage/storage-persistence.service';
import { CallbackContext } from '../callback-context';
import { FlowsDataService } from '../flows-data.service';
import { ResetAuthDataService } from '../reset-auth-data.service';
import { SigninKeyDataService } from '../signin-key-data.service';
import * as i0 from "@angular/core";
export declare class HistoryJwtKeysCallbackHandlerService {
    private readonly loggerService;
    private readonly configurationProvider;
    private readonly authStateService;
    private readonly flowsDataService;
    private readonly signInKeyDataService;
    private readonly storagePersistenceService;
    private readonly resetAuthDataService;
    constructor(loggerService: LoggerService, configurationProvider: ConfigurationProvider, authStateService: AuthStateService, flowsDataService: FlowsDataService, signInKeyDataService: SigninKeyDataService, storagePersistenceService: StoragePersistenceService, resetAuthDataService: ResetAuthDataService);
    callbackHistoryAndResetJwtKeys(callbackContext: CallbackContext): Observable<CallbackContext>;
    private handleResultErrorFromCallback;
    private historyCleanUpTurnedOn;
    private resetBrowserHistory;
    private storeSigningKeys;
    private readSigningKeys;
    static ɵfac: i0.ɵɵFactoryDef<HistoryJwtKeysCallbackHandlerService, never>;
    static ɵprov: i0.ɵɵInjectableDef<HistoryJwtKeysCallbackHandlerService>;
}
//# sourceMappingURL=history-jwt-keys-callback-handler.service.d.ts.map