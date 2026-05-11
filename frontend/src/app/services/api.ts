import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface PratoPayload {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  categoria: 'carne' | 'peixe' | 'vegetariano' | 'dieta';
  disponivel?: boolean;
  imagem_url?: string | null;
}

export interface WeatherResponse {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    const msg = error.error?.message || error.error?.error || 'Erro na comunicação com o servidor';
    return throwError(() => new Error(msg));
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login.php`, credentials).pipe(catchError(this.handleError));
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register.php`, payload).pipe(catchError(this.handleError));
  }

  recoverPassword(payload: { email: string; nova_senha: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/recover_password.php`, payload).pipe(catchError(this.handleError));
  }

  getPratos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/menu/get_pratos.php`).pipe(catchError(this.handleError));
  }

  getPratosAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/gestao_pratos.php`).pipe(catchError(this.handleError));
  }

  getPrato(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/gestao_pratos.php?id=${id}`).pipe(catchError(this.handleError));
  }

  criarPrato(payload: PratoPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/gestao_pratos.php`, payload).pipe(catchError(this.handleError));
  }

  atualizarPrato(payload: PratoPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/gestao_pratos.php`, payload).pipe(catchError(this.handleError));
  }

  alternarDisponibilidade(id: number, disponivel: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/gestao_pratos.php`, { id, disponivel }).pipe(catchError(this.handleError));
  }

  excluirPrato(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/gestao_pratos.php?id=${id}`).pipe(catchError(this.handleError));
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/stats.php`).pipe(catchError(this.handleError));
  }

  criarPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pedidos/criar.php`, pedido).pipe(catchError(this.handleError));
  }

  getPedidosCozinha(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pedidos/listar_cozinha.php`).pipe(catchError(this.handleError));
  }

  atualizarStatus(id: number, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/pedidos/atualizar_status.php`, { pedido_id: id, novo_status: status })
      .pipe(catchError(this.handleError));
  }

  carregarSaldo(utilizadorId: number, valor: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/utilizadores/carregar_saldo.php`, {
      utilizador_id: utilizadorId,
      valor,
    }).pipe(catchError(this.handleError));
  }

  getHistoricoPedidos(utilizadorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pedidos/historico.php?utilizador_id=${utilizadorId}`).pipe(catchError(this.handleError));
  }

  getWeatherLuanda(): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>('https://api.open-meteo.com/v1/forecast?latitude=-8.83&longitude=13.24&current=temperature_2m,weather_code')
      .pipe(catchError(this.handleError));
  }
}