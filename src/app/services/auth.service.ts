import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8000/api';
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginCredentials): Observable<TokenResponse> {
    // Мок — убери и раскомментируй ниже когда бэкенд готов
    const fakeToken: TokenResponse = { access: 'mock-access-token', refresh: 'mock-refresh-token' };
    localStorage.setItem(this.TOKEN_KEY, fakeToken.access);
    return of(fakeToken);

    // Реальный запрос:
    // return this.http.post<TokenResponse>(`${this.API}/token/`, credentials).pipe(
    //   tap(tokens => {
    //     localStorage.setItem(this.TOKEN_KEY, tokens.access);
    //     localStorage.setItem(this.REFRESH_KEY, tokens.refresh);
    //   })
    // );
  }

  register(credentials: RegisterCredentials): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${this.API}/register/`, credentials);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}