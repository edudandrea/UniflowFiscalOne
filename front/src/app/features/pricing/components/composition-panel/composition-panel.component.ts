import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompositionGroup } from '../../models/pricing.models';

@Component({
  selector: 'app-composition-panel',
  template: `
    <section class="panel">
      <div class="section-heading">
        <h2>Composicao do Preco</h2>
        <button type="button" class="text-button" (click)="edit.emit()">Editar componentes</button>
      </div>

      <div class="composition-grid">
        @for (group of groups; track group.title) {
          <article class="component-card" [class.result]="group.kind === 'result'">
            <div class="card-icon">{{ group.icon }}</div>
            <div>
              <span>{{ group.step }}</span>
              <h3>{{ group.title }}</h3>
              <strong>{{ formatCurrency(group.total) }}</strong>
            </div>
            <dl>
              @for (line of group.lines; track line.label) {
                <div>
                  <dt>{{ line.label }}</dt>
                  <dd>{{ line.percent ? formatPercent(line.value) : formatCurrency(line.value) }}</dd>
                </div>
              }
            </dl>
          </article>
        }
      </div>
    </section>
  `,
})
export class CompositionPanelComponent {
  @Input() groups: CompositionGroup[] = [];
  @Output() edit = new EventEmitter<void>();

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
