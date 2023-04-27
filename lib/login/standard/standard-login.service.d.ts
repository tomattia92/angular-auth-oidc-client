import { AuthOptions } from '../../auth-options';
import { AuthWellKnownService } from '../../config/auth-well-known.service';
import { ConfigurationProvider } from '../../config/config.provider';
import { LoggerService } from '../../logging/logger.service';
import { RedirectService } from '../../utils/redirect/redirect.service';
import { UrlService } from '../../utils/url/url.service';
import { ResponseTypeValidationService } from '../response-type-validation/response-type-validation.service';
import * as i0 from "@angular/core";
export declare class StandardLoginService {
    private loggerService;
    private responseTypeValidationService;
    private urlService;
    private redirectService;
    private configurationProvider;
    private authWellKnownService;
    constructor(loggerService: LoggerService, responseTypeValidationService: ResponseTypeValidationService, urlService: UrlService, redirectService: RedirectService, configurationProvider: ConfigurationProvider, authWellKnownService: AuthWellKnownService);
    loginStandard(authOptions?: AuthOptions): void;
    static ɵfac: i0.ɵɵFactoryDef<StandardLoginService, never>;
    static ɵprov: i0.ɵɵInjectableDef<StandardLoginService>;
}
//# sourceMappingURL=standard-login.service.d.ts.map