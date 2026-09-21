import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { timeout } from 'rxjs';
import Swal from 'sweetalert2';
import { CostTabComponent } from './components/cost-tab/cost-tab.component';
import { FiscalTabComponent } from './components/fiscal-tab/fiscal-tab.component';
import { GeneralTabComponent } from './components/general-tab/general-tab.component';
import { SettingsTabComponent } from './components/settings-tab/settings-tab.component';
import {
  CatalogTab,
  ProductServiceDraft,
  ProductServiceListItem,
} from './models/product-service.models';
import { ProductServicesApiService } from './services/product-services-api.service';

@Component({
  selector: 'app-product-services-page',
  imports: [GeneralTabComponent, FiscalTabComponent, CostTabComponent, SettingsTabComponent],
  template: `
    <section class="catalog-header">
      <div>
        <div class="breadcrumb">Produtos e Servicos / Produtos</div>
        <h1>Produtos</h1>
        <p>Gerencie seu cadastro mestre sem misturar regras de formacao de preco.</p>
      </div>
      <div class="header-actions">
        <button type="button" class="primary-button compact" (click)="openNewProductModal()">
          Novo Produto
        </button>
      </div>
    </section>

    <section class="panel products-panel">
      <div class="section-heading">
        <h2>Produtos cadastrados</h2>
        <label class="table-search">
          <span>Buscar</span>
          <input type="search" placeholder="Buscar por codigo, descricao, NCM..." />
        </label>
      </div>

      @if (loadingProducts) {
        <div class="loading-panel compact-loading">Carregando produtos pela API...</div>
      } @else {
        <div class="products-table">
          <div class="products-row products-head">
            <span>Codigo</span>
            <span>Descricao</span>
            <span>Tipo</span>
            <span>Categoria</span>
            <span>NCM</span>
            <span>Custo</span>
            <span>Status</span>
          </div>
          @for (product of products; track product.id) {
            <div class="products-row">
              <strong>{{ product.internalCode }}</strong>
              <span>{{ product.description }}</span>
              <span>{{ product.itemType }}</span>
              <span>{{ product.category }}</span>
              <span>{{ product.ncm }}</span>
              <span>{{ formatCurrency(product.currentCost) }}</span>
              <span class="status-dot">{{ product.status }}</span>
            </div>
          }
        </div>
      }
    </section>

    <section class="panel product-flow">
      <div>
        <strong>Cadastro mestre separado da precificacao</strong>
        <p>Produtos e Servicos define o item; Formacao de Preco calcula por quanto vender em cada cenario.</p>
      </div>
      <button type="button" class="outline-button" (click)="openPricing.emit()">Ir para formacao de preco</button>
    </section>

    @if (isModalOpen) {
      <div class="modal-backdrop" role="presentation">
        <section class="product-modal" role="dialog" aria-modal="true" aria-label="Cadastro de novo produto">
          <header class="modal-hero">
            <div class="modal-icon">PS</div>
            <div>
              <h2>Novo Produto</h2>
              <p>Cadastre um novo produto no sistema</p>
            </div>
            <div class="modal-tagline">
              <strong>Dados organizados, decisoes mais inteligentes.</strong>
            </div>
            <button type="button" class="modal-close" aria-label="Fechar" (click)="closeModal()">x</button>
          </header>

          @if (draft) {
            @if (loadingDraft) {
              <div class="modal-loading-strip">Carregando dados sugeridos pela API...</div>
            }

            <nav class="wizard-tabs modal-tabs" aria-label="Etapas do cadastro">
              @for (tab of tabs; track tab.id; let index = $index) {
                <button type="button" [class.active]="activeTab === tab.id" (click)="activeTab = tab.id">
                  <span>{{ index + 1 }}</span>
                  {{ tab.label }}
                </button>
              }
            </nav>

            <div class="modal-body">
              <section class="modal-main">
                @switch (activeTab) {
                  @case ('general') {
                    <app-product-general-tab [general]="draft.general" />
                  }
                  @case ('fiscal') {
                    <app-product-fiscal-tab [fiscal]="draft.fiscal" (analyze)="analyzeFiscal()" />
                  }
                  @case ('costs') {
                    <app-product-cost-tab [cost]="draft.cost" [history]="draft.costHistory" />
                  }
                  @case ('settings') {
                    <app-product-settings-tab [settings]="draft.settings" />
                  }
                }
              </section>

              <aside class="modal-preview">
                <div class="product-bottle">5W30</div>
                <button type="button" class="upload-box">
                  <span>+</span>
                  Clique para adicionar uma imagem
                  <small>PNG, JPG ou WEBP ate 5MB</small>
                </button>
                <div class="image-strip">
                  <span>5W</span>
                  <span>LT</span>
                  <button type="button">+</button>
                </div>
                <div class="taxcore-status small">
                  <strong>Imagem fiscal</strong>
                  <p>A imagem sera utilizada em consultas, relatorios e na tabela de produtos.</p>
                </div>
              </aside>
            </div>

            <footer class="modal-footer">
              <button type="button" class="ghost-button" (click)="closeModal()">Cancelar</button>
              <button type="button" class="primary-button compact" (click)="nextOrSave()">
                {{ activeTab === 'settings' ? 'Salvar' : 'Avancar' }}
              </button>
            </footer>
          }
        </section>
      </div>
    }
  `,
})
export class ProductServicesPageComponent implements OnInit {
  @Output() openPricing = new EventEmitter<void>();

