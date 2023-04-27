import { Observable } from 'rxjs';
import { AuthOptions } from './auth-options';
import { AuthStateService } from './authState/auth-state.service';
import { CallbackService } from './callback/callback.service';
import { RefreshSessionService } from './callback/refresh-session.service';
import { CheckAuthService } from './check-auth.service';
import { ConfigurationProvider } from './config/config.provider';
import { PublicConfiguration } from './config/public-configuration';
import { FlowsDataService } from './flows/flows-data.service';
import { CheckSessionService } from './iframe/check-session.service';
import { LoginResponse } from './login/login-response';
import { LoginService } from './login/login.service';
import { PopupOptions } from './login/popup/popup-options';
import { LogoffRevocationService } from './logoffRevoke/logoff-revocation.service';
import { StoragePersistenceService } from './storage/storage-persistence.service';
import { TokenResponse } from './tokens/token-response';
import { UserService } from './userData/user-service';
import { TokenHelperService } from './utils/tokenHelper/oidc-token-helper.service';
import * as i0 from "@angular/core";
export declare class OidcSecurityService {
    private checkSessionService;
    private checkAuthService;
    private userService;
    private tokenHelperService;
    private configurationProvider;
    private authStateService;
    private flowsDataService;
    private callbackService;
    private logoffRevocationService;
    private loginService;
    private storagePersistenceService;
    private refreshSessionService;
    /**
     * Gets the currently active OpenID configuration.
     */
    get configuration(): PublicConfiguration;
    /**
     * Provides information about the user after they have logged in.
     */
    get userData$(): Observable<any>;
    /**
     * Emits each time an authorization event occurs. Returns true if the user is authenticated and false if they are not.
     */
    get isAuthenticated$(): Observable<boolean>;
    /**
     * Emits each time the server sends a CheckSession event and the value changed. This property will always return
     * true.
     */
    get checkSessionChanged$(): Observable<boolean>;
    /**
     * Emits on possible STS callback. The observable will never contain a value.
     */
    get stsCallback$(): Observable<any>;
    constructor(checkSessionService: CheckSessionService, checkAuthService: CheckAuthService, userService: UserService, tokenHelperService: TokenHelperService, configurationProvider: ConfigurationProvider, authStateService: AuthStateService, flowsDataService: FlowsDataService, callbackService: CallbackService, logoffRevocationService: LogoffRevocationService, loginService: LoginService, storagePersistenceService: StoragePersistenceService, refreshSessionService: RefreshSessionService);
    /**
     * Starts the complete setup flow. Calling will start the entire authentication flow, and the returned observable
     * will denote whether the user was successfully authenticated.
     *
     * @param url The url to perform the authorization on the behalf of.
     */
    checkAuth(url?: string): Observable<boolean>;
    /**
     * Checks the server for an authenticated session using the iframe silent renew if not locally authenticated.
     */
    checkAuthIncludingServer(): Observable<boolean>;
    /**
     * Returns the access token for the login scenario.
     */
    getToken(): string;
    /**
     * Returns the ID token for the login scenario.
     */
    getIdToken(): string;
    /**
     * Returns the refresh token, if present, for the login scenario.
     */
    getRefreshToken(): string;
    /**
     * Returns the payload from the ID token.
     *
     * @param encode Set to true if the payload is base64 encoded
     */
    getPayloadFromIdToken(encode?: boolean): any;
    /**
     * Sets a custom state for the authorize request.
     *
     * @param state The state to set.
     */
    setState(state: string): void;
    /**
     * Gets the state value used for the authorize request.
     */
    getState(): string;
    /**
     * Redirects the user to the STS to begin the authentication process.
     *
     * @param authOptions The custom options for the the authentication request.
     */
    authorize(authOptions?: AuthOptions): void;
    /**
     * Opens the STS in a new window to begin the authentication process.
     *
     * @param authOptions The custom options for the authentication request.
     * @param popupOptions The configuration for the popup window.
     */
    authorizeWithPopUp(authOptions?: AuthOptions, popupOptions?: PopupOptions): Observable<LoginResponse>;
    /**
     * Manually refreshes the session.
     *
     * @param customParams Custom parameters to pass to the refresh request.
     */
    forceRefreshSession(customParams?: {
        [key: string]: string | number | boolean;
    }): Observable<TokenResponse>;
    /**
     * Revokes the refresh token (if present) and the access token on the server and then performs the logoff operation.
     *
     * @param urlHandler An optional url handler for the logoff request.
     */
    logoffAndRevokeTokens(urlHandler?: (url: string) => any): Observable<any>;
    /**
     * Logs out on the server and the local client. If the server state has changed, confirmed via checksession,
     * then only a local logout is performed.
     *
     * @param urlHandler
     */
    logoff(urlHandler?: (url: string) => any): void;
    /**
     * Logs the user out of the application without logging them out of the server.
     */
    logoffLocal(): void;
    /**
     * Revokes an access token on the STS. This is only required in the code flow with refresh tokens. If no token is
     * provided, then the token from the storage is revoked. You can pass any token to revoke.
     * https://tools.ietf.org/html/rfc7009
     *
     * @param accessToken The access token to revoke.
     */
    revokeAccessToken(accessToken?: any): Observable<any>;
    /**
     * Revokes a refresh token on the STS. This is only required in the code flow with refresh tokens. If no token is
     * provided, then the token from the storage is revoked. You can pass any token to revoke.
     * https://tools.ietf.org/html/rfc7009
     *
     * @param refreshToken The access token to revoke.
     */
    revokeRefreshToken(refreshToken?: any): Observable<any>;
    /**
     * Creates the end session URL which can be used to implement an alternate server logout.
     */
    getEndSessionUrl(customParams?: {
        [key: string]: string | number | boolean;
    }): string | null;
    static ɵfac: i0.ɵɵFactoryDef<OidcSecurityService, never>;
    static ɵprov: i0.ɵɵInjectableDef<OidcSecurityService>;
}
//# sourceMappingURL=oidc.security.service.d.ts.map