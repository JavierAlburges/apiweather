import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { UUID } from 'crypto';

interface AddFavoritePayload {
  user_id: UUID; // Cambiar UUID a string para evitar errores
  city_name: string;
}

@Controller()
export class AppController {
  @Get('weather')
  async getWeather(@Query('city') city: string): Promise<any> {
    if (!city) {
      throw new Error('City is required');
    }

    // Datos de ejemplo para diferentes ciudades
    const weatherData = {
      Maracaibo: {
        location: {
          name: 'Maracaibo',
          region: 'Zulia',
          country: 'Venezuela',
        },
        current: {
          temp_c: 29.4,
          condition: {
            text: 'Patchy rain nearby',
          },
        },
      },
      Caracas: {
        location: {
          name: 'Caracas',
          region: 'Distrito Capital',
          country: 'Venezuela',
        },
        current: {
          temp_c: 25.0,
          condition: {
            text: 'Sunny',
          },
        },
      },
    };

    // Simulate an asynchronous operation
    const data = await new Promise((resolve) =>
      setTimeout(() => resolve(weatherData[city]), 100),
    );
    if (!data) {
      throw new Error(`Weather data for city ${city} not found`);
    }

    return data;
  }

  @Get('autocomplete')
  async getAutocomplete(@Query('query') query: string): Promise<string[]> {
    if (!query) {
      throw new Error('Query is required');
    }

    // Lista de ciudades de ejemplo
    const cities = [
      'Maracaibo',
      'Caracas',
      'Valencia',
      'Barquisimeto',
      'Maracay',
      'Mérida',
    ];

    // Simulate an asynchronous operation
    const filteredCities = await new Promise<string[]>((resolve) =>
      setTimeout(
        () =>
          resolve(
            cities.filter((city) =>
              city.toLowerCase().includes(query.toLowerCase()),
            ),
          ),
        100,
      ),
    );

    return filteredCities;
  }

  @Get('favorites')
  getFavorites(): Promise<any[]> {
    // Datos de ejemplo para favoritos
    return Promise.resolve([
      {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        city_name: 'Maracaibo',
      },
      { user_id: '123e4567-e89b-12d3-a456-426614174001', city_name: 'Caracas' },
    ]);
  }

  @Post('favorites')
  addFavorite(@Body() payload: AddFavoritePayload): Promise<any> {
    const { user_id, city_name } = payload;

    if (!user_id || !city_name) {
      throw new Error('Both user_id and city_name are required');
    }

    // Datos de ejemplo para simular la adición de un favorito
    const newFavorite = { user_id, city_name };

    return Promise.resolve({
      message: 'Favorite added successfully',
      favorite: newFavorite,
    });
  }

  @Delete('favorites/:city')
  removeFavorite(@Param('city') city: string): Promise<any> {
    if (!city) {
      throw new Error('City is required');
    }

    // Simulación de eliminación de un favorito
    return Promise.resolve({
      message: `Favorite city ${city} removed successfully`,
    });
  }
}
