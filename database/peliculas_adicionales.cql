// ---------------------------------------------------------
// DATOS ADICIONALES PARA EXPANDIR LA BASE DE DATOS
// ---------------------------------------------------------
// Puedes ejecutar este archivo después del moviesNeo4j.cql principal
// para agregar más películas, usuarios y contenido al sistema

// ---------------------------------------------------------
// NUEVAS PELÍCULAS
// ---------------------------------------------------------

MERGE (:Pelicula {titulo: 'El Señor de los Anillos: La Comunidad del Anillo', year: 2001, duracion: 178});
MERGE (:Pelicula {titulo: 'Pulp Fiction', year: 1994, duracion: 154});
MERGE (:Pelicula {titulo: 'El Rey León', year: 1994, duracion: 88});
MERGE (:Pelicula {titulo: 'Gladiador', year: 2000, duracion: 155});
MERGE (:Pelicula {titulo: 'Avatar', year: 2009, duracion: 162});
MERGE (:Pelicula {titulo: 'Titanic', year: 1997, duracion: 195});
MERGE (:Pelicula {titulo: 'El Caballero de la Noche', year: 2008, duracion: 152});
MERGE (:Pelicula {titulo: 'Buscando a Nemo', year: 2003, duracion: 100});
MERGE (:Pelicula {titulo: 'Shrek', year: 2001, duracion: 90});
MERGE (:Pelicula {titulo: 'Spider-Man: No Way Home', year: 2021, duracion: 148});

// ---------------------------------------------------------
// NUEVOS GÉNEROS
// ---------------------------------------------------------

MERGE (:Genero {nombre: 'Aventura'});
MERGE (:Genero {nombre: 'Fantasía'});
MERGE (:Genero {nombre: 'Romance'});
MERGE (:Genero {nombre: 'Animación'});
MERGE (:Genero {nombre: 'Superhéroes'});

// ---------------------------------------------------------
// NUEVOS ACTORES
// ---------------------------------------------------------

MERGE (:Actor {nombre: 'Elijah Wood', edad: 42});
MERGE (:Actor {nombre: 'John Travolta', edad: 70});
MERGE (:Actor {nombre: 'Russell Crowe', edad: 59});
MERGE (:Actor {nombre: 'Sam Worthington', edad: 47});
MERGE (:Actor {nombre: 'Kate Winslet', edad: 48});
MERGE (:Actor {nombre: 'Christian Bale', edad: 49});
MERGE (:Actor {nombre: 'Heath Ledger', edad: 28});
MERGE (:Actor {nombre: 'Tom Holland', edad: 27});

// ---------------------------------------------------------
// NUEVOS DIRECTORES
// ---------------------------------------------------------

MERGE (:Director {nombre: 'Peter Jackson'});
MERGE (:Director {nombre: 'Quentin Tarantino'});
MERGE (:Director {nombre: 'Ridley Scott'});
MERGE (:Director {nombre: 'James Cameron'});
MERGE (:Director {nombre: 'Andrew Stanton'});
MERGE (:Director {nombre: 'Jon Watts'});

// ---------------------------------------------------------
// RELACIONES PELÍCULAS - GÉNEROS
// ---------------------------------------------------------

