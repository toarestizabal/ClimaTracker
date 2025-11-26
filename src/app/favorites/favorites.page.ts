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
      // Navega al home al presionar back de Android
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
        }
      },
      error: (error) => {
        console.error('Error fetching weather for favorite:', error);
      }
    });
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