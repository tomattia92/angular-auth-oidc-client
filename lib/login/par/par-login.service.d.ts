import { Observable } from 'rxjs';
import { AuthOptions } from '../../auth-options';
import { AuthStateService } from '../../authState/auth-state.service';
import { CheckAuthService } from '../../check-auth.service';
import { AuthWellKnownService } from '../../config/auth-well-known.service';
import { ConfigurationProvider } from '../../config/config.provider';
import { LoggerService } from '../../logging/logger.service';
import { UserService } from '../../userData/user-service';
import { RedirectService } from '../../utils/redirect/redirect.service';
import { UrlService } from '../../utils/url/url.service';
import { LoginResponse } from '../login-response';
import { PopupOptions } from '../popup/popup-options';
import { PopUpService } from '../popup/popup.service';
import { ResponseTypeValidationService } from '../response-type-validation/response-type-validation.service';
import { ParService } from './par.service';
import * as i0 from "@angular/core";
export declare class ParLoginService {
    private loggerService;
    private responseTypeValidationService;
    private urlService;
    private redirectService;
    private configurationProvider;
    private authWellKnownService;
    private popupService;
    private checkAuthService;
    private userService;
    private authStateService;
    private parService;
    constructor(loggerService: LoggerService, responseTypeValidationService: ResponseTypeValidationService, urlService: UrlService, redirectService: RedirectService, configurationProvider: ConfigurationProvider, authWellKnownService: AuthWellKnownService, popupService: PopUpService, checkAuthService: CheckAuthService, userService: UserService, authStateService: AuthStateService, parService: ParService);
    loginPar(authOptions?: AuthOptions): void;
    loginWithPopUpPar(authOptions?: AuthOptions, popupOptions?: PopupOptions): Observable<LoginResponse>;
    static ɵfac: i0.ɵɵFactoryDef<ParLoginService, never>;
    static ɵprov: i0.ɵɵInjectableDef<ParLoginService>;
}
//# sourceMappingURL=par-login.service.d.ts.map