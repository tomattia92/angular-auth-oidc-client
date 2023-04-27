import { ConfigurationProvider } from '../config/config.provider';
import { CallbackContext } from '../flows/callback-context';
import { LoggerService } from '../logging/logger.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { EqualityService } from '../utils/equality/equality.service';
import { FlowHelper } from '../utils/flowHelper/flow-helper.service';
import { TokenHelperService } from '../utils/tokenHelper/oidc-token-helper.service';
import { StateValidationResult } from './state-validation-result';
import { TokenValidationService } from './token-validation.service';
import * as i0 from "@angular/core";
export declare class StateValidationService {
    private storagePersistenceService;
    private tokenValidationService;
    private tokenHelperService;
    private loggerService;
    private configurationProvider;
    private equalityService;
    private flowHelper;
    constructor(storagePersistenceService: StoragePersistenceService, tokenValidationService: TokenValidationService, tokenHelperService: TokenHelperService, loggerService: LoggerService, configurationProvider: ConfigurationProvider, equalityService: EqualityService, flowHelper: FlowHelper);
    getValidatedStateResult(callbackContext: CallbackContext): StateValidationResult;
    validateState(callbackContext: any): StateValidationResult;
    private isIdTokenAfterRefreshTokenRequestValid;
    private handleSuccessfulValidation;
    private handleUnsuccessfulValidation;
    static ɵfac: i0.ɵɵFactoryDef<StateValidationService, never>;
    static ɵprov: i0.ɵɵInjectableDef<StateValidationService>;
}
//# sourceMappingURL=state-validation.service.d.ts.map