import { DataService } from './api/data.service';
import { HttpBaseService } from './api/http-base.service';
import { AuthStateService } from './authState/auth-state.service';
import { AutoLoginService } from './auto-login/auto-login-service';
import { ImplicitFlowCallbackService } from './callback/implicit-flow-callback.service';
import { CheckAuthService } from './check-auth.service';
import { ConfigValidationService } from './config-validation/config-validation.service';
import { AuthWellKnownDataService } from './config/auth-well-known-data.service';
import { AuthWellKnownService } from './config/auth-well-known.service';
import { ConfigurationProvider } from './config/config.provider';
import { OidcConfigService } from './config/config.service';
import { CodeFlowCallbackHandlerService } from './flows/callback-handling/code-flow-callback-handler.service';
import { HistoryJwtKeysCallbackHandlerService } from './flows/callback-handling/history-jwt-keys-callback-handler.service';
import { ImplicitFlowCallbackHandlerService } from './flows/callback-handling/implicit-flow-callback-handler.service';
import { RefreshSessionCallbackHandlerService } from './flows/callback-handling/refresh-session-callback-handler.service';
import { RefreshTokenCallbackHandlerService } from './flows/callback-handling/refresh-token-callback-handler.service';
import { StateValidationCallbackHandlerService } from './flows/callback-handling/state-validation-callback-handler.service';
import { UserCallbackHandlerService } from './flows/callback-handling/user-callback-handler.service';
import { FlowsDataService } from './flows/flows-data.service';
import { FlowsService } from './flows/flows.service';
import { RandomService } from './flows/random/random.service';
import { ResetAuthDataService } from './flows/reset-auth-data.service';
import { SigninKeyDataService } from './flows/signin-key-data.service';
import { CheckSessionService } from './iframe/check-session.service';
import { IFrameService } from './iframe/existing-iframe.service';
import { SilentRenewService } from './iframe/silent-renew.service';
import { LoggerService } from './logging/logger.service';
import { LoginService } from './login/login.service';
import { ParLoginService } from './login/par/par-login.service';
import { ParService } from './login/par/par.service';
import { PopUpLoginService } from './login/popup/popup-login.service';
import { ResponseTypeValidationService } from './login/response-type-validation/response-type-validation.service';
import { StandardLoginService } from './login/standard/standard-login.service';
import { LogoffRevocationService } from './logoffRevoke/logoff-revocation.service';
import { OidcSecurityService } from './oidc.security.service';
import { PublicEventsService } from './public-events/public-events.service';
import { AbstractSecurityStorage } from './storage/abstract-security-storage';
import { StoragePersistenceService } from './storage/storage-persistence.service';
import { UserService } from './userData/user-service';
import { EqualityService } from './utils/equality/equality.service';
import { FlowHelper } from './utils/flowHelper/flow-helper.service';
import { PlatformProvider } from './utils/platform-provider/platform.provider';
import { TokenHelperService } from './utils/tokenHelper/oidc-token-helper.service';
import { UrlService } from './utils/url/url.service';
import { StateValidationService } from './validation/state-validation.service';
import { TokenValidationService } from './validation/token-validation.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/common/http";
export declare class AuthModule {
    static forRoot(token?: Token): i0.ModuleWithProviders<AuthModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<AuthModule, never, [typeof i1.CommonModule, typeof i2.HttpClientModule], never>;
    static ɵinj: i0.ɵɵInjectorDef<AuthModule>;
}
export declare type Type<T> = new (...args: any[]) => T;
export interface Token {
    storage?: Type<any>;
}
//# sourceMappingURL=auth.module.d.ts.map