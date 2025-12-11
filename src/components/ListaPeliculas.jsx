// src/components/ListaPeliculas.jsx
import React, { useEffect, useState } from 'react';
import { runQuery } from '../neo4j';

const ListaPeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    const fetchPeliculas = async () => {
      // Usamos tu estructura: p.titulo, p.año, p.duracion
      const cypher = `
        MATCH (p:Pelicula) 
        RETURN p.titulo AS titulo, p.año AS year, p.duracion AS duracion 
        ORDER BY p.titulo ASC
      `;
      
      const records = await runQuery(cypher);
      
      const data = records.map(record => ({
        titulo: record.get('titulo'),
        // Neo4j devuelve enteros como objetos, convertimos a número JS:
        year: record.get('year').toNumber(), 
        duracion: record.get('duracion').toNumber()
      }));
      
      setPeliculas(data);
    };

    fetchPeliculas();
  }, []);

  return (
    <div>
      <h2>🎥 Cartelera</h2>
      <ul>
        {peliculas.map((p, index) => (
          <li key={index}>
            <strong>{p.titulo}</strong> ({p.year}) - {p.duracion} min
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaPeliculas;