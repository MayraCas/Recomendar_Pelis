// src/components/CalificarPelicula.jsx
import React, { useState } from 'react';
import { runQuery } from '../neo4j';
import BuscadorPeliculas from './BuscadorPeliculas'; // <--- Importamos

const CalificarPelicula = () => {
  const [usuario, setUsuario] = useState('Juan');
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(''); // Estado para la selección
  const [rating, setRating] = useState(5);

  const handleCalificar = async (e) => {
    e.preventDefault();

    if (!peliculaSeleccionada) {
      alert("Por favor selecciona una película del buscador");
      return;
    }
    
    const cypher = `
      MATCH (u:Usuario {nombre: $usuario})
      MATCH (p:Pelicula {titulo: $pelicula})
      MERGE (u)-[r:VIO]->(p)
      SET r.rating = $rating, r.fecha = date()
      RETURN u.nombre, p.titulo, r.rating
    `;

    try {
      await runQuery(cypher, { 
        usuario, 
        pelicula: peliculaSeleccionada, 
        rating: parseInt(rating) 
      });
      alert(`¡Guardado! ${usuario} calificó ${peliculaSeleccionada} con ${rating} estrellas.`);
    } catch (error) {
      console.error(error);
      alert("Error guardando el rating.");
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>⭐ Calificar Película</h3>
      
      {/* 1. Selección de Usuario (Simple) */}
      <div style={{ marginBottom: '10px' }}>
        <label>Usuario: </label>
        <input value={usuario} onChange={e => setUsuario(e.target.value)} />
      </div>

      {/* 2. Búsqueda de Película (Componente nuevo) */}
      <BuscadorPeliculas onSeleccionar={(titulo) => setPeliculaSeleccionada(titulo)} />
      
      {peliculaSeleccionada && (
        <p style={{color: 'green'}}>Película seleccionada: <strong>{peliculaSeleccionada}</strong></p>
      )}

      {/* 3. Rating */}
      <div style={{ marginBottom: '10px' }}>
        <label>Rating (1-5): </label>
        <input 
          type="number" min="1" max="5" 
          value={rating} onChange={e => setRating(e.target.value)} 
        />
      </div>

      <button onClick={handleCalificar} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Enviar Calificación
      </button>
    </div>
  );
};

export default CalificarPelicula;