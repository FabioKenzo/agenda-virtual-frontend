import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface LoginRequest{
  email: string;
  senha: string;
}


interface LoginResponse{
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080';
  private readonly tokenKey = 'agenda_virtual_token';

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<LoginResponse>{
    const request: LoginRequest ={
      email,
      senha
    };

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      request
    );
  }

  saveToken(token: string): void{
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null{
    return localStorage.getItem(this.tokenKey);
  }

}
