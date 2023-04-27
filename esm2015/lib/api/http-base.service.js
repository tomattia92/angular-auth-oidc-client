import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class HttpBaseService {
    constructor(http) {
        this.http = http;
    }
    get(url, params) {
        return this.http.get(url, params);
    }
    post(url, body, params) {
        return this.http.post(url, body, params);
    }
}
HttpBaseService.ɵfac = function HttpBaseService_Factory(t) { return new (t || HttpBaseService)(i0.ɵɵinject(i1.HttpClient)); };
HttpBaseService.ɵprov = i0.ɵɵdefineInjectable({ token: HttpBaseService, factory: HttpBaseService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(HttpBaseService, [{
        type: Injectable
    }], function () { return [{ type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1iYXNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9hcGkvaHR0cC1iYXNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBSTNDLE1BQU0sT0FBTyxlQUFlO0lBQzFCLFlBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBRyxDQUFDO0lBRXhDLEdBQUcsQ0FBSSxHQUFXLEVBQUUsTUFBK0I7UUFDakQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBSSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQUksQ0FBSSxHQUFXLEVBQUUsSUFBUyxFQUFFLE1BQStCO1FBQzdELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUksR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5QyxDQUFDOzs4RUFUVSxlQUFlO3VEQUFmLGVBQWUsV0FBZixlQUFlO2tEQUFmLGVBQWU7Y0FEM0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBIdHRwQmFzZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHt9XG5cbiAgZ2V0PFQ+KHVybDogc3RyaW5nLCBwYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8VD4odXJsLCBwYXJhbXMpO1xuICB9XG5cbiAgcG9zdDxUPih1cmw6IHN0cmluZywgYm9keTogYW55LCBwYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PFQ+KHVybCwgYm9keSwgcGFyYW1zKTtcbiAgfVxufVxuIl19