MATCH (p:Pelicula {titulo: 'El Señor de los Anillos: La Comunidad del Anillo'}), (g:Genero {nombre: 'Fantasía'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'El Señor de los Anillos: La Comunidad del Anillo'}), (g:Genero {nombre: 'Aventura'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Pulp Fiction'}), (g:Genero {nombre: 'Drama'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Pulp Fiction'}), (g:Genero {nombre: 'Acción'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'El Rey León'}), (g:Genero {nombre: 'Animación'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'El Rey León'}), (g:Genero {nombre: 'Drama'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Gladiador'}), (g:Genero {nombre: 'Acción'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Gladiador'}), (g:Genero {nombre: 'Drama'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Avatar'}), (g:Genero {nombre: 'Ciencia Ficción'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Avatar'}), (g:Genero {nombre: 'Aventura'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Titanic'}), (g:Genero {nombre: 'Romance'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Titanic'}), (g:Genero {nombre: 'Drama'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'El Caballero de la Noche'}), (g:Genero {nombre: 'Acción'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'El Caballero de la Noche'}), (g:Genero {nombre: 'Superhéroes'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Buscando a Nemo'}), (g:Genero {nombre: 'Animación'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Buscando a Nemo'}), (g:Genero {nombre: 'Aventura'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Shrek'}), (g:Genero {nombre: 'Animación'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Shrek'}), (g:Genero {nombre: 'Comedia'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Spider-Man: No Way Home'}), (g:Genero {nombre: 'Acción'}) MERGE (p)-[:PERTENECE_A]->(g);
MATCH (p:Pelicula {titulo: 'Spider-Man: No Way Home'}), (g:Genero {nombre: 'Superhéroes'}) MERGE (p)-[:PERTENECE_A]->(g);

// ---------------------------------------------------------
// RELACIONES ACTORES - PELÍCULAS
// ---------------------------------------------------------

MATCH (a:Actor {nombre: 'Elijah Wood'}), (p:Pelicula {titulo: 'El Señor de los Anillos: La Comunidad del Anillo'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Frodo Baggins'}]->(p);

MATCH (a:Actor {nombre: 'John Travolta'}), (p:Pelicula {titulo: 'Pulp Fiction'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Vincent Vega'}]->(p);

MATCH (a:Actor {nombre: 'Russell Crowe'}), (p:Pelicula {titulo: 'Gladiador'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Maximus'}]->(p);

MATCH (a:Actor {nombre: 'Sam Worthington'}), (p:Pelicula {titulo: 'Avatar'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Jake Sully'}]->(p);

MATCH (a:Actor {nombre: 'Leonardo DiCaprio'}), (p:Pelicula {titulo: 'Titanic'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Jack Dawson'}]->(p);

MATCH (a:Actor {nombre: 'Kate Winslet'}), (p:Pelicula {titulo: 'Titanic'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Rose DeWitt Bukater'}]->(p);

MATCH (a:Actor {nombre: 'Christian Bale'}), (p:Pelicula {titulo: 'El Caballero de la Noche'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Batman / Bruce Wayne'}]->(p);

MATCH (a:Actor {nombre: 'Heath Ledger'}), (p:Pelicula {titulo: 'El Caballero de la Noche'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Joker'}]->(p);

MATCH (a:Actor {nombre: 'Tom Holland'}), (p:Pelicula {titulo: 'Spider-Man: No Way Home'}) 
MERGE (a)-[:ACTUA_EN {rol: 'Peter Parker / Spider-Man'}]->(p);

// ---------------------------------------------------------
// RELACIONES DIRECTORES - PELÍCULAS
// ---------------------------------------------------------

MATCH (d:Director {nombre: 'Peter Jackson'}), (p:Pelicula {titulo: 'El Señor de los Anillos: La Comunidad del Anillo'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'Quentin Tarantino'}), (p:Pelicula {titulo: 'Pulp Fiction'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'Ridley Scott'}), (p:Pelicula {titulo: 'Gladiador'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'James Cameron'}), (p:Pelicula {titulo: 'Avatar'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'James Cameron'}), (p:Pelicula {titulo: 'Titanic'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'Christopher Nolan'}), (p:Pelicula {titulo: 'El Caballero de la Noche'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'Andrew Stanton'}), (p:Pelicula {titulo: 'Buscando a Nemo'}) MERGE (d)-[:DIRIGE]->(p);
MATCH (d:Director {nombre: 'Jon Watts'}), (p:Pelicula {titulo: 'Spider-Man: No Way Home'}) MERGE (d)-[:DIRIGE]->(p);

// ---------------------------------------------------------
// NUEVAS CALIFICACIONES DE USUARIOS
// ---------------------------------------------------------

// Juan ve más películas
MATCH (u:Usuario {nombre: 'Juan'}), (p:Pelicula {titulo: 'El Señor de los Anillos: La Comunidad del Anillo'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-04-01')}]->(p);

MATCH (u:Usuario {nombre: 'Juan'}), (p:Pelicula {titulo: 'Avatar'}) 
MERGE (u)-[:VIO {rating: 4, fecha: date('2024-04-15')}]->(p);

MATCH (u:Usuario {nombre: 'Juan'}), (p:Pelicula {titulo: 'El Caballero de la Noche'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-05-01')}]->(p);

// María ve más películas
MATCH (u:Usuario {nombre: 'María'}), (p:Pelicula {titulo: 'Titanic'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-03-10')}]->(p);

MATCH (u:Usuario {nombre: 'María'}), (p:Pelicula {titulo: 'El Rey León'}) 
MERGE (u)-[:VIO {rating: 4, fecha: date('2024-03-20')}]->(p);

MATCH (u:Usuario {nombre: 'María'}), (p:Pelicula {titulo: 'Gladiador'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-04-05')}]->(p);

// Pedro ve más películas
MATCH (u:Usuario {nombre: 'Pedro'}), (p:Pelicula {titulo: 'Spider-Man: No Way Home'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-02-25')}]->(p);

MATCH (u:Usuario {nombre: 'Pedro'}), (p:Pelicula {titulo: 'Shrek'}) 
MERGE (u)-[:VIO {rating: 4, fecha: date('2024-03-05')}]->(p);

MATCH (u:Usuario {nombre: 'Pedro'}), (p:Pelicula {titulo: 'Buscando a Nemo'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-03-15')}]->(p);

MATCH (u:Usuario {nombre: 'Pedro'}), (p:Pelicula {titulo: 'Avatar'}) 
MERGE (u)-[:VIO {rating: 4, fecha: date('2024-04-10')}]->(p);

// Ana ve más películas
MATCH (u:Usuario {nombre: 'Ana'}), (p:Pelicula {titulo: 'Pulp Fiction'}) 
MERGE (u)-[:VIO {rating: 4, fecha: date('2024-03-12')}]->(p);

MATCH (u:Usuario {nombre: 'Ana'}), (p:Pelicula {titulo: 'El Señor de los Anillos: La Comunidad del Anillo'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-03-25')}]->(p);

MATCH (u:Usuario {nombre: 'Ana'}), (p:Pelicula {titulo: 'El Caballero de la Noche'}) 
MERGE (u)-[:VIO {rating: 5, fecha: date('2024-04-08')}]->(p);

// ---------------------------------------------------------
// CONSULTAS DE VERIFICACIÓN
// ---------------------------------------------------------

// Contar total de películas
MATCH (p:Pelicula) RETURN COUNT(p) as total_peliculas;

// Contar total de calificaciones
MATCH ()-[v:VIO]->() RETURN COUNT(v) as total_calificaciones;

// Ver películas más populares
MATCH (u:Usuario)-[v:VIO]->(p:Pelicula)
RETURN p.titulo, AVG(v.rating) as rating_promedio, COUNT(v) as total_ratings
ORDER BY total_ratings DESC, rating_promedio DESC
LIMIT 10;

// Ver películas sin calificación
MATCH (p:Pelicula)
WHERE NOT (p)<-[:VIO]-()
RETURN p.titulo, p.year
ORDER BY p.year DESC;
