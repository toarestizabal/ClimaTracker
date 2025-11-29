import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any>(null);

  constructor(private databaseService: DatabaseService) {
    this.checkExistingAuth();
  }

  private checkExistingAuth() {
    
    const savedUser = localStorage.getItem('weatherAppUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        this.isAuthenticated.next(true);
        this.currentUser.next(userData);
      } catch (error) {
        
        localStorage.removeItem('weatherAppUser');
      }
    }
  }

  async login(username: string, password: string): Promise<{success: boolean, message?: string}> {
    try {
      
      const result = await this.databaseService.validateUser(username, password);
      
      if (result.success && result.user) {
        this.isAuthenticated.next(true);
        this.currentUser.next(result.user);
        
        
        localStorage.setItem('weatherAppUser', JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
      }
      
    } catch (error) {
      return { success: false, message: 'Error en la autenticación' };
    }
  }

  logout() {
    this.isAuthenticated.next(false);
    this.currentUser.next(null);
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

  
  getCurrentUserSync(): any {
    return this.currentUser.value;
  }
}