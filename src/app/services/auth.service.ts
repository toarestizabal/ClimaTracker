import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<string>('');

  constructor() {
   
    const savedUser = localStorage.getItem('weatherAppUser');
    if (savedUser) {
      this.isAuthenticated.next(true);
      this.currentUser.next(savedUser);
    }
  }

  login(username: string, password: string): boolean {
    
    const validUsers = [
      { user: 'admin', pass: 'Tomas.1998' },
      { user: 'usuario', pass: 'clima2025' },
      { user: 'test', pass: 'test' }
    ];

    const isValid = validUsers.some(u => u.user === username && u.pass === password);
    
    if (isValid) {
      this.isAuthenticated.next(true);
      this.currentUser.next(username);
      localStorage.setItem('weatherAppUser', username);
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated.next(false);
    this.currentUser.next('');
    localStorage.removeItem('weatherAppUser');
  }

  isLoggedIn() {
    return this.isAuthenticated.asObservable();
  }

  getCurrentUser() {
    return this.currentUser.asObservable();
  }

  
  isAuthenticatedSync(): boolean {
    return this.isAuthenticated.value;
  }
}