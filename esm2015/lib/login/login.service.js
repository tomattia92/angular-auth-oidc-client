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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL2xvZ2luL2xvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7O0FBVzNDLE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLFlBQ1UscUJBQTRDLEVBQzVDLGVBQWdDLEVBQ2hDLGlCQUFvQyxFQUNwQyxvQkFBMEM7UUFIMUMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO0lBQ2pELENBQUM7SUFFSixLQUFLLENBQUMsV0FBeUI7UUFDN0IsTUFBTSxFQUFFLDhCQUE4QixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFL0YsSUFBSSw4QkFBOEIsRUFBRTtZQUNsQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ25EO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDN0Q7SUFDSCxDQUFDO0lBRUQsY0FBYyxDQUFDLFdBQXlCLEVBQUUsWUFBMkI7UUFDbkUsTUFBTSxFQUFFLDhCQUE4QixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFL0YsSUFBSSw4QkFBOEIsRUFBRTtZQUNsQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQzFFO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDakY7SUFDSCxDQUFDOzt3RUExQlUsWUFBWTtvREFBWixZQUFZLFdBQVosWUFBWTtrREFBWixZQUFZO2NBRHhCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQXV0aE9wdGlvbnMgfSBmcm9tICcuLi9hdXRoLW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcclxuaW1wb3J0IHsgTG9naW5SZXNwb25zZSB9IGZyb20gJy4vbG9naW4tcmVzcG9uc2UnO1xyXG5pbXBvcnQgeyBQYXJMb2dpblNlcnZpY2UgfSBmcm9tICcuL3Bhci9wYXItbG9naW4uc2VydmljZSc7XHJcbmltcG9ydCB7IFBvcFVwTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9wb3B1cC9wb3B1cC1sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9wdXBPcHRpb25zIH0gZnJvbSAnLi9wb3B1cC9wb3B1cC1vcHRpb25zJztcclxuaW1wb3J0IHsgU3RhbmRhcmRMb2dpblNlcnZpY2UgfSBmcm9tICcuL3N0YW5kYXJkL3N0YW5kYXJkLWxvZ2luLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTG9naW5TZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIsXHJcbiAgICBwcml2YXRlIHBhckxvZ2luU2VydmljZTogUGFyTG9naW5TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBwb3BVcExvZ2luU2VydmljZTogUG9wVXBMb2dpblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0YW5kYXJkTG9naW5TZXJ2aWNlOiBTdGFuZGFyZExvZ2luU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgbG9naW4oYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgY29uc3QgeyB1c2VQdXNoZWRBdXRob3Jpc2F0aW9uUmVxdWVzdHMgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcclxuXHJcbiAgICBpZiAodXNlUHVzaGVkQXV0aG9yaXNhdGlvblJlcXVlc3RzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnBhckxvZ2luU2VydmljZS5sb2dpblBhcihhdXRoT3B0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5zdGFuZGFyZExvZ2luU2VydmljZS5sb2dpblN0YW5kYXJkKGF1dGhPcHRpb25zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvZ2luV2l0aFBvcFVwKGF1dGhPcHRpb25zPzogQXV0aE9wdGlvbnMsIHBvcHVwT3B0aW9ucz86IFBvcHVwT3B0aW9ucyk6IE9ic2VydmFibGU8TG9naW5SZXNwb25zZT4ge1xyXG4gICAgY29uc3QgeyB1c2VQdXNoZWRBdXRob3Jpc2F0aW9uUmVxdWVzdHMgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcclxuXHJcbiAgICBpZiAodXNlUHVzaGVkQXV0aG9yaXNhdGlvblJlcXVlc3RzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnBhckxvZ2luU2VydmljZS5sb2dpbldpdGhQb3BVcFBhcihhdXRoT3B0aW9ucywgcG9wdXBPcHRpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnBvcFVwTG9naW5TZXJ2aWNlLmxvZ2luV2l0aFBvcFVwU3RhbmRhcmQoYXV0aE9wdGlvbnMsIHBvcHVwT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==