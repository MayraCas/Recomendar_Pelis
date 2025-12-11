# 🎬 CineMatch - Sistema de Recomendación de Películas

Sistema de recomendación de películas tipo Netflix/IMDb simplificado, construido con React, Vite y Neo4j.

## ✨ Características

- **🎨 Interfaz moderna** con diseño en tonos azul y morado pastel
- **🤖 Sistema de recomendaciones inteligente** basado en:
  - Usuarios con gustos similares
  - Géneros favoritos
  - Películas mejor calificadas
- **⭐ Calificación interactiva** con estrellas visuales
- **📜 Historial personalizado** de películas vistas por usuario
- **🔍 Búsqueda en tiempo real** con autocompletado
- **🎭 Catálogo completo** con información de géneros, ratings y duración
- **👥 Selección de usuario** sin necesidad de login (simplificado)

## 🛠️ Tecnologías

- **Frontend**: React 19 + Vite
- **Base de datos**: Neo4j (base de datos de grafos)
- **Estilos**: CSS puro con variables CSS para temas
- **Driver**: neo4j-driver

## 📋 Componentes Principales

### 1. SelectorUsuario
Componente para seleccionar el usuario activo sin necesidad de autenticación.

### 2. RecomendacionesPeliculas
Sistema de recomendaciones con tres algoritmos:
- **Usuarios similares**: Basado en usuarios que vieron y calificaron las mismas películas
- **Mismos géneros**: Películas de géneros que le gustan al usuario
- **Mejor calificadas**: Top películas que el usuario no ha visto

### 3. CalificarPelicula
Interfaz para calificar películas con:
- Búsqueda inteligente de películas
- Selector de estrellas interactivo
- Feedback visual de confirmación

### 4. HistorialUsuario
Muestra todas las películas vistas por el usuario con:
- Calificación dada
- Fecha de visualización
- Géneros y duración

### 5. ListaPeliculas
Catálogo completo de películas disponibles con:
- Rating promedio
- Total de valoraciones
- Géneros asociados

### 6. BuscadorPeliculas
Búsqueda en tiempo real con:
- Autocompletado
- Información de películas en sugerencias
- Debounce para optimizar consultas

## 🚀 Instalación y Uso

### Prerequisitos
- Node.js (v16 o superior)
- Neo4j Desktop o servidor Neo4j
- npm o yarn

### Paso 1: Configurar Neo4j

1. Inicia Neo4j Desktop o tu servidor Neo4j
2. Crea una nueva base de datos o usa una existente
3. Ejecuta el script en `database/moviesNeo4j.cql` para crear la estructura de datos

### Paso 2: Configurar la aplicación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Actualiza las credenciales de Neo4j en `src/neo4j.js`:
```javascript
const driver = neo4j.driver(
  "bolt://localhost:7687", 
  neo4j.auth.basic("neo4j", "TU_CONTRASEÑA"),
  { encrypted: "ENCRYPTION_OFF" }
);
```

### Paso 3: Ejecutar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🎨 Paleta de Colores

El diseño utiliza una paleta de colores azul y morado pastel:

- **Primarios**: 
  - Azul pastel: `#a5b4fc`, `#818cf8`
  - Morado pastel: `#c4b5fd`, `#a78bfa`
- **Acentos**: `#e9d5ff`
- **Fondos**: `#f5f7ff`, `#ffffff`
- **Textos**: `#1e1b4b`, `#4c1d95`

## 📊 Estructura de la Base de Datos

### Nodos
- **Pelicula**: titulo, year, duracion
- **Usuario**: nombre, edad, email
- **Genero**: nombre
- **Actor**: nombre, edad
- **Director**: nombre

### Relaciones
- `(Usuario)-[:VIO {rating, fecha}]->(Pelicula)`
- `(Pelicula)-[:PERTENECE_A]->(Genero)`
- `(Actor)-[:ACTUA_EN {rol}]->(Pelicula)`
- `(Director)-[:DIRIGE]->(Pelicula)`

## 🔍 Algoritmos de Recomendación

### Usuarios Similares
```cypher
MATCH (u:Usuario {nombre: $usuario})-[v1:VIO]->(p1:Pelicula)
WHERE v1.rating >= 4
MATCH (otros:Usuario)-[v2:VIO]->(p1)
WHERE otros <> u AND v2.rating >= 4
MATCH (otros)-[v3:VIO]->(recomendacion:Pelicula)
WHERE NOT (u)-[:VIO]->(recomendacion) AND v3.rating >= 4
RETURN recomendacion
ORDER BY COUNT(*) DESC, AVG(v3.rating) DESC
```

### Mismos Géneros
Recomienda películas de los géneros que más le gustan al usuario basándose en sus calificaciones históricas.

### Mejor Calificadas
Muestra las películas con mejor rating promedio que el usuario aún no ha visto.

## 🤝 Contribuciones

Este es un proyecto educativo. Siéntete libre de hacer fork y experimentar con nuevas funcionalidades.

## 📝 Notas

- La aplicación no requiere login por simplicidad
- Los datos de ejemplo incluyen 6 películas y 4 usuarios
- Puedes expandir la base de datos agregando más películas, actores y directores en el archivo `.cql`

## 📄 Licencia

Proyecto educativo - Libre uso para aprendizaje
