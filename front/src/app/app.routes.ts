import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/login-page.component';
import { SaasAdminPageComponent } from './features/saas/saas-admin-page.component';
import { CompanyAdminPageComponent } from './features/company/company-admin-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'saas', component: SaasAdminPageComponent },
  { path: 'empresa', component: CompanyAdminPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
