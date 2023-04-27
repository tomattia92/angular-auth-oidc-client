import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationProvider } from '../config/config.provider';
import { HttpBaseService } from './http-base.service';
import * as i0 from "@angular/core";
export declare class DataService {
    private httpClient;
    private readonly configurationProvider;
    constructor(httpClient: HttpBaseService, configurationProvider: ConfigurationProvider);
    get<T>(url: string, token?: string): Observable<T>;
    post<T>(url: string, body: any, headersParams?: HttpHeaders): Observable<T>;
    private prepareHeaders;
    static ɵfac: i0.ɵɵFactoryDef<DataService, never>;
    static ɵprov: i0.ɵɵInjectableDef<DataService>;
}
//# sourceMappingURL=data.service.d.ts.map