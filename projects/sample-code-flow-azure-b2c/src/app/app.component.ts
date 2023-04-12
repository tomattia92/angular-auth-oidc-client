import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client-t4u';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(public oidcSecurityService: OidcSecurityService) {}
}
