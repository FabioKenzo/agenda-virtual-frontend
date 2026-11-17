import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    Comunicado,
    ComunicadoRequest
} from '../models/comunicado';

@Injectable({
    providedIn: 'root'
})
export class AdminComunicadoService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = 'http://localhost:8080/announcements';

    getComunicados(): Observable<Comunicado[]> {
        return this.http.get<Comunicado[]>(this.apiUrl, {
            withCredentials: true
        });
    }

    getComunicadoPorId(id: number): Observable<Comunicado> {
        return this.http.get<Comunicado>(
            `${this.apiUrl}/${id}`,
            {
                withCredentials: true
            }
        );
    }

    criarComunicado(
        request: ComunicadoRequest
    ): Observable<Comunicado> {
        return this.http.post<Comunicado>(
            this.apiUrl,
            request,
            {
                withCredentials: true
            }
        );
    }

    atualizarComunicado(
        id: number,
        request: ComunicadoRequest
    ): Observable<Comunicado> {
        return this.http.put<Comunicado>(
            `${this.apiUrl}/${id}`,
            request,
            {
                withCredentials: true
            }
        );
    }

    excluirComunicado(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`,
            {
                withCredentials: true
            }
        );
    }

}
