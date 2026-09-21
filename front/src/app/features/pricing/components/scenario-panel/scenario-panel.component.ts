import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesChannelPricing, ScenarioPricing } from '../../models/pricing.models';

@Component({
  selector: 'app-scenario-panel',
  imports: [FormsModule],
  template: `
    @if (scenario) {
      <section class="panel">
        <div class="section-heading">
          <h2>Cenario de Calculo</h2>
          <button type="button" class="text-button" (click)="reload.emit()">Carregar cenario</button>
        </div>

        <div class="scenario-grid">
          <label>
            <span>Empresa</span>
            <input type="text" [ngModel]="scenario.company" readonly />
          </label>
          <label>
            <span>Estabelecimento</span>
            <input type="text" [ngModel]="scenario.branch" readonly />
          </label>
          <label>
            <span>Canal de venda</span>
            <select [ngModel]="selectedChannelName" (ngModelChange)="channelChange.emit($event)">
              @for (channel of channels; track channel.id) {
                <option [value]="channel.name">{{ channel.name }}</option>
              }
            </select>
          </label>
          <label>
            <span>Data da operacao</span>
            <input type="date" [ngModel]="scenario.operationDate" readonly />
          </label>
        </div>
      </section>
    }
  `,
})
export class ScenarioPanelComponent {
  @Input({ required: true }) scenario!: ScenarioPricing | null;
  @Input() channels: SalesChannelPricing[] = [];
  @Input() selectedChannelName = '';
  @Output() channelChange = new EventEmitter<string>();
  @Output() reload = new EventEmitter<void>();
}
