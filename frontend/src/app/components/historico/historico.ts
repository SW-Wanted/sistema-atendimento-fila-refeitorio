import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historico.html',
  styleUrl: './historico.css'
})
export class Historico implements OnInit {
  user: any = null;
  pedidos: any[] = [];
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = JSON.parse(storedUser);
    this.carregarHistorico();
  }

  carregarHistorico() {
    this.loading = true;
    this.api.getHistoricoPedidos(this.user.id).subscribe({
      next: (res) => {
        this.pedidos = res;
        this.loading = false;
      },
      error: () => {
        this.pedidos = [];
        this.loading = false;
      }
    });
  }

  get totalPedidos() {
    return this.pedidos.length;
  }

  get pedidosAtivos() {
    return this.pedidos.filter(pedido => pedido.status !== 'retirado').length;
  }

  get ultimoPedido() {
    return this.pedidos[0];
  }

  voltarMenu() {
    this.router.navigate(['/menu']);
  }
}
