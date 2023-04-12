import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client-t4u';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: 'navigation.component.html',
})
export class NavigationComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  constructor(public oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  refreshSession() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
