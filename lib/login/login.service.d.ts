import { Observable } from 'rxjs';
import { AuthOptions } from '../auth-options';
import { ConfigurationProvider } from '../config/config.provider';
import { LoginResponse } from './login-response';
import { ParLoginService } from './par/par-login.service';
import { PopUpLoginService } from './popup/popup-login.service';
import { PopupOptions } from './popup/popup-options';
import { StandardLoginService } from './standard/standard-login.service';
import * as i0 from "@angular/core";
export declare class LoginService {
    private configurationProvider;
    private parLoginService;
    private popUpLoginService;
    private standardLoginService;
    constructor(configurationProvider: ConfigurationProvider, parLoginService: ParLoginService, popUpLoginService: PopUpLoginService, standardLoginService: StandardLoginService);
    login(authOptions?: AuthOptions): void;
    loginWithPopUp(authOptions?: AuthOptions, popupOptions?: PopupOptions): Observable<LoginResponse>;
    static ɵfac: i0.ɵɵFactoryDef<LoginService, never>;
    static ɵprov: i0.ɵɵInjectableDef<LoginService>;
}
//# sourceMappingURL=login.service.d.ts.map