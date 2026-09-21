import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  template: `
    <main class="login-page">
      <section class="login-visual" aria-label="UniFlow FiscalOne">
        <div class="login-visual-content">
          <div class="login-copy">
            <h1>
              Dados fiscais hoje.
              <span>Resultados reais amanha.</span>
            </h1>
            <p>Tecnologia e inteligencia para transformar obrigacao fiscal em vantagem competitiva.</p>
          </div>

          <div class="login-benefits" aria-label="Beneficios">
            <div>
              <span aria-hidden="true">BI</span>
              <p><strong>Conformidade</strong> Sempre atualizado com a legislacao</p>
            </div>
            <div>
              <span aria-hidden="true">SH</span>
              <p><strong>Seguranca</strong> Seus dados protegidos</p>
            </div>
            <div>
              <span aria-hidden="true">AG</span>
              <p><strong>Agilidade</strong> Mais tempo para o que importa</p>
            </div>
            <div>
              <span aria-hidden="true">AI</span>
              <p><strong>Inteligencia</strong> Informacao que gera resultado</p>
            </div>
          </div>

          <blockquote>
            "A complexidade do sistema tributario com a clareza que o seu negocio precisa."
          </blockquote>

          <small>&copy; 2026 UniFlowFiscalOne. Todos os direitos reservados.</small>
        </div>
      </section>

      <section class="login-access" aria-label="Acesso ao sistema">
        <p class="login-kicker">Fiscal &bull; Tributario &bull; Estrategico</p>

        <form class="login-card" (ngSubmit)="login()">
          <span>Bem-vindo ao</span>
          <div class="login-card-brand">
            <span class="login-logo" role="img" aria-label="UniFlow FiscalOne"></span>
          </div>
          <p>Acesse sua conta para continuar</p>

          <label>
            <span>E-mail</span>
            <input [(ngModel)]="loginForm.email" name="loginEmail" type="email" placeholder="seu@email.com" autocomplete="email" />
          </label>

          <label>
            <span>Senha</span>
            <input [(ngModel)]="loginForm.senha" name="loginSenha" type="password" placeholder="Sua senha" autocomplete="current-password" />
          </label>

          <div class="login-options">
            <label>
              <input type="checkbox" checked />
              <span>Lembrar de mim</span>
            </label>
            <a href="/">Esqueceu sua senha?</a>
          </div>

          <button class="login-submit" type="submit">Entrar <span aria-hidden="true">&rarr;</span></button>

          @if (!systemAdminExists) {
            <button class="login-bootstrap-admin-button" type="button" (click)="bootstrapAdminModalOpen = true">
              Cadastrar administrador SaaS
            </button>
          }

          <p class="login-help">Ainda nao tem acesso? <a href="/">Fale com nosso time</a></p>
        </form>

        <footer>
          <strong>UniflowTech</strong>
          <span>Solucoes que movem o seu negocio</span>
        </footer>
      </section>

      @if (bootstrapAdminModalOpen) {
        <section class="modal-backdrop fiscal-bootstrap-backdrop" (click)="closeBootstrapAdminModal()">
          <form class="modal-card pop fiscal-bootstrap-modal" (ngSubmit)="bootstrapAdmin()" (click)="$event.stopPropagation()">
            <header class="modal-head">
              <div>
                <span class="eyebrow">Configuracao inicial</span>
                <h3>Cadastrar administrador SaaS</h3>
                <p>Identificamos que ainda nao existe um usuario SaaS. Cadastre o administrador principal para liberar o painel.</p>
              </div>
              <button class="modal-close-button" type="button" (click)="closeBootstrapAdminModal()">x</button>
            </header>

            <label>Nome<input name="bootstrapNome" [(ngModel)]="bootstrapForm.nome" autocomplete="name" required /></label>
            <label>Login<input name="bootstrapLogin" [(ngModel)]="bootstrapForm.login" autocomplete="username" required /></label>
            <label>CPF<input name="bootstrapCpf" [(ngModel)]="bootstrapForm.cpf" placeholder="000.000.000-00" required /></label>
            <label>E-mail<input name="bootstrapEmail" [(ngModel)]="bootstrapForm.email" type="email" autocomplete="email" required /></label>
            <label class="login-field">
              <span>Senha</span>
              <span class="password-reveal-field">
                <input
                  name="bootstrapSenha"
                  [(ngModel)]="bootstrapForm.senha"
                  [type]="bootstrapPasswordVisible ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                />
                <button
                  type="button"
                  class="password-reveal-button"
                  aria-label="Manter pressionado para ver a senha"
                  (pointerdown)="bootstrapPasswordVisible = true"
                  (pointerup)="bootstrapPasswordVisible = false"
                  (pointerleave)="bootstrapPasswordVisible = false"
                  (pointercancel)="bootstrapPasswordVisible = false"
                ></button>
              </span>
            </label>

            <button type="submit" [disabled]="!canBootstrapAdmin">Cadastrar administrador SaaS</button>
          </form>
        </section>
      }
    </main>
  `,
})
export class LoginPageComponent implements OnInit {
  private readonly saasAdminStorageKey = 'uniflow.saasAdmin';

