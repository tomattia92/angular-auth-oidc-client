import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as i0 from "@angular/core";
export class PlatformProvider {
    constructor(platformId) {
        this.platformId = platformId;
    }
    get isBrowser() {
        return isPlatformBrowser(this.platformId);
    }
}
PlatformProvider.ɵfac = function PlatformProvider_Factory(t) { return new (t || PlatformProvider)(i0.ɵɵinject(PLATFORM_ID)); };
PlatformProvider.ɵprov = i0.ɵɵdefineInjectable({ token: PlatformProvider, factory: PlatformProvider.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(PlatformProvider, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0ucHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi91dGlscy9wbGF0Zm9ybS1wcm92aWRlci9wbGF0Zm9ybS5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBR2hFLE1BQU0sT0FBTyxnQkFBZ0I7SUFLM0IsWUFBeUMsVUFBa0I7UUFBbEIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtJQUFHLENBQUM7SUFKL0QsSUFBSSxTQUFTO1FBQ1gsT0FBTyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7Z0ZBSFUsZ0JBQWdCLGNBS1AsV0FBVzt3REFMcEIsZ0JBQWdCLFdBQWhCLGdCQUFnQjtrREFBaEIsZ0JBQWdCO2NBRDVCLFVBQVU7O3NCQU1JLE1BQU07dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUGxhdGZvcm1Qcm92aWRlciB7XHJcbiAgZ2V0IGlzQnJvd3NlcigpIHtcclxuICAgIHJldHVybiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBzdHJpbmcpIHt9XHJcbn1cclxuIl19