import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

interface CsrfResponse {
    headerName: string;
    parameterName: string;
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class CsrfService {

    private readonly apiUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    getToken(): Observable<string> {
        return this.http.get<CsrfResponse>(
            `${this.apiUrl}/auth/csrf`,
            { withCredentials: true }
        ).pipe(
            map(response => response.token)
        );
    }
}