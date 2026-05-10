import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-cozinha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cozinha.html',
  styleUrl: './cozinha.css'
})
export class Cozinha implements OnInit, OnDestroy {
  pedidos: any[] = [];
  loading = false;
  updatedAt = '';
  filtro = 'todos';
  private intervalId?: number;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.listarPedidos();
    this.intervalId = window.setInterval(() => this.listarPedidos(), 30000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  listarPedidos() {
    this.loading = true;
    this.api.getPedidosCozinha().subscribe({
      next: (res) => {
        this.pedidos = res;
        this.updatedAt = new Date().toLocaleTimeString();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  mudarStatus(id: number, status: string) {
    this.api.atualizarStatus(id, status).subscribe(() => this.listarPedidos());
  }

  isAtrasado(dataPedido: string): boolean {
    const agora = new Date();
    const pedido = new Date(dataPedido);
    const diffEmMinutos = (agora.getTime() - pedido.getTime()) / 1000 / 60;
    return diffEmMinutos > 5; // Vermelho se demorar mais de 5 minutos
  }

  get pedidosVisiveis() {
    if (this.filtro === 'todos') {
      return this.pedidos;
    }

    return this.pedidos.filter(pedido => pedido.status === this.filtro);
  }
}