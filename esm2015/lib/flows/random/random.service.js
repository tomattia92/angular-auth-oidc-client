import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
export class RandomService {
    constructor(doc, loggerService) {
        this.doc = doc;
        this.loggerService = loggerService;
    }
    createRandom(requiredLength) {
        if (requiredLength <= 0) {
            return '';
        }
        if (requiredLength > 0 && requiredLength < 7) {
            this.loggerService.logWarning(`RandomService called with ${requiredLength} but 7 chars is the minimum, returning 10 chars`);
            requiredLength = 10;
        }
        const length = requiredLength - 6;
        const arr = new Uint8Array(Math.floor((length || length) / 2));
        if (this.getCrypto()) {
            this.getCrypto().getRandomValues(arr);
        }
        return Array.from(arr, this.toHex).join('') + this.randomString(7);
    }
    toHex(dec) {
        return ('0' + dec.toString(16)).substr(-2);
    }
    randomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = new Uint32Array(length);
        if (this.getCrypto()) {
            this.getCrypto().getRandomValues(values);
            for (let i = 0; i < length; i++) {
                result += characters[values[i] % characters.length];
            }
        }
        return result;
    }
    getCrypto() {
        // support for IE,  (window.crypto || window.msCrypto)
        return this.doc.defaultView.crypto || this.doc.defaultView.msCrypto;
    }
}
RandomService.ɵfac = function RandomService_Factory(t) { return new (t || RandomService)(i0.ɵɵinject(DOCUMENT), i0.ɵɵinject(i1.LoggerService)); };
RandomService.ɵprov = i0.ɵɵdefineInjectable({ token: RandomService, factory: RandomService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RandomService, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: [DOCUMENT]
            }] }, { type: i1.LoggerService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9mbG93cy9yYW5kb20vcmFuZG9tLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFJbkQsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFBK0MsR0FBUSxFQUFVLGFBQTRCO1FBQTlDLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFHLENBQUM7SUFFakcsWUFBWSxDQUFDLGNBQXNCO1FBQ2pDLElBQUksY0FBYyxJQUFJLENBQUMsRUFBRTtZQUN2QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsSUFBSSxjQUFjLEdBQUcsQ0FBQyxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsNkJBQTZCLGNBQWMsaURBQWlELENBQUMsQ0FBQztZQUM1SCxjQUFjLEdBQUcsRUFBRSxDQUFDO1NBQ3JCO1FBRUQsTUFBTSxNQUFNLEdBQUcsY0FBYyxHQUFHLENBQUMsQ0FBQztRQUNsQyxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2QztRQUVELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFTyxLQUFLLENBQUMsR0FBRztRQUNmLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTyxZQUFZLENBQUMsTUFBTTtRQUN6QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsTUFBTSxVQUFVLEdBQUcsZ0VBQWdFLENBQUM7UUFFcEYsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMvQixNQUFNLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDckQ7U0FDRjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxTQUFTO1FBQ2Ysc0RBQXNEO1FBQ3RELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBbUIsQ0FBQyxRQUFRLENBQUM7SUFDL0UsQ0FBQzs7MEVBNUNVLGFBQWEsY0FDSixRQUFRO3FEQURqQixhQUFhLFdBQWIsYUFBYTtrREFBYixhQUFhO2NBRHpCLFVBQVU7O3NCQUVJLE1BQU07dUJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmFuZG9tU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgcmVhZG9ubHkgZG9jOiBhbnksIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSkge31cblxuICBjcmVhdGVSYW5kb20ocmVxdWlyZWRMZW5ndGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgaWYgKHJlcXVpcmVkTGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBpZiAocmVxdWlyZWRMZW5ndGggPiAwICYmIHJlcXVpcmVkTGVuZ3RoIDwgNykge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoYFJhbmRvbVNlcnZpY2UgY2FsbGVkIHdpdGggJHtyZXF1aXJlZExlbmd0aH0gYnV0IDcgY2hhcnMgaXMgdGhlIG1pbmltdW0sIHJldHVybmluZyAxMCBjaGFyc2ApO1xuICAgICAgcmVxdWlyZWRMZW5ndGggPSAxMDtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSByZXF1aXJlZExlbmd0aCAtIDY7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoTWF0aC5mbG9vcigobGVuZ3RoIHx8IGxlbmd0aCkgLyAyKSk7XG4gICAgaWYgKHRoaXMuZ2V0Q3J5cHRvKCkpIHtcbiAgICAgIHRoaXMuZ2V0Q3J5cHRvKCkuZ2V0UmFuZG9tVmFsdWVzKGFycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIEFycmF5LmZyb20oYXJyLCB0aGlzLnRvSGV4KS5qb2luKCcnKSArIHRoaXMucmFuZG9tU3RyaW5nKDcpO1xuICB9XG5cbiAgcHJpdmF0ZSB0b0hleChkZWMpIHtcbiAgICByZXR1cm4gKCcwJyArIGRlYy50b1N0cmluZygxNikpLnN1YnN0cigtMik7XG4gIH1cblxuICBwcml2YXRlIHJhbmRvbVN0cmluZyhsZW5ndGgpOiBzdHJpbmcge1xuICAgIGxldCByZXN1bHQgPSAnJztcbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5JztcblxuICAgIGNvbnN0IHZhbHVlcyA9IG5ldyBVaW50MzJBcnJheShsZW5ndGgpO1xuICAgIGlmICh0aGlzLmdldENyeXB0bygpKSB7XG4gICAgICB0aGlzLmdldENyeXB0bygpLmdldFJhbmRvbVZhbHVlcyh2YWx1ZXMpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVyc1t2YWx1ZXNbaV0gJSBjaGFyYWN0ZXJzLmxlbmd0aF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q3J5cHRvKCkge1xuICAgIC8vIHN1cHBvcnQgZm9yIElFLCAgKHdpbmRvdy5jcnlwdG8gfHwgd2luZG93Lm1zQ3J5cHRvKVxuICAgIHJldHVybiB0aGlzLmRvYy5kZWZhdWx0Vmlldy5jcnlwdG8gfHwgKHRoaXMuZG9jLmRlZmF1bHRWaWV3IGFzIGFueSkubXNDcnlwdG87XG4gIH1cbn1cbiJdfQ==