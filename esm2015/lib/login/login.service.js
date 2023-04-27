import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../config/config.provider";
import * as i2 from "./par/par-login.service";
import * as i3 from "./popup/popup-login.service";
import * as i4 from "./standard/standard-login.service";
export class LoginService {
    constructor(configurationProvider, parLoginService, popUpLoginService, standardLoginService) {
        this.configurationProvider = configurationProvider;
        this.parLoginService = parLoginService;
        this.popUpLoginService = popUpLoginService;
        this.standardLoginService = standardLoginService;
    }
    login(authOptions) {
        const { usePushedAuthorisationRequests } = this.configurationProvider.getOpenIDConfiguration();
        if (usePushedAuthorisationRequests) {
            return this.parLoginService.loginPar(authOptions);
        }
        else {
            return this.standardLoginService.loginStandard(authOptions);
        }
    }
    loginWithPopUp(authOptions, popupOptions) {
        const { usePushedAuthorisationRequests } = this.configurationProvider.getOpenIDConfiguration();
        if (usePushedAuthorisationRequests) {
            return this.parLoginService.loginWithPopUpPar(authOptions, popupOptions);
        }
        else {
            return this.popUpLoginService.loginWithPopUpStandard(authOptions, popupOptions);
        }
    }
}
LoginService.ɵfac = function LoginService_Factory(t) { return new (t || LoginService)(i0.ɵɵinject(i1.ConfigurationProvider), i0.ɵɵinject(i2.ParLoginService), i0.ɵɵinject(i3.PopUpLoginService), i0.ɵɵinject(i4.StandardLoginService)); };
LoginService.ɵprov = i0.ɵɵdefineInjectable({ token: LoginService, factory: LoginService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(LoginService, [{
        type: Injectable
    }], function () { return [{ type: i1.ConfigurationProvider }, { type: i2.ParLoginService }, { type: i3.PopUpLoginService }, { type: i4.StandardLoginService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2xvZ2luL2xvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7O0FBVzNDLE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLFlBQ1UscUJBQTRDLEVBQzVDLGVBQWdDLEVBQ2hDLGlCQUFvQyxFQUNwQyxvQkFBMEM7UUFIMUMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO0lBQ2pELENBQUM7SUFFSixLQUFLLENBQUMsV0FBeUI7UUFDN0IsTUFBTSxFQUFFLDhCQUE4QixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFL0YsSUFBSSw4QkFBOEIsRUFBRTtZQUNsQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ25EO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDN0Q7SUFDSCxDQUFDO0lBRUQsY0FBYyxDQUFDLFdBQXlCLEVBQUUsWUFBMkI7UUFDbkUsTUFBTSxFQUFFLDhCQUE4QixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFL0YsSUFBSSw4QkFBOEIsRUFBRTtZQUNsQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQzFFO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDakY7SUFDSCxDQUFDOzt3RUExQlUsWUFBWTtvREFBWixZQUFZLFdBQVosWUFBWTtrREFBWixZQUFZO2NBRHhCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBdXRoT3B0aW9ucyB9IGZyb20gJy4uL2F1dGgtb3B0aW9ucyc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcbmltcG9ydCB7IExvZ2luUmVzcG9uc2UgfSBmcm9tICcuL2xvZ2luLXJlc3BvbnNlJztcbmltcG9ydCB7IFBhckxvZ2luU2VydmljZSB9IGZyb20gJy4vcGFyL3Bhci1sb2dpbi5zZXJ2aWNlJztcbmltcG9ydCB7IFBvcFVwTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9wb3B1cC9wb3B1cC1sb2dpbi5zZXJ2aWNlJztcbmltcG9ydCB7IFBvcHVwT3B0aW9ucyB9IGZyb20gJy4vcG9wdXAvcG9wdXAtb3B0aW9ucyc7XG5pbXBvcnQgeyBTdGFuZGFyZExvZ2luU2VydmljZSB9IGZyb20gJy4vc3RhbmRhcmQvc3RhbmRhcmQtbG9naW4uc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb2dpblNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuICAgIHByaXZhdGUgcGFyTG9naW5TZXJ2aWNlOiBQYXJMb2dpblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb3BVcExvZ2luU2VydmljZTogUG9wVXBMb2dpblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzdGFuZGFyZExvZ2luU2VydmljZTogU3RhbmRhcmRMb2dpblNlcnZpY2VcbiAgKSB7fVxuXG4gIGxvZ2luKGF1dGhPcHRpb25zPzogQXV0aE9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHVzZVB1c2hlZEF1dGhvcmlzYXRpb25SZXF1ZXN0cyB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuXG4gICAgaWYgKHVzZVB1c2hlZEF1dGhvcmlzYXRpb25SZXF1ZXN0cykge1xuICAgICAgcmV0dXJuIHRoaXMucGFyTG9naW5TZXJ2aWNlLmxvZ2luUGFyKGF1dGhPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhbmRhcmRMb2dpblNlcnZpY2UubG9naW5TdGFuZGFyZChhdXRoT3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgbG9naW5XaXRoUG9wVXAoYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zPzogUG9wdXBPcHRpb25zKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlPiB7XG4gICAgY29uc3QgeyB1c2VQdXNoZWRBdXRob3Jpc2F0aW9uUmVxdWVzdHMgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcblxuICAgIGlmICh1c2VQdXNoZWRBdXRob3Jpc2F0aW9uUmVxdWVzdHMpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhckxvZ2luU2VydmljZS5sb2dpbldpdGhQb3BVcFBhcihhdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucG9wVXBMb2dpblNlcnZpY2UubG9naW5XaXRoUG9wVXBTdGFuZGFyZChhdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==