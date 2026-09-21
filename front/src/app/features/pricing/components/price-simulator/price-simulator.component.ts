import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LastUpdate, PricingMode } from '../../models/pricing.models';

@Component({
  selector: 'app-price-simulator',
  imports: [DecimalPipe, FormsModule],
  template: `
    <aside class="simulator">
      @if (lastUpdate) {
        <div class="last-update">
          <span>UP</span>
          <div>
            <strong>Ultima atualizacao</strong>
            <p>{{ formatDate(lastUpdate.updatedAt) }} por {{ lastUpdate.updatedBy }}</p>
          </div>
        </div>
      }

      <section class="panel sticky-panel">
        <h2>Simulador de Preco</h2>
        <div class="segmented">
          <button type="button" [class.active]="mode === 'margin'" (click)="modeChange.emit('margin')">
            Por margem
          </button>
          <button type="button" [class.active]="mode === 'sale'" (click)="modeChange.emit('sale')">
            Por preco de venda
          </button>
        </div>

        <label class="slider-field">
          <span>Margem desejada</span>
          <output>{{ desiredMargin | number: '1.2-2' }}%</output>
          <input
            type="range"
            min="10"
            max="50"
            step="0.5"
            [ngModel]="desiredMargin"
            (ngModelChange)="marginChange.emit($event)"
          />
        </label>

        <div class="suggestion-box">
          <span>Preco sugerido</span>
          <strong>{{ formatCurrency(suggestedPrice) }}</strong>
          <p>Para uma margem de {{ desiredMargin | number: '1.2-2' }}%</p>
        </div>

        <dl class="metrics">
          <div>
            <dt>Preco atual</dt>
            <dd>{{ formatCurrency(currentPrice) }}</dd>
          </div>
          <div>
            <dt>Diferenca</dt>
            <dd class="positive">{{ formatCurrency(priceDifference) }}</dd>
          </div>
          <div>
            <dt>Variacao</dt>
            <dd class="positive">{{ formatPercent(variation) }}</dd>
          </div>
          <div>
            <dt>Preco minimo</dt>
            <dd>{{ formatCurrency(minimumPrice) }}</dd>
          </div>
          <div>
            <dt>Preco alvo</dt>
            <dd>{{ formatCurrency(targetPrice) }}</dd>
          </div>
        </dl>

        <div class="donut" [style.--cost]="costShare" [style.--expense]="expenseShare">
          <div>
            <strong>{{ formatCurrency(suggestedPrice) }}</strong>
            <span>Preco</span>
          </div>
        </div>

        <div class="legend">
          <span><i class="cost"></i> Custos {{ costShare | number: '1.0-1' }}%</span>
          <span><i class="expense"></i> Despesas {{ expenseShare | number: '1.0-1' }}%</span>
          <span><i class="tax"></i> Tributos {{ taxShare | number: '1.0-1' }}%</span>
          <span><i class="result"></i> Resultado {{ desiredMargin | number: '1.0-1' }}%</span>
        </div>

        <button type="button" class="primary-button" (click)="apply.emit()">Aplicar preco sugerido</button>
      </section>
    </aside>
  `,
})
export class PriceSimulatorComponent {
  @Input() lastUpdate: LastUpdate | null = null;
  @Input() mode: PricingMode = 'margin';
  @Input() desiredMargin = 0;
  @Input() currentPrice = 0;
  @Input() suggestedPrice = 0;
  @Input() minimumPrice = 0;
  @Input() targetPrice = 0;
  @Input() costShare = 0;
  @Input() expenseShare = 0;
  @Input() taxShare = 0;
  @Output() modeChange = new EventEmitter<PricingMode>();
  @Output() marginChange = new EventEmitter<number>();
  @Output() apply = new EventEmitter<void>();

  protected get priceDifference(): number {
    return this.suggestedPrice - this.currentPrice;
  }

  protected get variation(): number {
    return this.currentPrice > 0 ? (this.priceDifference / this.currentPrice) * 100 : 0;
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  protected formatPercent(value: number): string {
    return `${new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}%`;
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  }
}
