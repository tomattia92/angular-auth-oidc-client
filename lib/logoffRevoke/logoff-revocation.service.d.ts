import { Observable } from 'rxjs';
import { DataService } from '../api/data.service';
import { ConfigurationProvider } from '../config/config.provider';
import { ResetAuthDataService } from '../flows/reset-auth-data.service';
import { CheckSessionService } from '../iframe/check-session.service';
import { LoggerService } from '../logging/logger.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { UrlService } from '../utils/url/url.service';
import * as i0 from "@angular/core";
export declare class LogoffRevocationService {
    private dataService;
    private storagePersistenceService;
    private loggerService;
    private urlService;
    private checkSessionService;
    private resetAuthDataService;
    private configurationProvider;
    constructor(dataService: DataService, storagePersistenceService: StoragePersistenceService, loggerService: LoggerService, urlService: UrlService, checkSessionService: CheckSessionService, resetAuthDataService: ResetAuthDataService, configurationProvider: ConfigurationProvider);
    logoff(urlHandler?: (url: string) => any): void;
    logoffLocal(): void;
    logoffAndRevokeTokens(urlHandler?: (url: string) => any): Observable<any>;
    revokeAccessToken(accessToken?: any): Observable<any>;
    revokeRefreshToken(refreshToken?: any): Observable<any>;
    getEndSessionUrl(customParams?: {
        [key: string]: string | number | boolean;
    }): string | null;
    static ɵfac: i0.ɵɵFactoryDef<LogoffRevocationService, never>;
    static ɵprov: i0.ɵɵInjectableDef<LogoffRevocationService>;
}
//# sourceMappingURL=logoff-revocation.service.d.ts.map