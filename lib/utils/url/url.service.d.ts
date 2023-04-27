import { ConfigurationProvider } from '../../config/config.provider';
import { FlowsDataService } from '../../flows/flows-data.service';
import { LoggerService } from '../../logging/logger.service';
import { StoragePersistenceService } from '../../storage/storage-persistence.service';
import { TokenValidationService } from '../../validation/token-validation.service';
import { FlowHelper } from '../flowHelper/flow-helper.service';
import * as i0 from "@angular/core";
export declare class UrlService {
    private readonly configurationProvider;
    private readonly loggerService;
    private readonly flowsDataService;
    private readonly flowHelper;
    private tokenValidationService;
    private storagePersistenceService;
    constructor(configurationProvider: ConfigurationProvider, loggerService: LoggerService, flowsDataService: FlowsDataService, flowHelper: FlowHelper, tokenValidationService: TokenValidationService, storagePersistenceService: StoragePersistenceService);
    getUrlParameter(urlToCheck: any, name: any): string;
    isCallbackFromSts(currentUrl: string): boolean;
    getRefreshSessionSilentRenewUrl(customParams?: {
        [key: string]: string | number | boolean;
    }): string;
    getAuthorizeParUrl(requestUri: string): string;
    getAuthorizeUrl(customParams?: {
        [key: string]: string | number | boolean;
    }): string;
    createEndSessionUrl(idTokenHint: string, customParamsEndSession?: {
        [p: string]: string | number | boolean;
    }): string;
    createRevocationEndpointBodyAccessToken(token: any): string;
    createRevocationEndpointBodyRefreshToken(token: any): string;
    getRevocationEndpointUrl(): string;
    createBodyForCodeFlowCodeRequest(code: string, customTokenParams?: {
        [p: string]: string | number | boolean;
    }): string;
    createBodyForCodeFlowRefreshTokensRequest(refreshToken: string, customParamsRefresh?: {
        [key: string]: string | number | boolean;
    }): string;
    createBodyForParCodeFlowRequest(customParamsRequest?: {
        [key: string]: string | number | boolean;
    }): string;
    private createAuthorizeUrl;
    private createUrlImplicitFlowWithSilentRenew;
    private createUrlCodeFlowWithSilentRenew;
    private createUrlImplicitFlowAuthorize;
    private createUrlCodeFlowAuthorize;
    private getRedirectUrl;
    private getSilentRenewUrl;
    private getPostLogoutRedirectUrl;
    private getClientId;
    private composeCustomParams;
    static ɵfac: i0.ɵɵFactoryDef<UrlService, never>;
    static ɵprov: i0.ɵɵInjectableDef<UrlService>;
}
//# sourceMappingURL=url.service.d.ts.map