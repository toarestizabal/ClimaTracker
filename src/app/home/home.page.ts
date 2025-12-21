import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../services/weather';
import { DatabaseService } from '../services/database';
import { AuthService } from '../services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

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

          this.databaseService.insertSearchHistory(this.city, data);
        },
        error: () => {
          this.weatherData = null;
        }
      });
    }
  }

  

  async getCurrentLocationWeather() {
    this.loadingLocation = true;

    try {
      let lat: number;
      let lon: number;

      
      if (Capacitor.getPlatform() === 'web') {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      } 
      
      else {
        const position = await Geolocation.getCurrentPosition();
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      }

      this.weatherService.getWeatherByCoords(lat, lon).subscribe({
        next: (data: any) => {
          this.weatherData = data;
          this.city = data.name;
          this.loadingLocation = false;

          this.databaseService.insertSearchHistory(data.name, data);
        },
        error: () => {
          this.loadingLocation = false;
          alert('Error obteniendo clima');
        }
      });

    } catch {
      this.loadingLocation = false;
      alert('No se pudo obtener la ubicación actual');
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
      );
      alert('¡Agregada a favoritos!');
    }
  }
}
