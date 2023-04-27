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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvY29uZmlnL2NvbmZpZy5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7O0FBSWxELE1BQU0sT0FBTyxxQkFBcUI7SUFHaEMsWUFBb0IsZ0JBQWtDO1FBQWxDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7SUFBRyxDQUFDO0lBRTFELGNBQWM7UUFDWixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUM7SUFDNUMsQ0FBQztJQUVELHNCQUFzQjtRQUNwQixPQUFPLElBQUksQ0FBQywyQkFBMkIsSUFBSSxJQUFJLENBQUM7SUFDbEQsQ0FBQztJQUVELFNBQVMsQ0FBQyxhQUFrQztRQUMxQyxJQUFJLENBQUMsMkJBQTJCLG1DQUFRLGNBQWMsR0FBSyxhQUFhLENBQUUsQ0FBQztRQUUzRSxJQUFJLGFBQWEsYUFBYixhQUFhLHVCQUFiLGFBQWEsQ0FBRSxPQUFPLEVBQUU7WUFDMUIsT0FBTyxDQUFDLElBQUksQ0FDVjswRUFDa0UsQ0FDbkUsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUV2RCxPQUFPLElBQUksQ0FBQywyQkFBMkIsQ0FBQztJQUMxQyxDQUFDO0lBRU8sZUFBZSxDQUFDLGFBQWtDO1FBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFO1lBQ3BDLGFBQWEsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFDeEMsYUFBYSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDbEMsYUFBYSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFDdEMsYUFBYSxDQUFDLDhCQUE4QixHQUFHLEtBQUssQ0FBQztTQUN0RDtJQUNILENBQUM7OzBGQW5DVSxxQkFBcUI7NkRBQXJCLHFCQUFxQixXQUFyQixxQkFBcUI7a0RBQXJCLHFCQUFxQjtjQURqQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGxhdGZvcm1Qcm92aWRlciB9IGZyb20gJy4uL3V0aWxzL3BsYXRmb3JtLXByb3ZpZGVyL3BsYXRmb3JtLnByb3ZpZGVyJztcbmltcG9ydCB7IERFRkFVTFRfQ09ORklHIH0gZnJvbSAnLi9kZWZhdWx0LWNvbmZpZyc7XG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9vcGVuaWQtY29uZmlndXJhdGlvbic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uUHJvdmlkZXIge1xuICBwcml2YXRlIG9wZW5JZENvbmZpZ3VyYXRpb25JbnRlcm5hbDogT3BlbklkQ29uZmlndXJhdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsYXRmb3JtUHJvdmlkZXI6IFBsYXRmb3JtUHJvdmlkZXIpIHt9XG5cbiAgaGFzVmFsaWRDb25maWcoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5vcGVuSWRDb25maWd1cmF0aW9uSW50ZXJuYWw7XG4gIH1cblxuICBnZXRPcGVuSURDb25maWd1cmF0aW9uKCk6IE9wZW5JZENvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB0aGlzLm9wZW5JZENvbmZpZ3VyYXRpb25JbnRlcm5hbCB8fCBudWxsO1xuICB9XG5cbiAgc2V0Q29uZmlnKGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pIHtcbiAgICB0aGlzLm9wZW5JZENvbmZpZ3VyYXRpb25JbnRlcm5hbCA9IHsgLi4uREVGQVVMVF9DT05GSUcsIC4uLmNvbmZpZ3VyYXRpb24gfTtcblxuICAgIGlmIChjb25maWd1cmF0aW9uPy5zdG9yYWdlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBQTEVBU0UgTk9URTogVGhlIHN0b3JhZ2UgaW4gdGhlIGNvbmZpZyB3aWxsIGJlIGRlcHJlY2F0ZWQgaW4gZnV0dXJlIHZlcnNpb25zOlxuICAgICAgICAgICAgICAgIFBsZWFzZSBwYXNzIHRoZSBjdXN0b20gc3RvcmFnZSBpbiBmb3JSb290KCkgYXMgZG9jdW1lbnRlZGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTcGVjaWFsQ2FzZXModGhpcy5vcGVuSWRDb25maWd1cmF0aW9uSW50ZXJuYWwpO1xuXG4gICAgcmV0dXJuIHRoaXMub3BlbklkQ29uZmlndXJhdGlvbkludGVybmFsO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRTcGVjaWFsQ2FzZXMoY3VycmVudENvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbikge1xuICAgIGlmICghdGhpcy5wbGF0Zm9ybVByb3ZpZGVyLmlzQnJvd3Nlcikge1xuICAgICAgY3VycmVudENvbmZpZy5zdGFydENoZWNrU2Vzc2lvbiA9IGZhbHNlO1xuICAgICAgY3VycmVudENvbmZpZy5zaWxlbnRSZW5ldyA9IGZhbHNlO1xuICAgICAgY3VycmVudENvbmZpZy51c2VSZWZyZXNoVG9rZW4gPSBmYWxzZTtcbiAgICAgIGN1cnJlbnRDb25maWcudXNlUHVzaGVkQXV0aG9yaXNhdGlvblJlcXVlc3RzID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iXX0=