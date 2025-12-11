// src/components/CalificarPelicula.jsx
import React, { useState } from 'react';
import { runQuery } from '../neo4j';
import BuscadorPeliculas from './BuscadorPeliculas';
import './CalificarPelicula.css';

const CalificarPelicula = ({ usuario, onCalificacionGuardada }) => {
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [mensaje, setMensaje] = useState('');

  const handleCalificar = async (e) => {
    e.preventDefault();

    if (!peliculaSeleccionada) {
      setMensaje({ tipo: 'error', texto: 'Por favor selecciona una película del buscador' });
      return;
    }
    
    if (rating === 0) {
      setMensaje({ tipo: 'error', texto: 'Por favor selecciona una calificación' });
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
      setMensaje({ 
        tipo: 'exito', 
        texto: `¡Guardado! Has calificado "${peliculaSeleccionada}" con ${rating} estrellas.` 
      });
      
      // Limpiar formulario
      setPeliculaSeleccionada('');
      setRating(0);
      
      // Notificar al componente padre si existe el callback
      if (onCalificacionGuardada) {
        onCalificacionGuardada();
      }
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Error guardando la calificación.' });
    }
  };

  const renderEstrellas = () => {
    return (
      <div className="rating-estrellas">
        {[1, 2, 3, 4, 5].map((estrella) => (
          <button
            key={estrella}
            type="button"
            className={`estrella-btn ${
              estrella <= (ratingHover || rating) ? 'estrella-activa' : ''
            }`}
            onClick={() => setRating(estrella)}
            onMouseEnter={() => setRatingHover(estrella)}
            onMouseLeave={() => setRatingHover(0)}
          >
            ⭐
          </button>
        ))}
        {rating > 0 && (
          <span className="rating-texto">{rating}/5</span>
        )}
      </div>
    );
  };

  return (
    <div className="calificar-container">
      <h3>⭐ Calificar Película</h3>
      
      <form onSubmit={handleCalificar} className="calificar-form">
        {/* Búsqueda de Película */}
        <BuscadorPeliculas 
          onSeleccionar={(titulo) => {
            setPeliculaSeleccionada(titulo);
            setMensaje('');
          }} 
        />
        
        {peliculaSeleccionada && (
          <div className="pelicula-seleccionada">
            ✓ Película: <strong>{peliculaSeleccionada}</strong>
          </div>
        )}

        {/* Rating con estrellas */}
        <div className="rating-section">
          <label>Tu calificación:</label>
          {renderEstrellas()}
        </div>

        <button type="submit" className="btn-calificar">
          💾 Guardar Calificación
        </button>

        {mensaje && (
          <div className={`mensaje mensaje-${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}
      </form>
    </div>
  );
};

export default CalificarPelicula;