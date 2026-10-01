import { Routes } from '@angular/router';
import { AppLayoutComponent } from './core/layout/app-layout.component';

export const routes: Routes = [
  { path: '', component: AppLayoutComponent },
  { path: 'empresa', component: AppLayoutComponent },
  { path: '**', redirectTo: '' },
];
