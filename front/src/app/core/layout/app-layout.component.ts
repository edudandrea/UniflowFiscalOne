import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductServicesPageComponent } from '../../features/catalog/product-services-page.component';
import { PricingPageComponent } from '../../features/pricing/pricing-page.component';
import { AppModule, SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, TopbarComponent, ProductServicesPageComponent, PricingPageComponent],
  template: `
    <div class="app-shell">
      <app-sidebar [activeModule]="activeModule" (navigate)="activeModule = $event" />
      <main class="workspace">
        <app-topbar [companyName]="companyName" (notice)="showSystemNotice()" />
        @if (activeModule === 'catalog') {
          <app-product-services-page (openPricing)="activeModule = 'pricing'" />
        } @else {
          <app-pricing-page (companyChange)="companyName = $event" />
        }
      </main>
    </div>
  `,
})
export class AppLayoutComponent {
  protected companyName = 'Empresa Alfa Ltda';
  protected activeModule: AppModule = 'catalog';

  protected showSystemNotice(): void {
    Swal.fire({
      title: 'Central de alertas',
      text: 'SweetAlert2 esta ativo para os avisos do sistema.',
      icon: 'info',
      confirmButtonColor: '#00a98f',
    });
  }
}
