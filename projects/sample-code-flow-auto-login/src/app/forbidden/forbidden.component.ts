import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client-t4u';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forbidden',
  templateUrl: 'forbidden.component.html',
})
export class ForbiddenComponent implements OnInit {
  public authenticated$: Observable<boolean>;

  constructor(private oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    this.authenticated$ = this.oidcSecurityService.isAuthenticated$;
  }
}
