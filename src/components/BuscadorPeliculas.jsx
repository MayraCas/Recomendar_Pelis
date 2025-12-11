// src/components/BuscadorPeliculas.jsx
import React, { useState, useEffect } from 'react';
import { runQuery } from '../neo4j';
import './BuscadorPeliculas.css';

const BuscadorPeliculas = ({ onSeleccionar }) => {
  const [termino, setTermino] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    // Evitamos buscar si hay menos de 2 letras
    if (termino.length < 2) {
      setSugerencias([]);
      return;
    }

    // Definimos la función de búsqueda
    const buscar = async () => {
      setCargando(true);
      // Usamos toLower() para ignorar mayúsculas/minúsculas
      // Buscamos títulos que CONTENGAN el término
      const cypher = `
        MATCH (p:Pelicula)
        WHERE toLower(p.titulo) CONTAINS toLower($search)
        OPTIONAL MATCH (p)-[:PERTENECE_A]->(g:Genero)
        WITH p, COLLECT(DISTINCT g.nombre) as generos
        RETURN p.titulo as titulo, p.year as year, p.duracion as duracion, generos
        LIMIT 5
      `;

      try {
        const records = await runQuery(cypher, { search: termino });
        const resultados = records.map(record => {
          const yearValue = record.get('year');
          const duracionValue = record.get('duracion');
          
          return {
            titulo: record.get('titulo'),
            year: typeof yearValue === 'object' && yearValue.toNumber ? yearValue.toNumber() : yearValue,
            duracion: typeof duracionValue === 'object' && duracionValue.toNumber ? duracionValue.toNumber() : duracionValue,
            generos: record.get('generos')
          };
        });
        setSugerencias(resultados);
      } catch (error) {
        console.error("Error buscando:", error);
      }
      setCargando(false);
    };

    // Un pequeño "debounce" manual: esperamos 300ms antes de buscar
    // para no saturar la base de datos mientras escribes.
    const timeoutId = setTimeout(() => {
      buscar();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [termino]);

  const manejarSeleccion = (pelicula) => {
    setTermino(pelicula.titulo); // Ponemos el nombre completo en el input
    setSugerencias([]); // Ocultamos la lista
    onSeleccionar(pelicula.titulo); // Avisamos al padre
  };

  return (
    <div className="buscador-container">
      <label htmlFor="search-input" className="buscador-label">
        🔍 Buscar Película:
      </label>
      <input
        id="search-input"
        type="text"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        placeholder="Escribe para buscar (ej. Matrix, Toy...)"
        className="buscador-input"
      />
      
      {/* Lista de sugerencias flotante */}
      {sugerencias.length > 0 && (
        <ul className="sugerencias-lista">
          {sugerencias.map((p, idx) => (
            <li 
              key={idx} 
              onClick={() => manejarSeleccion(p)}
              className="sugerencia-item"
            >
              <div className="sugerencia-content">
                <div className="sugerencia-title">
                  <strong>{p.titulo}</strong>
                  <span className="sugerencia-year">{p.year}</span>
                </div>
                <div className="sugerencia-details">
                  <span className="duracion-badge">⏱️ {p.duracion} min</span>
                  {p.generos.length > 0 && (
                    <span className="genero-badge">{p.generos[0]}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cargando && <small className="buscador-loading">Buscando...</small>}
    </div>
  );
};

export default BuscadorPeliculas;