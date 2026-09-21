import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductServiceSettings } from '../../models/product-service.models';

@Component({
  selector: 'app-product-settings-tab',
  imports: [FormsModule],
  template: `
    <section class="panel catalog-card">
      <h2>Configuracoes</h2>

      <div class="settings-list">
        <label>
          <input type="checkbox" [(ngModel)]="settings.participatesInPricing" />
          <span>Participa da formacao de preco</span>
        </label>
        <label>
          <input type="checkbox" [(ngModel)]="settings.allowTaxSimulation" />
          <span>Permitir simulacao tributaria</span>
        </label>
        <label>
          <input type="checkbox" [(ngModel)]="settings.monitorCostChanges" />
          <span>Monitorar alteracao de custo</span>
        </label>
        <label>
          <input type="checkbox" [(ngModel)]="settings.alertBelowMinimumMargin" />
          <span>Alertar quando margem ficar abaixo do minimo</span>
        </label>
      </div>

      <h3>Precificacao padrao</h3>
      <div class="form-grid two">
        <label>
          <span>Politica padrao</span>
          <select [(ngModel)]="settings.defaultPricePolicy">
            <option>Varejo padrao</option>
            <option>Atacado</option>
            <option>Marketplace</option>
          </select>
        </label>
        <label>
          <span>Canal de venda padrao</span>
          <select [(ngModel)]="settings.defaultSalesChannel">
            <option>Balcao</option>
            <option>E-commerce</option>
            <option>Marketplace</option>
          </select>
        </label>
      </div>

      <div class="form-grid two">
        <label>
          <span>Margem desejada</span>
          <input type="number" min="0" max="99" step="0.01" [(ngModel)]="settings.desiredMargin" />
        </label>
        <label>
          <span>Margem minima</span>
          <input type="number" min="0" max="99" step="0.01" [(ngModel)]="settings.minimumMargin" />
        </label>
      </div>
    </section>
  `,
})
export class SettingsTabComponent {
  @Input({ required: true }) settings!: ProductServiceSettings;
}
