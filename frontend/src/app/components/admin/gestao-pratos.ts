import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, PratoPayload } from '../../services/api';

@Component({
  selector: 'app-gestao-pratos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestao-pratos.html',
  styleUrl: './gestao-pratos.css'
})
export class GestaoPratos implements OnInit {
  pratos: any[] = [];
  stats: any = {};
  loading = false;
  saving = false;
  error = '';
  modoEdicao = false;

  form: PratoPayload = {
    nome: '',
    descricao: '',
    preco: 0,
    categoria: 'carne',
    disponivel: true,
    imagem_url: ''
  };

  readonly categorias = [
    { value: 'carne', label: 'Carne' },
    { value: 'peixe', label: 'Peixe' },
    { value: 'vegetariano', label: 'Vegetariano' },
    { value: 'dieta', label: 'Dieta' }
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;
    this.error = '';

    this.api.getPratosAdmin().subscribe({
      next: (res) => {
        this.pratos = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Não foi possível carregar os pratos.';
      }
    });

    this.api.getStats().subscribe({
      next: (res) => this.stats = res,
      error: () => this.stats = {}
    });
  }

  salvar() {
    this.saving = true;
    this.error = '';

    const payload = {
      ...this.form,
      preco: Number(this.form.preco),
      imagem_url: this.form.imagem_url?.trim() || null,
      descricao: this.form.descricao?.trim() || ''
    } as PratoPayload;

    const request$ = this.form.id ? this.api.atualizarPrato(payload) : this.api.criarPrato(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.limpar();
        this.carregarDados();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.message || 'Não foi possível guardar o prato.';
      }
    });
  }

  editar(prato: any) {
    this.modoEdicao = true;
    this.form = {
      id: prato.id,
      nome: prato.nome,
      descricao: prato.descricao,
      preco: Number(prato.preco),
      categoria: prato.categoria,
      disponivel: !!prato.disponivel,
      imagem_url: prato.imagem_url || ''
    };
  }

  limpar() {
    this.modoEdicao = false;
    this.form = {
      nome: '',
      descricao: '',
      preco: 0,
      categoria: 'carne',
      disponivel: true,
      imagem_url: ''
    };
  }

  alternarDisponibilidade(prato: any) {
    this.api.alternarDisponibilidade(prato.id, !prato.disponivel).subscribe({
      next: () => this.carregarDados(),
      error: (err) => this.error = err.message || 'Não foi possível atualizar a disponibilidade.'
    });
  }

  remover(prato: any) {
    if (!confirm(`Remover ${prato.nome}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    this.api.excluirPrato(prato.id).subscribe({
      next: () => this.carregarDados(),
      error: (err) => this.error = err.message || 'Não foi possível remover o prato.'
    });
  }

  get pratosDisponiveis() {
    return this.pratos.filter(prato => prato.disponivel).length;
  }

  get pratosIndisponiveis() {
    return this.pratos.filter(prato => !prato.disponivel).length;
  }
}
