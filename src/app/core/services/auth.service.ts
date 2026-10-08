import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';


interface LoginRequest {
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080';
  

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<void> {

    const request: LoginRequest = {
      email,
      senha
    };

    return this.http.post<void>(
      `${this.apiUrl}/auth/login`,
      request,
      {withCredentials: true}
    );
  }

  logout(): Observable<void>{
    return this.http.post<void>(
      `${this.apiUrl}/auth/logout`,
      {},
      {withCredentials: true}
    );
  }

  checkSession(): Observable<void> {
  return this.http.get<void>(
    `${this.apiUrl}/auth/me`,
    { withCredentials: true }
  );
}
}
