import { Component } from '@angular/core';
import { OidcSecurityService, PublicConfiguration } from 'angular-auth-oidc-client-t4u';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sample-code-flow-popup';

  userData$: Observable<any>;

  configuration: PublicConfiguration;

  isAuthenticated$: Observable<boolean>;

  constructor(public oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    this.configuration = this.oidcSecurityService.configuration;
    this.userData$ = this.oidcSecurityService.userData$;
    this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;

    this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => {
      console.log('app authenticated', isAuthenticated);
      const at = this.oidcSecurityService.getToken();
      console.log(`Current access token is '${at}'`);
    });
  }

  loginWithPopup() {
    this.oidcSecurityService.authorizeWithPopUp().subscribe(({ isAuthenticated, userData, accessToken, errorMessage }) => {
      console.log(isAuthenticated);
      console.log(userData);
      console.log(accessToken);
      console.log(errorMessage);
    });
  }

  openWindow() {
    window.open('/', '_blank');
  }

  forceRefreshSession() {
    this.oidcSecurityService.forceRefreshSession().subscribe((result) => console.warn(result));
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
