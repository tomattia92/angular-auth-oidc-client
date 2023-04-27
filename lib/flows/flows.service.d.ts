import { Observable } from 'rxjs';
import { CallbackContext } from './callback-context';
import { CodeFlowCallbackHandlerService } from './callback-handling/code-flow-callback-handler.service';
import { HistoryJwtKeysCallbackHandlerService } from './callback-handling/history-jwt-keys-callback-handler.service';
import { ImplicitFlowCallbackHandlerService } from './callback-handling/implicit-flow-callback-handler.service';
import { RefreshSessionCallbackHandlerService } from './callback-handling/refresh-session-callback-handler.service';
import { RefreshTokenCallbackHandlerService } from './callback-handling/refresh-token-callback-handler.service';
import { StateValidationCallbackHandlerService } from './callback-handling/state-validation-callback-handler.service';
import { UserCallbackHandlerService } from './callback-handling/user-callback-handler.service';
import * as i0 from "@angular/core";
export declare class FlowsService {
    private readonly codeFlowCallbackHandlerService;
    private readonly implicitFlowCallbackHandlerService;
    private readonly historyJwtKeysCallbackHandlerService;
    private readonly userHandlerService;
    private readonly stateValidationCallbackHandlerService;
    private readonly refreshSessionCallbackHandlerService;
    private readonly refreshTokenCallbackHandlerService;
    constructor(codeFlowCallbackHandlerService: CodeFlowCallbackHandlerService, implicitFlowCallbackHandlerService: ImplicitFlowCallbackHandlerService, historyJwtKeysCallbackHandlerService: HistoryJwtKeysCallbackHandlerService, userHandlerService: UserCallbackHandlerService, stateValidationCallbackHandlerService: StateValidationCallbackHandlerService, refreshSessionCallbackHandlerService: RefreshSessionCallbackHandlerService, refreshTokenCallbackHandlerService: RefreshTokenCallbackHandlerService);
    processCodeFlowCallback(urlToCheck: string): Observable<CallbackContext>;
    processSilentRenewCodeFlowCallback(firstContext: CallbackContext): Observable<CallbackContext>;
    processImplicitFlowCallback(hash?: string): Observable<CallbackContext>;
    processRefreshToken(customParamsRefresh?: {
        [key: string]: string | number | boolean;
    }): Observable<CallbackContext>;
    static ɵfac: i0.ɵɵFactoryDef<FlowsService, never>;
    static ɵprov: i0.ɵɵInjectableDef<FlowsService>;
}
//# sourceMappingURL=flows.service.d.ts.map