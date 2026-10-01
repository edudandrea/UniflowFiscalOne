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
        <section class="dashboard-hero" aria-label="Visao fiscal">
          <div class="welcome-copy">
            <h1>Ola, Eduardo!</h1>
            <p>Visao fiscal para um futuro mais simples.</p>
          </div>

          <div class="hero-motto">
            <span>SIMPLES</span>
            <span>INTELIGENTE</span>
            <span>HUMANO</span>
          </div>

          <div class="metric-card">
            <span>Empresas</span>
            <strong>28</strong>
            <small class="positive">+12%</small>
          </div>
          <div class="metric-card">
            <span>Docs.</span>
            <strong>1.248</strong>
            <small class="warning">+4%</small>
          </div>
          <div class="metric-card">
            <span>Carga</span>
            <strong>28,45%</strong>
            <small class="positive">+1,8%</small>
          </div>
          <div class="metric-card">
            <span>Economia</span>
            <strong>R$ 48.320</strong>
            <small class="warning">+9%</small>
          </div>
        </section>

        <section class="insight-row" aria-label="Indicadores operacionais">
          <article class="growth-card">
            <h2>Gestao fiscal que acompanha o seu crescimento.</h2>
            <button type="button" aria-label="Abrir gestao fiscal">-></button>
          </article>

          <article class="documents-card">
            <h2>Situacao dos Documentos</h2>
            <div class="document-content">
              <div class="document-donut">
                <strong>84%</strong>
                <span>Em dia</span>
              </div>
              <dl>
                <div><dt>Em dia</dt><dd>84%</dd></div>
                <div><dt>Atencao</dt><dd>10%</dd></div>
                <div><dt>Em atraso</dt><dd>6%</dd></div>
              </dl>
            </div>
          </article>
        </section>

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
  protected companyName = 'Nenhuma empresa selecionada';
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
