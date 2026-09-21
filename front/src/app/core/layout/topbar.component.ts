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
        <span>CNPJ 12.345.678/0001-90</span>
      </div>

      <button type="button" class="icon-button" (click)="notice.emit()" aria-label="Notificacoes">
        <span>!</span>
      </button>
      <button type="button" class="avatar" aria-label="Perfil do usuario">EA</button>
      <div class="user">
        <strong>Eduardo Almeida</strong>
        <span>Administrador</span>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Input() companyName = '';
  @Output() notice = new EventEmitter<void>();
}
