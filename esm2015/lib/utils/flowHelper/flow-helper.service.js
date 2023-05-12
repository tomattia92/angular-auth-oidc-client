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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvdy1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2Zsb3dIZWxwZXIvZmxvdy1oZWxwZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFJM0MsTUFBTSxPQUFPLFVBQVU7SUFDckIsWUFBb0IscUJBQTRDO1FBQTVDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7SUFBRyxDQUFDO0lBRXBFLHFCQUFxQjtRQUNuQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELDRCQUE0QjtRQUMxQixPQUFPLElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxJQUFJLElBQUksQ0FBQywyQ0FBMkMsRUFBRSxDQUFDO0lBQy9HLENBQUM7SUFFRCxzQ0FBc0M7UUFDcEMsTUFBTSxFQUFFLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBRWhGLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLElBQUksZUFBZSxFQUFFO1lBQ25ELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCx3Q0FBd0M7UUFDdEMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELDJDQUEyQztRQUN6QyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxTQUE0QjtRQUN4QyxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFN0UsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzVCLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsT0FBTyxZQUFZLEtBQUssU0FBUyxDQUFDO0lBQ3BDLENBQUM7O29FQXJDVSxVQUFVO2tEQUFWLFVBQVUsV0FBVixVQUFVO2tEQUFWLFVBQVU7Y0FEdEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vY29uZmlnL2NvbmZpZy5wcm92aWRlcic7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBGbG93SGVscGVyIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyKSB7fVxyXG5cclxuICBpc0N1cnJlbnRGbG93Q29kZUZsb3coKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50Rmxvd0lzKCdjb2RlJyk7XHJcbiAgfVxyXG5cclxuICBpc0N1cnJlbnRGbG93QW55SW1wbGljaXRGbG93KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNDdXJyZW50Rmxvd0ltcGxpY2l0Rmxvd1dpdGhBY2Nlc3NUb2tlbigpIHx8IHRoaXMuaXNDdXJyZW50Rmxvd0ltcGxpY2l0Rmxvd1dpdGhvdXRBY2Nlc3NUb2tlbigpO1xyXG4gIH1cclxuXHJcbiAgaXNDdXJyZW50Rmxvd0NvZGVGbG93V2l0aFJlZnJlc2hUb2tlbnMoKSB7XHJcbiAgICBjb25zdCB7IHVzZVJlZnJlc2hUb2tlbiB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzQ3VycmVudEZsb3dDb2RlRmxvdygpICYmIHVzZVJlZnJlc2hUb2tlbikge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpc0N1cnJlbnRGbG93SW1wbGljaXRGbG93V2l0aEFjY2Vzc1Rva2VuKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudEZsb3dJcygnaWRfdG9rZW4gdG9rZW4nKTtcclxuICB9XHJcblxyXG4gIGlzQ3VycmVudEZsb3dJbXBsaWNpdEZsb3dXaXRob3V0QWNjZXNzVG9rZW4oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50Rmxvd0lzKCdpZF90b2tlbicpO1xyXG4gIH1cclxuXHJcbiAgY3VycmVudEZsb3dJcyhmbG93VHlwZXM6IHN0cmluZ1tdIHwgc3RyaW5nKSB7XHJcbiAgICBjb25zdCB7IHJlc3BvbnNlVHlwZSB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xyXG5cclxuICAgIGlmIChBcnJheS5pc0FycmF5KGZsb3dUeXBlcykpIHtcclxuICAgICAgcmV0dXJuIGZsb3dUeXBlcy5zb21lKCh4KSA9PiByZXNwb25zZVR5cGUgPT09IHgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXNwb25zZVR5cGUgPT09IGZsb3dUeXBlcztcclxuICB9XHJcbn1cclxuIl19