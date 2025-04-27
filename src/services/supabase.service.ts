/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { supabase } from '../config/supabase.config';

interface Favorite {
  id: string;
  user_id: string;
  city_name: string;
  created_at: string;
}

@Injectable()
export class SupabaseService {
  async addFavorite(userId: string, cityName: string): Promise<Favorite> {
    // Verificar si el favorito ya existe
    const { data: existingFavorite, error: fetchError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('city_name', cityName)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Ignorar error si no se encuentra
      console.error(
        'Error al verificar favorito existente en Supabase:',
        fetchError,
      );
      throw new Error(`Error al verificar favorito: ${fetchError.message}`);
    }

    if (existingFavorite) {
      console.log(
        'El favorito ya existe en la base de datos:',
        existingFavorite,
      );
      return existingFavorite as Favorite;
    }

    // Insertar el nuevo favorito si no existe
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, city_name: cityName }])
      .select()
      .single();

    if (error) {
      console.error('Error al añadir favorito en Supabase:', error);
      throw new Error(`Error al añadir favorito: ${error.message}`);
    }

    return data as Favorite;
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error al obtener favoritos en Supabase:', error);
      throw new Error(`Error al obtener favoritos: ${error.message}`);
    }

    return data as Favorite[];
  }

  async removeFavorite(userId: string, cityName: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('city_name', cityName);

    if (error) {
      console.error('Error al eliminar favorito en Supabase:', error);
      throw new Error(`Error al eliminar favorito: ${error.message}`);
    }

    return data as unknown as Favorite[];
  }
}
