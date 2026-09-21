import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CostHistory, ProductServiceCost } from '../../models/product-service.models';

@Component({
  selector: 'app-product-cost-tab',
  imports: [FormsModule],
  template: `
    <section class="panel catalog-card">
      <h2>Custos</h2>

      <div class="cost-source">
        @for (source of costSources; track source) {
          <label>
            <input type="radio" name="costSource" [value]="source" [(ngModel)]="cost.costSource" />
            <span>{{ source }}</span>
          </label>
        }
      </div>

      <div class="form-grid two">
        <label>
          <span>Custo atual</span>
          <input type="number" min="0" step="0.01" [(ngModel)]="cost.currentCost" />
        </label>
      </div>

      <h3>Componentes adicionais</h3>
      <div class="form-grid three">
        <label>
          <span>Frete de aquisicao</span>
          <input type="number" min="0" step="0.01" [(ngModel)]="cost.freightCost" />
        </label>
        <label>
          <span>Seguro</span>
          <input type="number" min="0" step="0.01" [(ngModel)]="cost.insuranceCost" />
        </label>
        <label>
          <span>Outras despesas</span>
          <input type="number" min="0" step="0.01" [(ngModel)]="cost.otherCosts" />
        </label>
      </div>

      <div class="cost-summary">
        <div>
          <span>Custo da mercadoria</span>
          <strong>{{ formatCurrency(cost.currentCost) }}</strong>
        </div>
        <div>
          <span>Custos adicionais</span>
          <strong>{{ formatCurrency(additionalCost) }}</strong>
        </div>
        <div class="total">
          <span>Custo bruto</span>
          <strong>{{ formatCurrency(grossCost) }}</strong>
        </div>
      </div>

      <h3>Historico do custo</h3>
      <div class="cost-history">
        @for (item of history; track item.date) {
          <div>
            <span>{{ formatDate(item.date) }}</span>
            <strong>{{ formatCurrency(item.cost) }}</strong>
            <em>{{ item.variation ? '+' + formatPercent(item.variation) : '-' }}</em>
          </div>
        }
      </div>
    </section>
  `,
})
export class CostTabComponent {
  @Input({ required: true }) cost!: ProductServiceCost;
  @Input() history: CostHistory[] = [];

  protected readonly costSources = ['Manual', 'Ultima compra', 'Custo medio', 'Integracao ERP'];

  protected get additionalCost(): number {
    return Number(this.cost.freightCost || 0) + Number(this.cost.insuranceCost || 0) + Number(this.cost.otherCosts || 0);
  }

  protected get grossCost(): number {
    return Number(this.cost.currentCost || 0) + this.additionalCost;
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  protected formatPercent(value: number): string {
    return `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)}%`;
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T00:00:00`));
  }
}
