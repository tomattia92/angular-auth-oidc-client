import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthModule, LogLevel, OidcConfigService, OidcSecurityService } from 'angular-auth-oidc-client';

export function loadConfig(oidcConfigService: OidcConfigService) {
  return () =>
    oidcConfigService.withConfig({
      stsServer: 'https://login.microsoftonline.com/7ff95b15-dc21-4ba6-bc92-824856578fc1/v2.0',
      authWellknownEndpoint: 'https://login.microsoftonline.com/common/v2.0',
      redirectUrl: window.location.origin,
      clientId: 'e38ea64a-2962-4cde-bfe7-dd2822fdab32',
      scope: 'openid profile offline_access email api://e38ea64a-2962-4cde-bfe7-dd2822fdab32/access_as_user',
      responseType: 'code',
      silentRenew: true,
      maxIdTokenIatOffsetAllowedInSeconds: 600,
      issValidationOff: true,
      autoUserinfo: false,
      // silentRenewUrl: window.location.origin + '/silent-renew.html',
      useRefreshToken: true,
      logLevel: LogLevel.Debug,
      customParams: {
        prompt: 'select_account', // login, consent
      },
    });
}

@NgModule({
  imports: [AuthModule.forRoot()],
  providers: [
    OidcSecurityService,
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true,
    },
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
