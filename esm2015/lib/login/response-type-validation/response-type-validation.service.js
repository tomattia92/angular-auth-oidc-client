import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../utils/flowHelper/flow-helper.service";
export class ResponseTypeValidationService {
    constructor(loggerService, flowHelper) {
        this.loggerService = loggerService;
        this.flowHelper = flowHelper;
    }
    hasConfigValidResponseType() {
        if (this.flowHelper.isCurrentFlowAnyImplicitFlow()) {
            return true;
        }
        if (this.flowHelper.isCurrentFlowCodeFlow()) {
            return true;
        }
        this.loggerService.logWarning('module configured incorrectly, invalid response_type. Check the responseType in the config');
        return false;
    }
}
ResponseTypeValidationService.ɵfac = function ResponseTypeValidationService_Factory(t) { return new (t || ResponseTypeValidationService)(i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.FlowHelper)); };
ResponseTypeValidationService.ɵprov = i0.ɵɵdefineInjectable({ token: ResponseTypeValidationService, factory: ResponseTypeValidationService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ResponseTypeValidationService, [{
        type: Injectable
    }], function () { return [{ type: i1.LoggerService }, { type: i2.FlowHelper }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9sb2dpbi9yZXNwb25zZS10eXBlLXZhbGlkYXRpb24vcmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUszQyxNQUFNLE9BQU8sNkJBQTZCO0lBQ3hDLFlBQW9CLGFBQTRCLEVBQVUsVUFBc0I7UUFBNUQsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO0lBQUcsQ0FBQztJQUVwRiwwQkFBMEI7UUFDeEIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLDRCQUE0QixFQUFFLEVBQUU7WUFDbEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFO1lBQzNDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDO1FBQzVILE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7MEdBZFUsNkJBQTZCO3FFQUE3Qiw2QkFBNkIsV0FBN0IsNkJBQTZCO2tEQUE3Qiw2QkFBNkI7Y0FEekMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IEZsb3dIZWxwZXIgfSBmcm9tICcuLi8uLi91dGlscy9mbG93SGVscGVyL2Zsb3ctaGVscGVyLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsIHByaXZhdGUgZmxvd0hlbHBlcjogRmxvd0hlbHBlcikge31cblxuICBoYXNDb25maWdWYWxpZFJlc3BvbnNlVHlwZSgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dBbnlJbXBsaWNpdEZsb3coKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZmxvd0hlbHBlci5pc0N1cnJlbnRGbG93Q29kZUZsb3coKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ21vZHVsZSBjb25maWd1cmVkIGluY29ycmVjdGx5LCBpbnZhbGlkIHJlc3BvbnNlX3R5cGUuIENoZWNrIHRoZSByZXNwb25zZVR5cGUgaW4gdGhlIGNvbmZpZycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19