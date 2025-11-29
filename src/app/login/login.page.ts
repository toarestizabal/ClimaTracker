import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false  
})
export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false; 

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  
  async login() {
    if (this.username.trim() === '' || this.password.trim() === '') {
      this.errorMessage = 'Por favor ingrese usuario y contraseña';
      return;
    }

    this.isLoading = true; 
    this.errorMessage = ''; 

    try {
      
      const result = await this.authService.login(this.username, this.password);
      
      if (result.success) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = result.message || 'Usuario o contraseña incorrectos';
      }
    } catch (error) {
      this.errorMessage = 'Error en la autenticación';
    } finally {
      this.isLoading = false; 
    }
  }

  clearError() {
    this.errorMessage = '';
  }
}