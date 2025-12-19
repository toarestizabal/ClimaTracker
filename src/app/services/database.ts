import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private _storage!: Storage;

  constructor(private storage: Storage) {
    this.initDatabase();
  }

  private async initDatabase() {
    this._storage = await this.storage.create();

    // Inicializar storage si no existe
    const favorites = await this._storage.get('favorites');
    if (!favorites) {
      await this._storage.set('favorites', []);
    }

    const searchHistory = await this._storage.get('search_history');
    if (!searchHistory) {
      await this._storage.set('search_history', []);
    }

    const users = await this._storage.get('weather_users');
    if (!users) {
      const defaultUsers = [
        { id: 1, username: 'admin', password: 'Tomas.1998', email: 'admin@climatracker.com', created_at: new Date().toISOString() },
        { id: 2, username: 'usuario', password: 'clima2025', email: 'usuario@climatracker.com', created_at: new Date().toISOString() },
        { id: 3, username: 'test', password: 'test', email: 'test@climatracker.com', created_at: new Date().toISOString() }
      ];
      await this._storage.set('weather_users', defaultUsers);
    }
  }

  // Validar usuario
  async validateUser(username: string, password: string): Promise<{ success: boolean; user?: any }> {
    const users = (await this._storage.get('weather_users')) || [];
    const user = users.find((u: any) => u.username === username && u.password === password);

    if (user) {
      return { success: true, user: { id: user.id, username: user.username, email: user.email } };
    }
    return { success: false };
  }

  // Obtener usuario por ID
  async getUserById(userId: number): Promise<any> {
    const users = (await this._storage.get('weather_users')) || [];
    const user = users.find((u: any) => u.id === userId);
    return user ? { id: user.id, username: user.username, email: user.email } : null;
  }

  // Registrar nuevo usuario
  async registerUser(username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
    const users = (await this._storage.get('weather_users')) || [];

    const existingUser = users.find((u: any) => u.username === username || u.email === email);
    if (existingUser) {
      return {
        success: false,
        message: existingUser.username === username
          ? 'El nombre de usuario ya está en uso'
          : 'El correo electrónico ya está registrado'
      };
    }

    const newUser = {
      id: users.length + 1,
      username,
      password,
      email,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    await this._storage.set('weather_users', users);

    return { success: true };
  }

  // Insertar historial de búsqueda
  async insertSearchHistory(city: string, weatherData?: any): Promise<boolean> {
    const history = (await this._storage.get('search_history')) || [];

    const historyEntry: any = {
      city_name: city,
      search_date: new Date().toISOString()
    };

    if (weatherData) {
      historyEntry.weather_data = {
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        wind_speed: weatherData.wind.speed,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon
      };
    }

    history.unshift(historyEntry);

    const limitedHistory = history.slice(0, 10);
    await this._storage.set('search_history', limitedHistory);
    return true;
  }

  // Obtener historial de búsqueda
  async getSearchHistory(): Promise<any[]> {
    return (await this._storage.get('search_history')) || [];
  }

  // Insertar favorito
  async insertFavorite(city: string, country: string): Promise<boolean> {
    const favorites = (await this._storage.get('favorites')) || [];

    favorites.unshift({
      city_name: city,
      country,
      date_added: new Date().toISOString()
    });

    await this._storage.set('favorites', favorites);
    return true;
  }

  // Obtener favoritos
  async getFavorites(): Promise<any[]> {
    return (await this._storage.get('favorites')) || [];
  }
}
