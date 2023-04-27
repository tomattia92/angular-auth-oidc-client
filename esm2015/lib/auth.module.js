import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
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
import { BrowserStorageService } from './storage/browser-storage.service';
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
export class AuthModule {
    static forRoot(token = {}) {
        return {
            ngModule: AuthModule,
            providers: [
                OidcConfigService,
                PublicEventsService,
                FlowHelper,
                OidcSecurityService,
                TokenValidationService,
                PlatformProvider,
                CheckSessionService,
                FlowsDataService,
                FlowsService,
                SilentRenewService,
                ConfigurationProvider,
                LogoffRevocationService,
                UserService,
                RandomService,
                HttpBaseService,
                UrlService,
                AuthStateService,
                SigninKeyDataService,
                StoragePersistenceService,
                TokenHelperService,
                LoggerService,
                IFrameService,
                EqualityService,
                LoginService,
                ParService,
                AuthWellKnownDataService,
                AuthWellKnownService,
                DataService,
                StateValidationService,
                ConfigValidationService,
                CheckAuthService,
                ResetAuthDataService,
                ImplicitFlowCallbackService,
                HistoryJwtKeysCallbackHandlerService,
                ResponseTypeValidationService,
                UserCallbackHandlerService,
                StateValidationCallbackHandlerService,
                RefreshSessionCallbackHandlerService,
                RefreshTokenCallbackHandlerService,
                CodeFlowCallbackHandlerService,
                ImplicitFlowCallbackHandlerService,
                ParLoginService,
                PopUpLoginService,
                StandardLoginService,
                AutoLoginService,
                {
                    provide: AbstractSecurityStorage,
                    useClass: token.storage || BrowserStorageService,
                },
            ],
        };
    }
}
AuthModule.ɵmod = i0.ɵɵdefineNgModule({ type: AuthModule });
AuthModule.ɵinj = i0.ɵɵdefineInjector({ factory: function AuthModule_Factory(t) { return new (t || AuthModule)(); }, imports: [[CommonModule, HttpClientModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AuthModule, { imports: [CommonModule, HttpClientModule] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AuthModule, [{
        type: NgModule,
        args: [{
                imports: [CommonModule, HttpClientModule],
                declarations: [],
                exports: [],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9hdXRoLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDakQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzFELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQzlHLE9BQU8sRUFBRSxvQ0FBb0MsRUFBRSxNQUFNLHFFQUFxRSxDQUFDO0FBQzNILE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLGtF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Q2hCLG9CQUFvQjtnQkFDcEIseUJBQXlCO2dCQUN6QixrQkFBa0I7Z0JBQ2xCLGFBQWE7Z0JBQ2IsYUFBYTtnQkFDYixlQUFlO2dCQUNmLFlBQVk7Z0JBQ1osVUFBVTtnQkFDVix3QkFBd0I7Z0JBQ3hCLG9CQUFvQjtnQkFDcEIsV0FBVztnQkFDWCxzQkFBc0I7Z0JBQ3RCLHVCQUF1QjtnQkFDdkIsZ0JBQWdCO2dCQUNoQixvQkFBb0I7Z0JBQ3BCLDJCQUEyQjtnQkFDM0Isb0NBQW9DO2dCQUNwQyw2QkFBNkI7Z0JBQzdCLDBCQUEwQjtnQkFDMUIscUNBQXFDO2dCQUNyQyxvQ0FBb0M7Z0JBQ3BDLGtDQUFrQztnQkFDbEMsOEJBQThCO2dCQUM5QixrQ0FBa0M7Z0JBQ2xDLGVBQWU7Z0JBQ2YsaUJBQWlCO2dCQUNqQixvQkFBb0I7Z0JBQ3BCLGdCQUFnQjtnQkFDaEI7b0JBQ0UsT0FBTyxFQUFFLHVCQUF1QjtvQkFDaEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLElBQUkscUJBQXFCO2lCQUNqRDthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7OzhDQXhEVSxVQUFVO21HQUFWLFVBQVUsa0JBSlosQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7d0ZBSTlCLFVBQVUsY0FKWCxZQUFZLEVBQUUsZ0JBQWdCO2tEQUk3QixVQUFVO2NBTHRCLFFBQVE7ZUFBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7Z0JBQ3pDLFlBQVksRUFBRSxFQUFFO2dCQUNoQixPQUFPLEVBQUUsRUFBRTthQUNaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2UgfSBmcm9tICcuL2FwaS9kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgSHR0cEJhc2VTZXJ2aWNlIH0gZnJvbSAnLi9hcGkvaHR0cC1iYXNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4vYXV0aFN0YXRlL2F1dGgtc3RhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBBdXRvTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9hdXRvLWxvZ2luL2F1dG8tbG9naW4tc2VydmljZSc7XG5pbXBvcnQgeyBJbXBsaWNpdEZsb3dDYWxsYmFja1NlcnZpY2UgfSBmcm9tICcuL2NhbGxiYWNrL2ltcGxpY2l0LWZsb3ctY2FsbGJhY2suc2VydmljZSc7XG5pbXBvcnQgeyBDaGVja0F1dGhTZXJ2aWNlIH0gZnJvbSAnLi9jaGVjay1hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29uZmlnVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuL2NvbmZpZy12YWxpZGF0aW9uL2NvbmZpZy12YWxpZGF0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXV0aFdlbGxLbm93bkRhdGFTZXJ2aWNlIH0gZnJvbSAnLi9jb25maWcvYXV0aC13ZWxsLWtub3duLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBBdXRoV2VsbEtub3duU2VydmljZSB9IGZyb20gJy4vY29uZmlnL2F1dGgtd2VsbC1rbm93bi5zZXJ2aWNlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XG5pbXBvcnQgeyBPaWRjQ29uZmlnU2VydmljZSB9IGZyb20gJy4vY29uZmlnL2NvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7IENvZGVGbG93Q2FsbGJhY2tIYW5kbGVyU2VydmljZSB9IGZyb20gJy4vZmxvd3MvY2FsbGJhY2staGFuZGxpbmcvY29kZS1mbG93LWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBIaXN0b3J5Snd0S2V5c0NhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL2hpc3Rvcnktand0LWtleXMtY2FsbGJhY2staGFuZGxlci5zZXJ2aWNlJztcbmltcG9ydCB7IEltcGxpY2l0Rmxvd0NhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL2ltcGxpY2l0LWZsb3ctY2FsbGJhY2staGFuZGxlci5zZXJ2aWNlJztcbmltcG9ydCB7IFJlZnJlc2hTZXNzaW9uQ2FsbGJhY2tIYW5kbGVyU2VydmljZSB9IGZyb20gJy4vZmxvd3MvY2FsbGJhY2staGFuZGxpbmcvcmVmcmVzaC1zZXNzaW9uLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBSZWZyZXNoVG9rZW5DYWxsYmFja0hhbmRsZXJTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9yZWZyZXNoLXRva2VuLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0ZVZhbGlkYXRpb25DYWxsYmFja0hhbmRsZXJTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9zdGF0ZS12YWxpZGF0aW9uLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyQ2FsbGJhY2tIYW5kbGVyU2VydmljZSB9IGZyb20gJy4vZmxvd3MvY2FsbGJhY2staGFuZGxpbmcvdXNlci1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmxvd3NEYXRhU2VydmljZSB9IGZyb20gJy4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEZsb3dzU2VydmljZSB9IGZyb20gJy4vZmxvd3MvZmxvd3Muc2VydmljZSc7XG5pbXBvcnQgeyBSYW5kb21TZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy9yYW5kb20vcmFuZG9tLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzZXRBdXRoRGF0YVNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL3Jlc2V0LWF1dGgtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IFNpZ25pbktleURhdGFTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy9zaWduaW4ta2V5LWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBDaGVja1Nlc3Npb25TZXJ2aWNlIH0gZnJvbSAnLi9pZnJhbWUvY2hlY2stc2Vzc2lvbi5zZXJ2aWNlJztcbmltcG9ydCB7IElGcmFtZVNlcnZpY2UgfSBmcm9tICcuL2lmcmFtZS9leGlzdGluZy1pZnJhbWUuc2VydmljZSc7XG5pbXBvcnQgeyBTaWxlbnRSZW5ld1NlcnZpY2UgfSBmcm9tICcuL2lmcmFtZS9zaWxlbnQtcmVuZXcuc2VydmljZSc7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4vbG9naW4vbG9naW4uc2VydmljZSc7XG5pbXBvcnQgeyBQYXJMb2dpblNlcnZpY2UgfSBmcm9tICcuL2xvZ2luL3Bhci9wYXItbG9naW4uc2VydmljZSc7XG5pbXBvcnQgeyBQYXJTZXJ2aWNlIH0gZnJvbSAnLi9sb2dpbi9wYXIvcGFyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9wVXBMb2dpblNlcnZpY2UgfSBmcm9tICcuL2xvZ2luL3BvcHVwL3BvcHVwLWxvZ2luLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuL2xvZ2luL3Jlc3BvbnNlLXR5cGUtdmFsaWRhdGlvbi9yZXNwb25zZS10eXBlLXZhbGlkYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBTdGFuZGFyZExvZ2luU2VydmljZSB9IGZyb20gJy4vbG9naW4vc3RhbmRhcmQvc3RhbmRhcmQtbG9naW4uc2VydmljZSc7XG5pbXBvcnQgeyBMb2dvZmZSZXZvY2F0aW9uU2VydmljZSB9IGZyb20gJy4vbG9nb2ZmUmV2b2tlL2xvZ29mZi1yZXZvY2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgT2lkY1NlY3VyaXR5U2VydmljZSB9IGZyb20gJy4vb2lkYy5zZWN1cml0eS5zZXJ2aWNlJztcbmltcG9ydCB7IFB1YmxpY0V2ZW50c1NlcnZpY2UgfSBmcm9tICcuL3B1YmxpYy1ldmVudHMvcHVibGljLWV2ZW50cy5zZXJ2aWNlJztcbmltcG9ydCB7IEFic3RyYWN0U2VjdXJpdHlTdG9yYWdlIH0gZnJvbSAnLi9zdG9yYWdlL2Fic3RyYWN0LXNlY3VyaXR5LXN0b3JhZ2UnO1xuaW1wb3J0IHsgQnJvd3NlclN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9zdG9yYWdlL2Jyb3dzZXItc3RvcmFnZS5zZXJ2aWNlJztcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuL3N0b3JhZ2Uvc3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi91c2VyRGF0YS91c2VyLXNlcnZpY2UnO1xuaW1wb3J0IHsgRXF1YWxpdHlTZXJ2aWNlIH0gZnJvbSAnLi91dGlscy9lcXVhbGl0eS9lcXVhbGl0eS5zZXJ2aWNlJztcbmltcG9ydCB7IEZsb3dIZWxwZXIgfSBmcm9tICcuL3V0aWxzL2Zsb3dIZWxwZXIvZmxvdy1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQbGF0Zm9ybVByb3ZpZGVyIH0gZnJvbSAnLi91dGlscy9wbGF0Zm9ybS1wcm92aWRlci9wbGF0Zm9ybS5wcm92aWRlcic7XG5pbXBvcnQgeyBUb2tlbkhlbHBlclNlcnZpY2UgfSBmcm9tICcuL3V0aWxzL3Rva2VuSGVscGVyL29pZGMtdG9rZW4taGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXJsU2VydmljZSB9IGZyb20gJy4vdXRpbHMvdXJsL3VybC5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRlVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuL3ZhbGlkYXRpb24vc3RhdGUtdmFsaWRhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IFRva2VuVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuL3ZhbGlkYXRpb24vdG9rZW4tdmFsaWRhdGlvbi5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgSHR0cENsaWVudE1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW10sXG4gIGV4cG9ydHM6IFtdLFxufSlcbmV4cG9ydCBjbGFzcyBBdXRoTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QodG9rZW46IFRva2VuID0ge30pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEF1dGhNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgT2lkY0NvbmZpZ1NlcnZpY2UsXG4gICAgICAgIFB1YmxpY0V2ZW50c1NlcnZpY2UsXG4gICAgICAgIEZsb3dIZWxwZXIsXG4gICAgICAgIE9pZGNTZWN1cml0eVNlcnZpY2UsXG4gICAgICAgIFRva2VuVmFsaWRhdGlvblNlcnZpY2UsXG4gICAgICAgIFBsYXRmb3JtUHJvdmlkZXIsXG4gICAgICAgIENoZWNrU2Vzc2lvblNlcnZpY2UsXG4gICAgICAgIEZsb3dzRGF0YVNlcnZpY2UsXG4gICAgICAgIEZsb3dzU2VydmljZSxcbiAgICAgICAgU2lsZW50UmVuZXdTZXJ2aWNlLFxuICAgICAgICBDb25maWd1cmF0aW9uUHJvdmlkZXIsXG4gICAgICAgIExvZ29mZlJldm9jYXRpb25TZXJ2aWNlLFxuICAgICAgICBVc2VyU2VydmljZSxcbiAgICAgICAgUmFuZG9tU2VydmljZSxcbiAgICAgICAgSHR0cEJhc2VTZXJ2aWNlLFxuICAgICAgICBVcmxTZXJ2aWNlLFxuICAgICAgICBBdXRoU3RhdGVTZXJ2aWNlLFxuICAgICAgICBTaWduaW5LZXlEYXRhU2VydmljZSxcbiAgICAgICAgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcbiAgICAgICAgVG9rZW5IZWxwZXJTZXJ2aWNlLFxuICAgICAgICBMb2dnZXJTZXJ2aWNlLFxuICAgICAgICBJRnJhbWVTZXJ2aWNlLFxuICAgICAgICBFcXVhbGl0eVNlcnZpY2UsXG4gICAgICAgIExvZ2luU2VydmljZSxcbiAgICAgICAgUGFyU2VydmljZSxcbiAgICAgICAgQXV0aFdlbGxLbm93bkRhdGFTZXJ2aWNlLFxuICAgICAgICBBdXRoV2VsbEtub3duU2VydmljZSxcbiAgICAgICAgRGF0YVNlcnZpY2UsXG4gICAgICAgIFN0YXRlVmFsaWRhdGlvblNlcnZpY2UsXG4gICAgICAgIENvbmZpZ1ZhbGlkYXRpb25TZXJ2aWNlLFxuICAgICAgICBDaGVja0F1dGhTZXJ2aWNlLFxuICAgICAgICBSZXNldEF1dGhEYXRhU2VydmljZSxcbiAgICAgICAgSW1wbGljaXRGbG93Q2FsbGJhY2tTZXJ2aWNlLFxuICAgICAgICBIaXN0b3J5Snd0S2V5c0NhbGxiYWNrSGFuZGxlclNlcnZpY2UsXG4gICAgICAgIFJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLFxuICAgICAgICBVc2VyQ2FsbGJhY2tIYW5kbGVyU2VydmljZSxcbiAgICAgICAgU3RhdGVWYWxpZGF0aW9uQ2FsbGJhY2tIYW5kbGVyU2VydmljZSxcbiAgICAgICAgUmVmcmVzaFNlc3Npb25DYWxsYmFja0hhbmRsZXJTZXJ2aWNlLFxuICAgICAgICBSZWZyZXNoVG9rZW5DYWxsYmFja0hhbmRsZXJTZXJ2aWNlLFxuICAgICAgICBDb2RlRmxvd0NhbGxiYWNrSGFuZGxlclNlcnZpY2UsXG4gICAgICAgIEltcGxpY2l0Rmxvd0NhbGxiYWNrSGFuZGxlclNlcnZpY2UsXG4gICAgICAgIFBhckxvZ2luU2VydmljZSxcbiAgICAgICAgUG9wVXBMb2dpblNlcnZpY2UsXG4gICAgICAgIFN0YW5kYXJkTG9naW5TZXJ2aWNlLFxuICAgICAgICBBdXRvTG9naW5TZXJ2aWNlLFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQWJzdHJhY3RTZWN1cml0eVN0b3JhZ2UsXG4gICAgICAgICAgdXNlQ2xhc3M6IHRva2VuLnN0b3JhZ2UgfHwgQnJvd3NlclN0b3JhZ2VTZXJ2aWNlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIFR5cGU8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRva2VuIHtcbiAgc3RvcmFnZT86IFR5cGU8YW55Pjtcbn1cbiJdfQ==