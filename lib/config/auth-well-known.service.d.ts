import { PublicEventsService } from '../public-events/public-events.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { AuthWellKnownDataService } from './auth-well-known-data.service';
import { AuthWellKnownEndpoints } from './auth-well-known-endpoints';
import * as i0 from "@angular/core";
export declare class AuthWellKnownService {
    private publicEventsService;
    private dataService;
    private storagePersistenceService;
    constructor(publicEventsService: PublicEventsService, dataService: AuthWellKnownDataService, storagePersistenceService: StoragePersistenceService);
    getAuthWellKnownEndPoints(authWellknownEndpointUrl: string): import("rxjs").Observable<any>;
    storeWellKnownEndpoints(mappedWellKnownEndpoints: AuthWellKnownEndpoints): void;
    private getWellKnownEndPointsFromUrl;
    static ɵfac: i0.ɵɵFactoryDef<AuthWellKnownService, never>;
    static ɵprov: i0.ɵɵInjectableDef<AuthWellKnownService>;
}
//# sourceMappingURL=auth-well-known.service.d.ts.map