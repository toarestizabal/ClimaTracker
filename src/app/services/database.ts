import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  constructor() { 
    this.initDatabase();
  }

  private initDatabase() {
    // Inicializar datos si no existen
    if (!localStorage.getItem('favorites')) {
      localStorage.setItem('favorites', JSON.stringify([]));
    }
    if (!localStorage.getItem('search_history')) {
      localStorage.setItem('search_history', JSON.stringify([]));
    }
  }

  // INSERTAR EN HISTORIAL
  insertSearchHistory(city: string): Promise<any> {
    return new Promise((resolve) => {
      const history = JSON.parse(localStorage.getItem('search_history') || '[]');
      history.unshift({
        city_name: city,
        search_date: new Date().toISOString()
      });
      // Mantener solo últimos 10
      const limitedHistory = history.slice(0, 10);
      localStorage.setItem('search_history', JSON.stringify(limitedHistory));
      resolve(true);
    });
  }

  // OBTENER HISTORIAL
  getSearchHistory(): Promise<any[]> {
    return new Promise((resolve) => {
      const history = JSON.parse(localStorage.getItem('search_history') || '[]');
      resolve(history);
    });
  }

  // INSERTAR FAVORITO
  insertFavorite(city: string, country: string): Promise<any> {
    return new Promise((resolve) => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      favorites.unshift({
        city_name: city,
        country: country,
        date_added: new Date().toISOString()
      });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      resolve(true);
    });
  }

  // OBTENER FAVORITOS
  getFavorites(): Promise<any[]> {
    return new Promise((resolve) => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      resolve(favorites);
    });
  }
}