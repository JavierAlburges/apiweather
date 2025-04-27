import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { SupabaseService } from './services/supabase.service';

interface AddFavoritePayload {
  user_id: UUID; // Cambiar UUID a string para evitar errores
  city_name: string;
}

@Controller()
export class AppController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('weather')
  async getWeather(@Query('city') city: string): Promise<any> {
    if (!city) {
      throw new BadRequestException('City query parameter is required');
    }

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

    try {
      const data = await new Promise((resolve) =>
        setTimeout(() => resolve(weatherData[city]), 100),
      );

      if (!data) {
        throw new NotFoundException(`Weather data for city ${city} not found`);
      }
      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching weather data:', error);
      throw new InternalServerErrorException('Failed to fetch weather data');
    }
  }

  @Get('autocomplete')
  async getAutocomplete(@Query('query') query: string): Promise<string[]> {
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }

    const cities = [
      'Maracaibo',
      'Caracas',
      'Valencia',
      'Barquisimeto',
      'Maracay',
      'Mérida',
    ];

    try {
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
    } catch (error) {
      console.error('Error during autocomplete:', error);
      throw new InternalServerErrorException('Failed to perform autocomplete');
    }
  }

  @Get('favorites')
  async getFavorites(@Query('user_id') userId: string): Promise<any[]> {
    if (!userId) {
      throw new BadRequestException('El parámetro "user_id" es obligatorio');
    }
    try {
      return await this.supabaseService.getFavorites(userId);
    } catch (error) {
      console.error('Error al obtener los favoritos:', error);
      throw new InternalServerErrorException('Error al obtener los favoritos');
    }
  }

  @Post('favorites')
  async addFavorite(@Body() payload: AddFavoritePayload): Promise<any> {
    const { user_id, city_name } = payload;
    if (!user_id || !city_name) {
      throw new BadRequestException(
        'Se requieren "user_id" y "city_name" en el cuerpo de la solicitud',
      );
    }
    try {
      const data = await this.supabaseService.addFavorite(user_id, city_name);
      return {
        message: 'Favorito añadido correctamente',
        favorite: data,
      };
    } catch (error) {
      console.error('Error al añadir el favorito:', error);
      throw new InternalServerErrorException('Error al añadir el favorito');
    }
  }

  @Delete('favorites/:city')
  async removeFavorite(
    @Query('user_id') userId: string,
    @Param('city') cityName: string,
  ): Promise<any> {
    if (!userId || !cityName) {
      throw new BadRequestException('Se requieren "user_id" y "city_name"');
    }
    try {
      await this.supabaseService.removeFavorite(userId, cityName);
      return {
        message: `Ciudad favorita ${cityName} eliminada correctamente`,
      };
    } catch (error) {
      console.error('Error al eliminar el favorito:', error);
      throw new InternalServerErrorException('Error al eliminar el favorito');
    }
  }

  @Post('favorites/example')
  async addExampleFavorite(): Promise<any> {
    const exampleUserId = '07e013ea-2f78-43c3-b7c3-9c4d56b499c9';
    const exampleCity = 'Maracaibo';

    try {
      const data = await this.supabaseService.addFavorite(
        exampleUserId,
        exampleCity,
      );
      return {
        message: 'Dato de ejemplo añadido correctamente',
        favorite: data,
      };
    } catch (error) {
      console.error('Error al añadir dato de ejemplo:', error);
      throw new InternalServerErrorException('Error al añadir dato de ejemplo');
    }
  }
}
