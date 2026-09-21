import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { CompositionPanelComponent } from './components/composition-panel/composition-panel.component';
import { PriceSimulatorComponent } from './components/price-simulator/price-simulator.component';
import { PriceTableComponent } from './components/price-table/price-table.component';
import { ProductHeaderComponent } from './components/product-header/product-header.component';
import { ScenarioPanelComponent } from './components/scenario-panel/scenario-panel.component';
import {
  CalculatePriceRequest,
  CalculatePriceResponse,
  ChannelPriceRow,
  CompositionGroup,
  PriceComponentResponse,
  PricingMode,
  PricingWorkspace,
} from './models/pricing.models';
import { PricingApiService } from './services/pricing-api.service';

@Component({
  selector: 'app-pricing-page',
  imports: [
    ProductHeaderComponent,
    ScenarioPanelComponent,
    CompositionPanelComponent,
    PriceTableComponent,
    PriceSimulatorComponent,
  ],
  template: `
    @if (loading) {
      <section class="panel loading-panel">Carregando dados da API...</section>
    } @else if (workspace && result) {
      <app-product-header
        [product]="workspace.product"
        [tabs]="tabs"
        (actions)="showActions()"
      />

      <div class="content-grid">
        <section class="main-column">
          <div class="banner">
            <div>
              <strong>Preco inteligente para um futuro mais competitivo.</strong>
              <span>Considere custos, tributos e estrategia em um so lugar.</span>
            </div>
            <p>"Precificar bem hoje e crescer amanha."</p>
          </div>

          <app-scenario-panel
            [scenario]="workspace.scenario"
            [channels]="workspace.channels"
            [selectedChannelName]="selectedChannelName"
            (channelChange)="selectChannel($event)"
            (reload)="loadWorkspace(true)"
          />

          <app-composition-panel [groups]="compositionGroups" (edit)="editComponents()" />

          <app-price-table
            [rows]="channelRows"
            (recalculate)="recalculateAll()"
            (simulate)="selectChannel($event)"
          />
        </section>

        <app-price-simulator
          [lastUpdate]="workspace.lastUpdate"
          [mode]="simulationMode"
          [desiredMargin]="request.desiredMargin"
          [currentPrice]="request.currentPrice"
          [suggestedPrice]="result.suggestedPrice"
          [minimumPrice]="result.minimumPrice"
          [targetPrice]="result.targetPrice"
          [costShare]="costShare"
          [expenseShare]="expenseShare"
          [taxShare]="taxShare"
          (modeChange)="simulationMode = $event"
          (marginChange)="updateMargin($event)"
          (apply)="applyPrice()"
        />
      </div>
    } @else {
      <section class="panel loading-panel">
        Nao foi possivel carregar os dados de formacao de preco pela API.
      </section>
    }
  `,
})
export class PricingPageComponent implements OnInit {
  @Output() companyChange = new EventEmitter<string>();

  protected readonly tabs = [
    'Visao Geral',
    'Formacao de Preco',
    'Custos',
    'Tributacao',
    'Canais de Venda',
    'Simulacoes',
  ];

  protected loading = true;
  protected simulationMode: PricingMode = 'margin';
  protected selectedChannelName = '';
  protected workspace: PricingWorkspace | null = null;
  protected result: CalculatePriceResponse | null = null;
  protected request: CalculatePriceRequest = {} as CalculatePriceRequest;

  private readonly productId = '55555555-5555-5555-5555-555555555555';

  constructor(private readonly pricingApi: PricingApiService) {}

  ngOnInit(): void {
    this.loadWorkspace();
  }

