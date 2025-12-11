// ---------------------------------------------------------
// 1. LIMPIEZA INICIAL Y RESTRICCIONES (SCHEMA)
// ---------------------------------------------------------

// Limpiar base de datos completa
MATCH (n) DETACH DELETE n;

// Crear Restricciones de Unicidad (Esto crea índices automáticamente y evita duplicados lógicos)
CREATE CONSTRAINT pelicula_titulo_unique IF NOT EXISTS FOR (p:Pelicula) REQUIRE p.titulo IS UNIQUE;
CREATE CONSTRAINT usuario_email_unique IF NOT EXISTS FOR (u:Usuario) REQUIRE u.email IS UNIQUE;
// Nota: Para nombres de actores/directores a veces permitimos homónimos, 
// pero para este ejemplo asumimos unicidad para facilitar la carga.
CREATE INDEX actor_nombre_index IF NOT EXISTS FOR (a:Actor) ON (a.nombre);

// ---------------------------------------------------------
// 2. CREACIÓN DE NODOS (USANDO MERGE)
// ---------------------------------------------------------

// Crear Géneros
MERGE (:Genero {nombre: 'Acción'});
MERGE (:Genero {nombre: 'Comedia'});
MERGE (:Genero {nombre: 'Drama'});
MERGE (:Genero {nombre: 'Ciencia Ficción'});
MERGE (:Genero {nombre: 'Terror'});

// Crear Películas
MERGE (:Pelicula {titulo: 'Matrix', year: 1999, duracion: 136});
MERGE (:Pelicula {titulo: 'Inception', year: 2010, duracion: 148});
MERGE (:Pelicula {titulo: 'Forrest Gump', year: 1994, duracion: 142});
MERGE (:Pelicula {titulo: 'El Padrino', year: 1972, duracion: 175});
MERGE (:Pelicula {titulo: 'Interestelar', year: 2014, duracion: 169});
MERGE (:Pelicula {titulo: 'Toy Story', year: 1995, duracion: 81});

// Crear Actores
MERGE (:Actor {nombre: 'Keanu Reeves', edad: 59});
MERGE (:Actor {nombre: 'Leonardo DiCaprio', edad: 49});
MERGE (:Actor {nombre: 'Tom Hanks', edad: 67});
MERGE (:Actor {nombre: 'Marlon Brando', edad: 80});
MERGE (:Actor {nombre: 'Matthew McConaughey', edad: 54});

// Crear Directores
MERGE (:Director {nombre: 'Lana Wachowski'});
MERGE (:Director {nombre: 'Christopher Nolan'});
MERGE (:Director {nombre: 'Robert Zemeckis'});
MERGE (:Director {nombre: 'Francis Ford Coppola'});
MERGE (:Director {nombre: 'John Lasseter'});

// Crear Usuarios
MERGE (:Usuario {nombre: 'Juan', edad: 25, email: 'juan@email.com'});
MERGE (:Usuario {nombre: 'María', edad: 30, email: 'maria@email.com'});
MERGE (:Usuario {nombre: 'Pedro', edad: 22, email: 'pedro@email.com'});
MERGE (:Usuario {nombre: 'Ana', edad: 28, email: 'ana@email.com'});

// ---------------------------------------------------------
// 3. CREACIÓN DE RELACIONES
// ---------------------------------------------------------

