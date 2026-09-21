import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductPricing } from '../../models/pricing.models';

@Component({
  selector: 'app-product-header',
  template: `
    @if (product) {
      <section class="product-header">
        <div class="breadcrumb">Formacao de Preco / Produtos / {{ product.name }}</div>
        <div class="product-row">
          <div class="product-photo">5W</div>
          <div>
            <div class="title-row">
              <h1>{{ product.name }}</h1>
              <span class="code">{{ product.code }}</span>
              <span class="status">{{ product.status }}</span>
            </div>
            <p>NCM {{ product.ncm }} | Marca: {{ product.brand }} | Categoria: {{ product.category }}</p>
          </div>
          <button type="button" class="ghost-button" (click)="actions.emit()">Acoes</button>
        </div>

        <div class="tabs" role="tablist" aria-label="Modulo do produto">
          @for (tab of tabs; track tab) {
            <button type="button" [class.active]="tab === activeTab">{{ tab }}</button>
          }
        </div>
      </section>
    }
  `,
})
export class ProductHeaderComponent {
  @Input({ required: true }) product!: ProductPricing | null;
  @Input() tabs: string[] = [];
  @Input() activeTab = 'Formacao de Preco';
  @Output() actions = new EventEmitter<void>();
}
