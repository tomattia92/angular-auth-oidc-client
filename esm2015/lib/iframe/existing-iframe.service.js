import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../logging/logger.service";
export class IFrameService {
    constructor(doc, loggerService) {
        this.doc = doc;
        this.loggerService = loggerService;
    }
    getExistingIFrame(identifier) {
        const iFrameOnParent = this.getIFrameFromParentWindow(identifier);
        if (this.isIFrameElement(iFrameOnParent)) {
            return iFrameOnParent;
        }
        const iFrameOnSelf = this.getIFrameFromWindow(identifier);
        if (this.isIFrameElement(iFrameOnSelf)) {
            return iFrameOnSelf;
        }
        return null;
    }
    addIFrameToWindowBody(identifier) {
        const sessionIframe = this.doc.createElement('iframe');
        sessionIframe.id = identifier;
        sessionIframe.title = identifier;
        this.loggerService.logDebug(sessionIframe);
        sessionIframe.style.display = 'none';
        this.doc.body.appendChild(sessionIframe);
        return sessionIframe;
    }
    getIFrameFromParentWindow(identifier) {
        try {
            const iFrameElement = this.doc.defaultView.parent.document.getElementById(identifier);
            if (this.isIFrameElement(iFrameElement)) {
                return iFrameElement;
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
    getIFrameFromWindow(identifier) {
        const iFrameElement = this.doc.getElementById(identifier);
        if (this.isIFrameElement(iFrameElement)) {
            return iFrameElement;
        }
        return null;
    }
    isIFrameElement(element) {
        return !!element && element instanceof HTMLIFrameElement;
    }
}
IFrameService.ɵfac = function IFrameService_Factory(t) { return new (t || IFrameService)(i0.ɵɵinject(DOCUMENT), i0.ɵɵinject(i1.LoggerService)); };
IFrameService.ɵprov = i0.ɵɵdefineInjectable({ token: IFrameService, factory: IFrameService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(IFrameService, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: [DOCUMENT]
            }] }, { type: i1.LoggerService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9pZnJhbWUvZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFJbkQsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFBK0MsR0FBUSxFQUFVLGFBQTRCO1FBQTlDLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFHLENBQUM7SUFFakcsaUJBQWlCLENBQUMsVUFBa0I7UUFDbEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xFLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUN4QyxPQUFPLGNBQWMsQ0FBQztTQUN2QjtRQUVELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxRCxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDdEMsT0FBTyxZQUFZLENBQUM7U0FDckI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxVQUFrQjtRQUN0QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RCxhQUFhLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQztRQUM5QixhQUFhLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUNqQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDckMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFTyx5QkFBeUIsQ0FBQyxVQUFrQjtRQUNsRCxJQUFJO1lBQ0YsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdEYsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUN2QyxPQUFPLGFBQWEsQ0FBQzthQUN0QjtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRU8sbUJBQW1CLENBQUMsVUFBa0I7UUFDNUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUQsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3ZDLE9BQU8sYUFBYSxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sZUFBZSxDQUFDLE9BQTJCO1FBQ2pELE9BQU8sQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLFlBQVksaUJBQWlCLENBQUM7SUFDM0QsQ0FBQzs7MEVBaERVLGFBQWEsY0FDSixRQUFRO3FEQURqQixhQUFhLFdBQWIsYUFBYTtrREFBYixhQUFhO2NBRHpCLFVBQVU7O3NCQUVJLE1BQU07dUJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSUZyYW1lU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgcmVhZG9ubHkgZG9jOiBhbnksIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSkge31cblxuICBnZXRFeGlzdGluZ0lGcmFtZShpZGVudGlmaWVyOiBzdHJpbmcpOiBIVE1MSUZyYW1lRWxlbWVudCB8IG51bGwge1xuICAgIGNvbnN0IGlGcmFtZU9uUGFyZW50ID0gdGhpcy5nZXRJRnJhbWVGcm9tUGFyZW50V2luZG93KGlkZW50aWZpZXIpO1xuICAgIGlmICh0aGlzLmlzSUZyYW1lRWxlbWVudChpRnJhbWVPblBhcmVudCkpIHtcbiAgICAgIHJldHVybiBpRnJhbWVPblBhcmVudDtcbiAgICB9XG5cbiAgICBjb25zdCBpRnJhbWVPblNlbGYgPSB0aGlzLmdldElGcmFtZUZyb21XaW5kb3coaWRlbnRpZmllcik7XG4gICAgaWYgKHRoaXMuaXNJRnJhbWVFbGVtZW50KGlGcmFtZU9uU2VsZikpIHtcbiAgICAgIHJldHVybiBpRnJhbWVPblNlbGY7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYWRkSUZyYW1lVG9XaW5kb3dCb2R5KGlkZW50aWZpZXI6IHN0cmluZyk6IEhUTUxJRnJhbWVFbGVtZW50IHtcbiAgICBjb25zdCBzZXNzaW9uSWZyYW1lID0gdGhpcy5kb2MuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgc2Vzc2lvbklmcmFtZS5pZCA9IGlkZW50aWZpZXI7XG4gICAgc2Vzc2lvbklmcmFtZS50aXRsZSA9IGlkZW50aWZpZXI7XG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKHNlc3Npb25JZnJhbWUpO1xuICAgIHNlc3Npb25JZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0aGlzLmRvYy5ib2R5LmFwcGVuZENoaWxkKHNlc3Npb25JZnJhbWUpO1xuICAgIHJldHVybiBzZXNzaW9uSWZyYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRJRnJhbWVGcm9tUGFyZW50V2luZG93KGlkZW50aWZpZXI6IHN0cmluZyk6IEhUTUxJRnJhbWVFbGVtZW50IHwgbnVsbCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGlGcmFtZUVsZW1lbnQgPSB0aGlzLmRvYy5kZWZhdWx0Vmlldy5wYXJlbnQuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRlbnRpZmllcik7XG4gICAgICBpZiAodGhpcy5pc0lGcmFtZUVsZW1lbnQoaUZyYW1lRWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuIGlGcmFtZUVsZW1lbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldElGcmFtZUZyb21XaW5kb3coaWRlbnRpZmllcjogc3RyaW5nKTogSFRNTElGcmFtZUVsZW1lbnQgfCBudWxsIHtcbiAgICBjb25zdCBpRnJhbWVFbGVtZW50ID0gdGhpcy5kb2MuZ2V0RWxlbWVudEJ5SWQoaWRlbnRpZmllcik7XG4gICAgaWYgKHRoaXMuaXNJRnJhbWVFbGVtZW50KGlGcmFtZUVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gaUZyYW1lRWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGlzSUZyYW1lRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwpOiBlbGVtZW50IGlzIEhUTUxJRnJhbWVFbGVtZW50IHtcbiAgICByZXR1cm4gISFlbGVtZW50ICYmIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudDtcbiAgfVxufVxuIl19