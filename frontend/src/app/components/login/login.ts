import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para o ngModel
import { ApiService } from '../../services/api';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Importar aqui
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  senha = '';
  loading = false;
  erro = '';

  constructor(private api: ApiService, private router: Router) {}

  fazerLogin() {
    this.erro = '';
    this.loading = true;
    this.api.login({ email: this.email, senha: this.senha }).subscribe({
      next: (res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        const tipo = res.user?.tipo_conta;
        const destino = tipo === 'admin' ? '/admin/pratos' : tipo === 'operador' ? '/cozinha' : '/menu';
        this.loading = false;
        this.router.navigate([destino]);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err.error?.message || err.message || 'Não foi possível entrar.';
      }
    });
  }
}