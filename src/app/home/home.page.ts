import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../services/weather';
import { DatabaseService } from '../services/database';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  city: string = '';
  weatherData: any;
  loadingLocation: boolean = false;

  constructor(
    private weatherService: WeatherService,
    private databaseService: DatabaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  searchWeather() {
    if (this.city.trim() !== '') {
      this.weatherService.getCurrentWeather(this.city).subscribe({
        next: (data: any) => {
          this.weatherData = data;
          console.log('Datos del clima:', data);
          
         
          this.databaseService.insertSearchHistory(this.city, data).then(() => {
            console.log('Búsqueda guardada en historial CON DATOS DEL CLIMA');
          }).catch((error: any) => {
            console.error('Error guardando en historial:', error);
          });
        },
        error: (error: any) => {
          console.error('Error fetching weather:', error);
          this.weatherData = null;
        }
      });
    }
  }

  
  getCurrentLocationWeather() {
    this.loadingLocation = true;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log('Coordenadas:', lat, lon);

          this.weatherService.getWeatherByCoords(lat, lon).subscribe({
            next: (data: any) => {
              this.weatherData = data;
              this.city = data.name;
              this.loadingLocation = false;
              
              
              this.databaseService.insertSearchHistory(data.name, data).then(() => {
                console.log('Búsqueda por ubicación guardada CON DATOS DEL CLIMA');
              });
            },
            error: (error: any) => {
              console.error('Error clima por ubicación:', error);
              this.loadingLocation = false;
              alert('Error obteniendo clima de ubicación actual');
            }
          });
        },
        (error) => {
          console.error('Error geolocalización:', error);
          this.loadingLocation = false;
          alert('No se pudo obtener la ubicación actual: ' + error.message);
        }
      );
    } else {
      this.loadingLocation = false;
      alert('Geolocalización no soportada en este navegador');
    }
  }

  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  addToFavorites() {
    if (this.weatherData) {
      this.databaseService.insertFavorite(
        this.weatherData.name, 
        this.weatherData.sys.country
      ).then(() => {
        console.log('Ciudad agregada a favoritos');
        alert('¡Agregada a favoritos!');
      }).catch((error: any) => {
        console.error('Error agregando a favoritos:', error);
      });
    }
  }
}