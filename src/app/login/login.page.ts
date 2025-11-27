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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (this.username.trim() === '' || this.password.trim() === '') {
      this.errorMessage = 'Por favor ingrese usuario y contraseña';
      return;
    }

    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }

  clearError() {
    this.errorMessage = '';
  }
}