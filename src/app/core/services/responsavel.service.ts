import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento';


@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {

  private readonly apiUrl = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  getAlunos(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/responsavel/alunos`);
  }

  getEventos(): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.apiUrl}/responsavel/eventos`);
  }
}
