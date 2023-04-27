import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./http-base.service";
import * as i2 from "../config/config.provider";
const NGSW_CUSTOM_PARAM = 'ngsw-bypass';
export class DataService {
    constructor(httpClient, configurationProvider) {
        this.httpClient = httpClient;
        this.configurationProvider = configurationProvider;
    }
    get(url, token) {
        const headers = this.prepareHeaders(token);
        let params = new HttpParams();
        const { ngswBypass } = this.configurationProvider.getOpenIDConfiguration();
        if (ngswBypass) {
            params = params.set(NGSW_CUSTOM_PARAM, '');
        }
        return this.httpClient.get(url, {
            headers,
            params,
        });
    }
    post(url, body, headersParams) {
        const headers = headersParams || this.prepareHeaders();
        let params = new HttpParams();
        const { ngswBypass } = this.configurationProvider.getOpenIDConfiguration();
        if (ngswBypass) {
            params = params.set(NGSW_CUSTOM_PARAM, '');
        }
        return this.httpClient.post(url, body, { headers, params });
    }
    prepareHeaders(token) {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        if (!!token) {
            headers = headers.set('Authorization', 'Bearer ' + decodeURIComponent(token));
        }
        return headers;
    }
}
DataService.ɵfac = function DataService_Factory(t) { return new (t || DataService)(i0.ɵɵinject(i1.HttpBaseService), i0.ɵɵinject(i2.ConfigurationProvider)); };
DataService.ɵprov = i0.ɵɵdefineInjectable({ token: DataService, factory: DataService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(DataService, [{
        type: Injectable
    }], function () { return [{ type: i1.HttpBaseService }, { type: i2.ConfigurationProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvYXBpL2RhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFLM0MsTUFBTSxpQkFBaUIsR0FBRyxhQUFhLENBQUM7QUFHeEMsTUFBTSxPQUFPLFdBQVc7SUFDdEIsWUFBb0IsVUFBMkIsRUFBbUIscUJBQTRDO1FBQTFGLGVBQVUsR0FBVixVQUFVLENBQWlCO1FBQW1CLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7SUFBRyxDQUFDO0lBRWxILEdBQUcsQ0FBSSxHQUFXLEVBQUUsS0FBYztRQUNoQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFFOUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzNFLElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFJLEdBQUcsRUFBRTtZQUNqQyxPQUFPO1lBQ1AsTUFBTTtTQUNQLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJLENBQUksR0FBVyxFQUFFLElBQVMsRUFBRSxhQUEyQjtRQUN6RCxNQUFNLE9BQU8sR0FBRyxhQUFhLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZELElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFFOUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzNFLElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDNUM7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRU8sY0FBYyxDQUFDLEtBQWM7UUFDbkMsSUFBSSxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNoQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUVwRCxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDWCxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsU0FBUyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDL0U7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDOztzRUF0Q1UsV0FBVzttREFBWCxXQUFXLFdBQVgsV0FBVztrREFBWCxXQUFXO2NBRHZCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwSGVhZGVycywgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgSHR0cEJhc2VTZXJ2aWNlIH0gZnJvbSAnLi9odHRwLWJhc2Uuc2VydmljZSc7XG5cbmNvbnN0IE5HU1dfQ1VTVE9NX1BBUkFNID0gJ25nc3ctYnlwYXNzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERhdGFTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwQ2xpZW50OiBIdHRwQmFzZVNlcnZpY2UsIHByaXZhdGUgcmVhZG9ubHkgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIpIHt9XG5cbiAgZ2V0PFQ+KHVybDogc3RyaW5nLCB0b2tlbj86IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLnByZXBhcmVIZWFkZXJzKHRva2VuKTtcbiAgICBsZXQgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMoKTtcblxuICAgIGNvbnN0IHsgbmdzd0J5cGFzcyB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuICAgIGlmIChuZ3N3QnlwYXNzKSB7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KE5HU1dfQ1VTVE9NX1BBUkFNLCAnJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmh0dHBDbGllbnQuZ2V0PFQ+KHVybCwge1xuICAgICAgaGVhZGVycyxcbiAgICAgIHBhcmFtcyxcbiAgICB9KTtcbiAgfVxuXG4gIHBvc3Q8VD4odXJsOiBzdHJpbmcsIGJvZHk6IGFueSwgaGVhZGVyc1BhcmFtcz86IEh0dHBIZWFkZXJzKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IGhlYWRlcnNQYXJhbXMgfHwgdGhpcy5wcmVwYXJlSGVhZGVycygpO1xuICAgIGxldCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpO1xuXG4gICAgY29uc3QgeyBuZ3N3QnlwYXNzIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG4gICAgaWYgKG5nc3dCeXBhc3MpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoTkdTV19DVVNUT01fUEFSQU0sICcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5odHRwQ2xpZW50LnBvc3Q8VD4odXJsLCBib2R5LCB7IGhlYWRlcnMsIHBhcmFtcyB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZUhlYWRlcnModG9rZW4/OiBzdHJpbmcpIHtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgIGhlYWRlcnMgPSBoZWFkZXJzLnNldCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcblxuICAgIGlmICghIXRva2VuKSB7XG4gICAgICBoZWFkZXJzID0gaGVhZGVycy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyBkZWNvZGVVUklDb21wb25lbnQodG9rZW4pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVycztcbiAgfVxufVxuIl19