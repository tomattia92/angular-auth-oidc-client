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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9hdXRoLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDakQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzFELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQzlHLE9BQU8sRUFBRSxvQ0FBb0MsRUFBRSxNQUFNLHFFQUFxRSxDQUFDO0FBQzNILE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQ3RILE9BQU8sRUFBRSxvQ0FBb0MsRUFBRSxNQUFNLG9FQUFvRSxDQUFDO0FBQzFILE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQ3RILE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxNQUFNLHFFQUFxRSxDQUFDO0FBQzVILE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQ3JHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN0RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxtRUFBbUUsQ0FBQztBQUNsSCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNsRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNuRixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDL0UsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7O0FBTy9FLE1BQU0sT0FBTyxVQUFVO0lBQ3JCLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBZSxFQUFFO1FBQzlCLE9BQU87WUFDTCxRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUU7Z0JBQ1QsaUJBQWlCO2dCQUNqQixtQkFBbUI7Z0JBQ25CLFVBQVU7Z0JBQ1YsbUJBQW1CO2dCQUNuQixzQkFBc0I7Z0JBQ3RCLGdCQUFnQjtnQkFDaEIsbUJBQW1CO2dCQUNuQixnQkFBZ0I7Z0JBQ2hCLFlBQVk7Z0JBQ1osa0JBQWtCO2dCQUNsQixxQkFBcUI7Z0JBQ3JCLHVCQUF1QjtnQkFDdkIsV0FBVztnQkFDWCxhQUFhO2dCQUNiLGVBQWU7Z0JBQ2YsVUFBVTtnQkFDVixnQkFBZ0I7Z0JBQ2hCLG9CQUFvQjtnQkFDcEIseUJBQXlCO2dCQUN6QixrQkFBa0I7Z0JBQ2xCLGFBQWE7Z0JBQ2IsYUFBYTtnQkFDYixlQUFlO2dCQUNmLFlBQVk7Z0JBQ1osVUFBVTtnQkFDVix3QkFBd0I7Z0JBQ3hCLG9CQUFvQjtnQkFDcEIsV0FBVztnQkFDWCxzQkFBc0I7Z0JBQ3RCLHVCQUF1QjtnQkFDdkIsZ0JBQWdCO2dCQUNoQixvQkFBb0I7Z0JBQ3BCLDJCQUEyQjtnQkFDM0Isb0NBQW9DO2dCQUNwQyw2QkFBNkI7Z0JBQzdCLDBCQUEwQjtnQkFDMUIscUNBQXFDO2dCQUNyQyxvQ0FBb0M7Z0JBQ3BDLGtDQUFrQztnQkFDbEMsOEJBQThCO2dCQUM5QixrQ0FBa0M7Z0JBQ2xDLGVBQWU7Z0JBQ2YsaUJBQWlCO2dCQUNqQixvQkFBb0I7Z0JBQ3BCLGdCQUFnQjtnQkFDaEI7b0JBQ0UsT0FBTyxFQUFFLHVCQUF1QjtvQkFDaEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLElBQUkscUJBQXFCO2lCQUNqRDthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7OzhDQXhEVSxVQUFVO21HQUFWLFVBQVUsa0JBSlosQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7d0ZBSTlCLFVBQVUsY0FKWCxZQUFZLEVBQUUsZ0JBQWdCO2tEQUk3QixVQUFVO2NBTHRCLFFBQVE7ZUFBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7Z0JBQ3pDLFlBQVksRUFBRSxFQUFFO2dCQUNoQixPQUFPLEVBQUUsRUFBRTthQUNaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRGF0YVNlcnZpY2UgfSBmcm9tICcuL2FwaS9kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBIdHRwQmFzZVNlcnZpY2UgfSBmcm9tICcuL2FwaS9odHRwLWJhc2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuL2F1dGhTdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRvTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9hdXRvLWxvZ2luL2F1dG8tbG9naW4tc2VydmljZSc7XHJcbmltcG9ydCB7IEltcGxpY2l0Rmxvd0NhbGxiYWNrU2VydmljZSB9IGZyb20gJy4vY2FsbGJhY2svaW1wbGljaXQtZmxvdy1jYWxsYmFjay5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2hlY2tBdXRoU2VydmljZSB9IGZyb20gJy4vY2hlY2stYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29uZmlnVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuL2NvbmZpZy12YWxpZGF0aW9uL2NvbmZpZy12YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoV2VsbEtub3duRGF0YVNlcnZpY2UgfSBmcm9tICcuL2NvbmZpZy9hdXRoLXdlbGwta25vd24tZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aFdlbGxLbm93blNlcnZpY2UgfSBmcm9tICcuL2NvbmZpZy9hdXRoLXdlbGwta25vd24uc2VydmljZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XHJcbmltcG9ydCB7IE9pZGNDb25maWdTZXJ2aWNlIH0gZnJvbSAnLi9jb25maWcvY29uZmlnLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb2RlRmxvd0NhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL2NvZGUtZmxvdy1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBIaXN0b3J5Snd0S2V5c0NhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL2hpc3Rvcnktand0LWtleXMtY2FsbGJhY2staGFuZGxlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW1wbGljaXRGbG93Q2FsbGJhY2tIYW5kbGVyU2VydmljZSB9IGZyb20gJy4vZmxvd3MvY2FsbGJhY2staGFuZGxpbmcvaW1wbGljaXQtZmxvdy1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZWZyZXNoU2Vzc2lvbkNhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL3JlZnJlc2gtc2Vzc2lvbi1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZWZyZXNoVG9rZW5DYWxsYmFja0hhbmRsZXJTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9yZWZyZXNoLXRva2VuLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFN0YXRlVmFsaWRhdGlvbkNhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL3N0YXRlLXZhbGlkYXRpb24tY2FsbGJhY2staGFuZGxlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlckNhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL3VzZXItY2FsbGJhY2staGFuZGxlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd3NEYXRhU2VydmljZSB9IGZyb20gJy4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd3NTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy9mbG93cy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmFuZG9tU2VydmljZSB9IGZyb20gJy4vZmxvd3MvcmFuZG9tL3JhbmRvbS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVzZXRBdXRoRGF0YVNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL3Jlc2V0LWF1dGgtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2lnbmluS2V5RGF0YVNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL3NpZ25pbi1rZXktZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2hlY2tTZXNzaW9uU2VydmljZSB9IGZyb20gJy4vaWZyYW1lL2NoZWNrLXNlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IElGcmFtZVNlcnZpY2UgfSBmcm9tICcuL2lmcmFtZS9leGlzdGluZy1pZnJhbWUuc2VydmljZSc7XHJcbmltcG9ydCB7IFNpbGVudFJlbmV3U2VydmljZSB9IGZyb20gJy4vaWZyYW1lL3NpbGVudC1yZW5ldy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4vbG9naW4vbG9naW4uc2VydmljZSc7XHJcbmltcG9ydCB7IFBhckxvZ2luU2VydmljZSB9IGZyb20gJy4vbG9naW4vcGFyL3Bhci1sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUGFyU2VydmljZSB9IGZyb20gJy4vbG9naW4vcGFyL3Bhci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9wVXBMb2dpblNlcnZpY2UgfSBmcm9tICcuL2xvZ2luL3BvcHVwL3BvcHVwLWxvZ2luLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4vbG9naW4vcmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uL3Jlc3BvbnNlLXR5cGUtdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RhbmRhcmRMb2dpblNlcnZpY2UgfSBmcm9tICcuL2xvZ2luL3N0YW5kYXJkL3N0YW5kYXJkLWxvZ2luLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dvZmZSZXZvY2F0aW9uU2VydmljZSB9IGZyb20gJy4vbG9nb2ZmUmV2b2tlL2xvZ29mZi1yZXZvY2F0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPaWRjU2VjdXJpdHlTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQdWJsaWNFdmVudHNTZXJ2aWNlIH0gZnJvbSAnLi9wdWJsaWMtZXZlbnRzL3B1YmxpYy1ldmVudHMuc2VydmljZSc7XHJcbmltcG9ydCB7IEFic3RyYWN0U2VjdXJpdHlTdG9yYWdlIH0gZnJvbSAnLi9zdG9yYWdlL2Fic3RyYWN0LXNlY3VyaXR5LXN0b3JhZ2UnO1xyXG5pbXBvcnQgeyBCcm93c2VyU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuL3N0b3JhZ2UvYnJvd3Nlci1zdG9yYWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi91c2VyRGF0YS91c2VyLXNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFcXVhbGl0eVNlcnZpY2UgfSBmcm9tICcuL3V0aWxzL2VxdWFsaXR5L2VxdWFsaXR5LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBGbG93SGVscGVyIH0gZnJvbSAnLi91dGlscy9mbG93SGVscGVyL2Zsb3ctaGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQbGF0Zm9ybVByb3ZpZGVyIH0gZnJvbSAnLi91dGlscy9wbGF0Zm9ybS1wcm92aWRlci9wbGF0Zm9ybS5wcm92aWRlcic7XHJcbmltcG9ydCB7IFRva2VuSGVscGVyU2VydmljZSB9IGZyb20gJy4vdXRpbHMvdG9rZW5IZWxwZXIvb2lkYy10b2tlbi1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFVybFNlcnZpY2UgfSBmcm9tICcuL3V0aWxzL3VybC91cmwuc2VydmljZSc7XHJcbmltcG9ydCB7IFN0YXRlVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuL3ZhbGlkYXRpb24vc3RhdGUtdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVG9rZW5WYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4vdmFsaWRhdGlvbi90b2tlbi12YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBIdHRwQ2xpZW50TW9kdWxlXSxcclxuICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gIGV4cG9ydHM6IFtdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXV0aE1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QodG9rZW46IFRva2VuID0ge30pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBBdXRoTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBPaWRjQ29uZmlnU2VydmljZSxcclxuICAgICAgICBQdWJsaWNFdmVudHNTZXJ2aWNlLFxyXG4gICAgICAgIEZsb3dIZWxwZXIsXHJcbiAgICAgICAgT2lkY1NlY3VyaXR5U2VydmljZSxcclxuICAgICAgICBUb2tlblZhbGlkYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIFBsYXRmb3JtUHJvdmlkZXIsXHJcbiAgICAgICAgQ2hlY2tTZXNzaW9uU2VydmljZSxcclxuICAgICAgICBGbG93c0RhdGFTZXJ2aWNlLFxyXG4gICAgICAgIEZsb3dzU2VydmljZSxcclxuICAgICAgICBTaWxlbnRSZW5ld1NlcnZpY2UsXHJcbiAgICAgICAgQ29uZmlndXJhdGlvblByb3ZpZGVyLFxyXG4gICAgICAgIExvZ29mZlJldm9jYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJTZXJ2aWNlLFxyXG4gICAgICAgIFJhbmRvbVNlcnZpY2UsXHJcbiAgICAgICAgSHR0cEJhc2VTZXJ2aWNlLFxyXG4gICAgICAgIFVybFNlcnZpY2UsXHJcbiAgICAgICAgQXV0aFN0YXRlU2VydmljZSxcclxuICAgICAgICBTaWduaW5LZXlEYXRhU2VydmljZSxcclxuICAgICAgICBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLFxyXG4gICAgICAgIFRva2VuSGVscGVyU2VydmljZSxcclxuICAgICAgICBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgICAgIElGcmFtZVNlcnZpY2UsXHJcbiAgICAgICAgRXF1YWxpdHlTZXJ2aWNlLFxyXG4gICAgICAgIExvZ2luU2VydmljZSxcclxuICAgICAgICBQYXJTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhXZWxsS25vd25EYXRhU2VydmljZSxcclxuICAgICAgICBBdXRoV2VsbEtub3duU2VydmljZSxcclxuICAgICAgICBEYXRhU2VydmljZSxcclxuICAgICAgICBTdGF0ZVZhbGlkYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIENvbmZpZ1ZhbGlkYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIENoZWNrQXV0aFNlcnZpY2UsXHJcbiAgICAgICAgUmVzZXRBdXRoRGF0YVNlcnZpY2UsXHJcbiAgICAgICAgSW1wbGljaXRGbG93Q2FsbGJhY2tTZXJ2aWNlLFxyXG4gICAgICAgIEhpc3RvcnlKd3RLZXlzQ2FsbGJhY2tIYW5kbGVyU2VydmljZSxcclxuICAgICAgICBSZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZSxcclxuICAgICAgICBVc2VyQ2FsbGJhY2tIYW5kbGVyU2VydmljZSxcclxuICAgICAgICBTdGF0ZVZhbGlkYXRpb25DYWxsYmFja0hhbmRsZXJTZXJ2aWNlLFxyXG4gICAgICAgIFJlZnJlc2hTZXNzaW9uQ2FsbGJhY2tIYW5kbGVyU2VydmljZSxcclxuICAgICAgICBSZWZyZXNoVG9rZW5DYWxsYmFja0hhbmRsZXJTZXJ2aWNlLFxyXG4gICAgICAgIENvZGVGbG93Q2FsbGJhY2tIYW5kbGVyU2VydmljZSxcclxuICAgICAgICBJbXBsaWNpdEZsb3dDYWxsYmFja0hhbmRsZXJTZXJ2aWNlLFxyXG4gICAgICAgIFBhckxvZ2luU2VydmljZSxcclxuICAgICAgICBQb3BVcExvZ2luU2VydmljZSxcclxuICAgICAgICBTdGFuZGFyZExvZ2luU2VydmljZSxcclxuICAgICAgICBBdXRvTG9naW5TZXJ2aWNlLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEFic3RyYWN0U2VjdXJpdHlTdG9yYWdlLFxyXG4gICAgICAgICAgdXNlQ2xhc3M6IHRva2VuLnN0b3JhZ2UgfHwgQnJvd3NlclN0b3JhZ2VTZXJ2aWNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgVHlwZTxUPiA9IG5ldyAoLi4uYXJnczogYW55W10pID0+IFQ7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRva2VuIHtcclxuICBzdG9yYWdlPzogVHlwZTxhbnk+O1xyXG59XHJcbiJdfQ==