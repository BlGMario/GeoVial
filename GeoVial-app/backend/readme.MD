# Proyecto Django: GeoDataJVR

Este proyecto es una API REST en Django que se conecta a una base de datos PostgreSQL existente y expone los datos de la tabla `"GeoDataJVR"."DS011_2016_RVD_EJES"`.

## Requisitos

- Python 3.10+
- PostgreSQL 15+
- pip (gestor de paquetes de Python)
- Entorno virtual recomendado (venv)

## Instalación

1. **Clona el repositorio y navega al directorio del backend:**

   ```sh
   cd backend
   ```

2. **Crea y activa un entorno virtual:**

   ```sh
   python -m venv .venv
   .venv\Scripts\activate   # En Windows
   ```

3. **Instala las dependencias:**

   ```sh
   pip install -r requirements.txt
   ```

4. **Configura la base de datos en `geovialapi/settings.py`:**

   Asegúrate de que los datos de conexión coincidan con tu servidor PostgreSQL y base de datos.

   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'postgres',
           'USER': 'postgres',
           'PASSWORD': 'postgres',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

5. **No es necesario ejecutar migraciones para la app `ejes`**  
   La tabla ya existe y el modelo tiene `managed = False`.

6. **Ejecuta el servidor de desarrollo:**

   ```sh
   python manage.py runserver
   ```

7. **Accede a la API:**

   - Lista de ejes: [http://localhost:8000/api/ejes/](http://localhost:8000/api/ejes/)

## Notas

- Si necesitas instalar dependencias adicionales, agrégalas al archivo `requirements.txt` y ejecuta nuevamente `pip install -r requirements.txt`.
- El modelo Django está configurado para solo lectura sobre la tabla existente.

---
```# Proyecto Django: GeoDataJVR

Este proyecto es una API REST en Django que se conecta a una base de datos PostgreSQL existente y expone los datos de la tabla `"GeoDataJVR"."DS011_2016_RVD_EJES"`.

## Requisitos

- Python 3.10+
- PostgreSQL 15+
- pip (gestor de paquetes de Python)
- Entorno virtual recomendado (venv)

## Instalación

1. **Clona el repositorio y navega al directorio del backend:**

   ```sh
   cd backend
   ```

2. **Crea y activa un entorno virtual:**

   ```sh
   python -m venv .venv
   .venv\Scripts\activate   # En Windows
   ```

3. **Instala las dependencias:**

   ```sh
   pip install -r requirements.txt
   ```

4. **Configura la base de datos en `geovialapi/settings.py`:**

   Asegúrate de que los datos de conexión coincidan con tu servidor PostgreSQL y base de datos.

   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'postgres',
           'USER': 'postgres',
           'PASSWORD':postgres',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

5. **No es necesario ejecutar migraciones para la app `ejes`**  
   La tabla ya existe y el modelo tiene `managed = False`.

6. **Ejecuta el servidor de desarrollo:**

   ```sh
   python manage.py runserver
   ```

7. **Accede a la API:**

   - Lista de ejes: [http://localhost:8000/api/ejes/](http://localhost:8000/api/ejes/)

## Notas

- Si necesitas instalar dependencias adicionales, agrégalas al archivo `requirements.txt` y ejecuta nuevamente `pip install -r requirements.txt`.
- El modelo Django está configurado para solo lectura sobre la tabla existente.

---