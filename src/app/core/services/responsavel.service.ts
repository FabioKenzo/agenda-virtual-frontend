import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento';
import { Comunicado } from '../models/comunicado';
import { Pagina } from '../models/pagina';
import { PerfilResponsavel } from '../models/perfil-responsavel';
import { AlunoResponsavel } from '../models/aluno-responsavel';
import { UpdatePerfilResponsavelRequest } from '../models/update-perfil-responsavel-request';


@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {

  private readonly apiUrl = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  getAlunos(): Observable<AlunoResponsavel[]> {
    return this.http.get<AlunoResponsavel[]>(
      `${this.apiUrl}/responsavel/alunos`
    );
  }

  updatePerfil(
    request: UpdatePerfilResponsavelRequest
  ): Observable<PerfilResponsavel> {
    return this.http.patch<PerfilResponsavel>(
      `${this.apiUrl}/responsavel/perfil`,
      request,
      { withCredentials: true }
    );
  }

  getPerfil(): Observable<PerfilResponsavel> {
    return this.http.get<PerfilResponsavel>(
      `${this.apiUrl}/responsavel/perfil`
    );
  }

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/responsavel/eventos`);
  }

  getEventosPaginados(
    page: number = 0,
    size: number = 9
  ): Observable<Pagina<Evento>> {

    return this.http.get<Pagina<Evento>>(
      `${this.apiUrl}/responsavel/eventos/paginados`,
      {
        params: {
          page: page.toString(),
          size: size.toString()
        }
      }
    );
  }

  getEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(
      `${this.apiUrl}/responsavel/eventos/${id}`
    );
  }

  getComunicados(): Observable<Comunicado[]> {
    return this.http.get<Comunicado[]>(
      `${this.apiUrl}/responsavel/comunicados`
    );
  }

  getComunicadosPaginados(
    page: number = 0,
    size: number = 9
  ): Observable<Pagina<Comunicado>> {

    return this.http.get<Pagina<Comunicado>>(
      `${this.apiUrl}/responsavel/comunicados/paginados`,
      {
        params: {
          page: page.toString(),
          size: size.toString()
        }
      }
    );
  }

  getComunicadoPorId(id: number): Observable<Comunicado> {
    return this.http.get<Comunicado>(
      `${this.apiUrl}/responsavel/comunicados/${id}`
    );
  }

}
