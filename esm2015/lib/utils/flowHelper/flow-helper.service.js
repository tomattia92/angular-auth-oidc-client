import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../config/config.provider";
export class FlowHelper {
    constructor(configurationProvider) {
        this.configurationProvider = configurationProvider;
    }
    isCurrentFlowCodeFlow() {
        return this.currentFlowIs('code');
    }
    isCurrentFlowAnyImplicitFlow() {
        return this.isCurrentFlowImplicitFlowWithAccessToken() || this.isCurrentFlowImplicitFlowWithoutAccessToken();
    }
    isCurrentFlowCodeFlowWithRefreshTokens() {
        const { useRefreshToken } = this.configurationProvider.getOpenIDConfiguration();
        if (this.isCurrentFlowCodeFlow() && useRefreshToken) {
            return true;
        }
        return false;
    }
    isCurrentFlowImplicitFlowWithAccessToken() {
        return this.currentFlowIs('id_token token');
    }
    isCurrentFlowImplicitFlowWithoutAccessToken() {
        return this.currentFlowIs('id_token');
    }
    currentFlowIs(flowTypes) {
        const { responseType } = this.configurationProvider.getOpenIDConfiguration();
        if (Array.isArray(flowTypes)) {
            return flowTypes.some((x) => responseType === x);
        }
        return responseType === flowTypes;
    }
}
FlowHelper.ɵfac = function FlowHelper_Factory(t) { return new (t || FlowHelper)(i0.ɵɵinject(i1.ConfigurationProvider)); };
FlowHelper.ɵprov = i0.ɵɵdefineInjectable({ token: FlowHelper, factory: FlowHelper.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FlowHelper, [{
        type: Injectable
    }], function () { return [{ type: i1.ConfigurationProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvdy1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2Zsb3dIZWxwZXIvZmxvdy1oZWxwZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFJM0MsTUFBTSxPQUFPLFVBQVU7SUFDckIsWUFBb0IscUJBQTRDO1FBQTVDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7SUFBRyxDQUFDO0lBRXBFLHFCQUFxQjtRQUNuQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELDRCQUE0QjtRQUMxQixPQUFPLElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxJQUFJLElBQUksQ0FBQywyQ0FBMkMsRUFBRSxDQUFDO0lBQy9HLENBQUM7SUFFRCxzQ0FBc0M7UUFDcEMsTUFBTSxFQUFFLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBRWhGLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLElBQUksZUFBZSxFQUFFO1lBQ25ELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCx3Q0FBd0M7UUFDdEMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELDJDQUEyQztRQUN6QyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxTQUE0QjtRQUN4QyxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFN0UsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzVCLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsT0FBTyxZQUFZLEtBQUssU0FBUyxDQUFDO0lBQ3BDLENBQUM7O29FQXJDVSxVQUFVO2tEQUFWLFVBQVUsV0FBVixVQUFVO2tEQUFWLFVBQVU7Y0FEdEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uLy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmxvd0hlbHBlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIpIHt9XG5cbiAgaXNDdXJyZW50Rmxvd0NvZGVGbG93KCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRGbG93SXMoJ2NvZGUnKTtcbiAgfVxuXG4gIGlzQ3VycmVudEZsb3dBbnlJbXBsaWNpdEZsb3coKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNDdXJyZW50Rmxvd0ltcGxpY2l0Rmxvd1dpdGhBY2Nlc3NUb2tlbigpIHx8IHRoaXMuaXNDdXJyZW50Rmxvd0ltcGxpY2l0Rmxvd1dpdGhvdXRBY2Nlc3NUb2tlbigpO1xuICB9XG5cbiAgaXNDdXJyZW50Rmxvd0NvZGVGbG93V2l0aFJlZnJlc2hUb2tlbnMoKSB7XG4gICAgY29uc3QgeyB1c2VSZWZyZXNoVG9rZW4gfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcblxuICAgIGlmICh0aGlzLmlzQ3VycmVudEZsb3dDb2RlRmxvdygpICYmIHVzZVJlZnJlc2hUb2tlbikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNDdXJyZW50Rmxvd0ltcGxpY2l0Rmxvd1dpdGhBY2Nlc3NUb2tlbigpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50Rmxvd0lzKCdpZF90b2tlbiB0b2tlbicpO1xuICB9XG5cbiAgaXNDdXJyZW50Rmxvd0ltcGxpY2l0Rmxvd1dpdGhvdXRBY2Nlc3NUb2tlbigpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50Rmxvd0lzKCdpZF90b2tlbicpO1xuICB9XG5cbiAgY3VycmVudEZsb3dJcyhmbG93VHlwZXM6IHN0cmluZ1tdIHwgc3RyaW5nKSB7XG4gICAgY29uc3QgeyByZXNwb25zZVR5cGUgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGZsb3dUeXBlcykpIHtcbiAgICAgIHJldHVybiBmbG93VHlwZXMuc29tZSgoeCkgPT4gcmVzcG9uc2VUeXBlID09PSB4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2VUeXBlID09PSBmbG93VHlwZXM7XG4gIH1cbn1cbiJdfQ==