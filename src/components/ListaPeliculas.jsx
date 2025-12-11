// src/components/ListaPeliculas.jsx
import React, { useEffect, useState } from 'react';
import { runQuery } from '../neo4j';
import './ListaPeliculas.css';

const ListaPeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchPeliculas = async () => {
      setCargando(true);
      // Obtenemos películas con sus géneros y rating promedio
      const cypher = `
        MATCH (p:Pelicula)
        OPTIONAL MATCH (p)-[:PERTENECE_A]->(g:Genero)
        OPTIONAL MATCH (u:Usuario)-[v:VIO]->(p)
        WITH p, 
             COLLECT(DISTINCT g.nombre) as generos,
             AVG(v.rating) as rating_promedio,
             COUNT(v) as total_ratings
        RETURN p.titulo AS titulo, 
               p.year AS year, 
               p.duracion AS duracion,
               generos,
               rating_promedio,
               total_ratings
        ORDER BY p.titulo ASC
      `;
      
      try {
        const records = await runQuery(cypher);
        
        const data = records.map(record => {
          const yearValue = record.get('year');
          const duracionValue = record.get('duracion');
          const totalRatingsValue = record.get('total_ratings');
          
          return {
            titulo: record.get('titulo'),
            year: typeof yearValue === 'object' && yearValue.toNumber ? yearValue.toNumber() : yearValue,
            duracion: typeof duracionValue === 'object' && duracionValue.toNumber ? duracionValue.toNumber() : duracionValue,
            generos: record.get('generos'),
            ratingPromedio: record.get('rating_promedio'),
            totalRatings: typeof totalRatingsValue === 'object' && totalRatingsValue.toNumber ? totalRatingsValue.toNumber() : totalRatingsValue
          };
        });
        
        setPeliculas(data);
      } catch (error) {
        console.error("Error cargando películas:", error);
      }
      setCargando(false);
    };

    fetchPeliculas();
  }, []);

  const renderEstrellas = (rating) => {
    if (!rating) return <span className="sin-rating">Sin calificaciones</span>;
    const estrellas = Math.round(rating);
    return (
      <div className="estrellas">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < estrellas ? 'estrella-llena' : 'estrella-vacia'}>
            ⭐
          </span>
        ))}
        <span className="rating-numero">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (cargando) {
    return <div className="loading">Cargando películas...</div>;
  }

  return (
    <div className="lista-peliculas-container">
      <h2>🎥 Catálogo de Películas</h2>
      <div className="peliculas-grid">
        {peliculas.map((p, index) => (
          <div key={index} className="movie-card">
            <div className="movie-card-header">
              <h3>{p.titulo}</h3>
              <span className="year-badge">{p.year}</span>
            </div>
            
            <div className="movie-info">
              {p.generos.length > 0 && (
                <div className="generos">
                  {p.generos.map((genero, i) => (
                    <span key={i} className="genero-tag">{genero}</span>
                  ))}
                </div>
              )}
              
              <p className="duracion">⏱️ {p.duracion} minutos</p>
              
              <div className="rating-section">
                {renderEstrellas(p.ratingPromedio)}
                {p.totalRatings > 0 && (
                  <p className="total-ratings">
                    ({p.totalRatings} {p.totalRatings === 1 ? 'valoración' : 'valoraciones'})
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaPeliculas;