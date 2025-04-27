# API Weather con Supabase

Esta es una API construida con el framework [NestJS](https://nestjs.com/) que permite gestionar datos meteorológicos y favoritos utilizando [Supabase](https://supabase.com/) como base de datos.

## Descripción

La API proporciona los siguientes endpoints principales:

### Endpoints de Favoritos

- **GET /favorites**: Obtiene la lista de ciudades favoritas de un usuario.

  - Parámetros de consulta:
    - `user_id` (string, requerido): El ID del usuario.

- **POST /favorites**: Añade una ciudad a la lista de favoritos de un usuario.

  - Cuerpo de la solicitud:
    ```json
    {
      "user_id": "<uuid>",
      "city_name": "<nombre de la ciudad>"
    }
    ```

- **DELETE /favorites/:city**: Elimina una ciudad de la lista de favoritos de un usuario.

  - Parámetros de consulta:
    - `user_id` (string, requerido): El ID del usuario.
  - Parámetros de ruta:
    - `city` (string, requerido): El nombre de la ciudad a eliminar.

- **POST /favorites/example**: Añade un dato de ejemplo a la base de datos con el `user_id` predefinido `07e013ea-2f78-43c3-b7c3-9c4d56b499c9` y la ciudad `Maracaibo`.

- **DELETE /favorites/example**: Elimina el dato de ejemplo de la base de datos con el `user_id` predefinido `07e013ea-2f78-43c3-b7c3-9c4d56b499c9` y la ciudad `Maracaibo`.

### Endpoints de Datos Meteorológicos

- **GET /weather**: Obtiene datos meteorológicos simulados para una ciudad.

  - Parámetros de consulta:
    - `city` (string, requerido): El nombre de la ciudad.

- **GET /autocomplete**: Devuelve una lista de ciudades que coinciden con una consulta parcial.
  - Parámetros de consulta:
    - `query` (string, requerido): La consulta parcial para buscar ciudades.

## Configuración del Proyecto

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno en un archivo `.env` en la raíz del proyecto:

```env
SUPABASE_URL=https://<tu-supabase-url>.supabase.co
SUPABASE_KEY=<tu-supabase-key>
WEATHER_API_KEY=<tu-api-key>
```

### Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno en el archivo `.env`.

### Ejecución

- **Modo desarrollo**:

  ```bash
  npm run start:dev
  ```

- **Modo producción**:
  ```bash
  npm run start:prod
  ```

### Pruebas

- **Pruebas unitarias**:

  ```bash
  npm run test
  ```

- **Pruebas end-to-end**:

  ```bash
  npm run test:e2e
  ```

- **Cobertura de pruebas**:
  ```bash
  npm run test:cov
  ```

## Uso de Supabase

La API utiliza Supabase como base de datos para gestionar los favoritos. Asegúrate de que la tabla `favorites` esté configurada con la siguiente estructura:

```sql
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    city_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, city_name)
);
```

## Recursos

- [Documentación de NestJS](https://docs.nestjs.com)
- [Documentación de Supabase](https://supabase.com/docs)

## Autor

- **Nombre del Autor**: Javier Alburges
- **Contacto**: javieralburges@gmail.com
