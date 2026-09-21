import { Component, EventEmitter, Input, Output } from '@angular/core';

export type AppModule = 'catalog' | 'pricing';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">U</div>
        <div>
          <strong>UniFlowFiscalOne</strong>
          <span>Inteligencia fiscal em cada calculo</span>
        </div>
      </div>

      <nav class="menu" aria-label="Menu principal">
        <button type="button" aria-label="Inicio">
          <span class="menu-icon">IN</span>
          <span>Inicio</span>
        </button>
        <button type="button" aria-label="Documentos Fiscais">
          <span class="menu-icon">DF</span>
          <span>Documentos Fiscais</span>
        </button>
        <button type="button" aria-label="Apuracao">
          <span class="menu-icon">AP</span>
          <span>Apuracao</span>
        </button>
        <button type="button" aria-label="Creditos">
          <span class="menu-icon">CR</span>
          <span>Creditos</span>
        </button>

        <div class="menu-parent" [class.active]="activeModule === 'catalog'">
          <button type="button" aria-expanded="true" aria-label="Produtos e Servicos" (click)="navigate.emit('catalog')">
            <span class="menu-icon">PS</span>
            <span>Produtos e Servicos</span>
            <span class="chevron">v</span>
          </button>
          <div class="submenu">
            <button type="button" [class.active]="activeModule === 'catalog'" (click)="navigate.emit('catalog')">Produtos</button>
            <button type="button">Servicos</button>
            <button type="button">Categorias</button>
            <button type="button">Historico de Custos</button>
          </div>
        </div>

        <div class="menu-parent" [class.active]="activeModule === 'pricing'">
          <button type="button" aria-expanded="true" aria-label="Formacao de Preco" (click)="navigate.emit('pricing')">
            <span class="menu-icon">FP</span>
            <span>Formacao de Preco</span>
            <span class="chevron">v</span>
          </button>
          <div class="submenu">
            <button type="button" [class.active]="activeModule === 'pricing'" (click)="navigate.emit('pricing')">Produtos</button>
            <button type="button">Simulacoes</button>
            <button type="button">Tabelas de Preco</button>
            <button type="button">Regras e Politicas</button>
            <button type="button">Canais de Venda</button>
            <button type="button">Historico</button>
          </div>
        </div>

        <button type="button" aria-label="Reforma Tributaria">
          <span class="menu-icon">RT</span>
          <span>Reforma Tributaria</span>
        </button>
        <button type="button" aria-label="Auditoria">
          <span class="menu-icon">AU</span>
          <span>Auditoria</span>
        </button>
        <button type="button" aria-label="Relatorios">
          <span class="menu-icon">RE</span>
          <span>Relatorios</span>
        </button>
        <button type="button" aria-label="Configuracoes">
          <span class="menu-icon">CO</span>
          <span>Configuracoes</span>
        </button>
      </nav>

      <div class="assistant-card">
        <span class="spark">AI</span>
        <strong>Tax AI</strong>
        <p>Insights que aumentam sua margem.</p>
      </div>

      <small>UniFlow FiscalOne v1.0.0</small>
    </aside>
  `,
})
export class SidebarComponent {
  @Input() activeModule: AppModule = 'catalog';
  @Output() navigate = new EventEmitter<AppModule>();
}
