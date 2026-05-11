import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recover-password.html',
  styleUrl: '../login/login.css'
})
export class RecoverPassword {
  email = '';
  novaSenha = '';
  erro = '';
  sucesso = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  recuperar() {
    this.erro = '';
    this.sucesso = '';
    this.loading = true;

    this.api.recoverPassword({ email: this.email, nova_senha: this.novaSenha }).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = 'Senha atualizada com sucesso. Faça login com a nova senha.';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err.message || 'Não foi possível recuperar a senha.';
      }
    });
  }
}
