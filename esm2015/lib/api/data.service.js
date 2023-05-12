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
        headers = headers.set('Access-Control-Allow-Origin', '*');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvYXBpL2RhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFLM0MsTUFBTSxpQkFBaUIsR0FBRyxhQUFhLENBQUM7QUFHeEMsTUFBTSxPQUFPLFdBQVc7SUFDdEIsWUFBb0IsVUFBMkIsRUFBbUIscUJBQTRDO1FBQTFGLGVBQVUsR0FBVixVQUFVLENBQWlCO1FBQW1CLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7SUFBRyxDQUFDO0lBRWxILEdBQUcsQ0FBSSxHQUFXLEVBQUUsS0FBYztRQUNoQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFFOUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzNFLElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFJLEdBQUcsRUFBRTtZQUNqQyxPQUFPO1lBQ1AsTUFBTTtTQUNQLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJLENBQUksR0FBVyxFQUFFLElBQVMsRUFBRSxhQUEyQjtRQUN6RCxNQUFNLE9BQU8sR0FBRyxhQUFhLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZELElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFFOUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzNFLElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDNUM7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRU8sY0FBYyxDQUFDLEtBQWM7UUFDbkMsSUFBSSxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNoQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNwRCxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUUxRCxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDWCxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsU0FBUyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDL0U7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDOztzRUF2Q1UsV0FBVzttREFBWCxXQUFXLFdBQVgsV0FBVztrREFBWCxXQUFXO2NBRHZCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwSGVhZGVycywgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xyXG5pbXBvcnQgeyBIdHRwQmFzZVNlcnZpY2UgfSBmcm9tICcuL2h0dHAtYmFzZS5zZXJ2aWNlJztcclxuXHJcbmNvbnN0IE5HU1dfQ1VTVE9NX1BBUkFNID0gJ25nc3ctYnlwYXNzJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIERhdGFTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHBDbGllbnQ6IEh0dHBCYXNlU2VydmljZSwgcHJpdmF0ZSByZWFkb25seSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcikge31cclxuXHJcbiAgZ2V0PFQ+KHVybDogc3RyaW5nLCB0b2tlbj86IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMucHJlcGFyZUhlYWRlcnModG9rZW4pO1xyXG4gICAgbGV0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKCk7XHJcblxyXG4gICAgY29uc3QgeyBuZ3N3QnlwYXNzIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XHJcbiAgICBpZiAobmdzd0J5cGFzcykge1xyXG4gICAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KE5HU1dfQ1VTVE9NX1BBUkFNLCAnJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5odHRwQ2xpZW50LmdldDxUPih1cmwsIHtcclxuICAgICAgaGVhZGVycyxcclxuICAgICAgcGFyYW1zLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwb3N0PFQ+KHVybDogc3RyaW5nLCBib2R5OiBhbnksIGhlYWRlcnNQYXJhbXM/OiBIdHRwSGVhZGVycykge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGhlYWRlcnNQYXJhbXMgfHwgdGhpcy5wcmVwYXJlSGVhZGVycygpO1xyXG4gICAgbGV0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKCk7XHJcblxyXG4gICAgY29uc3QgeyBuZ3N3QnlwYXNzIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XHJcbiAgICBpZiAobmdzd0J5cGFzcykge1xyXG4gICAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KE5HU1dfQ1VTVE9NX1BBUkFNLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaHR0cENsaWVudC5wb3N0PFQ+KHVybCwgYm9keSwgeyBoZWFkZXJzLCBwYXJhbXMgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHByZXBhcmVIZWFkZXJzKHRva2VuPzogc3RyaW5nKSB7XHJcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG4gICAgaGVhZGVycyA9IGhlYWRlcnMuc2V0KCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgaGVhZGVycyA9IGhlYWRlcnMuc2V0KCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xyXG5cclxuICAgIGlmICghIXRva2VuKSB7XHJcbiAgICAgIGhlYWRlcnMgPSBoZWFkZXJzLnNldCgnQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIGRlY29kZVVSSUNvbXBvbmVudCh0b2tlbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBoZWFkZXJzO1xyXG4gIH1cclxufVxyXG4iXX0=