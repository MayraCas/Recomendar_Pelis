// src/components/BuscadorPeliculas.jsx
import React, { useState, useEffect } from 'react';
import { runQuery } from '../neo4j';

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
        RETURN p.titulo as titulo, p.año as anio
        LIMIT 5
      `;

      try {
        const records = await runQuery(cypher, { search: termino });
        const resultados = records.map(record => ({
          titulo: record.get('titulo'),
          anio: record.get('anio').toNumber()
        }));
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
    <div style={{ position: 'relative', marginBottom: '15px' }}>
      <label>Buscar Película:</label>
      <input
        type="text"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        placeholder="Escribe para buscar (ej. Toy...)"
        style={{ width: '100%', padding: '8px' }}
      />
      
      {/* Lista de sugerencias flotante */}
      {sugerencias.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          border: '1px solid #ccc',
          background: '#fff',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          zIndex: 1000
        }}>
          {sugerencias.map((p, idx) => (
            <li 
              key={idx} 
              onClick={() => manejarSeleccion(p)}
              style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
            >
              <strong>{p.titulo}</strong> ({p.anio})
            </li>
          ))}
        </ul>
      )}
      {cargando && <small>Buscando...</small>}
    </div>
  );
};

export default BuscadorPeliculas;