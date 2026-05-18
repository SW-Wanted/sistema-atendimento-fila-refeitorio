import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, PratoPayload } from '../../services/api';
import { FeedbackService } from '../../services/feedback';

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
  previewImagem = '';
  pratoParaRemover: any = null;

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

  constructor(private api: ApiService, private feedback: FeedbackService) {}

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
        this.feedback.success('Prato guardado', 'O prato foi criado ou atualizado com sucesso.');
      },
      error: (err) => {
        this.saving = false;
        this.feedback.error('Falha ao guardar prato', err.message || 'Não foi possível guardar o prato.');
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
    this.previewImagem = prato.imagem_url || '';
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
    this.previewImagem = '';
  }

  alternarDisponibilidade(prato: any) {
    this.api.alternarDisponibilidade(prato.id, !prato.disponivel).subscribe({
      next: () => {
        this.carregarDados();
        this.feedback.info('Disponibilidade atualizada', `O prato ${prato.nome} foi ${prato.disponivel ? 'desativado' : 'ativado'}.`);
      },
      error: (err) => this.feedback.error('Falha ao atualizar disponibilidade', err.message || 'Não foi possível atualizar a disponibilidade.')
    });
  }

  remover(prato: any) {
    this.pratoParaRemover = prato;
  }

  cancelarRemocao() {
    this.pratoParaRemover = null;
  }

  confirmarRemocao() {
    const prato = this.pratoParaRemover;

    if (!prato) {
      return;
    }

    this.api.excluirPrato(prato.id).subscribe({
      next: () => {
        this.carregarDados();
        this.feedback.success('Prato removido', `${prato.nome} foi removido do catálogo.`);
        this.pratoParaRemover = null;
      },
      error: (err) => this.feedback.error('Falha ao remover prato', err.message || 'Não foi possível remover o prato.')
    });
  }

  onImagemSelecionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.feedback.error('Ficheiro inválido', 'Selecione uma imagem válida.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      this.form.imagem_url = result;
      this.previewImagem = result;
    };
    reader.readAsDataURL(file);
  }

  get pratosDisponiveis() {
    return this.pratos.filter(prato => prato.disponivel).length;
  }

  get pratosIndisponiveis() {
    return this.pratos.filter(prato => !prato.disponivel).length;
  }

  exportarCsv() {
    const headers = ['id', 'nome', 'categoria', 'preco', 'disponivel'];
    const rows = this.pratos.map((prato) => [
      prato.id,
      prato.nome,
      prato.categoria,
      prato.preco,
      prato.disponivel ? 'sim' : 'nao'
    ]);

    const statsRows = [
      [],
      ['metrica', 'valor'],
      ['total_pratos', this.pratos.length],
      ['disponiveis', this.pratosDisponiveis],
      ['indisponiveis', this.pratosIndisponiveis],
    ];

    const csv = [headers, ...rows, ...statsRows]
      .map((line) => line.map((item) => `"${String(item ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_pratos_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
