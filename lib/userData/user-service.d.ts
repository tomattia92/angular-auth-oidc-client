import { Observable } from 'rxjs';
import { DataService } from '../api/data.service';
import { ConfigurationProvider } from '../config/config.provider';
import { LoggerService } from '../logging/logger.service';
import { PublicEventsService } from '../public-events/public-events.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { FlowHelper } from '../utils/flowHelper/flow-helper.service';
import { TokenHelperService } from '../utils/tokenHelper/oidc-token-helper.service';
import * as i0 from "@angular/core";
export declare class UserService {
    private oidcDataService;
    private storagePersistenceService;
    private eventService;
    private loggerService;
    private tokenHelperService;
    private flowHelper;
    private configurationProvider;
    private userDataInternal$;
    get userData$(): Observable<any>;
    constructor(oidcDataService: DataService, storagePersistenceService: StoragePersistenceService, eventService: PublicEventsService, loggerService: LoggerService, tokenHelperService: TokenHelperService, flowHelper: FlowHelper, configurationProvider: ConfigurationProvider);
    getAndPersistUserDataInStore(isRenewProcess?: boolean, idToken?: any, decodedIdToken?: any): Observable<any>;
    getUserDataFromStore(): any;
    publishUserDataIfExists(): void;
    setUserDataToStore(value: any): void;
    resetUserDataInStore(): void;
    private getUserDataOidcFlowAndSave;
    private getIdentityUserData;
    private validateUserDataSubIdToken;
    static ɵfac: i0.ɵɵFactoryDef<UserService, never>;
    static ɵprov: i0.ɵɵInjectableDef<UserService>;
}
//# sourceMappingURL=user-service.d.ts.map