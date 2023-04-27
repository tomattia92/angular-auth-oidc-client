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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWV2ZW50cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvcHVibGljLWV2ZW50cy9wdWJsaWMtZXZlbnRzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUtyQyxNQUFNLE9BQU8sbUJBQW1CO0lBRGhDO1FBRVUsV0FBTSxHQUFHLElBQUksYUFBYSxDQUE4QixDQUFDLENBQUMsQ0FBQztLQWtCcEU7SUFoQkM7Ozs7O09BS0c7SUFDSCxTQUFTLENBQUksSUFBZ0IsRUFBRSxLQUFTO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsaUJBQWlCO1FBQ2YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3BDLENBQUM7O3NGQWxCVSxtQkFBbUI7MkRBQW5CLG1CQUFtQixXQUFuQixtQkFBbUI7a0RBQW5CLG1CQUFtQjtjQUQvQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRXZlbnRUeXBlcyB9IGZyb20gJy4vZXZlbnQtdHlwZXMnO1xuaW1wb3J0IHsgT2lkY0NsaWVudE5vdGlmaWNhdGlvbiB9IGZyb20gJy4vbm90aWZpY2F0aW9uJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFB1YmxpY0V2ZW50c1NlcnZpY2Uge1xuICBwcml2YXRlIG5vdGlmeSA9IG5ldyBSZXBsYXlTdWJqZWN0PE9pZGNDbGllbnROb3RpZmljYXRpb248YW55Pj4oMSk7XG5cbiAgLyoqXG4gICAqIEZpcmVzIGEgbmV3IGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSBUaGUgZXZlbnQgdHlwZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBldmVudCB2YWx1ZS5cbiAgICovXG4gIGZpcmVFdmVudDxUPih0eXBlOiBFdmVudFR5cGVzLCB2YWx1ZT86IFQpIHtcbiAgICB0aGlzLm5vdGlmeS5uZXh0KHsgdHlwZSwgdmFsdWUgfSk7XG4gIH1cblxuICAvKipcbiAgICogV2lyZXMgdXAgdGhlIGV2ZW50IG5vdGlmaWNhdGlvbiBvYnNlcnZhYmxlLlxuICAgKi9cbiAgcmVnaXN0ZXJGb3JFdmVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMubm90aWZ5LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG59XG4iXX0=