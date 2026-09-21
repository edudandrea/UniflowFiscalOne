import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  template: `
    <header class="topbar">
      <label class="search">
        <span>Q</span>
        <input type="search" placeholder="Buscar produtos, NCM, CFOP, clientes, simulacoes..." />
      </label>

      <div class="company-switcher">
        <strong>{{ companyName }}</strong>
        <span>CNPJ nao informado</span>
      </div>

      <button type="button" class="icon-button" (click)="notice.emit()" aria-label="Notificacoes">
        <span>!</span>
      </button>
      <button type="button" class="avatar" aria-label="Perfil do usuario">--</button>
      <div class="user">
        <strong>Usuario nao identificado</strong>
        <span>Perfil nao informado</span>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Input() companyName = '';
  @Output() notice = new EventEmitter<void>();
}
