import { Observable } from 'rxjs';
import { AuthStateService } from '../../authState/auth-state.service';
import { ConfigurationProvider } from '../../config/config.provider';
import { LoggerService } from '../../logging/logger.service';
import { UserService } from '../../userData/user-service';
import { CallbackContext } from '../callback-context';
import { FlowsDataService } from '../flows-data.service';
import { ResetAuthDataService } from '../reset-auth-data.service';
import * as i0 from "@angular/core";
export declare class UserCallbackHandlerService {
    private readonly loggerService;
    private readonly configurationProvider;
    private readonly authStateService;
    private readonly flowsDataService;
    private readonly userService;
    private readonly resetAuthDataService;
    constructor(loggerService: LoggerService, configurationProvider: ConfigurationProvider, authStateService: AuthStateService, flowsDataService: FlowsDataService, userService: UserService, resetAuthDataService: ResetAuthDataService);
    callbackUser(callbackContext: CallbackContext): Observable<CallbackContext>;
    private publishAuthorizedState;
    private publishUnauthorizedState;
    static ɵfac: i0.ɵɵFactoryDef<UserCallbackHandlerService, never>;
    static ɵprov: i0.ɵɵInjectableDef<UserCallbackHandlerService>;
}
//# sourceMappingURL=user-callback-handler.service.d.ts.map