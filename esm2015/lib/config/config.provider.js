import { Injectable } from '@angular/core';
import { DEFAULT_CONFIG } from './default-config';
import * as i0 from "@angular/core";
import * as i1 from "../utils/platform-provider/platform.provider";
export class ConfigurationProvider {
    constructor(platformProvider) {
        this.platformProvider = platformProvider;
    }
    hasValidConfig() {
        return !!this.openIdConfigurationInternal;
    }
    getOpenIDConfiguration() {
        return this.openIdConfigurationInternal || null;
    }
    setConfig(configuration) {
        this.openIdConfigurationInternal = Object.assign(Object.assign({}, DEFAULT_CONFIG), configuration);
        if (configuration === null || configuration === void 0 ? void 0 : configuration.storage) {
            console.warn(`PLEASE NOTE: The storage in the config will be deprecated in future versions:
                Please pass the custom storage in forRoot() as documented`);
        }
        this.setSpecialCases(this.openIdConfigurationInternal);
        return this.openIdConfigurationInternal;
    }
    setSpecialCases(currentConfig) {
        if (!this.platformProvider.isBrowser) {
            currentConfig.startCheckSession = false;
            currentConfig.silentRenew = false;
            currentConfig.useRefreshToken = false;
            currentConfig.usePushedAuthorisationRequests = false;
        }
    }
}
ConfigurationProvider.ɵfac = function ConfigurationProvider_Factory(t) { return new (t || ConfigurationProvider)(i0.ɵɵinject(i1.PlatformProvider)); };
ConfigurationProvider.ɵprov = i0.ɵɵdefineInjectable({ token: ConfigurationProvider, factory: ConfigurationProvider.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ConfigurationProvider, [{
        type: Injectable
    }], function () { return [{ type: i1.PlatformProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvY29uZmlnL2NvbmZpZy5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7O0FBSWxELE1BQU0sT0FBTyxxQkFBcUI7SUFHaEMsWUFBb0IsZ0JBQWtDO1FBQWxDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7SUFBRyxDQUFDO0lBRTFELGNBQWM7UUFDWixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUM7SUFDNUMsQ0FBQztJQUVELHNCQUFzQjtRQUNwQixPQUFPLElBQUksQ0FBQywyQkFBMkIsSUFBSSxJQUFJLENBQUM7SUFDbEQsQ0FBQztJQUVELFNBQVMsQ0FBQyxhQUFrQztRQUMxQyxJQUFJLENBQUMsMkJBQTJCLG1DQUFRLGNBQWMsR0FBSyxhQUFhLENBQUUsQ0FBQztRQUUzRSxJQUFJLGFBQWEsYUFBYixhQUFhLHVCQUFiLGFBQWEsQ0FBRSxPQUFPLEVBQUU7WUFDMUIsT0FBTyxDQUFDLElBQUksQ0FDVjswRUFDa0UsQ0FDbkUsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUV2RCxPQUFPLElBQUksQ0FBQywyQkFBMkIsQ0FBQztJQUMxQyxDQUFDO0lBRU8sZUFBZSxDQUFDLGFBQWtDO1FBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFO1lBQ3BDLGFBQWEsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFDeEMsYUFBYSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDbEMsYUFBYSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFDdEMsYUFBYSxDQUFDLDhCQUE4QixHQUFHLEtBQUssQ0FBQztTQUN0RDtJQUNILENBQUM7OzBGQW5DVSxxQkFBcUI7NkRBQXJCLHFCQUFxQixXQUFyQixxQkFBcUI7a0RBQXJCLHFCQUFxQjtjQURqQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQbGF0Zm9ybVByb3ZpZGVyIH0gZnJvbSAnLi4vdXRpbHMvcGxhdGZvcm0tcHJvdmlkZXIvcGxhdGZvcm0ucHJvdmlkZXInO1xyXG5pbXBvcnQgeyBERUZBVUxUX0NPTkZJRyB9IGZyb20gJy4vZGVmYXVsdC1jb25maWcnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uUHJvdmlkZXIge1xyXG4gIHByaXZhdGUgb3BlbklkQ29uZmlndXJhdGlvbkludGVybmFsOiBPcGVuSWRDb25maWd1cmF0aW9uO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsYXRmb3JtUHJvdmlkZXI6IFBsYXRmb3JtUHJvdmlkZXIpIHt9XHJcblxyXG4gIGhhc1ZhbGlkQ29uZmlnKCkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5vcGVuSWRDb25maWd1cmF0aW9uSW50ZXJuYWw7XHJcbiAgfVxyXG5cclxuICBnZXRPcGVuSURDb25maWd1cmF0aW9uKCk6IE9wZW5JZENvbmZpZ3VyYXRpb24ge1xyXG4gICAgcmV0dXJuIHRoaXMub3BlbklkQ29uZmlndXJhdGlvbkludGVybmFsIHx8IG51bGw7XHJcbiAgfVxyXG5cclxuICBzZXRDb25maWcoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbikge1xyXG4gICAgdGhpcy5vcGVuSWRDb25maWd1cmF0aW9uSW50ZXJuYWwgPSB7IC4uLkRFRkFVTFRfQ09ORklHLCAuLi5jb25maWd1cmF0aW9uIH07XHJcblxyXG4gICAgaWYgKGNvbmZpZ3VyYXRpb24/LnN0b3JhZ2UpIHtcclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgIGBQTEVBU0UgTk9URTogVGhlIHN0b3JhZ2UgaW4gdGhlIGNvbmZpZyB3aWxsIGJlIGRlcHJlY2F0ZWQgaW4gZnV0dXJlIHZlcnNpb25zOlxyXG4gICAgICAgICAgICAgICAgUGxlYXNlIHBhc3MgdGhlIGN1c3RvbSBzdG9yYWdlIGluIGZvclJvb3QoKSBhcyBkb2N1bWVudGVkYFxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U3BlY2lhbENhc2VzKHRoaXMub3BlbklkQ29uZmlndXJhdGlvbkludGVybmFsKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcGVuSWRDb25maWd1cmF0aW9uSW50ZXJuYWw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFNwZWNpYWxDYXNlcyhjdXJyZW50Q29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKSB7XHJcbiAgICBpZiAoIXRoaXMucGxhdGZvcm1Qcm92aWRlci5pc0Jyb3dzZXIpIHtcclxuICAgICAgY3VycmVudENvbmZpZy5zdGFydENoZWNrU2Vzc2lvbiA9IGZhbHNlO1xyXG4gICAgICBjdXJyZW50Q29uZmlnLnNpbGVudFJlbmV3ID0gZmFsc2U7XHJcbiAgICAgIGN1cnJlbnRDb25maWcudXNlUmVmcmVzaFRva2VuID0gZmFsc2U7XHJcbiAgICAgIGN1cnJlbnRDb25maWcudXNlUHVzaGVkQXV0aG9yaXNhdGlvblJlcXVlc3RzID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==