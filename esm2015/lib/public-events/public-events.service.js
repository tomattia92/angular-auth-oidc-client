import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as i0 from "@angular/core";
export class PublicEventsService {
    constructor() {
        this.notify = new ReplaySubject(1);
    }
    /**
     * Fires a new event.
     *
     * @param type The event type.
     * @param value The event value.
     */
    fireEvent(type, value) {
        this.notify.next({ type, value });
    }
    /**
     * Wires up the event notification observable.
     */
    registerForEvents() {
        return this.notify.asObservable();
    }
}
PublicEventsService.ɵfac = function PublicEventsService_Factory(t) { return new (t || PublicEventsService)(); };
PublicEventsService.ɵprov = i0.ɵɵdefineInjectable({ token: PublicEventsService, factory: PublicEventsService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(PublicEventsService, [{
        type: Injectable
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWV2ZW50cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvcHVibGljLWV2ZW50cy9wdWJsaWMtZXZlbnRzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUtyQyxNQUFNLE9BQU8sbUJBQW1CO0lBRGhDO1FBRVUsV0FBTSxHQUFHLElBQUksYUFBYSxDQUE4QixDQUFDLENBQUMsQ0FBQztLQWtCcEU7SUFoQkM7Ozs7O09BS0c7SUFDSCxTQUFTLENBQUksSUFBZ0IsRUFBRSxLQUFTO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsaUJBQWlCO1FBQ2YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3BDLENBQUM7O3NGQWxCVSxtQkFBbUI7MkRBQW5CLG1CQUFtQixXQUFuQixtQkFBbUI7a0RBQW5CLG1CQUFtQjtjQUQvQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEV2ZW50VHlwZXMgfSBmcm9tICcuL2V2ZW50LXR5cGVzJztcclxuaW1wb3J0IHsgT2lkY0NsaWVudE5vdGlmaWNhdGlvbiB9IGZyb20gJy4vbm90aWZpY2F0aW9uJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFB1YmxpY0V2ZW50c1NlcnZpY2Uge1xyXG4gIHByaXZhdGUgbm90aWZ5ID0gbmV3IFJlcGxheVN1YmplY3Q8T2lkY0NsaWVudE5vdGlmaWNhdGlvbjxhbnk+PigxKTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmlyZXMgYSBuZXcgZXZlbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdHlwZSBUaGUgZXZlbnQgdHlwZS5cclxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIGV2ZW50IHZhbHVlLlxyXG4gICAqL1xyXG4gIGZpcmVFdmVudDxUPih0eXBlOiBFdmVudFR5cGVzLCB2YWx1ZT86IFQpIHtcclxuICAgIHRoaXMubm90aWZ5Lm5leHQoeyB0eXBlLCB2YWx1ZSB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFdpcmVzIHVwIHRoZSBldmVudCBub3RpZmljYXRpb24gb2JzZXJ2YWJsZS5cclxuICAgKi9cclxuICByZWdpc3RlckZvckV2ZW50cygpIHtcclxuICAgIHJldHVybiB0aGlzLm5vdGlmeS5hc09ic2VydmFibGUoKTtcclxuICB9XHJcbn1cclxuIl19