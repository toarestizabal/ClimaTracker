import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false  
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private databaseService: DatabaseService,
    private router: Router
  ) {}

  async register() {
   
    if (this.username.trim() === '' || this.email.trim() === '' || 
        this.password.trim() === '' || this.confirmPassword.trim() === '') {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 4) {
      this.errorMessage = 'La contraseña debe tener al menos 4 caracteres';
      return;
    }

    if (!this.email.includes('@')) {
      this.errorMessage = 'Ingresa un correo electrónico válido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      
      const result = await this.databaseService.registerUser(
        this.username, 
        this.email, 
        this.password
      );
      
      if (result.success) {
        
        this.router.navigate(['/login'], { 
          queryParams: { registered: 'true', username: this.username } 
        });
      } else {
        this.errorMessage = result.message || 'Error en el registro';
      }
    } catch (error) {
      this.errorMessage = 'Error en el registro. Intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  clearError() {
    this.errorMessage = '';
  }
}