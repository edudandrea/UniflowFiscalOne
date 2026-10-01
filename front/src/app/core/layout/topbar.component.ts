import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  template: `
    <header class="topbar">
      <label class="search">
        <span aria-hidden="true">Q</span>
        <input type="search" placeholder="Buscar produtos, NCM, CFOP, clientes, simulacoes..." />
      </label>

      <div class="company-switcher">
        <strong>{{ companyName }}</strong>
        <span>CNPJ nao informado</span>
      </div>

      <button type="button" class="icon-button" (click)="notice.emit()" aria-label="Notificacoes">
        <span>!</span>
      </button>
      <button type="button" class="icon-button has-alert" aria-label="Mensagens">
        <span>?</span>
      </button>
      <button type="button" class="avatar" aria-label="Perfil do usuario">ED</button>
      <div class="user">
        <strong>Eduardo D'Arcorea</strong>
        <span>Perfil executivo</span>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Input() companyName = '';
  @Output() notice = new EventEmitter<void>();
}
