import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductServiceGeneral } from '../../models/product-service.models';

@Component({
  selector: 'app-product-general-tab',
  imports: [FormsModule],
  template: `
    <section class="panel catalog-card">
      <h2>Identificacao</h2>
      <div class="form-grid two">
        <label>
          <span>Codigo interno *</span>
          <input type="text" [(ngModel)]="general.internalCode" />
        </label>
        <label>
          <span>Codigo de barras</span>
          <input type="text" [(ngModel)]="general.barcode" />
        </label>
      </div>

      <label>
        <span>Descricao *</span>
        <input type="text" [(ngModel)]="general.description" />
      </label>

      <div class="form-grid three">
        <label>
          <span>Categoria</span>
          <select [(ngModel)]="general.category">
            <option>Lubrificantes</option>
            <option>Autopecas</option>
            <option>Servicos Tecnicos</option>
          </select>
        </label>
        <label>
          <span>Marca</span>
          <select [(ngModel)]="general.brand">
            <option>Shell</option>
            <option>Petronas</option>
            <option>Propria</option>
          </select>
        </label>
        <label>
          <span>Unidade</span>
          <select [(ngModel)]="general.unit">
            <option>UN</option>
            <option>LT</option>
            <option>HR</option>
          </select>
        </label>
      </div>

      <label class="check-row">
        <input type="checkbox" [(ngModel)]="general.active" />
        <span>Produto ativo</span>
      </label>
    </section>
  `,
})
export class GeneralTabComponent {
  @Input({ required: true }) general!: ProductServiceGeneral;
}