  protected loadWorkspace(showSuccess = false): void {
    this.loading = true;
    this.pricingApi.getWorkspace(this.productId).subscribe({
      next: (workspace) => {
        this.workspace = workspace;
        this.request = { ...workspace.calculationRequest };
        this.selectedChannelName = workspace.scenario.selectedChannel;
        this.companyChange.emit(workspace.scenario.company);
        this.simulate(showSuccess ? 'Cenario carregado pela API.' : undefined);
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          title: 'API indisponivel',
          text: 'Nao foi possivel carregar os dados de formacao de preco do backend.',
          icon: 'error',
          confirmButtonColor: '#00a98f',
        });
      },
    });
  }

  protected updateMargin(value: number): void {
    this.request = {
      ...this.request,
      desiredMargin: Number(value),
    };
    this.simulate();
  }

  protected selectChannel(channelName: string): void {
    if (!this.workspace) {
      return;
    }

    const channel = this.workspace.channels.find((item) => item.name === channelName);
    if (!channel) {
      return;
    }

    this.selectedChannelName = channel.name;
    this.request = {
      ...this.request,
      salesChannelId: channel.id,
      currentPrice: channel.currentPrice,
      taxableBase: channel.currentPrice,
    };
    this.simulate(`${channel.name} selecionado.`);
  }

  protected get compositionGroups(): CompositionGroup[] {
    if (!this.result) {
      return [];
    }

    const components = this.result.components;
    const costLines = this.linesFor(components, [0, 1, 2, 3, 7]);
    const expenseLines = this.linesFor(components, [8, 9, 10, 11], true);
    const taxLines = this.linesFor(components, [4, 5, 6], true);

    return [
      {
        icon: 'C',
        step: '1. Custos',
        title: 'Custos',
        total: this.sum(costLines),
        lines: costLines,
      },
      {
        icon: 'D',
        step: '2. Despesas da Venda',
        title: 'Despesas da Venda',
        total: this.sum(expenseLines),
        lines: expenseLines,
      },
      {
        icon: '%',
        step: '3. Tributos',
        title: 'Tributos Estimados',
        total: this.sum(taxLines),
        lines: taxLines,
      },
      {
        icon: 'R',
        step: '4. Resultado',
        title: 'Resultado',
        total: this.result.suggestedPrice,
        kind: 'result',
        lines: [
          { label: 'Margem desejada', value: this.request.desiredMargin, percent: true },
          { label: 'Margem calculada', value: this.result.margin, percent: true },
          { label: 'Preco minimo', value: this.result.minimumPrice },
        ],
      },
    ];
  }

  protected get channelRows(): ChannelPriceRow[] {
    if (!this.workspace || !this.result) {
      return [];
    }

    return this.workspace.channels.map((channel) => ({
      name: channel.name,
      currentPrice: channel.currentPrice,
      suggestedPrice: this.roundMoney(this.result!.targetPrice * channel.multiplier),
      margin: this.result!.margin,
      status: channel.status,
    }));
  }

  protected get costShare(): number {
    return this.share([0, 1, 2, 3, 7]);
  }

  protected get expenseShare(): number {
    return this.share([8, 9, 10, 11]);
  }

  protected get taxShare(): number {
    return this.share([4, 5, 6]);
  }

  protected async applyPrice(): Promise<void> {
    if (!this.result) {
      return;
    }

    await Swal.fire({
      title: 'Aplicar preco sugerido?',
      text: `O novo preco sera ${this.formatCurrency(this.result.targetPrice)} para o canal ${this.selectedChannelName}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00a98f',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Aplicar preco',
      cancelButtonText: 'Revisar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Preco enviado para aprovacao',
          text: 'A formacao foi calculada pelo backend e aguardara a etapa de aprovacao.',
          icon: 'success',
          confirmButtonColor: '#00a98f',
        });
      }
    });
  }

  protected showActions(): void {
    Swal.fire({
      title: 'Acoes do produto',
      html: 'Voce pode salvar simulacao, enviar para aprovacao ou publicar em canais integrados.',
      icon: 'info',
      confirmButtonColor: '#00a98f',
    });
  }

  protected editComponents(): void {
    Swal.fire({
      title: 'Componentes da API',
      text: 'Os componentes exibidos vieram da memoria de calculo retornada pelo backend.',
      icon: 'info',
      confirmButtonColor: '#00a98f',
    });
  }

  protected recalculateAll(): void {
    this.simulate('Canais recalculados com a margem atual.');
  }

  private simulate(successMessage?: string): void {
    this.pricingApi.simulate(this.request).subscribe({
      next: (result) => {
        this.result = result;
        this.loading = false;

        if (successMessage) {
          Swal.fire({
            title: successMessage,
            icon: 'success',
            timer: 1400,
            showConfirmButton: false,
          });
        }
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          title: 'Falha no calculo',
          text: 'O backend nao conseguiu simular a formacao de preco.',
          icon: 'error',
          confirmButtonColor: '#00a98f',
        });
      },
    });
  }

  private linesFor(components: PriceComponentResponse[], types: number[], preferPercent = false) {
    return components
      .filter((component) => types.includes(component.type))
      .map((component) => ({
        label: component.description,
        value: preferPercent && component.percentage !== null && component.percentage !== undefined
          ? component.percentage
          : component.value,
        percent: preferPercent && component.percentage !== null && component.percentage !== undefined,
      }));
  }

  private share(types: number[]): number {
    if (!this.result || this.result.suggestedPrice <= 0) {
      return 0;
    }

    const total = this.result.components
      .filter((component) => types.includes(component.type))
      .reduce((sum, component) => sum + Math.abs(component.value), 0);

    return (total / this.result.suggestedPrice) * 100;
  }

  private sum(lines: Array<{ value: number; percent?: boolean }>): number {
    return lines.reduce((total, line) => total + (line.percent ? 0 : line.value), 0);
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  private roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
