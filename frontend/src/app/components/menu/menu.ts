import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  pratos: any[] = [];
  historico: any[] = [];
  user: any = null;
  loading = false;
  walletLoading = false;
  search = '';
  categoria = 'todas';
  saldoRecarga = 500;
  categorias = ['todas', 'carne', 'peixe', 'vegetariano', 'dieta'];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(storedUser);
    this.carregarPratos();
    this.carregarHistorico();
  }

  carregarPratos() {
    this.api.getPratos().subscribe({
      next: (res) => { this.pratos = res; this.cdr.detectChanges(); },
      error: (err) => alert(err.message)
    });
  }

  carregarHistorico() {
    this.api.getHistoricoPedidos(this.user.id).subscribe({
      next: (res) => { this.historico = res; this.cdr.detectChanges(); },
      error: () => { this.historico = []; }
    });
  }

  selecionarPrato(prato: any) {
    if (this.loading) return;
    
    if (confirm(`Confirmar pedido de ${prato.nome} por ${prato.preco} Kz?`)) {
      this.loading = true;
      this.api.criarPedido({ utilizador_id: this.user.id, prato_id: prato.id }).subscribe({
        next: (res) => {
          alert(`SUCESSO!\nToken: ${res.token}\nRetire o seu prato quando for notificado.`);
          this.user.saldo = res.novo_saldo;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert(err.message);
          this.loading = false;
        }
      });
    }
  }

  carregarSaldo(valor: number) {
    if (!valor || valor <= 0 || this.walletLoading) return;

    this.walletLoading = true;
    this.api.carregarSaldo(this.user.id, valor).subscribe({
      next: (res) => {
        this.user.saldo = res.novo_saldo;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.walletLoading = false;
        this.cdr.detectChanges();
        alert(`Saldo atualizado com sucesso. Novo saldo: ${res.novo_saldo} Kz`);
      },
      error: (err) => {
        this.walletLoading = false;
        alert(err.message || 'Não foi possível carregar o saldo.');
      }
    });
  }

  get pratosFiltrados() {
    return this.pratos.filter(prato => {
      const combinacaoTexto = `${prato.nome} ${prato.descricao} ${prato.categoria}`.toLowerCase();
      const correspondePesquisa = !this.search || combinacaoTexto.includes(this.search.toLowerCase());
      const correspondeCategoria = this.categoria === 'todas' || prato.categoria === this.categoria;
      return correspondePesquisa && correspondeCategoria;
    });
  }

  getPedidoAtivo() {
    return this.historico.find(pedido => pedido.status !== 'retirado');
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}