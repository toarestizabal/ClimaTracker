import { Component } from '@angular/core';
import { WeatherService } from '../services/weather';
import { DatabaseService } from '../services/database';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  city: string = '';
  weatherData: any;

  constructor(
    private weatherService: WeatherService,
    private databaseService: DatabaseService
  ) {}

  searchWeather() {
    if (this.city.trim() !== '') {
      this.weatherService.getCurrentWeather(this.city).subscribe({
        next: (data) => {
          this.weatherData = data;
          console.log('Datos del clima:', data);
          
          
          this.databaseService.insertSearchHistory(this.city).then(() => {
            console.log('Búsqueda guardada en historial');
          }).catch(error => {
            console.error('Error guardando en historial:', error);
          });
        },
        error: (error) => {
          console.error('Error fetching weather:', error);
          this.weatherData = null;
        }
      });
    }
  }

  addToFavorites() {
    if (this.weatherData) {
      this.databaseService.insertFavorite(
        this.weatherData.name, 
        this.weatherData.sys.country
      ).then(() => {
        console.log('Ciudad agregada a favoritos');
        alert('¡Agregada a favoritos!');
      }).catch(error => {
        console.error('Error agregando a favoritos:', error);
      });
    }
  }
}
