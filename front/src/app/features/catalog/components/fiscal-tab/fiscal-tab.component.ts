import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductServiceFiscal } from '../../models/product-service.models';

@Component({
  selector: 'app-product-fiscal-tab',
  imports: [FormsModule],
  template: `
    <section class="panel catalog-card">
      <h2>Classificacao Fiscal</h2>

      <div class="form-grid two">
        <label>
          <span>NCM *</span>
          <div class="input-action">
            <input type="text" [(ngModel)]="fiscal.ncm" />
            <button type="button" (click)="analyze.emit()">Buscar</button>
          </div>
        </label>
        <label>
          <span>Origem da mercadoria</span>
          <select [(ngModel)]="fiscal.origin">
            <option>0 - Nacional</option>
            <option>1 - Estrangeira importacao direta</option>
            <option>2 - Estrangeira adquirida no mercado interno</option>
          </select>
        </label>
      </div>

      <p class="field-hint">{{ fiscal.ncmDescription }}</p>

      <div class="form-grid two">
        <label>
          <span>CEST</span>
          <input type="text" [(ngModel)]="fiscal.cest" />
        </label>
        <label>
          <span>Codigo ANP</span>
          <input type="text" [(ngModel)]="fiscal.anpCode" />
        </label>
      </div>

      <label>
        <span>Classificacao tributaria</span>
        <input type="text" [(ngModel)]="fiscal.taxClassification" readonly />
      </label>

      <div class="taxcore-status">
        <strong>{{ fiscal.taxCoreStatus }}</strong>
        <p>O TaxCore encontrou regras tributarias aplicaveis a este produto.</p>
        <button type="button" (click)="analyze.emit()">Ver analise</button>
      </div>
    </section>
  `,
})
export class FiscalTabComponent {
  @Input({ required: true }) fiscal!: ProductServiceFiscal;
  @Output() analyze = new EventEmitter<void>();
}
