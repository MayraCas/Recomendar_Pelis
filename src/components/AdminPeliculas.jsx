// src/components/AdminPeliculas.jsx
import React, { useState, useEffect } from 'react';
import { runQuery } from '../neo4j';
import './AdminPeliculas.css';

const AdminPeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [peliculaEditando, setPeliculaEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');
  
  // Formulario
  const [formData, setFormData] = useState({
    titulo: '',
    year: new Date().getFullYear(),
    duracion: 90,
    generosSeleccionados: []
  });

  useEffect(() => {
    cargarPeliculas();
    cargarGeneros();
  }, []);

  const cargarPeliculas = async () => {
    try {
      const cypher = `
        MATCH (p:Pelicula)
        OPTIONAL MATCH (p)-[:PERTENECE_A]->(g:Genero)
        WITH p, COLLECT(DISTINCT g.nombre) as generos
        RETURN p.titulo as titulo, 
               p.year as year, 
               p.duracion as duracion,
               generos
        ORDER BY p.titulo ASC
      `;
      const records = await runQuery(cypher);
      const data = records.map(record => {
        const yearValue = record.get('year');
        const duracionValue = record.get('duracion');
        
        return {
          titulo: record.get('titulo'),
          year: typeof yearValue === 'object' && yearValue.toNumber ? yearValue.toNumber() : yearValue,
          duracion: typeof duracionValue === 'object' && duracionValue.toNumber ? duracionValue.toNumber() : duracionValue,
          generos: record.get('generos')
        };
      });
      setPeliculas(data);
    } catch (error) {
      console.error("Error cargando películas:", error);
    }
  };

  const cargarGeneros = async () => {
    try {
      const cypher = `MATCH (g:Genero) RETURN g.nombre as nombre ORDER BY g.nombre`;
      const records = await runQuery(cypher);
      const data = records.map(record => record.get('nombre'));
      setGeneros(data);
    } catch (error) {
      console.error("Error cargando géneros:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      setMensaje({ tipo: 'error', texto: 'El título es requerido' });
      return;
    }

    try {
      if (modoEdicion) {
        // Actualizar película existente
        await actualizarPelicula();
      } else {
        // Crear nueva película
        await crearPelicula();
      }
      
      limpiarFormulario();
      cargarPeliculas();
    } catch (error) {
      console.error("Error guardando película:", error);
      setMensaje({ tipo: 'error', texto: 'Error al guardar la película' });
    }
  };

  const crearPelicula = async () => {
    // Crear película
    const cypherCrear = `
      CREATE (p:Pelicula {
        titulo: $titulo,
        year: $year,
        duracion: $duracion
      })
      RETURN p.titulo as titulo
    `;
    
    await runQuery(cypherCrear, {
      titulo: formData.titulo,
      year: parseInt(formData.year),
      duracion: parseInt(formData.duracion)
    });

    // Asociar géneros
    if (formData.generosSeleccionados.length > 0) {
      for (const genero of formData.generosSeleccionados) {
        const cypherGenero = `
          MATCH (p:Pelicula {titulo: $titulo})
          MATCH (g:Genero {nombre: $genero})
          MERGE (p)-[:PERTENECE_A]->(g)
        `;
        await runQuery(cypherGenero, { titulo: formData.titulo, genero });
      }
    }

    setMensaje({ tipo: 'exito', texto: `Película "${formData.titulo}" creada exitosamente` });
  };

  const actualizarPelicula = async () => {
    // Actualizar propiedades
    const cypherActualizar = `
      MATCH (p:Pelicula {titulo: $tituloOriginal})
      SET p.titulo = $titulo,
          p.year = $year,
          p.duracion = $duracion
      RETURN p.titulo as titulo
    `;
    
    await runQuery(cypherActualizar, {
      tituloOriginal: peliculaEditando.titulo,
      titulo: formData.titulo,
      year: parseInt(formData.year),
      duracion: parseInt(formData.duracion)
    });

    // Eliminar géneros anteriores y agregar los nuevos
    const cypherEliminarGeneros = `
      MATCH (p:Pelicula {titulo: $titulo})-[r:PERTENECE_A]->()
      DELETE r
    `;
    await runQuery(cypherEliminarGeneros, { titulo: formData.titulo });

    // Agregar géneros seleccionados
    if (formData.generosSeleccionados.length > 0) {
      for (const genero of formData.generosSeleccionados) {
        const cypherGenero = `
          MATCH (p:Pelicula {titulo: $titulo})
          MATCH (g:Genero {nombre: $genero})
          MERGE (p)-[:PERTENECE_A]->(g)
        `;
        await runQuery(cypherGenero, { titulo: formData.titulo, genero });
      }
    }

    setMensaje({ tipo: 'exito', texto: `Película "${formData.titulo}" actualizada exitosamente` });
  };

  const editarPelicula = (pelicula) => {
    setModoEdicion(true);
    setPeliculaEditando(pelicula);
    setFormData({
      titulo: pelicula.titulo,
      year: pelicula.year,
      duracion: pelicula.duracion,
      generosSeleccionados: pelicula.generos
    });
    setMensaje('');
  };

  const eliminarPelicula = async (titulo) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${titulo}"?`)) {
      return;
    }

    try {
      const cypher = `
        MATCH (p:Pelicula {titulo: $titulo})
        DETACH DELETE p
      `;
      await runQuery(cypher, { titulo });
      setMensaje({ tipo: 'exito', texto: `Película "${titulo}" eliminada` });
      cargarPeliculas();
    } catch (error) {
      console.error("Error eliminando película:", error);
      setMensaje({ tipo: 'error', texto: 'Error al eliminar la película' });
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      titulo: '',
      year: new Date().getFullYear(),
      duracion: 90,
      generosSeleccionados: []
    });
    setModoEdicion(false);
    setPeliculaEditando(null);
    setMensaje('');
  };

  const toggleGenero = (genero) => {
    setFormData(prev => ({
      ...prev,
      generosSeleccionados: prev.generosSeleccionados.includes(genero)
        ? prev.generosSeleccionados.filter(g => g !== genero)
        : [...prev.generosSeleccionados, genero]
    }));
  };

  return (
    <div className="admin-container">
      <h2>🛠️ Administración de Películas</h2>

      {/* Formulario */}
      <div className="admin-form-section">
        <h3>{modoEdicion ? '✏️ Editar Película' : '➕ Nueva Película'}</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Nombre de la película"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Año</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                min="1900"
                max="2100"
              />
            </div>

            <div className="form-group">
              <label>Duración (min)</label>
              <input
                type="number"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                min="1"
                max="500"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Géneros</label>
            <div className="generos-checkbox">
              {generos.map(genero => (
                <label key={genero} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.generosSeleccionados.includes(genero)}
                    onChange={() => toggleGenero(genero)}
                  />
                  {genero}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {modoEdicion ? '💾 Actualizar' : '➕ Crear'}
            </button>
            {modoEdicion && (
              <button type="button" onClick={limpiarFormulario} className="btn-secondary">
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>

        {mensaje && (
          <div className={`mensaje-admin mensaje-${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}
      </div>

      {/* Lista de películas */}
      <div className="admin-list-section">
        <h3>📋 Lista de Películas ({peliculas.length})</h3>
        <div className="peliculas-table">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Año</th>
                <th>Duración</th>
                <th>Géneros</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {peliculas.map((pelicula, index) => (
                <tr key={index}>
                  <td><strong>{pelicula.titulo}</strong></td>
                  <td>{pelicula.year}</td>
                  <td>{pelicula.duracion} min</td>
                  <td>
                    <div className="generos-list">
                      {pelicula.generos.map((g, i) => (
                        <span key={i} className="genero-badge">{g}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="acciones">
                      <button 
                        onClick={() => editarPelicula(pelicula)}
                        className="btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => eliminarPelicula(pelicula.titulo)}
                        className="btn-delete"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPeliculas;
