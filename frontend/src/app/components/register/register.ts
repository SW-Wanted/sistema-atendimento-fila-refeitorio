import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../login/login.css'
})
export class Register {
  nome = '';
  email = '';
  senha = '';
  tipo_conta = 'institucional';
  erro = '';
  sucesso = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  criarConta() {
    this.erro = '';
    this.sucesso = '';
    this.loading = true;

    this.api.register({
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      tipo_conta: this.tipo_conta
    }).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = 'Conta criada com sucesso. Agora pode fazer login.';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err.message || 'Não foi possível criar a conta.';
      }
    });
  }
}