  protected products: ProductServiceListItem[] = [];
  protected draft: ProductServiceDraft | null = null;
  protected loadingProducts = true;
  protected loadingDraft = false;
  protected isModalOpen = false;
  protected activeTab: CatalogTab = 'general';
  protected readonly tabs: Array<{ id: CatalogTab; label: string }> = [
    { id: 'general', label: 'Dados Gerais' },
    { id: 'fiscal', label: 'Fiscal' },
    { id: 'costs', label: 'Custos' },
    { id: 'settings', label: 'Configuracoes' },
  ];

  constructor(private readonly api: ProductServicesApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  protected loadProducts(): void {
    this.loadingProducts = true;
    this.api.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loadingProducts = false;
      },
      error: () => {
        this.loadingProducts = false;
        Swal.fire({
          title: 'API indisponivel',
          text: 'Nao foi possivel carregar a lista de produtos.',
          icon: 'error',
          confirmButtonColor: '#00a98f',
        });
      },
    });
  }

  protected openNewProductModal(): void {
    this.isModalOpen = true;
    this.activeTab = 'general';
    this.draft = this.createEmptyDraft();
    this.loadingDraft = true;
    this.api.getDraft().pipe(timeout(3000)).subscribe({
      next: (draft) => {
        this.draft = draft;
        this.loadingDraft = false;
      },
      error: () => {
        this.loadingDraft = false;
        Swal.fire({
          title: 'Cadastro liberado',
          text: 'Nao foi possivel carregar os dados sugeridos agora, mas o formulario esta pronto para preenchimento.',
          icon: 'warning',
          confirmButtonColor: '#00a98f',
        });
      },
    });
  }

  protected closeModal(): void {
    this.isModalOpen = false;
    this.draft = null;
  }

  protected nextOrSave(): void {
    if (this.activeTab !== 'settings') {
      this.activeTab = this.tabs[this.tabs.findIndex((tab) => tab.id === this.activeTab) + 1].id;
      return;
    }

    this.save();
  }

  protected save(): void {
    if (!this.draft) {
      return;
    }

    this.api
      .save({
        general: this.draft.general,
        fiscal: this.draft.fiscal,
        cost: this.draft.cost,
        settings: this.draft.settings,
      })
      .subscribe({
        next: (response) => {
          this.closeModal();
          this.loadProducts();
          Swal.fire({
            title: 'Produto salvo',
            text: `${response.internalCode} - ${response.description} foi salvo como ${response.status}.`,
            icon: 'success',
            confirmButtonColor: '#00a98f',
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Nao foi possivel salvar',
            text: error?.error?.error ?? 'Revise os campos obrigatorios e tente novamente.',
            icon: 'error',
            confirmButtonColor: '#00a98f',
          });
        },
      });
  }

  protected analyzeFiscal(): void {
    Swal.fire({
      title: 'Analise TaxCore',
      text: 'A classificacao fiscal foi validada a partir das caracteristicas do item. Aliquotas continuam no TaxCore e nao no cadastro mestre.',
      icon: 'success',
      confirmButtonColor: '#00a98f',
    });
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  private createEmptyDraft(): ProductServiceDraft {
    return {
      general: {
        id: null,
        itemType: 'Product',
        internalCode: '',
        barcode: '',
        description: '',
        category: '',
        brand: '',
        unit: 'UN',
        active: true,
      },
      fiscal: {
        ncm: '',
        ncmDescription: '',
        origin: '0 - Nacional',
        cest: '',
        anpCode: '',
        taxClassification: 'Aguardando preenchimento dos dados fiscais',
        taxCoreStatus: 'Aguardando classificacao fiscal',
      },
      cost: {
        costSource: 'Manual',
        currentCost: 0,
        freightCost: 0,
        insuranceCost: 0,
        otherCosts: 0,
      },
      settings: {
        participatesInPricing: true,
        allowTaxSimulation: true,
        monitorCostChanges: true,
        alertBelowMinimumMargin: true,
        defaultPricePolicy: 'Varejo padrao',
        defaultSalesChannel: 'Balcao',
        desiredMargin: 30,
        minimumMargin: 20,
      },
      costHistory: [],
    };
  }
}
