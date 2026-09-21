import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChannelPriceRow } from '../../models/pricing.models';

@Component({
  selector: 'app-price-table',
  template: `
    <section class="panel">
      <div class="section-heading">
        <h2>Tabelas de Preco</h2>
        <button type="button" class="outline-button" (click)="recalculate.emit()">Recalcular todos os canais</button>
      </div>

      <div class="price-table">
        <div class="table-row table-head">
          <span>Canal de venda</span>
          <span>Preco atual</span>
          <span>Preco sugerido</span>
          <span>Margem</span>
          <span>Status</span>
        </div>
        @for (channel of rows; track channel.name) {
          <div class="table-row">
            <span>{{ channel.name }}</span>
            <span>{{ formatCurrency(channel.currentPrice) }}</span>
            <strong>{{ formatCurrency(channel.suggestedPrice) }}</strong>
            <span class="positive">{{ formatPercent(channel.margin) }}</span>
            <button type="button" (click)="simulate.emit(channel.name)">
              {{ channel.status }}
            </button>
          </div>
        }
      </div>
    </section>
  `,
})
export class PriceTableComponent {
  @Input() rows: ChannelPriceRow[] = [];
  @Output() recalculate = new EventEmitter<void>();
  @Output() simulate = new EventEmitter<string>();

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  protected formatPercent(value: number): string {
    return `${new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}%`;
  }
}
