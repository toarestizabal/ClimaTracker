import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database';
import { WeatherService } from '../services/weather';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false 
})
export class FavoritesPage implements OnInit {
  favorites: any[] = [];
  loading: boolean = true;

  constructor(
    private databaseService: DatabaseService,
    private weatherService: WeatherService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.loadFavorites();
  }

  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      window.history.back();
    });
  }

  loadFavorites() {
    this.loading = true;
    this.databaseService.getFavorites().then(favorites => {
      this.favorites = favorites;
      this.loading = false;
    }).catch(error => {
      console.error('Error loading favorites:', error);
      this.loading = false;
    });
  }

  getWeatherForFavorite(city: string) {
    this.weatherService.getCurrentWeather(city).subscribe({
      next: (data) => {
        const favoriteIndex = this.favorites.findIndex(fav => fav.city_name === city);
        if (favoriteIndex !== -1) {
          this.favorites[favoriteIndex].currentWeather = data;
          
          this.updateFavoriteWeatherData(city, data);
        }
      },
      error: (error) => {
        console.error('Error fetching weather for favorite:', error);
      }
    });
  }

  
  private updateFavoriteWeatherData(city: string, weatherData: any) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoriteIndex = favorites.findIndex((fav: any) => fav.city_name === city);
    
    if (favoriteIndex !== -1) {
      favorites[favoriteIndex].weather_data = {
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        wind_speed: weatherData.wind.speed,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        last_updated: new Date().toISOString()
      };
      
      localStorage.setItem('favorites', JSON.stringify(favorites));
      console.log('Datos del clima actualizados para favorito:', city);
    }
  }

  removeFavorite(favorite: any) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.filter((fav: any) => 
      !(fav.city_name === favorite.city_name && fav.country === favorite.country)
    );
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    this.loadFavorites();
  }

  refreshAllFavorites() {
    this.favorites.forEach(favorite => {
      this.getWeatherForFavorite(favorite.city_name);
    });
  }
}