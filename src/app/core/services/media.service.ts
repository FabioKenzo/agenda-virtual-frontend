import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Media } from '../models/media';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/admin/media';

  listar(): Observable<Media[]> {
    return this.http.get<Media[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  upload(arquivo: File): Observable<Media> {
    const formData = new FormData();

    formData.append('file', arquivo);

    return this.http.post<Media>(
      this.apiUrl,
      formData,
      {
        withCredentials: true
      }
    );
  }


  obterUrlImagem(id: number): string {
    return `${this.apiUrl}/${id}/file`;
  }


}

