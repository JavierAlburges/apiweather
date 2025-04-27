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
//import { supabase } from './config/supabase.config';

interface AddFavoritePayload {
  user_id: UUID; // Cambiar UUID a string para evitar errores
  city_name: string;
}

@Controller()
export class AppController {
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
  async getFavorites(): Promise<any[]> {
    try {
      const favorites = await Promise.resolve([
        {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          city_name: 'Maracaibo',
        },
        {
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          city_name: 'Caracas',
        },
      ]);
      return favorites;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw new InternalServerErrorException('Failed to fetch favorites');
    }
  }

  @Post('favorites')
  async addFavorite(@Body() payload: AddFavoritePayload): Promise<any> {
    const { user_id, city_name } = payload;

    if (!user_id || !city_name) {
      throw new BadRequestException(
        'Both user_id and city_name are required in the request body',
      );
    }

    try {
      const newFavorite = { user_id, city_name };
      await Promise.resolve();

      return {
        message: 'Favorite added successfully',
        favorite: newFavorite,
      };
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw new InternalServerErrorException('Failed to add favorite');
    }
  }

  @Delete('favorites/:city')
  async removeFavorite(@Param('city') city: string): Promise<any> {
    if (!city) {
      throw new BadRequestException('City parameter is required');
    }

    try {
      await Promise.resolve();
      return {
        message: `Favorite city ${city} removed successfully`,
      };
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw new InternalServerErrorException('Failed to remove favorite');
    }
  }
}
