import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminEvent, EventRequest } from '../models/admin-event';

@Injectable({
  providedIn: 'root'
})
export class AdminEventService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/events';

  getEventos(): Observable<AdminEvent[]> {
    return this.http.get<AdminEvent[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  criarEvento(request: EventRequest): Observable<AdminEvent> {
    return this.http.post<AdminEvent>(
      this.apiUrl,
      request,
      {
        withCredentials: true
      }
    );
  }
}
