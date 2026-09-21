import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-company-admin-page',
  imports: [RouterLink],
  template: `
    <main class="company-admin-page">
      <aside class="company-admin-sidebar">
        <span class="login-logo" role="img" aria-label="UniFlow FiscalOne"></span>
        <nav>
          <a routerLink="/empresa" class="active">Visao Geral</a>
          <a routerLink="/empresa">Fiscal</a>
          <a routerLink="/empresa">Produtos e NCM</a>
          <a routerLink="/empresa">Formacao de Preco</a>
          <a routerLink="/empresa">Usuarios</a>
        </nav>
      </aside>

      <section class="company-admin-main">
        <header>
          <div>
            <span>Empresa contratante</span>
            <h1>Painel da Empresa</h1>
            <p>Ambiente restrito aos dados e modulos liberados para a empresa vinculada ao usuario.</p>
          </div>
          <a routerLink="/login">Sair</a>
        </header>

        <section class="module-empty-state">
          <strong>Nenhum dado carregado</strong>
          <span>Os indicadores da empresa serao exibidos quando os endpoints da area contratante forem conectados.</span>
        </section>
      </section>
    </main>
  `,
})
export class CompanyAdminPageComponent {}
