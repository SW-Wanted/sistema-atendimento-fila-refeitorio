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

  exportarCsv() {
    if (!this.pedidos.length) {
      return;
    }

    const headers = ['token_pedido', 'prato', 'status', 'data_pedido'];
    const rows = this.pedidos.map((pedido) => [
      pedido.token_pedido,
      pedido.nome,
      pedido.status,
      pedido.data_pedido,
    ]);

    const csv = [headers, ...rows]
      .map((line) => line.map((item) => `"${String(item ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `historico_pedidos_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