  protected systemAdminExists = true;
  protected bootstrapAdminModalOpen = false;
  protected bootstrapPasswordVisible = false;
  protected loginForm = {
    email: '',
    senha: '',
  };
  protected bootstrapForm = {
    nome: '',
    login: '',
    cpf: '',
    email: '',
    senha: '',
    role: 'SistemaAdmin',
    ativo: true,
  };

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.systemAdminExists = this.hasSaasAdmin();
    this.bootstrapAdminModalOpen = !this.systemAdminExists;
  }

  protected get canBootstrapAdmin(): boolean {
    return Boolean(
      this.bootstrapForm.nome.trim() &&
        this.bootstrapForm.login.trim() &&
        this.bootstrapForm.cpf.trim() &&
        this.bootstrapForm.email.trim() &&
        this.bootstrapForm.senha.trim().length >= 6,
    );
  }

  protected bootstrapAdmin(): void {
    if (!this.canBootstrapAdmin || !this.canUseLocalStorage()) {
      return;
    }

    localStorage.setItem(
      this.saasAdminStorageKey,
      JSON.stringify({
        nome: this.bootstrapForm.nome.trim(),
        login: this.bootstrapForm.login.trim(),
        cpf: this.bootstrapForm.cpf.trim(),
        email: this.bootstrapForm.email.trim(),
        senha: this.bootstrapForm.senha,
        role: 'SistemaAdmin',
        ativo: true,
        createdAt: new Date().toISOString(),
      }),
    );
    this.systemAdminExists = true;
    this.bootstrapAdminModalOpen = false;
  }

  protected login(): void {
    const email = this.loginForm.email.trim();
    const senha = this.loginForm.senha;

    if (!email) {
      void this.router.navigateByUrl(this.localLoginTarget());
      return;
    }

    this.http
      .post<Record<string, unknown>>('http://localhost:5058/api/auth/login', { email, senha })
      .subscribe({
        next: (user) => {
          localStorage.setItem('uniflow.usuario', JSON.stringify(user));
          const role = user['role'];
          void this.router.navigateByUrl(role === 'EmpresaAdmin' ? '/empresa' : '/saas');
        },
        error: () => {
          const target = this.localLoginTarget();
          if (target === '/saas') {
            void this.router.navigateByUrl(target);
            return;
          }

          void Swal.fire({
            title: 'Acesso nao encontrado',
            text: 'Verifique o e-mail informado ou solicite acesso ao administrador.',
            icon: 'error',
            confirmButtonColor: '#0aa39a',
          });
        },
      });
  }

  protected closeBootstrapAdminModal(): void {
    this.bootstrapAdminModalOpen = !this.systemAdminExists;
  }

  private hasSaasAdmin(): boolean {
    if (!this.canUseLocalStorage()) {
      return false;
    }

    const storedAdmin = this.readStoredJson(this.saasAdminStorageKey);
    if (storedAdmin) {
      return (
        storedAdmin['role'] === 'SistemaAdmin' ||
        Boolean(storedAdmin['email']) ||
        Boolean(storedAdmin['login'])
      );
    }

    const loggedUser = this.readStoredJson('uniflow.usuario');
    return loggedUser?.['role'] === 'SistemaAdmin';
  }

  private canUseLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private localLoginTarget(): string {
    const user = this.readStoredJson('uniflow.usuario');
    const admin = this.readStoredJson(this.saasAdminStorageKey);
    const role = user?.['role'] ?? admin?.['role'];

    return role === 'EmpresaAdmin' ? '/empresa' : '/saas';
  }

  private readStoredJson(key: string): Record<string, unknown> | null {
    const value = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
