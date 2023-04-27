import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EventTypes } from '../public-events/event-types';
import * as i0 from "@angular/core";
import * as i1 from "../logging/logger.service";
import * as i2 from "../public-events/public-events.service";
import * as i3 from "../config/config.provider";
import * as i4 from "./auth-well-known.service";
import * as i5 from "../storage/storage-persistence.service";
import * as i6 from "../config-validation/config-validation.service";
export class OidcConfigService {
    constructor(loggerService, publicEventsService, configurationProvider, authWellKnownService, storagePersistenceService, configValidationService) {
        this.loggerService = loggerService;
        this.publicEventsService = publicEventsService;
        this.configurationProvider = configurationProvider;
        this.authWellKnownService = authWellKnownService;
        this.storagePersistenceService = storagePersistenceService;
        this.configValidationService = configValidationService;
    }
    withConfig(passedConfig, passedAuthWellKnownEndpoints) {
        return new Promise((resolve, reject) => {
            if (!this.configValidationService.validateConfig(passedConfig)) {
                this.loggerService.logError('Validation of config rejected with errors. Config is NOT set.');
                resolve();
            }
            if (!passedConfig.authWellknownEndpoint) {
                passedConfig.authWellknownEndpoint = passedConfig.stsServer;
            }
            const usedConfig = this.configurationProvider.setConfig(passedConfig);
            const alreadyExistingAuthWellKnownEndpoints = this.storagePersistenceService.read('authWellKnownEndPoints');
            if (!!alreadyExistingAuthWellKnownEndpoints) {
                this.publicEventsService.fireEvent(EventTypes.ConfigLoaded, {
                    configuration: passedConfig,
                    wellknown: alreadyExistingAuthWellKnownEndpoints,
                });
                resolve();
            }
            if (!!passedAuthWellKnownEndpoints) {
                this.authWellKnownService.storeWellKnownEndpoints(passedAuthWellKnownEndpoints);
                this.publicEventsService.fireEvent(EventTypes.ConfigLoaded, {
                    configuration: passedConfig,
                    wellknown: passedAuthWellKnownEndpoints,
                });
                resolve();
            }
            if (usedConfig.eagerLoadAuthWellKnownEndpoints) {
                this.authWellKnownService
                    .getAuthWellKnownEndPoints(usedConfig.authWellknownEndpoint)
                    .pipe(catchError((error) => {
                    this.loggerService.logError('Getting auth well known endpoints failed on start', error);
                    return throwError(error);
                }), tap((wellknownEndPoints) => this.publicEventsService.fireEvent(EventTypes.ConfigLoaded, {
                    configuration: passedConfig,
                    wellknown: wellknownEndPoints,
                })))
                    .subscribe(() => resolve(), () => reject());
            }
            else {
                this.publicEventsService.fireEvent(EventTypes.ConfigLoaded, {
                    configuration: passedConfig,
                    wellknown: null,
                });
                resolve();
            }
        });
    }
}
OidcConfigService.ɵfac = function OidcConfigService_Factory(t) { return new (t || OidcConfigService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.PublicEventsService), i0.ɵɵinject(i3.ConfigurationProvider), i0.ɵɵinject(i4.AuthWellKnownService), i0.ɵɵinject(i5.StoragePersistenceService), i0.ɵɵinject(i6.ConfigValidationService)); };
OidcConfigService.ɵprov = i0.ɵɵdefineInjectable({ token: OidcConfigService, factory: OidcConfigService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(OidcConfigService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }, { type: i2.PublicEventsService }, { type: i3.ConfigurationProvider }, { type: i4.AuthWellKnownService }, { type: i5.StoragePersistenceService }, { type: i6.ConfigValidationService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9jb25maWcvY29uZmlnLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDhCQUE4QixDQUFDOzs7Ozs7OztBQVMxRCxNQUFNLE9BQU8saUJBQWlCO0lBQzVCLFlBQ1UsYUFBNEIsRUFDNUIsbUJBQXdDLEVBQ3hDLHFCQUE0QyxFQUM1QyxvQkFBMEMsRUFDMUMseUJBQW9ELEVBQ3BELHVCQUFnRDtRQUxoRCxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyw4QkFBeUIsR0FBekIseUJBQXlCLENBQTJCO1FBQ3BELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7SUFDdkQsQ0FBQztJQUVKLFVBQVUsQ0FBQyxZQUFpQyxFQUFFLDRCQUFxRDtRQUNqRyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUM5RCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQywrREFBK0QsQ0FBQyxDQUFDO2dCQUM3RixPQUFPLEVBQUUsQ0FBQzthQUNYO1lBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsRUFBRTtnQkFDdkMsWUFBWSxDQUFDLHFCQUFxQixHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUM7YUFDN0Q7WUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXRFLE1BQU0scUNBQXFDLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQzVHLElBQUksQ0FBQyxDQUFDLHFDQUFxQyxFQUFFO2dCQUMzQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFzQixVQUFVLENBQUMsWUFBWSxFQUFFO29CQUMvRSxhQUFhLEVBQUUsWUFBWTtvQkFDM0IsU0FBUyxFQUFFLHFDQUFxQztpQkFDakQsQ0FBQyxDQUFDO2dCQUVILE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFFRCxJQUFJLENBQUMsQ0FBQyw0QkFBNEIsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLHVCQUF1QixDQUFDLDRCQUE0QixDQUFDLENBQUM7Z0JBQ2hGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQXNCLFVBQVUsQ0FBQyxZQUFZLEVBQUU7b0JBQy9FLGFBQWEsRUFBRSxZQUFZO29CQUMzQixTQUFTLEVBQUUsNEJBQTRCO2lCQUN4QyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxFQUFFLENBQUM7YUFDWDtZQUNELElBQUksVUFBVSxDQUFDLCtCQUErQixFQUFFO2dCQUM5QyxJQUFJLENBQUMsb0JBQW9CO3FCQUN0Qix5QkFBeUIsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUM7cUJBQzNELElBQUksQ0FDSCxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsbURBQW1ELEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3hGLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQixDQUFDLENBQUMsRUFDRixHQUFHLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQ3pCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQXNCLFVBQVUsQ0FBQyxZQUFZLEVBQUU7b0JBQy9FLGFBQWEsRUFBRSxZQUFZO29CQUMzQixTQUFTLEVBQUUsa0JBQWtCO2lCQUM5QixDQUFDLENBQ0gsQ0FDRjtxQkFDQSxTQUFTLENBQ1IsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQ2YsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQ2YsQ0FBQzthQUNMO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQXNCLFVBQVUsQ0FBQyxZQUFZLEVBQUU7b0JBQy9FLGFBQWEsRUFBRSxZQUFZO29CQUMzQixTQUFTLEVBQUUsSUFBSTtpQkFDaEIsQ0FBQyxDQUFDO2dCQUNILE9BQU8sRUFBRSxDQUFDO2FBQ1g7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O2tGQXJFVSxpQkFBaUI7eURBQWpCLGlCQUFpQixXQUFqQixpQkFBaUI7a0RBQWpCLGlCQUFpQjtjQUQ3QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ29uZmlnVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9jb25maWctdmFsaWRhdGlvbi9jb25maWctdmFsaWRhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRXZlbnRUeXBlcyB9IGZyb20gJy4uL3B1YmxpYy1ldmVudHMvZXZlbnQtdHlwZXMnO1xuaW1wb3J0IHsgUHVibGljRXZlbnRzU2VydmljZSB9IGZyb20gJy4uL3B1YmxpYy1ldmVudHMvcHVibGljLWV2ZW50cy5zZXJ2aWNlJztcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBBdXRoV2VsbEtub3duRW5kcG9pbnRzIH0gZnJvbSAnLi9hdXRoLXdlbGwta25vd24tZW5kcG9pbnRzJztcbmltcG9ydCB7IEF1dGhXZWxsS25vd25TZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLXdlbGwta25vd24uc2VydmljZSc7XG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9vcGVuaWQtY29uZmlndXJhdGlvbic7XG5pbXBvcnQgeyBQdWJsaWNDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9wdWJsaWMtY29uZmlndXJhdGlvbic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBPaWRjQ29uZmlnU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIHB1YmxpY0V2ZW50c1NlcnZpY2U6IFB1YmxpY0V2ZW50c1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIGF1dGhXZWxsS25vd25TZXJ2aWNlOiBBdXRoV2VsbEtub3duU2VydmljZSxcbiAgICBwcml2YXRlIHN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2U6IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWdWYWxpZGF0aW9uU2VydmljZTogQ29uZmlnVmFsaWRhdGlvblNlcnZpY2VcbiAgKSB7fVxuXG4gIHdpdGhDb25maWcocGFzc2VkQ29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uLCBwYXNzZWRBdXRoV2VsbEtub3duRW5kcG9pbnRzPzogQXV0aFdlbGxLbm93bkVuZHBvaW50cyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoIXRoaXMuY29uZmlnVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVDb25maWcocGFzc2VkQ29uZmlnKSkge1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJ1ZhbGlkYXRpb24gb2YgY29uZmlnIHJlamVjdGVkIHdpdGggZXJyb3JzLiBDb25maWcgaXMgTk9UIHNldC4nKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXBhc3NlZENvbmZpZy5hdXRoV2VsbGtub3duRW5kcG9pbnQpIHtcbiAgICAgICAgcGFzc2VkQ29uZmlnLmF1dGhXZWxsa25vd25FbmRwb2ludCA9IHBhc3NlZENvbmZpZy5zdHNTZXJ2ZXI7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVzZWRDb25maWcgPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5zZXRDb25maWcocGFzc2VkQ29uZmlnKTtcblxuICAgICAgY29uc3QgYWxyZWFkeUV4aXN0aW5nQXV0aFdlbGxLbm93bkVuZHBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG4gICAgICBpZiAoISFhbHJlYWR5RXhpc3RpbmdBdXRoV2VsbEtub3duRW5kcG9pbnRzKSB7XG4gICAgICAgIHRoaXMucHVibGljRXZlbnRzU2VydmljZS5maXJlRXZlbnQ8UHVibGljQ29uZmlndXJhdGlvbj4oRXZlbnRUeXBlcy5Db25maWdMb2FkZWQsIHtcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBwYXNzZWRDb25maWcsXG4gICAgICAgICAgd2VsbGtub3duOiBhbHJlYWR5RXhpc3RpbmdBdXRoV2VsbEtub3duRW5kcG9pbnRzLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghIXBhc3NlZEF1dGhXZWxsS25vd25FbmRwb2ludHMpIHtcbiAgICAgICAgdGhpcy5hdXRoV2VsbEtub3duU2VydmljZS5zdG9yZVdlbGxLbm93bkVuZHBvaW50cyhwYXNzZWRBdXRoV2VsbEtub3duRW5kcG9pbnRzKTtcbiAgICAgICAgdGhpcy5wdWJsaWNFdmVudHNTZXJ2aWNlLmZpcmVFdmVudDxQdWJsaWNDb25maWd1cmF0aW9uPihFdmVudFR5cGVzLkNvbmZpZ0xvYWRlZCwge1xuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHBhc3NlZENvbmZpZyxcbiAgICAgICAgICB3ZWxsa25vd246IHBhc3NlZEF1dGhXZWxsS25vd25FbmRwb2ludHMsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VkQ29uZmlnLmVhZ2VyTG9hZEF1dGhXZWxsS25vd25FbmRwb2ludHMpIHtcbiAgICAgICAgdGhpcy5hdXRoV2VsbEtub3duU2VydmljZVxuICAgICAgICAgIC5nZXRBdXRoV2VsbEtub3duRW5kUG9pbnRzKHVzZWRDb25maWcuYXV0aFdlbGxrbm93bkVuZHBvaW50KVxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKCdHZXR0aW5nIGF1dGggd2VsbCBrbm93biBlbmRwb2ludHMgZmFpbGVkIG9uIHN0YXJ0JywgZXJyb3IpO1xuICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRhcCgod2VsbGtub3duRW5kUG9pbnRzKSA9PlxuICAgICAgICAgICAgICB0aGlzLnB1YmxpY0V2ZW50c1NlcnZpY2UuZmlyZUV2ZW50PFB1YmxpY0NvbmZpZ3VyYXRpb24+KEV2ZW50VHlwZXMuQ29uZmlnTG9hZGVkLCB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbjogcGFzc2VkQ29uZmlnLFxuICAgICAgICAgICAgICAgIHdlbGxrbm93bjogd2VsbGtub3duRW5kUG9pbnRzLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKCkgPT4gcmVzb2x2ZSgpLFxuICAgICAgICAgICAgKCkgPT4gcmVqZWN0KClcbiAgICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wdWJsaWNFdmVudHNTZXJ2aWNlLmZpcmVFdmVudDxQdWJsaWNDb25maWd1cmF0aW9uPihFdmVudFR5cGVzLkNvbmZpZ0xvYWRlZCwge1xuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHBhc3NlZENvbmZpZyxcbiAgICAgICAgICB3ZWxsa25vd246IG51bGwsXG4gICAgICAgIH0pO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==