import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento';
import { Comunicado } from '../models/comunicado';
import { Pagina } from '../models/pagina';


@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {

  private readonly apiUrl = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  getAlunos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/responsavel/alunos`);
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


  getComunicadoPorId(id: number): Observable<Comunicado> {
    return this.http.get<Comunicado>(
      `${this.apiUrl}/responsavel/comunicados/${id}`
    );
  }

}
