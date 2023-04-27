import { AuthStateService } from '../authState/auth-state.service';
import { UserService } from '../userData/user-service';
import { FlowsDataService } from './flows-data.service';
import * as i0 from "@angular/core";
export declare class ResetAuthDataService {
    private readonly authStateService;
    private readonly flowsDataService;
    private readonly userService;
    constructor(authStateService: AuthStateService, flowsDataService: FlowsDataService, userService: UserService);
    resetAuthorizationData(): void;
    static ɵfac: i0.ɵɵFactoryDef<ResetAuthDataService, never>;
    static ɵprov: i0.ɵɵInjectableDef<ResetAuthDataService>;
}
//# sourceMappingURL=reset-auth-data.service.d.ts.map