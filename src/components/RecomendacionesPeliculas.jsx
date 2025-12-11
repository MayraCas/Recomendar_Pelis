// src/components/RecomendacionesPeliculas.jsx
import React, { useState, useEffect } from 'react';
import { runQuery } from '../neo4j';
import './RecomendacionesPeliculas.css';

const RecomendacionesPeliculas = ({ usuario }) => {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [tipoRecomendacion, setTipoRecomendacion] = useState('usuarios-similares');

  useEffect(() => {
    const cargarRecomendaciones = async () => {
      setCargando(true);
      try {
        let cypher = '';
        
        if (tipoRecomendacion === 'usuarios-similares') {
          // Recomendación basada en usuarios con gustos similares
          cypher = `
            MATCH (u:Usuario {nombre: $usuario})-[v1:VIO]->(p1:Pelicula)
            WHERE v1.rating >= 4
            MATCH (otros:Usuario)-[v2:VIO]->(p1)
            WHERE otros <> u AND v2.rating >= 4
            MATCH (otros)-[v3:VIO]->(recomendacion:Pelicula)
            WHERE v3.rating >= 4
            WITH u, recomendacion, COUNT(DISTINCT otros) as coincidencias, AVG(v3.rating) as rating_promedio
            WHERE NOT EXISTS((u)-[:VIO]->(recomendacion))
            MATCH (recomendacion)-[:PERTENECE_A]->(g:Genero)
            RETURN DISTINCT recomendacion.titulo as titulo, 
                   recomendacion.year as year,
                   recomendacion.duracion as duracion,
                   coincidencias,
                   rating_promedio,
                   COLLECT(DISTINCT g.nombre) as generos
            ORDER BY coincidencias DESC, rating_promedio DESC
            LIMIT 6
          `;
        } else if (tipoRecomendacion === 'mismo-genero') {
          // Recomendación basada en géneros que le gustan al usuario
          cypher = `
            MATCH (u:Usuario {nombre: $usuario})-[v:VIO]->(p:Pelicula)-[:PERTENECE_A]->(g:Genero)
            WHERE v.rating >= 4
            WITH u, g, COUNT(*) as veces_visto
            ORDER BY veces_visto DESC
            LIMIT 2
            MATCH (g)<-[:PERTENECE_A]-(recomendacion:Pelicula)
            WHERE NOT EXISTS((u)-[:VIO]->(recomendacion))
            OPTIONAL MATCH (otros:Usuario)-[v2:VIO]->(recomendacion)
            WITH recomendacion, AVG(v2.rating) as rating_promedio, COUNT(v2) as total_ratings
            MATCH (recomendacion)-[:PERTENECE_A]->(genero:Genero)
            RETURN DISTINCT recomendacion.titulo as titulo,
                   recomendacion.year as year,
                   recomendacion.duracion as duracion,
                   rating_promedio,
                   total_ratings,
                   COLLECT(DISTINCT genero.nombre) as generos
            ORDER BY rating_promedio DESC, total_ratings DESC
            LIMIT 6
          `;
        } else if (tipoRecomendacion === 'top-rated') {
          // Películas mejor calificadas que el usuario no ha visto
          cypher = `
            MATCH (u:Usuario {nombre: $usuario})
            MATCH (p:Pelicula)
            WHERE NOT EXISTS((u)-[:VIO]->(p))
            OPTIONAL MATCH (otros:Usuario)-[v:VIO]->(p)
            WHERE v.rating >= 4
            WITH p, AVG(v.rating) as rating_promedio, COUNT(v) as total_ratings
            WHERE total_ratings >= 2
            MATCH (p)-[:PERTENECE_A]->(g:Genero)
            RETURN p.titulo as titulo,
                   p.year as year,
                   p.duracion as duracion,
                   rating_promedio,
                   total_ratings,
                   COLLECT(DISTINCT g.nombre) as generos
            ORDER BY rating_promedio DESC, total_ratings DESC
            LIMIT 6
          `;
        }

        const records = await runQuery(cypher, { usuario });
        const recData = records.map(record => {
          const yearValue = record.get('year');
          const duracionValue = record.get('duracion');
          const coincidenciasValue = record.has('coincidencias') ? record.get('coincidencias') : null;
          const totalRatingsValue = record.has('total_ratings') ? record.get('total_ratings') : null;
          
          return {
            titulo: record.get('titulo'),
            year: typeof yearValue === 'object' && yearValue.toNumber ? yearValue.toNumber() : yearValue,
            duracion: typeof duracionValue === 'object' && duracionValue.toNumber ? duracionValue.toNumber() : duracionValue,
            generos: record.get('generos'),
            coincidencias: coincidenciasValue && typeof coincidenciasValue === 'object' && coincidenciasValue.toNumber ? coincidenciasValue.toNumber() : coincidenciasValue,
            ratingPromedio: record.has('rating_promedio') && record.get('rating_promedio') 
              ? record.get('rating_promedio') 
              : null,
            totalRatings: totalRatingsValue && typeof totalRatingsValue === 'object' && totalRatingsValue.toNumber ? totalRatingsValue.toNumber() : totalRatingsValue || 0
          };
        });
        
        setRecomendaciones(recData);
      } catch (error) {
        console.error("Error cargando recomendaciones:", error);
        setRecomendaciones([]);
      }
      setCargando(false);
    };

    if (usuario) {
      cargarRecomendaciones();
    }
  }, [usuario, tipoRecomendacion]);

  const renderEstrellas = (rating) => {
    if (!rating) return null;
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

  return (
    <div className="recomendaciones-container">
      <div className="recomendaciones-header">
        <h2>🎬 Recomendaciones para {usuario}</h2>
        
        <div className="filtros-recomendacion">
          <button
            className={tipoRecomendacion === 'usuarios-similares' ? 'filtro-activo' : 'filtro'}
            onClick={() => setTipoRecomendacion('usuarios-similares')}
          >
            👥 Usuarios similares
          </button>
          <button
            className={tipoRecomendacion === 'mismo-genero' ? 'filtro-activo' : 'filtro'}
            onClick={() => setTipoRecomendacion('mismo-genero')}
          >
            🎭 Mismos géneros
          </button>
          <button
            className={tipoRecomendacion === 'top-rated' ? 'filtro-activo' : 'filtro'}
            onClick={() => setTipoRecomendacion('top-rated')}
          >
            🏆 Mejor calificadas
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="loading">Cargando recomendaciones...</div>
      ) : recomendaciones.length === 0 ? (
        <div className="no-recomendaciones">
          <p>😔 No hay recomendaciones disponibles.</p>
          <p className="sugerencia">¡Califica más películas para obtener mejores recomendaciones!</p>
        </div>
      ) : (
        <div className="recomendaciones-grid">
          {recomendaciones.map((pelicula, index) => (
            <div key={index} className="pelicula-card">
              <div className="pelicula-card-header">
                <h3>{pelicula.titulo}</h3>
                <span className="year-badge">{pelicula.year}</span>
              </div>
              
              <div className="pelicula-info">
                <div className="generos">
                  {pelicula.generos.map((genero, i) => (
                    <span key={i} className="genero-tag">{genero}</span>
                  ))}
                </div>
                
                <p className="duracion">⏱️ {pelicula.duracion} min</p>
                
                {pelicula.ratingPromedio && renderEstrellas(pelicula.ratingPromedio)}
                
                {pelicula.coincidencias && (
                  <p className="match-info">
                    💡 {pelicula.coincidencias} {pelicula.coincidencias === 1 ? 'usuario similar' : 'usuarios similares'}
                  </p>
                )}
                
                {pelicula.totalRatings > 0 && (
                  <p className="total-ratings">
                    📊 {pelicula.totalRatings} {pelicula.totalRatings === 1 ? 'valoración' : 'valoraciones'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecomendacionesPeliculas;
