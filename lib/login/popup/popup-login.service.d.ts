import { Observable } from 'rxjs';
import { AuthOptions } from '../../auth-options';
import { AuthStateService } from '../../authState/auth-state.service';
import { CheckAuthService } from '../../check-auth.service';
import { AuthWellKnownService } from '../../config/auth-well-known.service';
import { ConfigurationProvider } from '../../config/config.provider';
import { LoggerService } from '../../logging/logger.service';
import { UserService } from '../../userData/user-service';
import { UrlService } from '../../utils/url/url.service';
import { LoginResponse } from '../login-response';
import { PopupOptions } from '../popup/popup-options';
import { PopUpService } from '../popup/popup.service';
import { ResponseTypeValidationService } from '../response-type-validation/response-type-validation.service';
import * as i0 from "@angular/core";
export declare class PopUpLoginService {
    private loggerService;
    private responseTypeValidationService;
    private urlService;
    private configurationProvider;
    private authWellKnownService;
    private popupService;
    private checkAuthService;
    private userService;
    private authStateService;
    constructor(loggerService: LoggerService, responseTypeValidationService: ResponseTypeValidationService, urlService: UrlService, configurationProvider: ConfigurationProvider, authWellKnownService: AuthWellKnownService, popupService: PopUpService, checkAuthService: CheckAuthService, userService: UserService, authStateService: AuthStateService);
    loginWithPopUpStandard(authOptions?: AuthOptions, popupOptions?: PopupOptions): Observable<LoginResponse>;
    static ɵfac: i0.ɵɵFactoryDef<PopUpLoginService, never>;
    static ɵprov: i0.ɵɵInjectableDef<PopUpLoginService>;
}
//# sourceMappingURL=popup-login.service.d.ts.map