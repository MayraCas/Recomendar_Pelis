// src/components/HistorialUsuario.jsx
import React, { useState, useEffect } from 'react';
import { runQuery } from '../neo4j';
import './HistorialUsuario.css';

const HistorialUsuario = ({ usuario }) => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      setCargando(true);
      try {
        const cypher = `
          MATCH (u:Usuario {nombre: $usuario})-[v:VIO]->(p:Pelicula)
          OPTIONAL MATCH (p)-[:PERTENECE_A]->(g:Genero)
          WITH p, v, COLLECT(DISTINCT g.nombre) as generos
          RETURN p.titulo as titulo,
                 p.year as year,
                 p.duracion as duracion,
                 v.rating as rating,
                 v.fecha as fecha,
                 generos
          ORDER BY v.fecha DESC
        `;

        const records = await runQuery(cypher, { usuario });
        const historialData = records.map(record => {
          const yearValue = record.get('year');
          const duracionValue = record.get('duracion');
          const ratingValue = record.get('rating');
          
          return {
            titulo: record.get('titulo'),
            year: typeof yearValue === 'object' && yearValue.toNumber ? yearValue.toNumber() : yearValue,
            duracion: typeof duracionValue === 'object' && duracionValue.toNumber ? duracionValue.toNumber() : duracionValue,
            rating: typeof ratingValue === 'object' && ratingValue.toNumber ? ratingValue.toNumber() : ratingValue,
            fecha: record.get('fecha'),
            generos: record.get('generos')
          };
        });

        setHistorial(historialData);
      } catch (error) {
        console.error("Error cargando historial:", error);
      }
      setCargando(false);
    };

    if (usuario) {
      cargarHistorial();
    }
  }, [usuario]);

  const renderEstrellas = (rating) => {
    return (
      <div className="estrellas-historial">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'estrella-llena' : 'estrella-vacia'}>
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    // Neo4j devuelve los valores como objetos Integer, convertimos a números
    const year = typeof fecha.year === 'object' ? fecha.year.toNumber() : fecha.year;
    const month = typeof fecha.month === 'object' ? fecha.month.toNumber() : fecha.month;
    const day = typeof fecha.day === 'object' ? fecha.day.toNumber() : fecha.day;
    
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (cargando) {
    return <div className="loading">Cargando historial...</div>;
  }

  return (
    <div className="historial-container">
      <h3>📜 Mis Películas Vistas</h3>
      
      {historial.length === 0 ? (
        <div className="no-historial">
          <p>😔 Aún no has calificado ninguna película</p>
          <p className="sugerencia">¡Comienza a calificar para obtener recomendaciones personalizadas!</p>
        </div>
      ) : (
        <>
          <p className="total-vistas">Total: {historial.length} {historial.length === 1 ? 'película vista' : 'películas vistas'}</p>
          <div className="historial-lista">
            {historial.map((pelicula, index) => (
              <div key={index} className="historial-item">
                <div className="historial-header">
                  <div className="historial-titulo">
                    <h4>{pelicula.titulo}</h4>
                    <span className="year-tag">{pelicula.year}</span>
                  </div>
                  {renderEstrellas(pelicula.rating)}
                </div>
                
                <div className="historial-info">
                  {pelicula.generos.length > 0 && (
                    <div className="generos-mini">
                      {pelicula.generos.map((genero, i) => (
                        <span key={i} className="genero-mini">{genero}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="fecha-duracion">
                    {pelicula.fecha && (
                      <span className="fecha-vista">📅 {formatearFecha(pelicula.fecha)}</span>
                    )}
                    <span className="duracion-mini">⏱️ {pelicula.duracion} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HistorialUsuario;
