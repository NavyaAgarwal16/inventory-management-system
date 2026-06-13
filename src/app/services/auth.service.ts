import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  sendOtp(data: {
    email: string
  }) {

    return this.http.post(
      `${this.apiUrl}/send-otp`,
      data
    );

  }

  verifyOtp(data: {
    name: string;
    email: string;
    password: string;
    otp: string;
  }) {

    return this.http.post(
      `${this.apiUrl}/verify-otp`,
      data
    );

  }

}

