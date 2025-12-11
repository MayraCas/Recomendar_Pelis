# 🚀 Guía Rápida de Uso - CineMatch

## Pasos para ejecutar el proyecto

### 1️⃣ Configurar Neo4j
```bash
# Asegúrate de tener Neo4j corriendo en localhost:7687
# Usuario: neo4j
# Contraseña: kacCHAN7$7 (o la que hayas configurado)
```

### 2️⃣ Cargar datos iniciales
1. Abre Neo4j Browser (http://localhost:7474)
2. Copia y pega el contenido de `database/moviesNeo4j.cql`
3. Ejecuta el script completo

### 3️⃣ Instalar dependencias
```bash
npm install
```

### 4️⃣ Ejecutar la aplicación
```bash
npm run dev
```

### 5️⃣ Abrir en el navegador
```
http://localhost:5173
```

## 🎯 Cómo usar la aplicación

### Seleccionar Usuario
1. En la parte superior verás el selector de usuario
2. Elige entre: Juan, María, Pedro o Ana
3. Las recomendaciones y el historial se actualizarán automáticamente

### Ver Recomendaciones
- **👥 Usuarios similares**: Películas que les gustaron a usuarios con gustos parecidos
- **🎭 Mismos géneros**: Películas de géneros que te gustan
- **🏆 Mejor calificadas**: Top películas que aún no has visto

### Calificar Películas
1. Busca una película escribiendo su nombre
2. Selecciona de la lista de sugerencias
3. Haz clic en las estrellas para dar tu calificación (1-5)
4. Presiona "Guardar Calificación"
5. Las recomendaciones se actualizarán automáticamente

### Ver Historial
- Revisa todas las películas que has calificado
- Ordenadas por fecha (más recientes primero)
- Muestra tu calificación, géneros y fecha de visualización

### Explorar Catálogo
- Todas las películas disponibles en el sistema
- Información de rating promedio y cantidad de valoraciones
- Géneros y duración de cada película

## 💡 Tips

- **Califica más películas**: Mientras más películas califiques, mejores serán las recomendaciones
- **Explora diferentes usuarios**: Cada usuario tiene un perfil de gustos diferente
- **Prueba los filtros**: Cambia entre los diferentes tipos de recomendaciones
- **Busca rápido**: El buscador funciona con solo escribir 2 letras

## 🎨 Características Visuales

- ⭐ Calificación con estrellas interactivas (hover y click)
- 🎨 Diseño en tonos azul y morado pastel
- 📱 Responsive (funciona en móvil y desktop)
- ✨ Animaciones suaves y transiciones
- 🎯 Cards con hover effects

## 🔧 Solución de Problemas

### La aplicación no se conecta a Neo4j
- Verifica que Neo4j esté corriendo
- Revisa las credenciales en `src/neo4j.js`
- Asegúrate de que el puerto sea 7687

### No aparecen películas
- Ejecuta el script `moviesNeo4j.cql` en Neo4j Browser
- Verifica en Neo4j Browser con: `MATCH (n) RETURN n LIMIT 25`

### Error de CORS o conexión
- Asegúrate de usar `bolt://` (no `neo4j://`)
- Verifica que `encrypted` esté en `"ENCRYPTION_OFF"`

## 📊 Consultas útiles de Neo4j

### Ver todas las películas
```cypher
MATCH (p:Pelicula) RETURN p
```

### Ver calificaciones de un usuario
```cypher
MATCH (u:Usuario {nombre: 'Juan'})-[v:VIO]->(p:Pelicula)
RETURN p.titulo, v.rating, v.fecha
ORDER BY v.fecha DESC
```

### Agregar una nueva película
```cypher
CREATE (p:Pelicula {titulo: 'Nueva Película', year: 2024, duracion: 120})
```

### Calificar una película (simulado)
```cypher
MATCH (u:Usuario {nombre: 'Juan'})
MATCH (p:Pelicula {titulo: 'Matrix'})
MERGE (u)-[v:VIO]->(p)
SET v.rating = 5, v.fecha = date()
```

## 🎓 Próximas mejoras sugeridas

- Agregar más películas a la base de datos
- Implementar filtros por género en el catálogo
- Añadir información de actores y directores
- Sistema de búsqueda por actor o director
- Estadísticas del usuario (géneros favoritos, promedio de calificaciones)
- Comparación entre usuarios
- Exportar/importar calificaciones

¡Disfruta explorando CineMatch! 🍿🎬
