import { Observable } from 'rxjs';
import { DataService } from '../../api/data.service';
import { ConfigurationProvider } from '../../config/config.provider';
import { LoggerService } from '../../logging/logger.service';
import { StoragePersistenceService } from '../../storage/storage-persistence.service';
import { UrlService } from '../../utils/url/url.service';
import { TokenValidationService } from '../../validation/token-validation.service';
import { CallbackContext } from '../callback-context';
import { FlowsDataService } from '../flows-data.service';
import * as i0 from "@angular/core";
export declare class CodeFlowCallbackHandlerService {
    private readonly urlService;
    private readonly loggerService;
    private readonly tokenValidationService;
    private readonly flowsDataService;
    private readonly configurationProvider;
    private readonly storagePersistenceService;
    private readonly dataService;
    constructor(urlService: UrlService, loggerService: LoggerService, tokenValidationService: TokenValidationService, flowsDataService: FlowsDataService, configurationProvider: ConfigurationProvider, storagePersistenceService: StoragePersistenceService, dataService: DataService);
    codeFlowCallback(urlToCheck: string): Observable<CallbackContext>;
    codeFlowCodeRequest(callbackContext: CallbackContext): Observable<CallbackContext>;
    private handleRefreshRetry;
    static ɵfac: i0.ɵɵFactoryDef<CodeFlowCallbackHandlerService, never>;
    static ɵprov: i0.ɵɵInjectableDef<CodeFlowCallbackHandlerService>;
}
//# sourceMappingURL=code-flow-callback-handler.service.d.ts.map