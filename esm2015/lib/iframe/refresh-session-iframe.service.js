import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../logging/logger.service";
import * as i2 from "../utils/url/url.service";
import * as i3 from "./silent-renew.service";
export class RefreshSessionIframeService {
    constructor(doc, loggerService, urlService, silentRenewService, rendererFactory) {
        this.doc = doc;
        this.loggerService = loggerService;
        this.urlService = urlService;
        this.silentRenewService = silentRenewService;
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    refreshSessionWithIframe(customParams) {
        this.loggerService.logDebug('BEGIN refresh session Authorize Iframe renew');
        const url = this.urlService.getRefreshSessionSilentRenewUrl(customParams);
        return this.sendAuthorizeRequestUsingSilentRenew(url);
    }
    sendAuthorizeRequestUsingSilentRenew(url) {
        const sessionIframe = this.silentRenewService.getOrCreateIframe();
        this.initSilentRenewRequest();
        this.loggerService.logDebug('sendAuthorizeRequestUsingSilentRenew for URL:' + url);
        return new Observable((observer) => {
            const onLoadHandler = () => {
                sessionIframe.removeEventListener('load', onLoadHandler);
                this.loggerService.logDebug('removed event listener from IFrame');
                observer.next(true);
                observer.complete();
            };
            sessionIframe.addEventListener('load', onLoadHandler);
            sessionIframe.contentWindow.location.replace(url);
        });
    }
    initSilentRenewRequest() {
        const instanceId = Math.random();
        const initDestroyHandler = this.renderer.listen('window', 'oidc-silent-renew-init', (e) => {
            if (e.detail !== instanceId) {
                initDestroyHandler();
                renewDestroyHandler();
            }
        });
        const renewDestroyHandler = this.renderer.listen('window', 'oidc-silent-renew-message', (e) => this.silentRenewService.silentRenewEventHandler(e));
        this.doc.defaultView.dispatchEvent(new CustomEvent('oidc-silent-renew-init', {
            detail: instanceId,
        }));
    }
}
RefreshSessionIframeService.ɵfac = function RefreshSessionIframeService_Factory(t) { return new (t || RefreshSessionIframeService)(i0.ɵɵinject(DOCUMENT), i0.ɵɵinject(i1.LoggerService), i0.ɵɵinject(i2.UrlService), i0.ɵɵinject(i3.SilentRenewService), i0.ɵɵinject(i0.RendererFactory2)); };
RefreshSessionIframeService.ɵprov = i0.ɵɵdefineInjectable({ token: RefreshSessionIframeService, factory: RefreshSessionIframeService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RefreshSessionIframeService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: [DOCUMENT]
            }] }, { type: i1.LoggerService }, { type: i2.UrlService }, { type: i3.SilentRenewService }, { type: i0.RendererFactory2 }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC1zZXNzaW9uLWlmcmFtZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvaWZyYW1lL3JlZnJlc2gtc2Vzc2lvbi1pZnJhbWUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7O0FBTWxDLE1BQU0sT0FBTywyQkFBMkI7SUFHdEMsWUFDcUMsR0FBUSxFQUNuQyxhQUE0QixFQUM1QixVQUFzQixFQUN0QixrQkFBc0MsRUFDOUMsZUFBaUM7UUFKRSxRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQ25DLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUc5QyxJQUFJLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCx3QkFBd0IsQ0FBQyxZQUEyRDtRQUNsRixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsK0JBQStCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUUsT0FBTyxJQUFJLENBQUMsb0NBQW9DLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVPLG9DQUFvQyxDQUFDLEdBQVc7UUFDdEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDbEUsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsK0NBQStDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFbkYsT0FBTyxJQUFJLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ2pDLE1BQU0sYUFBYSxHQUFHLEdBQUcsRUFBRTtnQkFDekIsYUFBYSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztnQkFDekQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsb0NBQW9DLENBQUMsQ0FBQztnQkFDbEUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEIsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQztZQUNGLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDdEQsYUFBYSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLHNCQUFzQjtRQUM1QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFakMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQyxDQUFjLEVBQUUsRUFBRTtZQUNyRyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO2dCQUMzQixrQkFBa0IsRUFBRSxDQUFDO2dCQUNyQixtQkFBbUIsRUFBRSxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSwyQkFBMkIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQzVGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FDbkQsQ0FBQztRQUVGLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FDaEMsSUFBSSxXQUFXLENBQUMsd0JBQXdCLEVBQUU7WUFDeEMsTUFBTSxFQUFFLFVBQVU7U0FDbkIsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDOztzR0F0RFUsMkJBQTJCLGNBSTVCLFFBQVE7bUVBSlAsMkJBQTJCLFdBQTNCLDJCQUEyQixtQkFEZCxNQUFNO2tEQUNuQiwyQkFBMkI7Y0FEdkMsVUFBVTtlQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7c0JBSzdCLE1BQU07dUJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgUmVuZGVyZXIyLCBSZW5kZXJlckZhY3RvcnkyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBVcmxTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMvdXJsL3VybC5zZXJ2aWNlJztcbmltcG9ydCB7IFNpbGVudFJlbmV3U2VydmljZSB9IGZyb20gJy4vc2lsZW50LXJlbmV3LnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFJlZnJlc2hTZXNzaW9uSWZyYW1lU2VydmljZSB7XG4gIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIHJlYWRvbmx5IGRvYzogYW55LFxuICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIHVybFNlcnZpY2U6IFVybFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzaWxlbnRSZW5ld1NlcnZpY2U6IFNpbGVudFJlbmV3U2VydmljZSxcbiAgICByZW5kZXJlckZhY3Rvcnk6IFJlbmRlcmVyRmFjdG9yeTJcbiAgKSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyRmFjdG9yeS5jcmVhdGVSZW5kZXJlcihudWxsLCBudWxsKTtcbiAgfVxuXG4gIHJlZnJlc2hTZXNzaW9uV2l0aElmcmFtZShjdXN0b21QYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnQkVHSU4gcmVmcmVzaCBzZXNzaW9uIEF1dGhvcml6ZSBJZnJhbWUgcmVuZXcnKTtcbiAgICBjb25zdCB1cmwgPSB0aGlzLnVybFNlcnZpY2UuZ2V0UmVmcmVzaFNlc3Npb25TaWxlbnRSZW5ld1VybChjdXN0b21QYXJhbXMpO1xuICAgIHJldHVybiB0aGlzLnNlbmRBdXRob3JpemVSZXF1ZXN0VXNpbmdTaWxlbnRSZW5ldyh1cmwpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZW5kQXV0aG9yaXplUmVxdWVzdFVzaW5nU2lsZW50UmVuZXcodXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBzZXNzaW9uSWZyYW1lID0gdGhpcy5zaWxlbnRSZW5ld1NlcnZpY2UuZ2V0T3JDcmVhdGVJZnJhbWUoKTtcbiAgICB0aGlzLmluaXRTaWxlbnRSZW5ld1JlcXVlc3QoKTtcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3NlbmRBdXRob3JpemVSZXF1ZXN0VXNpbmdTaWxlbnRSZW5ldyBmb3IgVVJMOicgKyB1cmwpO1xuXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xuICAgICAgY29uc3Qgb25Mb2FkSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgc2Vzc2lvbklmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkSGFuZGxlcik7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygncmVtb3ZlZCBldmVudCBsaXN0ZW5lciBmcm9tIElGcmFtZScpO1xuICAgICAgICBvYnNlcnZlci5uZXh0KHRydWUpO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfTtcbiAgICAgIHNlc3Npb25JZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uTG9hZEhhbmRsZXIpO1xuICAgICAgc2Vzc2lvbklmcmFtZS5jb250ZW50V2luZG93LmxvY2F0aW9uLnJlcGxhY2UodXJsKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFNpbGVudFJlbmV3UmVxdWVzdCgpOiB2b2lkIHtcbiAgICBjb25zdCBpbnN0YW5jZUlkID0gTWF0aC5yYW5kb20oKTtcblxuICAgIGNvbnN0IGluaXREZXN0cm95SGFuZGxlciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCd3aW5kb3cnLCAnb2lkYy1zaWxlbnQtcmVuZXctaW5pdCcsIChlOiBDdXN0b21FdmVudCkgPT4ge1xuICAgICAgaWYgKGUuZGV0YWlsICE9PSBpbnN0YW5jZUlkKSB7XG4gICAgICAgIGluaXREZXN0cm95SGFuZGxlcigpO1xuICAgICAgICByZW5ld0Rlc3Ryb3lIYW5kbGVyKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcmVuZXdEZXN0cm95SGFuZGxlciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCd3aW5kb3cnLCAnb2lkYy1zaWxlbnQtcmVuZXctbWVzc2FnZScsIChlKSA9PlxuICAgICAgdGhpcy5zaWxlbnRSZW5ld1NlcnZpY2Uuc2lsZW50UmVuZXdFdmVudEhhbmRsZXIoZSlcbiAgICApO1xuXG4gICAgdGhpcy5kb2MuZGVmYXVsdFZpZXcuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnb2lkYy1zaWxlbnQtcmVuZXctaW5pdCcsIHtcbiAgICAgICAgZGV0YWlsOiBpbnN0YW5jZUlkLFxuICAgICAgfSlcbiAgICApO1xuICB9XG59XG4iXX0=