import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { FeedbackService } from '../../services/feedback';
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
  temperaturaAtual?: number;
  climaDescricao = '';
  pratoPendente: any = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef, private router: Router, private feedback: FeedbackService) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(storedUser);
    this.carregarPratos();
    this.carregarHistorico();
    this.carregarClima();
  }

  carregarPratos() {
    this.api.getPratos().subscribe({
      next: (res) => { this.pratos = res; this.cdr.detectChanges(); },
      error: (err) => this.feedback.error('Falha ao carregar menu', err.message)
    });
  }

  carregarHistorico() {
    this.api.getHistoricoPedidos(this.user.id).subscribe({
      next: (res) => { this.historico = res; this.cdr.detectChanges(); },
      error: () => { this.historico = []; }
    });
  }

  carregarClima() {
    this.api.getWeatherLuanda().subscribe({
      next: (res) => {
        this.temperaturaAtual = res.current?.temperature_2m;
        this.climaDescricao = this.getWeatherDescription(res.current?.weather_code);
      },
      error: () => {
        this.temperaturaAtual = undefined;
        this.climaDescricao = 'Indisponível';
      }
    });
  }

  private getWeatherDescription(code?: number): string {
    const map: Record<number, string> = {
      0: 'Céu limpo',
      1: 'Poucas nuvens',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Nevoeiro',
      48: 'Nevoeiro denso',
      51: 'Garoa leve',
      61: 'Chuva leve',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      80: 'Pancadas leves',
      81: 'Pancadas moderadas',
      82: 'Pancadas fortes',
      95: 'Trovoada'
    };

    if (code === undefined) {
      return 'Sem dados';
    }

    return map[code] || 'Condição variável';
  }

  selecionarPrato(prato: any) {
    if (this.loading || !prato.disponivel) {
      return;
    }

    this.pratoPendente = prato;
  }

  cancelarPedido() {
    this.pratoPendente = null;
  }

  confirmarPedido() {
    const prato = this.pratoPendente;

    if (!prato || this.loading) {
      return;
    }

    this.loading = true;
    this.api.criarPedido({ utilizador_id: this.user.id, prato_id: prato.id }).subscribe({
      next: (res) => {
        this.user.saldo = res.novo_saldo;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.loading = false;
        this.pratoPendente = null;
        this.cdr.detectChanges();
        this.feedback.success('Pedido realizado', `Token ${res.token}. O seu saldo foi atualizado para ${res.novo_saldo} Kz.`);
      },
      error: (err) => {
        this.feedback.error('Não foi possível pedir', err.message);
        this.loading = false;
      }
    });
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
        this.feedback.success('Saldo carregado', `Novo saldo: ${res.novo_saldo} Kz`);
      },
      error: (err) => {
        this.walletLoading = false;
        this.feedback.error('Falha ao carregar saldo', err.message || 'Não foi possível carregar o saldo.');
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