// Relacionar Películas con Géneros
MATCH (p:Pelicula {titulo: 'Matrix'}), (g:Genero {nombre: 'Ciencia Ficción'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Matrix'}), (g:Genero {nombre: 'Acción'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Inception'}), (g:Genero {nombre: 'Ciencia Ficción'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Forrest Gump'}), (g:Genero {nombre: 'Drama'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'El Padrino'}), (g:Genero {nombre: 'Drama'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Interestelar'}), (g:Genero {nombre: 'Ciencia Ficción'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Toy Story'}), (g:Genero {nombre: 'Comedia'}) MERGE (p)-[:PERTENECE_A]->(g);

// Relacionar Actores con Películas
MATCH (a:Actor {nombre: 'Keanu Reeves'}), (p:Pelicula {titulo: 'Matrix'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Neo'}]->(p);

MATCH (a:Actor {nombre: 'Leonardo DiCaprio'}), (p:Pelicula {titulo: 'Inception'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Dom Cobb'}]->(p);

MATCH (a:Actor {nombre: 'Tom Hanks'}), (p:Pelicula {titulo: 'Forrest Gump'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Forrest Gump'}]->(p);

MATCH (a:Actor {nombre: 'Tom Hanks'}), (p:Pelicula {titulo: 'Toy Story'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Woody (voz)'}]->(p);

MATCH (a:Actor {nombre: 'Marlon Brando'}), (p:Pelicula {titulo: 'El Padrino'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Don Vito Corleone'}]->(p);

MATCH (a:Actor {nombre: 'Matthew McConaughey'}), (p:Pelicula {titulo: 'Interestelar'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Cooper'}]->(p);

// Relacionar Directores con Películas
MATCH (d:Director {nombre: 'Lana Wachowski'}), (p:Pelicula {titulo: 'Matrix'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'Christopher Nolan'}), (p:Pelicula {titulo: 'Inception'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'Christopher Nolan'}), (p:Pelicula {titulo: 'Interestelar'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'Robert Zemeckis'}), (p:Pelicula {titulo: 'Forrest Gump'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'Francis Ford Coppola'}), (p:Pelicula {titulo: 'El Padrino'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'John Lasseter'}), (p:Pelicula {titulo: 'Toy Story'}) MERGE (d)-[:DIRIGE]->(p);

// Crear relaciones de usuarios viendo películas (con ratings)
// Usamos MERGE para evitar duplicar el "VIO" si corres el script dos veces
MATCH (u:Usuario {nombre: 'Juan'}), (p:Pelicula {titulo: 'Matrix'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-01-15')}]->(p);

MATCH (u:Usuario {nombre: 'Juan'}), (p:Pelicula {titulo: 'Inception'}) 
MERGE (u)-[:VIO {rating: 4, fecha: date('2024-02-10')}]->(p);

MATCH (u:Usuario {nombre: 'Juan'}), (p:Pelicula {titulo: 'Interestelar'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-03-05')}]->(p);

MATCH (u:Usuario {nombre: 'María'}), (p:Pelicula {titulo: 'Forrest Gump'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-01-20')}]->(p);

MATCH (u:Usuario {nombre: 'María'}), (p:Pelicula {titulo: 'El Padrino'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-02-15')}]->(p);

MATCH (u:Usuario {nombre: 'María'}), (p:Pelicula {titulo: 'Inception'}) 
MERGE (u)-[:VIO {rating: 3, fecha: date('2024-03-01')}]->(p);

MATCH (u:Usuario {nombre: 'Pedro'}), (p:Pelicula {titulo: 'Matrix'}) 
MERGE (u)-[:VIO {rating: 4, fecha: date('2024-01-10')}]->(p);

MATCH (u:Usuario {nombre: 'Pedro'}), (p:Pelicula {titulo: 'Toy Story'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-02-20')}]->(p);

MATCH (u:Usuario {nombre: 'Ana'}), (p:Pelicula {titulo: 'Interestelar'}) 
MERGE (u)-[:VIO {rating: 4, fecha: date('2024-01-25')}]->(p);

MATCH (u:Usuario {nombre: 'Ana'}), (p:Pelicula {titulo: 'Inception'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-02-28')}]->(p);


// ---------------------------------------------------------
// 4. CONSULTAS DE PRUEBA (QUERIES)
// ---------------------------------------------------------

// Ver toda la estructura (Muestra 50 nodos)
MATCH (n) RETURN n LIMIT 50;

// Buscar películas de un género específico
MATCH (p:Pelicula)-[:PERTENECE_A]->(g:Genero {nombre: 'Ciencia Ficción'})
RETURN p.titulo, p.year;

// Ver qué vio un usuario y sus ratings ordenado
MATCH (u:Usuario {nombre: 'Juan'})-[v:VIO]->(p:Pelicula)
RETURN p.titulo, v.rating, v.fecha
ORDER BY v.rating DESC;

// --- SISTEMA DE RECOMENDACIÓN MEJORADO ---
// Lógica: "Usuarios parecidos a Juan (que vieron lo mismo y les gustó)
// también vieron estas otras películas con buena calificación"
MATCH (u:Usuario {nombre: 'Juan'})-[v1:VIO]->(p1:Pelicula)
MATCH (otros:Usuario)-[v2:VIO]->(p1)
WHERE otros <> u AND v2.rating >= 4  // Solo usuarios que también les gustó la película
MATCH (otros)-[v3:VIO]->(recomendacion:Pelicula)
WHERE NOT (u)-[:VIO]->(recomendacion) AND v3.rating >= 4 // Recomendar solo cosas buenas
RETURN DISTINCT recomendacion.titulo, 
       COUNT(*) as coincidencias, 
       AVG(v3.rating) as rating_promedio_proyectado
ORDER BY coincidencias DESC, rating_promedio_proyectado DESC
LIMIT 5;

// Películas del mismo director
MATCH (d:Director)-[:DIRIGE]->(p:Pelicula {titulo: 'Inception'})
MATCH (d)-[:DIRIGE]->(otras:Pelicula)
WHERE otras <> p
RETURN otras.titulo;

// Actores que trabajan frecuentemente juntos
MATCH (a1:Actor)-[:ACTUA_EN]->(p:Pelicula)<-[:ACTUA_EN]-(a2:Actor)
WHERE a1.nombre < a2.nombre // Evita duplicados tipo A-B y B-A
RETURN a1.nombre, a2.nombre, COUNT(p) as peliculas_juntos
ORDER BY peliculas_juntos DESC;

// Top películas mejor calificadas
MATCH (u:Usuario)-[v:VIO]->(p:Pelicula)
RETURN p.titulo, AVG(v.rating) as rating_promedio, COUNT(v) as vistas
ORDER BY rating_promedio DESC, vistas DESC;
